// src/app/chats/_components/utils/formatTime.ts

export function formatMessageTime(timestamp: string): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return 'الآن';
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) {
    if (diffDays === 1) return 'منذ يوم';
    return `منذ ${diffDays} يوم`;
  }
  if (diffWeeks < 4) {
    if (diffWeeks === 1) return 'منذ أسبوع';
    return `منذ ${diffWeeks} أسبوع`;
  }
  if (diffMonths < 12) {
    if (diffMonths === 1) return 'منذ شهر';
    if (diffMonths === 2) return 'منذ شهرين';
    if (diffMonths >= 3 && diffMonths <= 10) return `منذ ${diffMonths} أشهر`;
    return `منذ ${diffMonths} شهر`;
  }
  if (diffYears === 1) return 'منذ سنة';
  if (diffYears === 2) return 'منذ سنتين';
  if (diffYears >= 3 && diffYears <= 10) return `منذ ${diffYears} سنوات`;
  return `منذ ${diffYears} سنة`;
}

export function formatCallDate(timestamp: string): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'مساءً' : 'صباحاً';
  hours = hours % 12 || 12;
  const timeStr = `${hours}:${minutes} ${period}`;

  if (isToday) return `اليوم ${timeStr}`;
  if (isYesterday) return `أمس ${timeStr}`;

  const monthsAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
  ];

  return `${date.getDate()} ${monthsAr[date.getMonth()]} ${timeStr}`;
}