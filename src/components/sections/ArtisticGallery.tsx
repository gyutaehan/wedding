import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useSmoothScroll } from '../layout/SmoothScrollWrapper';
import { useLanguage } from '../../contexts/LanguageContext';
import ProgressiveImage from '../ui/ProgressiveImage';

const TOTAL_IMAGES = 10;
export const IMAGES = Array.from({ length: TOTAL_IMAGES }, (_, i) => `gallery/optimized/${i + 1}.jpg`);

// 사진 분위기에 맞춘 은은한 배경색 팔레트
const BG_COLORS = [
  '#f5f5f4', // stone-100 (따뜻한 회색)
  '#fff1f2', // rose-50 (연한 장미색)
  '#f8fafc', // slate-50 (차분한 하늘색)
  '#fff7ed', // orange-50 (따뜻한 아이보리)
  '#f0fdf4', // green-50 (싱그러운 연두색)
  '#fafaf9', // stone-50 (밝은 회색)
];

export default function ArtisticGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lenis = useSmoothScroll();
  const { t } = useLanguage();

  const handleImageClick = () => {
    if (lenis) {
      // GridGallery 섹션으로 부드럽게 이동
      lenis.scrollTo('#section-grid-gallery', { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
    }
  };

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.gallery-card', containerRef.current);

    // 초기 배경색 설정
    gsap.set(containerRef.current, { backgroundColor: BG_COLORS[0] });

    // 초기 상태: 첫 번째 카드만 보이고 나머지는 숨김 (작게 축소 + 투명)
    cards.forEach((card, i) => {
      if (i > 0) {
        gsap.set(card, { scale: 0.2, opacity: 0, rotation: 15 });
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'gallery-trigger', // 외부에서 이 트리거를 찾기 위한 ID
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${window.innerHeight * cards.length * 0.5}`,
        invalidateOnRefresh: true,
      },
    });

    // 순차적으로 전환 애니메이션 구성
    cards.forEach((card, i) => {
      if (i === 0) return;
      const prevCard = cards[i - 1];

      // 1. 이전 카드는 뒤로 물러나며 사라짐
      tl.to(prevCard, {
        scale: 0.2,
        opacity: 0,
        rotation: -15,
        duration: 1,
        ease: 'power2.inOut',
      })
      // 2. 현재 카드는 앞으로 튀어나옴 (Elastic 효과)
      .to(card, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1,
        ease: 'back.out(1.7)', // 튀어나오는 느낌
      }, '-=0.8')
      // 3. 배경색 변경 (사진 분위기에 맞춰 전환)
      .to(containerRef.current, {
        backgroundColor: BG_COLORS[i % BG_COLORS.length],
        duration: 1,
        ease: 'power1.inOut',
      }, '-=1'); // 카드 전환과 자연스럽게 섞이도록 타이밍 조절
    });

  }, { scope: containerRef });

  return (
    <section id="section-gallery" ref={containerRef} className="relative w-full h-screen overflow-hidden">
      <div className="absolute top-8 left-0 w-full text-center z-20 pointer-events-none">
        <h2 className="text-sm tracking-[0.3em] text-stone-500 uppercase">{t('gallery_subtitle')}</h2>
      </div>
      
      <div ref={wrapperRef} className="relative w-full h-full">
        {IMAGES.map((src, index) => (
          <div
            key={index}
            className="gallery-card absolute top-0 left-0 w-full h-full flex items-center justify-center p-6"
            onClick={handleImageClick}
            style={{ 
                zIndex: index + 1,
            }}
          >
            <div className="relative w-full max-w-[85%] aspect-[3/4] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl bg-white p-3">
                <div className="w-full h-full overflow-hidden relative rounded-xl">
                    <ProgressiveImage
                        src={src}
                        placeholder={src.replace('gallery/optimized/', 'gallery/thumbnails/')}
                        alt={`Gallery ${index}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
