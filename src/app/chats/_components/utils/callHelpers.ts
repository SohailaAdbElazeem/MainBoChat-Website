// src/app/chats/_components/utils/callHelpers.ts

export function getCallLabel(type: string): string {
  switch (type) {
    case 'incoming': return 'مكالمة واردة';
    case 'outgoing': return 'مكالمة صادرة';
    case 'missed': return 'مكالمة فائتة';
    default: return 'مكالمة';
  }
}

export function getCallIcon(type: string): string {
  switch (type) {
    case 'incoming':
    case 'outgoing':
    case 'missed':
    default:
      return '/imgs/fire-emergency-call 1.svg';
  }
}