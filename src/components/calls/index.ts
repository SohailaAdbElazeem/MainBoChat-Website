// src/components/calls/index.ts
export { default as CallScreen } from "./CallScreen";
export { default as CallModal } from "./CallModal";  // ← ضيفي ده

export type {
  CallType,
  ActiveCall,
  GroupCallParticipant,
  CallModalProps,
} from "./types";