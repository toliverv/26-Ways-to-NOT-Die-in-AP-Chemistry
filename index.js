import { Levels } from './modules/levels.js';
import { GameObject } from './modules/GameObject.js';
import { imagesLoaded } from './modules/Assets.js';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
canvas.width = 640;
canvas.height = 480;

const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

let page = 1,
    evilMode = false;

/**
 * @typedef {Object} LevelInfo Settings to draw level with
 * @property {String} prompt
 * @property {String} endMsg
 * @property {GameObject[]} objects
 */

/**
 * Return whether point (x, y) is over object
 * @param {GameObject} obj
 * @param {number} x mouse x
 * @param {number} y mouse y
 * @returns {boolean}
 */
function mouseOver(obj, x, y) {
    return (
        x >= obj.x &&
        x <= obj.x + obj.img.width &&
        y >= obj.y &&
        y <= obj.y + obj.img.height
    );
}

function tempBg(color) {
    const oldColor = document.body.style.backgroundColor;
    document.body.style.backgroundColor = color;
    ctx.fillStyle = color;

    return () => {
        document.body.style.backgroundColor = oldColor;
    };
}

/**
 * Draw level
 * @param {LevelInfo} level
 */
function drawLevel(level) {
    ctx.resetTransform();

    ctx.fillStyle = '#ebebeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '70px Pixelify Sans';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText(level.prompt, canvas.width / 2, 50);

    ctx.font = '30px Pixelify Sans';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText(level.subtitle, canvas.width / 2, 85);

    ctx.scale(8, 8);
    level.objects.forEach((obj) => {
        ctx.drawImage(
            obj.img,
            obj.x,
            canvas.height / 8 - obj.img.height - obj.y
        );
    });

    canvas.onmousemove = (ev) => {
        const hovering = level.objects.some(
            (obj) =>
                obj.clickable &&
                mouseOver(obj, ev.offsetX / 8, (canvas.height - ev.offsetY) / 8)
        );

        canvas.style.cursor = hovering ? 'pointer' : 'default';
    };

    canvas.onclick = (ev) => {
        const redraw = level.objects
            .filter(
                (obj) =>
                    obj.clickable &&
                    mouseOver(
                        obj,
                        ev.offsetX / 8,
                        (canvas.height - ev.offsetY) / 8
                    )
            )
            .some((obj) => obj.onclick());

        if (redraw) drawLevel(level);
    };
}

function showWin(msg) {
    ctx.resetTransform();
    ctx.fillStyle = '#44ff9960';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let revertColor = tempBg('#00cc55');
    ctx.font = '80px Pixelify Sans';
    ctx.fillText(msg, canvas.width / 2, canvas.height / 2, canvas.width - 10);

    canvas.onmousemove = null;

    canvas.style.cursor = 'pointer';
    canvas.onclick = () => {
        revertColor();
        page++;
        play();
    };
}

function showLoss(msg) {
    ctx.resetTransform();
    ctx.fillStyle = '#ff000060';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let revertColor = tempBg('#ff0000');
    ctx.font = '80px Pixelify Sans';
    ctx.fillText(msg, canvas.width / 2, canvas.height / 2, canvas.width - 10);

    canvas.onmousemove = null;
    canvas.style.cursor = 'default';

    setTimeout(() => {
        canvas.style.cursor = 'pointer';
        canvas.onclick = () => {
            revertColor();

            if (evilMode) page = 0;
            play();
        };
    }, 1500);
}

function ending() {
    ctx.resetTransform();
    ctx.fillStyle = '#ebebeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.onclick = null;
    canvas.onmousemove = null;
    canvas.style.cursor = 'default';

    ctx.font = '70px Pixelify Sans';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText(
        'You win!!',
        canvas.width / 2,
        canvas.height / 2,
        canvas.height - 10
    );
    ctx.font = '40px Pixelify Sans';
    ctx.fillText(
        'Sorry, there is no prize...',
        canvas.width / 2,
        canvas.height / 2 + 60,
        canvas.height - 10
    );
}

function play() {
    if (page >= Levels.length) {
        ending();
        return;
    }

    const state = new Levels[page]();

    state.result
        .then((winMsg) => {
            showWin(winMsg);
        })
        .catch((loseMsg) => {
            showLoss(loseMsg);
        });

    drawLevel(state);
}

document.fonts
    .load('70px Pixelify Sans')
    .catch((reason) => {
        console.log(reason);
    })
    .then(() => {
        Promise.all([...imagesLoaded]).then(play);
    });
