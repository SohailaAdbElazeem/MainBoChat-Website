'use client';

import SignupModal from '../login/_components/SignupModal';


export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignupModal
        open={true}
        onClose={() => {
          window.location.href = '/login';
        }}
      />
    </div>
  );
}