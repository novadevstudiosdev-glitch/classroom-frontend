"use client";

interface Props {
  scoreUs: number;
  scoreThem: number;
  lastEnvido?: string;
  lastTruco?: string;
}

function TallyMarks({ pts }: { pts: number }) {
  const MAX = 15;
  const groups: { count: number; filled: boolean }[] = [];

  let remaining = pts;
  let rendered = 0;

  while (rendered < MAX) {
    if (remaining >= 5) {
      groups.push({ count: 5, filled: true });
      remaining -= 5;
    } else if (remaining > 0) {
      groups.push({ count: remaining, filled: true });
      const emptyInGroup = 5 - remaining;
      if (emptyInGroup > 0) groups.push({ count: emptyInGroup, filled: false });
      remaining = 0;
    } else {
      groups.push({ count: Math.min(5, MAX - rendered), filled: false });
    }
    rendered += 5;
  }

  return (
    <div className="tally-container">
      {groups.map((g, gi) => (
        <div key={gi} className="tally-row">
          {Array.from({ length: g.count }).map((_, i) => {
            const isCross = g.filled && g.count === 5 && i === 4;
            return (
              <span key={i} className="palito">
                <svg viewBox="0 0 14 20" width="16" height="24">
                  {isCross ? (
                    <line
                      x1="12"
                      y1="2"
                      x2="2"
                      y2="18"
                      stroke={g.filled ? "#c8a44a" : "#2a1e0e"}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  ) : (
                    <line
                      x1="7"
                      y1="2"
                      x2="7"
                      y2="18"
                      stroke={g.filled ? "#c8a44a" : "#2a1e0e"}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function ScorePanel({ scoreUs, scoreThem, lastEnvido, lastTruco }: Props) {
  return (
    <div className="panel-left">
      <div className="sec-title">Marcador</div>

      <div className="teams-row">
        <div className="team-col">
          <div className="team-name">Nos.</div>
          <TallyMarks pts={scoreUs} />
          <div className="score-total">{scoreUs}</div>
        </div>
        <div className="vs-divider" />
        <div className="team-col">
          <div className="team-name">Ellos</div>
          <TallyMarks pts={scoreThem} />
          <div className="score-total">{scoreThem}</div>
        </div>
      </div>

      <hr className="sep" />

      <div className="sec-title">
        Cantos
      </div>

      <div className="canto-block">
        <div className="canto-item">
          <div className="canto-lbl">Envido</div>
          <div className="canto-val">{lastEnvido ?? "-"}</div>
        </div>
        <div className="canto-item">
          <div className="canto-lbl">Truco</div>
          <div className="canto-val canto-val-truco">{lastTruco ?? "-"}</div>
        </div>
      </div>
    </div>
  );
}
