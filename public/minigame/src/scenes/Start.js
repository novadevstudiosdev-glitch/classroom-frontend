// ============================================================
//  QUIZ EDUCATIVO — Kahoot PRO v6  (src/scenes/Start.js)
// ============================================================

const API_BASE = 'http://localhost:3000/api';

// ── Quiz de demo (se usa cuando no hay token en la URL) ───────
const DEMO_QUIZ = {
    id: 'demo',
    title: '🎮 Quiz Demo',
    description: 'Probá el juego sin necesidad de cuenta',
    is_first_play: true,
    config: { default_time_seconds: 20, points_correct: 100, points_wrong: 0, xp_multiplier: 1, max_xp: 200 },
    questions: [
        {
            id: 'q1', text: '¿Cuánto es 3 + 4?', image_url: null, time_seconds: 20, xp_value: 10,
            options: [
                { id: 'q1a', text: '6' },
                { id: 'q1b', text: '7' },
                { id: 'q1c', text: '8' },
                { id: 'q1d', text: '5' },
            ],
            correct_option_id: 'q1b',
        },
        {
            id: 'q2', text: '¿Cuántas patas tiene una araña?', image_url: null, time_seconds: 15, xp_value: 10,
            options: [
                { id: 'q2a', text: '6 patas' },
                { id: 'q2b', text: '4 patas' },
                { id: 'q2c', text: '8 patas' },
                { id: 'q2d', text: '10 patas' },
            ],
            correct_option_id: 'q2c',
        },
        {
            id: 'q3', text: '¿Cuál es la capital de Francia?', image_url: null, time_seconds: 20, xp_value: 10,
            options: [
                { id: 'q3a', text: 'Madrid' },
                { id: 'q3b', text: 'Londres' },
                { id: 'q3c', text: 'París' },
                { id: 'q3d', text: 'Roma' },
            ],
            correct_option_id: 'q3c',
        },
        {
            id: 'q4', text: '¿De qué color es el cielo de día?', image_url: null, time_seconds: 10, xp_value: 5,
            options: [
                { id: 'q4a', text: 'Verde' },
                { id: 'q4b', text: 'Azul' },
                { id: 'q4c', text: 'Rojo' },
            ],
            correct_option_id: 'q4b',
        },
    ],
};

function getUrlParams() {
    const p = new URLSearchParams(window.location.search);
    return {
        instanceId: p.get('instanceId') || null,
        token:      p.get('token') || localStorage.getItem('access_token') || null,
    };
}

window.QUIZ_STATE = {
    instanceId:   null,
    token:        null,
    quizData:     null,
    startedAt:    null,
    answers:      [],
    submitResult: null,
};

// ── Paleta Kahoot ─────────────────────────────────────────────
const PAL = {
    BG:        '#1a0a3a',
    BG_HEX:    0x1a0a3a,
    HEADER:    0x2d1b69,
    CARD_BG:   0xffffff,
    OPTS: [
        { hex: 0xe21b3c, dark: 0x8c0e23, shape: '▲', label: 'A' },
        { hex: 0x1368ce, dark: 0x0a3d7a, shape: '◆', label: 'B' },
        { hex: 0xd89e00, dark: 0x8a6400, shape: '●', label: 'C' },
        { hex: 0x26890c, dark: 0x145006, shape: '■', label: 'D' },
        { hex: 0x9b3fce, dark: 0x5a1a7a, shape: '★', label: 'E' },
        { hex: 0x0aa3a3, dark: 0x065e5e, shape: '♥', label: 'F' },
    ],
    CORRECT:   0x2ecc71,
    WRONG:     0xe21b3c,
    GOLD:      0xf9c74f,
    GOLD_S:    '#f9c74f',
    WHITE:     0xffffff,
    WHITE_S:   '#ffffff',
    LIGHT_S:   '#c8b4f8',
    DIM:       0x2d1b69,
};

// ── Helpers ───────────────────────────────────────────────────
function fillRound(g, x, y, w, h, r, color, alpha) {
    g.fillStyle(color, alpha ?? 1);
    g.fillRoundedRect(x, y, w, h, r);
}

function strokeRound(g, x, y, w, h, r, color, lw) {
    g.lineStyle(lw ?? 3, color, 1);
    g.strokeRoundedRect(x, y, w, h, r);
}

// ================================================================
//  LOADING
// ================================================================
export class LoadingScene extends Phaser.Scene {
    constructor() { super({ key: 'LoadingScene' }); }

    async create() {
        const W = this.scale.width, H = this.scale.height;
        this.cameras.main.setBackgroundColor(PAL.BG);

        // Logo animado
        const logo = this.add.text(W / 2, H / 2 - 50, '🎓', { font: '64px Arial' }).setOrigin(0.5);
        this.tweens.add({ targets: logo, scaleX: 1.15, scaleY: 1.15, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

        this.add.text(W / 2, H / 2 + 20, 'Cargando quiz...', {
            font: 'bold 22px Arial', color: PAL.LIGHT_S,
        }).setOrigin(0.5);

        // Barra de carga animada
        const barW = 260;
        const barG = this.add.graphics();
        barG.fillStyle(0x3d2280, 1);
        barG.fillRoundedRect(W / 2 - barW / 2, H / 2 + 55, barW, 8, 4);
        const fill = this.add.graphics();
        this.tweens.add({
            targets: { v: 0 }, v: barW - 8,
            duration: 1200, ease: 'Sine.InOut',
            onUpdate: (t, obj) => {
                fill.clear();
                fill.fillStyle(0x9b6fef, 1);
                fill.fillRoundedRect(W / 2 - barW / 2, H / 2 + 55, obj.v + 8, 8, 4);
            },
        });

        const { instanceId, token } = getUrlParams();
        window.QUIZ_STATE.instanceId = instanceId;
        window.QUIZ_STATE.token      = token;

        // ── MODO DEMO (sin token ni instanceId) ───────────────
        if (!instanceId || !token) {
            window.QUIZ_STATE.quizData = DEMO_QUIZ;
            this.cameras.main.fadeOut(400, 26, 10, 58);
            this.time.delayedCall(400, () => this.scene.start('MenuScene'));
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/minigame-instances/${instanceId}/play`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const b = await res.json().catch(() => ({}));
                this.showError(b.message || `Error ${res.status}`);
                return;
            }
            const body = await res.json();
            window.QUIZ_STATE.quizData = body.data ?? body;
            this.cameras.main.fadeOut(400, 26, 10, 58);
            this.time.delayedCall(400, () => this.scene.start('MenuScene'));
        } catch (_) {
            this.showError('No se pudo conectar con el servidor.');
        }
    }

    showError(msg) {
        const W = this.scale.width, H = this.scale.height;
        this.add.text(W / 2, H / 2 + 90, msg, {
            font: '16px Arial', color: '#ff6b6b',
            wordWrap: { width: W - 60 }, align: 'center',
        }).setOrigin(0.5);
    }
}

// ================================================================
//  MENÚ
// ================================================================
export class MenuScene extends Phaser.Scene {
    constructor() { super({ key: 'MenuScene' }); }

    create() {
        const W = this.scale.width, H = this.scale.height;
        const quiz = window.QUIZ_STATE.quizData;
        this.cameras.main.setBackgroundColor(PAL.BG);
        this.cameras.main.fadeIn(500);

        // Fondo con ondas decorativas
        const bg = this.add.graphics();
        bg.fillStyle(0x2d1b69, 0.5);
        bg.fillEllipse(W * 0.8, H * 0.2, 320, 320);
        bg.fillStyle(0x1e1055, 0.6);
        bg.fillEllipse(W * 0.15, H * 0.75, 280, 280);

        // Estrellitas de fondo
        for (let i = 0; i < 18; i++) {
            const star = this.add.text(
                Phaser.Math.Between(10, W - 10),
                Phaser.Math.Between(10, H - 10),
                '✦', { font: `${Phaser.Math.Between(10, 22)}px Arial`, color: '#ffffff' }
            ).setAlpha(Phaser.Math.FloatBetween(0.05, 0.25));
            this.tweens.add({
                targets: star, alpha: 0,
                duration: Phaser.Math.Between(1500, 3000),
                yoyo: true, repeat: -1,
                delay: Phaser.Math.Between(0, 2000),
            });
        }

        // Emoji flotante
        const logoY = H * 0.20;
        const logo = this.add.text(W / 2, logoY, '🎓', { font: '72px Arial' }).setOrigin(0.5);
        this.tweens.add({ targets: logo, y: logoY - 12, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

        // Título del quiz
        this.add.text(W / 2, H * 0.38, quiz?.title || 'Quiz', {
            font: "bold 38px 'Arial Rounded MT Bold', Arial",
            color: PAL.WHITE_S,
            wordWrap: { width: W - 60 }, align: 'center',
            stroke: '#000000', strokeThickness: 1,
        }).setOrigin(0.5);

        if (quiz?.description) {
            this.add.text(W / 2, H * 0.48, quiz.description, {
                font: '17px Arial', color: PAL.LIGHT_S,
                wordWrap: { width: W - 80 }, align: 'center',
            }).setOrigin(0.5);
        }

        // Pills info
        const pillY = H * 0.57;
        this._pill(W / 2 - 105, pillY, `📋 ${quiz?.questions?.length ?? 0} preguntas`, 0x9b6fef);
        this._pill(W / 2 + 105, pillY,
            quiz?.is_first_play ? '⭐ Nota oficial' : '🔄 Práctica',
            quiz?.is_first_play ? 0x2ecc71 : 0x888888
        );

        // Botón JUGAR
        this._btnJugar(W / 2, H * 0.78);
    }

    _pill(cx, cy, label, color) {
        const pw = 190, ph = 38;
        const g = this.add.graphics();
        g.fillStyle(color, 0.2);
        g.fillRoundedRect(cx - pw / 2, cy - ph / 2, pw, ph, 19);
        g.lineStyle(2, color, 0.9);
        g.strokeRoundedRect(cx - pw / 2, cy - ph / 2, pw, ph, 19);
        this.add.text(cx, cy, label, { font: 'bold 15px Arial', color: PAL.WHITE_S }).setOrigin(0.5);
    }

    _btnJugar(cx, cy) {
        const BW = 300, BH = 76;
        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.4);
        shadow.fillRoundedRect(cx - BW / 2 + 5, cy - BH / 2 + 8, BW, BH, 38);

        const bg = this.add.graphics();
        const icon = this.add.text(cx - 50, cy, '▶', { font: 'bold 28px Arial', color: PAL.WHITE_S }).setOrigin(0.5).setDepth(2);
        const txt  = this.add.text(cx + 22, cy, 'JUGAR', { font: "bold 30px 'Arial Rounded MT Bold', Arial", color: PAL.WHITE_S }).setOrigin(0.5).setDepth(2);

        const draw = (h) => {
            bg.clear();
            bg.fillStyle(h ? 0xb07af5 : 0x9b4dca, 1);
            bg.fillRoundedRect(cx - BW / 2, cy - BH / 2, BW, BH, 38);
            bg.fillStyle(0xffffff, 0.15);
            bg.fillRoundedRect(cx - BW / 2 + 4, cy - BH / 2 + 4, BW - 8, BH / 2 - 4, { tl: 34, tr: 34, bl: 0, br: 0 });
        };
        draw(false);

        const z = this.add.zone(cx, cy, BW, BH).setInteractive({ useHandCursor: true }).setDepth(3);
        z.on('pointerover',  () => { draw(true);  this.tweens.add({ targets: [bg, txt, icon], scaleX: 1.05, scaleY: 1.05, duration: 80 }); });
        z.on('pointerout',   () => { draw(false); this.tweens.add({ targets: [bg, txt, icon], scaleX: 1,    scaleY: 1,    duration: 80 }); });
        z.on('pointerdown',  () => {
            window.QUIZ_STATE.answers   = [];
            window.QUIZ_STATE.startedAt = Date.now();
            this.cameras.main.flash(200, 155, 89, 182, false);
            this.time.delayedCall(250, () => {
                this.cameras.main.fadeOut(300, 26, 10, 58);
                this.time.delayedCall(300, () => this.scene.start('QuizScene'));
            });
        });

        this.tweens.add({ targets: [bg, txt, icon, shadow], y: '-=8', duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }
}

// ================================================================
//  QUIZ — Layout tipo Kahoot real
// ================================================================
export class QuizScene extends Phaser.Scene {
    constructor() { super({ key: 'QuizScene' }); }

    init() {
        this.idx      = 0;
        this.score    = 0;
        this.bloq     = false;
        this.elems    = [];
        this.timerEvt = null;
        this.qStartMs = 0;
    }

    create() {
        this.cameras.main.fadeIn(250);
        this.questions = window.QUIZ_STATE.quizData?.questions ?? [];
        this.config    = window.QUIZ_STATE.quizData?.config ?? {};
        this.mostrar();
    }

    limpiar() {
        if (this.timerEvt) { this.timerEvt.remove(false); this.timerEvt = null; }
        this.elems.forEach(e => e && e.destroy());
        this.elems = [];
    }

    mostrar() {
        this.limpiar();
        this.bloq     = false;
        this.qStartMs = Date.now();

        const W = this.scale.width, H = this.scale.height;
        const d       = this.questions[this.idx];
        const total   = this.questions.length;
        const e       = this.elems;

        if (!d) { this.finalizarQuiz(); return; }

        const timeSec = d.time_seconds ?? this.config.default_time_seconds ?? 30;
        const options = d.options ?? [];
        const totalMs = timeSec * 1000;

        // ── FONDO ──────────────────────────────────────────────
        const bgG = this.add.graphics();
        bgG.fillStyle(PAL.BG_HEX, 1);
        bgG.fillRect(0, 0, W, H);
        e.push(bgG);

        // ── TOP BAR ────────────────────────────────────────────
        const topH = 58;
        const topG = this.add.graphics();
        topG.fillStyle(PAL.HEADER, 1);
        topG.fillRect(0, 0, W, topH);
        e.push(topG);

        // Pregunta N/Total — pill izquierda
        const pillG = this.add.graphics();
        pillG.fillStyle(0x9b4dca, 1);
        pillG.fillRoundedRect(14, 13, 96, 32, 16);
        e.push(pillG);
        e.push(this.add.text(62, 29, `${this.idx + 1} / ${total}`, {
            font: 'bold 15px Arial', color: PAL.WHITE_S,
        }).setOrigin(0.5));

        // Score — pill derecha con estrella
        const scG = this.add.graphics();
        scG.fillStyle(PAL.GOLD, 1);
        scG.fillRoundedRect(W - 110, 13, 96, 32, 16);
        e.push(scG);
        e.push(this.add.text(W - 62, 29, `★  ${this.score}`, {
            font: 'bold 16px Arial', color: '#2a1a00',
        }).setOrigin(0.5));

        // Barra progreso ultra delgada
        const progG = this.add.graphics();
        progG.fillStyle(0x1a0a3a, 1);
        progG.fillRect(0, topH, W, 5);
        progG.fillStyle(0x9b4dca, 1);
        progG.fillRect(0, topH, W * (this.idx / total), 5);
        e.push(progG);

        // ── TIMER — barra top + círculo central ────────────────
        const timerBarY = topH + 5;
        const timerBarH = 10;

        const timerBarBg = this.add.graphics();
        timerBarBg.fillStyle(0x2d1b69, 1);
        timerBarBg.fillRect(0, timerBarY, W, timerBarH);
        e.push(timerBarBg);

        const timerBarFill = this.add.graphics();
        e.push(timerBarFill);

        // Círculo timer — centrado, prominente
        const tcX = W / 2, tcY = timerBarY + timerBarH + 44, tcR = 36;
        const timerRingG = this.add.graphics();
        const timerNumTxt = this.add.text(tcX, tcY, `${timeSec}`, {
            font: 'bold 28px Arial', color: PAL.WHITE_S,
        }).setOrigin(0.5).setDepth(2);
        e.push(timerRingG, timerNumTxt);

        const drawTimer = (remaining) => {
            const ratio = Math.max(0, remaining / totalMs);
            const color = ratio > 0.5 ? 0x2ecc71 : ratio > 0.25 ? 0xf9c74f : 0xe21b3c;
            const secs  = Math.ceil(remaining / 1000);

            // Barra
            timerBarFill.clear();
            timerBarFill.fillStyle(color, 1);
            timerBarFill.fillRect(0, timerBarY, W * ratio, timerBarH);

            // Círculo
            timerRingG.clear();
            timerRingG.fillStyle(PAL.HEADER, 1);
            timerRingG.fillCircle(tcX, tcY, tcR);
            timerRingG.lineStyle(5, color, 1);
            timerRingG.strokeCircle(tcX, tcY, tcR);
            // Arco de progreso
            timerRingG.lineStyle(5, color, 0.3);
            timerRingG.beginPath();
            timerRingG.arc(tcX, tcY, tcR - 8, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * ratio, false);
            timerRingG.strokePath();

            timerNumTxt.setText(`${secs}`);
            timerNumTxt.setColor(ratio < 0.25 ? '#e21b3c' : PAL.WHITE_S);
            if (secs <= 5 && !this.bloq) {
                this.tweens.add({ targets: timerNumTxt, scaleX: 1.3, scaleY: 1.3, duration: 120, yoyo: true });
            }
        };
        drawTimer(totalMs);

        this.timerEvt = this.time.addEvent({
            delay: 50,
            repeat: Math.ceil(totalMs / 50) + 5,
            callback: () => {
                const elapsed   = Date.now() - this.qStartMs;
                const remaining = Math.max(0, totalMs - elapsed);
                drawTimer(remaining);
                if (remaining <= 0 && !this.bloq) {
                    this.registrarRespuesta(d, null);
                    this.mostrarFeedbackBanner('⏰  ¡Tiempo agotado!', 0x8e44ad);
                    this.cameras.main.shake(180, 0.005);
                    this.time.delayedCall(1700, () => this.avanzar());
                }
            },
        });

        // ── TARJETA DE PREGUNTA ────────────────────────────────
        const qCardTop  = tcY + tcR + 14;
        const qCardH    = d.image_url ? 76 : 96;
        const qPad      = 20;

        const qShadow = this.add.graphics();
        qShadow.fillStyle(0x000000, 0.45);
        qShadow.fillRoundedRect(qPad + 5, qCardTop + 7, W - qPad * 2, qCardH, 18);
        e.push(qShadow);

        const qCard = this.add.graphics();
        qCard.fillStyle(PAL.WHITE, 1);
        qCard.fillRoundedRect(qPad, qCardTop, W - qPad * 2, qCardH, 18);
        // Banda coloreada izquierda
        qCard.fillStyle(0x9b4dca, 1);
        qCard.fillRoundedRect(qPad, qCardTop, 6, qCardH, { tl: 18, tr: 0, bl: 18, br: 0 });
        e.push(qCard);

        e.push(this.add.text(W / 2 + 3, qCardTop + qCardH / 2, d.text, {
            font: `bold ${d.image_url ? 18 : 21}px 'Arial Rounded MT Bold', Arial`,
            color: '#1a0a3a',
            wordWrap: { width: W - qPad * 2 - 32 },
            align: 'center',
        }).setOrigin(0.5));

        // Imagen si hay
        if (d.image_url) {
            const imgKey = `img_q${this.idx}`;
            const imgY   = qCardTop + qCardH + 8;
            const imgH   = 90;
            const imgBg  = this.add.graphics();
            imgBg.fillStyle(0x2d1b69, 1);
            imgBg.fillRoundedRect(W / 2 - 90, imgY, 180, imgH, 12);
            e.push(imgBg);
            if (!this.textures.exists(imgKey)) {
                this.load.image(imgKey, d.image_url);
                this.load.once('complete', () => this._putImg(imgKey, W / 2, imgY + imgH / 2, 170, imgH - 10, e));
                this.load.start();
            } else {
                this._putImg(imgKey, W / 2, imgY + imgH / 2, 170, imgH - 10, e);
            }
        }

        // ── OPCIONES — cuadrícula Kahoot ───────────────────────
        const optAreaTop = qCardTop + qCardH + (d.image_url ? 106 : 14);
        const optAreaBot = H - 12;
        const optAreaH   = optAreaBot - optAreaTop;

        const cols    = options.length <= 2 ? 1 : 2;
        const rows    = Math.ceil(options.length / cols);
        const gapX    = 12, gapY = 10;
        const oPad    = 14;
        const oW      = (W - oPad * 2 - gapX * (cols - 1)) / cols;
        const oH      = Math.min(90, (optAreaH - gapY * (rows - 1)) / rows);

        const optGfxList = [];

        options.forEach((opt, i) => {
            const col  = i % cols;
            const row  = Math.floor(i / cols);
            // Última opción impar → centrada
            const isLastOdd = options.length % 2 !== 0 && i === options.length - 1;
            const ox = isLastOdd ? oPad + (oW + gapX) * 0.5 : oPad + col * (oW + gapX);
            const oy = optAreaTop + row * (oH + gapY);
            const pal = PAL.OPTS[i % PAL.OPTS.length];

            const og = this.add.graphics();
            optGfxList.push(og);
            e.push(og);

            const drawOpt = (state) => {
                og.clear();
                let fillColor = pal.hex;
                if (state === 'correct') fillColor = PAL.CORRECT;
                if (state === 'wrong')   fillColor = PAL.WRONG;
                if (state === 'dim')     fillColor = 0x333355;
                if (state === 'hover') {
                    const c = Phaser.Display.Color.IntegerToRGB(pal.hex);
                    fillColor = Phaser.Display.Color.GetColor(
                        Math.min(255, c.r + 30), Math.min(255, c.g + 30), Math.min(255, c.b + 30)
                    );
                }

                // Sombra
                og.fillStyle(state === 'dim' ? 0x111122 : pal.dark, 1);
                og.fillRoundedRect(ox + 3, oy + 6, oW, oH, 14);
                // Cuerpo
                og.fillStyle(fillColor, 1);
                og.fillRoundedRect(ox, oy, oW, oH, 14);
                // Brillo superior
                og.fillStyle(0xffffff, 0.18);
                og.fillRoundedRect(ox + 4, oy + 4, oW - 8, oH * 0.42, { tl: 10, tr: 10, bl: 0, br: 0 });
                // Badge ícono
                og.fillStyle(0x000000, 0.25);
                og.fillCircle(ox + 30, oy + oH / 2, 18);
            };
            drawOpt('normal');

            // Ícono shape dentro del badge
            const iconT = this.add.text(ox + 30, oy + oH / 2, pal.shape, {
                font: 'bold 18px Arial', color: PAL.WHITE_S,
            }).setOrigin(0.5).setDepth(1);
            e.push(iconT);

            // Texto opción
            const maxTW = isLastOdd ? oW - 62 : oW - 62;
            const optT = this.add.text(ox + 54, oy + oH / 2, opt.text, {
                font: `bold ${oH > 70 ? 20 : 17}px 'Arial Rounded MT Bold', Arial`,
                color: PAL.WHITE_S,
                wordWrap: { width: maxTW },
            }).setOrigin(0, 0.5).setDepth(1);
            e.push(optT);

            // Zona interactiva
            const zone = this.add.zone(ox + oW / 2, oy + oH / 2, oW, oH).setInteractive({ useHandCursor: true }).setDepth(2);
            e.push(zone);

            zone.on('pointerover',  () => {
                if (!this.bloq) {
                    drawOpt('hover');
                    this.tweens.add({ targets: [og, iconT, optT], scaleX: 1.025, scaleY: 1.025, duration: 80 });
                }
            });
            zone.on('pointerout',   () => {
                if (!this.bloq) {
                    drawOpt('normal');
                    this.tweens.add({ targets: [og, iconT, optT], scaleX: 1, scaleY: 1, duration: 80 });
                }
            });
            zone.on('pointerdown',  () => {
                if (this.bloq) return;
                const timeTaken = Date.now() - this.qStartMs;
                this.registrarRespuesta(d, opt.id, timeTaken);

                // Feedback visual inmediato
                drawOpt('normal');
                this.tweens.add({
                    targets: og, scaleX: 1.06, scaleY: 1.06, duration: 100, yoyo: true,
                    onComplete: () => drawOpt('normal'),
                });

                // Dim las otras
                optGfxList.forEach((oog, j) => { if (j !== i) { oog.clear(); fillDim(oog, options[j], j); } });

                this.mostrarFeedbackBanner('⏳  ¡Respondido!', 0x9b4dca);
                this.cameras.main.flash(180, 155, 77, 202, false);
                this.time.delayedCall(1600, () => this.avanzar());

                function fillDim(oog, opt2, j2) {
                    const p2 = PAL.OPTS[j2 % PAL.OPTS.length];
                    oog.fillStyle(0x1a1240, 1);
                    oog.fillRoundedRect(oPad + (j2 % cols) * (oW + gapX) + 3,
                        optAreaTop + Math.floor(j2 / cols) * (oH + gapY) + 6, oW, oH, 14);
                    oog.fillStyle(0x2a1f55, 1);
                    oog.fillRoundedRect(oPad + (j2 % cols) * (oW + gapX),
                        optAreaTop + Math.floor(j2 / cols) * (oH + gapY), oW, oH, 14);
                }
            });
        });

        // Número decorativo fondo
        const numDec = this.add.text(W / 2, H / 2 + 60, `${this.idx + 1}`, {
            font: 'bold 340px Arial', color: '#9b4dca',
        }).setOrigin(0.5).setAlpha(0.035).setDepth(0);
        e.push(numDec);
    }

    registrarRespuesta(question, selectedOptionId, timeTakenMs) {
        if (this.bloq) return;
        this.bloq = true;
        window.QUIZ_STATE.answers.push({
            question_id:        question.id,
            selected_option_id: selectedOptionId,
            time_taken_ms:      Math.round(timeTakenMs ?? (Date.now() - this.qStartMs)),
        });
        if (selectedOptionId !== null) this.score += 5;
    }

    mostrarFeedbackBanner(msg, color) {
        const W = this.scale.width, H = this.scale.height;
        const fw = 300, fh = 54;
        const cont = this.add.container(W / 2, H + 40);
        const fg = this.add.graphics();
        fg.fillStyle(0x000000, 0.5);
        fg.fillRoundedRect(-fw / 2 + 4, -fh / 2 + 6, fw, fh, 27);
        fg.fillStyle(color, 1);
        fg.fillRoundedRect(-fw / 2, -fh / 2, fw, fh, 27);
        fg.fillStyle(0xffffff, 0.18);
        fg.fillRoundedRect(-fw / 2 + 4, -fh / 2 + 4, fw - 8, fh / 2 - 4, { tl: 23, tr: 23, bl: 0, br: 0 });
        const ft = this.add.text(0, 0, msg, {
            font: "bold 21px 'Arial Rounded MT Bold', Arial", color: PAL.WHITE_S,
        }).setOrigin(0.5);
        cont.add([fg, ft]);
        this.elems.push(cont);
        this.tweens.add({ targets: cont, y: H - 44, duration: 320, ease: 'Back.Out' });
    }

    _putImg(key, cx, cy, maxW, maxH, e) {
        try {
            const img = this.add.image(cx, cy, key);
            img.setScale(Math.min(maxW / img.width, maxH / img.height));
            e.push(img);
        } catch (_) {}
    }

    avanzar() {
        this.idx++;
        if (this.idx < this.questions.length) {
            this.cameras.main.fadeOut(200, 26, 10, 58);
            this.time.delayedCall(200, () => { this.cameras.main.fadeIn(200); this.mostrar(); });
        } else {
            this.finalizarQuiz();
        }
    }

    finalizarQuiz() {
        const totalSec = Math.round((Date.now() - (window.QUIZ_STATE.startedAt ?? Date.now())) / 1000);
        this.cameras.main.fadeOut(400, 26, 10, 58);
        this.time.delayedCall(400, () => this.scene.start('ResultadoScene', { time_taken_seconds: totalSec }));
    }
}

// ================================================================
//  RESULTADO — pantalla de fin estilo Kahoot
// ================================================================
export class ResultadoScene extends Phaser.Scene {
    constructor() { super({ key: 'ResultadoScene' }); }
    init(d) { this.timeTaken = d.time_taken_seconds ?? 0; }

    async create() {
        const W = this.scale.width, H = this.scale.height;
        this.cameras.main.setBackgroundColor(PAL.BG);
        this.cameras.main.fadeIn(400);

        // Spinner
        const spinner = this.add.text(W / 2, H / 2, '⏳', { font: '52px Arial' }).setOrigin(0.5);
        this.tweens.add({ targets: spinner, angle: 360, duration: 1000, repeat: -1 });
        this.add.text(W / 2, H / 2 + 60, 'Calculando resultado...', {
            font: 'bold 18px Arial', color: PAL.LIGHT_S,
        }).setOrigin(0.5);

        let result = null;

        // Modo demo — calcular resultado localmente
        if (!window.QUIZ_STATE.token) {
            const questions = window.QUIZ_STATE.quizData?.questions ?? [];
            const qMap = new Map(questions.map(q => [q.id, q]));
            let score = 0, correct = 0;
            const maxScore = questions.length * 100;
            for (const ans of window.QUIZ_STATE.answers) {
                const q = qMap.get(ans.question_id);
                if (q && ans.selected_option_id === q.correct_option_id) {
                    const timeRatio = Math.max(0, 1 - ans.time_taken_ms / ((q.time_seconds ?? 20) * 1000));
                    score += Math.round(100 * (0.5 + 0.5 * timeRatio));
                    correct++;
                }
            }
            result = {
                score, max_score: maxScore, correct_answers: correct,
                total_questions: questions.length, xp_earned: correct * 10,
                is_first_play: true, time_taken_seconds: this.timeTaken,
            };
        } else {
            try {
                const res = await fetch(`${API_BASE}/minigame-instances/${window.QUIZ_STATE.instanceId}/submit`, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${window.QUIZ_STATE.token}` },
                    body: JSON.stringify({ answers: window.QUIZ_STATE.answers, time_taken_seconds: this.timeTaken }),
                });
                if (res.ok) { const b = await res.json(); result = b.data ?? b; }
            } catch (_) {}
        }

        window.QUIZ_STATE.submitResult = result;
        this.children.removeAll(true);
        this.mostrarResultado(result, W, H);
    }

    mostrarResultado(result, W, H) {
        const score   = result?.score            ?? 0;
        const maxScore = result?.max_score        ?? 1;
        const correct = result?.correct_answers   ?? 0;
        const total   = result?.total_questions   ?? 0;
        const xp      = result?.xp_earned         ?? 0;
        const isFirst = result?.is_first_play     ?? false;
        const pct     = maxScore > 0 ? score / maxScore : 0;
        const stars   = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;

        const [emoji, titulo, sub, accent] =
            pct >= 0.9 ? ['🏆', '¡PERFECTO!',         '¡Sin errores, excelente!',       0xf9c74f]
          : pct >= 0.6 ? ['🌟', '¡MUY BIEN!',          '¡Casi lo tenés dominado!',       0x9b4dca]
          : pct >= 0.3 ? ['💪', '¡BUEN INTENTO!',      '¡La práctica hace al maestro!',  0xff9f43]
          :              ['📚', '¡SEGUÍ PRACTICANDO!', '¡Cada intento te hace mejor!',   0xe21b3c];

        // Fondo
        const bg = this.add.graphics();
        bg.fillStyle(PAL.BG_HEX, 1);
        bg.fillRect(0, 0, W, H);

        // Confeti si sacó bien
        if (stars >= 2) {
            const cols = [0xf9c74f, 0x9b4dca, 0x2ecc71, 0xe21b3c, 0x4e9af1, 0xff9f43];
            for (let i = 0; i < 22; i++) {
                const cg = this.add.graphics();
                const sz = Phaser.Math.Between(5, 11);
                cg.fillStyle(cols[i % cols.length], 1);
                cg.fillRect(0, 0, sz, sz);
                cg.setPosition(Phaser.Math.Between(20, W - 20), -20);
                cg.setAngle(Phaser.Math.Between(0, 360));
                this.tweens.add({
                    targets: cg, y: H + 30,
                    x: `+=${Phaser.Math.Between(-80, 80)}`,
                    angle: `+=${Phaser.Math.Between(180, 540)}`,
                    duration: Phaser.Math.Between(1800, 3500),
                    delay: i * 120, ease: 'Linear',
                });
            }
        }

        // Card principal
        const cW = W - 32, cH = H * 0.76, cX = 16, cY = H * 0.04;
        const cg = this.add.graphics();
        cg.fillStyle(0x000000, 0.45);
        cg.fillRoundedRect(cX + 5, cY + 7, cW, cH, 24);
        cg.fillStyle(0x2d1b69, 1);
        cg.fillRoundedRect(cX, cY, cW, cH, 24);
        cg.lineStyle(3, accent, 0.9);
        cg.strokeRoundedRect(cX, cY, cW, cH, 24);
        // Banda top con color
        cg.fillStyle(accent, 1);
        cg.fillRoundedRect(cX, cY, cW, 84, { tl: 24, tr: 24, bl: 0, br: 0 });
        cg.fillStyle(0xffffff, 0.15);
        cg.fillRoundedRect(cX + 6, cY + 6, cW - 12, 36, { tl: 18, tr: 18, bl: 0, br: 0 });

        const items = [];

        // Emoji + título
        const emojiTxt = this.add.text(W / 2, cY + 42, emoji, { font: '52px Arial' }).setOrigin(0.5);
        items.push(emojiTxt);
        if (stars >= 2) {
            this.tweens.add({ targets: emojiTxt, angle: [-8, 8], duration: 400, yoyo: true, repeat: -1 });
        }

        items.push(this.add.text(W / 2, cY + 110, titulo, {
            font: "bold 36px 'Arial Rounded MT Bold', Arial", color: PAL.WHITE_S,
            stroke: '#00000044', strokeThickness: 2,
        }).setOrigin(0.5));

        items.push(this.add.text(W / 2, cY + 152, sub, {
            font: '16px Arial', color: '#c8b4f8',
        }).setOrigin(0.5));

        // Línea separadora
        const sepG = this.add.graphics();
        sepG.fillStyle(accent, 0.35);
        sepG.fillRect(cX + 32, cY + 178, cW - 64, 2);
        items.push(sepG);

        // Score número grande
        items.push(this.add.text(W / 2, cY + 222, `${score}`, {
            font: "bold 72px 'Arial Black', Arial", color: PAL.WHITE_S,
        }).setOrigin(0.5));
        items.push(this.add.text(W / 2, cY + 274, `de ${maxScore} puntos  ·  ${correct} / ${total} correctas`, {
            font: '15px Arial', color: '#c8b4f8',
        }).setOrigin(0.5));

        // Barra porcentaje
        const bx = cX + 36, bw = cW - 72, by = cY + 300, bh = 18;
        const barBg = this.add.graphics();
        barBg.fillStyle(0x1a0a3a, 1);
        barBg.fillRoundedRect(bx, by, bw, bh, 9);
        barBg.fillStyle(accent, 1);
        barBg.fillRoundedRect(bx, by, Math.max(bh, bw * pct), bh, 9);
        barBg.fillStyle(0xffffff, 0.2);
        barBg.fillRoundedRect(bx + 3, by + 3, Math.max(bh - 6, bw * pct - 6), bh / 2 - 3, { tl: 6, tr: 6, bl: 0, br: 0 });
        items.push(barBg);
        items.push(this.add.text(bx + bw + 10, by + bh / 2, `${Math.round(pct * 100)}%`, {
            font: 'bold 16px Arial', color: PAL.WHITE_S,
        }).setOrigin(0, 0.5));

        // Estrellas animadas
        const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
        const starTxt = this.add.text(W / 2, cY + 344, starStr, {
            font: '48px Arial', color: PAL.GOLD_S,
        }).setOrigin(0.5);
        items.push(starTxt);
        if (stars > 0) {
            this.tweens.add({ targets: starTxt, scaleX: 1.12, scaleY: 1.12, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
        }

        // XP badge
        if (isFirst && xp > 0) {
            const xpG = this.add.graphics();
            xpG.fillStyle(0x2ecc71, 0.2);
            xpG.fillRoundedRect(W / 2 - 120, cY + 380, 240, 44, 22);
            xpG.lineStyle(2, 0x2ecc71, 1);
            xpG.strokeRoundedRect(W / 2 - 120, cY + 380, 240, 44, 22);
            items.push(xpG);
            items.push(this.add.text(W / 2, cY + 402, `⚡ +${xp} XP ganados`, {
                font: 'bold 18px Arial', color: '#2ecc71',
            }).setOrigin(0.5));
        } else if (!isFirst) {
            items.push(this.add.text(W / 2, cY + 398, '🔄 Práctica · sin XP', {
                font: '15px Arial', color: '#8888aa',
            }).setOrigin(0.5));
        }

        // Animar entrada
        items.forEach((item, i) => {
            item.setAlpha(0);
            item.y += 20;
            this.tweens.add({ targets: item, alpha: 1, y: `-=20`, duration: 480, delay: 50 + i * 70, ease: 'Back.Out' });
        });

        // Botones
        this.time.delayedCall(1100, () => {
            this._btn(W / 2 - 118, H * 0.91, '🔄  Reintentar', 0x9b4dca, () => {
                window.QUIZ_STATE.answers   = [];
                window.QUIZ_STATE.startedAt = Date.now();
                this.cameras.main.fadeOut(280, 26, 10, 58);
                this.time.delayedCall(280, () => this.scene.start('QuizScene'));
            });
            this._btn(W / 2 + 118, H * 0.91, '🏠  Inicio', 0x1368ce, () => {
                this.cameras.main.fadeOut(280, 26, 10, 58);
                this.time.delayedCall(280, () => this.scene.start('MenuScene'));
            });
        });
    }

    _btn(x, y, label, fill, cb) {
        const BW = 210, BH = 54;
        const sg = this.add.graphics();
        sg.fillStyle(0x000000, 0.4);
        sg.fillRoundedRect(x - BW / 2 + 4, y - BH / 2 + 7, BW, BH, 27);
        const bg = this.add.graphics();
        bg.fillStyle(fill, 1);
        bg.fillRoundedRect(x - BW / 2, y - BH / 2, BW, BH, 27);
        bg.fillStyle(0xffffff, 0.18);
        bg.fillRoundedRect(x - BW / 2 + 4, y - BH / 2 + 4, BW - 8, BH / 2 - 4, { tl: 23, tr: 23, bl: 0, br: 0 });
        const t = this.add.text(x, y, label, {
            font: "bold 18px 'Arial Rounded MT Bold', Arial", color: PAL.WHITE_S,
        }).setOrigin(0.5);
        const z = this.add.zone(x, y, BW, BH).setInteractive({ useHandCursor: true });
        z.on('pointerdown', cb);
        z.on('pointerover',  () => this.tweens.add({ targets: [bg, t], scaleX: 1.06, scaleY: 1.06, duration: 80 }));
        z.on('pointerout',   () => this.tweens.add({ targets: [bg, t], scaleX: 1,    scaleY: 1,    duration: 80 }));
    }
}
