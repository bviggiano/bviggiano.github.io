(function () {
  var fs = window.TERMINAL_FS;
  var cwd = ["~"];
  var history = [];
  var historyIndex = -1;
  var output = document.getElementById("terminal-output");
  var input = document.getElementById("terminal-input");
  var promptEl = document.getElementById("terminal-prompt");
  var STATE_KEY = "terminal-state";

  // --- Initialization ---

  function init() {
    if (!restoreState()) {
      syncCwdToUrl();
    }
    updatePrompt();
    input.addEventListener("keydown", handleKeydown);
    input.focus();
  }

  // Match cwd to the current page URL by walking path segments against the FS tree
  function syncCwdToUrl() {
    var segments = window.location.pathname.split("/").filter(Boolean);
    if (segments.length === 0) return; // root page, cwd is already ~

    var path = ["~"];
    var node = fs["~"];
    for (var i = 0; i < segments.length; i++) {
      var children = node._children || {};
      // Try exact segment match
      if (children[segments[i]]) {
        path.push(segments[i]);
        node = children[segments[i]];
      } else {
        // Try matching by URL against all children
        var found = false;
        for (var name in children) {
          var childUrl = (children[name]._url || "").replace(/\/$/, "");
          var currentUrl = "/" + segments.slice(0, i + 1).join("/");
          if (childUrl === currentUrl) {
            path.push(name);
            node = children[name];
            found = true;
            break;
          }
        }
        if (!found) break;
      }
    }
    if (path.length > 1) {
      cwd = path;
    }
  }

  // --- State persistence across navigations ---

  function saveState() {
    var state = {
      cwd: cwd,
      history: history,
    };
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  function restoreState() {
    var raw = localStorage.getItem(STATE_KEY);
    if (!raw) return false;
    localStorage.removeItem(STATE_KEY);
    try {
      var state = JSON.parse(raw);
      cwd = state.cwd || ["~"];
      history = state.history || [];
      historyIndex = history.length;
      input.placeholder = "";
      return true;
    } catch (e) {
      return false;
    }
  }

  function navigateWithState(url) {
    saveState();
    window.location.href = url;
  }

  // --- Prompt ---

  function updatePrompt() {
    promptEl.textContent = cwdString() + "$";
  }

  function cwdString() {
    if (cwd.length === 1) return "~";
    return cwd.join("/");
  }

  // --- Output ---

  function appendHtml(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function appendText(text, className) {
    var div = document.createElement("div");
    if (className) div.className = className;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  // --- Filesystem helpers ---

  function getNode(pathParts) {
    var node = fs["~"];
    for (var i = 1; i < pathParts.length; i++) {
      if (!node._children || !node._children[pathParts[i]]) return null;
      node = node._children[pathParts[i]];
    }
    return node;
  }

  function resolvePath(pathStr) {
    var parts;
    if (pathStr === "~" || pathStr === "/") {
      return ["~"];
    }
    if (pathStr.indexOf("~/") === 0) {
      parts = ["~"].concat(pathStr.slice(2).split("/").filter(Boolean));
    } else if (pathStr.indexOf("/") === 0) {
      parts = ["~"].concat(pathStr.slice(1).split("/").filter(Boolean));
    } else {
      parts = cwd.concat(pathStr.split("/").filter(Boolean));
    }
    var resolved = [];
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] === ".") continue;
      if (parts[i] === "..") {
        if (resolved.length > 1) resolved.pop();
      } else {
        resolved.push(parts[i]);
      }
    }
    return resolved;
  }

  // --- Commands ---

  function execCommand(line) {
    var trimmed = line.trim();
    if (!trimmed) return;

    input.placeholder = "";
    appendHtml('<span class="prompt-line"><span class="prompt">' + cwdString() + "$ </span>" + escapeHtml(trimmed) + "</span>");

    var parts = trimmed.split(/\s+/);
    var cmd = parts[0];
    var arg = parts.slice(1).join(" ");

    switch (cmd) {
      case "ls":
        cmdLs(arg);
        break;
      case "cd":
        cmdCd(arg);
        break;
      case "help":
        cmdHelp();
        break;
      case "clear":
        cmdClear();
        break;
      case "theme":
        cmdTheme(arg);
        break;
      default:
        appendText("command not found: " + cmd, "error");
    }
  }

  function cmdLs(arg) {
    var target = arg ? resolvePath(arg) : cwd;
    var node = getNode(target);
    if (!node) {
      appendText("ls: no such directory: " + (arg || cwdString()), "error");
      return;
    }
    var children = node._children || {};
    var dirs = [];
    var socials = [];
    for (var name in children) {
      if (children[name]._hidden) continue;
      if (children[name]._social) {
        socials.push(name);
      } else {
        dirs.push(name);
      }
    }
    if (dirs.length === 0 && socials.length === 0) {
      input.placeholder = "nothing deeper here";
      return;
    }
    if (dirs.length > 0) {
      appendHtml(
        dirs
          .map(function (n) {
            return '<span class="dir-entry">' + escapeHtml(n) + "/</span>";
          })
          .join("  ")
      );
    }
    if (socials.length > 0) {
      appendHtml(
        socials
          .map(function (n) {
            return '<span class="dir-entry">' + escapeHtml(n) + "/</span>";
          })
          .join("  ")
      );
    }
  }

  function cmdCd(arg) {
    var target;
    if (!arg || arg === "~" || arg === "/") {
      target = ["~"];
    } else {
      target = resolvePath(arg);
    }

    var node = getNode(target);
    if (!node) {
      appendText("cd: no such directory: " + arg, "error");
      return;
    }

    var targetUrl = node._url;

    // External URLs and mailto: open in new tab, don't change cwd
    if (targetUrl && (targetUrl.indexOf("http") === 0 || targetUrl.indexOf("mailto:") === 0)) {
      output.innerHTML = "";
      window.open(targetUrl, "_blank");
      return;
    }

    cwd = target;
    updatePrompt();
    output.innerHTML = "";

    var currentPath = window.location.pathname.replace(/\/$/, "") || "";
    var targetPath = (targetUrl || "").replace(/\/$/, "") || "";

    if (targetUrl && currentPath !== targetPath) {
      navigateWithState(targetUrl);
    }
  }

  function cmdHelp() {
    var lines = [
      "Available commands:",
      "  ls [path]     List directory contents",
      "  cd <path>     Change directory (navigates the page)",
      "  theme [mode]  Toggle or set theme (dark/light/system)",
      "  help          Show this help",
      "  clear         Clear terminal output",
      "",
      "Tab: autocomplete  |  Arrow Up/Down: command history",
    ];
    appendText(lines.join("\n"), "help-text");
  }

  function cmdClear() {
    output.innerHTML = "";
  }

  function cmdTheme(arg) {
    if (typeof setThemeSetting !== "function" || typeof determineComputedTheme !== "function") {
      appendText("theme: not available", "error");
      return;
    }
    if (!arg) {
      var current = determineComputedTheme();
      setThemeSetting(current === "dark" ? "light" : "dark");
    } else if (arg === "dark" || arg === "light" || arg === "system") {
      setThemeSetting(arg);
    } else {
      appendText("usage: theme [dark|light|system]", "error");
      return;
    }
    appendText("theme: " + determineComputedTheme(), "help-text");
  }

  // --- Input handling ---

  function handleKeydown(e) {
    if (e.key === "Enter") {
      var val = input.value;
      if (val.trim()) {
        history.push(val);
      }
      historyIndex = history.length;
      execCommand(val);
      input.value = "";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      tabComplete();
    }
  }

  function tabComplete() {
    var val = input.value;
    var parts = val.split(/\s+/);
    var cmd = parts[0];

    if (parts.length <= 1) {
      var cmds = ["ls", "cd", "theme", "help", "clear"];
      var matches = cmds.filter(function (c) {
        return c.indexOf(cmd) === 0;
      });
      if (matches.length === 1) {
        input.value = matches[0] + " ";
      }
      return;
    }

    if (cmd === "cd" || cmd === "ls") {
      var arg = parts.slice(1).join(" ");
      var lastSlash = arg.lastIndexOf("/");
      var dirPart, prefix;
      if (lastSlash >= 0) {
        dirPart = arg.slice(0, lastSlash) || "/";
        prefix = arg.slice(lastSlash + 1);
      } else {
        dirPart = "";
        prefix = arg;
      }

      var targetParts = dirPart ? resolvePath(dirPart) : cwd;
      var node = getNode(targetParts);
      if (!node || !node._children) return;

      var names = Object.keys(node._children);
      var matches = names.filter(function (n) {
        return n.indexOf(prefix) === 0;
      });

      if (matches.length === 1) {
        var completed = dirPart ? dirPart + "/" + matches[0] : matches[0];
        input.value = cmd + " " + completed;
      } else if (matches.length > 1) {
        appendHtml(
          matches
            .map(function (n) {
              return '<span class="dir-entry">' + escapeHtml(n) + "/</span>";
            })
            .join("  ")
        );
      }
    }
  }

  // --- Utility ---

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // --- Boot ---

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
