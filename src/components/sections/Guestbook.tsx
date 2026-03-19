import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp, limit, type Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { Trash2 } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Message {
  id: string;
  name: string;
  message: string;
  password?: string;
  createdAt: Timestamp;
}

export default function Guestbook() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [limitCount, setLimitCount] = useState(5);

  // 실시간 데이터 동기화
  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'), limit(limitCount));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [limitCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      alert(t('guestbook_empty_error'));
      return;
    }

    setIsSubmitting(true);
    try {
      // 네트워크 문제로 응답이 없을 경우를 대비해 5초 타임아웃 추가
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      await Promise.race([
        addDoc(collection(db, 'guestbook'), {
          name,
          message,
          password,
          createdAt: serverTimestamp()
        }),
        timeoutPromise
      ]);

      setName('');
      setMessage('');
      setPassword('');
      setIsSubmitting(false);
      setTimeout(() => alert('메시지가 등록되었습니다.'), 0);
    } catch (error) {
      console.error("Error adding document: ", error);
      setIsSubmitting(false);
      setTimeout(() => alert('메시지 등록에 실패했습니다. 네트워크 연결이나 Firebase 설정을 확인해주세요.'), 0);
    }
  };

  const handleDelete = async (id: string, msgPassword?: string) => {
    const inputPwd = prompt(t('guestbook_delete_confirm'));
    if (inputPwd === msgPassword) {
      await deleteDoc(doc(db, 'guestbook', id));
    } else if (inputPwd !== null) {
      alert(t('guestbook_password_incorrect'));
    }
  };

  useGSAP(() => {
    ScrollTrigger.batch('.guestbook-item', {
      onEnter: (batch) => {
        // 이미 애니메이션된 항목은 건너뛰어 깜빡임 방지
        const newItems = batch.filter(item => !item.hasAttribute('data-animated'));
        
        if (newItems.length > 0) {
          gsap.from(newItems, {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power2.out',
            onStart: () => {
              newItems.forEach(item => item.setAttribute('data-animated', 'true'));
            }
          });
        }
      },
      start: 'top 90%',
    });
  }, { scope: containerRef, dependencies: [messages] });

  return (
    <section ref={containerRef} className="w-full py-12 px-6 bg-white flex flex-col items-center">
      <h3 className="text-xs tracking-[0.3em] text-stone-400 mb-12 uppercase">{t('guestbook_title')}</h3>
      
      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-stone-100 mb-16 space-y-6">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('guestbook_name')}
            className="flex-1 py-2 border-b border-stone-200 text-sm outline-none focus:border-stone-400 transition-colors bg-transparent placeholder:text-stone-300"
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('guestbook_password')}
            className="w-1/3 py-2 border-b border-stone-200 text-sm outline-none focus:border-stone-400 transition-colors bg-transparent placeholder:text-stone-300"
          />
        </div>
        <textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('guestbook_message')}
          className="w-full py-2 border-b border-stone-200 text-sm outline-none focus:border-stone-400 h-24 resize-none transition-colors bg-transparent placeholder:text-stone-300"
        />
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-stone-800 text-white rounded-lg text-sm hover:bg-stone-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '등록 중...' : t('guestbook_submit')}
        </button>
      </form>

      {/* 메시지 목록 */}
      <div className="w-full max-w-md space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="guestbook-item bg-white p-5 rounded-xl border border-stone-100 shadow-sm relative group">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-stone-800">{msg.name}</span>
              <span className="text-[10px] text-stone-400">
                {msg.createdAt?.toDate().toLocaleDateString()}
              </span>
            </div>
            <p className="text-stone-600 text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
            <button 
              onClick={() => handleDelete(msg.id, msg.password)}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-stone-300 hover:text-red-400 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* 더 보기 버튼 */}
      {messages.length >= limitCount && (
        <button 
          onClick={() => setLimitCount(prev => prev + 5)}
          className="mt-8 px-6 py-2 text-sm text-stone-500 border border-stone-200 rounded-full hover:bg-stone-100 transition-colors"
        >
          {t('guestbook_load_more')}
        </button>
      )}
    </section>
  );
}
