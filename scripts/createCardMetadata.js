/**
 * This script will remove any entries in `cards.json` that dont have images and write the results to `card-metadata.json` 
 * which is used in training our card recognition model
 */

const fs = require('fs');
const path = require('path');
const cardsFilePath = path.join(__dirname, '..', 'cards.json');
const outputFilePath = path.join(__dirname, '..', 'card-metadata.json');

const productIdsToRemove = [
  532106, 532107, 532104, 532105, 530951, 530908,
  530893, 530917, 530918, 530909, 530913, 530907,
  530896, 530959, 530890, 530911, 530931, 530953,
  530916, 530905, 530906, 530948, 530961, 530939,
  530898, 530889, 530899, 530932, 530936, 530902,
  530919, 530894, 530944, 530962, 530957, 530933,
  530958, 530949, 530887, 530924, 530930, 530914,
  530952, 530901, 530925, 530954, 530950, 530920,
  530934, 530910, 530922, 530921, 530935, 530943,
  530892, 530955, 530927, 530928, 530940, 530956,
  530897, 530937, 530900, 530946, 530942, 530945,
  530947, 530929, 497385, 530903, 530915, 536587,
  530941, 530912, 530891, 530904, 530963, 530926,
  497384, 497386, 530938, 530923, 530960
];

fs.readFile(cardsFilePath, (err, data) => {
    if (err) throw err;

    let cards = JSON.parse(data);

    let filteredCards = cards.filter(card => !productIdsToRemove.includes(card.productId));
    console.log('number of cards remaining after filtering: ', filteredCards.length);
    
    fs.writeFile(outputFilePath, JSON.stringify(filteredCards, null, 2), (err) => {
        if (err) throw err;
        console.log('Filtered card metadata has been written to card-metadata.json');
    });
});