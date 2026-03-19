import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Toast({ message }: { message: string }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(el.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, [message]);

  return (
    <div 
        ref={el}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-stone-800/90 text-white px-6 py-3 rounded-full text-sm shadow-lg backdrop-blur-sm whitespace-nowrap"
    >
      {message}
    </div>
  );
}
