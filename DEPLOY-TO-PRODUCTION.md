# Deploy to Production - Go Live Guide

## Quick Deploy Options

### Option 1: Railway (Easiest - Recommended) ⭐

**Best for Express.js apps - No code changes needed!**

1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. **Click:** "New Project" → "Deploy from GitHub repo"
4. **Select** your repository (`codesim21/testproject`)
5. **Railway will auto-detect** your Node.js app
6. **Add Environment Variables:**
   - Go to your project → Variables tab
   - Add these (replace with your actual keys):
     ```
     STRIPE_SECRET_KEY=sk_live_your_secret_key_here
     STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
     MONGODB_URI=your_mongodb_connection_string_here
     PORT=3000
     ```
7. **Deploy!** Railway will automatically deploy
8. **Get your URL:** Railway gives you a URL like `https://your-app.railway.app`
9. **Update register.js** with your Railway URL (if needed for CORS)

**Railway automatically provides HTTPS!** ✅

---

### Option 2: Render (Also Easy)

1. **Go to:** https://render.com
2. **Sign up** with GitHub
3. **Click:** "New" → "Web Service"
4. **Connect** your GitHub repository
5. **Settings:**
   - **Name:** `dingolay-registration` (or your choice)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
6. **Add Environment Variables:**
   - Click "Environment" tab
   - Add the same variables as Railway above
7. **Deploy!**
8. **Get your URL:** Render gives you `https://your-app.onrender.com`

**Render automatically provides HTTPS!** ✅

---

### Option 3: Vercel (Requires Serverless Setup)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add Environment Variables:**
   - Go to: https://vercel.com/dashboard
   - Select your project
   - Settings → Environment Variables
   - Add the same variables as above

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

**Vercel automatically provides HTTPS!** ✅

---

## After Deployment

### 1. Update Your Frontend (if needed)

If your API is on a different domain, update `register.js`:

```javascript
// Change from:
const response = await fetch('/api/create-payment-intent', {

// To (if needed):
const response = await fetch('https://your-app.railway.app/api/create-payment-intent', {
```

### 2. Test Your Live Site

1. Go to your deployed URL
2. Test the registration form
3. Use a **real card** (small amount like £1)
4. Verify payment appears in Stripe Dashboard
5. Check registration saves to MongoDB

### 3. Update Your Website Links

Update your main website (`index.html`, `dingolay.html`) to link to your deployed registration form.

---

## Environment Variables Checklist

Make sure these are set on your hosting platform:

- [ ] `STRIPE_SECRET_KEY` (live key)
- [ ] `STRIPE_PUBLISHABLE_KEY` (live key)
- [ ] `MONGODB_URI` (your MongoDB connection string)
- [ ] `PORT` (optional - hosting platform usually sets this)

---

## Security Checklist

- [ ] `.env` file is in `.gitignore` ✅ (already done)
- [ ] Live keys are NOT in your code ✅ (they're in environment variables)
- [ ] MongoDB allows connections from anywhere (or add hosting IPs)
- [ ] HTTPS is enabled (automatic with all platforms above)

---

## Recommended: Railway

**Why Railway?**
- ✅ Easiest for Express.js apps
- ✅ No code changes needed
- ✅ Automatic HTTPS
- ✅ Free tier available
- ✅ Auto-deploys from GitHub
- ✅ Simple environment variable setup

**Get started:** https://railway.app

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB Atlas Network Access allows all IPs (or add your hosting IP)
- Verify `MONGODB_URI` is correct in environment variables

### "Stripe authentication error"
- Verify live keys are correct
- Make sure keys start with `sk_live_` and `pk_live_`

### "404 on API endpoints"
- Make sure server is running
- Check your hosting platform logs
- Verify routes are correct

---

## You're Ready to Go Live! 🚀

Choose Railway (easiest) or Render, add your environment variables, and deploy!

