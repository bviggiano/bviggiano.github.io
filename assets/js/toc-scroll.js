document.addEventListener("DOMContentLoaded", function () {
  var tocNav = document.getElementById("auto-toc");
  var content = document.getElementById("markdown-content");
  if (!tocNav || !content) return;

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
  var tocLinks = tocNav.querySelectorAll(".auto-toc-link");
  var headingMap = {};
  var visibleHeadings = new Set();
  tocLinks.forEach(function (link, i) {
    headingMap[headings[i].id] = link;
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visibleHeadings.add(entry.target.id);
        } else {
          visibleHeadings.delete(entry.target.id);
        }
      });

      // Update all TOC links and their parent li elements
      tocLinks.forEach(function (link) {
        link.classList.remove("active");
        link.classList.remove("current");
        link.parentElement.classList.remove("active");
        link.parentElement.classList.remove("current");
      });
      visibleHeadings.forEach(function (id) {
        var link = headingMap[id];
        if (link) {
          link.classList.add("active");
          link.parentElement.classList.add("active");
        }
      });

      // If no headings visible, highlight the last one scrolled past
      if (visibleHeadings.size === 0) {
        var scrollTop = window.scrollY + 100;
        var lastPassed = null;
        headings.forEach(function (h) {
          if (h.offsetTop <= scrollTop) lastPassed = h;
        });
        if (lastPassed && headingMap[lastPassed.id]) {
          headingMap[lastPassed.id].classList.add("active");
          headingMap[lastPassed.id].parentElement.classList.add("active");
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
