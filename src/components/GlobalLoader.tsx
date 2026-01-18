'use client'
function GlobalLoader() {
  return (
    <div
      className="relative z-50 rounded-3xl  grid place-items-center"
      aria-hidden
    >
      {/* تموّج أحمر */}
      <svg width="120" height="36" viewBox="0 0 120 36" className="block">
        <path className="wave wave1" d="M5 18 Q 11 6 17 18" />
        <path className="wave wave2" d="M5 18 Q 11 6 17 18" transform="translate(26,0)" />
        <path className="wave wave3" d="M5 18 Q 11 6 17 18" transform="translate(52,0)" />
      </svg>

      {/* أنيمشنات */}
      <style jsx>{`
        .wave {
          stroke: #D72229;
          stroke-width: 6;
          stroke-linecap: round;
          fill: none;
          stroke-dasharray: 40 140;
          animation: dash 1.2s ease-in-out infinite;
        }
        .wave2 { animation-delay: .15s; }
        .wave3 { animation-delay: .30s; }
        @keyframes dash {
          0%   { stroke-dashoffset: 40; opacity: .2; }
          50%  { stroke-dashoffset: 0;  opacity: 1;  }
          100% { stroke-dashoffset: -40; opacity: .2; }
        }

        .animate-logo { animation: float 1.6s ease-in-out infinite; }
        @keyframes float {
          0%,100% { transform: translate(-50%, 0); }
          50%     { transform: translate(-50%, -6px); }
        }
      `}</style>
    </div>
  );
}
export default GlobalLoader
