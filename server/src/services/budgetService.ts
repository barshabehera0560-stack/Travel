import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.js';

export interface BudgetCompareInput {
  destinationIds: string[];
  durationDays: number;
  travelerCount: number;
  budgetTier?: number; // 1 = Budget, 2 = Moderate, 3 = Luxury
}

export class BudgetService {
  static async compareDestinations(input: BudgetCompareInput) {
    const { destinationIds, durationDays = 5, travelerCount = 2, budgetTier = 2 } = input;

    if (!destinationIds || destinationIds.length < 2) {
      throw new AppError('Please select at least 2 destinations to compare.', 400);
    }

    const destinations = await prisma.destination.findMany({
      where: { id: { in: destinationIds } },
      include: {
        hotels: true,
        attractions: true,
      },
    });

    // Multipliers based on budget tier
    const foodMultiplier = budgetTier === 1 ? 30 : budgetTier === 2 ? 65 : 140; // per day per person
    const localTransitMultiplier = budgetTier === 1 ? 10 : budgetTier === 2 ? 25 : 60; // per day

    const comparisons = destinations.map((d) => {
      // Average hotel rate per night
      const avgHotelRate =
        d.hotels.length > 0
          ? d.hotels.reduce((acc, h) => acc + h.pricePerNight, 0) / d.hotels.length
          : d.avgCostTier === 1
          ? 80
          : d.avgCostTier === 2
          ? 180
          : 380;

      // Adjust hotel for budget tier selection
      const hotelNightly = Math.round(avgHotelRate * (budgetTier === 1 ? 0.75 : budgetTier === 2 ? 1.0 : 1.6));
      // Room count (assume 2 people per room)
      const roomCount = Math.ceil(travelerCount / 2);
      const totalAccommodation = hotelNightly * durationDays * roomCount;

      // Transport estimate (flights / long distance)
      const flightEstimatePerPerson = d.region === 'North America' ? 250 : d.region === 'Southeast Asia' ? 600 : 450;
      const totalLongDistanceTransport = flightEstimatePerPerson * travelerCount;

      // Local transit
      const totalLocalTransit = localTransitMultiplier * durationDays * travelerCount;

      // Food & Dining
      const totalFood = foodMultiplier * durationDays * travelerCount;

      // Activities & Sightseeing
      const avgAttractionCost =
        d.attractions.length > 0
          ? d.attractions.reduce((acc, a) => acc + a.estimatedCost, 0) / d.attractions.length
          : 20;
      const activitiesPerDay = 2;
      const totalActivities = Math.round(avgAttractionCost * activitiesPerDay * durationDays * travelerCount);

      const grandTotal = totalAccommodation + totalLongDistanceTransport + totalLocalTransit + totalFood + totalActivities;
      const perPersonTotal = Math.round(grandTotal / travelerCount);

      return {
        destinationId: d.id,
        destinationName: d.name,
        country: d.country,
        category: d.category,
        imageUrl: d.imageUrl,
        heroImageUrl: d.heroImageUrl,
        rating: d.rating,
        avgCostTier: d.avgCostTier,
        durationDays,
        travelerCount,
        grandTotal,
        perPersonTotal,
        breakdown: {
          accommodation: {
            amount: totalAccommodation,
            percent: Math.round((totalAccommodation / grandTotal) * 100),
            details: `${durationDays} nights × ₹${hotelNightly}/night (${roomCount} room${roomCount > 1 ? 's' : ''})`,
          },
          transport: {
            amount: totalLongDistanceTransport + totalLocalTransit,
            percent: Math.round(((totalLongDistanceTransport + totalLocalTransit) / grandTotal) * 100),
            details: `~₹${flightEstimatePerPerson}/person roundtrip + local transit`,
          },
          food: {
            amount: totalFood,
            percent: Math.round((totalFood / grandTotal) * 100),
            details: `₹${foodMultiplier}/day per person`,
          },
          activities: {
            amount: totalActivities,
            percent: Math.round((totalActivities / grandTotal) * 100),
            details: `${durationDays * activitiesPerDay} major attractions & experiences`,
          },
        },
      };
    });

    return {
      durationDays,
      travelerCount,
      budgetTier,
      comparisons,
    };
  }
}
