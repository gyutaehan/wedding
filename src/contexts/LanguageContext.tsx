import { createContext, useContext, useState, type ReactNode } from 'react';

export type Language = 'ko' | 'tw';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, specificLang?: Language) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ko: {
    nav_location: '오시는길',
    nav_gallery: '갤러리',
    nav_invitation: '초대의글',
    nav_account: '마음전하는곳',
    nav_dday: '디데이',
    hero_subtitle: 'The Wedding Of',
    hero_date: '2026. 05. 03',
    hero_groom: '규태',
    hero_bride: '유리',
    gallery_subtitle: 'Our Moments',
    grid_subtitle: 'All Moments',
    grid_title: 'Gallery Index',
    info_dday_title: 'The Day',
    info_location_title: 'Location',
    info_location_name: 'Amour 웨딩컨벤션',
    info_location_address_kr: '대만 타오위안시 핑전구 옌핑로 2단 371호',
    info_location_address_en: 'No. 371, Sec. 2, Yanping Rd, Pingzhen Dist., Taoyuan City',
    info_account_title: '마음 전하는 곳',
    account_toggle_btn: '계좌번호 보기',
    info_groom_side: '신랑측',
    info_groom: '신랑',
    info_father: '신랑 아버지',
    info_mother: '신랑 어머니',
    info_groom_father: '신랑측 혼주',
    info_bride: '신부',
    info_copy: 'Copy',
    info_share_kakao: '카카오톡으로 공유하기',
    info_share_line: '라인으로 공유하기',
    info_share_link: '링크 복사하기',
    share_section_title: '공유하기',
    share_instruction: '소중한 분들과 공유해주세요',
    toast_account_copied: '계좌번호가 복사되었습니다.',
    toast_link_copied: '링크가 복사되었습니다.',
    share_title: '한규태 & 사유리 결혼합니다',
    share_desc: '2026년 5월 3일 Amour 웨딩컨벤션',
    account_groom_name: '(한동제)',
    account_groom_mother_name: '(오현숙)',
    account_groom_mother_account: '국민은행 112401-04-031863',
    account_bride_name: '(사유리)',
    account_groom_self_name: '(한규태)',
    account_groom_self_account: '하나은행 304-910660-92807',
    invitation_title: '초대의 글',
    invitation_body: `저희 두 사람이 서로의 곁을 지키는 반려자가 되어\n대만에서 작은 결혼식을 올리게 되었습니다.\n\n직접 찾아뵙고 인사를 드리는 것이 도리이나,\n거리상의 제약으로 이렇게 서면으로 소식을 대신하게 되었습니다.\n\n먼 곳에서 열리는 예식인 만큼\n참석이 어려우신 점 충분히 이해하고 있습니다.\n\n직접 모시지 못하는 마음이 무겁지만,\n멀리서나마 저희의 앞날을 축복해 주시는 마음만으로도\n충분히 행복합니다.\n\n보내주시는 따뜻한 격려 잊지 않고\n예쁘게 잘 살겠습니다.`,
    invitation_groom_parents: '한동제 · 오현숙 의 장남',
    invitation_groom_name: '한규태',
    invitation_bride_parents: '사기지 · 강숙미 의 장녀',
    invitation_bride_name: '사유리',
    invitation_rsvp_title: '🗓️ 참석 여부 회신',
    invitation_rsvp_body: '해외 예식의 특성상 정확한 인원 파악이 필요하여,\n**참석이 가능하신 분들께서는**\n링크를 통해 성함과 연락처를 남겨주시면 감사하겠습니다.',
    invitation_rsvp_button: '참석 정보 남기기',
    transport_toggle_btn: '✈️ 타오위안 공항에서 오시는 길 (교통편 안내)',
    transport_taxi_title: '택시 / 우버 (권장)',
    transport_taxi_time: '소요 시간: 약 25분 ~ 30분',
    transport_taxi_cost: '예상 비용: 약 900 ~ 1100 TWD',
    transport_taxi_uber: "우버(Uber) 앱에서 'Amour 阿沐' 검색",
    transport_driver_label: '🚕 기사님께 이 주소를 보여주세요',
    transport_driver_address: '請帶我去：阿沐婚宴會館\n(桃園市平鎮區延平路二段371號)',
    transport_public_title: '대중교통 (MRT + 버스)',
    transport_public_desc: '공항 MRT 탑승 후 Laojie River(A22)역 하차 → 버스 환승 (구글맵 확인 필수)',
    transport_contact_title: '도움이 필요하시면 연락주세요',
    guestbook_title: '방명록',
    guestbook_name: '이름',
    guestbook_password: '비밀번호',
    guestbook_message: '축하 메시지를 남겨주세요',
    guestbook_submit: '등록하기',
    guestbook_delete_confirm: '메시지를 삭제하시겠습니까? 비밀번호를 입력해주세요.',
    guestbook_password_incorrect: '비밀번호가 일치하지 않습니다.',
    guestbook_empty_error: '이름과 메시지를 입력해주세요.',
    guestbook_load_more: '더 보기',
  },
  tw: {
    nav_location: '交通資訊',
    nav_gallery: '婚紗相簿',
    nav_invitation: '邀請函',
    nav_account: '送上祝福',
    nav_dday: '倒數',
    hero_subtitle: '婚禮邀請',
    hero_date: '2026. 05. 03',
    hero_groom: '糾兌',
    hero_bride: '昀庭',
    gallery_subtitle: '幸福瞬間',
    grid_subtitle: '所有照片',
    grid_title: '相簿一覽',
    info_dday_title: '婚禮倒數',
    info_location_title: '婚禮場地',
    info_location_name: 'Amour 阿沐會館',
    info_location_address_kr: '桃園市平鎮區延平路二段371號',
    info_location_address_en: 'No. 371, Sec. 2, Yanping Rd, Pingzhen Dist., Taoyuan City',
    info_account_title: '送上祝福',
    account_toggle_btn: '查看帳戶號碼',
    info_groom_side: '男方',
    info_groom: '新郎',
    info_father: '父親',
    info_mother: '母親',
    info_groom_father: '新郎父親',
    info_bride: '新娘',
    info_copy: '複製',
    info_share_kakao: '分享到 KakaoTalk',
    info_share_line: '分享到 LINE',
    info_share_link: '複製連結',
    share_section_title: '分享',
    share_instruction: '請與您的親朋好友分享',
    toast_account_copied: '帳號已複製。',
    toast_link_copied: '連結已複製。',
    share_title: '韓糾兌 & 謝昀庭 的Wedding',
    share_desc: '2026年 5月 3日 Amour 阿沐會館',
    account_groom_name: '(韓同堤)',
    account_groom_mother_name: '(吳賢淑)',
    account_groom_mother_account: '銀行帳號',
    account_bride_name: '(謝昀庭)',
    account_groom_self_name: '(韓糾兌)',
    account_groom_self_account: '하나은행 304-910660-92807',
    invitation_title: '邀請函',
    invitation_body: `我們兩人將成為彼此的終身伴侶，\n在美麗的台灣舉行小型婚禮。\n\n本應親自拜訪問候，\n但因距離限制，只能以此形式代為通知。\n\n我們充分理解，\n由於婚禮在遠方舉行，您可能難以出席。\n\n雖然無法親自招待深感抱歉，\n但只要有您在遠方為我們的未來祝福，\n我們就感到無比幸福。\n\n我們不會忘記您的溫暖鼓勵，\n會幸福地生活下去。`,
    invitation_groom_parents: '韓同堤 · 吳賢淑 之長子',
    invitation_groom_name: '韓糾兌',
    invitation_bride_parents: '謝奇志 · 江淑美 之長女',
    invitation_bride_name: '謝昀庭',
    invitation_rsvp_title: '🗓️ 出席確認',
    invitation_rsvp_body: '由於海外婚禮需要準確統計人數，\n**若您能夠出席**，\n請透過連結留下您的姓名與聯絡方式，非常感謝。',
    invitation_rsvp_button: '填寫出席確認表',
    transport_toggle_btn: '✈️ 交通指引',
    transport_taxi_title: '計程車 / Uber (推薦)',
    transport_taxi_time: '車程：約 25 ~ 30 分鐘',
    transport_taxi_cost: '預估費用：約 900 ~ 1100 TWD',
    transport_taxi_uber: "Uber 搜尋 'Amour 阿沐'",
    transport_driver_label: '🚕 給司機看的地址',
    transport_driver_address: '請帶我去：阿沐婚宴會館\n(桃園市平鎮區延平路二段371號)',
    transport_public_title: '大眾運輸 (MRT + 公車)',
    transport_public_desc: '搭乘機場捷運至老街溪站(A22)下車 → 轉乘公車',
    transport_contact_title: '聯絡我們',
    guestbook_title: '留言板',
    guestbook_name: '姓名',
    guestbook_password: '密碼',
    guestbook_message: '請留下您的祝福',
    guestbook_submit: '送出',
    guestbook_delete_confirm: '確定要刪除留言嗎？請輸入密碼。',
    guestbook_password_incorrect: '密碼錯誤。',
    guestbook_empty_error: '請輸入姓名和留言。',
    guestbook_load_more: '載入更多',
  }
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ko');

  const t = (key: string, specificLang?: Language) => {
    let text = translations[specificLang || lang][key] || key;

    // 빌드 시점에 주입된 환경 변수에 따라 텍스트 변경
    if (import.meta.env.VITE_APP_VERSION === 'somi') {
      text = text.replace('오현숙', '강소미');
      text = text.replace('吳賢淑', 'Gang Somi');
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
