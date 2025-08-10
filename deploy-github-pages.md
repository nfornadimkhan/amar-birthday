# Deploy to GitHub Pages

## Prerequisites:
- GitHub account
- Git installed

## Steps:

1. **Create GitHub repository**:
   ```bash
   # Initialize git if not already
   git init
   git add .
   git commit -m "Birthday card for Amar"
   ```

2. **Create new repo on GitHub**:
   - Go to https://github.com/new
   - Name it: `amar-birthday-card`
   - Create repository

3. **Push code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/amar-birthday-card.git
   git push -u origin main
   ```

4. **Deploy to GitHub Pages**:
   ```bash
   npm install --save-dev gh-pages
   
   # Add to package.json scripts:
   # "deploy": "vite build && gh-pages -d dist"
   
   npm run deploy
   ```

5. **Access your site**:
   - URL: https://YOUR_USERNAME.github.io/amar-birthday-card
