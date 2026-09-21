import { prisma } from '../config/prisma.js';

export interface HotelFilterOptions {
  destinationId: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export class HotelService {
  static async getHotelsForDestination(options: HotelFilterOptions) {
    const { destinationId, minPrice, maxPrice, minRating } = options;

    const hotels = await prisma.hotelCache.findMany({
      where: {
        destinationId,
        ...(minPrice !== undefined && { pricePerNight: { gte: minPrice } }),
        ...(maxPrice !== undefined && { pricePerNight: { lte: maxPrice } }),
        ...(minRating !== undefined && { rating: { gte: minRating } }),
      },
      orderBy: { rating: 'desc' },
    });

    return hotels.map((h) => ({
      id: h.id,
      name: h.name,
      pricePerNight: h.pricePerNight,
      rating: h.rating,
      address: h.address,
      amenities: h.amenities.split(',').map((a) => a.trim()),
      imageUrl: h.imageUrl,
      bookingUrl: h.bookingUrl || `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(h.name)}`,
    }));
  }
}
