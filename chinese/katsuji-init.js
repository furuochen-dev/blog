/**
 * 中文竖排页：先 apply，再避头尾。
 * ：； 日式字形由 /fonts/vert-punct.woff2 提供，不改正文 HTML。
 */
(function () {
  var applied = false;

  function clearAndRun() {
    var root = document.getElementById("main");
    if (!root || !window.Katsuji) return;

    if (applied && typeof Katsuji.resetHangAdjustments === "function") {
      Katsuji.resetHangAdjustments(root);
    }

    Katsuji.setPunctConfig({
      rotateColon: true,
      punctAlign: "center",
    });
    Katsuji.apply(root);
    Katsuji.applyHangAvoidance(root, {
      hangingPunctuation: {
        hangLeftIndent: true,
        hangLeft: false,
        hangRight: "stops",
      },
    });
    applied = true;
  }

  function run() {
    requestAnimationFrame(function () {
      requestAnimationFrame(clearAndRun);
    });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(run).catch(run);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
