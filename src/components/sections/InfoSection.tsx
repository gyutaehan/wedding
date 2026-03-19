import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Car, Train, Phone, Copy } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSmoothScroll } from '../layout/SmoothScrollWrapper';

interface Props {
  onCopy: (msg: string) => void;
}

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

export default function InfoSection({ onCopy }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const transportRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLButtonElement>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isTransportOpen, setIsTransportOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { t, lang } = useLanguage();
  const lenis = useSmoothScroll();
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

  // Animation
  useGSAP(() => {
    gsap.from('.info-item', {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
      },
    });
  }, { scope: containerRef });

  // 언어 변경 시 페이드 아웃 -> 텍스트 변경 -> 페이드 인 애니메이션
  useGSAP(() => {
    if (lang !== displayLang) {
      gsap.to('.info-text', {
        opacity: 0,
        y: -5,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setDisplayLang(lang);
          gsap.set('.info-text', { y: 5 }); // 페이드 인을 위해 위치 재설정
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
    gsap.to('.info-text', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.02,
      ease: 'power2.out'
    });
  }, { scope: containerRef, dependencies: [displayLang] });

  // Auto scroll when transport accordion opens
  useEffect(() => {
    if (isTransportOpen && lenis && transportRef.current) {
      lenis.scrollTo(transportRef.current, {
        offset: -100, // 상단 네비게이션 바 공간 확보
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 4)
      });
    }
  }, [isTransportOpen, lenis]);

  // Auto scroll when account accordion opens
  useEffect(() => {
    if (isAccountOpen && lenis && accountRef.current) {
      lenis.scrollTo(accountRef.current, {
        offset: -100, // 상단 네비게이션 바 공간 확보
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 4)
      });
    }
  }, [isAccountOpen, lenis]);

  const handleCopy = (text: string, message?: string) => {
    navigator.clipboard.writeText(text);
    onCopy(message || t('toast_account_copied'));
  };

  const openGoogleMap = () => {
    window.open('https://www.google.com/maps/place/Amour%E9%98%BF%E6%B2%90%E5%A9%9A%E5%AE%B4%E6%9C%83%E9%A4%A8/@24.9431692,121.2072545,17z/data=!3m1!4b1!4m6!3m5!1s0x346823a8dd7ded09:0xb73295131781b2c5!8m2!3d24.9431692!4d121.2072545!16s%2Fg%2F1tdzj90f?entry=tts&g_ep=EgoyMDI1MTIwOS4wIPu8ASoASAFQAw%3D%3D&skid=872fe9f0-d3e2-44b9-aa4e-29c588bc05da', '_blank');
  };

  return (
    <section ref={containerRef} className="w-full py-24 px-6 bg-[#fcfcfc] flex flex-col items-center gap-20">
      {/* D-Day */}
      <div id="section-dday" className="scroll-mt-24 info-item text-center w-full max-w-md mx-auto">
        <h3 className="info-text text-xs tracking-[0.3em] text-stone-400 mb-8 uppercase">{t('info_dday_title', displayLang)}</h3>
        <div className="flex justify-center gap-6 text-stone-800">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <CountdownItem key={unit} unit={unit} value={value} />
          ))}
        </div>
      </div>

      {/* Location Placeholder */}
      <div id="section-location" className="scroll-mt-24 info-item w-full max-w-md mx-auto">
        <h3 className="info-text text-xs tracking-[0.3em] text-stone-400 mb-8 text-center uppercase">{t('info_location_title', displayLang)}</h3>
        <div 
            className="w-full aspect-video bg-stone-100 rounded-xl overflow-hidden mb-6 shadow-inner cursor-pointer relative group"
            onClick={openGoogleMap}
        >
          <iframe
            title="Wedding Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.674119637962!2d121.20725449999999!3d24.943169200000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346823a8dd7ded09%3A0xb73295131781b2c5!2zQW1vdXLpmL_mspDlqZrlrrTkvJrppKg!5e0!3m2!1sja!2sjp!4v1770978455201!5m2!1sja!2sjp"
            className="pointer-events-none w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-4 py-2 rounded-full text-xs font-medium shadow-sm transition-opacity">
                Google Map
            </span>
          </div>
        </div>
        <div className="text-center space-y-2">
            <p className="info-text font-serif text-xl text-stone-800">{t('info_location_name', displayLang)}</p>
            <p className="info-text text-stone-600 text-sm font-light">{t('info_location_address_kr', displayLang)}</p>
            <p className="info-text text-stone-400 text-xs font-light">{t('info_location_address_en', displayLang)}</p>
        </div>

        {/* Transportation Accordion */}
        <div ref={transportRef} className="mt-10 w-full">
            <button 
                onClick={() => setIsTransportOpen(!isTransportOpen)}
                className="w-full flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors shadow-sm"
            >
                <span className="info-text font-medium text-stone-700 text-sm flex items-center gap-2">
                    {t('transport_toggle_btn', displayLang)}
                </span>
                {isTransportOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isTransportOpen ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-8 bg-stone-50 p-6 rounded-xl border border-stone-100 text-stone-600">
                    
                    {/* Taxi */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 text-stone-800 font-medium text-base">
                            <Car className="w-5 h-5" />
                            <h4 className="info-text">{t('transport_taxi_title', displayLang)}</h4>
                        </div>
                        <ul className="list-disc list-inside space-y-2 ml-1 text-sm leading-relaxed text-stone-600">
                            <li className="info-text">{t('transport_taxi_time', displayLang)}</li>
                            <li className="info-text">{t('transport_taxi_cost', displayLang)}</li>
                            <li className="info-text">{t('transport_taxi_uber', displayLang)}</li>
                        </ul>
                        
                        {/* Driver Card */}
                        <div className="mt-4 bg-white p-5 rounded-lg border border-stone-200 shadow-sm">
                            <p className="info-text text-xs text-stone-400 mb-2 uppercase tracking-wider">{t('transport_driver_label', displayLang)}</p>
                            <p className="info-text text-lg font-medium text-stone-800 whitespace-pre-line leading-loose">
                                {t('transport_driver_address', displayLang)}
                            </p>
                            <button 
                                onClick={() => handleCopy(t('transport_driver_address', displayLang), '주소가 복사되었습니다.')}
                                className="mt-4 w-full py-3 text-sm bg-stone-100 hover:bg-stone-200 rounded text-stone-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <Copy className="w-4 h-4" /> <span className="info-text">{t('info_copy', displayLang)}</span>
                            </button>
                        </div>
                    </div>

                    <div className="w-full h-px bg-stone-200" />

                    {/* Public Transport */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 text-stone-800 font-medium text-base">
                            <Train className="w-5 h-5" />
                            <h4 className="info-text">{t('transport_public_title', displayLang)}</h4>
                        </div>
                        <p className="info-text text-sm leading-loose text-stone-600">
                            {t('transport_public_desc', displayLang)}
                        </p>
                    </div>

                    <div className="w-full h-px bg-stone-200" />

                    {/* Contact */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 text-stone-800 font-medium text-base">
                            <Phone className="w-5 h-5" />
                            <h4 className="info-text">{t('transport_contact_title', displayLang)}</h4>
                        </div>
                        <div className="text-sm space-y-2 text-stone-600">
                            <p><strong>신랑 한규태</strong>: 010-5707-0863</p>
                            <p>KakaoTalk: kantmuyu</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Account */}
      <div id="section-account" className="scroll-mt-24 info-item w-full max-w-md mx-auto">
        {displayLang === 'ko' && (
          <>
            <h3 className="info-text text-xs tracking-[0.3em] text-stone-400 mb-8 text-center uppercase">{t('info_account_title', displayLang)}</h3>
            
            <button 
                ref={accountRef}
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="w-full flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors shadow-sm"
            >
                <span className="info-text font-medium text-stone-700 text-sm">
                    {t('account_toggle_btn', displayLang)}
                </span>
                {isAccountOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isAccountOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-stone-100">
                  {/* Father */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="info-text text-xs text-stone-400 block mb-1">{t('info_father', displayLang)}</span>
                      <span className="font-medium text-stone-600">신한은행 110-374-581541</span>
                      <span className="info-text text-xs text-stone-400 ml-2">{t('account_groom_name', displayLang)}</span>
                    </div>
                    <button 
                        onClick={() => handleCopy('110374581541')}
                        className="px-3 py-1.5 text-xs border border-stone-200 rounded-full hover:bg-stone-50 transition-colors text-stone-500"
                    >
                      <span className="info-text">{t('info_copy', displayLang)}</span>
                    </button>
                  </div>

                  {/* Mother */}
                  {import.meta.env.VITE_APP_VERSION === 'common' && (
                  <>
                  <div className="border-t border-stone-100 w-full my-6" />
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="info-text text-xs text-stone-400 block mb-1">{t('info_mother', displayLang)}</span>
                      <span className="font-medium text-stone-600">{t('account_groom_mother_account', displayLang)}</span>
                      <span className="info-text text-xs text-stone-400 ml-2">{t('account_groom_mother_name', displayLang)}</span>
                    </div>
                    <button 
                        onClick={() => handleCopy('11240104031863')}
                        className="px-3 py-1.5 text-xs border border-stone-200 rounded-full hover:bg-stone-50 transition-colors text-stone-500"
                    >
                      <span className="info-text">{t('info_copy', displayLang)}</span>
                    </button>
                  </div>
                  </>
                  )}

                  <div className="border-t border-stone-100 w-full my-6" />

                  {/* Groom */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="info-text text-xs text-stone-400 block mb-1">{t('info_groom', displayLang)}</span>
                      <span className="font-medium text-stone-600">{t('account_groom_self_account', displayLang)}</span>
                      <span className="info-text text-xs text-stone-400 ml-2">{t('account_groom_self_name', displayLang)}</span>
                    </div>
                    <button 
                        onClick={() => handleCopy('30491066092807')}
                        className="px-3 py-1.5 text-xs border border-stone-200 rounded-full hover:bg-stone-50 transition-colors text-stone-500"
                    >
                      <span className="info-text">{t('info_copy', displayLang)}</span>
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
