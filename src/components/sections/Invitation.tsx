import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Invitation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useLanguage();
  const [displayLang, setDisplayLang] = useState(lang);
  const isFirstRender = useRef(true);

  useGSAP(() => {
    gsap.from('.invitation-text', {
      y: 30,
      opacity: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
    });
  }, { scope: containerRef });

  // 언어 변경 시 페이드 아웃 -> 텍스트 변경 -> 페이드 인 애니메이션
  useGSAP(() => {
    if (lang !== displayLang) {
      gsap.to('.invitation-text', {
        opacity: 0,
        y: -10,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setDisplayLang(lang);
          gsap.set('.invitation-text', { y: 10 }); // 페이드 인을 위해 위치 재설정
        }
      });
    }
  }, { scope: containerRef, dependencies: [lang] });

  useGSAP(() => {
    // 첫 렌더링 시에는 초기 애니메이션(위의 useGSAP)이 실행되므로 건너뜀
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    gsap.to('.invitation-text', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }, { scope: containerRef, dependencies: [displayLang] });

  return (
    <section id="section-invitation" ref={containerRef} className="scroll-mt-24 w-full py-24 px-8 bg-white flex flex-col items-center text-center">
      <span className="invitation-text text-xs tracking-[0.3em] text-stone-400 mb-12 uppercase block">
        {t('invitation_title', displayLang)}
      </span>
      <div className="invitation-text w-px h-12 bg-stone-200 mb-12" />
      <p className="invitation-text font-serif text-stone-600 leading-loose whitespace-pre-line break-keep text-sm md:text-base">
        {t('invitation_body', displayLang)}
      </p>

      <div className="invitation-text mt-12 w-full max-w-sm text-center space-y-4">
        <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-stone-500 text-sm">
                {t('invitation_groom_parents', displayLang)} <span className="text-stone-800 font-medium text-lg ml-2">{t('invitation_groom_name', displayLang)}</span>
            </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-stone-500 text-sm">
                {t('invitation_bride_parents', displayLang)} <span className="text-stone-800 font-medium text-lg ml-2">{t('invitation_bride_name', displayLang)}</span>
            </p>
        </div>
      </div>

      <div className="invitation-text mt-16 w-full max-w-sm text-center bg-stone-50 p-8 rounded-2xl border border-stone-100">
        <h3 className="text-stone-800 font-medium mb-4 text-base">{t('invitation_rsvp_title', displayLang)}</h3>
        <p className="font-serif text-stone-600 text-sm leading-loose mb-8 whitespace-pre-line">
            {t('invitation_rsvp_body', displayLang).split('**').map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="font-bold text-stone-800">{part}</strong> : part
            )}
        </p>
        <a 
            href="https://forms.gle/xBCpFyGvJLrRXdkWA" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-stone-700 text-white text-sm rounded-full hover:bg-stone-600 transition-colors shadow-sm"
        >
            {t('invitation_rsvp_button', displayLang)}
        </a>
      </div>

      <div className="invitation-text w-px h-12 bg-stone-200 mt-12" />
    </section>
  );
}