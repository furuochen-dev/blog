/**
 * Inject Giscus; theme is a normal https URL (never data: — that hits URI_TOO_LONG).
 * Landscape → vertical theme; portrait → horizontal theme.
 * Type size is handled inside those CSS files (not parent-computed injection).
 */
(function () {
  var ORIGIN = "https://giscus.app";
  /* Bump when theme CSS changes so giscus/browsers do not keep a stale sheet */
  var THEME_VER = "20261008g";
  var THEME_V =
    "https://furuochen.com/giscus-blog-zh-vertical.css?v=" + THEME_VER;
  var THEME_H =
    "https://furuochen.com/giscus-blog-zh-horizontal.css?v=" + THEME_VER;

  var mount = document.currentScript && document.currentScript.parentNode;
  if (!mount || mount.querySelector("script[src*='giscus.app/client.js']")) {
    return;
  }

  function themeUrl() {
    return window.matchMedia("(orientation: landscape)").matches
      ? THEME_V
      : THEME_H;
  }

  function setTheme(theme) {
    var iframe = document.querySelector("iframe.giscus-frame");
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: theme } } },
      ORIGIN
    );
  }

  function sync() {
    setTheme(themeUrl());
  }

  var s = document.createElement("script");
  s.src = "https://giscus.app/client.js";
  s.async = true;
  s.crossOrigin = "anonymous";
  s.setAttribute("data-repo", "furuochen-dev/blog");
  s.setAttribute("data-repo-id", "R_kgDOQM2DoQ");
  s.setAttribute("data-category", "Blog Comments");
  s.setAttribute("data-category-id", "DIC_kwDOQM2Doc4DHJTI");
  s.setAttribute("data-mapping", "pathname");
  s.setAttribute("data-strict", "0");
  s.setAttribute("data-reactions-enabled", "1");
  s.setAttribute("data-emit-metadata", "0");
  s.setAttribute("data-input-position", "bottom");
  s.setAttribute("data-theme", themeUrl());
  s.setAttribute("data-lang", "zh-CN");
  mount.appendChild(s);

  window.addEventListener("message", function (event) {
    if (event.origin !== ORIGIN) return;
    if (event.data && event.data.giscus) sync();
  });

  var mql = window.matchMedia("(orientation: landscape)");
  if (mql.addEventListener) {
    mql.addEventListener("change", sync);
  } else if (mql.addListener) {
    mql.addListener(sync);
  }
})();
