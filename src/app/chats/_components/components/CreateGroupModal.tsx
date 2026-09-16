// src/app/chats/_components/components/CreateGroupModal.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Search } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBase: string;
  token: string | null;
  myUserId: string;
  chats: any[];
  onSuccess: (groupId: string) => void;
}

export default function CreateGroupModal({
  isOpen,
  onClose,
  apiBase,
  token,
  myUserId,
  chats,
  onSuccess,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [tempAdmins, setTempAdmins] = useState<string[]>([]);
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  const [isSubmittingGroup, setIsSubmittingGroup] = useState(false);
  const [isMemberSelectionOpen, setIsMemberSelectionOpen] = useState(false);

  if (!isOpen) return null;

  const handleCreateGroupSubmit = async () => {
    if (!groupName.trim() || !token) {
      toast.error('يرجى إدخال اسم المجموعة');
      return;
    }

    setIsSubmittingGroup(true);

    try {
      const formData = new FormData();
      formData.append('name', groupName.trim());
      formData.append('description', groupDescription.trim() || '');

      const membersOnly = selectedMembers.filter((id) => id !== myUserId);
      membersOnly.forEach((memberId) => {
        formData.append('members', memberId);
      });

      const createRes = await fetch(`${apiBase}/chats/groups/CreateGroup`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const createData = await createRes.json();
      if (!createData.success || !createData.response?.groupId) {
        throw new Error(createData.response || 'Failed to create group');
      }

      const groupId = createData.response.groupId;

      // ترقية المشرفين
      if (tempAdmins.length > 0) {
        await Promise.all(
          tempAdmins.map((adminId) =>
            fetch(`${apiBase}/chats/groups/PromoteAdmin/${groupId}`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ memberid: adminId }),
            }).catch((err) =>
              console.error(`Failed to promote admin ${adminId}:`, err)
            )
          )
        );
      }

      // Reset
      setGroupName('');
      setGroupDescription('');
      setSelectedMembers([]);
      setTempAdmins([]);
      setGroupSearchTerm('');
      setIsMemberSelectionOpen(false);
      onClose();

      toast.success('تم إنشاء المجموعة بنجاح');
      onSuccess(groupId);
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error(`فشل إنشاء المجموعة: ${error.message || 'خطأ غير معروف'}`);
    } finally {
      setIsSubmittingGroup(false);
    }
  };

  const toggleMemberSelection = (chatId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  };

  const toggleAdminStatus = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTempAdmins((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  };

  // الأفراد فقط
  const individualUsers = chats.filter((c) => !c.isGroup);
  const filteredUsers = individualUsers.filter((c) =>
    (c.name || '').toLowerCase().includes(groupSearchTerm.toLowerCase().trim())
  );

  return (
    <>
      {/* ===== CREATE GROUP MODAL ===== */}
      <motion.div
        drag
        dragMomentum={false}
        className="fixed w-[20%] z-50 flex flex-col p-6 bg-[#F5F5F5] cursor-grab active:cursor-grabbing"
        initial={{ x: 0, y: 0 }}
        style={{
          top: '130px',
          left: '18px',
          direction: 'rtl',
          borderRadius: '35px',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors p-0"
          >
            <img
              src="/imgs/close.svg"
              alt="إغلاق"
              style={{ width: '17px', height: '17px', opacity: 1 }}
            />
          </button>
          <h2
            style={{
              fontFamily: 'Cairo',
              fontWeight: 500,
              fontSize: '25px',
              lineHeight: '100%',
              color: '#000000',
            }}
          >
            انشاء مجموعة
          </h2>
        </div>

        {/* Group Image + Name */}
        <div className="mb-3 flex justify-center gap-1 flex-shrink-0 relative -mx-3">
          <div className="relative inline-block">
            <img
              src={
                JSON.parse(localStorage.getItem('userData') || '{}').img ||
                '/imgs/user.png'
              }
              alt="صورة المستخدم"
              className="w-[50px] h-[45px] rounded-[17px] object-cover"
              style={{ filter: 'blur(1px)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img
                src="/imgs/Groupcamer.svg"
                alt="كاميرا"
                style={{ width: '17px', height: '17px', opacity: 1 }}
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="اكتب اسم المجموعة"
            value={groupName}
            maxLength={25}
            onChange={(e) => setGroupName(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '402px',
              height: '45px',
              borderRadius: '18px',
              background: '#FFFFFF',
              fontFamily: 'Cairo',
              fontWeight: 600,
              fontSize: '15px',
              padding: '0 15px',
              border: 'none',
              outline: 'none',
            }}
            className="text-black placeholder-[#B4B4B9]"
          />

          <span
            style={{
              width: '46px',
              height: '28px',
              fontFamily: 'Cairo',
              fontWeight: 600,
              fontSize: '15px',
              lineHeight: '100%',
              color: '#B4B4B9',
              transform: 'translateY(15px)',
            }}
          >
            25/{groupName.length}
          </span>
        </div>

        {/* Description */}
        <div className="mb-4 flex justify-center flex-shrink-0 -mx-3">
          <div
            className="flex items-center gap-3 p-3 w-full"
            style={{
              maxWidth: '402px',
              height: '102px',
              borderRadius: '18px',
              background: '#FFFFFF',
            }}
          >
            <textarea
              placeholder="اكتب الوصف"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              style={{
                flex: 1,
                height: '100%',
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '15px',
                padding: '8px 0',
                border: 'none',
                outline: 'none',
                resize: 'none',
                background: 'transparent',
              }}
              className="text-black placeholder-[#B4B4B9]"
            />
          </div>
        </div>

        <div
          className="w-[calc(100%+48px)] -mx-6 shrink-0"
          style={{ height: '3px', borderTop: '0.33px solid #3C3C434D' }}
        />

        {/* Members Header */}
        <div className="flex items-center justify-between mb-2 -mx-5 flex-shrink-0">
          <span
            style={{
              fontFamily: 'Cairo',
              fontWeight: 600,
              fontSize: '17px',
              color: '#000000',
            }}
          >
            الاعضاء:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMemberSelectionOpen(true)}
              className="w-8 h-8 rounded-full bg-[#F2F2F2] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
            >
              <img
                src="/imgs/search_mem.svg"
                alt="بحث"
                style={{ width: '15px', height: '15px', opacity: 1 }}
              />
            </button>
            <button
              onClick={() => setIsMemberSelectionOpen(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
            >
              <img
                src="/imgs/chooseMember.svg"
                alt="إضافة أعضاء"
                style={{ width: '16px', height: '16px', opacity: 1 }}
              />
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div
          className="flex-1 flex items-center justify-center mb-4 mx-auto w-full"
          style={{ maxWidth: '402px', minHeight: '150px' }}
        >
          <div className="text-center">
            <img
              src="/imgs/noMember.svg"
              alt="لا يوجد أعضاء"
              className="w-[71px] h-[71px] object-contain mx-auto mb-2"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div
          className="flex justify-center items-center flex-shrink-0"
          style={{
            width: 'calc(100% + 48px)',
            marginLeft: '-24px',
            marginRight: '-24px',
            marginBottom: '-24px',
            padding: '16px 24px',
            background: '#E3E3E366',
            backdropFilter: 'blur(35px)',
            borderBottomLeftRadius: '35px',
            borderBottomRightRadius: '35px',
            minHeight: '82px',
          }}
        >
          <style jsx>{`
            .wave {
              stroke: #D72229;
              stroke-width: 6;
              stroke-linecap: round;
              fill: none;
              stroke-dasharray: 40 140;
              animation: dash 1.2s ease-in-out infinite;
            }
            .wave2 { animation-delay: 0.15s; }
            .wave3 { animation-delay: 0.30s; }
            @keyframes dash {
              0% { stroke-dashoffset: 40; opacity: 0.2; }
              50% { stroke-dashoffset: 0; opacity: 1; }
              100% { stroke-dashoffset: -40; opacity: 0.2; }
            }
          `}</style>

          <button
            disabled={!groupName.trim() || isSubmittingGroup}
            onClick={handleCreateGroupSubmit}
            style={{
              width: '100%',
              maxWidth: '285px',
              height: '50px',
              borderRadius: '20px',
              background: isSubmittingGroup ? '#FFF5F5' : '#FFFFFF',
              fontFamily: 'Cairo',
              fontWeight: 600,
              fontSize: '17px',
              border: isSubmittingGroup
                ? '1px solid #D72229'
                : '1px solid #ddd',
              cursor:
                !groupName.trim() || isSubmittingGroup
                  ? 'not-allowed'
                  : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isSubmittingGroup ? 0.85 : 1,
            }}
            className={`text-black shadow-md ${
              !isSubmittingGroup && groupName.trim() ? 'hover:bg-gray-50' : ''
            }`}
          >
            {isSubmittingGroup ? (
              <svg width="80" height="30" viewBox="0 0 120 36" className="block mx-auto">
                <path className="wave wave1" d="M5 18 Q 11 6 17 18" />
                <path
                  className="wave wave2"
                  d="M5 18 Q 11 6 17 18"
                  transform="translate(26,0)"
                />
                <path
                  className="wave wave3"
                  d="M5 18 Q 11 6 17 18"
                  transform="translate(52,0)"
                />
              </svg>
            ) : (
              'انشاء مجموعة'
            )}
          </button>
        </div>
      </motion.div>

      {/* ===== MEMBER SELECTION MODAL ===== */}
      {isMemberSelectionOpen && (
        <motion.div
          drag
          dragMomentum={false}
          className="fixed top-[130px] bottom-0 left-[18px] w-[20%] z-[60] flex flex-col p-6 bg-[#F5F5F5] cursor-grab active:cursor-grabbing"
          style={{ direction: 'rtl', borderRadius: '35px' }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 flex-shrink-0">
            <button
              onClick={() => setIsMemberSelectionOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors p-0"
            >
              <img
                src="/imgs/returnPage.svg"
                alt="returnPage"
                style={{ width: '17px', height: '17px', opacity: 1 }}
              />
            </button>
            <h2
              style={{
                fontFamily: 'Cairo',
                fontWeight: 500,
                fontSize: '25px',
                lineHeight: '100%',
                color: '#000000',
              }}
            >
              اضافة اشخاص
            </h2>
          </div>

          {/* Search */}
          <div
            className="flex items-center bg-white rounded-xl px-3 py-2 mb-3 shadow-sm mx-auto w-full flex-shrink-0"
            style={{ maxWidth: '402px' }}
          >
            <Search className="text-[#B6B7B7] w-4 h-4 ml-2" />
            <input
              type="text"
              placeholder="ابحث عن اسم شخص..."
              value={groupSearchTerm}
              onChange={(e) => setGroupSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none"
              style={{ fontFamily: 'Cairo', fontSize: '14px' }}
            />
          </div>

          {/* Counter */}
          <div className="flex items-center justify-between px-2 mb-3">
            <div className="flex items-center gap-1">
              <img
                src="/imgs/addperson.svg"
                alt="صورة المستخدم"
                className="w-[13px] h-[13px] object-cover"
              />
              <span className="text-sm font-semibold text-black">
                عدد الاعضاء
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">{selectedMembers.length}</span>
              <span className="text-sm text-gray-500">الأشخاص</span>
            </div>
          </div>

          {/* Members List */}
          <div
            className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4 mx-auto w-full"
            style={{ maxWidth: '402px', minHeight: '150px' }}
          >
            {individualUsers.length === 0 ? (
              <div
                className="flex-1 flex items-center justify-center h-full"
                style={{ minHeight: '200px' }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">👤</div>
                  <p className="text-xl font-semibold text-gray-600">
                    لا يوجد أعضاء
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    ليس لديك أي محادثات مع أفراد
                  </p>
                </div>
              </div>
            ) : filteredUsers.length === 0 && groupSearchTerm.trim() !== '' ? (
              <div
                className="flex-1 flex items-center justify-center h-full"
                style={{ minHeight: '71px' }}
              >
                <div className="text-center">
                  <img
                    src="/imgs/noMember.svg"
                    alt="لا توجد نتائج"
                    className="w-[71px] h-[71px] object-contain mx-auto"
                  />
                </div>
              </div>
            ) : (
              filteredUsers.map((chat) => {
                const isChecked = selectedMembers.includes(chat.chatId);
                const isAdmin = tempAdmins.includes(chat.chatId);

                return (
                  <div
                    key={chat.chatId}
                    onClick={() => toggleMemberSelection(chat.chatId)}
                    className={`flex items-center justify-between px-2 py-3 rounded-2xl cursor-pointer transition-all ${
                      isChecked
                        ? 'border-2 border-[#D72229] shadow-sm'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={chat.userinfo?.img || '/imgs/user.png'}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={chat.name}
                      />
                      <span className="text-sm font-semibold text-black">
                        {chat.name}
                      </span>
                    </div>

                    <div
                      onClick={(e) => toggleAdminStatus(chat.chatId, e)}
                      className="w-[30px] h-[30px] rounded-[20px] bg-white backdrop-blur-[4px] flex items-center justify-center shadow-sm transition-all hover:bg-gray-100 cursor-pointer"
                    >
                      <img
                        src={isAdmin ? '/imgs/admin (2).svg' : '/imgs/noAdmin (2).svg'}
                        alt={isAdmin ? 'Admin' : 'Not Admin'}
                        className="w-[12px] h-[13px] object-contain"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Submit */}
          <div
            className="flex justify-center items-center flex-shrink-0"
            style={{
              width: 'calc(100% + 48px)',
              marginLeft: '-24px',
              marginRight: '-24px',
              marginBottom: '-24px',
              padding: '16px 24px',
              background: '#E3E3E366',
              backdropFilter: 'blur(35px)',
              borderBottomLeftRadius: '35px',
              borderBottomRightRadius: '35px',
              minHeight: '82px',
            }}
          >
            <button
              onClick={() => setIsMemberSelectionOpen(false)}
              style={{
                width: '100%',
                maxWidth: '285px',
                height: '50px',
                borderRadius: '20px',
                background: '#FFFFFF',
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '17px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: '#000000',
              }}
              className="hover:bg-gray-100 shadow-md"
            >
              اضافة الاعضاء
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}