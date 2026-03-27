import { LoadingScene, MenuScene, QuizScene, ResultadoScene } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#f0f4ff',
    scene: [ LoadingScene, MenuScene, QuizScene, ResultadoScene ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

new Phaser.Game(config);
