import { useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import { LanguageProvider } from './contexts/LanguageContext';
import SmoothScrollWrapper from './components/layout/SmoothScrollWrapper';
import Navigation from './components/layout/Navigation';
import Hero from './components/sections/Hero';
import Invitation from './components/sections/Invitation';
import ArtisticGallery from './components/sections/ArtisticGallery';
import DDaySection from './components/sections/DDaySection';
import LocationSection from './components/sections/LocationSection';
import AccountSection from './components/sections/AccountSection';
import Toast from './components/ui/Toast';
import Guestbook from './components/sections/Guestbook';
import ShareSection from './components/sections/ShareSection';
import GridGallery from './components/sections/GridGallery';

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger, useGSAP);

function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <LanguageProvider>
      <SmoothScrollWrapper>
        <main className="w-full max-w-md mx-auto min-h-screen bg-stone-50 text-stone-800 font-serif overflow-hidden selection:bg-stone-200 shadow-2xl">
          {/* Navigation: 상단 고정 메뉴 */}
          <Navigation />

          {/* 1. Hero Section: 첫 인상 */}
          <Hero />

          {/* 1.5. Invitation: 초대의 글 */}
          <Invitation />

          {/* 5. Account Section */}
          <AccountSection onCopy={showToast} />

          {/* 2. Artistic Gallery: 시각적 경험 */}
          <ArtisticGallery />

          {/* 2.5. Grid Gallery: 전체 보기 및 이동 */}
          <GridGallery />

          {/* 3. D-Day Section */}
          <DDaySection />

          {/* 4. Location Section */}
          <LocationSection onCopy={showToast} />

          {/* 3.5. Guestbook: 방명록 */}
          {import.meta.env.VITE_APP_VERSION !== 'somi' && <Guestbook />}

          {/* 3.8. Share: 공유하기 */}
          <ShareSection onCopy={showToast} />

          {/* 4. Footer Message */}
          <footer className="py-10 text-center text-xs text-stone-400 opacity-60">
            <p>Developed By 한규태</p>
          </footer>

          {/* UI Elements */}
          {toastMessage && <Toast message={toastMessage} />}
        </main>
      </SmoothScrollWrapper>
    </LanguageProvider>
  );
}

export default App;
