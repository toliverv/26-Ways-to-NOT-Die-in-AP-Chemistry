export class GameObject {
    /**
     * Game object
     * @param {HTMLImageElement} img texture
     * @param {number} x x position
     * @param {number} y y position
     * @param {()=>void} click onclick method
     */
    constructor(img, x, y, click = null) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.clickable = click !== null;
        this.onclick = click;
    }
}
