'use client';
import { useState } from 'react';
import { Overlay } from './Overlay';
import {
  minigameService,
  type GenerateAIParams,
  type AIGameType,
  type AIOption,
  type AIQuestion,
  type AIGenerateResponse,
} from '../../services/minigame.service';

interface Props {
  onClose: () => void;
  onSaved: (id: string) => void;
}

type Status = 'idle' | 'loading' | 'done';

type EditableQuestionType = 'mcq' | 'true_false' | 'fill_blank' | 'order' | 'match';

const QUESTION_TYPES: { type: EditableQuestionType; label: string }[] = [
  { type: 'mcq',        label: 'Opción múltiple' },
  { type: 'true_false', label: 'Verdadero / Falso' },
  { type: 'fill_blank', label: 'Completar' },
  { type: 'order',      label: 'Ordenar' },
  { type: 'match',      label: 'Relacionar' },
];

const GAME_TYPES: { type: AIGameType; label: string; icon: string; accent: string; glow: string }[] = [
  { type: 'quiz',       label: 'Quiz',           icon: '❓', accent: '#6366f1', glow: 'rgba(99,102,241,0.2)' },
  { type: 'wordsearch', label: 'Sopa de letras', icon: '🔤', accent: '#0ea5e9', glow: 'rgba(14,165,233,0.2)' },
  { type: 'anagram',    label: 'Anagrama',       icon: '🔀', accent: '#f59e0b', glow: 'rgba(245,158,11,0.2)' },
];

const DIFFICULTIES = [
  { value: 'easy',   label: 'Fácil',   color: '#10b981' },
  { value: 'medium', label: 'Media',   color: '#f59e0b' },
  { value: 'hard',   label: 'Difícil', color: '#ef4444' },
];

const field: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(15,23,42,0.7)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10, padding: '10px 14px',
  color: '#f1f5f9', fontSize: 14, fontWeight: 500,
  outline: 'none', fontFamily: 'inherit',
};

export function AIGeneratorModal({ onClose, onSaved }: Props) {
  const [status, setStatus]         = useState<Status>('idle');
  const [hasResults, setHasResults] = useState(false);
  const [gameType, setGameType]     = useState<AIGameType>('quiz');
  const [topic, setTopic]           = useState('');
  const [count, setCount]           = useState(8);
  const [difficulty, setDifficulty] = useState<GenerateAIParams['difficulty']>('medium');
  const [error, setError]           = useState('');

  const [editTitle, setEditTitle]         = useState('');
  const [editQuestions, setEditQuestions] = useState<AIQuestion[]>([]);
  const [editWords, setEditWords]         = useState<string[]>([]);
  const [rawResponse, setRawResponse]     = useState<AIGenerateResponse | null>(null);

  const isLoading = status === 'loading';

  // ── Generate ────────────────────────────────────────────────────────────────
  const generate = async () => {
    if (!topic.trim()) { setError('Ingresá un tema para generar.'); return; }
    setError('');
    setStatus('loading');
    try {
      const res = await minigameService.generateAI({ topic: topic.trim(), questionCount: count, difficulty, gameType, language: 'es' });
      const responseData = res.data as { data?: AIGenerateResponse } & AIGenerateResponse;
      const raw: AIGenerateResponse = responseData.data ?? responseData;
      setRawResponse(raw);
      setEditTitle(raw.title ?? topic);
      if (raw.type === 'quiz') {
        setEditQuestions((raw.questions ?? []).map((q) => ({
          ...q,
          type: (q as any).type ?? 'mcq',
          options: Array.isArray(q.options) ? q.options : [],
          correct_option_id: q.correct_option_id ?? '0',
        })));
        setEditWords([]);
      } else {
        setEditWords((raw as AIGenerateResponse & { words?: string[] }).words ?? []);
        setEditQuestions([]);
      }
      setHasResults(true);
      setStatus('done');
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string | string[] } } };
      const msg = err?.response?.data?.message ?? 'Error al generar. Intentá de nuevo.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
      setStatus(hasResults ? 'done' : 'idle');
    }
  };

  // ── Edit helpers ─────────────────────────────────────────────────────────────
  const qType = (q: AIQuestion): EditableQuestionType => (q.type as EditableQuestionType) ?? 'mcq';

  const updateQText = (qi: number, text: string) =>
    setEditQuestions(qs => qs.map((q, i) => i === qi ? { ...q, text } : q));

  const setQuestionType = (qi: number, type: EditableQuestionType) =>
    setEditQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      const base = { ...q, type } as AIQuestion;
      if (type === 'mcq') {
        const opts: AIOption[] = Array.isArray(base.options) && base.options.length
          ? base.options
          : [
            { id: '0', text: '' },
            { id: '1', text: '' },
            { id: '2', text: '' },
            { id: '3', text: '' },
          ];
        return {
          ...base,
          options: opts,
          correct_option_id: base.correct_option_id ?? opts[0]?.id ?? '0',
        };
      }
      if (type === 'true_false') {
        let correct = base.correct;
        if (typeof correct !== 'boolean') correct = true;
        return { ...base, correct };
      }
      if (type === 'fill_blank') return { ...base, answer: base.answer ?? '' };
      if (type === 'order') {
        const items = Array.isArray(base.items) && base.items.length
          ? base.items
          : Array.isArray(base.options) ? base.options.map((o) => o.text).filter(Boolean) : [];
        return { ...base, items };
      }
      if (type === 'match') {
        const pairs = Array.isArray((base as any).pairs) ? (base as any).pairs : [];
        return { ...base, pairs };
      }
      return base;
    }));

  const updateOptionText = (qi: number, oi: number, text: string) =>
    setEditQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      const opts = Array.isArray(q.options) ? q.options : [];
      return { ...q, options: opts.map((o, j) => j === oi ? { ...o, text } : o) };
    }));

  const setCorrectOption = (qi: number, optId: string) =>
    setEditQuestions(qs => qs.map((q, i) => i === qi ? { ...q, correct_option_id: optId } : q));

  const setTrueFalseCorrect = (qi: number, correct: boolean) =>
    setEditQuestions(qs => qs.map((q, i) => i === qi ? { ...q, correct } : q));

  const setFillBlankAnswer = (qi: number, answer: string) =>
    setEditQuestions(qs => qs.map((q, i) => i === qi ? { ...q, answer } : q));

  const updateOrderItem = (qi: number, ii: number, val: string) =>
    setEditQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      const items = Array.isArray(q.items) ? q.items : [];
      return { ...q, items: items.map((x, j) => j === ii ? val : x) };
    }));

  const addOrderItem = (qi: number) =>
    setEditQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      const items = Array.isArray(q.items) ? q.items : [];
      return { ...q, items: [...items, ''] };
    }));

  const deleteOrderItem = (qi: number, ii: number) =>
    setEditQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      const items = Array.isArray(q.items) ? q.items : [];
      return { ...q, items: items.filter((_, j) => j !== ii) };
    }));

  const moveOrderItem = (qi: number, from: number, dir: -1 | 1) =>
    setEditQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      const items = Array.isArray(q.items) ? [...q.items] : [];
      const to = from + dir;
      if (from < 0 || from >= items.length || to < 0 || to >= items.length) return q;
      const tmp = items[from];
      items[from] = items[to];
      items[to] = tmp;
      return { ...q, items };
    }));

  const updatePair = (qi: number, pi: number, side: 'left' | 'right', val: string) =>
    setEditQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      const pairs = Array.isArray((q as any).pairs) ? [...(q as any).pairs] : [];
      const cur = pairs[pi] ?? { left: '', right: '' };
      pairs[pi] = { ...cur, [side]: val };
      return { ...q, pairs };
    }));

  const addPair = (qi: number) =>
    setEditQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      const pairs = Array.isArray((q as any).pairs) ? [...(q as any).pairs] : [];
      pairs.push({ left: '', right: '' });
      return { ...q, pairs };
    }));

  const deletePair = (qi: number, pi: number) =>
    setEditQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      const pairs = Array.isArray((q as any).pairs) ? [...(q as any).pairs] : [];
      return { ...q, pairs: pairs.filter((_: any, j: number) => j !== pi) };
    }));

  const deleteQuestion = (qi: number) =>
    setEditQuestions(qs => qs.filter((_, i) => i !== qi));

  const addQuestion = () => {
    setEditQuestions((qs) => ([
      ...qs,
      {
        type: 'mcq',
        text: '',
        options: [
          { id: '0', text: '' },
          { id: '1', text: '' },
          { id: '2', text: '' },
          { id: '3', text: '' },
        ],
        correct_option_id: '0',
        points_correct: 100,
        time_limit_ms: 20000,
      },
    ]));
  };
  const updateWord       = (wi: number, val: string)                  => setEditWords(ws => ws.map((w, i) => i === wi ? val.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑÜ]/gi, '') : w));
  const deleteWord       = (wi: number)                               => setEditWords(ws => ws.filter((_, i) => i !== wi));

  // ── Save ─────────────────────────────────────────────────────────────────────
  const save = async () => {
    if (!editTitle.trim()) { setError('Ingresá un título.'); return; }
    if (rawResponse?.type === 'quiz' && editQuestions.length === 0) { setError('No hay preguntas.'); return; }
    if ((rawResponse?.type === 'wordsearch' || rawResponse?.type === 'anagram') && editWords.length === 0) { setError('No hay palabras.'); return; }
    setError('');
    if (rawResponse?.type === 'quiz') {
      for (let i = 0; i < editQuestions.length; i++) {
        const q = editQuestions[i] as any;
        const t = qType(q);
        if (!String(q.text ?? '').trim()) { setError(`La pregunta ${i + 1} está vacía.`); return; }
        if (t === 'mcq') {
          const opts = Array.isArray(q.options) ? q.options : [];
          if (opts.length < 2) { setError(`La pregunta ${i + 1} necesita opciones.`); return; }
          if (!String(q.correct_option_id ?? '').trim()) { setError(`La pregunta ${i + 1} no tiene respuesta correcta.`); return; }
        } else if (t === 'true_false') {
          if (typeof q.correct !== 'boolean') { setError(`La pregunta ${i + 1} (V/F) no tiene correcta.`); return; }
        } else if (t === 'fill_blank') {
          if (!String(q.answer ?? '').trim()) { setError(`La pregunta ${i + 1} (Completar) necesita respuesta.`); return; }
        } else if (t === 'order') {
          const items = Array.isArray(q.items) ? q.items.map((x: string) => String(x ?? '').trim()).filter(Boolean) : [];
          if (items.length < 2) { setError(`La pregunta ${i + 1} (Ordenar) necesita al menos 2 ítems.`); return; }
        } else if (t === 'match') {
          const pairs = Array.isArray(q.pairs) ? q.pairs : [];
          const clean = pairs.map((p: any) => ({ left: String(p?.left ?? '').trim(), right: String(p?.right ?? '').trim() }))
            .filter((p: any) => p.left && p.right);
          if (clean.length < 1) { setError(`La pregunta ${i + 1} (Relacionar) necesita pares.`); return; }
        }
      }
    }

    const content_json: Record<string, any> = rawResponse?.type === 'quiz'
      ? { type: 'quiz', title: editTitle, questions: editQuestions }
      : { ...rawResponse!, title: editTitle, words: editWords } as Record<string, any>;
    try {
      const res = await minigameService.saveGeneratedGame({ title: editTitle, topic: topic.trim(), content_json });
      onSaved(res.data?.id ?? res.data?.data?.id ?? '');
      onClose();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string | string[] } } };
      const msg = err?.response?.data?.message ?? 'Error al guardar.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _activeType = GAME_TYPES.find(g => g.type === gameType)!

  return (
    <Overlay onClose={onClose} maxWidth={660}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.15))',
            border: '1px solid rgba(139,92,246,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '0 0 24px rgba(139,92,246,0.15)',
          }}>✨</div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
              Generador con IA
            </h2>
            <p style={{ fontSize: 13, color: '#475569', margin: '2px 0 0', fontWeight: 500 }}>
              Creá un juego completo en segundos
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)', color: '#475569',
            cursor: 'pointer', fontSize: 14, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >✕</button>
      </div>

      {/* ── Form (dims while loading) ── */}
      <div style={{ opacity: isLoading ? 0.45 : 1, pointerEvents: isLoading ? 'none' : undefined, transition: 'opacity .25s' }}>

        {/* Game type selector */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Tipo de juego
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          {GAME_TYPES.map(({ type, label, icon, accent, glow }) => {
            const active = gameType === type;
            return (
              <button
                key={type}
                onClick={() => setGameType(type)}
                style={{
                  padding: '12px 8px', borderRadius: 12, cursor: 'pointer',
                  border: `1.5px solid ${active ? accent + '55' : 'rgba(255,255,255,0.07)'}`,
                  background: active ? `linear-gradient(135deg, ${accent}18, ${accent}08)` : 'rgba(255,255,255,0.02)',
                  color: active ? '#fff' : 'rgba(255,255,255,0.35)',
                  fontFamily: 'inherit', fontWeight: 700, fontSize: 13,
                  transition: 'all .15s', display: 'flex',
                  flexDirection: 'column', alignItems: 'center', gap: 6,
                  boxShadow: active ? `0 0 16px ${glow}` : 'none',
                }}
              >
                <span style={{ fontSize: 22 }}>{icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Topic */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Temática
        </div>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && generate()}
          placeholder="ej. Historia Argentina, Biología celular, El Quijote..."
          maxLength={80}
          style={{ ...field, marginBottom: 14 }}
        />

        {/* Count + Difficulty */}
        <div style={{ display: 'grid', gridTemplateColumns: gameType === 'quiz' ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              {gameType === 'quiz' ? 'Preguntas' : 'Palabras'}
            </div>
            <input
              type="number"
              value={count}
              min={1}
              max={50}
              onChange={(e) => setCount(Math.max(1, Math.min(50, +e.target.value || 1)))}
              style={{ ...field, cursor: 'text' }}
            />
          </div>
          {gameType === 'quiz' && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Dificultad
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {DIFFICULTIES.map(d => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value as typeof difficulty)}
                    style={{
                      flex: 1, padding: '9px 4px', borderRadius: 8, cursor: 'pointer',
                      border: `1px solid ${difficulty === d.value ? d.color + '44' : 'rgba(255,255,255,0.07)'}`,
                      background: difficulty === d.value ? d.color + '14' : 'rgba(255,255,255,0.02)',
                      color: difficulty === d.value ? d.color : 'rgba(255,255,255,0.3)',
                      fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                      transition: 'all .15s',
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Loading bar ── */}
      {isLoading && (
        <div style={{ marginTop: 16, marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#a5b4fc' }}>Generando con IA...</span>
            <span style={{ fontSize: 12, color: '#475569' }}>Puede tardar unos segundos</span>
          </div>
          <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #4f46e5, #818cf8, #c4b5fd)', animation: 'aiProgress 1.8s ease-in-out infinite', backgroundSize: '200% 100%' }} />
          </div>
          <style>{`@keyframes aiProgress { 0%{background-position:100%} 100%{background-position:-100%} }`}</style>
        </div>
      )}

      {/* ── Results ── */}
      {hasResults && rawResponse && (
        <div style={{ opacity: isLoading ? 0.35 : 1, pointerEvents: isLoading ? 'none' : undefined, transition: 'opacity .25s' }}>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 99,
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.18)',
            }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {rawResponse.type === 'quiz'
                  ? `${editQuestions.length} preguntas generadas`
                  : `${editWords.length} palabras generadas`}
              </span>
            </div>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Title */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Título del juego
          </div>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{ ...field, marginBottom: 14, fontWeight: 700, fontSize: 15 }}
          />

          {/* ── Quiz questions ── */}
          {rawResponse.type === 'quiz' && (
            <div style={{ maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 6, marginRight: -6 }}>
              {editQuestions.map((q, qi) => (
                <div
                  key={qi}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12, padding: '14px 14px 10px',
                  }}
                >
                  {/* Q header */}
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                      background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, color: '#6366f1', marginTop: 1,
                    }}>
                      {qi + 1}
                    </div>
                    <textarea
                      value={q.text}
                      onChange={(e) => updateQText(qi, e.target.value)}
                      rows={2}
                      placeholder="Texto de la pregunta..."
                      style={{
                        ...field, flex: 1, resize: 'vertical', minHeight: 42,
                        fontFamily: 'inherit', lineHeight: 1.5, marginBottom: 0,
                        fontSize: 13, fontWeight: 500,
                      }}
                    />
                    <button
                      onClick={() => deleteQuestion(qi)}
                      style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                        color: 'rgba(248,113,113,0.7)', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >✕</button>
                  </div>

                  {/* Tipo */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingLeft: 34, marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)' }}>
                      Tipo
                    </div>
                    <select
                      value={qType(q)}
                      onChange={(e) => setQuestionType(qi, e.target.value as EditableQuestionType)}
                      style={{ ...field, width: 240, padding: '8px 10px', fontSize: 12, marginBottom: 0 }}
                    >
                      {QUESTION_TYPES.map((t) => (
                        <option key={t.type} value={t.type}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  {qType(q) === 'mcq' && (
                    <>
                      {/* Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingLeft: 34 }}>
                    {(q.options ?? []).map((opt, oi) => {
                      const correct = opt.id === q.correct_option_id;
                      return (
                        <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            onClick={() => setCorrectOption(qi, opt.id)}
                            title="Marcar como correcta"
                            style={{
                              width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                              border: `2px solid ${correct ? '#10b981' : 'rgba(255,255,255,0.12)'}`,
                              background: correct ? '#10b981' : 'transparent',
                              cursor: 'pointer', padding: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: correct ? '0 0 8px rgba(16,185,129,0.4)' : 'none',
                              transition: 'all .15s',
                            }}
                          >
                            {correct && <span style={{ color: '#fff', fontSize: 9, fontWeight: 900 }}>✓</span>}
                          </button>
                          <input
                            value={opt.text}
                            onChange={(e) => updateOptionText(qi, oi, e.target.value)}
                            placeholder={`Opción ${oi + 1}`}
                            style={{
                              ...field, flex: 1, marginBottom: 0, fontSize: 13, padding: '7px 12px',
                              borderColor: correct ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)',
                              background: correct ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
                              color: correct ? '#6ee7b7' : '#94a3b8',
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <p style={{ fontSize: 10, color: '#1e293b', marginTop: 8, paddingLeft: 34, fontStyle: 'italic' }}>
                    Tocá el círculo verde para cambiar la respuesta correcta
                  </p>
                    </>
                  )}

                  {qType(q) === 'true_false' && (
                    <div style={{ paddingLeft: 34, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Correcta:</span>
                      <button
                        onClick={() => setTrueFalseCorrect(qi, true)}
                        style={{
                          padding: '8px 10px', borderRadius: 10,
                          border: `1px solid ${q.correct === true ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.08)'}`,
                          background: q.correct === true ? 'rgba(16,185,129,0.10)' : 'rgba(255,255,255,0.02)',
                          color: q.correct === true ? '#6ee7b7' : 'rgba(255,255,255,0.35)',
                          cursor: 'pointer', fontWeight: 700, fontSize: 12,
                        }}
                      >
                        Verdadero
                      </button>
                      <button
                        onClick={() => setTrueFalseCorrect(qi, false)}
                        style={{
                          padding: '8px 10px', borderRadius: 10,
                          border: `1px solid ${q.correct === false ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.08)'}`,
                          background: q.correct === false ? 'rgba(16,185,129,0.10)' : 'rgba(255,255,255,0.02)',
                          color: q.correct === false ? '#6ee7b7' : 'rgba(255,255,255,0.35)',
                          cursor: 'pointer', fontWeight: 700, fontSize: 12,
                        }}
                      >
                        Falso
                      </button>
                    </div>
                  )}

                  {qType(q) === 'fill_blank' && (
                    <div style={{ paddingLeft: 34 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.22)', marginBottom: 6 }}>
                        Respuesta correcta
                      </div>
                      <input
                        value={String((q as any).answer ?? '')}
                        onChange={(e) => setFillBlankAnswer(qi, e.target.value)}
                        placeholder="Respuesta..."
                        style={{ ...field, marginBottom: 0, fontSize: 13 }}
                      />
                    </div>
                  )}

                  {qType(q) === 'order' && (
                    <div style={{ paddingLeft: 34, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.22)' }}>
                        Items (en orden correcto)
                      </div>
                      {((q.items as any) ?? []).map((it: string, ii: number) => (
                        <div key={ii} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button
                            onClick={() => moveOrderItem(qi, ii, -1)}
                            style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}
                            title="Subir"
                          >↑</button>
                          <button
                            onClick={() => moveOrderItem(qi, ii, 1)}
                            style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}
                            title="Bajar"
                          >↓</button>
                          <input
                            value={it}
                            onChange={(e) => updateOrderItem(qi, ii, e.target.value)}
                            style={{ ...field, marginBottom: 0, fontSize: 13, padding: '7px 12px' }}
                            placeholder={`Item ${ii + 1}`}
                          />
                          <button
                            onClick={() => deleteOrderItem(qi, ii)}
                            style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', color: 'rgba(248,113,113,0.6)', cursor: 'pointer', fontWeight: 800 }}
                            title="Eliminar"
                          >×</button>
                        </div>
                      ))}
                      <button
                        onClick={() => addOrderItem(qi)}
                        style={{
                          alignSelf: 'flex-start',
                          padding: '8px 10px', borderRadius: 10,
                          background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.22)',
                          color: '#a5b4fc', cursor: 'pointer', fontWeight: 800, fontSize: 12,
                        }}
                      >
                        + Agregar item
                      </button>
                    </div>
                  )}

                  {qType(q) === 'match' && (
                    <div style={{ paddingLeft: 34, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.22)' }}>
                        Pares (izquierda a derecha)
                      </div>
                      {(((q as any).pairs ?? []) as any[]).map((p, pi) => (
                        <div key={pi} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <input
                            value={String(p.left ?? '')}
                            onChange={(e) => updatePair(qi, pi, 'left', e.target.value)}
                            style={{ ...field, marginBottom: 0, fontSize: 13, padding: '7px 10px' }}
                            placeholder="Izquierda"
                          />
                          <span style={{ color: 'rgba(255,255,255,0.18)', fontWeight: 900 }}>{'->'}</span>
                          <input
                            value={String(p.right ?? '')}
                            onChange={(e) => updatePair(qi, pi, 'right', e.target.value)}
                            style={{ ...field, marginBottom: 0, fontSize: 13, padding: '7px 10px' }}
                            placeholder="Derecha"
                          />
                          <button
                            onClick={() => deletePair(qi, pi)}
                            style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', color: 'rgba(248,113,113,0.6)', cursor: 'pointer', fontWeight: 800 }}
                            title="Eliminar"
                          >x</button>
                        </div>
                      ))}
                      <button
                        onClick={() => addPair(qi)}
                        style={{
                          alignSelf: 'flex-start',
                          padding: '8px 10px', borderRadius: 10,
                          background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.22)',
                          color: '#a5b4fc', cursor: 'pointer', fontWeight: 800, fontSize: 12,
                        }}
                      >
                        + Agregar par
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={addQuestion}
                style={{
                  padding: '10px 12px', borderRadius: 12,
                  background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.22)',
                  color: '#c7d2fe', cursor: 'pointer', fontWeight: 800, fontSize: 13,
                }}
              >
                + Agregar pregunta
              </button>
            </div>
          )}

          {/* ── Words ── */}
          {(rawResponse.type === 'wordsearch' || rawResponse.type === 'anagram') && (
            <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 8, paddingRight: 4 }}>
              {editWords.map((w, wi) => (
                <div key={wi} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    value={w}
                    onChange={(e) => updateWord(wi, e.target.value)}
                    style={{
                      ...field, width: 108, marginBottom: 0, fontFamily: "'SF Mono', 'Fira Code', monospace",
                      textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.05em',
                      textAlign: 'center', padding: '8px 10px',
                    }}
                  />
                  <button
                    onClick={() => deleteWord(wi)}
                    style={{
                      width: 26, height: 26, borderRadius: 7,
                      background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)',
                      color: 'rgba(248,113,113,0.6)', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
          color: '#fca5a5', borderRadius: 10, padding: '10px 14px',
          fontSize: 13, fontWeight: 600, marginTop: 14,
        }}>
          <span style={{ flexShrink: 0 }}>⚠</span> {error}
        </div>
      )}

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        <button
          onClick={onClose}
          style={{
            padding: '11px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)', color: '#475569',
            fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
          }}
        >
          Cancelar
        </button>

        {hasResults && (
          <button
            onClick={generate}
            disabled={isLoading}
            style={{
              padding: '11px 18px', borderRadius: 10, flexShrink: 0,
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: '#c4b5fd', fontWeight: 700, fontSize: 14,
              cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            🔄 Regenerar
          </button>
        )}

        {hasResults ? (
          <button
            onClick={save}
            disabled={isLoading}
            style={{
              flex: 1, padding: '11px 20px', borderRadius: 10,
              background: 'linear-gradient(135deg, #059669, #10b981)',
              border: '1px solid rgba(16,185,129,0.35)',
              color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 20px rgba(16,185,129,0.25)',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            💾 Guardar juego
          </button>
        ) : (
          <button
            onClick={generate}
            disabled={isLoading}
            style={{
              flex: 1, padding: '11px 20px', borderRadius: 10,
              background: isLoading
                ? 'rgba(99,102,241,0.2)'
                : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)',
              border: '1px solid rgba(99,102,241,0.35)',
              color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              boxShadow: isLoading ? 'none' : '0 4px 24px rgba(79,70,229,0.4)',
            }}
          >
            {isLoading ? 'Generando...' : '✨ Generar'}
          </button>
        )}
      </div>

    </Overlay>
  );
}
