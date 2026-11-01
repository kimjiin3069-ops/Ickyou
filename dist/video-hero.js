(() => {
  const section = document.querySelector('.video-hero');
  if (!section) return;
  const stage = section.querySelector('.video-hero-stage');
  const video = section.querySelector('video');
  const toggle = section.querySelector('.video-hero-play');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let queued = false;
  let userPaused = reduced.matches;
  function render() {
    queued = false;
    const rect = section.getBoundingClientRect();
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const progress = reduced.matches ? 1 : Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - height)));
    const startWidth = Math.min(300, width * .76);
    const startHeight = Math.min(400, height * .62);
    stage.style.setProperty('--film-progress', progress.toFixed(4));
    stage.style.setProperty('--film-width', `${startWidth + (width * .95 - startWidth) * progress}px`);
    stage.style.setProperty('--film-height', `${startHeight + (height * .85 - startHeight) * progress}px`);
    stage.style.setProperty('--film-radius', `${20 - progress * 8}px`);
  }
  function schedule() {
    if (!queued) { queued = true; requestAnimationFrame(render); }
  }
  function syncPlayback() {
    toggle.textContent = video.paused ? '영상 재생' : '영상 일시정지';
    toggle.setAttribute('aria-pressed', String(!video.paused));
  }
  toggle.addEventListener('click', () => {
    userPaused = !video.paused;
    if (userPaused) video.pause(); else video.play().catch(syncPlayback);
  });
  video.addEventListener('play', syncPlayback);
  video.addEventListener('pause', syncPlayback);
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !userPaused) video.play().catch(syncPlayback);
    else video.pause();
  }, {threshold:0});
  observer.observe(section);
  reduced.addEventListener('change', () => {
    userPaused = reduced.matches;
    if (userPaused) video.pause(); else video.play().catch(syncPlayback);
    schedule();
  });
  if (reduced.matches) video.pause();
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule, {passive:true});
  render();
  syncPlayback();
})();
