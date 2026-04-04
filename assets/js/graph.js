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
    var isMobile = window.innerWidth < 768;
    var graphPanelWidth = isMobile ? container.clientWidth : 280;
    var width = isMobile ? container.clientWidth : window.innerWidth;
    var height = container.clientHeight;
    svg.attr("viewBox", [0, 0, width, height]);

    // Center of the graph area
    var centerX = isMobile ? width / 2 : width - graphPanelWidth / 2;
    var centerY = height / 2;

    var currentPath = window.location.pathname;

    var nodeColor = function (d) {
      if (d.type === "post") return "#d97757";
      if (d.type === "folder") return "#8b8b8b";
      return "#2698ba";
    };

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
      .attr("r", function (d) {
        return d.url === currentPath ? 14 : 12;
      })
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
        return d.title;
      })
      .attr("display", "none")
      .style("cursor", "pointer");

    // Tooltip
    var tooltip = d3.select("#graph-body").append("div").attr("class", "graph-tooltip").style("display", "none");

    // Shared highlight/unhighlight for both nodes and labels
    function highlightNode(event, d) {
      tooltip.style("display", "block").text(d.title);

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
        return d.type === "folder" ? 0.3 : 0.6;
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
          var base = d.url === currentPath ? 14 : 12;
          return base * Math.max(zoomScale, 0.5);
        });

      var scaledFontSize = Math.max(11, 14 * Math.max(zoomScale, 0.5));
      label
        .attr("x", function (d) {
          return screenX(d);
        })
        .attr("y", function (d) {
          var base = d.url === currentPath ? 14 : 12;
          return screenY(d) + base * Math.max(zoomScale, 0.5) + scaledFontSize + 4;
        })
        .style("font-size", scaledFontSize + "px");

      link.attr("stroke-width", Math.max(1, zoomScale));
    }

    // Resolve link references before simulation so it doesn't reassign positions
    links.forEach(function (l) {
      if (typeof l.source === "string") l.source = nodeById[l.source];
      if (typeof l.target === "string") l.target = nodeById[l.target];
    });

    // Create simulation stopped
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
          .distance(60)
      )
      .force("charge", d3.forceManyBody().strength(-300).distanceMin(10))
      .force("x", d3.forceX(centerX).strength(0.005))
      .force("y", d3.forceY(centerY).strength(0.005))
      .force("collide", d3.forceCollide(60))
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

    // Zoom-to-fit: smoothly transition to show all nodes within panel
    function fitGraph(instant) {
      if (!data.nodes.length) return;

      // Clear saved state so next page load starts fresh
      sessionStorage.removeItem(POSITIONS_KEY);
      sessionStorage.removeItem(ZOOM_KEY);
      sessionStorage.removeItem(VIEWBOX_KEY);

      var xExtent = d3.extent(data.nodes, function (d) {
        return d.x;
      });
      var yExtent = d3.extent(data.nodes, function (d) {
        return d.y;
      });
      var dx = xExtent[1] - xExtent[0] || 1;
      var dy = yExtent[1] - yExtent[0] || 1;
      var padding = 30;
      var scale = Math.min((graphPanelWidth - padding * 2) / dx, (height - padding * 2) / dy, 0.35);
      scale = Math.max(scale, 0.3);

      // Center of all nodes in sim space
      var simCx = (xExtent[0] + xExtent[1]) / 2;
      var simCy = (yExtent[0] + yExtent[1]) / 2;

      // We want: simCx * scale + offsetX = panelCenterX
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
      // Temporarily increase centering strength for initial settling
      simulation.force("x").strength(0.1);
      simulation.force("y").strength(0.1);
      for (var i = 0; i < 300; i++) simulation.tick();
      // Restore gentle centering for ambient drift
      simulation.force("x").strength(0.005);
      simulation.force("y").strength(0.005);
      ticked();
      fitGraph(true);
      container.classList.add("rendered");
    }

    // Ambient drift: smooth arcing orbits using per-node phase offsets
    data.nodes.forEach(function (n) {
      n._driftPhaseX = Math.random() * Math.PI * 2;
      n._driftPhaseY = Math.random() * Math.PI * 2;
      n._driftSpeedX = 0.0003 + Math.random() * 0.0004;
      n._driftSpeedY = 0.0003 + Math.random() * 0.0004;
      n._driftRadius = 8 + Math.random() * 12;
      n._baseX = n.x;
      n._baseY = n.y;
    });

    var driftStartTime = null;
    var driftDelay = 2000; // ms before drift begins
    var driftEaseIn = 3000; // ms to ease in to full drift
    var draggedNode = null;

    // Soft collision: applies gentle spring-like repulsion each frame.
    // The dragged node is treated as immovable so others yield to it.
    var collisionDist = 60;
    var collisionStrength = 0.15; // fraction of overlap corrected per frame
    function resolveCollisions() {
      for (var a = 0; a < data.nodes.length; a++) {
        for (var b = a + 1; b < data.nodes.length; b++) {
          var na = data.nodes[a],
            nb = data.nodes[b];
          var dx = nb.x - na.x,
            dy = nb.y - na.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < collisionDist && dist > 0.1) {
            var push = (collisionDist - dist) * collisionStrength;
            var nx = dx / dist,
              ny = dy / dist;
            var aFixed = na === draggedNode;
            var bFixed = nb === draggedNode;
            if (aFixed) {
              // Only push b away
              nb.x += nx * push;
              nb.y += ny * push;
              nb._baseX += nx * push;
              nb._baseY += ny * push;
            } else if (bFixed) {
              // Only push a away
              na.x -= nx * push;
              na.y -= ny * push;
              na._baseX -= nx * push;
              na._baseY -= ny * push;
            } else {
              var halfPush = push / 2;
              na.x -= nx * halfPush;
              na.y -= ny * halfPush;
              na._baseX -= nx * halfPush;
              na._baseY -= ny * halfPush;
              nb.x += nx * halfPush;
              nb.y += ny * halfPush;
              nb._baseX += nx * halfPush;
              nb._baseY += ny * halfPush;
            }
          }
        }
      }
    }

    function ambientDrift(timestamp) {
      if (driftStartTime === null) driftStartTime = timestamp;
      var elapsed = timestamp - driftStartTime;

      // Ease in: 0 during delay, then ramp from 0 to 1 over easeIn period
      var intensity = 0;
      if (elapsed > driftDelay) {
        intensity = Math.min(1, (elapsed - driftDelay) / driftEaseIn);
      }

      if (intensity > 0) {
        data.nodes.forEach(function (n) {
          if (n === draggedNode) return;
          n.x = n._baseX + Math.sin(elapsed * n._driftSpeedX + n._driftPhaseX) * n._driftRadius * intensity;
          n.y = n._baseY + Math.cos(elapsed * n._driftSpeedY + n._driftPhaseY) * n._driftRadius * intensity;
        });
      }
      resolveCollisions();
      ticked();
      requestAnimationFrame(ambientDrift);
    }
    requestAnimationFrame(ambientDrift);

    function dragstarted(event) {
      clearTimeout(resetTimer);
      if (!event.active) simulation.alphaTarget(0.1).restart();
      draggedNode = event.subject;
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
      event.subject.x = event.x;
      event.subject.y = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
      // Update base position so drift orbits around the new location
      event.subject._baseX = event.subject.x;
      event.subject._baseY = event.subject.y;
      draggedNode = null;
      scheduleReset();
    }
  }

  function resizeGraph() {
    var container = document.getElementById("graph-body");
    var svg = d3.select("#knowledge-graph");
    var isMobileNow = window.innerWidth < 768;
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
      simulation.force("x", d3.forceX(centerX).strength(0.02));
      simulation.force("y", d3.forceY(centerY).strength(0.02));

      // Update base positions to recenter
      data.nodes.forEach(function (n) {
        n._baseX = n.x;
        n._baseY = n.y;
      });

      simulation.alpha(0.3).restart();
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
