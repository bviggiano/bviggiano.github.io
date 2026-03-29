document.addEventListener("DOMContentLoaded", function () {
  var tocSidebar = document.getElementById("toc-sidebar");
  var tocNav = tocSidebar || document.getElementById("auto-toc");
  var content = document.getElementById("markdown-content");
  if (!tocNav || !content) return;

  // If using sidebar TOC, hide the standalone auto-toc and position it
  if (tocSidebar) {
    var autoToc = document.getElementById("auto-toc");
    if (autoToc) autoToc.style.display = "none";

    // Position TOC so its right edge sits against the container's left edge
    function positionToc() {
      var mainContent = document.getElementById("main-content");
      if (!mainContent) return;
      var containerLeft = mainContent.getBoundingClientRect().left;
      tocSidebar.style.left = containerLeft - 15 + "px";
    }
    positionToc();
    window.addEventListener("resize", positionToc);
  }

  // Collect h2 and h3 headings
  var headings = content.querySelectorAll("h2, h3");
  if (headings.length < 2) {
    tocNav.style.display = "none";
    return;
  }

  // Ensure each heading has an id for linking
  headings.forEach(function (h, i) {
    if (!h.id) {
      h.id = "section-" + i;
    }
  });

  // Build TOC list
  var list = document.createElement("ul");
  list.className = "auto-toc-list";

  // Add page title at the top
  var postTitle = document.querySelector(".post-title");
  if (postTitle) {
    var titleLi = document.createElement("li");
    titleLi.className = "auto-toc-item toc-title";
    var titleA = document.createElement("a");
    titleA.href = "#";
    titleA.textContent = postTitle.textContent;
    titleA.className = "auto-toc-link";
    titleA.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    titleLi.appendChild(titleA);
    list.appendChild(titleLi);
  }

  var headingsArr = Array.prototype.slice.call(headings);
  headingsArr.forEach(function (h, i) {
    var isH3 = h.tagName === "H3";
    var li = document.createElement("li");
    li.className = "auto-toc-item" + (isH3 ? " toc-h3" : " toc-h2");

    // Mark last h3 before next h2 (or end of list)
    if (isH3) {
      var next = headingsArr[i + 1];
      if (!next || next.tagName === "H2") {
        li.className += " toc-h3-last";
      }
    }

    var a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    a.className = "auto-toc-link";

    a.addEventListener("click", function (e) {
      e.preventDefault();
      h.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, null, "#" + h.id);
    });

    li.appendChild(a);
    list.appendChild(li);
  });

  tocNav.appendChild(list);

  // Highlight all visible sections with IntersectionObserver
  var tocLinks = tocNav.querySelectorAll(".auto-toc-item:not(.toc-title) .auto-toc-link");
  var titleLink = tocNav.querySelector(".toc-title .auto-toc-link");
  var headingMap = {};
  var visibleHeadings = new Set();
  tocLinks.forEach(function (link, i) {
    headingMap[headings[i].id] = link;
  });

  // Observe the page title (h1) for the TOC title highlight
  if (postTitle && titleLink) {
    var titleVisible = false;
    var titleObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          titleVisible = entry.isIntersecting;
          if (titleVisible) {
            titleLink.classList.add("active");
          } else {
            titleLink.classList.remove("active");
          }
        });
      },
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );
    titleObserver.observe(postTitle);
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visibleHeadings.add(entry.target.id);
        } else {
          visibleHeadings.delete(entry.target.id);
        }
      });

      // Build a map from each heading to its parent h2 heading
      var parentH2 = {};
      var currentH2 = null;
      headingsArr.forEach(function (h) {
        if (h.tagName === "H2") {
          currentH2 = h;
        }
        parentH2[h.id] = currentH2;
      });

      // Update all TOC links and their parent li elements
      tocLinks.forEach(function (link) {
        link.classList.remove("active");
        link.classList.remove("current");
        link.parentElement.classList.remove("active");
        link.parentElement.classList.remove("current");
      });

      // Mark visible headings active, and also their parent h2
      visibleHeadings.forEach(function (id) {
        var link = headingMap[id];
        if (link) {
          link.classList.add("active");
          link.parentElement.classList.add("active");
        }
        // If this is an h3, also activate its parent h2
        var ph2 = parentH2[id];
        if (ph2 && ph2.id !== id && headingMap[ph2.id]) {
          headingMap[ph2.id].classList.add("active");
          headingMap[ph2.id].parentElement.classList.add("active");
        }
      });

      // If no headings visible, highlight the last one scrolled past and its parent h2
      if (visibleHeadings.size === 0) {
        var scrollTop = window.scrollY + 100;
        var lastPassed = null;
        headings.forEach(function (h) {
          if (h.offsetTop <= scrollTop) lastPassed = h;
        });
        if (lastPassed && headingMap[lastPassed.id]) {
          headingMap[lastPassed.id].classList.add("active");
          headingMap[lastPassed.id].parentElement.classList.add("active");
          var ph2 = parentH2[lastPassed.id];
          if (ph2 && ph2.id !== lastPassed.id && headingMap[ph2.id]) {
            headingMap[ph2.id].classList.add("active");
            headingMap[ph2.id].parentElement.classList.add("active");
          }
        }
      }

      // Mark the "current" (bold) heading:
      // If 2 or fewer visible, bold the topmost; otherwise bold the one closest to center
      var visibleArr = [];
      headingsArr.forEach(function (h) {
        if (visibleHeadings.has(h.id)) visibleArr.push(h);
      });

      var boldId = null;
      if (visibleArr.length > 0 && visibleArr.length <= 2) {
        boldId = visibleArr[0].id;
      } else if (visibleArr.length > 2) {
        var viewCenter = window.scrollY + window.innerHeight / 2;
        var closestDist = Infinity;
        visibleArr.forEach(function (h) {
          var dist = Math.abs(h.getBoundingClientRect().top + window.scrollY - viewCenter);
          if (dist < closestDist) {
            closestDist = dist;
            boldId = h.id;
          }
        });
      } else {
        // No visible headings; bold the fallback active one
        var activeLinks = tocNav.querySelectorAll(".auto-toc-link.active");
        if (activeLinks.length > 0) boldId = activeLinks[0].href.split("#")[1];
      }

      if (boldId && headingMap[boldId]) {
        headingMap[boldId].classList.add("current");
        headingMap[boldId].parentElement.classList.add("current");
      }

      // Show/hide h3 items: visible when their parent h2 is active
      var tocItems = tocNav.querySelectorAll(".auto-toc-item");
      var sectionActive = false;
      tocItems.forEach(function (item) {
        if (item.classList.contains("toc-h2")) {
          sectionActive = item.classList.contains("active");
        } else if (item.classList.contains("toc-h3")) {
          if (sectionActive) {
            item.classList.add("toc-visible");
          } else {
            item.classList.remove("toc-visible");
          }
        }
      });
    },
    {
      rootMargin: "-80px 0px -20% 0px",
      threshold: 0,
    }
  );

  headings.forEach(function (h) {
    observer.observe(h);
  });
});
