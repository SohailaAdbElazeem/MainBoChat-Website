export const TypingBubble = ({ mine }: { mine: boolean }) => {
  const bubbleStyle: React.CSSProperties = {
    alignSelf: mine ? "flex-end" : "flex-start",
    maxWidth: "60%",
    borderRadius: 25,
    background: mine ? "#F3F5FF" : "#F3F5FF",
    fontSize: 13,
    color: "#333",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  };

  return (
    <div style={bubbleStyle}>
      <div className="w-[90px] h-[50px] flex items-center justify-center gap-1">
        <span className="typing-dot" style={{ animationDelay: "0ms" }} />
        <span className="typing-dot" style={{ animationDelay: "200ms" }} />
        <span className="typing-dot" style={{ animationDelay: "400ms" }} />
        <span className="typing-dot" style={{ animationDelay: "600ms" }} />
      </div>
      <style jsx>{`
        .typing-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #D72229;
          display: inline-block;
          animation: dot-bounce 1s infinite;
        }
        @keyframes dot-bounce {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};