import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.js';
import { WeatherService } from '../integrations/weatherService.js';

export interface DestinationQueryFilter {
  search?: string;
  category?: string;
  region?: string;
  avgCostTier?: number;
  season?: string;
  sortBy?: 'rating' | 'cost_asc' | 'cost_desc' | 'name';
}

export class DestinationService {
  static async listDestinations(filter: DestinationQueryFilter) {
    const { search, category, region, avgCostTier, sortBy } = filter;

    const where: any = {};

    if (category && category !== 'All') {
      where.category = { equals: category };
    }

    if (region && region !== 'All') {
      where.region = { equals: region };
    }

    if (avgCostTier) {
      where.avgCostTier = { equals: Number(avgCostTier) };
    }

    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { country: { contains: q, mode: 'insensitive' } },
        { region: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { rating: 'desc' };
    if (sortBy === 'cost_asc') orderBy = { avgCostTier: 'asc' };
    if (sortBy === 'cost_desc') orderBy = { avgCostTier: 'desc' };
    if (sortBy === 'name') orderBy = { name: 'asc' };

    const destinations = await prisma.destination.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: {
            attractions: true,
            hotels: true,
            reviews: true,
          },
        },
      },
    });

    return destinations.map((d) => ({
      id: d.id,
      name: d.name,
      country: d.country,
      region: d.region,
      category: d.category,
      bestSeason: d.bestSeason,
      description: d.description,
      avgCostTier: d.avgCostTier,
      imageUrl: d.imageUrl,
      heroImageUrl: d.heroImageUrl,
      climateSummary: d.climateSummary,
      rating: d.rating,
      reviewCount: d.reviewCount,
      lat: d.lat,
      lng: d.lng,
      counts: {
        attractions: d._count.attractions,
        hotels: d._count.hotels,
        reviews: d._count.reviews,
      },
    }));
  }

  static async getDestinationById(id: string) {
    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        attractions: true,
        hotels: true,
        reviews: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!destination) {
      throw new AppError('Destination not found', 404);
    }

    // Fetch enriched weather intelligence
    const weather = await WeatherService.getWeatherForDestination(id);

    return {
      ...destination,
      weather,
    };
  }

  static async getCategories() {
    const categories = await prisma.destination.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    return categories.map((c) => c.category);
  }
}
