// Initialize medium zoom.
$(document).ready(function () {
  medium_zoom = mediumZoom("[data-zoomable]", {
    background: getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color") + "ee", // + 'ee' for trasparency.
    margin: 100,
  });

  // Override zoom to consistent size
  medium_zoom.on("open", function (event) {
    var image = event.target;
    if (image) {
      // Store original styles
      image.dataset.originalMaxHeight = image.style.maxHeight || "";
      image.dataset.originalMaxWidth = image.style.maxWidth || "";
      image.dataset.originalWidth = image.style.width || "";
      image.dataset.originalHeight = image.style.height || "";
      // Apply zoom styles
      image.style.maxHeight = "60vh";
      image.style.maxWidth = "80vw";
      image.style.width = "auto";
      image.style.height = "auto";
    }
  });

  // Restore original size on close
  medium_zoom.on("close", function (event) {
    var image = event.target;
    if (image) {
      image.style.maxHeight = image.dataset.originalMaxHeight || "";
      image.style.maxWidth = image.dataset.originalMaxWidth || "";
      image.style.width = image.dataset.originalWidth || "";
      image.style.height = image.dataset.originalHeight || "";
    }
  });
});
