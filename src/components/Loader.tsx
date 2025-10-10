function Loader() {
  return (
    <div
      className="absolute inset-0 z-50 rounded-3xl bg-white/70 backdrop-blur-md grid place-items-center"
      aria-hidden
    >
      {/* لوجو صغير يهتز */}
      <img
        src="/logo-red.png"
        alt=""
        width={36}
        className="absolute top-4 left-1/2 -translate-x-1/2 animate-logo"
      />

      {/* تموّج أحمر */}
      <svg width="120" height="36" viewBox="0 0 120 36" className="block">
        <path className="wave wave1" d="M5 18 Q 11 6 17 18" />
        <path className="wave wave2" d="M5 18 Q 11 6 17 18" transform="translate(26,0)" />
        <path className="wave wave3" d="M5 18 Q 11 6 17 18" transform="translate(52,0)" />
      </svg>

      <div className="absolute bottom-3 text-[11px] text-neutral-400">
        استنى شوية، حسابك بيتعمل دلوقتي
      </div>

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
export default Loader
