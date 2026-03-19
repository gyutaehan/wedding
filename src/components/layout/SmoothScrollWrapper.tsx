import { type ReactNode, useEffect, useState, createContext, useContext } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Props {
  children: ReactNode;
}

const SmoothScrollContext = createContext<Lenis | null>(null);

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export default function SmoothScrollWrapper({ children }: Props) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Lenis 초기화
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    setLenis(lenisInstance);

    // Lenis 스크롤 이벤트를 ScrollTrigger 업데이트에 연결
    lenisInstance.on('scroll', ScrollTrigger.update);

    // GSAP Ticker에 Lenis 연결 (애니메이션 프레임 동기화)
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    // GSAP lag smoothing 비활성화 (Lenis와 충돌 방지)
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => lenisInstance.raf(time * 1000));
      lenisInstance.destroy();
    };
  }, []);

  return <SmoothScrollContext.Provider value={lenis}>{children}</SmoothScrollContext.Provider>;
}
