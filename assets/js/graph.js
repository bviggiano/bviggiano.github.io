document.addEventListener("DOMContentLoaded", function () {
  var panel = document.getElementById("graph-panel");
  if (!panel) return;

  var POSITIONS_KEY = "graph-node-positions";
  var VIEWBOX_KEY = "graph-viewbox";
  var ZOOM_KEY = "graph-zoom-transform";
  var simulation = null;
  var currentZoomTransform = null;

  // Save graph state to sessionStorage
  var lastZoomScale = 1,
    lastPanX = 0,
    lastPanY = 0;
  function saveState() {
    if (!simulation) return;
    var positions = {};
    simulation.nodes().forEach(function (n) {
      positions[n.id] = { x: n.x, y: n.y };
    });
    sessionStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
    var svgEl = document.getElementById("knowledge-graph");
    if (svgEl) sessionStorage.setItem(VIEWBOX_KEY, svgEl.getAttribute("viewBox"));
    if (currentZoomTransform) {
      sessionStorage.setItem(
        ZOOM_KEY,
        JSON.stringify({
          k: currentZoomTransform.k,
          x: currentZoomTransform.x,
          y: currentZoomTransform.y,
        })
      );
    }
  }

  window.addEventListener("beforeunload", saveState);
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[href]");
    if (link && link.href && link.origin === window.location.origin) saveState();
  });

  // Position graph panel below navbar + terminal
  var lastPanelTop = -1;
  function updatePanelTop() {
    var terminal = document.getElementById("terminal");
    var navbar = document.getElementById("navbar");
    var top = 0;
    if (navbar) top += navbar.offsetHeight;
    if (terminal) top += terminal.offsetHeight;
    if (top !== lastPanelTop) {
      lastPanelTop = top;
      var topStr = top + "px";
      document.documentElement.style.setProperty("--graph-panel-top", topStr);
      sessionStorage.setItem("graph-panel-top", topStr);
      panel.classList.add("positioned");
    }
  }
  updatePanelTop();
  window.addEventListener("resize", updatePanelTop);
  var terminalEl = document.getElementById("terminal");
  if (terminalEl && typeof ResizeObserver !== "undefined") {
    new ResizeObserver(updatePanelTop).observe(terminalEl);
  }

  // Init after layout settles
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      initGraph();
    });
  });

  function initGraph() {
    var baseUrl = document.querySelector('meta[name="baseurl"]');
    var prefix = baseUrl ? baseUrl.getAttribute("content") : "";

    d3.json(prefix + "/assets/json/graph-data.json")
      .then(function (data) {
        if (!data || !data.nodes || !data.links) return;
        renderGraph(data);
      })
      .catch(function () {});
  }

  function renderGraph(data) {
    var container = document.getElementById("graph-body");
    var svg = d3.select("#knowledge-graph");

    // Detect mobile vs desktop layout
    var isMobile = window.innerWidth < 1200;
    var graphPanelWidth = isMobile ? container.clientWidth : 280;
    var width = isMobile ? container.clientWidth : window.innerWidth;
    var height = container.clientHeight;
    svg.attr("viewBox", [0, 0, width, height]);

    // Center of the graph area
    var centerX = isMobile ? width / 2 : width - graphPanelWidth / 2;
    var centerY = height / 2;

    var currentPath = window.location.pathname;

    // Strip h2/h3 sub-nodes that don't belong to the current page.
    // These sub-nodes orbit their parent page and are only visible when
    // we're actively viewing that page.
    data.nodes = data.nodes.filter(function (n) {
      if (n.type === "h2" || n.type === "h3") {
        return n.parent === currentPath;
      }
      return true;
    });
    var nodeIdSet = {};
    data.nodes.forEach(function (n) {
      nodeIdSet[n.id] = true;
    });
    data.links = data.links.filter(function (l) {
      var src = typeof l.source === "string" ? l.source : l.source.id;
      var tgt = typeof l.target === "string" ? l.target : l.target.id;
      return nodeIdSet[src] && nodeIdSet[tgt];
    });

    // If current page has a node, filter to only show its neighborhood
    var currentNode = data.nodes.find(function (n) {
      return n.url === currentPath || n.id === currentPath;
    });
    if (currentNode) {
      var maxHops = 2;
      var neighborIds = {};
      neighborIds[currentNode.id] = true;
      var frontier = [currentNode.id];
      for (var hop = 0; hop < maxHops; hop++) {
        var nextFrontier = [];
        data.links.forEach(function (l) {
          var src = typeof l.source === "string" ? l.source : l.source.id;
          var tgt = typeof l.target === "string" ? l.target : l.target.id;
          for (var fi = 0; fi < frontier.length; fi++) {
            if (src === frontier[fi] && !neighborIds[tgt]) {
              neighborIds[tgt] = true;
              nextFrontier.push(tgt);
            }
            if (tgt === frontier[fi] && !neighborIds[src]) {
              neighborIds[src] = true;
              nextFrontier.push(src);
            }
          }
        });
        frontier = nextFrontier;
      }
      data.nodes = data.nodes.filter(function (n) {
        return neighborIds[n.id];
      });
      data.links = data.links.filter(function (l) {
        var src = typeof l.source === "string" ? l.source : l.source.id;
        var tgt = typeof l.target === "string" ? l.target : l.target.id;
        return neighborIds[src] && neighborIds[tgt];
      });
    }

    var nodeColor = function (d) {
      if (d.type === "h2" || d.type === "h3") return "#9a9a9a";
      if (d.type === "post") return "#d97757";
      if (d.type === "folder") return "#8b8b8b";
      return "#2698ba";
    };

    // Strip LaTeX math delimiters so titles like "The $21^*$ Proteinogenic
    // Amino Acids" render as "The 21* Proteinogenic Amino Acids" on nodes
    // and tooltips.
    function cleanTitle(title) {
      if (!title) return title;
      return title
        .replace(/\$([^$]+)\$/g, function (_, inner) {
          return inner.replace(/[\^_{}\\]/g, "");
        })
        .replace(/`([^`]+)`/g, "$1");
    }

    // Unified node radius function used everywhere.
    // Current page gets a big halo; h2/h3 sub-nodes are small satellites.
    function baseRadius(d) {
      if (d.url === currentPath) return 14;
      if (d.type === "h2") return 5;
      if (d.type === "h3") return 3;
      if (d.type === "note") return 8;
      return 12;
    }

    // Restore saved positions
    var savedPositions = {};
    try {
      var stored = sessionStorage.getItem(POSITIONS_KEY);
      if (stored) savedPositions = JSON.parse(stored);
    } catch (e) {}

    var hasPositions = Object.keys(savedPositions).length > 0;

    if (hasPositions) {
      data.nodes.forEach(function (n) {
        var saved = savedPositions[n.id];
        if (saved) {
          n.x = saved.x;
          n.y = saved.y;
          n.vx = 0;
          n.vy = 0;
        }
      });
    } else {
      // Spread nodes out in a circle around the center so they don't start clustered
      var angleStep = (2 * Math.PI) / data.nodes.length;
      var radius = Math.max(200, data.nodes.length * 60);
      data.nodes.forEach(function (n, i) {
        n.x = centerX + radius * Math.cos(angleStep * i);
        n.y = centerY + radius * Math.sin(angleStep * i);
      });
    }

    // Seed the current node at the simulation center. We DON'T pin it (no
    // fx/fy) because with a strong centering force it'll naturally gravitate
    // back to center, and the other nodes will orbit around it.
    if (currentNode) {
      currentNode.x = centerX;
      currentNode.y = centerY;
    }

    var nodeById = {};
    data.nodes.forEach(function (n) {
      nodeById[n.id] = n;
    });

    var links = data.links.filter(function (l) {
      return nodeById[l.source] && nodeById[l.target];
    });

    // Graph group with a background rect for zoom event capture
    var g = svg.append("g");
    var currentZoom = 1;

    // Background rect inside g for capturing zoom/pan events
    var zoomRect = g
      .append("rect")
      .attr("class", "zoom-rect")
      .attr("x", width - graphPanelWidth)
      .attr("y", 0)
      .attr("width", graphPanelWidth)
      .attr("height", height)
      .attr("fill", "transparent");

    // Panel bounds in SVG coordinates
    var panelLeft = width - graphPanelWidth;
    var panelRight = width;
    var panelTop = 0;
    var footerHeight = 50;
    var panelBottom = height - footerHeight;
    var nodeRadius = 14;

    // Zoom only controls scale; panning is handled by translating node positions
    var zoomScale = 1;
    var panOffsetX = 0;
    var panOffsetY = 0;
    var suppressZoomHandler = false;

    var zoom = d3
      .zoom()
      .scaleExtent([0.3, 6])
      .on("zoom", function (event) {
        zoomScale = event.transform.k;
        panOffsetX = event.transform.x;
        panOffsetY = event.transform.y;
        currentZoomTransform = event.transform;
        currentZoom = zoomScale;
        if (!suppressZoomHandler) {
          ticked();
          if (label) {
            var opacity = Math.max(0, Math.min(1, (currentZoom - 0.5) / 0.5));
            label.attr("opacity", opacity).attr("display", opacity > 0 ? null : "none");
          }
        }
      });
    g.call(zoom);

    // Clamp a node's screen position to stay within panel bounds
    function clampX(screenX) {
      return Math.max(panelLeft + nodeRadius, Math.min(panelRight - nodeRadius, screenX));
    }
    function clampY(screenY) {
      return Math.max(panelTop + nodeRadius, Math.min(panelBottom - nodeRadius, screenY));
    }
    // Convert node sim position to clamped screen position
    function screenX(d) {
      return clampX(d.x * zoomScale + panOffsetX);
    }
    function screenY(d) {
      return clampY(d.y * zoomScale + panOffsetY);
    }

    // Helper to apply zoom transform programmatically
    function applyZoomTransform(transform, duration) {
      if (duration) {
        g.transition().duration(duration).ease(d3.easeCubicInOut).call(zoom.transform, transform);
      } else {
        g.call(zoom.transform, transform);
      }
    }

    // Links
    var link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", function (d) {
        var cls = "graph-link";
        if (d.type === "transclusion") cls += " link-transclusion";
        if (d.type === "folder") cls += " link-folder";
        if (d.type === "section") cls += " link-section";
        return cls;
      })
      .attr("stroke-width", 1);

    // Nodes
    var node = g
      .append("g")
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("class", function (d) {
        var cls = "graph-node";
        if (d.url === currentPath) cls += " graph-node-current";
        return cls;
      })
      .attr("r", baseRadius)
      .attr("fill", function (d) {
        return nodeColor(d);
      })
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

    // Labels (visible when zoomed in)
    var label = g
      .append("g")
      .selectAll("text")
      .data(data.nodes)
      .join("text")
      .attr("class", "graph-label")
      .text(function (d) {
        return cleanTitle(d.title);
      })
      .attr("display", "none")
      .style("cursor", "pointer");

    // Tooltip
    var tooltip = d3.select("#graph-body").append("div").attr("class", "graph-tooltip").style("display", "none");

    // Shared highlight/unhighlight for both nodes and labels
    function highlightNode(event, d) {
      tooltip.style("display", "block").text(cleanTitle(d.title));

      // Highlight the corresponding node circle
      node
        .filter(function (n) {
          return n.id === d.id;
        })
        .attr("stroke", "#b509ac")
        .attr("stroke-width", 3)
        .style("filter", "brightness(1.3)");

      // Highlight the corresponding label
      label
        .filter(function (n) {
          return n.id === d.id;
        })
        .style("fill", "#b509ac")
        .style("font-weight", "bold");

      // Dim unconnected nodes and links
      link.attr("stroke-opacity", function (l) {
        return l.source.id === d.id || l.target.id === d.id ? 1 : 0.1;
      });
      node.attr("opacity", function (n) {
        if (n.id === d.id) return 1;
        return links.some(function (l) {
          return (l.source.id === d.id && l.target.id === n.id) || (l.target.id === d.id && l.source.id === n.id);
        })
          ? 1
          : 0.2;
      });
      label.attr("opacity", function (n) {
        if (n.id === d.id) return 1;
        return links.some(function (l) {
          return (l.source.id === d.id && l.target.id === n.id) || (l.target.id === d.id && l.source.id === n.id);
        })
          ? 1
          : 0.2;
      });
    }

    function moveTooltip(event) {
      var rect = container.getBoundingClientRect();
      tooltip.style("left", event.clientX - rect.left + 10 + "px").style("top", event.clientY - rect.top - 20 + "px");
    }

    function unhighlightNode() {
      tooltip.style("display", "none");
      node
        .attr("stroke", function (d) {
          return d.url === currentPath ? "#b509ac" : null;
        })
        .attr("stroke-width", function (d) {
          return d.url === currentPath ? 2 : null;
        })
        .style("filter", null);
      label.style("fill", null).style("font-weight", null);
      link.attr("stroke-opacity", function (d) {
        if (d.type === "folder") return 0.3;
        if (d.type === "section") return 0.25;
        return 0.6;
      });
      node.attr("opacity", 1);
      label.attr("opacity", 1);
    }

    function clickNode(event, d) {
      if (d.url) window.location.href = d.url;
    }

    // Attach to nodes
    node.on("mouseover", highlightNode).on("mousemove", moveTooltip).on("mouseout", unhighlightNode).on("click", clickNode);

    // Attach to labels
    label.on("mouseover", highlightNode).on("mousemove", moveTooltip).on("mouseout", unhighlightNode).on("click", clickNode);

    // Tick handler - positions each element individually with clamping
    function ticked() {
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
        });

      node
        .attr("cx", function (d) {
          return screenX(d);
        })
        .attr("cy", function (d) {
          return screenY(d);
        })
        .attr("r", function (d) {
          return baseRadius(d) * Math.max(zoomScale, 0.5);
        });

      // Label font size is proportional to the node's radius, so h2/h3
      // sub-nodes get correspondingly smaller text
      function fontSizeFor(d) {
        return baseRadius(d) * 1.2 * Math.max(zoomScale, 0.5);
      }
      label
        .attr("x", function (d) {
          return screenX(d);
        })
        .attr("y", function (d) {
          return screenY(d) + baseRadius(d) * Math.max(zoomScale, 0.5) + fontSizeFor(d) + 2;
        })
        .style("font-size", function (d) {
          return fontSizeFor(d) + "px";
        });

      link.attr("stroke-width", Math.max(1, zoomScale));
    }

    // Resolve link references before simulation so it doesn't reassign positions
    links.forEach(function (l) {
      if (typeof l.source === "string") l.source = nodeById[l.source];
      if (typeof l.target === "string") l.target = nodeById[l.target];
    });

    // Create simulation stopped
    // Obsidian-inspired physics parameters. Obsidian uses (in its own units):
    //   link distance: 198, link strength: 0.44, repel strength: 16.4,
    //   center strength: 0.48
    // Our graph panel is narrower, so link distances are scaled down a bit.
    simulation = d3
      .forceSimulation(data.nodes)
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
          .strength(function (l) {
            return l.type === "section" ? 0.45 : 0.44;
          })
      )
      .force(
        "charge",
        // Moderate repulsion for most nodes, but the current (orange) page
        // node gets a much stronger charge so it pushes h3 satellites away
        // (h3s aren't directly linked to the post, so only the many-body
        // force keeps them from crowding the center)
        d3.forceManyBody().strength(-60)
      )
      // Centering force — the current page node gets a much stronger pull
      // toward center so it stays anchored there while its neighbors orbit
      // around it (mimicking Obsidian's behavior).
      .force(
        "x",
        d3.forceX(centerX).strength(function (d) {
          return d.url === currentPath ? 0.8 : 0.12;
        })
      )
      .force(
        "y",
        d3.forceY(centerY).strength(function (d) {
          return d.url === currentPath ? 0.8 : 0.12;
        })
      )
      .force(
        "collide",
        d3.forceCollide(function (d) {
          return d.type === "h2" ? 10 : d.type === "h3" ? 8 : 18;
        })
      )
      .on("tick", ticked);

    if (hasPositions) {
      // Re-apply saved positions (simulation init may have overwritten them)
      data.nodes.forEach(function (n) {
        var saved = savedPositions[n.id];
        if (saved) {
          n.x = saved.x;
          n.y = saved.y;
          n.vx = 0;
          n.vy = 0;
        }
      });

      // Restore saved zoom transform silently (no handler trigger)
      try {
        var storedZoom = sessionStorage.getItem(ZOOM_KEY);
        if (storedZoom) {
          var sz = JSON.parse(storedZoom);
          zoomScale = sz.k;
          panOffsetX = sz.x;
          panOffsetY = sz.y;
          currentZoom = sz.k;
        }
      } catch (e) {}

      // Sync D3 zoom state silently without triggering ticked()
      suppressZoomHandler = true;
      var syncT = d3.zoomIdentity.translate(panOffsetX, panOffsetY).scale(zoomScale);
      g.call(zoom.transform, syncT);
      suppressZoomHandler = false;

      // Render once with exact saved values, then show instantly (no fade)
      ticked();
      var svgEl = document.getElementById("knowledge-graph");
      svgEl.style.transition = "none";
      svgEl.style.opacity = "1";
      container.classList.add("rendered");
      // Re-enable transition for future use
      requestAnimationFrame(function () {
        svgEl.style.transition = "";
      });
    }

    // Zoom-to-fit: smoothly transition to show all nodes within panel.
    // If there's a current-page node, we center the view on IT rather than
    // on the bounding-box centroid, so the orange node always sits in the
    // middle of the panel (Obsidian-style).
    function fitGraph(instant) {
      if (!data.nodes.length) return;

      // Clear saved state so next page load starts fresh
      sessionStorage.removeItem(POSITIONS_KEY);
      sessionStorage.removeItem(ZOOM_KEY);
      sessionStorage.removeItem(VIEWBOX_KEY);

      // Compute the scale: we want all nodes to fit in the panel, but we
      // also want the orange node centered. Measure the farthest node from
      // the current node (or from the bounding-box center if no current node)
      // and size the zoom so that distance fits within half the panel width.
      var simCx, simCy;
      if (currentNode) {
        simCx = currentNode.x;
        simCy = currentNode.y;
      } else {
        var xExtent0 = d3.extent(data.nodes, function (d) {
          return d.x;
        });
        var yExtent0 = d3.extent(data.nodes, function (d) {
          return d.y;
        });
        simCx = (xExtent0[0] + xExtent0[1]) / 2;
        simCy = (yExtent0[0] + yExtent0[1]) / 2;
      }

      var maxDx = 1,
        maxDy = 1;
      data.nodes.forEach(function (d) {
        var ax = Math.abs(d.x - simCx);
        var ay = Math.abs(d.y - simCy);
        if (ax > maxDx) maxDx = ax;
        if (ay > maxDy) maxDy = ay;
      });

      var padding = 30;
      // Need to fit [simCx - maxDx, simCx + maxDx] into the panel width
      var scale = Math.min((graphPanelWidth / 2 - padding) / maxDx, (height / 2 - padding) / maxDy, 0.35);
      scale = Math.max(scale, 0.3);

      var panelCenterX = panelLeft + graphPanelWidth / 2;
      var panelCenterY = height / 2;
      var offsetX = panelCenterX - simCx * scale;
      var offsetY = panelCenterY - simCy * scale;

      var t = d3.zoomIdentity.translate(offsetX, offsetY).scale(scale);
      applyZoomTransform(t, instant ? 0 : 800);
    }

    // Auto-reset: fit graph after 3s of no interaction
    var resetTimer = null;
    function scheduleReset() {
      clearTimeout(resetTimer);
      resetTimer = setTimeout(fitGraph, 3000);
    }

    // Hook into zoom events to reset timer on any user-initiated zoom/pan
    var originalZoomHandler = zoom.on("zoom");
    zoom.on("zoom", function (event) {
      originalZoomHandler.call(this, event);
      if (event.sourceEvent) {
        clearTimeout(resetTimer);
        scheduleReset();
      }
    });
    g.call(zoom);

    // Only run simulation and fit on first load (no saved positions)
    if (!hasPositions) {
      // Run enough ticks for the layout to settle around the current node.
      // The forceX/forceY already have per-node strength functions that
      // strongly center the current node and gently center the rest.
      simulation.alpha(1);
      for (var i = 0; i < 500; i++) simulation.tick();
      ticked();
      fitGraph(true);
      container.classList.add("rendered");
    }

    // Continuous physics: let d3-force run at a low energy level indefinitely
    // so the graph always responds to forces (drag, resize, etc.) with a
    // natural, fluid feel — similar to how Obsidian's graph view behaves.
    var draggedNode = null;
    simulation
      .velocityDecay(0.7) // Strongly damped for slow, floaty motion
      .alphaMin(0.001)
      .alphaDecay(0.008) // Very slow decay so perturbations linger
      .alphaTarget(0.02) // Low ambient energy — gentle continuous motion
      .restart();

    // Convert screen-space drag coords back into simulation-space coords so
    // the dragged node follows the cursor exactly at any zoom level.
    function screenToSimX(sx) {
      return (sx - panOffsetX) / zoomScale;
    }
    function screenToSimY(sy) {
      return (sy - panOffsetY) / zoomScale;
    }

    function dragstarted(event) {
      clearTimeout(resetTimer);
      // Heat up the simulation gently on drag
      if (!event.active) simulation.alphaTarget(0.1).restart();
      draggedNode = event.subject;
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = screenToSimX(event.x);
      event.subject.fy = screenToSimY(event.y);
    }

    function dragended(event) {
      // Relax back to the low ambient target so motion keeps flowing gently
      if (!event.active) simulation.alphaTarget(0.02);
      event.subject.fx = null;
      event.subject.fy = null;
      draggedNode = null;
      scheduleReset();
    }
  }

  function resizeGraph() {
    var container = document.getElementById("graph-body");
    var svg = d3.select("#knowledge-graph");
    var isMobileNow = window.innerWidth < 1200;
    graphPanelWidth = isMobileNow ? container.clientWidth : 280;
    width = isMobileNow ? container.clientWidth : window.innerWidth;
    height = container.clientHeight;
    svg.attr("viewBox", [0, 0, width, height]);

    // Update panel bounds used by clamping
    panelLeft = width - graphPanelWidth;
    panelRight = width;
    panelBottom = height - footerHeight;
    centerX = isMobileNow ? width / 2 : width - graphPanelWidth / 2;
    centerY = height / 2;

    // Update zoom rect
    zoomRect.attr("x", panelLeft).attr("width", graphPanelWidth).attr("height", height);

    if (simulation) {
      simulation.force(
        "x",
        d3.forceX(centerX).strength(function (d) {
          return d.url === currentPath ? 0.8 : 0.12;
        })
      );
      simulation.force(
        "y",
        d3.forceY(centerY).strength(function (d) {
          return d.url === currentPath ? 0.8 : 0.12;
        })
      );
      simulation.alpha(0.1).restart();
    }

    fitGraph();
  }

  // Debounce resize to avoid thrashing during continuous resizing
  var resizeTimer = null;
  window.addEventListener("resize", function () {
    if (!simulation) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeGraph, 150);
  });
});
