// Motion-only adaptation of the supplied AnimatedTestimonials component.
// The existing cards, images, text, styles, grid, and controls stay untouched.
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const running = new Set();
  const play = (element, frames, options) => {
    const animation = element.animate(frames, options);
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      observer.unobserve(card);
      if (reducedMotion.matches) return;
      const image = card.querySelector('img');
      const lift = matchMedia('(max-width: 767px)').matches ? 24 : 80;
      const rotation = Number(card.dataset.review) % 2 ? -6 : 6;
      const reveal = () => {
        if (reducedMotion.matches || !card.isConnected) return;
        const bounds = card.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > innerHeight) return;
        play(image, [
          { opacity: 0, transform: `translateY(0) scale(.9) rotate(${rotation}deg)`, transformOrigin: '50% 100%', offset: 0 },
          { opacity: 1, transform: `translateY(-${lift}px) scale(.97) rotate(${rotation / 2}deg)`, transformOrigin: '50% 100%', offset: .5 },
          { opacity: 1, transform: 'translateY(0) scale(1) rotate(0deg)', transformOrigin: '50% 100%', offset: 1 }
        ], { duration: 400, easing: 'ease-in-out' });
        card.querySelectorAll('.review-copy > *').forEach((text, index) => {
          play(text, [
            { opacity: 0, filter: 'blur(10px)', transform: 'translateY(20px)' },
            { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0)' }
          ], { duration: 200, delay: index * 20, easing: 'ease-in-out', fill: 'backwards' });
        });
      };
      if (image.complete && image.naturalWidth) reveal();
      else image.addEventListener('load', reveal, { once: true });
    });
  }, { threshold: .12 });
  document.querySelectorAll('.review-card').forEach(card => observer.observe(card));
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) running.forEach(animation => animation.cancel());
  });
  window.addEventListener('pagehide', () => {
    observer.disconnect();
    running.forEach(animation => animation.cancel());
  }, { once: true });
})();
