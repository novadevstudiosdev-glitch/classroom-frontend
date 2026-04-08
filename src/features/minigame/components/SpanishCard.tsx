import type { CSSProperties, DragEventHandler } from 'react';

export type Suit = 'oros' | 'copas' | 'espadas' | 'bastos';
export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 10 | 11 | 12;

type SpanishCardProps = {
  suit: Suit;
  value: CardValue;
  faceDown?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
  style?: CSSProperties;
  draggable?: boolean;
  onDragStart?: DragEventHandler<HTMLButtonElement>;
  onDragEnd?: DragEventHandler<HTMLButtonElement>;
};

const SUIT_MAP: Record<Suit, string> = {
  oros: 'oros',
  copas: 'copas',
  espadas: 'espadas',
  bastos: 'bastos',
};

const VALUE_MAP: Record<number, string> = {
  1: 'As',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  10: 'Sota',
  11: 'Caballo',
  12: 'Rey',
};

const VALUE_CODE_MAP: Record<CardValue, string> = {
  1: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  10: 'S',
  11: 'C',
  12: 'R',
};

export function getCardImageUrl(suit: Suit, value: CardValue): string {
  // Commons pattern for Germarquezm deck:
  // Aoros.png, 7copas.png, Sespadas.png, Cbastos.png, Roros.png
  const suitCode = SUIT_MAP[suit];
  const valueCode = VALUE_CODE_MAP[value];
  const fileName = `${valueCode}${suitCode}.png`;
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
}

export const BACK_URL =
  'https://commons.wikimedia.org/wiki/Special:FilePath/Reverso_baraja_espa%C3%B1ola.svg';

export function SpanishCard({
  suit,
  value,
  faceDown = false,
  onClick,
  disabled = false,
  selected = false,
  className = '',
  style,
  draggable = false,
  onDragStart,
  onDragEnd,
}: SpanishCardProps) {
  const imageUrl = faceDown ? BACK_URL : getCardImageUrl(suit, value);
  const isInteractive = Boolean(onClick) || draggable;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={[
        'relative rounded-xl overflow-hidden border-2 transition-all duration-200',
        'w-[80px] h-[120px] md:w-[100px] md:h-[150px]',
        'shadow-md hover:shadow-xl',
        selected
          ? '-translate-y-4 border-yellow-400 shadow-yellow-400/50 shadow-lg'
          : 'border-white/80',
        isInteractive && !disabled ? 'cursor-pointer hover:-translate-y-2' : 'cursor-default',
        disabled ? 'opacity-50' : '',
        className,
      ].join(' ')}
      style={style}
      title={faceDown ? 'Carta boca abajo' : `${VALUE_MAP[value]} de ${SUIT_MAP[suit]}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={faceDown ? 'Carta boca abajo' : `${VALUE_MAP[value]} de ${SUIT_MAP[suit]}`}
        className="w-full h-full object-cover"
        draggable={false}
      />
      {selected && <div className="absolute inset-0 bg-yellow-300/20 pointer-events-none" />}
    </button>
  );
}

export type CardData = {
  suit: Suit;
  value: CardValue;
};

export function cardFromCode(code: string): CardData {
  const suitChar = code.slice(-1);
  const val = parseInt(code.slice(0, -1), 10) as CardValue;
  const suitMap: Record<string, Suit> = {
    o: 'oros',
    c: 'copas',
    e: 'espadas',
    b: 'bastos',
  };
  return { suit: suitMap[suitChar] ?? 'oros', value: val };
}

export function CardBack({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      className={[
        'rounded-xl overflow-hidden border-2 border-white/80 shadow-md',
        'w-[80px] h-[120px] md:w-[100px] md:h-[150px]',
        className,
      ].join(' ')}
      style={style}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BACK_URL}
        alt="Carta boca abajo"
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  );
}
