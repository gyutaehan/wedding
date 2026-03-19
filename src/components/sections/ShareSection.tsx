import { useState, useRef } from 'react';
import { Link } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useLanguage } from '../../contexts/LanguageContext';

interface Props {
  onCopy: (msg: string) => void;
}

export default function ShareSection({ onCopy }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useLanguage();
  const [displayLang, setDisplayLang] = useState(lang);
  const isFirstRender = useRef(true);

  // 언어 변경 시 페이드 아웃 -> 텍스트 변경 -> 페이드 인 애니메이션
  useGSAP(() => {
    if (lang !== displayLang) {
      gsap.to('.share-text', {
        opacity: 0,
        y: -5,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setDisplayLang(lang);
          gsap.set('.share-text', { y: 5 });
        }
      });
    }
  }, { scope: containerRef, dependencies: [lang] });

  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    gsap.to('.share-text', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.02,
      ease: 'power2.out'
    });
  }, { scope: containerRef, dependencies: [displayLang] });

  // 공유할 링크 설정 (여기에 실제 배포된 주소를 입력하면 고정된 링크로 공유됩니다)
  const shareUrl = import.meta.env.VITE_APP_VERSION === 'somi' 
    ? 'https://kantmuyu.synology.me/wedding/' 
    : import.meta.env.VITE_APP_VERSION === 'common'
    ? 'https://yuntingyutae.redirectme.net/'
    : 'https://gyutaehan.github.io/wedding/'; // fath 및 기본값

  const handleCopy = (text: string, message?: string) => {
    navigator.clipboard.writeText(text);
    onCopy(message || t('toast_link_copied'));
  };

  return (
    <section ref={containerRef} className="w-full py-20 px-6 bg-[#f5f5f4] flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        <h3 className="share-text text-xs tracking-[0.3em] text-stone-400 mb-8 text-center uppercase">{t('share_section_title', displayLang)}</h3>
        <div className="flex justify-center gap-6">
          <button
            onClick={() => handleCopy(shareUrl, t('toast_link_copied', displayLang))}
            className="w-12 h-12 bg-white text-stone-600 rounded-full flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm relative group"
            aria-label={t('info_share_link', displayLang)}
          >
            <Link className="w-5 h-5" />
            <span className="share-text absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {t('info_share_link', displayLang)}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}