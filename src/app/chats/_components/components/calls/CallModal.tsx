// // // src/app/chats/_components/components/calls/CallModal.tsx
// // 'use client';

// // import { Phone, Video } from 'lucide-react';
// // import { CallType } from '../../types';

// // interface CallModalProps {
// //   isOpen: boolean;
// //   calleeName: string;
// //   freeMinutes: number;
// //   totalMinutes: number;
// //   isStarting: boolean;
// //   onClose: () => void;
// //   onStart: (type: CallType) => void;
// // }

// // export default function CallModal({
// //   isOpen,
// //   calleeName,
// //   freeMinutes,
// //   totalMinutes,
// //   isStarting,
// //   onClose,
// //   onStart,
// // }: CallModalProps) {
// //   if (!isOpen) return null;

// //   const disabled = freeMinutes <= 0 || isStarting;

// //   return (
// //     <div
// //       className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60 backdrop-blur-md"
// //       onClick={onClose}
// //     >
// //       <div
// //         className="relative flex flex-col items-center"
// //         style={{
// //           width: '400px',
// //           maxWidth: '90vw',
// //           borderRadius: '30px',
// //           background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
// //           padding: '30px 20px 25px',
// //           boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
// //         }}
// //         onClick={(e) => e.stopPropagation()}
// //       >
// //         <button
// //           onClick={onClose}
// //           className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
// //         >
// //           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
// //           </svg>
// //         </button>

// //         <div
// //           className="flex items-center justify-center mb-4"
// //           style={{
// //             width: '100px',
// //             height: '100px',
// //             borderRadius: '50%',
// //             background: 'linear-gradient(135deg, #e94560, #c23152)',
// //             boxShadow: '0 0 40px rgba(233, 69, 96, 0.3)',
// //           }}
// //         >
// //           <img
// //             src="/imgs/fire-emergency-call-1.svg"
// //             alt="Call"
// //             style={{ width: '55px', height: '55px', filter: 'brightness(0) invert(1)' }}
// //           />
// //         </div>

// //         <h3 className="text-white font-bold mb-1" style={{ fontSize: '24px', fontFamily: 'Cairo' }}>
// //           {calleeName}
// //         </h3>

// //         <div
// //           className="flex items-center justify-between w-full px-4 py-2 mb-4"
// //           style={{
// //             background: 'rgba(255,255,255,0.08)',
// //             borderRadius: '15px',
// //             border: '1px solid rgba(255,255,255,0.1)',
// //           }}
// //         >
// //           <span style={{ color: '#8899aa', fontSize: '14px', fontFamily: 'Cairo' }}>
// //             رصيدك الحالي
// //           </span>
// //           <span style={{ color: '#4fc3f7', fontSize: '16px', fontWeight: 600, fontFamily: 'Cairo' }}>
// //             {freeMinutes} / {totalMinutes} دقيقة مجانية
// //           </span>
// //         </div>

// //         <div className="flex items-center gap-4 w-full">
// //           <button
// //             onClick={() => onStart('audio')}
// //             disabled={disabled}
// //             className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all"
// //             style={{
// //               background: !disabled ? 'linear-gradient(135deg, #4caf50, #388e3c)' : 'rgba(255,255,255,0.1)',
// //               color: !disabled ? '#fff' : '#666',
// //               cursor: !disabled ? 'pointer' : 'not-allowed',
// //               border: 'none',
// //             }}
// //           >
// //             <Phone size={18} />
// //             <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px' }}>
// //               {isStarting ? 'جاري...' : 'مكالمة صوتية'}
// //             </span>
// //           </button>

// //           <button
// //             onClick={() => onStart('video')}
// //             disabled={disabled}
// //             className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all"
// //             style={{
// //               background: !disabled ? 'linear-gradient(135deg, #e94560, #c23152)' : 'rgba(255,255,255,0.1)',
// //               color: !disabled ? '#fff' : '#666',
// //               cursor: !disabled ? 'pointer' : 'not-allowed',
// //               border: 'none',
// //             }}
// //           >
// //             <Video size={18} />
// //             <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px' }}>
// //               {isStarting ? 'جاري...' : 'مكالمة مرئية'}
// //             </span>
// //           </button>
// //         </div>

// //         {freeMinutes <= 0 && (
// //           <p className="mt-3 text-center" style={{ color: '#ff6b6b', fontSize: '13px', fontFamily: 'Cairo' }}>
// //             رصيد الدقائق المجانية منتهي
// //           </p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظ

// // src/app/chats/_components/components/calls/CallModal.tsx
// 'use client';

// import { Phone, Video, Mic, MicOff, VideoOff } from 'lucide-react';
// import { CallType } from '../../types';

// interface CallModalProps {
//   isOpen: boolean;
//   calleeName: string;
//   calleeUsername?: string;        // ✅ جديد
//   calleeAvatar?: string;          // ✅ جديد
//   callTitle?: string;             // ✅ جديد (مكالمة صوتية واردة / صادرة)
//   freeMinutes: number;
//   totalMinutes: number;
//   isStarting: boolean;
//   onClose: () => void;
//   onStart: (type: CallType) => void;
// }

// export default function CallModal({
//   isOpen,
//   calleeName,
//   calleeUsername = '@user',
//    calleeAvatar = '/imgs/user.png',
//   callTitle = 'مكالمة صوتية واردة',
//   freeMinutes,
//   totalMinutes,
//   isStarting,
//   onClose,
//   onStart,
// }: CallModalProps) {
//   if (!isOpen) return null;

//   const disabled = freeMinutes <= 0 || isStarting;

//   return (
//     <div
//       className="fixed inset-0 z-[1200] flex items-center justify-center"
//       style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
//       onClick={onClose}
//     >
//       {/* ===== البوكس الرئيسي ===== */}
//       <div
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           width: '357px',
//           height: '566px',
//           borderRadius: '35px',
//           background: '#F1F4F9',
//           padding: '24px 20px',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           position: 'relative',
//           boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
//         }}
//       >
//         {/* ===== زر الإغلاق ===== */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
//           aria-label="إغلاق"
//         >
//           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>

//         {/* ===== 1) عنوان المكالمة ===== */}
//         <p
//           style={{
//             fontFamily: 'Cairo',
//             fontWeight: 600,
//             fontSize: '15px',
//             lineHeight: '100%',
//             textAlign: 'center',
//             color: '#7C7D7E',
//             marginTop: '20px',
//             marginBottom: '16px',
//           }}
//         >
//           {callTitle}
//         </p>


//    {/* ===== 3) اسم المستخدم ===== */}
//         <h3
//           style={{
//             fontFamily: 'Cairo',
//             fontWeight: 600,
//             fontSize: '30px',
//             lineHeight: '100%',
//             textAlign: 'center',
//             color: '#000000',
//             marginBottom: '8px',
//           }}
//         >
//           {calleeName}
//         </h3>

//         {/* ===== 4) اليوزرنيم ===== */}
//         <p
//           style={{
//             fontFamily: 'Inter',
//             fontWeight: 400,
//             fontSize: '16px',
//             lineHeight: '100%',
//             textAlign: 'center',
//             color: '#000000',
//             width: '100%',
//             paddingRight: '8px',
//             marginBottom: 'auto',
//           }}
//         >
//           {calleeUsername}
//         </p>
//         {/* ===== 2) صورة المستخدم ===== */}
//         {/* <img
//           src={calleeAvatar}
//           alt={calleeName}
//           style={{
//             width: '210px',
//             height: '210px',
//             borderRadius: '40px',
//             objectFit: 'cover',
//             marginBottom: '20px',
//           }}
//         /> */}
//         {/* <div
//   style={{
//     width: '210px',
//     height: '210px',
//     marginBottom: '20px',
//   }}
// >
//   <svg
//     width="210"
//     height="210"
//     viewBox="0 0 210 210"
//     style={{
//       width: '100%',
//       height: '100%',
//       display: 'block',
//     }}
//   >
//     <defs>
//       <clipPath id="wavyAvatar">
//         <path
//           d="
//             M 105 2
//             C 125 4, 132 7, 145 12
//             C 159 10, 172 17, 180 28
//             C 193 34, 199 47, 198 60
//             C 207 72, 204 86, 201 98
//             C 207 112, 202 125, 194 136
//             C 194 150, 184 159, 174 167
//             C 166 180, 151 185, 139 190
//             C 128 201, 113 199, 103 205
//             C 89 202, 78 198, 67 193
//             C 53 194, 43 185, 34 177
//             C 21 174, 18 160, 12 150
//             C 5 139, 10 126, 7 115
//             C 2 102, 8 90, 7 78
//             C 3 65, 12 55, 18 45
//             C 20 32, 34 28, 42 19
//             C 53 13, 64 13, 76 8
//             C 87 7, 96 3, 105 2
//             Z
//           "
//         />
//       </clipPath>
//     </defs>

//     <image
//       href={calleeAvatar}
//       x="0"
//       y="0"
//       width="210"
//       height="210"
//       preserveAspectRatio="xMidYMid slice"
//       clipPath="url(#wavyAvatar)"
//     />
//   </svg>
// </div>


//       */}
//   <img
//   src={calleeAvatar}
//   alt={calleeName}
//   style={{
//     width: '210px',
//     height: '210px',
//     objectFit: 'cover',
//     marginBottom: '20px',
//     // borderRadius: '55% 45% 60% 40% / 45% 55% 45% 55%',
//    borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%'

//   }}
// />

//         {/* ===== 5) بوكس الأزرار ===== */}
//         <div
//           style={{
//             width: '357px',
//             height: '108px',
//             borderRadius: '35px',
//             background: '#EAEDF6',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: '16px',
//             padding: '0 20px',
//             marginTop: '20px',
//           }}
//         >
//           {/* زر المكالمة الصوتية */}
//           <button
//             onClick={() => onStart('audio')}
//             disabled={disabled}
//             style={{
//               width: '150px',
//               height: '64px',
//               borderRadius: '38.5px',
//               background: !disabled ? '#D72229' : '#B4B4B9',
//               border: 'none',
//               cursor: !disabled ? 'pointer' : 'not-allowed',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: '8px',
//               transition: 'transform 0.15s, opacity 0.15s',
//               opacity: !disabled ? 1 : 0.5,
//             }}
//             onMouseEnter={(e) => {
//               if (!disabled) e.currentTarget.style.transform = 'scale(1.03)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'scale(1)';
//             }}
//           >
//             <Phone size={20} color="#fff" />
//             <span
//               style={{
//                 fontFamily: 'Cairo',
//                 fontWeight: 600,
//                 fontSize: '15px',
//                 color: '#fff',
//               }}
//             >
//               {isStarting ? 'جاري...' : 'صوتية'}
//             </span>
//           </button>

//           {/* زر المكالمة المرئية */}
//           <button
//             onClick={() => onStart('video')}
//             disabled={disabled}
//             style={{
//               width: '150px',
//               height: '64px',
//               borderRadius: '38.5px',
//               background: !disabled ? '#000000' : '#B4B4B9',
//               border: 'none',
//               cursor: !disabled ? 'pointer' : 'not-allowed',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: '8px',
//               transition: 'transform 0.15s, opacity 0.15s',
//               opacity: !disabled ? 1 : 0.5,
//             }}
//             onMouseEnter={(e) => {
//               if (!disabled) e.currentTarget.style.transform = 'scale(1.03)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'scale(1)';
//             }}
//           >
//             <Video size={20} color="#fff" />
//             <span
//               style={{
//                 fontFamily: 'Cairo',
//                 fontWeight: 600,
//                 fontSize: '15px',
//                 color: '#fff',
//               }}
//             >
//               {isStarting ? 'جاري...' : 'مرئية'}
//             </span>
//           </button>
//         </div>

//         {/* ===== تحذير انتهاء الرصيد ===== */}
//         {freeMinutes <= 0 && (
//           <p
//             style={{
//               color: '#D72229',
//               fontSize: '13px',
//               fontFamily: 'Cairo',
//               marginTop: '12px',
//               textAlign: 'center',
//             }}
//           >
//             رصيد الدقائق المجانية منتهي
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }



// src/app/chats/_components/components/calls/CallModal.tsx
'use client';

import { Phone, Video } from 'lucide-react';
import { CallType } from '../../types';

interface CallModalProps {
  isOpen: boolean;
  calleeName: string;
  calleeUsername?: string;
  calleeAvatar?: string;
  callTitle?: string;
  freeMinutes: number;
  totalMinutes: number;
  isStarting: boolean;
  onClose: () => void;
  onStart: (type: CallType) => void;
}

export default function CallModal({
  isOpen,
  calleeName,
  calleeUsername = '@user',
  calleeAvatar = '/imgs/user.png',
  callTitle = 'مكالمة صوتية واردة',
  freeMinutes,
  totalMinutes,
  isStarting,
  onClose,
  onStart,
}: CallModalProps) {
  if (!isOpen) return null;

  const disabled = freeMinutes <= 0 || isStarting;

  return (
    // ✅ شيلنا fixed inset-0 — خليها inline
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 0',
      }}
    >
      {/* ===== البوكس الرئيسي ===== */}
      <div
        style={{
          width: '100%',
          maxWidth: '357px',
          borderRadius: '35px',
          background: '#F1F4F9',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        {/* ===== زر الإغلاق ===== */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="إغلاق"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* ===== 1) عنوان المكالمة ===== */}
        <p
          style={{
            fontFamily: 'Cairo',
            fontWeight: 600,
            fontSize: '13px',
            lineHeight: '100%',
            textAlign: 'center',
            color: '#7C7D7E',
            marginTop: '10px',
            marginBottom: '12px',
          }}
        >
          {callTitle}
        </p>


              {/* ===== 3) اسم المستخدم ===== */}
        <h3
          style={{
            fontFamily: 'Cairo',
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: '100%',
            textAlign: 'center',
            color: '#000000',
            marginBottom: '6px',
          }}
        >
          {calleeName}
        </h3>

        {/* ===== 4) اليوزرنيم ===== */}
        <p
          style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: '100%',
            textAlign: 'center',
            color: '#000000',
            width: '100%',
            marginBottom: '12px',
          }}
        >
          {calleeUsername}
        </p>
        {/* ===== 2) صورة المستخدم مع إطار متعرج ===== */}
        <div
          style={{
            position: 'relative',
            width: '150px',
            height: '150px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={calleeAvatar}
            alt={calleeName}
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              objectFit: 'cover',
              position: 'relative',
              zIndex: 2,
            }}
          />
          <svg
            width="150"
            height="150"
            viewBox="0 0 150 150"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          >
            <path
              d={generateWavyCircle(75, 75, 70, 60, 3)}
              fill="none"
              stroke="#D72229"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>



        {/* ===== 5) بوكس الأزرار ===== */}
        <div
          style={{
            width: '100%',
            borderRadius: '25px',
            background: '#EAEDF6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px',
          }}
        >
          {/* زر المكالمة الصوتية */}
          <button
            onClick={() => onStart('audio')}
            disabled={disabled}
            style={{
              flex: 1,
              height: '50px',
              borderRadius: '25px',
              background: !disabled ? '#D72229' : '#B4B4B9',
              border: 'none',
              cursor: !disabled ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'transform 0.15s, opacity 0.15s',
              opacity: !disabled ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              if (!disabled) e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Phone size={16} color="#fff" />
            <span
              style={{
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '13px',
                color: '#fff',
              }}
            >
              {isStarting ? 'جاري...' : 'صوتية'}
            </span>
          </button>

          {/* زر المكالمة المرئية */}
          <button
            onClick={() => onStart('video')}
            disabled={disabled}
            style={{
              flex: 1,
              height: '50px',
              borderRadius: '25px',
              background: !disabled ? '#000000' : '#B4B4B9',
              border: 'none',
              cursor: !disabled ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'transform 0.15s, opacity 0.15s',
              opacity: !disabled ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              if (!disabled) e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Video size={16} color="#fff" />
            <span
              style={{
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '13px',
                color: '#fff',
              }}
            >
              {isStarting ? 'جاري...' : 'مرئية'}
            </span>
          </button>
        </div>

        {/* ===== تحذير انتهاء الرصيد ===== */}
        {freeMinutes <= 0 && (
          <p
            style={{
              color: '#D72229',
              fontSize: '12px',
              fontFamily: 'Cairo',
              marginTop: '8px',
              textAlign: 'center',
            }}
          >
            رصيد الدقائق المجانية منتهي
          </p>
        )}
      </div>
    </div>
  );
}

// ✅ دالة توليد الدائرة المتعرجة
function generateWavyCircle(
  cx: number,
  cy: number,
  radius: number,
  points: number,
  amplitude: number
): string {
  const totalPoints = points * 2;
  let path = '';

  for (let i = 0; i <= totalPoints; i++) {
    const angle = (Math.PI * 2 * i) / totalPoints - Math.PI / 2;
    const r = i % 2 === 0 ? radius + amplitude : radius - amplitude;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    path +=
      i === 0
        ? `M ${x.toFixed(2)} ${y.toFixed(2)}`
        : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }

  return path + ' Z';
}