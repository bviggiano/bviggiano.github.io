// Wrap al_img_tools' mediumZoom call (its zoom.js owns the instance) to add a margin
// and cap zoomed images at a consistent size. Must load deferred after medium-zoom
// and before DOMContentLoaded, when al_img_tools initializes zoom.
(function () {
  const mediumZoom = window.mediumZoom;
  if (typeof mediumZoom !== "function") return;

  const zoomStyles = { maxHeight: "60vh", maxWidth: "80vw", width: "auto", height: "auto" };

  window.mediumZoom = function (selector, options) {
    const zoom = mediumZoom(selector, { ...options, margin: 100 });
    const originalStyles = new WeakMap();

    zoom.on("open", ({ target }) => {
      originalStyles.set(target, Object.fromEntries(Object.keys(zoomStyles).map((key) => [key, target.style[key]])));
      Object.assign(target.style, zoomStyles);
    });
    zoom.on("close", ({ target }) => {
      Object.assign(target.style, originalStyles.get(target));
    });

    return zoom;
  };
})();
