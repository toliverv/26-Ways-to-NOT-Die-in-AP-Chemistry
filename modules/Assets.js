const filenames = [
    'beaker_acid',
    'beaker_base',
    'beaker_empty',
    'beaker_water',
    'fire_extinguisher',
    'flask_acid',
    'flask_empty',
    'flask_fire',
    'flask_water',
    'goggles',
    'guy_hold',
    'guy',
    'shelf',
    'table',
];
export const imagesLoaded = [];
export const Assets = filenames.reduce((obj, file) => {
    const img = new Image();
    obj[file] = img;

    const loaded = new Promise((resolve, reject) => {
        img.onerror = reject;
        img.onload = resolve;
    });
    imagesLoaded.push(loaded);

    img.src = `/assets/${file}.png`;
    return obj;
}, {});
