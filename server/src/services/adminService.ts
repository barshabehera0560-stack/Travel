import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.js';

export class AdminService {
  // 1. Dashboard Overview Stats
  static async getDashboardStats() {
    const [
      totalUsers,
      totalDestinations,
      totalTrips,
      totalReviews,
      totalAttractions,
      totalHotels,
      tripsSum,
      recentTrips,
      recentReviews,
      destinationsGrouped,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.destination.count(),
      prisma.trip.count(),
      prisma.review.count(),
      prisma.attraction.count(),
      prisma.hotelCache.count(),
      prisma.trip.aggregate({
        _sum: { budgetCeiling: true },
      }),
      prisma.trip.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          destination: { select: { id: true, name: true, country: true } },
        },
      }),
      prisma.review.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          destination: { select: { id: true, name: true, country: true } },
        },
      }),
      prisma.destination.groupBy({
        by: ['category'],
        _count: { id: true },
      }),
    ]);

    return {
      totals: {
        users: totalUsers,
        destinations: totalDestinations,
        trips: totalTrips,
        reviews: totalReviews,
        attractions: totalAttractions,
        hotels: totalHotels,
        platformBudgetVolume: tripsSum._sum.budgetCeiling || 0,
      },
      categoryDistribution: destinationsGrouped.map((g) => ({
        category: g.category,
        count: g._count.id,
      })),
      recentTrips,
      recentReviews,
    };
  }

  // 2. User Management
  static async listAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            trips: true,
            reviews: true,
            favorites: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => ({
      ...u,
      preferences: u.preferences ? JSON.parse(u.preferences) : null,
    }));
  }

  static async updateUserRole(userId: string, role: string) {
    if (!['traveler', 'moderator', 'admin'].includes(role)) {
      throw new AppError('Invalid role specified. Must be traveler, moderator, or admin.', 400);
    }

    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  static async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found.', 404);

    return prisma.user.delete({
      where: { id: userId },
    });
  }

  // 3. Trip Oversight
  static async listAllTrips() {
    return prisma.trip.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        destination: { select: { id: true, name: true, country: true, imageUrl: true } },
        _count: { select: { days: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async deleteTripAdmin(tripId: string) {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new AppError('Trip not found.', 404);

    return prisma.trip.delete({
      where: { id: tripId },
    });
  }

  // 4. Destination CRUD
  static async createDestination(data: {
    name: string;
    country: string;
    region: string;
    category: string;
    bestSeason: string;
    description: string;
    avgCostTier: number;
    imageUrl: string;
    heroImageUrl?: string;
    climateSummary?: string;
    lat?: number;
    lng?: number;
  }) {
    if (!data.name || !data.country || !data.category) {
      throw new AppError('Name, country, and category are required.', 400);
    }

    const id = `dest-${data.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

    return prisma.destination.create({
      data: {
        id,
        name: data.name.trim(),
        country: data.country.trim(),
        region: data.region?.trim() || 'Global',
        category: data.category.trim(),
        bestSeason: data.bestSeason?.trim() || 'Year-round',
        description: data.description?.trim() || '',
        avgCostTier: Number(data.avgCostTier) || 2,
        imageUrl:
          data.imageUrl?.trim() ||
          'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        heroImageUrl:
          data.heroImageUrl?.trim() ||
          data.imageUrl?.trim() ||
          'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=85',
        climateSummary: data.climateSummary?.trim() || 'Pleasant year-round conditions.',
        lat: Number(data.lat) || 0.0,
        lng: Number(data.lng) || 0.0,
      },
    });
  }

  static async updateDestination(
    id: string,
    data: Partial<{
      name: string;
      country: string;
      region: string;
      category: string;
      bestSeason: string;
      description: string;
      avgCostTier: number;
      imageUrl: string;
      heroImageUrl: string;
      climateSummary: string;
      lat: number;
      lng: number;
    }>
  ) {
    const dest = await prisma.destination.findUnique({ where: { id } });
    if (!dest) throw new AppError('Destination not found.', 404);

    return prisma.destination.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.country && { country: data.country.trim() }),
        ...(data.region && { region: data.region.trim() }),
        ...(data.category && { category: data.category.trim() }),
        ...(data.bestSeason && { bestSeason: data.bestSeason.trim() }),
        ...(data.description && { description: data.description.trim() }),
        ...(data.avgCostTier !== undefined && { avgCostTier: Number(data.avgCostTier) }),
        ...(data.imageUrl && { imageUrl: data.imageUrl.trim() }),
        ...(data.heroImageUrl && { heroImageUrl: data.heroImageUrl.trim() }),
        ...(data.climateSummary && { climateSummary: data.climateSummary.trim() }),
        ...(data.lat !== undefined && { lat: Number(data.lat) }),
        ...(data.lng !== undefined && { lng: Number(data.lng) }),
      },
    });
  }

  static async deleteDestination(id: string) {
    const dest = await prisma.destination.findUnique({ where: { id } });
    if (!dest) throw new AppError('Destination not found.', 404);

    return prisma.destination.delete({
      where: { id },
    });
  }

  // 5. Attraction CRUD
  static async createAttraction(data: {
    destinationId: string;
    name: string;
    category: string;
    description: string;
    lat?: number;
    lng?: number;
    avgVisitMinutes?: number;
    estimatedCost?: number;
    imageUrl?: string;
  }) {
    if (!data.destinationId || !data.name) {
      throw new AppError('Destination ID and attraction name are required.', 400);
    }

    return prisma.attraction.create({
      data: {
        destinationId: data.destinationId,
        name: data.name.trim(),
        category: data.category?.trim() || 'Sightseeing',
        description: data.description?.trim() || '',
        lat: Number(data.lat) || 0.0,
        lng: Number(data.lng) || 0.0,
        avgVisitMinutes: Number(data.avgVisitMinutes) || 120,
        estimatedCost: Number(data.estimatedCost) || 0,
        imageUrl:
          data.imageUrl?.trim() ||
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      },
    });
  }

  static async updateAttraction(
    id: string,
    data: Partial<{
      name: string;
      category: string;
      description: string;
      lat: number;
      lng: number;
      avgVisitMinutes: number;
      estimatedCost: number;
      imageUrl: string;
    }>
  ) {
    return prisma.attraction.update({
      where: { id },
      data,
    });
  }

  static async deleteAttraction(id: string) {
    return prisma.attraction.delete({
      where: { id },
    });
  }

  // 6. Hotel CRUD
  static async createHotel(data: {
    destinationId: string;
    name: string;
    pricePerNight: number;
    rating?: number;
    address: string;
    amenities?: string | string[];
    imageUrl?: string;
    bookingUrl?: string;
  }) {
    if (!data.destinationId || !data.name) {
      throw new AppError('Destination ID and hotel name are required.', 400);
    }

    const amenitiesStr = Array.isArray(data.amenities)
      ? data.amenities.join(', ')
      : typeof data.amenities === 'string'
      ? data.amenities.trim()
      : 'Free Wi-Fi, Breakfast, City View';

    return prisma.hotelCache.create({
      data: {
        destinationId: data.destinationId,
        name: data.name.trim(),
        pricePerNight: Number(data.pricePerNight) || 100,
        rating: Number(data.rating) || 4.5,
        address: data.address?.trim() || 'City Center',
        amenities: amenitiesStr,
        imageUrl:
          data.imageUrl?.trim() ||
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: data.bookingUrl?.trim() || 'https://booking.com',
      },
    });
  }

  static async updateHotel(
    id: string,
    data: Partial<{
      name: string;
      pricePerNight: number;
      rating: number;
      address: string;
      amenities: string | string[];
      imageUrl: string;
      bookingUrl: string;
    }>
  ) {
    const updateData: any = { ...data };
    if (data.amenities) {
      updateData.amenities = Array.isArray(data.amenities)
        ? data.amenities.join(', ')
        : data.amenities;
    }
    return prisma.hotelCache.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteHotel(id: string) {
    return prisma.hotelCache.delete({
      where: { id },
    });
  }

  // 7. Review Moderation
  static async listAllReviews() {
    return prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        destination: { select: { id: true, name: true, country: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async deleteReviewAdmin(reviewId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new AppError('Review not found.', 404);

    const destinationId = review.destinationId;

    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Recalculate average rating for destination
    const aggregate = await prisma.review.aggregate({
      where: { destinationId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.destination.update({
      where: { id: destinationId },
      data: {
        rating: aggregate._avg.rating !== null ? Math.round(aggregate._avg.rating * 10) / 10 : 4.8,
        reviewCount: aggregate._count.rating,
      },
    });

    return { success: true, message: 'Review removed and destination rating updated.' };
  }
}
