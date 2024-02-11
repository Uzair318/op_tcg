const data = require('./cards.json'); // Assuming your data is in cards.json

const search = (query, filters) => {
  let results = data;
  if (query) {
    const lowerCaseQuery = query.toLowerCase();
    results = results.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(lowerCaseQuery)
      )
    );
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      results = results.filter(item => Array.isArray(item[key]) ? item[key].includes(value) : item[key] === value);
    });
  }

  // Calculate aggregations
  const aggregations = {};
  // Define the fields for which you want to calculate aggregations
  const aggregationFields = ['setName', 'rarityName', 'color', 'cardType', 'attribute', 'subtypes'];

  results.forEach(item => {
    aggregationFields.forEach(field => {
      if (!item[field]) return;
      if (!aggregations[field]) {
        aggregations[field] = {};
      }
      const values = Array.isArray(item[field]) ? item[field] : [item[field]];
      values.forEach(value => {
        if (!aggregations[field][value]) {
          aggregations[field][value] = 0;
        }
        aggregations[field][value]++;
      });
    });
  });

  return { results, aggregations };
};

module.exports.handler = async (event) => {
  const { queryStringParameters } = event;
  let { q, from = 0, size = 10, ...filters } = queryStringParameters || {};
  const { results, aggregations } = search(q, filters);

  // Convert from and size to integers
  from = parseInt(from);
  size = parseInt(size);

  // Apply pagination
  const paginatedResults = results.slice(from, from + size);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // CORS enabled
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ results: paginatedResults, totalResults: results.length, aggregations }, null, 2),
  };
};