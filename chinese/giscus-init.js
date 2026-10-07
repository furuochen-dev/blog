/**
 * Inject Giscus with a theme that locks font-size to the article body.
 *
 * Why: theme CSS runs inside the giscus iframe. `vh` / bare `px` there do not
 * match the parent page (iframe 2vh ≈ half of page 2vh when the frame is 56vh).
 * So we fetch the base theme and prepend the parent's computed body font-size
 * as a data: stylesheet URL.
 */
(function () {
  var ORIGIN = "https://giscus.app";
  var THEME_V = "https://furuochen.com/giscus-blog-zh-vertical.css";
  var THEME_H = "https://furuochen.com/giscus-blog-zh-horizontal.css";

  var mount = document.currentScript && document.currentScript.parentNode;
  if (!mount || mount.querySelector("script[src*='giscus.app/client.js']")) {
    return;
  }

  function baseThemeUrl() {
    return window.matchMedia("(orientation: landscape)").matches
      ? THEME_V
      : THEME_H;
  }

  function fontPrefix() {
    var body = getComputedStyle(document.body);
    var fs = body.fontSize;
    var lh = body.lineHeight;
    return [
      "/* synced from parent body computed style */",
      "html, body, main {",
      "  font-size: " + fs + " !important;",
      "  line-height: " + lh + " !important;",
      "}",
      "#__next .gsc-comment,",
      "#__next .gsc-comment-box,",
      "#__next .gsc-loading-text,",
      "#__next .gsc-pagination-button,",
      "#__next .form-control,",
      "#__next .form-select,",
      "#__next .btn,",
      "#__next .markdown,",
      "#__next .gsc-comments-count,",
      "#__next .gsc-replies-count,",
      "#__next .gsc-reactions-count,",
      "#__next .gsc-comment-box-textarea,",
      "#__next .gsc-comment-content,",
      "#__next .text-sm,",
      "#__next .gsc-left-header em {",
      "  font-size: 1em !important;",
      "  line-height: inherit !important;",
      "}",
    ].join("\n");
  }

  function themeDataUrl(baseCss) {
    return (
      "data:text/css;charset=utf-8," +
      encodeURIComponent(fontPrefix() + "\n" + baseCss)
    );
  }

  function setTheme(theme) {
    var iframe = document.querySelector("iframe.giscus-frame");
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: theme } } },
      ORIGIN
    );
  }

  var cachedBase = Object.create(null);
  var readyTheme = null;

  function loadThemeUrl() {
    var base = baseThemeUrl();
    if (cachedBase[base]) {
      readyTheme = themeDataUrl(cachedBase[base]);
      return Promise.resolve(readyTheme);
    }
    return fetch(base, { mode: "cors", cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("theme " + r.status);
        return r.text();
      })
      .then(function (css) {
        cachedBase[base] = css;
        readyTheme = themeDataUrl(css);
        return readyTheme;
      })
      .catch(function () {
        /* data: or fetch failed — fall back to hosted file */
        readyTheme = base;
        return readyTheme;
      });
  }

  function injectClient(theme) {
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
    s.setAttribute("data-theme", theme);
    s.setAttribute("data-lang", "zh-CN");
    mount.appendChild(s);
  }

  function sync() {
    loadThemeUrl().then(function (theme) {
      setTheme(theme);
    });
  }

  loadThemeUrl().then(function (theme) {
    injectClient(theme);
  });

  window.addEventListener("message", function (event) {
    if (event.origin !== ORIGIN) return;
    if (event.data && event.data.giscus && readyTheme) setTheme(readyTheme);
  });

  var mql = window.matchMedia("(orientation: landscape)");
  if (mql.addEventListener) {
    mql.addEventListener("change", sync);
  } else if (mql.addListener) {
    mql.addListener(sync);
  }
})();
