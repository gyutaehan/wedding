import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSmoothScroll } from '../layout/SmoothScrollWrapper';

interface Props {
  onCopy: (msg: string) => void;
}

export default function AccountSection({ onCopy }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLButtonElement>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { t, lang } = useLanguage();
  const lenis = useSmoothScroll();
  const [displayLang, setDisplayLang] = useState(lang);
  const isFirstRender = useRef(true);

  const isFatherVersion = import.meta.env.VITE_APP_VERSION !== 'somi' && import.meta.env.VITE_APP_VERSION !== 'common';
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const isFriends = urlParams.get('v') === 'friends';
  const showAccount = !(isFatherVersion && isFriends);

  // Language Animation
  useGSAP(() => {
    if (lang !== displayLang) {
      gsap.to('.account-text', {
        opacity: 0,
        y: -5,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setDisplayLang(lang);
          gsap.set('.account-text', { y: 5 });
        }
      });
    }
  }, { scope: containerRef, dependencies: [lang] });

  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    gsap.to('.account-text', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.02,
      ease: 'power2.out'
    });
  }, { scope: containerRef, dependencies: [displayLang] });

  // Auto scroll
  useEffect(() => {
    if (isAccountOpen && lenis && accountRef.current) {
      lenis.scrollTo(accountRef.current, {
        offset: -100,
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 4)
      });
    }
  }, [isAccountOpen, lenis]);

  const handleCopy = (text: string, message?: string) => {
    navigator.clipboard.writeText(text);
    onCopy(message || t('toast_account_copied'));
  };

  if (!showAccount) return null;

  return (
    <section id="section-account" ref={containerRef} className="scroll-mt-24 w-full py-24 px-6 bg-stone-50 flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        {displayLang === 'ko' && (
          <>
            <h3 className="account-text text-xs tracking-[0.3em] text-stone-400 mb-8 text-center uppercase">{t('info_account_title', displayLang)}</h3>
            
            <button 
                ref={accountRef}
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="w-full flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors shadow-sm"
            >
                <span className="account-text font-medium text-stone-700 text-sm">
                    {t('account_toggle_btn', displayLang)}
                </span>
                {isAccountOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isAccountOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-stone-100">
                  <div className="text-center mb-6">
                    <span className="account-text text-sm font-medium text-stone-500 tracking-widest">{t('info_groom_side', displayLang)}</span>
                  </div>
                  {/* Father */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="account-text text-xs text-stone-400 block mb-1">{t('info_father', displayLang)}</span>
                      <span className="font-medium text-stone-600">신한은행 110-374-581541</span>
                      <span className="account-text text-xs text-stone-400 ml-2">{t('account_groom_name', displayLang)}</span>
                    </div>
                    <button 
                        onClick={() => handleCopy('110374581541')}
                        className="px-3 py-1.5 text-xs border border-stone-200 rounded-full hover:bg-stone-50 transition-colors text-stone-500"
                    >
                      <span className="account-text">{t('info_copy', displayLang)}</span>
                    </button>
                  </div>

                  {/* Mother */}
                  {import.meta.env.VITE_APP_VERSION === 'common' && (
                  <>
                  <div className="border-t border-stone-100 w-full my-6" />
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="account-text text-xs text-stone-400 block mb-1">{t('info_mother', displayLang)}</span>
                      <span className="font-medium text-stone-600">{t('account_groom_mother_account', displayLang)}</span>
                      <span className="account-text text-xs text-stone-400 ml-2">{t('account_groom_mother_name', displayLang)}</span>
                    </div>
                    <button 
                        onClick={() => handleCopy('11240104031863')}
                        className="px-3 py-1.5 text-xs border border-stone-200 rounded-full hover:bg-stone-50 transition-colors text-stone-500"
                    >
                      <span className="account-text">{t('info_copy', displayLang)}</span>
                    </button>
                  </div>
                  </>
                  )}

                  <div className="border-t border-stone-100 w-full my-6" />

                  {/* Groom */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="account-text text-xs text-stone-400 block mb-1">{t('info_groom', displayLang)}</span>
                      <span className="font-medium text-stone-600">{t('account_groom_self_account', displayLang)}</span>
                      <span className="account-text text-xs text-stone-400 ml-2">{t('account_groom_self_name', displayLang)}</span>
                    </div>
                    <button 
                        onClick={() => handleCopy('30491066092807')}
                        className="px-3 py-1.5 text-xs border border-stone-200 rounded-full hover:bg-stone-50 transition-colors text-stone-500"
                    >
                      <span className="account-text">{t('info_copy', displayLang)}</span>
                    </button>
                  </div>
                </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}