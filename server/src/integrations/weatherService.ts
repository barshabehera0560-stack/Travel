import { prisma } from '../config/prisma.js';

export interface WeatherForecastDay {
  date: string;
  dayName: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  humidity: number;
}

export interface WeatherIntelligence {
  destinationId: string;
  currentTemp: number;
  currentCondition: string;
  currentIcon: string;
  forecast: WeatherForecastDay[];
  packingSuggestions: string[];
}

export class WeatherService {
  static async getWeatherForDestination(destinationId: string): Promise<WeatherIntelligence> {
    const cached = await prisma.weatherCache.findMany({
      where: { destinationId },
      orderBy: { forecastDate: 'asc' },
    });

    const destination = await prisma.destination.findUnique({
      where: { id: destinationId },
      select: { name: true, category: true },
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let forecast: WeatherForecastDay[] = [];

    if (cached.length > 0) {
      forecast = cached.map((w) => {
        const d = new Date(w.forecastDate);
        return {
          date: d.toISOString().split('T')[0],
          dayName: dayNames[d.getDay()],
          tempMin: Math.round(w.tempMin),
          tempMax: Math.round(w.tempMax),
          condition: w.condition,
          icon: w.icon,
          humidity: w.humidity,
        };
      });
    } else {
      // Fallback procedural forecast
      const today = new Date();
      const baseTemp = destination?.category === 'Beach' ? 29 : destination?.category === 'Mountain' ? 12 : 21;

      for (let i = 0; i < 5; i++) {
        const nextDate = new Date();
        nextDate.setDate(today.getDate() + i);
        forecast.push({
          date: nextDate.toISOString().split('T')[0],
          dayName: dayNames[nextDate.getDay()],
          tempMin: baseTemp - 5 + (i % 2),
          tempMax: baseTemp + 4 - (i % 2),
          condition: i === 3 ? 'Scattered Showers' : i % 2 === 0 ? 'Sunny' : 'Partly Cloudy',
          icon: i === 3 ? '10d' : i % 2 === 0 ? '01d' : '02d',
          humidity: 55 + i * 3,
        });
      }
    }

    const currentDay = forecast[0] || {
      tempMax: 24,
      condition: 'Sunny',
      icon: '01d',
    };

    // Packing suggestions generated from forecast conditions
    const packingSuggestions: string[] = [];
    const hasRain = forecast.some((f) => f.condition.toLowerCase().includes('rain') || f.condition.toLowerCase().includes('shower'));
    const isCold = forecast.some((f) => f.tempMin < 10);
    const isHot = forecast.some((f) => f.tempMax > 27);

    if (hasRain) packingSuggestions.push('Compact waterproof umbrella & light rain shell');
    if (isCold) packingSuggestions.push('Thermal base layers, fleece jacket & warm beanie');
    if (isHot) packingSuggestions.push('UV-protection sunglasses, SPF 50+ sunscreen & breathable linen');
    packingSuggestions.push('Comfortable walking/hiking sneakers');
    packingSuggestions.push('Universal travel power adapter');

    return {
      destinationId,
      currentTemp: currentDay.tempMax,
      currentCondition: currentDay.condition,
      currentIcon: currentDay.icon,
      forecast,
      packingSuggestions,
    };
  }
}
