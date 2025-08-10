# Deploy to Netlify

## Method 1: Drag & Drop (Simplest)
1. Go to https://app.netlify.com/drop
2. Drag your `dist` folder onto the page
3. Get instant URL to share!

## Method 2: Using CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

# Follow prompts to login and deploy
```

Your site will be available at: https://amazing-name-123.netlify.app
