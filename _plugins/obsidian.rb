require 'json'
require 'jekyll'

module Obsidian
  # Build a lookup map of all notes and posts by title (downcased) -> document
  def self.build_lookup(site)
    lookup = {}
    %w[notes posts].each do |collection_name|
      collection = site.collections[collection_name]
      next unless collection

      collection.docs.each do |doc|
        title = doc.data['title']
        next unless title

        key = title.strip.downcase
        lookup[key] = doc
        # Also index by slug (filename without date/extension)
        slug = File.basename(doc.basename, File.extname(doc.basename))
        slug = slug.sub(/^\d{4}-\d{2}-\d{2}-/, '') # strip date prefix from posts
        lookup[slug.downcase] = doc unless lookup.key?(slug.downcase)
      end
    end
    lookup
  end

  # Resolve a wikilink target string to a document
  def self.resolve_link(target, lookup)
    key = target.strip.downcase
    lookup[key]
  end

  # Extract wikilinks from content (returns array of target strings)
  def self.extract_wikilinks(content)
    # Match [[target]] and [[target|display]] but NOT ![[target]] (transclusions)
    content.scan(/(?<!!)\[\[([^\]]+)\]\]/).map do |match|
      match[0].split('|').first.strip
    end
  end

  # Extract transclusion targets from content
  def self.extract_transclusions(content)
    content.scan(/!\[\[([^\]]+)\]\]/).map do |match|
      match[0].split('#').first.strip
    end
  end

  # Slugify a heading text to match kramdown's default auto-id algorithm
  # See: kramdown/converter/html.rb `create_id`
  def self.slugify_heading(text)
    id = text.gsub(/^[^a-zA-Z]+/, '')
    id = id.tr('^a-zA-Z0-9 -', '')
    id = id.tr(' ', '-')
    id.downcase
  end

  # Extract h2 and h3 headings from markdown content.
  # Returns array of {level:, text:, slug:} hashes, with slugs deduplicated
  # (kramdown appends "-1", "-2", ... for duplicates).
  # Skips headings inside fenced code blocks and inline HTML blocks.
  def self.extract_headings(content)
    headings = []
    seen_slugs = Hash.new(0)
    in_fence = false

    content.each_line do |line|
      # Toggle fenced code blocks
      if line =~ /^```/
        in_fence = !in_fence
        next
      end
      next if in_fence

      # Match h2 and h3 markdown headings
      m = line.match(/^(\#{2,3})\s+(.+?)\s*$/)
      next unless m

      level = m[1].length
      text = m[2].strip
      # Strip trailing closing hashes (e.g., "## Heading ##")
      text = text.sub(/\s*#+\s*$/, '')
      slug = slugify_heading(text)
      next if slug.empty?

      # Deduplicate by appending a counter
      count = seen_slugs[slug]
      final_slug = count.zero? ? slug : "#{slug}-#{count}"
      seen_slugs[slug] += 1

      headings << { level: level, text: text, slug: final_slug }
    end

    headings
  end

  # ---- Generator: build graph data JSON ----
  class GraphGenerator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      return unless site.config.dig('obsidian_graph', 'enabled')

      lookup = Obsidian.build_lookup(site)
      nodes = {}
      links = []

      # Add all notes and posts as nodes
      %w[notes posts].each do |collection_name|
        collection = site.collections[collection_name]
        next unless collection

        collection.docs.each do |doc|
          title = doc.data['title']
          next unless title
          next if doc.data['title'] == 'README' || File.basename(doc.path) == 'README.md'

          node_type = collection_name == 'notes' ? 'note' : 'post'
          # Determine the folder for coloring
          parts = doc.relative_path.split('/')
          if collection_name == 'notes' && parts.size >= 3
            folder = parts[1] # first subdirectory under _notes/
          else
            folder = collection_name # "notes" (root) or "posts"
          end

          nodes[doc.url] = {
            id: doc.url,
            title: title,
            url: doc.url,
            type: node_type,
            folder: folder,
            tags: doc.data['tags'] || [],
            date: doc.data['date']&.strftime('%Y-%m-%d')
          }

          # Generate h2/h3 sub-nodes from the document's markdown content.
          # These orbit their parent page and are only shown when that page
          # is the active one (filtered client-side in graph.js).
          headings = Obsidian.extract_headings(doc.content)
          last_h2_id = nil
          headings.each do |h|
            sub_id = "#{doc.url}##{h[:slug]}"
            nodes[sub_id] = {
              id: sub_id,
              title: h[:text],
              url: sub_id,
              type: "h#{h[:level]}",
              parent: doc.url,
              folder: folder,
              tags: [],
              date: nil
            }

            if h[:level] == 2
              # h2 links to the parent page node
              links << { source: doc.url, target: sub_id, type: 'section' }
              last_h2_id = sub_id
            else
              # h3 links to the nearest preceding h2 in the same doc, or the
              # page itself if no h2 has appeared yet
              parent_id = last_h2_id || doc.url
              links << { source: parent_id, target: sub_id, type: 'section' }
            end
          end
        end
      end

      # Extract wikilink and transclusion edges
      %w[notes posts].each do |collection_name|
        collection = site.collections[collection_name]
        next unless collection

        collection.docs.each do |doc|
          next unless nodes.key?(doc.url)

          # Wikilinks
          Obsidian.extract_wikilinks(doc.content).each do |target|
            target_doc = Obsidian.resolve_link(target, lookup)
            if target_doc && nodes.key?(target_doc.url) && target_doc.url != doc.url
              links << { source: doc.url, target: target_doc.url, type: 'wikilink' }
            end
          end

          # Transclusions
          Obsidian.extract_transclusions(doc.content).each do |target|
            target_doc = Obsidian.resolve_link(target, lookup)
            if target_doc && nodes.key?(target_doc.url) && target_doc.url != doc.url
              links << { source: doc.url, target: target_doc.url, type: 'transclusion' }
            end
          end
        end
      end

      # Directory-based edges: folder README -> direct children
      notes_collection = site.collections['notes']
      if notes_collection
        # Group notes by their immediate parent directory
        dirs = {}
        notes_collection.docs.each do |doc|
          rel_path = doc.relative_path # e.g. "_notes/subfolder/note.md"
          parts = rel_path.split('/')
          next if parts.size < 3 # must be in a subdirectory (at least _notes/dir/file.md)

          dir_path = parts[0...-1].join('/') # e.g. "_notes/subfolder"
          dirs[dir_path] ||= { readme: nil, children: [] }

          if File.basename(doc.path) == 'README.md'
            dirs[dir_path][:readme] = doc
          else
            dirs[dir_path][:children] << doc
          end
        end

        dirs.each do |dir_path, info|
          readme = info[:readme]
          next unless readme

          # Add the README as a folder node
          unless nodes.key?(readme.url)
            folder_name = dir_path.split('/').last
            nodes[readme.url] = {
              id: readme.url,
              title: readme.data['title'] || folder_name,
              url: readme.url,
              type: 'folder',
              folder: folder_name,
              tags: readme.data['tags'] || [],
              date: readme.data['date']&.strftime('%Y-%m-%d')
            }
          end

          # Link README to each direct child
          info[:children].each do |child|
            next unless nodes.key?(child.url)

            links << { source: readme.url, target: child.url, type: 'folder' }
          end
        end
      end

      # Deduplicate links
      links.uniq! { |l| [l[:source], l[:target], l[:type]] }

      graph_data = { nodes: nodes.values, links: links }

      # Generate graph data as a Jekyll Page (no filesystem writes, no rebuild loop)
      page = Jekyll::PageWithoutAFile.new(site, site.source, 'assets/json', 'graph-data.json')
      page.content = JSON.pretty_generate(graph_data)
      page.data['layout'] = nil
      site.pages << page
    end
  end

  # ---- Hook: process wikilinks and transclusions in content ----
  Jekyll::Hooks.register [:documents], :pre_render do |doc, payload|
    site = doc.site
    next unless site.config.dig('obsidian_graph', 'enabled')
    next unless %w[notes posts].include?(doc.collection&.label)

    lookup = Obsidian.build_lookup(site)

    # Process transclusions first: ![[target]] or ![[target#heading]]
    doc.content = doc.content.gsub(/!\[\[([^\]]+)\]\]/) do |match|
      raw_target = Regexp.last_match(1)
      parts = raw_target.split('#', 2)
      target_title = parts[0].strip
      heading = parts[1]&.strip

      target_doc = Obsidian.resolve_link(target_title, lookup)
      if target_doc
        transcluded = target_doc.content

        if heading
          # Extract section under the specified heading
          lines = transcluded.lines
          start_idx = nil
          start_level = nil
          lines.each_with_index do |line, idx|
            if line.match(/^(#+)\s+#{Regexp.escape(heading)}\s*$/i)
              start_idx = idx + 1
              start_level = Regexp.last_match(1).length
              break
            end
          end

          if start_idx
            section_lines = []
            lines[start_idx..].each do |line|
              break if line.match(/^(\#{1,#{start_level}})\s/) && section_lines.any?

              section_lines << line
            end
            transcluded = section_lines.join
          end
        end

        # Strip frontmatter from transcluded content
        transcluded = transcluded.sub(/\A---.*?---\s*/m, '')

        "<div class=\"transclusion\" data-source=\"#{target_doc.url}\">\n\n#{transcluded}\n\n</div>"
      else
        match # leave as-is if target not found
      end
    end

    # Process wikilinks: [[target]] or [[target|display]]
    doc.content = doc.content.gsub(/(?<!!)\[\[([^\]]+)\]\]/) do |match|
      raw = Regexp.last_match(1)
      parts = raw.split('|', 2)
      target_title = parts[0].strip
      display_text = (parts[1] || target_title).strip

      target_doc = Obsidian.resolve_link(target_title, lookup)
      if target_doc
        url = target_doc.url
        "<a href=\"#{url}\" class=\"wikilink\">#{display_text}</a>"
      else
        "<span class=\"wikilink broken\">#{display_text}</span>"
      end
    end
  end
end
