export default async function handler(req, res) {
    const API_KEY = process.env.NASA_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: 'NASA_API_KEY not configured on server.' });
    }

    // Build NASA APOD URL from forwarded query params (date, count, etc.)
    const params = new URLSearchParams(req.query);
    params.set('api_key', API_KEY);

    const nasaUrl = `https://api.nasa.gov/planetary/apod?${params.toString()}`;

    try {
        const response = await fetch(nasaUrl);
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch from NASA API.', details: err.message });
    }
}
