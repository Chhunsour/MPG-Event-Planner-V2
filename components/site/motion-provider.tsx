'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (reduced || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.setAttribute('data-visible', 'true'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-visible', 'true');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    );

    elements.forEach((element) => {
      element.setAttribute('data-reveal-ready', 'true');
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-spotlight]');
      if (!target) return;
      const bounds = target.getBoundingClientRect();
      target.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
      target.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
    };

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => document.removeEventListener('pointermove', onPointerMove);
  }, []);

  return null;
}
