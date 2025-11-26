# DALL-E API Integration Guide

## Overview
The AI Design Assistant uses OpenAI's DALL-E API to generate custom designs based on text prompts. The integration is already set up in your codebase - you just need to add your OpenAI API key to start generating images.

## Current Implementation Status

### ✅ Already Implemented
1. **Frontend AI Picker Component** ([client/src/components/AIPicker.jsx](client/src/components/AIPicker.jsx))
   - Text input for design prompts
   - Character counter (200 characters)
   - Loading state with spinner
   - "Full" button to apply AI-generated design

2. **Frontend Logic** ([client/src/pages/Customizer.jsx](client/src/pages/Customizer.jsx:64-81))
   - `handleSubmit()` function sends prompt to backend
   - Receives base64 image response
   - Applies image as decal to the 3D model
   - Error handling and loading states

3. **Backend API Route** ([server/routes/dalle.routes.js](server/routes/dalle.routes.js))
   - POST endpoint: `http://localhost:8080/api/v1/dalle`
   - Sends request to OpenAI DALL-E API
   - Returns base64-encoded image
   - Comprehensive error handling

### ⚠️ What You Need to Do

**Only 1 step required: Add your OpenAI API key**

## Step-by-Step Setup

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy your API key (starts with `sk-...`)

**Important:**
- Never share your API key publicly
- Never commit it to git
- DALL-E API requires credits/billing to be set up

### 2. Add API Key to Your Project

1. Open `server/.env` file
2. Add or update this line:
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

3. Save the file

### 3. Restart the Server

The server needs to be restarted to load the new environment variable:

```bash
cd server
npm start
```

### 4. Test the AI Design Assistant

1. Navigate to the Customizer page
2. Click on the "AI Design" tab (magic wand icon)
3. Enter a prompt like: "a roaring tiger with flames"
4. Click the "Full" button
5. Wait 10-20 seconds for the image to generate
6. The AI-generated design will appear on your 3D model!

## API Configuration Options

You can customize the DALL-E API settings in [server/routes/dalle.routes.js](server/routes/dalle.routes.js:39-44):

### Model Selection
```javascript
model: 'dall-e-3' // Options: 'dall-e-2' or 'dall-e-3'
```

**DALL-E 2:**
- Faster generation (5-10 seconds)
- Cheaper ($0.020 per image for 1024x1024)
- Good quality
- Sizes: `256x256`, `512x512`, `1024x1024`

**DALL-E 3:**
- Slower generation (10-20 seconds)
- More expensive ($0.040-$0.080 per image)
- Better quality and prompt understanding
- Sizes: `1024x1024`, `1792x1024`, `1024x1792`

### Image Size
```javascript
size: '1024x1024' // Change based on model
```

**Recommended:** `1024x1024` for best balance of quality and performance

### Quality (DALL-E 3 only)
```javascript
quality: 'standard' // Options: 'standard' or 'hd'
```

- `standard`: Faster, cheaper ($0.040 per image)
- `hd`: Better detail, slower, more expensive ($0.080 per image)

## How It Works

### Frontend Flow

1. User enters a prompt in the AI Design Assistant text area
2. User clicks "Full" button
3. Frontend calls `handleSubmit('full')` in Customizer.jsx
4. Function sends POST request to `http://localhost:8080/api/v1/dalle`
5. Request body: `{ prompt: "user's text prompt" }`
6. Frontend shows loading spinner during generation
7. Receives base64 image in response: `{ photo: "base64string..." }`
8. Converts to data URL: `data:image/png;base64,${data.photo}`
9. Applies image as decal using `handleDecals('full', imageURL)`
10. Image appears on the 3D model

### Backend Flow

1. Receives POST request with prompt
2. Validates prompt exists
3. Checks OPENAI_API_KEY environment variable
4. Sends request to OpenAI API:
   - Endpoint: `https://api.openai.com/v1/images/generations`
   - Headers: Authorization with API key
   - Body: model, prompt, size, format settings
5. Waits for OpenAI response (10-60 seconds)
6. Extracts base64 image from response
7. Returns `{ photo: base64Image }` to frontend

### Code References

**Frontend Request ([Customizer.jsx:70-76](client/src/pages/Customizer.jsx:70-76)):**
```javascript
const response = await fetch("http://localhost:8080/api/v1/dalle", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt }),
});
const data = await response.json();
handleDecals(type, `data:image/png;base64,${data.photo}`);
```

**Backend Handler ([dalle.routes.js:36-53](server/routes/dalle.routes.js:36-53)):**
```javascript
const response = await axios.post(
  'https://api.openai.com/v1/images/generations',
  {
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1024',
    response_format: 'b64_json',
    quality: 'standard',
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    timeout: 60000,
  }
);
```

## Error Handling

The implementation includes comprehensive error handling:

### Frontend Errors
- No prompt entered → Alert: "Please enter a prompt"
- API request fails → Alert with error message
- Loading state prevents multiple simultaneous requests

### Backend Errors
- Missing prompt → 400: "Prompt is required"
- No API key configured → 500: "OpenAI API key is not configured"
- Invalid API key → 401: "Invalid OpenAI API key"
- Rate limit exceeded → 429: "Rate limit exceeded"
- Request timeout → 408: "Request timeout"
- Other errors → 500 with detailed error message

## Cost Considerations

### DALL-E 2 Pricing
- 256×256: $0.016 per image
- 512×512: $0.018 per image
- 1024×1024: $0.020 per image

### DALL-E 3 Pricing
- 1024×1024 (standard): $0.040 per image
- 1024×1024 (HD): $0.080 per image
- 1024×1792 (standard): $0.080 per image

**Recommendation for Testing:** Use DALL-E 2 with 1024x1024 ($0.020 per image)

**For Production:** Use DALL-E 3 standard quality ($0.040 per image)

## Testing Checklist

Once you've added your API key:

- [ ] Server restarts without errors
- [ ] Navigate to Customizer page
- [ ] Click AI Design tab
- [ ] Enter test prompt: "a minimalist geometric pattern"
- [ ] Click "Full" button
- [ ] Loading spinner appears
- [ ] Image generates within 20 seconds
- [ ] Image applies to model
- [ ] Try different prompts
- [ ] Test error handling (empty prompt)

## Troubleshooting

### Issue: "OpenAI API key is not configured"
**Solution:**
1. Check `server/.env` file has `OPENAI_API_KEY=sk-...`
2. Restart the server
3. Verify no extra spaces or quotes around the key

### Issue: "Invalid OpenAI API key"
**Solution:**
1. Verify your API key is correct (starts with `sk-`)
2. Check key hasn't been revoked on OpenAI platform
3. Ensure billing is set up on OpenAI account

### Issue: Request timeout
**Solution:**
1. Check internet connection
2. OpenAI servers might be slow - try again
3. Consider using DALL-E 2 for faster generation

### Issue: Rate limit exceeded
**Solution:**
1. Wait a few minutes before trying again
2. Check your OpenAI usage limits
3. Upgrade your OpenAI plan if needed

### Issue: "Failed to generate image"
**Solution:**
1. Check server console logs for detailed error
2. Verify prompt is appropriate (no policy violations)
3. Try simpler prompt
4. Check OpenAI status page

## Security Best Practices

1. ✅ **Never commit API key to git**
   - Already configured: `.env` is in `.gitignore`

2. ✅ **Use environment variables**
   - Already implemented: API key stored in `.env`

3. ✅ **Server-side API calls only**
   - Already secure: API key never exposed to frontend

4. ⚠️ **Consider rate limiting** (Future enhancement)
   - Add rate limiting middleware to prevent abuse
   - Track usage per user/IP

5. ⚠️ **Add authentication** (Future enhancement)
   - Require user login before AI generation
   - Prevent anonymous users from consuming credits

## Example Prompts

Good prompts for clothing designs:

- "a fierce tiger head in orange and black"
- "geometric hexagon pattern in blue and gold"
- "watercolor floral design with roses and leaves"
- "minimalist mountain landscape silhouette"
- "abstract splatter paint effect in vibrant colors"
- "vintage retro sunset with palm trees"
- "graffiti style urban art with bold letters"
- "mandala pattern with intricate details"
- "galaxy and stars in purple and blue"
- "tribal aztec pattern in black and white"

## Need Help?

1. Check OpenAI API documentation: https://platform.openai.com/docs/guides/images
2. Review error messages in server console
3. Test API key with OpenAI Playground
4. Check OpenAI status: https://status.openai.com/

## Summary

**The AI integration is complete and ready to use!**

Just add your OpenAI API key to `server/.env` and restart the server. The AI Design Assistant will start generating custom designs immediately.

**Files involved:**
- Frontend: `client/src/components/AIPicker.jsx`
- Frontend Logic: `client/src/pages/Customizer.jsx`
- Backend API: `server/routes/dalle.routes.js`
- Server Config: `server/index.js`
- Environment: `server/.env`
