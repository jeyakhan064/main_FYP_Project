import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const router = express.Router();

// Test route
router.route('/').get((req, res) => {
  res.status(200).json({ message: "DALL-E API Route Ready" })
})

// @route   POST /api/v1/dalle
// @desc    Generate image using Pollinations.AI (FREE - No API Key!)
// @access  Public
router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    console.log('🎨 Generating image with Pollinations.AI for prompt:', prompt);

    // Pollinations.AI - FREE AI image generation (no API key required!)
    // Using simpler URL format that's more reliable
    const encodedPrompt = encodeURIComponent(prompt);

    // Try the simpler Pollinations endpoint
    const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&model=flux&nologo=true&enhance=true`;

    console.log('🔗 Image URL:', imageUrl);

    // Fetch the image with retry logic
    let response;
    let retries = 3;

    while (retries > 0) {
      try {
        response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          timeout: 60000, // 60 second timeout
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        break; // Success, exit retry loop
      } catch (err) {
        retries--;
        if (retries === 0) throw err;
        console.log(`⚠️ Retry attempt ${3 - retries}/3...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      }
    }

    // Convert to base64
    const image = Buffer.from(response.data).toString('base64');
    console.log('✅ Image generated successfully with Pollinations.AI');

    res.status(200).json({ photo: image });

  } catch (error) {
    console.error('❌ Image Generation Error:');
    console.error('Message:', error.message);

    if (error.code === 'ECONNABORTED') {
      res.status(408).json({ message: 'Request timeout. Please try again.' });
    } else if (error.response?.status === 429) {
      res.status(429).json({ message: 'Rate limit exceeded. Please try again in a moment.' });
    } else {
      res.status(500).json({
        message: 'Failed to generate image',
        error: error.message
      });
    }
  }
})

export default router;