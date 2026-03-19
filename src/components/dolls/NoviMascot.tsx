import { motion, useAnimation } from 'motion/react';
import { useEffect, useState } from 'react';

interface NoviMascotProps {
  mood?: 'idle' | 'happy' | 'wrong' | 'streak';
  size?: number;
  className?: string;
  color?: string;
  shape?: 'blob' | 'circle' | 'square';
}

export function NoviMascot({ 
  mood = 'idle', 
  size = 180,
  className = '',
  color = '#8B67FF',
  shape = 'blob'
}: NoviMascotProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const bodyControls = useAnimation();
  const faceControls = useAnimation();
  const shadowControls = useAnimation();
  const glowControls = useAnimation();

  // Parpadeo natural aleatorio
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (mood === 'idle') {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [mood]);

  // Animaciones según el mood
  useEffect(() => {
    switch (mood) {
      case 'idle':
        // Flotación suave continua
        bodyControls.start({
          y: [0, -8, 0],
          transition: {
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        });
        shadowControls.start({
          scale: [1, 0.9, 1],
          opacity: [0.3, 0.2, 0.3],
          transition: {
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        });
        glowControls.start({ opacity: 0 });
        break;

      case 'happy':
        // Salto celebratorio
        bodyControls.start({
          y: [0, -25, -5, 0],
          rotate: [0, -3, 3, 0],
          transition: {
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1],
          },
        }).then(() => {
          // Volver a idle
          bodyControls.start({
            y: [0, -8, 0],
            rotate: 0,
            transition: {
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          });
        });
        shadowControls.start({
          scale: [1, 0.7, 1.1, 1],
          opacity: [0.3, 0.15, 0.35, 0.3],
          transition: { duration: 0.6 },
        });
        glowControls.start({ opacity: 0 });
        break;

      case 'wrong':
        // Shake horizontal + reacción
        bodyControls.start({
          x: [0, -8, 8, -6, 6, -4, 4, 0],
          rotate: [0, -2, 2, -1, 1, 0],
          transition: {
            duration: 0.5,
            ease: 'easeInOut',
          },
        }).then(() => {
          // Pequeño bajón y volver a idle después de 1s
          bodyControls.start({
            y: [5, 0],
            transition: { duration: 0.3 },
          });
          setTimeout(() => {
            bodyControls.start({
              y: [0, -8, 0],
              transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            });
          }, 700);
        });
        shadowControls.start({
          scale: [1, 1.1, 1],
          transition: { duration: 0.5 },
        });
        glowControls.start({ opacity: 0 });
        break;

      case 'streak':
        // Movimiento energético + glow
        bodyControls.start({
          y: [0, -12, -6, -12, 0],
          scale: [1, 1.05, 1.02, 1.05, 1],
          rotate: [0, -5, 5, -3, 0],
          transition: {
            duration: 1,
            ease: 'easeInOut',
          },
        }).then(() => {
          bodyControls.start({
            y: [0, -10, 0],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          });
        });
        shadowControls.start({
          scale: [1, 0.85, 1],
          opacity: [0.3, 0.2, 0.3],
          transition: {
            duration: 2,
            repeat: Infinity,
          },
        });
        glowControls.start({
          opacity: [0, 0.6, 0],
          scale: [0.95, 1.1, 0.95],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        });
        break;
    }
  }, [mood, bodyControls, shadowControls, glowControls]);

  // Configuración de expresión facial según mood
  const getFaceExpression = () => {
    switch (mood) {
      case 'happy':
        return {
          eyeY: -0.08,
          eyeScale: 1.2,
          eyeShape: 'happy', // ojos curvos felices
          mouthPath: 'M -18 8 Q 0 20 18 8', // sonrisa grande
          eyebrowY: -0.25,
          eyebrowRotate: 8,
          blushOpacity: 0.6,
        };

      case 'wrong':
        return {
          eyeY: -0.05,
          eyeScale: 0.9,
          eyeShape: 'worried', // ojos más cerrados
          mouthPath: 'M -15 15 Q 0 8 15 15', // boca triste invertida
          eyebrowY: -0.2,
          eyebrowRotate: -12,
          blushOpacity: 0,
        };

      case 'streak':
        return {
          eyeY: -0.1,
          eyeScale: 1.3,
          eyeShape: 'excited', // ojos muy abiertos
          mouthPath: 'M -20 5 Q 0 22 20 5', // sonrisa muy grande
          eyebrowY: -0.28,
          eyebrowRotate: 12,
          blushOpacity: 0.7,
        };

      default: // idle
        return {
          eyeY: -0.08,
          eyeScale: 1,
          eyeShape: 'normal',
          mouthPath: 'M -12 10 Q 0 16 12 10', // sonrisa suave
          eyebrowY: -0.22,
          eyebrowRotate: 5,
          blushOpacity: 0.3,
        };
    }
  };

  const expression = getFaceExpression();
  const center = size / 2;
  const bodyRadius = size * 0.32;

  // Configuración de brazos según mood
  const getArmPaths = () => {
    const armY = center;
    const leftArmX = center - bodyRadius * 0.8;
    const rightArmX = center + bodyRadius * 0.8;

    switch (mood) {
      case 'happy':
      case 'streak':
        return {
          left: `M ${leftArmX} ${armY} Q ${leftArmX - 18} ${armY - 20} ${leftArmX - 12} ${armY - 35}`,
          right: `M ${rightArmX} ${armY} Q ${rightArmX + 18} ${armY - 20} ${rightArmX + 12} ${armY - 35}`,
        };

      case 'wrong':
        return {
          left: `M ${leftArmX} ${armY} Q ${leftArmX - 15} ${armY + 8} ${leftArmX - 10} ${armY + 25}`,
          right: `M ${rightArmX} ${armY} Q ${rightArmX + 15} ${armY + 8} ${rightArmX + 10} ${armY + 25}`,
        };

      default: // idle
        return {
          left: `M ${leftArmX} ${armY} L ${leftArmX - 10} ${armY + 30}`,
          right: `M ${rightArmX} ${armY} L ${rightArmX + 10} ${armY + 30}`,
        };
    }
  };

  const armPaths = getArmPaths();

  // Función para derivar colores del color base
  const getColorScheme = (baseColor: string) => {
    // Map de colores predefinidos
    const colorSchemes: Record<string, { light: string; dark: string; darker: string }> = {
      '#8B67FF': { light: '#9B7FFF', dark: '#7C5FE0', darker: '#5A3FB8' }, // Purple
      '#3054FF': { light: '#5A7AFF', dark: '#2040DD', darker: '#1A30AA' }, // Blue
      '#007D15': { light: '#00A71D', dark: '#006410', darker: '#004A0C' }, // Green
      '#FFD000': { light: '#FFE033', dark: '#DDB300', darker: '#AA8800' }, // Yellow
      '#FF9600': { light: '#FFAA33', dark: '#DD7F00', darker: '#AA6200' }, // Orange
      '#1CB0F6': { light: '#4CC2F8', dark: '#0D9BD4', darker: '#0A7AAA' }, // Cyan
      '#CE82FF': { light: '#DDA0FF', dark: '#B865E6', darker: '#9548C4' }, // Pink
    };

    return colorSchemes[baseColor] || { light: baseColor, dark: baseColor, darker: baseColor };
  };

  const colorScheme = getColorScheme(color);

  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size * 1.2 }}
    >
      {/* Glow effect para streak */}
      <motion.div
        animate={glowControls}
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(139, 103, 255, 0.4), transparent)',
          opacity: 0,
        }}
      />

      {/* Shadow */}
      <motion.div
        animate={shadowControls}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-md"
        style={{
          background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.3), transparent)',
        }}
      />

      {/* Character body */}
      <motion.div
        animate={bodyControls}
        className="absolute inset-0"
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: 'visible' }}
        >
          {/* Body - blob shape */}
          <motion.path
            d={`
              M ${center} ${center - bodyRadius}
              C ${center + bodyRadius * 1.2} ${center - bodyRadius * 0.8},
                ${center + bodyRadius * 1.1} ${center + bodyRadius * 0.6},
                ${center} ${center + bodyRadius}
              C ${center - bodyRadius * 1.1} ${center + bodyRadius * 0.6},
                ${center - bodyRadius * 1.2} ${center - bodyRadius * 0.8},
                ${center} ${center - bodyRadius}
              Z
            `}
            fill={`url(#bodyGradient-${color.replace('#', '')})`}
            initial={false}
            animate={mood === 'streak' ? {
              filter: [
                'drop-shadow(0 0 0px rgba(139, 103, 255, 0))',
                'drop-shadow(0 0 15px rgba(139, 103, 255, 0.6))',
                'drop-shadow(0 0 0px rgba(139, 103, 255, 0))',
              ],
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id={`bodyGradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colorScheme.light} />
              <stop offset="100%" stopColor={colorScheme.dark} />
            </linearGradient>
          </defs>

          {/* Arms */}
          <motion.path
            d={armPaths.left}
            stroke={colorScheme.darker}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={false}
            animate={{ d: armPaths.left }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          <motion.path
            d={armPaths.right}
            stroke={colorScheme.darker}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={false}
            animate={{ d: armPaths.right }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />

          {/* Face container */}
          <g transform={`translate(${center}, ${center})`}>
            {/* Eyebrows */}
            <motion.g
              initial={false}
              animate={{
                y: expression.eyebrowY * size,
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.path
                d="M -22 0 Q -18 -3 -14 0"
                stroke={colorScheme.darker}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                animate={{ rotate: expression.eyebrowRotate }}
                transition={{ duration: 0.2 }}
                style={{ transformOrigin: '-18px 0px' }}
              />
              <motion.path
                d="M 14 0 Q 18 -3 22 0"
                stroke={colorScheme.darker}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                animate={{ rotate: -expression.eyebrowRotate }}
                transition={{ duration: 0.2 }}
                style={{ transformOrigin: '18px 0px' }}
              />
            </motion.g>

            {/* Eyes */}
            <motion.g
              initial={false}
              animate={{
                y: expression.eyeY * size,
                scale: expression.eyeScale,
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Left eye */}
              <g transform="translate(-18, 0)">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="8"
                  ry={isBlinking ? "1" : "8"}
                  fill="white"
                />
                {!isBlinking && expression.eyeShape === 'happy' && (
                  <path
                    d="M -6 2 Q 0 -2 6 2"
                    stroke="#2D1B69"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                )}
                {!isBlinking && expression.eyeShape === 'worried' && (
                  <ellipse cx="0" cy="1" rx="4" ry="5" fill="#2D1B69" />
                )}
                {!isBlinking && expression.eyeShape === 'excited' && (
                  <>
                    <circle cx="0" cy="0" r="5" fill="#2D1B69" />
                    <circle cx="-1.5" cy="-1.5" r="2" fill="white" />
                  </>
                )}
                {!isBlinking && expression.eyeShape === 'normal' && (
                  <>
                    <circle cx="0" cy="0" r="4" fill="#2D1B69" />
                    <circle cx="-1" cy="-1" r="1.5" fill="white" />
                  </>
                )}
              </g>

              {/* Right eye */}
              <g transform="translate(18, 0)">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="8"
                  ry={isBlinking ? "1" : "8"}
                  fill="white"
                />
                {!isBlinking && expression.eyeShape === 'happy' && (
                  <path
                    d="M -6 2 Q 0 -2 6 2"
                    stroke="#2D1B69"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                )}
                {!isBlinking && expression.eyeShape === 'worried' && (
                  <ellipse cx="0" cy="1" rx="4" ry="5" fill="#2D1B69" />
                )}
                {!isBlinking && expression.eyeShape === 'excited' && (
                  <>
                    <circle cx="0" cy="0" r="5" fill="#2D1B69" />
                    <circle cx="-1.5" cy="-1.5" r="2" fill="white" />
                  </>
                )}
                {!isBlinking && expression.eyeShape === 'normal' && (
                  <>
                    <circle cx="0" cy="0" r="4" fill="#2D1B69" />
                    <circle cx="-1" cy="-1" r="1.5" fill="white" />
                  </>
                )}
              </g>
            </motion.g>

            {/* Blush */}
            <motion.g
              initial={false}
              animate={{ opacity: expression.blushOpacity }}
              transition={{ duration: 0.3 }}
            >
              <ellipse cx="-28" cy="5" rx="6" ry="4" fill="#FF6B9D" opacity="0.4" />
              <ellipse cx="28" cy="5" rx="6" ry="4" fill="#FF6B9D" opacity="0.4" />
            </motion.g>

            {/* Mouth */}
            <motion.path
              d={expression.mouthPath}
              stroke={colorScheme.darker}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial={false}
              animate={{ d: expression.mouthPath }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </g>

          {/* Legs */}
          <line
            x1={center - 12}
            y1={center + bodyRadius}
            x2={center - 14}
            y2={center + bodyRadius + 25}
            stroke={colorScheme.darker}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1={center + 12}
            y1={center + bodyRadius}
            x2={center + 14}
            y2={center + bodyRadius + 25}
            stroke={colorScheme.darker}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}