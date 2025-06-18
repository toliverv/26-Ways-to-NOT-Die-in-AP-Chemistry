import { Assets } from './Assets.js';
import { GameObject } from './GameObject.js';

const guy = new GameObject(Assets['guy'], 5, 0);

export const A = {
    prompt: 'A is for ACID',
    endMsg: 'Always add acid to water',
    objects: [guy],
};
