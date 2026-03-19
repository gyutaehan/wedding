import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useLanguage } from '../../contexts/LanguageContext';

function CountdownItem({ value, unit }: { value: number; unit: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    gsap.fromTo(ref.current,
      { scale: 1.4, color: '#a8a29e' },
      { scale: 1, color: '#57534e', duration: 0.4, ease: 'back.out(2.5)' }
    );
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 flex items-center justify-center border border-stone-200 rounded-full mb-2 bg-white shadow-sm">
        <span ref={ref} className="text-xl font-light tabular-nums text-stone-600">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-wider mt-1 text-stone-400">{unit}</span>
    </div>
  );
}

export default function DDaySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { t, lang } = useLanguage();
  const [displayLang, setDisplayLang] = useState(lang);
  const isFirstRender = useRef(true);

  // D-Day Logic
  useEffect(() => {
    const targetDate = new Date('2026-05-03T12:00:00');
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Language Animation
  useGSAP(() => {
    if (lang !== displayLang) {
      gsap.to('.dday-text', {
        opacity: 0,
        y: -5,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setDisplayLang(lang);
          gsap.set('.dday-text', { y: 5 });
        }
      });
    }
  }, { scope: containerRef, dependencies: [lang] });

  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    gsap.to('.dday-text', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.02,
      ease: 'power2.out'
    });
  }, { scope: containerRef, dependencies: [displayLang] });

  return (
    <section id="section-dday" ref={containerRef} className="scroll-mt-24 w-full py-24 px-6 bg-stone-50 flex flex-col items-center">
      <h3 className="dday-text text-xs tracking-[0.3em] text-stone-400 mb-8 uppercase">{t('info_dday_title', displayLang)}</h3>
      <div className="flex justify-center gap-6 text-stone-800">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <CountdownItem key={unit} unit={unit} value={value} />
        ))}
      </div>
    </section>
  );
}