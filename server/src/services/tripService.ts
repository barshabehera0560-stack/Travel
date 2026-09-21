import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.js';

export interface CreateTripInput {
  title: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  budgetCeiling: number;
  autoGenerate?: boolean;
}

export class TripService {
  static async createTrip(userId: string, input: CreateTripInput) {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);

    if (end < start) {
      throw new AppError('End date must be after start date', 400);
    }

    // Calculate number of days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const dayCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const trip = await prisma.trip.create({
      data: {
        userId,
        destinationId: input.destinationId,
        title: input.title,
        startDate: start,
        endDate: end,
        travelerCount: input.travelerCount || 1,
        budgetCeiling: input.budgetCeiling || 2000,
        status: 'planning',
      },
    });

    // Create ItineraryDays
    for (let i = 1; i <= dayCount; i++) {
      const dayDate = new Date(start);
      dayDate.setDate(start.getDate() + (i - 1));

      await prisma.itineraryDay.create({
        data: {
          tripId: trip.id,
          dayNumber: i,
          date: dayDate,
          notes: `Day ${i} adventures`,
        },
      });
    }

    if (input.autoGenerate) {
      await this.autoGenerateItinerary(trip.id, userId);
    }

    return this.getTripById(trip.id, userId);
  }

  static async listUserTrips(userId: string) {
    return prisma.trip.findMany({
      where: { userId },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            country: true,
            imageUrl: true,
            heroImageUrl: true,
          },
        },
        days: {
          include: {
            items: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  static async getTripById(tripId: string, _userId?: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        destination: {
          include: {
            attractions: true,
            hotels: true,
          },
        },
        days: {
          orderBy: { dayNumber: 'asc' },
          include: {
            items: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });

    if (!trip) throw new AppError('Trip not found', 404);

    // Compute live budget summary
    let totalCost = 0;
    const costBreakdown = {
      attraction: 0,
      hotel: 0,
      dining: 0,
      transport: 0,
      custom: 0,
    };

    trip.days.forEach((day) => {
      day.items.forEach((item) => {
        const itemCost = (item.cost || 0) * (trip.travelerCount || 1);
        totalCost += itemCost;
        const type = (item.itemType in costBreakdown ? item.itemType : 'custom') as keyof typeof costBreakdown;
        costBreakdown[type] += itemCost;
      });
    });

    return {
      ...trip,
      calculatedBudget: {
        totalCost,
        budgetCeiling: trip.budgetCeiling,
        remainingBudget: Math.max(0, trip.budgetCeiling - totalCost),
        percentUsed: Math.min(100, Math.round((totalCost / (trip.budgetCeiling || 1)) * 100)),
        isOverBudget: totalCost > trip.budgetCeiling,
        breakdown: costBreakdown,
      },
    };
  }

  static async autoGenerateItinerary(tripId: string, _userId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        destination: {
          include: {
            attractions: true,
            hotels: true,
          },
        },
        days: {
          orderBy: { dayNumber: 'asc' },
        },
      },
    });

    if (!trip) throw new AppError('Trip not found', 404);

    const attractions = trip.destination.attractions;
    const hotel = trip.destination.hotels[0];

    // Clear existing items in trip days
    for (const day of trip.days) {
      await prisma.itineraryItem.deleteMany({
        where: { itineraryDayId: day.id },
      });
    }

    let attractionIndex = 0;

    for (let d = 0; d < trip.days.length; d++) {
      const day = trip.days[d];
      let order = 0;

      // Add Hotel check-in or stay on Day 1
      if (hotel) {
        await prisma.itineraryItem.create({
          data: {
            itineraryDayId: day.id,
            itemType: 'hotel',
            title: d === 0 ? `Check-in: ${hotel.name}` : `Stay: ${hotel.name}`,
            description: `Comfortable accommodation in ${trip.destination.name}`,
            cost: hotel.pricePerNight,
            startTime: d === 0 ? '02:00 PM' : '08:00 AM',
            orderIndex: order++,
            refId: hotel.id,
          },
        });
      }

      // Add 1-2 attractions per day
      if (attractions.length > 0) {
        const morningAttraction = attractions[attractionIndex % attractions.length];
        attractionIndex++;

        await prisma.itineraryItem.create({
          data: {
            itineraryDayId: day.id,
            itemType: 'attraction',
            title: morningAttraction.name,
            description: morningAttraction.description,
            cost: morningAttraction.estimatedCost,
            startTime: '10:00 AM',
            orderIndex: order++,
            refId: morningAttraction.id,
          },
        });

        // Add lunch/dining
        await prisma.itineraryItem.create({
          data: {
            itineraryDayId: day.id,
            itemType: 'dining',
            title: `Local Flavors & Dining`,
            description: `Authentic regional cuisine near ${morningAttraction.name}`,
            cost: 25,
            startTime: '01:00 PM',
            orderIndex: order++,
          },
        });

        if (attractions.length > 1) {
          const afternoonAttraction = attractions[attractionIndex % attractions.length];
          attractionIndex++;

          await prisma.itineraryItem.create({
            data: {
              itineraryDayId: day.id,
              itemType: 'attraction',
              title: afternoonAttraction.name,
              description: afternoonAttraction.description,
              cost: afternoonAttraction.estimatedCost,
              startTime: '03:30 PM',
              orderIndex: order++,
              refId: afternoonAttraction.id,
            },
          });
        }
      }
    }

    return this.getTripById(tripId, _userId);
  }

  static async addItineraryItem(
    dayId: string,
    item: {
      itemType: string;
      title: string;
      description?: string;
      cost?: number;
      startTime?: string;
      refId?: string;
    }
  ) {
    const highestOrder = await prisma.itineraryItem.findFirst({
      where: { itineraryDayId: dayId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });

    const orderIndex = highestOrder ? highestOrder.orderIndex + 1 : 0;

    return prisma.itineraryItem.create({
      data: {
        itineraryDayId: dayId,
        itemType: item.itemType,
        title: item.title,
        description: item.description,
        cost: item.cost || 0,
        startTime: item.startTime || '10:00 AM',
        orderIndex,
        refId: item.refId,
      },
    });
  }

  static async updateItineraryItem(
    itemId: string,
    updates: Partial<{
      title: string;
      description: string;
      cost: number;
      startTime: string;
      orderIndex: number;
      itineraryDayId: string;
    }>
  ) {
    return prisma.itineraryItem.update({
      where: { id: itemId },
      data: updates,
    });
  }

  static async deleteItineraryItem(itemId: string) {
    return prisma.itineraryItem.delete({
      where: { id: itemId },
    });
  }

  static async deleteTrip(tripId: string, userId: string) {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== userId) {
      throw new AppError('Trip not found or unauthorized', 404);
    }

    return prisma.trip.delete({
      where: { id: tripId },
    });
  }
}
