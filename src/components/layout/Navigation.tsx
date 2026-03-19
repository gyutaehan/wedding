import { useState, useEffect } from 'react';
import { useSmoothScroll } from './SmoothScrollWrapper';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Navigation() {
  const lenis = useSmoothScroll();
  const { lang, setLang, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const sections = document.querySelectorAll('[id^="section-"]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px', // 화면 상단 20% ~ 하단 60% 영역에 들어오면 활성화
        threshold: 0
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const scrollTo = (id: string) => {
    if (lenis) {
      // 해당 ID 위치로 부드럽게 이동
      lenis.scrollTo(id, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
    }
  };

  const toggleLanguage = () => {
    setLang(lang === 'ko' ? 'tw' : 'ko');
  };

  const getButtonClass = (sectionId: string) => {
    const baseClass = "w-full hover:text-stone-900 dark:hover:text-stone-100 transition-colors py-2 relative";
    const activeClass = activeSection === sectionId ? "text-stone-900 dark:text-stone-100 font-semibold" : "text-stone-400 dark:text-stone-500";
    return `${baseClass} ${activeClass}`;
  };

  const ActiveIndicator = ({ sectionId }: { sectionId: string }) => (
    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-stone-800 transition-all duration-300 ${activeSection === sectionId ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
  );

  return (
    <nav 
      className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50"
    >
      <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 py-4 px-1 shadow-sm transition-colors duration-300">
        <ul className="flex flex-row justify-between items-center text-[10px] font-medium tracking-tight text-stone-500 dark:text-stone-400 uppercase whitespace-nowrap">
          <li className="flex-1 text-center"><button onClick={() => scrollTo('#section-invitation')} className={getButtonClass('section-invitation')}>{t('nav_invitation')}<ActiveIndicator sectionId="section-invitation" /></button></li>
          {lang === 'ko' && <li className="flex-1 text-center"><button onClick={() => scrollTo('#section-account')} className={getButtonClass('section-account')}>{t('nav_account')}<ActiveIndicator sectionId="section-account" /></button></li>}
          <li className="flex-1 text-center"><button onClick={() => scrollTo('#section-grid-gallery')} className={getButtonClass('section-grid-gallery')}>{t('nav_gallery')}<ActiveIndicator sectionId="section-grid-gallery" /></button></li>
          <li className="flex-1 text-center"><button onClick={() => scrollTo('#section-dday')} className={getButtonClass('section-dday')}>{t('nav_dday')}<ActiveIndicator sectionId="section-dday" /></button></li>
          <li className="flex-1 text-center"><button onClick={() => scrollTo('#section-location')} className={getButtonClass('section-location')}>{t('nav_location')}<ActiveIndicator sectionId="section-location" /></button></li>
          <li className="flex-1 text-center"><button onClick={toggleLanguage} className="w-full hover:text-stone-900 dark:hover:text-stone-100 transition-colors py-2 font-bold text-xs">{lang === 'ko' ? '🇹🇼' : '🇰🇷'}</button></li>
        </ul>
      </div>
    </nav>
  );
}