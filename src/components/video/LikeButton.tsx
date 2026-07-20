// src/components/video/LikeButton.tsx
interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
}

export function LikeButton({ isLiked, likeCount, onLike }: LikeButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onLike}
        className={`rounded-full backdrop-blur-md w-[40px] h-[40px] flex items-center justify-center transition-colors ${
          isLiked ? "bg-[#D72229A6] text-white" : "bg-[#000000]/15"
        }`}
      >
        <img 
          src={isLiked ? "/icons/like-white.svg" : "/icons/like-white.svg"} 
          alt="like" 
          className="w-5 h-5" 
        />
      </button>
      {likeCount > 0 && (
        <span className="text-[#E56F74] text-xs mt-1">{likeCount}</span>
      )}
    </div>
  );
}