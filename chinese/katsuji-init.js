/**
 * 中文页：横竖排都跑 Katsuji。
 * 按计算后的 writing-mode 配 punct；apply 只做一次，转向时只 reset + hang。
 */
(function () {
  var segmented = false;
  var landscapeQuery = window.matchMedia("(orientation: landscape)");

  function isVertical(root) {
    var el = root || document.body;
    if (!el || !window.getComputedStyle) return landscapeQuery.matches;
    var m = String(getComputedStyle(el).writingMode || "").toLowerCase();
    return m === "vertical-rl" || m === "vertical-lr";
  }

  function clearAndRun() {
    var root = document.getElementById("main");
    if (!root || !window.Katsuji) return;

    // 等 media 样式生效后再量 writing-mode / 行宽
    void root.offsetHeight;

    var vertical = isVertical(document.body);
    Katsuji.setPunctConfig({
      rotateColon: vertical,
      punctAlign: "center",
    });

    if (!segmented) {
      Katsuji.apply(root);
      segmented = true;
    } else if (typeof Katsuji.resetHangAdjustments === "function") {
      Katsuji.resetHangAdjustments(root);
    }

    void root.offsetHeight;
    Katsuji.applyHangAvoidance(root, {
      hangingPunctuation: {
        hangLeftIndent: true,
        hangLeft: false,
        hangRight: "stops",
      },
    });
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

  if (typeof landscapeQuery.addEventListener === "function") {
    landscapeQuery.addEventListener("change", run);
  } else if (typeof landscapeQuery.addListener === "function") {
    landscapeQuery.addListener(run);
  }
})();
