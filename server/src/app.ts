import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Security and utility middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoints
app.get(['/health', '/api/health'], (req, res) => {
  if (req.headers.accept?.includes('text/html')) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Wanderly Travel Platform</title>
        <meta http-equiv="refresh" content="2; url=/">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAF8F5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
          .card { background: white; border-radius: 28px; padding: 48px 36px; box-shadow: 0 20px 40px rgba(0,0,0,0.06); max-width: 480px; width: 100%; text-align: center; border: 1px solid #E2E8F0; }
          .badge { display: inline-flex; align-items: center; gap: 8px; background: #DCFCE7; color: #15803D; font-weight: 700; font-size: 13px; padding: 6px 16px; border-radius: 9999px; margin-bottom: 20px; }
          .dot { width: 8px; height: 8px; border-radius: 50%; background: #22C55E; display: inline-block; }
          h1 { font-size: 26px; font-weight: 900; color: #0F172A; margin: 0 0 12px 0; letter-spacing: -0.02em; }
          p { font-size: 14px; color: #64748B; margin: 0 0 28px 0; line-height: 1.6; }
          .btn { display: inline-flex; align-items: center; justify-content: center; background: #E05638; color: white; text-decoration: none; font-weight: 800; font-size: 15px; padding: 16px 32px; border-radius: 9999px; box-shadow: 0 8px 20px rgba(224, 86, 56, 0.35); transition: all 0.2s; }
          .btn:hover { background: #D04527; transform: translateY(-2px); box-shadow: 0 12px 24px rgba(224, 86, 56, 0.45); }
          .sub { font-size: 13px; color: #94A3B8; margin-top: 20px; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge"><span class="dot"></span> Backend API Online & Healthy</div>
          <h1>Wanderly Travel Platform</h1>
          <p>The backend API is running smoothly. The interactive website with live destinations, planner, and admin panel is available.</p>
          <a href="/" class="btn">Open Wanderly Website →</a>
          <div class="sub">Taking you to the website automatically in 2 seconds...</div>
        </div>
      </body>
      </html>
    `);
  }
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Wanderly Travel API',
  });
});

// API Routes
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);

// Centralized error handler
app.use(errorHandler);

export default app;
