# FMEA Management System

A comprehensive Failure Mode and Effects Analysis (FMEA) management system built with Next.js, TypeScript, and MongoDB.

## Features

- User authentication and authorization
- Equipment and component management
- Failure mode analysis
- Risk assessment and matrix
- Task management
- Team collaboration
- Real-time notifications

## Environment Variables

For local development, create a `.env.local` file with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/fmea

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Email Configuration (for password reset and verification)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password

# Cloudinary Configuration (for file uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Vercel Deployment

For production deployment on Vercel, set these environment variables in your Vercel dashboard:

### Required Variables:
- `MONGODB_URI` - Your MongoDB connection string
- `NEXTAUTH_SECRET` - A secure random string for JWT signing
- `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)

### Optional Variables:
- `EMAIL_SERVER_HOST` - SMTP server for email functionality
- `EMAIL_SERVER_PORT` - SMTP port
- `EMAIL_SERVER_USER` - Email username
- `EMAIL_SERVER_PASSWORD` - Email password
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

- Admin: admin@example.com / password
- User: user@example.com / password

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
