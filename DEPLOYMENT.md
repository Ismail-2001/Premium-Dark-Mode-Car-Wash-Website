# 🚀 Deployment Guide

## **Quick Start - Vercel Deployment**

### **Prerequisites**
- Vercel account (free tier available)
- GitHub account
- Domain name (optional)

### **Step 1: Deploy to Vercel**

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial deployment"
git branch -M main
git remote add origin https://github.com/yourusername/elite-detailing.git
git push -u origin main
```

2. **Deploy via Vercel Dashboard**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Vercel will auto-detect it as a static site
- Click "Deploy"

### **Step 2: Configure Environment Variables**

In Vercel Dashboard → Settings → Environment Variables:
```
GA_MEASUREMENT_ID=G-XXXXXXXXXX
SITE_URL=https://your-domain.vercel.app
CONTACT_EMAIL=concierge@elitestudio.com
```

### **Step 3: Set Up Custom Domain (Optional)**

1. **In Vercel Dashboard:**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS instructions

2. **Update URLs in code:**
   - Replace `elite-detailing.vercel.app` with your domain
   - Update `vercel.json` and `index.html` meta tags

## **EmailJS Setup (Contact Form)**

### **Option 1: EmailJS (Free - Recommended for Start)**

1. **Sign up** at [EmailJS](https://www.emailjs.com/)
2. **Create Email Service** (Gmail, Outlook, etc.)
3. **Create Email Template** with these variables:
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{phone}}`
   - `{{service}}`
   - `{{message}}`
   - `{{vehicle}}`

4. **Get Your Credentials:**
   - Public Key: Dashboard → API Keys → Public Key
   - Service ID: Dashboard → Email Services → Your Service ID
   - Template ID: Dashboard → Email Templates → Your Template ID

5. **Update Environment Variables:**
```
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
```

### **Option 2: Custom Backend**

1. **Create API endpoint** at `/api/contact`
2. **Use Node.js/Express** or serverless functions
3. **Send emails** via SendGrid, AWS SES, or similar

## **Google Analytics Setup**

1. **Create Property** at [Google Analytics](https://analytics.google.com/)
2. **Get Measurement ID** (starts with "G-")
3. **Add to Environment Variables:**
```
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## **Performance Optimization**

### **Image Optimization**
- Compress images to < 500KB each
- Use WebP format when possible
- Add `loading="lazy"` to below-fold images

### **Font Optimization**
- Preload critical fonts
- Subset fonts to reduce file size

### **Caching**
- Static assets cached for 1 year
- HTML cached for 1 hour

## **Security Headers**

The following security headers are automatically configured in `vercel.json`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## **Monitoring & Analytics**

### **Built-in Monitoring**
- Error tracking (JavaScript errors)
- Performance metrics (Core Web Vitals)
- User interactions (clicks, form submissions)
- Scroll depth tracking

### **View Analytics Data**
- **Development**: Press `Ctrl+Shift+D` to view console data
- **Production**: Check localStorage or connect to your analytics backend

### **Optional: Sentry Integration**
1. **Sign up** at [Sentry.io](https://sentry.io/)
2. **Create Project** (JavaScript)
3. **Get DSN** and add to environment variables:
```
SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

## **SSL Certificate**

✅ **Automatically handled by Vercel**
- Free SSL certificate included
- Automatic renewal
- HTTP to HTTPS redirect

## **Testing Before Production**

### **Local Testing**
```bash
npm run dev
# Visit http://localhost:3000
```

### **Preview Deployment**
- Push to a feature branch
- Vercel creates preview URL
- Test all functionality before production

### **Checklist Before Going Live**
- [ ] Contact form sends emails
- [ ] Google Analytics tracking events
- [ ] All links work correctly
- [ ] Mobile responsive design
- [ ] Loading speed < 3 seconds
- [ ] No console errors
- [ ] SEO meta tags correct

## **Domain Configuration**

### **DNS Records (if using custom domain)**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## **Ongoing Maintenance**

### **Weekly**
- Check Google Analytics for traffic
- Monitor error logs
- Test contact form functionality

### **Monthly**
- Update content if needed
- Check Core Web Vitals
- Review security headers

### **Quarterly**
- Update dependencies
- Review and optimize performance
- Check SSL certificate renewal

## **Troubleshooting**

### **Common Issues**

**Contact Form Not Working:**
- Check EmailJS configuration
- Verify environment variables
- Check browser console for errors

**Slow Loading:**
- Optimize images
- Check Core Web Vitals
- Reduce external dependencies

**SEO Issues:**
- Validate HTML with W3C validator
- Check meta tags
- Test with Google PageSpeed Insights

### **Support Resources**
- [Vercel Documentation](https://vercel.com/docs)
- [EmailJS Documentation](https://www.emailjs.com/docs)
- [Google Analytics Documentation](https://support.google.com/analytics)

---

**🎉 Your premium car detailing website is now production-ready!**

For any issues, check the console logs or contact your development team.
