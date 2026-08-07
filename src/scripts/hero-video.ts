/**
 * hero-video.ts — attaches the hero video's sources after LCP has settled.
 *
 * Contract (kit/sections/01-hero.md §"Video handling" rule 5, §7):
 *  - the poster renders first and is the LCP candidate; the video never is
 *  - `preload="none"`; sources are attached only after the load event
 *  - nothing is fetched at all when the connection cannot afford it
 *    (`saveData`, or an effective type of 2g / slow-2g). On a slow connection
 *    the poster simply stands. That is the correct experience for this
 *    audience, not a degraded one.
 *  - under prefers-reduced-motion there is no autoplay: the poster stands and
 *    a real, labelled play control is offered instead
 *
 * No-ops when the hero window carries the placeholder panel instead of a
 * video, which is the current state — see the `footage` constant in Hero.astro.
 */

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

const connection = (
  navigator as Navigator & { connection?: NetworkInformation }
).connection;

/** True when fetching a few hundred KB of video would be a hostile act. */
function connectionIsTooSlow(): boolean {
  if (!connection) return false; // unknown: assume it is fine
  if (connection.saveData === true) return true;
  return (
    connection.effectiveType === "2g" || connection.effectiveType === "slow-2g"
  );
}

function whenIdle(fn: () => void): void {
  if (typeof requestIdleCallback === "function") requestIdleCallback(fn);
  else setTimeout(fn, 200);
}

function attachSources(video: HTMLVideoElement): void {
  // WebM first: smaller at equal quality, and the browsers that lack it fall
  // through to the H.264 baseline MP4.
  const sources: Array<[type: string, key: "webm" | "mp4"]> = [
    ["video/webm", "webm"],
    ["video/mp4", "mp4"],
  ];
  for (const [type, key] of sources) {
    const src = video.dataset[key];
    if (!src) continue;
    const el = document.createElement("source");
    el.type = type;
    el.src = src;
    video.append(el);
  }
  video.load();
}

export function initHeroVideo(root: ParentNode = document): void {
  const video = root.querySelector<HTMLVideoElement>("[data-hero-video]");
  if (!video) return; // placeholder panel is in the window; nothing to do
  if (connectionIsTooSlow()) return; // the poster stands

  const play = root.querySelector<HTMLButtonElement>("[data-hero-play]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const start = () => {
    attachSources(video);
    if (!reduced) {
      // Autoplay can still be refused; the poster is behind it either way.
      void video.play().catch(() => {});
      return;
    }
    if (!play) return;
    play.hidden = false;
    play.addEventListener(
      "click",
      () => {
        void video.play();
        play.hidden = true;
      },
      { once: true },
    );
  };

  if (document.readyState === "complete") whenIdle(start);
  else addEventListener("load", () => whenIdle(start), { once: true });
}

initHeroVideo();
