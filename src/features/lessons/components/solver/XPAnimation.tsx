import { useEffect, useState } from 'react';

interface XPAnimationProps {
  amount: number;
  isVisible: boolean;
}

const XPAnimation = ({ amount, isVisible }: XPAnimationProps) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible || !animate) return null;

  return (
    <div
      className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-[#FFD700] drop-shadow-lg"
      style={{
        animation: 'float-up 1.5s ease-out forwards',
        fontSize: '2rem',
      }}
    >
      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -150px) scale(1.5);
          }
        }
      `}</style>
      +{amount} XP
    </div>
  );
};

export default XPAnimation;
