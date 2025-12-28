# Fix 404 Error: Failed to Create Payment Intent

## The Problem

You're getting a 404 error when trying to submit the registration form:
```
api/create-payment-intent:1 Failed to load resource: the server responded with a status of 404
```

This means the form can't find the server endpoint.

## The Solution

You need to:
1. **Make sure your Node.js server is running**
2. **Access the form through the Node.js server** (not Live Server)

## Step-by-Step Fix

### Step 1: Start Your Server

Open a terminal and run:
```bash
npm start
```

You should see:
```
✅ Connected to MongoDB successfully
Server running on http://localhost:3000
✅ Using MongoDB for data storage
```

### Step 2: Access the Form Through the Correct URL

**❌ DON'T use:** `http://127.0.0.1:5501/register.html` (Live Server - won't work)

**✅ DO use:** `http://localhost:3000/register.html` (Node.js server - this works!)

### Step 3: Test the Form

1. Go to: `http://localhost:3000/register.html`
2. Fill out the form
3. Use test card: `4242 4242 4242 4242`
4. Submit

## Why This Happens

- **Live Server** (port 5501) only serves static files (HTML, CSS, JS)
- **Node.js Server** (port 3000) serves static files AND has API endpoints
- The `/api/create-payment-intent` endpoint only exists on the Node.js server

## Quick Checklist

- [ ] Server is running (`npm start`)
- [ ] Server shows "Connected to MongoDB successfully"
- [ ] Accessing form at `http://localhost:3000/register.html`
- [ ] NOT using Live Server

## Still Getting 404?

1. **Check server is running:**
   ```bash
   npm start
   ```

2. **Check server logs** - you should see requests when you submit

3. **Verify the endpoint exists** in `server.js`:
   ```javascript
   app.post('/api/create-payment-intent', async (req, res) => {
   ```

4. **Make sure you're on port 3000**, not 5501

That's it! Once you access through `localhost:3000`, it should work! 🚀

