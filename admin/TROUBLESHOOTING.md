# Product Creation Troubleshooting Guide

## Issue: "Failed to create product" Error

If you're experiencing issues with product creation in the deployed application, follow these troubleshooting steps:

## Step 1: Check Environment Variables

Visit this endpoint to check if all required environment variables are properly configured:
```
GET /api/check-env
```

This will show you:
- ✅ Set: Environment variable is properly configured
- ❌ Missing: Environment variable is missing

**Required Environment Variables:**
- `DATABASE_URL` - MongoDB connection string
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `NEXTAUTH_URL` - Your application URL (or `VERCEL_URL` for Vercel deployments)

## Step 2: Test System Health

Visit this endpoint to test all system components:
```
POST /api/test-product-creation
```

This will test:
- Database connection
- Cloudinary connection
- Environment variables
- Basic validation logic

## Step 3: Common Issues and Solutions

### Issue 1: Database Connection Failed
**Symptoms:** Error message mentions "Database connection failed"
**Solutions:**
- Check if `DATABASE_URL` is correct in your environment variables
- Ensure your MongoDB instance is running and accessible
- Check if your IP is whitelisted in MongoDB Atlas
- Verify database user permissions

### Issue 2: Cloudinary Upload Failed
**Symptoms:** Error message mentions "Failed to upload image"
**Solutions:**
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are correct
- Check if your Cloudinary account has sufficient credits
- Ensure the folder path "e-commerce/products" is accessible

### Issue 3: Validation Errors
**Symptoms:** Error message mentions missing fields or validation issues
**Solutions:**
- Ensure all required fields are filled:
  - Product Title
  - Short Description
  - SKU (must be unique)
  - Category (must exist)
  - At least one product image
  - At least one size with quantity and price

### Issue 4: Duplicate SKU or Title
**Symptoms:** Error message mentions "already exists"
**Solutions:**
- Use a unique SKU for each product
- Ensure product titles are unique
- Check existing products for duplicates

## Step 4: Browser Console Debugging

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Try to create a product
4. Look for error messages in the console
5. Check the Network tab for failed API requests

## Step 5: Server Logs

Check your deployment platform logs:
- **Vercel:** Go to your project dashboard → Functions → View Function Logs
- **Netlify:** Go to your site dashboard → Functions → View Logs
- **Other platforms:** Check their respective logging sections

## Step 6: Manual Testing

1. Try creating a product with minimal data:
   - Title: "Test Product"
   - Description: "Test Description"
   - SKU: "TEST-001"
   - Category: Select any existing category
   - Upload one small image (< 1MB)
   - Add one size: "M", Quantity: 1, Price: 10

2. If this works, gradually add more data to identify the problematic field

## Step 7: Contact Support

If none of the above steps resolve the issue, provide:
1. The exact error message
2. Steps to reproduce the issue
3. Browser console logs
4. Server logs
5. Results from `/api/check-env` and `/api/test-product-creation`

## Prevention Tips

1. **Always validate data** before submission
2. **Use unique SKUs** for each product
3. **Optimize images** before upload (compress to < 1MB)
4. **Test with small datasets** first
5. **Monitor environment variables** regularly

## Quick Fix Commands

If you have access to the server:

```bash
# Check environment variables
curl https://your-domain.com/api/check-env

# Test system health
curl -X POST https://your-domain.com/api/test-product-creation

# Check database connection
# (This requires database access)
```

## Emergency Fallback

If product creation is completely broken:
1. Use the existing product editing functionality
2. Create products directly in the database (if you have access)
3. Temporarily disable image uploads and use placeholder images
4. Contact your development team immediately

---

**Last Updated:** $(date)
**Version:** 1.0
