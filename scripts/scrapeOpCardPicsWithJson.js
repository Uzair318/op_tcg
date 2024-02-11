const axios = require('axios');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../images');
if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir);
}

const downloadImage = async (url, path) => {
    return axios({
        url,
        responseType: 'stream',
    }).then(response =>
        new Promise((resolve, reject) => {
            response.data
                .pipe(fs.createWriteStream(path))
                .on('finish', () => resolve())
                .on('error', e => reject(e));
        }),
    );
};

const downloadCardImages = async () => {
    try {
        const data = await fs.promises.readFile(path.join(__dirname, '../cards.json'), 'utf8');
        const cards = JSON.parse(data);

        for (const card of cards) {
            const imageUrl = `https://product-images.tcgplayer.com/fit-in/411x411/${card.productId}.jpg`;
            if (!imageUrl) {
                console.log(`No image URL for ${card.productName}, skipping.`);
                continue;
            }

            const filename = `${card.productId}.jpg`;
            const imagePath = path.join(imagesDir, filename);

            console.log(`Downloading image for ${card.productName}...`);
            await downloadImage(imageUrl, imagePath).then(() => {
                console.log(`Image for ${card.productName} downloaded successfully.`);
            }).catch(error => {
                console.error(`Failed to download image for ${card.productName}: ${error}`);
            });
        }

        console.log('All images have been downloaded.');
    } catch (error) {
        console.error('Failed to download images:', error);
    }
};

downloadCardImages();
