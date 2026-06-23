if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

if (!window.location.hash) {
  window.scrollTo(0, 0);
  window.addEventListener('pageshow', () => window.scrollTo(0, 0), { once: true });
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

const heroStory = document.querySelector('.hero-story');
const heroSticky = document.querySelector('.hero-sticky');
const heroCopy = document.querySelector('.hero-copy');
const lineOne = document.querySelector('.story-line--one');
const lineTwo = document.querySelector('.story-line--two');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroStory && heroSticky && heroCopy && lineOne && lineTwo) {
  const fadeRange = (progress, start, end) => {
    if (progress <= start || progress >= end) return 0;
    const mid = (start + end) / 2;
    const half = (end - start) / 2;
    return 1 - Math.abs(progress - mid) / half;
  };

  const setLine = (el, amount) => {
    el.style.opacity = amount.toFixed(2);
    el.style.transform = `translateY(${(-38 - amount * 12).toFixed(2)}%)`;
  };

  let ticking = false;
  const updateHero = () => {
    ticking = false;
    const rect = heroStory.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    if (scrollable <= 0) return;

    const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
    const copyAmount = Math.min(Math.max(progress / 0.25, 0), 1);
    const exitStart = window.innerHeight * 1.25;
    const exitDistance = window.innerHeight * 0.5;
    const exitAmount = Math.min(Math.max((exitStart - rect.bottom) / exitDistance, 0), 1);
    const isFixed = rect.top <= 0 && rect.bottom > 0;
    const isEnded = rect.bottom <= 0;

    heroStory.classList.toggle('is-fixed', isFixed);
    heroStory.classList.toggle('is-ended', isEnded);
    heroSticky.style.opacity = (1 - exitAmount).toFixed(2);
    if (reduceMotion) return;

    heroCopy.style.opacity = (1 - copyAmount).toFixed(2);
    heroCopy.style.transform = `translateY(${(-24 * copyAmount).toFixed(2)}px)`;
    setLine(lineOne, fadeRange(progress, 0.3, 0.62));
    setLine(lineTwo, fadeRange(progress, 0.64, 0.96));
  };

  const queueHeroUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateHero);
  };

  window.addEventListener('scroll', queueHeroUpdate, { passive: true });
  window.addEventListener('resize', queueHeroUpdate);
  window.addEventListener('pageshow', queueHeroUpdate);
  updateHero();
}
