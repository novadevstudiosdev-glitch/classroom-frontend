import { motion } from 'motion/react';

type CharacterType = 'orbit' | 'spark' | 'petal' | 'focus' | 'leaf' | 'bounce';
type Expression = 'neutral' | 'happy' | 'wrong';

interface EducationMascotProps {
  character?: CharacterType;
  expression?: Expression;
  size?: number;
  className?: string;
}

export function EducationMascot({
  character = 'orbit',
  expression = 'neutral',
  size = 180,
  className = '',
}: EducationMascotProps) {
  const center = size / 2;
  const bodyRadius = size * 0.28;

  // Character configurations
  const characters = {
    orbit: {
      name: 'Orbit',
      color: { primary: '#8B67FF', light: '#A78BFF', dark: '#6B4FD9', accent: '#5A3FB8' },
      shape: 'blob',
      personality: 'playful',
    },
    spark: {
      name: 'Spark',
      color: { primary: '#3054FF', light: '#5A7AFF', dark: '#2040DD', accent: '#1A30AA' },
      shape: 'capsule',
      personality: 'confident',
    },
    petal: {
      name: 'Petal',
      color: { primary: '#FF6B9D', light: '#FF8FB3', dark: '#E5527E', accent: '#C23D68' },
      shape: 'bean',
      personality: 'shy',
    },
    focus: {
      name: 'Focus',
      color: { primary: '#FF9600', light: '#FFAA33', dark: '#DD7F00', accent: '#AA6200' },
      shape: 'square',
      personality: 'focused',
    },
    leaf: {
      name: 'Leaf',
      color: { primary: '#58CC02', light: '#7DD934', dark: '#45A802', accent: '#338001' },
      shape: 'teardrop',
      personality: 'calm',
    },
    bounce: {
      name: 'Bounce',
      color: { primary: '#1CB0F6', light: '#4CC2F8', dark: '#0D9BD4', accent: '#0A7AAA' },
      shape: 'rounded-rect',
      personality: 'happy',
    },
  };

  const config = characters[character];

  // Expression configurations
  const expressions = {
    neutral: {
      eyes: { scale: 1, y: 0 },
      eyebrows: { rotation: 0, y: 0 },
      mouth: 'M -8 5 Q 0 6 8 5',
      pupils: { y: 0 },
    },
    happy: {
      eyes: { scale: 1.1, y: -2 },
      eyebrows: { rotation: 15, y: -3 },
      mouth: 'M -12 2 Q 0 12 12 2',
      pupils: { y: -1 },
    },
    wrong: {
      eyes: { scale: 0.9, y: 2 },
      eyebrows: { rotation: -20, y: 2 },
      mouth: 'M -10 8 Q 0 3 10 8',
      pupils: { y: 2 },
    },
  };

  const expr = expressions[expression];

  // Body shape paths
  const getBodyPath = () => {
    const r = bodyRadius;
    const cx = center;
    const cy = center;

    switch (config.shape) {
      case 'blob':
        return `
          M ${cx} ${cy - r}
          C ${cx + r * 1.2} ${cy - r * 0.8},
            ${cx + r * 1.1} ${cy + r * 0.6},
            ${cx} ${cy + r}
          C ${cx - r * 1.1} ${cy + r * 0.6},
            ${cx - r * 1.2} ${cy - r * 0.8},
            ${cx} ${cy - r}
          Z
        `;
      case 'capsule':
        return `
          M ${cx} ${cy - r * 1.3}
          C ${cx + r * 0.9} ${cy - r * 1.3},
            ${cx + r * 0.9} ${cy + r * 1.1},
            ${cx} ${cy + r * 1.1}
          C ${cx - r * 0.9} ${cy + r * 1.1},
            ${cx - r * 0.9} ${cy - r * 1.3},
            ${cx} ${cy - r * 1.3}
          Z
        `;
      case 'bean':
        return `
          M ${cx - r * 0.3} ${cy - r}
          C ${cx + r * 1.1} ${cy - r * 1.2},
            ${cx + r * 1.3} ${cy + r * 0.4},
            ${cx + r * 0.2} ${cy + r * 1.1}
          C ${cx - r * 0.5} ${cy + r * 1.2},
            ${cx - r * 1.3} ${cy + r * 0.2},
            ${cx - r * 1.1} ${cy - r * 0.4}
          C ${cx - r * 0.9} ${cy - r * 0.8},
            ${cx - r * 0.5} ${cy - r * 0.9},
            ${cx - r * 0.3} ${cy - r}
          Z
        `;
      case 'square':
        return `
          M ${cx - r} ${cy - r * 0.9}
          L ${cx + r} ${cy - r * 0.9}
          Q ${cx + r * 1.1} ${cy - r * 0.7}
            ${cx + r * 1.1} ${cy}
          L ${cx + r * 1.1} ${cy + r * 0.8}
          Q ${cx + r * 1.1} ${cy + r}
            ${cx + r} ${cy + r}
          L ${cx - r} ${cy + r}
          Q ${cx - r * 1.1} ${cy + r}
            ${cx - r * 1.1} ${cy + r * 0.8}
          L ${cx - r * 1.1} ${cy}
          Q ${cx - r * 1.1} ${cy - r * 0.7}
            ${cx - r} ${cy - r * 0.9}
          Z
        `;
      case 'teardrop':
        return `
          M ${cx} ${cy - r * 1.2}
          C ${cx + r * 1.1} ${cy - r * 0.6},
            ${cx + r * 1.1} ${cy + r * 0.4},
            ${cx} ${cy + r * 1.1}
          C ${cx - r * 1.1} ${cy + r * 0.4},
            ${cx - r * 1.1} ${cy - r * 0.6},
            ${cx} ${cy - r * 1.2}
          Z
        `;
      case 'rounded-rect':
        return `
          M ${cx - r * 1.1} ${cy - r * 0.8}
          L ${cx + r * 1.1} ${cy - r * 0.8}
          Q ${cx + r * 1.2} ${cy - r * 0.8}
            ${cx + r * 1.2} ${cy - r * 0.7}
          L ${cx + r * 1.2} ${cy + r * 0.7}
          Q ${cx + r * 1.2} ${cy + r * 0.9}
            ${cx + r * 1.1} ${cy + r * 0.9}
          L ${cx - r * 1.1} ${cy + r * 0.9}
          Q ${cx - r * 1.2} ${cy + r * 0.9}
            ${cx - r * 1.2} ${cy + r * 0.7}
          L ${cx - r * 1.2} ${cy - r * 0.7}
          Q ${cx - r * 1.2} ${cy - r * 0.8}
            ${cx - r * 1.1} ${cy - r * 0.8}
          Z
        `;
      default:
        return '';
    }
  };

  // Arm positions based on personality
  const getArmPaths = () => {
    const baseY = center;
    const armLength = bodyRadius * 0.8;

    if (expression === 'happy') {
      return {
        left: `M ${center - bodyRadius * 0.9} ${baseY} Q ${center - bodyRadius * 1.3} ${baseY - armLength} ${center - bodyRadius * 1.1} ${baseY - armLength * 1.2}`,
        right: `M ${center + bodyRadius * 0.9} ${baseY} Q ${center + bodyRadius * 1.3} ${baseY - armLength} ${center + bodyRadius * 1.1} ${baseY - armLength * 1.2}`,
      };
    } else if (expression === 'wrong') {
      return {
        left: `M ${center - bodyRadius * 0.9} ${baseY} Q ${center - bodyRadius * 1.2} ${baseY + armLength * 0.3} ${center - bodyRadius * 1.3} ${baseY + armLength * 0.5}`,
        right: `M ${center + bodyRadius * 0.9} ${baseY} Q ${center + bodyRadius * 1.2} ${baseY + armLength * 0.3} ${center + bodyRadius * 1.3} ${baseY + armLength * 0.5}`,
      };
    }

    // neutral
    return {
      left: `M ${center - bodyRadius * 0.9} ${baseY} Q ${center - bodyRadius * 1.3} ${baseY + armLength * 0.5} ${center - bodyRadius * 1.2} ${baseY + armLength}`,
      right: `M ${center + bodyRadius * 0.9} ${baseY} Q ${center + bodyRadius * 1.3} ${baseY + armLength * 0.5} ${center + bodyRadius * 1.2} ${baseY + armLength}`,
    };
  };

  const armPaths = getArmPaths();

  // Floating animation
  const floatAnimation: import('framer-motion').TargetAndTransition = {
    y: [0, -8, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={floatAnimation}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient
            id={`gradient-${character}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={config.color.light} />
            <stop offset="100%" stopColor={config.color.dark} />
          </linearGradient>

          {/* Subtle glow for body */}
          <filter id={`glow-${character}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shadow */}
        <ellipse
          cx={center}
          cy={size - 15}
          rx={bodyRadius * 0.8}
          ry={bodyRadius * 0.2}
          fill="rgba(0, 0, 0, 0.15)"
          style={{ filter: 'blur(4px)' }}
        />

        {/* Body */}
        <motion.path
          d={getBodyPath()}
          fill={`url(#gradient-${character})`}
          filter={`url(#glow-${character})`}
          initial={false}
          animate={
            expression === 'happy'
              ? {
                  scale: [1, 1.05, 1],
                  transition: { duration: 0.5 },
                }
              : expression === 'wrong'
              ? {
                  scale: [1, 0.95, 1],
                  transition: { duration: 0.3 },
                }
              : {}
          }
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Arms */}
        <motion.path
          d={armPaths.left}
          stroke={config.color.accent}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          initial={false}
          animate={{ d: armPaths.left }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        <motion.path
          d={armPaths.right}
          stroke={config.color.accent}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          initial={false}
          animate={{ d: armPaths.right }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        {/* Face Group */}
        <g transform={`translate(${center}, ${center - bodyRadius * 0.2})`}>
          {/* Eyebrows */}
          <motion.g
            initial={false}
            animate={{
              y: expr.eyebrows.y,
              transition: { duration: 0.2 },
            }}
          >
            <motion.path
              d="M -20 -8 Q -16 -11 -12 -8"
              stroke={config.color.accent}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              animate={{ rotate: expr.eyebrows.rotation }}
              transition={{ duration: 0.2 }}
              style={{ transformOrigin: '-16px -8px' }}
            />
            <motion.path
              d="M 12 -8 Q 16 -11 20 -8"
              stroke={config.color.accent}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              animate={{ rotate: -expr.eyebrows.rotation }}
              transition={{ duration: 0.2 }}
              style={{ transformOrigin: '16px -8px' }}
            />
          </motion.g>

          {/* Eyes */}
          <motion.g
            initial={false}
            animate={{
              y: expr.eyes.y,
              scale: expr.eyes.scale,
              transition: { duration: 0.2 },
            }}
          >
            {/* Left eye */}
            <g transform="translate(-16, 0)">
              <ellipse cx="0" cy="0" rx="7" ry="8" fill="white" />
              <motion.ellipse
                cx="0"
                cy={expr.pupils.y}
                rx="3.5"
                ry="4"
                fill="#2D3748"
                animate={{
                  scaleY: [1, 0.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
              <circle cx="-1" cy={expr.pupils.y - 1} r="1.5" fill="white" />
            </g>

            {/* Right eye */}
            <g transform="translate(16, 0)">
              <ellipse cx="0" cy="0" rx="7" ry="8" fill="white" />
              <motion.ellipse
                cx="0"
                cy={expr.pupils.y}
                rx="3.5"
                ry="4"
                fill="#2D3748"
                animate={{
                  scaleY: [1, 0.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
              <circle cx="-1" cy={expr.pupils.y - 1} r="1.5" fill="white" />
            </g>
          </motion.g>

          {/* Mouth */}
          <motion.path
            d={expr.mouth}
            stroke={config.color.accent}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            initial={false}
            animate={{ d: expr.mouth }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />

          {/* Rosy cheeks for happy expression */}
          {expression === 'happy' && (
            <>
              <motion.ellipse
                cx="-28"
                cy="8"
                rx="6"
                ry="4"
                fill={config.color.primary}
                opacity="0.3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
              />
              <motion.ellipse
                cx="28"
                cy="8"
                rx="6"
                ry="4"
                fill={config.color.primary}
                opacity="0.3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
              />
            </>
          )}
        </g>

        {/* Legs */}
        <g>
          <line
            x1={center - bodyRadius * 0.4}
            y1={center + bodyRadius}
            x2={center - bodyRadius * 0.5}
            y2={center + bodyRadius + 22}
            stroke={config.color.accent}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1={center + bodyRadius * 0.4}
            y1={center + bodyRadius}
            x2={center + bodyRadius * 0.5}
            y2={center + bodyRadius + 22}
            stroke={config.color.accent}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* Decorative elements based on personality */}
        {config.personality === 'playful' && expression === 'happy' && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <circle cx={center - 25} cy={center - 50} r="3" fill={config.color.light} opacity="0.6" />
            <circle cx={center + 30} cy={center - 45} r="2" fill={config.color.light} opacity="0.6" />
            <circle cx={center + 20} cy={center - 55} r="2.5" fill={config.color.light} opacity="0.6" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}
