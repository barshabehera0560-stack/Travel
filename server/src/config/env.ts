import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'wanderly_jwt_secret_dev_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
};
