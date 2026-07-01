"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import QRLoginModal from "@/app/_components/QRLoginModal";

interface LoginModalContextType {
  isOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openLoginModal = () => setIsOpen(true);
  const closeLoginModal = () => setIsOpen(false);

   const handleLoginSuccess = () => {
     closeLoginModal();

     if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("userDataUpdated"));
      console.log("✅ Login success event dispatched!");
    }
  };

  return (
    <LoginModalContext.Provider value={{ isOpen, openLoginModal, closeLoginModal }}>
      {children}
      <QRLoginModal
        isOpen={isOpen}
        onClose={closeLoginModal}
        onLoginSuccess={handleLoginSuccess} 
      />
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error("useLoginModal must be used within LoginModalProvider");
  }
  return context;
}