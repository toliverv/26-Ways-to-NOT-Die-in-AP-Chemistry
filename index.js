import { Levels } from './modules/levels.js';
import { GameObject } from './modules/GameObject.js';
import { imagesLoaded } from './modules/Assets.js';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
canvas.width = 640;
canvas.height = 480;

const ctx = canvas.getContext('2d');

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

/**
 * Draw level
 * @param {LevelInfo} level
 */
function drawLevel(level) {
    ctx.resetTransform();

    ctx.fillStyle = '#ebebeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '50px arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText(level.prompt, canvas.width / 2, 50);

    ctx.imageSmoothingEnabled = false;

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
        level.objects
            .filter((obj) => obj.clickable)
            .forEach((obj) => obj.onclick);
    };
}

function start() {
    drawLevel(Levels[0]);
}

Promise.all(imagesLoaded).then(start);
