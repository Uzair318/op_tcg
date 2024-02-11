const Fuse = require('fuse.js');
const cards = require('./cards.json'); // Assuming cards.json is in the same directory

exports.handler = async (event) => {
    const query = event.queryStringParameters.q;

    const options = {
        keys: ['productName'],
        includeScore: true,
    };

    const fuse = new Fuse(cards, options);
    const results = fuse.search(query);

    const topResults = results.slice(0, 10);

    const response = topResults.map(result => {
        const { item } = result;
        return {
            productName: item.productName,
            setName: item.setName,
            rarityName: item.rarityName,
            color: item.color,
            number: item.number
        };
    });
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // CORS enabled
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(response, null, 2),
    };
};