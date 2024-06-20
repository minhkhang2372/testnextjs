import axios from 'axios';
import rateLimit from 'express-rate-limit';

// Create rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// User-Agent list
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36',
];

// Random User-Agent function
const getRandomUserAgent = () => {
  const randomIndex = Math.floor(Math.random() * userAgents.length);
  return userAgents[randomIndex];
};

// Delay function
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const shopeexuHandler = async (req, res) => {
  const startTime = Date.now(); // Current timestamp

  try {
    // Random delay between 1 and 3 seconds
    await delay(Math.floor(Math.random() * 2000) + 1000);

    const response = await axios.get('https://api.chietkhau.pro/api/v1/shopeexu/all_spinner', {
      params: {
        limit: 20,
        'startTime[gte]': startTime,
      },
      headers: {
        'Referer': 'https://shopeexu-nextjs.vercel.app',
        'Origin': 'https://shopeexu-nextjs.vercel.app',
        'User-Agent': getRandomUserAgent(), // Use random User-Agent
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error calling API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    }
    res.status(500).send('Internal Server Error');
  }
};

// Middleware to apply rate limiting
export default async (req, res) => {
  await new Promise((resolve, reject) => {
    limiter(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve(result);
    });
  });

  await shopeexuHandler(req, res);
};
