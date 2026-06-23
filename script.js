if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

if (!window.location.hash) {
  window.scrollTo(0, 0);
  // persisted === true means this pageshow is a back/forward bfcache restore,
  // which already keeps the scroll position the user left off at - only force
  // the reset on a genuine reload.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) window.scrollTo(0, 0);
  }, { once: true });
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
);

document.querySelectorAll('.reveal').forEach((section) => revealObserver.observe(section));
document.querySelector('#year').textContent = new Date().getFullYear();

const video = document.querySelector('.hero-media video');
if (video) {
  const showVideo = () => video.classList.add('is-ready');
  if (video.readyState >= 2) showVideo();
  video.addEventListener('loadeddata', showVideo, { once: true });
  video.addEventListener('canplay', showVideo, { once: true });

  video.play().catch(() => {
    showVideo();
    video.removeAttribute('controls');
  });
}

// "Привет! Давай познакомимся" / "Мы - Piter-Westi..." rely on CSS scroll-driven
// animations (animation-timeline: scroll()), which Safari and Firefox do not
// support yet. Without this fallback the story lines would stay at opacity: 0
// forever in those browsers. Detect support and, if missing, drive the same
// fade with a rAF-throttled scroll handler (the one case where a scroll
// listener is justified: it only runs in browsers lacking the native API).
const supportsScrollTimeline = window.CSS?.supports?.('animation-timeline', 'scroll()');

if (!supportsScrollTimeline) {
  const heroStory = document.querySelector('.hero-story');
  const lineOne = document.querySelector('.story-line--one');
  const lineTwo = document.querySelector('.story-line--two');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroStory && lineOne && lineTwo && !reduceMotion) {
    let isMobileHero = false;
    let firstLineRange = [0.06, 0.36];
    let secondLineRange = [0.52, 0.82];
    let heroTop = 0;
    let scrollable = 0;

    // Measured only on load/resize, not on every scroll frame, so scrolling
    // through the hero never forces a getBoundingClientRect() layout read
    // while the background video is playing.
    const measure = () => {
      const rect = heroStory.getBoundingClientRect();
      heroTop = rect.top + window.scrollY;
      scrollable = rect.height - window.innerHeight;
      isMobileHero = window.matchMedia('(max-width: 820px)').matches;
      firstLineRange = isMobileHero ? [0.2, 0.42] : [0.06, 0.36];
      secondLineRange = isMobileHero ? [0.48, 0.74] : [0.52, 0.82];
    };

    const fadeRange = (progress, start, end) => {
      if (progress <= start || progress >= end) return 0;
      const mid = (start + end) / 2;
      const half = (end - start) / 2;
      return 1 - Math.abs(progress - mid) / half;
    };

    const setLine = (el, amount) => {
      el.style.opacity = amount.toFixed(2);
      el.style.transform = isMobileHero
        ? `translateY(${(1 - amount) * 18}px)`
        : `translate(-50%, ${-50 + (1 - amount) * 8}%)`;
    };

    let ticking = false;
    const update = () => {
      ticking = false;
      if (scrollable <= 0) return;
      const progress = Math.min(Math.max((window.scrollY - heroTop) / scrollable, 0), 1);

      setLine(lineOne, fadeRange(progress, ...firstLineRange));
      setLine(lineTwo, fadeRange(progress, ...secondLineRange));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    measure();
    update();
  }
}
