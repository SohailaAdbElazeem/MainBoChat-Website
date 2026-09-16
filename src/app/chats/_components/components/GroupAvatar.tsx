// // src/app/chats/_components/components/GroupAvatar.tsx
// /* eslint-disable @next/next/no-img-element */
// 'use client';

// import { ChatItem } from '../types';

// interface GroupAvatarProps {
//   chat: ChatItem;
//   myUserId: string;
// }

// export default function GroupAvatar({ chat, myUserId }: GroupAvatarProps) {
//   let members = chat.members || [];

//   // إذا لم توجد أعضاء، استخدم صورة المستخدم الحالي + صورة المجموعة
//   if (members.length === 0) {
//     let currentUserImg = '/imgs/user.png';
//     try {
//       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//       currentUserImg = userData.img || userData.avatar || '/imgs/user.png';
//     } catch {}

//     members = [
//       { _id: myUserId, name: 'أنت', img: currentUserImg, avatar: currentUserImg },
//       {
//         _id: chat.chatId,
//         name: chat.name,
//         img: chat.userinfo?.img || chat.avatar || '/imgs/user.png',
//         avatar: chat.userinfo?.avatar || chat.avatar || '/imgs/user.png',
//       },
//     ];
//   }

//   const memberCount = members.length;

//   const getMemberImage = (index: number) => {
//     const member = members[index];
//     return member?.img || member?.avatar || member?.image || '/imgs/user.png';
//   };

//   const GroupIcon = () => (
//     <div
//       style={{
//         position: 'absolute',
//         width: '19px',
//         height: '19px',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         borderRadius: '8px',
//         background: '#FFFFFF',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 10,
//         pointerEvents: 'none',
//         boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
//       }}
//     >
//       <img
//         src="/imgs/Group.svg"
//         alt="Group"
//         style={{ width: '10.9px', height: '10.9px' }}
//       />
//     </div>
//   );

//   // عضو واحد
//   if (memberCount < 2) {
//     return (
//       <div className="relative w-[60px] h-[60px] rounded-[15px] overflow-hidden flex-shrink-0 flex items-center justify-center">
//         <img src={getMemberImage(0)} alt="Member" className="w-full h-full object-cover rounded-[25px] p-1" />
//         <GroupIcon />
//       </div>
//     );
//   }

//   // عضوان
//   if (memberCount === 2) {
//     return (
//       <div className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0">
//         <img
//           src={getMemberImage(1)}
//           alt="Member 1"
//           className="absolute object-cover"
//           style={{
//             width: '34.09px',
//             height: '34.09px',
//             top: '9px',
//             left: '25px',
//             borderRadius: '15px',
//             zIndex: 1,
//           }}
//         />
//         <img
//           src={getMemberImage(0)}
//           alt="Member 2"
//           className="absolute object-cover"
//           style={{
//             width: '34.09px',
//             height: '34.09px',
//             top: '9px',
//             left: '1px',
//             borderRadius: '15px',
//             zIndex: 2,
//           }}
//         />
//         <GroupIcon />
//       </div>
//     );
//   }

//   // 3 أعضاء
//   if (memberCount === 3) {
//     return (
//       <div className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0">
//         <img
//           src={getMemberImage(1)}
//           alt="Member 1"
//           className="absolute object-cover rounded-[15px]"
//           style={{ width: '34px', height: '34px', top: '4px', right: '6px', zIndex: 1 }}
//         />
//         <img
//           src={getMemberImage(2)}
//           alt="Member 2"
//           className="absolute object-cover rounded-[15px]"
//           style={{ width: '34px', height: '34px', top: '4px', left: '-2px', zIndex: 1 }}
//         />
//         <img
//           src={getMemberImage(0)}
//           alt="Member 3"
//           className="absolute object-cover rounded-[15px]"
//           style={{
//             width: '34px',
//             height: '34px',
//             bottom: '4px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             zIndex: 2,
//           }}
//         />
//         <GroupIcon />
//       </div>
//     );
//   }

//   // 4 أعضاء
//   if (memberCount === 4) {
//     return (
//       <div className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0">
//         <img src={getMemberImage(0)} alt="M1" className="absolute object-cover rounded-[15px]" style={{ width: '34px', height: '34px', top: '2px', left: '2px', zIndex: 3 }} />
//         <img src={getMemberImage(1)} alt="M2" className="absolute object-cover rounded-[15px]" style={{ width: '34px', height: '34px', top: '2px', right: '2px', zIndex: 2 }} />
//         <img src={getMemberImage(2)} alt="M3" className="absolute object-cover rounded-[15px]" style={{ width: '34px', height: '34px', bottom: '2px', left: '2px', zIndex: 4 }} />
//         <img src={getMemberImage(3)} alt="M4" className="absolute object-cover rounded-[15px]" style={{ width: '34px', height: '34px', bottom: '2px', right: '2px', zIndex: 1 }} />
//         <GroupIcon />
//       </div>
//     );
//   }

//   // 5 أعضاء أو أكثر
//   const extraCount = memberCount - 3;
//   return (
//     <div className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0">
//       <img src={getMemberImage(0)} alt="M1" className="absolute object-cover rounded-[15px]" style={{ width: '34px', height: '34px', top: '2px', left: '2px', zIndex: 3 }} />
//       <img src={getMemberImage(1)} alt="M2" className="absolute object-cover rounded-[15px]" style={{ width: '34px', height: '34px', top: '2px', right: '2px', zIndex: 2 }} />
//       <div
//         className="absolute flex items-center justify-center bg-[#DADADA] text-black font-bold text-[12px] rounded-[15px] shadow-sm"
//         style={{ width: '34px', height: '34px', bottom: '2px', left: '2px', zIndex: 4 }}
//       >
//         {extraCount}
//       </div>
//       <img src={getMemberImage(2)} alt="M3" className="absolute object-cover rounded-[15px]" style={{ width: '34.09px', height: '34.09px', bottom: '2px', right: '2px', zIndex: 1 }} />
//       <GroupIcon />
//     </div>
//   );
// }



// /////////////////

// src/app/chats/_components/components/GroupAvatar.tsx
/* eslint-disable @next/next/no-img-element */
'use client';

interface GroupAvatarProps {
  chat: any;
  myUserId: string;
}

export default function GroupAvatar({ chat, myUserId }: GroupAvatarProps) {
  let members = chat.members || [];

  // لو مفيش members، اعرضي صورة افتراضية مع صورة المستخدم الحالي
  if (members.length === 0) {
    let currentUserImg = '/imgs/user.png';
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      currentUserImg = userData.img || userData.avatar || '/imgs/user.png';
    } catch (e) {
      currentUserImg = '/imgs/user.png';
    }

    const currentUser = {
      _id: myUserId,
      name: 'أنت',
      img: currentUserImg,
      avatar: currentUserImg,
    };

    const otherMember = {
      _id: chat.chatId,
      name: chat.name,
      img: chat.userinfo?.img || chat.avatar || '/imgs/user.png',
      avatar: chat.userinfo?.avatar || chat.avatar || '/imgs/user.png',
    };

    members = [currentUser, otherMember];
  }

  const memberCount = members.length;

  const getMemberImage = (index: number) => {
    const member = members[index];
    return (
      member?.img ||
      member?.avatar ||
      member?.image ||
      '/imgs/user.png'
    );
  };

  const GroupIcon = () => (
    <div
      style={{
        position: 'absolute',
        width: '19px',
        height: '19px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '8px',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        pointerEvents: 'none',
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <img
        src="/imgs/Group.svg"
        alt="Group"
        style={{ width: '11px', height: '11px' }}
      />
    </div>
  );

  // ===== عضو واحد =====
  if (memberCount < 2) {
    return (
      <div className="relative w-[60px] h-[60px] rounded-[15px] overflow-hidden flex-shrink-0 flex items-center justify-center">
        <img
          src={getMemberImage(0)}
          alt="Member"
          className="w-full h-full object-cover rounded-[25px] p-1"
        />
        <GroupIcon />
      </div>
    );
  }

  // ===== عضوان =====
  if (memberCount === 2) {
    return (
      <div className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0">
        <img
          src={getMemberImage(1)}
          alt="Member 1"
          className="absolute object-cover"
          style={{
            width: '34px',
            height: '34px',
            top: '9px',
            left: '25px',
            borderRadius: '15px',
            zIndex: 1,
          }}
        />
        <img
          src={getMemberImage(0)}
          alt="Member 2"
          className="absolute object-cover"
          style={{
            width: '34px',
            height: '34px',
            top: '9px',
            left: '1px',
            borderRadius: '15px',
            zIndex: 2,
          }}
        />
        <GroupIcon />
      </div>
    );
  }

  // ===== 3 أعضاء =====
  if (memberCount === 3) {
    return (
      <div className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0">
        <img
          src={getMemberImage(1)}
          alt="Member 1"
          className="absolute object-cover rounded-[15px]"
          style={{
            width: '34px',
            height: '34px',
            top: '4px',
            right: '6px',
            zIndex: 1,
          }}
        />
        <img
          src={getMemberImage(2)}
          alt="Member 2"
          className="absolute object-cover rounded-[15px]"
          style={{
            width: '34px',
            height: '34px',
            top: '4px',
            left: '-2px',
            zIndex: 1,
          }}
        />
        <img
          src={getMemberImage(0)}
          alt="Member 3"
          className="absolute object-cover rounded-[15px]"
          style={{
            width: '34px',
            height: '34px',
            bottom: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        />
        <GroupIcon />
      </div>
    );
  }

  // ===== 4 أعضاء =====
  if (memberCount === 4) {
    return (
      <div className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0">
        <img
          src={getMemberImage(0)}
          alt="Member 1"
          className="absolute object-cover rounded-[15px]"
          style={{ width: '34px', height: '34px', top: '2px', left: '2px', zIndex: 3 }}
        />
        <img
          src={getMemberImage(1)}
          alt="Member 2"
          className="absolute object-cover rounded-[15px]"
          style={{ width: '34px', height: '34px', top: '2px', right: '2px', zIndex: 2 }}
        />
        <img
          src={getMemberImage(2)}
          alt="Member 3"
          className="absolute object-cover rounded-[15px]"
          style={{ width: '34px', height: '34px', bottom: '2px', left: '2px', zIndex: 4 }}
        />
        <img
          src={getMemberImage(3)}
          alt="Member 4"
          className="absolute object-cover rounded-[15px]"
          style={{ width: '34px', height: '34px', bottom: '2px', right: '2px', zIndex: 1 }}
        />
        <GroupIcon />
      </div>
    );
  }

  // ===== 5 أعضاء أو أكثر =====
  const extraCount = memberCount - 3;
  return (
    <div className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0">
      <img
        src={getMemberImage(0)}
        alt="Member 1"
        className="absolute object-cover rounded-[15px]"
        style={{ width: '34px', height: '34px', top: '2px', left: '2px', zIndex: 3 }}
      />
      <img
        src={getMemberImage(1)}
        alt="Member 2"
        className="absolute object-cover rounded-[15px]"
        style={{ width: '34px', height: '34px', top: '2px', right: '2px', zIndex: 2 }}
      />
      <div
        className="absolute flex items-center justify-center bg-[#DADADA] text-[#000000] font-bold text-[12px] rounded-[15px] shadow-sm"
        style={{ width: '34px', height: '34px', bottom: '2px', left: '2px', zIndex: 4 }}
      >
        {extraCount}
      </div>
      <img
        src={getMemberImage(2)}
        alt="Member 3"
        className="absolute object-cover rounded-[15px]"
        style={{ width: '34px', height: '34px', bottom: '2px', right: '2px', zIndex: 1 }}
      />
      <GroupIcon />
    </div>
  );
}