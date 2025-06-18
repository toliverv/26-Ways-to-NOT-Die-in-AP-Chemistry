const filenames = ['guy'];
export const imagesLoaded = [];
export const Assets = filenames.reduce((obj, file) => {
    const img = new Image();
    obj[file] = img;

    const loaded = new Promise((resolve, reject) => {
        img.onerror = reject;
        img.onload = resolve;
    });
    imagesLoaded.push(loaded);

    img.src = `../assets/${file}.png`;
    return obj;
}, {});
