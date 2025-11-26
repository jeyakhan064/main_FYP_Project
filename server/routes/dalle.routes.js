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
// @desc    Generate image using DALL-E API
// @access  Public
router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        message: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file'
      });
    }

    console.log('🎨 Generating image for prompt:', prompt);

    // Call OpenAI DALL-E API using axios (works with latest OpenAI API)
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3', // Use 'dall-e-2' for faster/cheaper results
        prompt: prompt,
        n: 1,
        size: '1024x1024', // DALL-E 3: '1024x1024', '1792x1024', '1024x1792' | DALL-E 2: '256x256', '512x512', '1024x1024'
        response_format: 'b64_json', // Return base64 encoded image
        quality: 'standard', // 'standard' or 'hd' (DALL-E 3 only)
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        timeout: 60000, // 60 second timeout
      }
    );

    const image = response.data.data[0].b64_json;
    console.log('✅ Image generated successfully');

    res.status(200).json({ photo: image });

  } catch (error) {
    console.error('❌ DALL-E API Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      res.status(401).json({ message: 'Invalid OpenAI API key' });
    } else if (error.response?.status === 429) {
      res.status(429).json({ message: 'Rate limit exceeded. Please try again later.' });
    } else if (error.code === 'ECONNABORTED') {
      res.status(408).json({ message: 'Request timeout. Please try again.' });
    } else {
      res.status(500).json({
        message: 'Failed to generate image',
        error: error.response?.data?.error?.message || error.message
      });
    }
  }
})

export default router;