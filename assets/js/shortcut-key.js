// Check if the user is on a Mac and update the shortcut key for search accordingly
let isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
if (isMac) {
  let el = document.getElementById("search-shortcut-text");
  if (el) el.textContent = "\u2318";
}
