import { prisma } from '../config/prisma.js';

export interface TransportOption {
  type: 'flight' | 'train' | 'bus' | 'cab';
  operator: string;
  durationHours: number;
  durationLabel: string;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  currency: string;
  frequency: string;
  bookingPartner: string;
  bookingUrl: string;
}

export class TransportService {
  static async getTransportEstimates(destinationId: string, _originCity: string = 'Current Location'): Promise<TransportOption[]> {
    const destination = await prisma.destination.findUnique({
      where: { id: destinationId },
      select: { name: true, country: true },
    });

    if (!destination) return [];

    const isIsland = destination.name.toLowerCase().includes('santorini') || destination.name.toLowerCase().includes('bali');

    const options: TransportOption[] = [
      {
        type: 'flight',
        operator: 'International Star Alliance / SkyTeam',
        durationHours: 6.5,
        durationLabel: '6h 30m direct / 1-stop',
        estimatedPriceMin: 320,
        estimatedPriceMax: 650,
        currency: 'INR',
        frequency: 'Daily (Multiple departures)',
        bookingPartner: 'Google Flights & Skyscanner',
        bookingUrl: `https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(destination.name)}`,
      },
    ];

    if (!isIsland) {
      options.push({
        type: 'train',
        operator: 'High-Speed Rail Express',
        durationHours: 3.5,
        durationLabel: '3h 30m scenic express',
        estimatedPriceMin: 45,
        estimatedPriceMax: 90,
        currency: 'INR',
        frequency: 'Hourly',
        bookingPartner: 'RailEurope / National Rail',
        bookingUrl: `https://www.google.com/search?q=train+tickets+to+${encodeURIComponent(destination.name)}`,
      });

      options.push({
        type: 'bus',
        operator: 'Intercity Luxury Coach',
        durationHours: 5.0,
        durationLabel: '5h 00m highway cruiser',
        estimatedPriceMin: 25,
        estimatedPriceMax: 40,
        currency: 'INR',
        frequency: 'Every 2 hours',
        bookingPartner: 'Rome2Rio / FlixBus',
        bookingUrl: `https://www.rome2rio.com/s/All/${encodeURIComponent(destination.name)}`,
      });
    } else {
      options.push({
        type: 'cab',
        operator: 'Private Airport Transfer / Ferry',
        durationHours: 1.5,
        durationLabel: '1h 30m direct coastal transfer',
        estimatedPriceMin: 35,
        estimatedPriceMax: 60,
        currency: 'USD',
        frequency: 'On-demand & scheduled ferries',
        bookingPartner: 'Local Transit / Ferryhopper',
        bookingUrl: `https://www.google.com/search?q=ferry+to+${encodeURIComponent(destination.name)}`,
      });
    }

    return options;
  }
}
