---
layout: default
permalink: /notes/
title: notes
nav: true
nav_order: 3
---

<div class="notes-page">
  <p class="notes-intro">A collection of notes on things I've learned that I thought might be helpful for others! These are intended to be more informal/ less polished than blog posts but are hopefully still useful and informative.</p>

{% if site.notes.size > 0 %}

  <div class="notes-tree">
    {% comment %} Group notes by their directory path {% endcomment %}
    {% assign notes_by_dir = site.notes | group_by_exp: "note", "note.path | split: '/' | pop | join: '/'" %}
    {% assign sorted_dirs = notes_by_dir | sort: "name" %}

    {% for dir_group in sorted_dirs %}
      {% assign dir_path = dir_group.name | remove: "_notes" | remove_first: "/" %}
      {% assign path_parts = dir_path | split: "/" %}
      {% assign depth = path_parts.size %}
      {% assign dir_name = path_parts | last %}

      {% if dir_path != "" %}
        {% comment %} Calculate nesting level based on path depth {% endcomment %}
        {% assign depth_minus_one = depth | minus: 1 %}
        {% assign indent_px = depth_minus_one | times: 24 %}

        <div class="notes-folder depth-{{ depth }}" style="margin-left: {{ indent_px }}px;">
          <div class="folder-header" onclick="this.parentElement.classList.toggle('collapsed')">
            <i class="fa-solid fa-chevron-down folder-toggle"></i>
            <i class="fa-solid fa-folder"></i>
            <span class="folder-name">{{ dir_name }}</span>
          </div>
          <div class="folder-contents">
            {% for note in dir_group.items %}
              {% unless note.title == "README" or note.name == "README.md" %}
                {% assign read_time = note.content | number_of_words | divided_by: 180 | plus: 1 %}
                <div class="tree-item">
                  <span class="tree-branch"></span>
                  <div class="note-card">
                    <div class="note-title-section">
                      {% if note.image %}
                        <img src="{{ note.image | relative_url }}" alt="icon" class="note-icon">
                      {% elsif note.emoji %}
                        <span class="note-emoji">{{ note.emoji }}</span>
                      {% else %}
                        <i class="fa-solid fa-file-lines note-file-icon"></i>
                      {% endif %}
                      <a href="{{ note.url }}" class="note-title">{{ note.title }}</a>
                    </div>
                    <div class="note-separator"></div>
                    <div class="note-details">
                      <p class="note-description">{{ note.description }}</p>
                      <div class="note-meta">
                        <span class="note-read-time">{{ read_time }} min read</span>
                        <span class="note-kudos" data-note-id="{{ note.url | slugify }}">
                          <i class="fa-solid fa-hands-clapping"></i>
                          <span class="kudos-count">0</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              {% endunless %}
            {% endfor %}
          </div>
        </div>
      {% else %}
        {% comment %} Root level notes {% endcomment %}
        {% for note in dir_group.items %}
          {% unless note.title == "README" or note.name == "README.md" %}
            {% assign read_time = note.content | number_of_words | divided_by: 180 | plus: 1 %}
            <div class="tree-item root-item">
              <div class="note-card">
                <div class="note-title-section">
                  {% if note.image %}
                    <img src="{{ note.image | relative_url }}" alt="icon" class="note-icon">
                  {% elsif note.emoji %}
                    <span class="note-emoji">{{ note.emoji }}</span>
                  {% else %}
                    <i class="fa-solid fa-file-lines note-file-icon"></i>
                  {% endif %}
                  <a href="{{ note.url }}" class="note-title">{{ note.title }}</a>
                </div>
                <div class="note-separator"></div>
                <div class="note-details">
                  <p class="note-description">{{ note.description }}</p>
                  <div class="note-meta">
                    <span class="note-read-time">{{ read_time }} min read</span>
                    <span class="note-kudos" data-note-id="{{ note.url | slugify }}">
                      <i class="fa-solid fa-hands-clapping"></i>
                      <span class="kudos-count">0</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          {% endunless %}
        {% endfor %}
      {% endif %}
    {% endfor %}

  </div>
  {% else %}
  <p><em>No notes yet.</em></p>
  {% endif %}
</div>

<script type="module">
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
  import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

  const firebaseConfig = {
    apiKey: "AIzaSyCFVn3tg50WMlZEfMlOoPwfIW7zJTrHUS0",
    authDomain: "personal-website-b8d26.firebaseapp.com",
    databaseURL: "https://personal-website-b8d26-default-rtdb.firebaseio.com",
    projectId: "personal-website-b8d26",
    storageBucket: "personal-website-b8d26.firebasestorage.app",
    messagingSenderId: "1018011428128",
    appId: "1:1018011428128:web:a285f736e98770a283a345"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  // Load kudos counts from Firebase for all note cards
  document.querySelectorAll('.note-kudos').forEach(async (el) => {
    const noteId = el.dataset.noteId;
    const snapshot = await get(ref(db, 'kudos/' + noteId));
    const count = snapshot.exists() ? snapshot.val() : 0;
    el.querySelector('.kudos-count').textContent = count;
  });
</script>
