// src/components/calls/constants.ts

export const COLORS = {
  bg: '#F1F4F9',
  panelBg: '#EAEDF6',
  panelBorder: '#FFFFFF',
  inputBg: '#F2F2F2',
  text: '#000000',
  textMuted: '#7C7D7E',
  danger: '#D72229',
  success: '#4CAF50',
  white: '#FFFFFF',
  swipeTrack: '#DEE1EA',
} as const;

export const RADIUS = {
  card: '28px',
  input: '18px',
  button: '20px',
  pill: '30px',
  endBtn: '38.5px',
} as const;

export const FONT = {
  cairo: 'Cairo, sans-serif',
  inter: 'Inter, sans-serif',
} as const;

export const IMAGES = {
  defaultAvatar: '/imgs/user.png',
  endCall: '/imgs/call.svg',
  back: '/imgs/Back.svg',
  search: '/imgs/GlobalSearch.svg',
  checked: '/imgs/check (2).svg',
  unchecked: '/imgs/uncheck.svg',
} as const;

export const CALL_STATUS_LABEL: Record<string, string> = {
  connected: 'مكالمة جارية',
  calling: 'جاري الاتصال...',
  ringing: 'مكالمة واردة',
  idle: 'مكالمة صوتية',
  rejected: 'تم رفض المكالمة', 
   missed: 'لم يتم الرد', 
    ended: 'تم انتهاء الاتصال', 
};

// ⚠️ بيانات وهمية — استبدليها بجلب جهات الاتصال من API
export const DUMMY_CONTACTS = [
  { id: 'user1', name: 'أحمد محمد', username: 'ahmed', avatar: '/imgs/user.png' },
  { id: 'user2', name: 'سارة علي', username: 'sara', avatar: '/imgs/user.png' },
  { id: 'user3', name: 'محمد حسن', username: 'mohamed', avatar: '/imgs/user.png' },
];