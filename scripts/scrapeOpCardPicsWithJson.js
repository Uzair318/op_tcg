const axios = require('axios');
const fs = require('fs');
const path = require('path');

const imageType = 'jpg'; // jpg, png, tiff, webp, svg

const imagesDir = path.join(__dirname, '../images');
if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir);
}

const downloadImage = async (url, imagePath) => {
    try {
        const response = await axios({
            url,
            responseType: 'stream',
        });
        const writer = fs.createWriteStream(imagePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('error downloading image')
        throw error;
    }
};

const downloadCardImages = async () => {
    try {
        const data = await fs.promises.readFile(path.join(__dirname, '../cards.json'), 'utf8');
        const cards = JSON.parse(data);

        for (const card of cards) {
            const imageUrl = `https://product-images.tcgplayer.com/fit-in/411x411/${card.productId}.${imageType}`;
            const filename = `${card.productId}.${imageType}`;
            const imagePath = path.join(imagesDir, filename);

            console.log(`Downloading image for ${card.productName}...`);
            try {
                await downloadImage(imageUrl, imagePath);
                console.log(`Image for ${card.productName} downloaded successfully.`);
            } catch (error) {
                console.error(`Failed to download image for ${card.productName}: ${error}`);
            }
        }

        console.log('All images have been downloaded.');
    } catch (error) {
        console.error('Failed to download images:', error);
    }
};

downloadCardImages();
