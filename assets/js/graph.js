document.addEventListener("DOMContentLoaded", function () {
  var panel = document.getElementById("graph-panel");
  if (!panel) return;

  var POSITIONS_KEY = "graph-node-positions";
  var ZOOM_KEY = "graph-zoom-transform";
  var PANEL_TOP_KEY = "graph-panel-top";
  var graph = null;

  // Persist graph state across same-site navigations
  function saveState() {
    if (graph) graph.saveState();
  }
  window.addEventListener("beforeunload", saveState);
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[href]");
    if (link && link.origin === window.location.origin) saveState();
  });

  // Position graph panel below navbar + terminal
  var lastPanelTop = -1;
  function updatePanelTop() {
    var navbar = document.getElementById("navbar");
    var terminal = document.getElementById("terminal");
    var top = (navbar ? navbar.offsetHeight : 0) + (terminal ? terminal.offsetHeight : 0);
    if (top === lastPanelTop) return;
    lastPanelTop = top;
    document.documentElement.style.setProperty("--graph-panel-top", top + "px");
    sessionStorage.setItem(PANEL_TOP_KEY, top + "px");
    panel.classList.add("positioned");
  }
  updatePanelTop();
  var terminalEl = document.getElementById("terminal");
  if (terminalEl && typeof ResizeObserver !== "undefined") {
    new ResizeObserver(updatePanelTop).observe(terminalEl);
  }

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    updatePanelTop();
    if (!graph) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(graph.resize, 150);
  });

  // Init after layout settles
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      var baseUrl = document.querySelector('meta[name="baseurl"]');
      var prefix = baseUrl ? baseUrl.getAttribute("content") : "";
      d3.json(prefix + "/assets/json/graph-data.json")
        .then(function (data) {
          if (data && data.nodes && data.links) graph = renderGraph(data);
        })
        .catch(function () {});
    });
  });

  function readSession(key) {
    try {
      var value = sessionStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      return null;
    }
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // Strip LaTeX math delimiters and inline code ticks so titles like
  // "The $21^*$ Proteinogenic Amino Acids" render as "The 21* Proteinogenic
  // Amino Acids" on nodes and tooltips.
  function cleanTitle(title) {
    if (!title) return title;
    return title
      .replace(/\$([^$]+)\$/g, function (_, inner) {
        return inner.replace(/[\^_{}\\]/g, "");
      })
      .replace(/`([^`]+)`/g, "$1");
  }

  function buildAdjacency(nodes, links) {
    var adjacency = new Map();
    nodes.forEach(function (n) {
      adjacency.set(n.id, new Set());
    });
    links.forEach(function (l) {
      adjacency.get(l.source).add(l.target);
      adjacency.get(l.target).add(l.source);
    });
    return adjacency;
  }

  function renderGraph(data) {
    var FOOTER_HEIGHT = 50;
    var NODE_PADDING = 14;
    var MAX_HOPS = 2;

    var container = document.getElementById("graph-body");
    var svgEl = document.getElementById("knowledge-graph");
    var svg = d3.select(svgEl);
    var currentPath = window.location.pathname;

    // The SVG spans the viewport on desktop (so nodes aren't clipped at the
    // panel edge) and the panel on mobile; the graph lives in the panel's
    // rightmost slice either way.
    var view;
    function measure() {
      var width = svgEl.clientWidth;
      var height = container.clientHeight;
      var panelWidth = container.clientWidth;
      view = {
        width: width,
        height: height,
        panelWidth: panelWidth,
        panelLeft: width - panelWidth,
        centerX: width - panelWidth / 2,
        centerY: height / 2,
      };
      svg.attr("viewBox", [0, 0, width, height]);
    }
    measure();

    // h2/h3 sub-nodes orbit their parent page and are only shown on that page
    var nodes = data.nodes.filter(function (n) {
      return n.type === "h2" || n.type === "h3" ? n.parent === currentPath : true;
    });
    var ids = new Set(
      nodes.map(function (n) {
        return n.id;
      })
    );
    var links = data.links.filter(function (l) {
      return ids.has(l.source) && ids.has(l.target);
    });

    // On a page with its own node, show only its MAX_HOPS neighborhood
    var currentNode = nodes.find(function (n) {
      return n.url === currentPath;
    });
    if (currentNode) {
      var adjacencyAll = buildAdjacency(nodes, links);
      var keep = new Set([currentNode.id]);
      var frontier = [currentNode.id];
      for (var hop = 0; hop < MAX_HOPS; hop++) {
        var next = [];
        frontier.forEach(function (id) {
          adjacencyAll.get(id).forEach(function (neighbor) {
            if (!keep.has(neighbor)) {
              keep.add(neighbor);
              next.push(neighbor);
            }
          });
        });
        frontier = next;
      }
      nodes = nodes.filter(function (n) {
        return keep.has(n.id);
      });
      links = links.filter(function (l) {
        return keep.has(l.source) && keep.has(l.target);
      });
    }
    var adjacency = buildAdjacency(nodes, links);
    var nodeById = new Map(
      nodes.map(function (n) {
        return [n.id, n];
      })
    );

    // Current page gets a big halo; h2/h3 sub-nodes are small satellites
    function radius(d) {
      if (d === currentNode) return 14;
      if (d.type === "h2") return 5;
      if (d.type === "h3") return 3;
      if (d.type === "note") return 8;
      return 12;
    }

    // Initial positions: continue from the previous page's layout when
    // possible, otherwise spread nodes in a circle around the center.
    var savedPositions = readSession(POSITIONS_KEY) || {};
    var restored = false;
    nodes.forEach(function (n) {
      var saved = savedPositions[n.id];
      if (saved) {
        n.x = saved.x;
        n.y = saved.y;
        restored = true;
      }
    });
    if (restored) {
      // Nodes new to this page start beside a positioned neighbor instead of
      // flying in from the simulation origin
      nodes.forEach(function (n) {
        if (n.x !== undefined) return;
        var anchor = null;
        adjacency.get(n.id).forEach(function (id) {
          var neighbor = nodeById.get(id);
          if (!anchor && neighbor.x !== undefined) anchor = neighbor;
        });
        anchor = anchor || { x: view.centerX, y: view.centerY };
        n.x = anchor.x + (Math.random() - 0.5) * 40;
        n.y = anchor.y + (Math.random() - 0.5) * 40;
      });
    } else {
      var angleStep = (2 * Math.PI) / nodes.length;
      var spread = Math.max(200, nodes.length * 60);
      nodes.forEach(function (n, i) {
        n.x = view.centerX + spread * Math.cos(angleStep * i);
        n.y = view.centerY + spread * Math.sin(angleStep * i);
      });
      if (currentNode) {
        currentNode.x = view.centerX;
        currentNode.y = view.centerY;
      }
    }

    // Zoom only tracks the transform; nodes are positioned in screen space so
    // they can be clamped to the panel bounds.
    var transform = d3.zoomIdentity;
    function screenX(d) {
      return clamp(transform.applyX(d.x), view.panelLeft + NODE_PADDING, view.width - NODE_PADDING);
    }
    function screenY(d) {
      return clamp(transform.applyY(d.y), NODE_PADDING, view.height - FOOTER_HEIGHT - NODE_PADDING);
    }

    var g = svg.append("g");

    // Background rect within the panel for capturing zoom/pan events
    var zoomRect = g.append("rect").attr("class", "zoom-rect").attr("fill", "transparent");
    function sizeZoomRect() {
      zoomRect.attr("x", view.panelLeft).attr("y", 0).attr("width", view.panelWidth).attr("height", view.height);
    }
    sizeZoomRect();

    var link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", function (d) {
        return "graph-link link-" + d.type;
      });

    var node = g
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("class", function (d) {
        return "graph-node graph-node--" + d.type + (d === currentNode ? " graph-node-current" : "");
      });

    // Labels fade in once zoomed past 0.5x
    var labelLayer = g.append("g");
    var label = labelLayer
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("class", "graph-label")
      .text(function (d) {
        return cleanTitle(d.title);
      });

    var tooltip = d3.select(container).append("div").attr("class", "graph-tooltip").style("display", "none");

    function render() {
      var scale = Math.max(transform.k, 0.5);
      function fontSize(d) {
        return radius(d) * 1.2 * scale;
      }

      link
        .attr("x1", function (d) {
          return screenX(d.source);
        })
        .attr("y1", function (d) {
          return screenY(d.source);
        })
        .attr("x2", function (d) {
          return screenX(d.target);
        })
        .attr("y2", function (d) {
          return screenY(d.target);
        })
        .attr("stroke-width", Math.max(1, transform.k));

      node
        .attr("cx", screenX)
        .attr("cy", screenY)
        .attr("r", function (d) {
          return radius(d) * scale;
        });

      label
        .attr("x", screenX)
        .attr("y", function (d) {
          return screenY(d) + radius(d) * scale + fontSize(d) + 2;
        })
        .style("font-size", function (d) {
          return fontSize(d) + "px";
        });

      var labelOpacity = clamp((transform.k - 0.5) / 0.5, 0, 1);
      labelLayer.attr("opacity", labelOpacity).attr("display", labelOpacity > 0 ? null : "none");
    }

    // Hover: highlight the node and its direct neighbors, dim everything else
    function isNear(d, n) {
      return n === d || adjacency.get(d.id).has(n.id);
    }
    function highlight(event, d) {
      tooltip.style("display", "block").text(cleanTitle(d.title));
      [node, label].forEach(function (selection) {
        selection
          .classed("is-hovered", function (n) {
            return n === d;
          })
          .classed("is-dimmed", function (n) {
            return !isNear(d, n);
          });
      });
      link
        .classed("is-active", function (l) {
          return l.source === d || l.target === d;
        })
        .classed("is-dimmed", function (l) {
          return l.source !== d && l.target !== d;
        });
    }
    function unhighlight() {
      tooltip.style("display", "none");
      node.classed("is-hovered is-dimmed", false);
      label.classed("is-hovered is-dimmed", false);
      link.classed("is-active is-dimmed", false);
    }
    function moveTooltip(event) {
      var rect = container.getBoundingClientRect();
      tooltip.style("left", event.clientX - rect.left + 10 + "px").style("top", event.clientY - rect.top - 20 + "px");
    }
    function navigate(event, d) {
      window.location.href = d.url;
    }
    [node, label].forEach(function (selection) {
      selection.on("mouseover", highlight).on("mousemove", moveTooltip).on("mouseout", unhighlight).on("click", navigate);
    });

    // Physics, tuned after Obsidian's graph view (link distance 198, link
    // strength 0.44, center strength 0.48 in its units). The current page is
    // pulled strongly to the center so its neighbors orbit around it.
    function centering(d) {
      return d === currentNode ? 0.8 : 0.12;
    }
    var simulation = d3
      .forceSimulation(nodes)
      .stop()
      .force(
        "link",
        d3
          .forceLink(links)
          .id(function (d) {
            return d.id;
          })
          .distance(function (l) {
            return l.type === "section" ? 110 : 230;
          })
          .strength(0.44)
      )
      .force("charge", d3.forceManyBody().strength(-60))
      .force("x", d3.forceX(view.centerX).strength(centering))
      .force("y", d3.forceY(view.centerY).strength(centering))
      .force(
        "collide",
        d3.forceCollide(function (d) {
          return d.type === "h2" ? 10 : d.type === "h3" ? 8 : 18;
        })
      )
      .on("tick", render);

    // Fit all nodes in the panel, centered on the current page's node (or on
    // the bounding box when the page has no node).
    function fitGraph(duration) {
      if (!nodes.length) return;
      var cx, cy;
      if (currentNode) {
        cx = currentNode.x;
        cy = currentNode.y;
      } else {
        var xExtent = d3.extent(nodes, function (d) {
          return d.x;
        });
        var yExtent = d3.extent(nodes, function (d) {
          return d.y;
        });
        cx = (xExtent[0] + xExtent[1]) / 2;
        cy = (yExtent[0] + yExtent[1]) / 2;
      }

      var maxDx = 1;
      var maxDy = 1;
      nodes.forEach(function (d) {
        maxDx = Math.max(maxDx, Math.abs(d.x - cx));
        maxDy = Math.max(maxDy, Math.abs(d.y - cy));
      });

      var padding = 30;
      var scale = clamp(Math.min((view.panelWidth / 2 - padding) / maxDx, (view.height / 2 - padding) / maxDy), 0.3, 0.35);
      var target = d3.zoomIdentity.translate(view.centerX - cx * scale, view.centerY - cy * scale).scale(scale);
      if (duration) {
        g.transition().duration(duration).ease(d3.easeCubicInOut).call(zoom.transform, target);
      } else {
        g.call(zoom.transform, target);
      }
    }

    // Snap back to the fitted view after 3s without interaction
    var resetTimer = null;
    function scheduleReset() {
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        fitGraph(800);
      }, 3000);
    }

    var zoom = d3
      .zoom()
      .scaleExtent([0.3, 6])
      .on("zoom", function (event) {
        transform = event.transform;
        render();
        if (event.sourceEvent) scheduleReset();
      });
    g.call(zoom);

    // Drag in screen space, converting back to simulation coordinates so the
    // node follows the cursor at any zoom level
    node.call(
      d3
        .drag()
        .subject(function (event, d) {
          return { x: transform.applyX(d.x), y: transform.applyY(d.y) };
        })
        .on("start", function (event, d) {
          clearTimeout(resetTimer);
          // Set alpha directly: with the slow decay, alphaTarget alone would
          // leave alpha under alphaMin and the simulation would stop at once
          if (!event.active) simulation.alphaTarget(0.1).alpha(0.1).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", function (event, d) {
          d.fx = transform.invertX(event.x);
          d.fy = transform.invertY(event.y);
        })
        .on("end", function (event, d) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
          scheduleReset();
        })
    );

    if (restored) {
      // Show the previous page's view instantly (no fade), then let new nodes
      // settle and glide over to center on this page's node
      var savedZoom = readSession(ZOOM_KEY);
      if (savedZoom) g.call(zoom.transform, d3.zoomIdentity.translate(savedZoom.x, savedZoom.y).scale(savedZoom.k));
      svgEl.style.transition = "none";
      container.classList.add("rendered");
      requestAnimationFrame(function () {
        svgEl.style.transition = "";
      });
      simulation.velocityDecay(0.7).alphaDecay(0.008).alpha(0.3).restart();
      fitGraph(800);
    } else {
      // Settle the layout up front, then switch to slow, floaty physics for
      // interaction. The simulation cools and stops on its own.
      for (var i = 0; i < 500; i++) simulation.tick();
      simulation.velocityDecay(0.7).alphaDecay(0.008);
      fitGraph(0);
      container.classList.add("rendered");
    }

    return {
      saveState: function () {
        var positions = {};
        nodes.forEach(function (n) {
          positions[n.id] = { x: n.x, y: n.y };
        });
        sessionStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
        sessionStorage.setItem(ZOOM_KEY, JSON.stringify({ k: transform.k, x: transform.x, y: transform.y }));
      },
      // Simulation coordinates are viewport-independent; only the view refits
      resize: function () {
        measure();
        sizeZoomRect();
        fitGraph(800);
      },
    };
  }
});
