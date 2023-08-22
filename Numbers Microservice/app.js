const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

async function fetchNumbers(url) {
    try {
        const response = await axios.get(url, { timeout: 5000 });
        if (response.status === 200 && Array.isArray(response.data.numbers)) {
            return response.data.numbers;
        }
    } catch (error) {
        // Ignore errors or timeouts
    }
    return [];
}

app.get('/numbers', async (req, res) => {
    const urls = req.query.url || [];
    if (!Array.isArray(urls)) {
        res.json({ numbers: "" }); // Empty string by default
        return;
    }

    const promises = urls.map(fetchNumbers);

    try {
        const results = await Promise.all(promises);
        const mergedNumbers = [...new Set(results.flat())].sort((a, b) => a - b);
        const numbersString = mergedNumbers.join(', '); // Join numbers with a comma and space
        res.json({ numbers: numbersString });
    } catch (error) {
        res.json({ numbers: "" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
