import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { IMAGES } from './ArtisticGallery';
import { useLanguage } from '../../contexts/LanguageContext';
import ProgressiveImage from '../ui/ProgressiveImage';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { t, lang } = useLanguage();
  const [displayLang, setDisplayLang] = useState(lang);
  const isFirstRender = useRef(true);

  useGSAP(() => {
    const tl = gsap.timeline();
    const slides = gsap.utils.toArray<HTMLElement>('.hero-slide');

    // 1. 슬라이드쇼 초기 설정
    gsap.set(slides, { opacity: 0, scale: 1.1 });
    gsap.set(slides[0], { opacity: 1, scale: 1 });

    // 2. 슬라이드쇼 루프 애니메이션
    const slideTl = gsap.timeline({ repeat: -1 });
    slides.forEach((slide, i) => {
      const nextSlide = slides[(i + 1) % slides.length];
      
      slideTl
        .to(nextSlide, { 
          opacity: 1, 
          scale: 1, 
          duration: 2, 
          ease: 'power2.inOut' 
        }, '+=3') // 3초 대기 후 전환
        .set(slide, { opacity: 0, scale: 1.1 }); // 이전 슬라이드 초기화
    });

    // 2. 텍스트 Stagger 등장 (이미지 애니메이션 중간부터 시작)
    tl.from(
      '.hero-text',
      {
        y: 50,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power3.out',
      },
      '-=1.5'
    );

    // 3. 스크롤 인디케이터 애니메이션
    gsap.to('.scroll-indicator', {
      y: 10,
      opacity: 0.8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }, { scope: containerRef });

  // 언어 변경 시 페이드 아웃 -> 텍스트 변경 -> 페이드 인 애니메이션
  useGSAP(() => {
    if (lang !== displayLang) {
      gsap.to('.hero-text', {
        opacity: 0,
        y: -10,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setDisplayLang(lang);
          gsap.set('.hero-text', { y: 10 }); // 페이드 인을 위해 위치 재설정
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
    gsap.to('.hero-text', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }, { scope: containerRef, dependencies: [displayLang] });

  return (
    <section ref={containerRef} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        {IMAGES.map((src, i) => (
          <div key={i} className="hero-slide absolute inset-0 w-full h-full">
            <ProgressiveImage
              src={src}
              placeholder={src.replace('gallery/optimized/', 'gallery/thumbnails/')}
              alt={`Hero Slide ${i}`}
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-stone-900/40" /> {/* Dim overlay */}
      </div>

      {/* Text Content */}
      <div className="relative z-10 text-center text-white px-6 drop-shadow-lg">
        <p className={`hero-text text-sm tracking-[0.3em] mb-4 uppercase ${displayLang === 'tw' ? 'font-serif' : 'font-sans'}`}>{t('hero_subtitle', displayLang)}</p>
        <h1 ref={titleRef} className={`hero-text text-4xl md:text-6xl mb-6 leading-tight ${displayLang === 'tw' ? 'font-serif font-medium tracking-[0.15em]' : 'font-serif font-light'}`}>
          {t('hero_groom', displayLang)}<br />&<br />{t('hero_bride', displayLang)}
        </h1>
        <div className="hero-text w-px h-16 bg-white mx-auto my-6 opacity-50" />
        <p className="hero-text text-lg font-light tracking-widest">
          {t('hero_date', displayLang)}
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 text-white/80 flex flex-col items-center gap-2 z-10 opacity-0">
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
