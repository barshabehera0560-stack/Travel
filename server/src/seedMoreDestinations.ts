import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DestinationSeedItem {
  id: string;
  name: string;
  country: string;
  region: string;
  category: string;
  bestSeason: string;
  avgCostTier: number;
  description: string;
  imageUrl: string;
  heroImageUrl: string;
  climateSummary: string;
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
  attractions: Array<{
    name: string;
    category: string;
    description: string;
    lat: number;
    lng: number;
    avgVisitMinutes: number;
    estimatedCost: number;
    imageUrl: string;
  }>;
  hotels: Array<{
    name: string;
    pricePerNight: number;
    rating: number;
    address: string;
    amenities: string;
    imageUrl: string;
    bookingUrl: string;
  }>;
  weather: Array<{
    date: Date;
    min: number;
    max: number;
    condition: string;
    icon: string;
    humidity: number;
  }>;
}

const newDestinations: DestinationSeedItem[] = [
  {
    id: 'dest-jaipur',
    name: 'Jaipur',
    country: 'India',
    region: 'South Asia',
    category: 'Heritage',
    bestSeason: 'Winter (Oct-Mar)',
    avgCostTier: 1,
    description:
      'The storied Pink City of royalty, boasting monumental terracotta hill forts, intricate latticed palaces, bustling artisan bazaars, and opulent Rajasthani heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Pleasant and sunny winter days with cool evenings. Dry desert heat in summer.',
    rating: 4.9,
    reviewCount: 480,
    lat: 26.9124,
    lng: 75.7873,
    attractions: [
      {
        name: 'Amber Fort & Palace',
        category: 'Cultural',
        description: 'Majestic 16th-century fortress crafted from red sandstone and marble, overlooking the reflective Maota Lake.',
        lat: 26.9855,
        lng: 75.8513,
        avgVisitMinutes: 180,
        estimatedCost: 7,
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Hawa Mahal (Palace of Winds)',
        category: 'Historical',
        description: 'Iconic five-story facade crowned with 953 honeycomb windows designed for royal ladies to observe street festivals unnoticed.',
        lat: 26.9239,
        lng: 75.8267,
        avgVisitMinutes: 60,
        estimatedCost: 3,
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Rambagh Palace Heritage Luxury',
        pricePerNight: 380,
        rating: 4.9,
        address: 'Bhawani Singh Road, Jaipur, Rajasthan',
        amenities: 'Royal Palace Gardens, Heritage Spa, Fine Dining, Butler Service',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
      {
        name: 'Umaid Bhawan Heritage Haveli',
        pricePerNight: 75,
        rating: 4.6,
        address: 'Bani Park, Jaipur, Rajasthan',
        amenities: 'Rooftop Restaurant, Swimming Pool, Traditional Rajasthani Decor',
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 18, max: 31, condition: 'Sunny', icon: '01d', humidity: 45 },
      { date: new Date('2026-10-02'), min: 19, max: 32, condition: 'Clear', icon: '01d', humidity: 40 },
      { date: new Date('2026-10-03'), min: 18, max: 30, condition: 'Sunny', icon: '01d', humidity: 42 },
    ],
  },
  {
    id: 'dest-swiss-alps',
    name: 'Swiss Alps & Zermatt',
    country: 'Switzerland',
    region: 'Central Europe',
    category: 'Mountain',
    bestSeason: 'Summer (Jun-Sep) & Winter Ski (Dec-Apr)',
    avgCostTier: 3,
    description:
      'Alpine grandeur dominated by the pyramid-shaped Matterhorn, pristine glacier lakes, car-free alpine hamlets, and legendary panoramic cogwheel railways.',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Crisp alpine summers with wildflower valleys. Snowy winters with powder ski slopes.',
    rating: 4.9,
    reviewCount: 395,
    lat: 45.9765,
    lng: 7.7491,
    attractions: [
      {
        name: 'Matterhorn Glacier Paradise',
        category: 'Nature',
        description: 'Europe’s highest cable car station at 3,883 meters, offering 360-degree views of 38 alpine four-thousanders and glacial ice palaces.',
        lat: 45.9383,
        lng: 7.7303,
        avgVisitMinutes: 180,
        estimatedCost: 95,
        imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Gornergrat Cogwheel Railway',
        category: 'Scenic',
        description: 'Historic open-air electric cogwheel train ascending from Zermatt village to the 3,089-meter observation ridge.',
        lat: 45.9842,
        lng: 7.7844,
        avgVisitMinutes: 150,
        estimatedCost: 80,
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'The Omnia Mountain Lodge',
        pricePerNight: 450,
        rating: 4.9,
        address: 'Auf dem Fels, Zermatt, Switzerland',
        amenities: 'Matterhorn Views, Indoor/Outdoor Pool, Michelin Dining, Spa Cave',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 4, max: 14, condition: 'Sunny', icon: '01d', humidity: 60 },
      { date: new Date('2026-10-02'), min: 3, max: 12, condition: 'Partly Cloudy', icon: '02d', humidity: 65 },
    ],
  },
  {
    id: 'dest-amalfi',
    name: 'Amalfi Coast',
    country: 'Italy',
    region: 'Southern Europe',
    category: 'Beach',
    bestSeason: 'Late Spring (May-Jun) & Autumn (Sep-Oct)',
    avgCostTier: 3,
    description:
      'A breathtaking 50-kilometer stretch of pastel-colored cliffside villas, lemon orchards, dramatic sea cliffs, and azure Mediterranean waters along Italy’s southwestern coast.',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Classic Mediterranean climate with warm sunny days and gentle sea breezes.',
    rating: 4.8,
    reviewCount: 440,
    lat: 40.634,
    lng: 14.6027,
    attractions: [
      {
        name: 'Positano Cliffside Village & Marina',
        category: 'Scenic',
        description: 'Iconic vertical village tumbling down sheer cliffs with boutique shops, pebbled beaches, and seaside trattorias.',
        lat: 40.6281,
        lng: 14.485,
        avgVisitMinutes: 180,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Villa Rufolo Gardens in Ravello',
        category: 'Heritage',
        description: '13th-century cliffside estate with world-famous tiered gardens suspended high above the Gulf of Salerno.',
        lat: 40.6499,
        lng: 14.6121,
        avgVisitMinutes: 90,
        estimatedCost: 10,
        imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Le Sirenuse Luxury Resort Positano',
        pricePerNight: 620,
        rating: 4.9,
        address: 'Via Cristoforo Colombo, Positano, Italy',
        amenities: 'Sea View Balconies, Michelin Star Dining, Pool Terrace, Champagne Bar',
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 18, max: 24, condition: 'Sunny', icon: '01d', humidity: 62 },
      { date: new Date('2026-10-02'), min: 17, max: 23, condition: 'Clear', icon: '01d', humidity: 58 },
    ],
  },
  {
    id: 'dest-goa',
    name: 'Goa',
    country: 'India',
    region: 'South Asia',
    category: 'Beach',
    bestSeason: 'Winter (Nov-Feb)',
    avgCostTier: 1,
    description:
      'India’s tropical coastal paradise celebrated for golden Arabian Sea beaches, Portuguese colonial churches, spice plantations, and vibrant beach shacks.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Warm tropical weather year-round. Balmy winter days with refreshing ocean breezes.',
    rating: 4.8,
    reviewCount: 620,
    lat: 15.2993,
    lng: 74.124,
    attractions: [
      {
        name: 'Palolem Crescent Beach',
        category: 'Nature',
        description: 'Picture-postcard white sand bay sheltered by rocky headlands, coconut palms, and peaceful calm waters.',
        lat: 15.01,
        lng: 74.0232,
        avgVisitMinutes: 180,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Basilica of Bom Jesus',
        category: 'Heritage',
        description: 'UNESCO World Heritage 16th-century baroque basilica housing the sacred remains of St. Francis Xavier.',
        lat: 15.5009,
        lng: 73.9116,
        avgVisitMinutes: 75,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Taj Exotica Resort & Spa Benaulim',
        pricePerNight: 280,
        rating: 4.9,
        address: 'Benaulim Beach, South Goa',
        amenities: 'Private Beach, Golf Course, Jiva Spa, Mediterranean Dining',
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 24, max: 32, condition: 'Sunny', icon: '01d', humidity: 72 },
      { date: new Date('2026-10-02'), min: 25, max: 33, condition: 'Sunny', icon: '01d', humidity: 70 },
    ],
  },
  {
    id: 'dest-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'East Asia',
    category: 'Urban',
    bestSeason: 'Spring (Mar-May) & Autumn (Sep-Nov)',
    avgCostTier: 2,
    description:
      'A dynamic fusion of ultra-modern neon-lit skyscrapers, historic Edo-period temples, anime culture hubs, and world-class culinary mastery.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Comfortable spring cherry blossoms and vibrant autumn foliage. Mild winters.',
    rating: 4.9,
    reviewCount: 590,
    lat: 35.6762,
    lng: 139.6503,
    attractions: [
      {
        name: 'Shibuya Crossing & Hachiko',
        category: 'Urban',
        description: 'The world’s busiest pedestrian intersection illuminated by giant neon video screens and buzzing energy.',
        lat: 35.6595,
        lng: 139.7005,
        avgVisitMinutes: 60,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Senso-ji Ancient Buddhist Temple',
        category: 'Heritage',
        description: 'Tokyo’s oldest temple founded in 645 AD, entered through the monumental Kaminarimon Thunder Gate.',
        lat: 35.7148,
        lng: 139.7967,
        avgVisitMinutes: 90,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Park Hyatt Tokyo Shinjuku',
        pricePerNight: 380,
        rating: 4.8,
        address: 'Nishi-Shinjuku, Shinjuku, Tokyo',
        amenities: 'Skyline Pool, Peak Lounge Bar, Spa, Mount Fuji Views',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 16, max: 23, condition: 'Sunny', icon: '01d', humidity: 55 },
      { date: new Date('2026-10-02'), min: 15, max: 22, condition: 'Clear', icon: '01d', humidity: 52 },
    ],
  },
  {
    id: 'dest-maui',
    name: 'Maui, Hawaii',
    country: 'United States',
    region: 'Pacific Ocean',
    category: 'Island',
    bestSeason: 'Year-round (Apr-May & Sep-Nov)',
    avgCostTier: 3,
    description:
      'The Valley Isle featuring dormant volcanic peaks of Haleakalā, emerald rainforest highways along the Road to Hana, and pristine crescent beaches.',
    imageUrl: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Tropical maritime climate with warm sunny trade winds and balmy evenings.',
    rating: 4.9,
    reviewCount: 360,
    lat: 20.7984,
    lng: -156.3319,
    attractions: [
      {
        name: 'Haleakalā Summit Crater',
        category: 'Nature',
        description: 'Witness an unforgettable sunrise above a sea of clouds from a 3,055-meter dormant volcanic crater.',
        lat: 20.7097,
        lng: -156.2533,
        avgVisitMinutes: 200,
        estimatedCost: 30,
        imageUrl: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Road to Hana Coastal Drive',
        category: 'Scenic',
        description: 'Famous 100-kilometer highway crossing 59 bridges past plunging waterfalls, black sand beaches, and lush bamboo forests.',
        lat: 20.8068,
        lng: -156.1264,
        avgVisitMinutes: 360,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Four Seasons Resort Maui at Wailea',
        pricePerNight: 850,
        rating: 4.9,
        address: 'Wailea Alanui Dr, Kihei, Maui, HI',
        amenities: 'Infinity Edge Adult Pool, Oceanfront Cabanas, Wolfgang Puck Spago, Spa',
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 22, max: 29, condition: 'Sunny', icon: '01d', humidity: 65 },
      { date: new Date('2026-10-02'), min: 23, max: 30, condition: 'Sunny', icon: '01d', humidity: 63 },
    ],
  },
  {
    id: 'dest-ladakh',
    name: 'Ladakh & Himalayas',
    country: 'India',
    region: 'South Asia',
    category: 'Adventure',
    bestSeason: 'Summer (Jun-Sep)',
    avgCostTier: 1,
    description:
      'High-altitude desert wonderland framed by soaring snow-bound Himalayan passes, crystalline cobalt-blue Pangong Lake, and centuries-old Buddhist monasteries.',
    imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Clear blue skies with crisp mountain air in summer. Sub-zero winters.',
    rating: 4.9,
    reviewCount: 410,
    lat: 34.1526,
    lng: 77.5771,
    attractions: [
      {
        name: 'Pangong Tso High-Altitude Lake',
        category: 'Scenic',
        description: 'Endorheic lake at 4,225 meters altitude spanning from India into Tibet, famed for changing colors from cerulean to turquoise.',
        lat: 33.7595,
        lng: 78.6674,
        avgVisitMinutes: 240,
        estimatedCost: 8,
        imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Thiksey Monastery & Gompa',
        category: 'Heritage',
        description: 'Twelve-story Tibetan Buddhist complex resembling Lhasa’s Potala Palace, housing a 15-meter Maitreya Buddha statue.',
        lat: 34.0583,
        lng: 77.6667,
        avgVisitMinutes: 90,
        estimatedCost: 3,
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'The Grand Dragon Ladakh',
        pricePerNight: 160,
        rating: 4.8,
        address: 'Old Road, Sheynam, Leh, Ladakh',
        amenities: 'Oxygen Regulated Rooms, Mountain Views, Kashmiri Wazwan Dining',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 2, max: 15, condition: 'Sunny', icon: '01d', humidity: 30 },
      { date: new Date('2026-10-02'), min: 1, max: 14, condition: 'Clear', icon: '01d', humidity: 28 },
    ],
  },
  {
    id: 'dest-dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    category: 'Urban',
    bestSeason: 'Winter (Nov-Mar)',
    avgCostTier: 3,
    description:
      'A futuristic global metropolis rising from the Arabian sands, boasting record-shattering skyscrapers, luxury shopping malls, palm-shaped artificial islands, and golden dune safaris.',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Sunny and pleasant winter temperatures (22°C-28°C). Hot desert summers.',
    rating: 4.8,
    reviewCount: 530,
    lat: 25.2048,
    lng: 55.2708,
    attractions: [
      {
        name: 'Burj Khalifa Observation Deck',
        category: 'Urban',
        description: 'Stand atop the world’s tallest building at 828 meters with dizzying panoramas of the Persian Gulf and desert horizon.',
        lat: 25.1972,
        lng: 55.2744,
        avgVisitMinutes: 120,
        estimatedCost: 48,
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Arabian Desert 4x4 Dune Safari',
        category: 'Adventure',
        description: 'Exhilarating dune bashing, sunset camel treks, and stargazing bedouin barbecue dinner under desert skies.',
        lat: 24.95,
        lng: 55.45,
        avgVisitMinutes: 300,
        estimatedCost: 55,
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Atlantis The Royal Palm',
        pricePerNight: 690,
        rating: 4.9,
        address: 'Crescent Road, The Palm Jumeirah, Dubai',
        amenities: 'Cloud 22 Sky Pool, Celebrity Chef Dining, Private Beach, Aquaventure Access',
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 25, max: 34, condition: 'Sunny', icon: '01d', humidity: 55 },
      { date: new Date('2026-10-02'), min: 26, max: 35, condition: 'Clear', icon: '01d', humidity: 50 },
    ],
  },
  {
    id: 'dest-queenstown',
    name: 'Queenstown',
    country: 'New Zealand',
    region: 'Oceania',
    category: 'Adventure',
    bestSeason: 'Summer (Dec-Feb) & Winter Ski (Jun-Aug)',
    avgCostTier: 2,
    description:
      'The Southern Hemisphere’s adventure capital nestled on the shores of crystal-clear Lake Wakatipu against the jagged peaks of the Remarkables range.',
    imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Alpine climate with fresh sunny summer days and snow-filled winter ski seasons.',
    rating: 4.9,
    reviewCount: 340,
    lat: -45.0312,
    lng: 168.6626,
    attractions: [
      {
        name: 'Milford Sound Fjord Explorer',
        category: 'Nature',
        description: 'Glacial fjord carved with towering sheer granite cliffs, Mitre Peak, cascading waterfalls, and playful fur seals.',
        lat: -44.6715,
        lng: 167.9256,
        avgVisitMinutes: 360,
        estimatedCost: 85,
        imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Skyline Gondola & Luge',
        category: 'Adventure',
        description: 'Ride the steepest cable car in the Southern Hemisphere to Bob’s Peak for panoramic views and gravity-fueled luge carts.',
        lat: -45.029,
        lng: 168.653,
        avgVisitMinutes: 90,
        estimatedCost: 35,
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Eichardt’s Private Hotel',
        pricePerNight: 520,
        rating: 4.9,
        address: 'Marine Parade, Queenstown, New Zealand',
        amenities: 'Lakefront Penthouse, Fireplace Suites, Gourmet Breakfast, Valet',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 6, max: 16, condition: 'Partly Cloudy', icon: '02d', humidity: 60 },
      { date: new Date('2026-10-02'), min: 7, max: 17, condition: 'Sunny', icon: '01d', humidity: 55 },
    ],
  },
  {
    id: 'dest-barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Southern Europe',
    category: 'Heritage',
    bestSeason: 'Spring (May-Jun) & Autumn (Sep-Oct)',
    avgCostTier: 2,
    description:
      'Catalonia’s seaside masterpiece celebrated for Antoni Gaudí’s surreal architectural marvels, the Gothic Quarter’s labyrinthine alleys, and sun-soaked Mediterranean beaches.',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Mild Mediterranean coastal weather with plentiful sunshine.',
    rating: 4.8,
    reviewCount: 490,
    lat: 41.3851,
    lng: 2.1734,
    attractions: [
      {
        name: 'Basílica de la Sagrada Família',
        category: 'Heritage',
        description: 'Gaudí’s crowning masterpiece featuring organic tree-like stone columns, breathtaking stained glass, and soaring nativity spires.',
        lat: 41.4036,
        lng: 2.1744,
        avgVisitMinutes: 120,
        estimatedCost: 26,
        imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Park Güell Mosaic Wonderland',
        category: 'Cultural',
        description: 'A whimsical public park system composed of serpentine mosaic benches, gingerbread pavilions, and panoramic city vistas.',
        lat: 41.4145,
        lng: 2.1527,
        avgVisitMinutes: 90,
        estimatedCost: 12,
        imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Hotel Arts Barcelona Seafront',
        pricePerNight: 360,
        rating: 4.8,
        address: 'Marina 19-21, Port Olímpic, Barcelona',
        amenities: 'Seafront Infinity Pools, 43 The Spa, 2 Michelin Star Enoteca Dining',
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 17, max: 24, condition: 'Sunny', icon: '01d', humidity: 62 },
      { date: new Date('2026-10-02'), min: 18, max: 25, condition: 'Clear', icon: '01d', humidity: 60 },
    ],
  },
];

async function main() {
  console.log('--- 1. Fixing Cape Town Photo in Neon Database ---');
  await prisma.destination.updateMany({
    where: { id: 'dest-capetown' },
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=1200&q=80',
      heroImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85',
    },
  });

  await prisma.attraction.updateMany({
    where: { name: 'Table Mountain Cableway' },
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=800&q=80',
    },
  });
  console.log('✔ Cape Town photo updated to authentic Table Mountain scenery');

  console.log('--- 2. Upserting 10 Premier Tourist Destinations ---');
  for (const d of newDestinations) {
    // Upsert destination
    const dest = await prisma.destination.upsert({
      where: { id: d.id },
      update: {
        name: d.name,
        country: d.country,
        region: d.region,
        category: d.category,
        bestSeason: d.bestSeason,
        avgCostTier: d.avgCostTier,
        description: d.description,
        imageUrl: d.imageUrl,
        heroImageUrl: d.heroImageUrl,
        climateSummary: d.climateSummary,
        rating: d.rating,
        reviewCount: d.reviewCount,
        lat: d.lat,
        lng: d.lng,
      },
      create: {
        id: d.id,
        name: d.name,
        country: d.country,
        region: d.region,
        category: d.category,
        bestSeason: d.bestSeason,
        avgCostTier: d.avgCostTier,
        description: d.description,
        imageUrl: d.imageUrl,
        heroImageUrl: d.heroImageUrl,
        climateSummary: d.climateSummary,
        rating: d.rating,
        reviewCount: d.reviewCount,
        lat: d.lat,
        lng: d.lng,
      },
    });

    // Clean existing attractions, hotels, weather for this dest to avoid duplicate keys
    await prisma.attraction.deleteMany({ where: { destinationId: dest.id } });
    await prisma.hotelCache.deleteMany({ where: { destinationId: dest.id } });
    await prisma.weatherCache.deleteMany({ where: { destinationId: dest.id } });

    // Insert attractions
    for (const attr of d.attractions) {
      await prisma.attraction.create({
        data: {
          destinationId: dest.id,
          name: attr.name,
          category: attr.category,
          description: attr.description,
          lat: attr.lat,
          lng: attr.lng,
          avgVisitMinutes: attr.avgVisitMinutes,
          estimatedCost: attr.estimatedCost,
          imageUrl: attr.imageUrl,
        },
      });
    }

    // Insert hotels
    for (const h of d.hotels) {
      await prisma.hotelCache.create({
        data: {
          destinationId: dest.id,
          name: h.name,
          pricePerNight: h.pricePerNight,
          rating: h.rating,
          address: h.address,
          amenities: h.amenities,
          imageUrl: h.imageUrl,
          bookingUrl: h.bookingUrl,
        },
      });
    }

    // Insert weather
    for (const w of d.weather) {
      await prisma.weatherCache.create({
        data: {
          destinationId: dest.id,
          forecastDate: w.date,
          tempMin: w.min,
          tempMax: w.max,
          condition: w.condition,
          icon: w.icon,
          humidity: w.humidity,
        },
      });
    }

    console.log(`✔ Added/Updated tourist destination: ${d.name} (${d.country} • ${d.category})`);
  }

  const totalCount = await prisma.destination.count();
  console.log(`\n🎉 Completed! Total destinations now available in database: ${totalCount}`);
}

main()
  .catch((e) => {
    console.error('Error adding destinations:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
