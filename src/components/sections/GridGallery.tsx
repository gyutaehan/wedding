import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useSmoothScroll } from '../layout/SmoothScrollWrapper';
import { IMAGES } from './ArtisticGallery';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../contexts/LanguageContext';

export default function GridGallery() {
  const lenis = useSmoothScroll();
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useGSAP(() => {
    // 초기 상태: 투명하고 약간 아래로 설정
    gsap.set('.grid-item', { y: 20, opacity: 0 });

    // ScrollTrigger.batch를 사용하여 화면에 들어오는 요소만 그룹지어 애니메이션
    ScrollTrigger.batch('.grid-item', {
      interval: 0.1,
      batchMax: 15, // 한 번에 3줄(15개) 정도씩 처리
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: true,
        });
      },
      start: 'top 92%', // 화면 하단에 걸치면 시작
    });
  }, { scope: containerRef });

  const handleImageClick = (index: number) => {
    // ArtisticGallery의 ScrollTrigger 정보를 가져옴
    const trigger = ScrollTrigger.getById('gallery-trigger');
    
    if (trigger && lenis) {
      // 해당 이미지가 보이는 스크롤 위치 계산
      // 시작점 + (전체길이 * (인덱스 / (전체개수 - 1)))
      const total = IMAGES.length;
      const progress = index / (total - 1);
      const scrollPos = trigger.start + (trigger.end - trigger.start) * progress;
      
      // 부드럽게 스크롤 이동
      lenis.scrollTo(scrollPos, { 
        duration: 2, 
        easing: (t) => 1 - Math.pow(1 - t, 4) // easeOutQuart
      });
    }
  };

  return (
    <section id="section-grid-gallery" ref={containerRef} className="scroll-mt-24 w-full py-24 px-4 bg-white flex flex-col items-center">
      <div className="text-center mb-12">
        <h2 className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-3">{t('grid_subtitle')}</h2>
        <p className="font-serif text-2xl text-stone-800">{t('grid_title')}</p>
      </div>
      
      <div className="grid grid-cols-5 gap-1.5 w-full max-w-md px-2 mx-auto">
        {IMAGES.map((src, i) => (
          <button 
            key={i} 
            onClick={() => handleImageClick(i)}
            className="grid-item relative aspect-square group cursor-pointer block w-full bg-white p-0.5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="w-full h-full overflow-hidden relative">
              <img 
                src={src.replace('gallery/optimized/', 'gallery/thumbnails/')} 
                alt={`Thumbnail ${i}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}