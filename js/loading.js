import { t } from "./i18n.js";

/**
 * Piecewise keyframes for the progress curve.
 * Each entry: [timeMs, pct] — straight-line interpolated between points.
 * Shape: slow → slight accel → very slow → fast sprint to 100.
 * Total duration: 2500 ms.
 */
const CURVE = [
  [0,    0],
  [600,  26],   // decent start
  [800,  29],   // slowing into the stall
  [1700, 33],   // near-stop — 900 ms to crawl 4 %
  [2050, 60],   // sudden acceleration out of the stall
  [2500, 100],  // fast sprint to the end
];

/** Interpolate the piecewise curve at time `ms`. Returns 0–100. */
function curveAt(ms) {
  for (let i = 1; i < CURVE.length; i++) {
    const [t0, p0] = CURVE[i - 1];
    const [t1, p1] = CURVE[i];
    if (ms <= t1) {
      const ratio = (ms - t0) / (t1 - t0);
      return p0 + (p1 - p0) * ratio;
    }
  }
  return 100;
}

export function runLoadingSequence(onComplete) {
  const screen    = document.getElementById("loading-screen");
  const barFill   = document.getElementById("loading-bar-fill");
  const percentEl = document.getElementById("loading-percent");
  const statusEl  = document.getElementById("loading-status");

  if (!screen) { onComplete(); return; }

  // ── Reset to 0 without animating backwards ─────────────────────────────────
  barFill.style.transition = "none";
  barFill.style.width = "0%";
  percentEl.textContent = "0%";
  void barFill.offsetWidth; // force layout flush
  barFill.style.transition = "";
  // ───────────────────────────────────────────────────────────────────────────

  const messages = t("loading.messages");
  statusEl.textContent = messages[0];

  screen.style.display = "flex";
  screen.getBoundingClientRect(); // reflow before transition
  screen.classList.add("visible");

  let startTime = null;
  let rafId = null;

  function tick(now) {
    if (!startTime) startTime = now;
    const elapsed = Math.min(now - startTime, 2500);
    const pct = curveAt(elapsed);

    barFill.style.width = pct + "%";
    percentEl.textContent = Math.round(pct) + "%";

    const msgIdx = Math.min(
      Math.floor((pct / 100) * (messages.length - 1)),
      messages.length - 1
    );
    statusEl.textContent = messages[msgIdx];

    if (elapsed < 2500) {
      rafId = requestAnimationFrame(tick);
    } else {
      // Ensure 100% is displayed cleanly
      barFill.style.width = "100%";
      percentEl.textContent = "100%";
      statusEl.textContent = messages[messages.length - 1];

      setTimeout(() => {
        screen.classList.remove("visible");
        setTimeout(() => {
          screen.style.display = "none";
          onComplete();
        }, 420);
      }, 320);
    }
  }

  // Short delay so the fade-in completes before the bar starts moving
  setTimeout(() => { rafId = requestAnimationFrame(tick); }, 280);
}
