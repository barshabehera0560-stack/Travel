import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Wanderly database with premier destinations, attractions, hotels, and demo users...');

  // 1. Clean existing records
  await prisma.itineraryItem.deleteMany();
  await prisma.itineraryDay.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.weatherCache.deleteMany();
  await prisma.hotelCache.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Demo Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const demoUser = await prisma.user.create({
    data: {
      id: 'usr-demo-001',
      name: 'Priya Sharma',
      email: 'priya@wanderly.com',
      passwordHash,
      role: 'traveler',
      preferences: JSON.stringify({
        travelStyle: 'Explorer',
        budgetTier: 2,
        interests: ['Heritage', 'Nature', 'Food'],
      }),
    },
  });

  const familyUser = await prisma.user.create({
    data: {
      id: 'usr-demo-002',
      name: 'Rohan Kapoor',
      email: 'rohan@wanderly.com',
      passwordHash,
      role: 'traveler',
      preferences: JSON.stringify({
        travelStyle: 'Family',
        budgetTier: 3,
        interests: ['Nature', 'Relaxation', 'Cultural'],
      }),
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      id: 'usr-admin-001',
      name: 'Wanderly Operations',
      email: 'admin@wanderly.com',
      passwordHash: await bcrypt.hash('admin123', 10),
      role: 'admin',
      preferences: JSON.stringify({
        travelStyle: 'Luxury',
        budgetTier: 3,
        interests: ['Heritage', 'Nature', 'Adventure'],
      }),
    },
  });

  // 3. Create Premier Destinations
  const destinationsData = [
    {
      id: 'dest-kyoto',
      name: 'Kyoto',
      country: 'Japan',
      region: 'East Asia',
      category: 'Heritage',
      bestSeason: 'Spring (Mar-May) & Autumn (Oct-Nov)',
      avgCostTier: 2,
      description:
        'The cultural heart of Japan, featuring thousands of classical Buddhist temples, serene Zen gardens, imperial palaces, and traditional wooden machiya houses surrounded by bamboo groves.',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      heroImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=85',
      climateSummary: 'Mild springs with iconic cherry blossoms and crisp golden autumns. Warm summers and cool winters.',
      rating: 4.9,
      reviewCount: 342,
      lat: 35.0116,
      lng: 135.7681,
      attractions: [
        {
          name: 'Fushimi Inari Shrine',
          category: 'Cultural',
          description: 'Famous mountain path bordered by over 10,000 vibrant vermilion Torii gates leading to sacred Mount Inari.',
          lat: 34.9671,
          lng: 135.7727,
          avgVisitMinutes: 150,
          estimatedCost: 0,
          imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e00d2c715?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Arashiyama Bamboo Grove',
          category: 'Nature',
          description: 'A magical soaring forest of towering emerald bamboo stalks with an ethereal whispering breeze.',
          lat: 35.0169,
          lng: 135.6713,
          avgVisitMinutes: 90,
          estimatedCost: 0,
          imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Kinkaku-ji (The Golden Pavilion)',
          category: 'Historical',
          description: 'A stunning Zen Buddhist temple covered in dazzling pure gold leaf, reflecting across the Mirror Pond.',
          lat: 35.0394,
          lng: 135.7292,
          avgVisitMinutes: 75,
          estimatedCost: 5,
          imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Gion Historic Geisha District',
          category: 'Cultural',
          description: 'Atmospheric cobblestone alleys lined with 17th-century wooden tea houses, lantern-lit dining, and geiko culture.',
          lat: 35.0037,
          lng: 135.7772,
          avgVisitMinutes: 120,
          estimatedCost: 20,
          imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
        },
      ],
      hotels: [
        {
          name: 'Hoshinoya Kyoto Luxury Ryokan',
          pricePerNight: 420,
          rating: 4.9,
          address: 'Arashiyama, Ukyo Ward, Kyoto',
          amenities: 'River View, Kaiseki Dining, Hot Spring Onsen, Tea Ceremony',
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          bookingUrl: 'https://booking.com',
        },
        {
          name: 'Kyoto Machiya Hotel Miru',
          pricePerNight: 135,
          rating: 4.6,
          address: 'Shimogyo Ward, Downtown Kyoto',
          amenities: 'Free High-Speed Wi-Fi, Traditional Tatami, Central Location, Bicycle Rental',
          imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
          bookingUrl: 'https://booking.com',
        },
      ],
      weather: [
        { date: new Date('2026-10-01'), min: 14, max: 22, condition: 'Sunny', icon: '01d', humidity: 55 },
        { date: new Date('2026-10-02'), min: 13, max: 21, condition: 'Partly Cloudy', icon: '02d', humidity: 60 },
        { date: new Date('2026-10-03'), min: 15, max: 23, condition: 'Clear', icon: '01d', humidity: 50 },
        { date: new Date('2026-10-04'), min: 12, max: 19, condition: 'Light Rain', icon: '10d', humidity: 75 },
      ],
    },
    {
      id: 'dest-bali',
      name: 'Bali',
      country: 'Indonesia',
      region: 'Southeast Asia',
      category: 'Beach',
      bestSeason: 'Dry Season (Apr-Oct)',
      avgCostTier: 1,
      description:
        'The Island of the Gods, renowned for volcanic mountains, iconic rice terraces, vibrant coral reefs, ancient cliffside temples, and world-class surfing beaches.',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      heroImageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1920&q=85',
      climateSummary: 'Tropical and warm year-round with daytime temperatures averaging 27°C-31°C. Balmy ocean breezes.',
      rating: 4.8,
      reviewCount: 512,
      lat: -8.4095,
      lng: 115.1889,
      attractions: [
        {
          name: 'Tegallalang Rice Terraces',
          category: 'Nature',
          description: 'Steep emerald-green stepped rice paddies sculpted into the hillside using an ancient Subak irrigation system.',
          lat: -8.4347,
          lng: 115.2801,
          avgVisitMinutes: 120,
          estimatedCost: 3,
          imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Uluwatu Cliffside Temple',
          category: 'Cultural',
          description: 'Perched dramatically on a 70-meter limestone sea cliff facing the crashing Indian Ocean and dramatic sunsets.',
          lat: -8.8291,
          lng: 115.0849,
          avgVisitMinutes: 100,
          estimatedCost: 5,
          imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Sacred Monkey Forest Sanctuary',
          category: 'Nature',
          description: 'A sanctuary and temple complex in Ubud inhabited by hundreds of playful Balinese long-tailed macaques.',
          lat: -8.5192,
          lng: 115.2606,
          avgVisitMinutes: 90,
          estimatedCost: 6,
          imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        },
      ],
      hotels: [
        {
          name: 'Maya Ubud Resort & Spa',
          pricePerNight: 190,
          rating: 4.8,
          address: 'Petulu, Ubud, Gianyar, Bali',
          amenities: 'Infinity Pools, Valley Views, Spa Sanctuary, Organic Breakfast',
          imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
          bookingUrl: 'https://booking.com',
        },
        {
          name: 'Canggu Beachside Eco Villa',
          pricePerNight: 85,
          rating: 4.6,
          address: 'Echo Beach, Canggu, Bali',
          amenities: 'Private Plunge Pool, Kitchenette, Surfboard Storage, Wi-Fi',
          imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
          bookingUrl: 'https://booking.com',
        },
      ],
      weather: [
        { date: new Date('2026-10-01'), min: 24, max: 31, condition: 'Sunny', icon: '01d', humidity: 70 },
        { date: new Date('2026-10-02'), min: 24, max: 30, condition: 'Partly Cloudy', icon: '02d', humidity: 72 },
        { date: new Date('2026-10-03'), min: 25, max: 32, condition: 'Sunny', icon: '01d', humidity: 68 },
      ],
    },
    {
      id: 'dest-paris',
      name: 'Paris',
      country: 'France',
      region: 'Western Europe',
      category: 'Heritage',
      bestSeason: 'Late Spring (May-Jun) & Autumn (Sep-Oct)',
      avgCostTier: 3,
      description:
        'The City of Light, synonymous with timeless art, haute cuisine, world-class haute couture, and celebrated landmarks along the meandering Seine river.',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      heroImageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1920&q=85',
      climateSummary: 'Temperate oceanic climate with crisp fresh mornings, comfortable sunny afternoons, and occasional drizzle.',
      rating: 4.7,
      reviewCount: 680,
      lat: 48.8566,
      lng: 2.3522,
      attractions: [
        {
          name: 'Eiffel Tower & Champ de Mars',
          category: 'Sightseeing',
          description: 'The monumental wrought-iron lattice masterpiece offering panoramic 360° vistas over all of Paris.',
          lat: 48.8584,
          lng: 2.2945,
          avgVisitMinutes: 120,
          estimatedCost: 28,
          imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Louvre Museum',
          category: 'Cultural',
          description: 'The world’s largest art museum, home to the enigmatic Mona Lisa, Venus de Milo, and iconic glass pyramid.',
          lat: 48.8606,
          lng: 2.3376,
          avgVisitMinutes: 240,
          estimatedCost: 22,
          imageUrl: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Montmartre & Sacré-Cœur Basilica',
          category: 'Historical',
          description: 'Bohemian hilltop neighborhood of painters, vintage bistros, and the sparkling white Roman-Byzantine basilica.',
          lat: 48.8867,
          lng: 2.3431,
          avgVisitMinutes: 150,
          estimatedCost: 0,
          imageUrl: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=800&q=80',
        },
      ],
      hotels: [
        {
          name: 'Hôtel Le Marais Chic',
          pricePerNight: 280,
          rating: 4.7,
          address: '4th Arrondissement, Paris',
          amenities: 'Boutique Design, Seine View, French Bakery Breakfast, Concierge',
          imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
          bookingUrl: 'https://booking.com',
        },
      ],
      weather: [
        { date: new Date('2026-10-01'), min: 11, max: 18, condition: 'Partly Cloudy', icon: '02d', humidity: 65 },
        { date: new Date('2026-10-02'), min: 10, max: 17, condition: 'Clear', icon: '01d', humidity: 60 },
      ],
    },
    {
      id: 'dest-banff',
      name: 'Banff & Canadian Rockies',
      country: 'Canada',
      region: 'North America',
      category: 'Mountain',
      bestSeason: 'Summer for Hiking (Jun-Aug) & Winter for Skiing (Dec-Mar)',
      avgCostTier: 2,
      description:
        'A wonderland of glacial turquoise lakes, rugged snow-capped peaks, alpine wildlife, and majestic pine forests nestled in Alberta’s oldest national park.',
      imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
      heroImageUrl: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1920&q=85',
      climateSummary: 'Crisp mountain air. Warm summer days with cool nights, turning into a dramatic powder snow haven in winter.',
      rating: 4.9,
      reviewCount: 290,
      lat: 51.1784,
      lng: -115.5708,
      attractions: [
        {
          name: 'Lake Louise & Victoria Glacier',
          category: 'Nature',
          description: 'A world-famous iridescent turquoise glacier lake framed by towering peaks, with canoe rentals and tea-house trails.',
          lat: 51.4254,
          lng: -116.1773,
          avgVisitMinutes: 180,
          estimatedCost: 15,
          imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Moraine Lake & Valley of the Ten Peaks',
          category: 'Nature',
          description: 'Glacially fed vivid azure lake surrounded by 10 dramatic rock towers, one of the most photographed vistas on earth.',
          lat: 51.3217,
          lng: -116.186,
          avgVisitMinutes: 150,
          estimatedCost: 10,
          imageUrl: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=800&q=80',
        },
      ],
      hotels: [
        {
          name: 'Fairmont Chateau Lake Louise',
          pricePerNight: 460,
          rating: 4.9,
          address: '111 Lake Louise Dr, Lake Louise, AB',
          amenities: 'Lakefront Vistas, Heated Mountain Pool, Luxury Spa, Ski Shuttle',
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
          bookingUrl: 'https://booking.com',
        },
      ],
      weather: [
        { date: new Date('2026-10-01'), min: 2, max: 12, condition: 'Sunny', icon: '01d', humidity: 50 },
      ],
    },
    {
      id: 'dest-santorini',
      name: 'Santorini',
      country: 'Greece',
      region: 'Southern Europe',
      category: 'Island',
      bestSeason: 'Spring to Autumn (May-Oct)',
      avgCostTier: 3,
      description:
        'A whitewashed Cycladic jewel perched high on volcanic crater cliffs above the deep blue Aegean Sea, renowned for sunset panoramas and blue domes.',
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      heroImageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=85',
      climateSummary: 'Sunny Mediterranean climate with warm dry summers, refreshing coastal winds, and mild springs.',
      rating: 4.8,
      reviewCount: 420,
      lat: 36.3932,
      lng: 25.4615,
      attractions: [
        {
          name: 'Oia Sunset Promenade & Blue Domes',
          category: 'Sightseeing',
          description: 'Wander pastel alleyways and capture world-famous cliffside sunsets overlooking the sunken volcanic caldera.',
          lat: 36.4618,
          lng: 25.3753,
          avgVisitMinutes: 180,
          estimatedCost: 0,
          imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Red Beach & Caldera Catamaran Cruise',
          category: 'Adventure',
          description: 'Dramatic rust-red volcanic cliffs leading into crystalline water, followed by hot springs sailing.',
          lat: 36.3475,
          lng: 25.3948,
          avgVisitMinutes: 240,
          estimatedCost: 80,
          imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        },
      ],
      hotels: [
        {
          name: 'Canaves Oia Suites & Spa',
          pricePerNight: 550,
          rating: 4.9,
          address: 'Oia, Santorini',
          amenities: 'Private Caldera Infinity Pool, Gourmet Aegean Dining, Sunset Terraces',
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          bookingUrl: 'https://booking.com',
        },
      ],
      weather: [
        { date: new Date('2026-10-01'), min: 19, max: 25, condition: 'Sunny', icon: '01d', humidity: 62 },
      ],
    },
    {
      id: 'dest-capetown',
      name: 'Cape Town',
      country: 'South Africa',
      region: 'Southern Africa',
      category: 'Adventure',
      bestSeason: 'Summer (Nov-Mar)',
      avgCostTier: 1,
      description:
        'Where dramatic ocean meets flat-topped Table Mountain, boasting coastal drives, penguin sanctuaries, wine valleys, and vibrant multicultural food scenes.',
      imageUrl: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=1200&q=80',
      heroImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85',
      climateSummary: 'Mediterranean coastal climate with warm, dry summers and mild winters.',
      rating: 4.8,
      reviewCount: 310,
      lat: -33.9249,
      lng: 18.4241,
      attractions: [
        {
          name: 'Table Mountain Cableway',
          category: 'Adventure',
          description: 'Ascend in a 360-degree rotating cable car to the summit plateau 1,085 meters above the Atlantic.',
          lat: -33.957,
          lng: 18.4031,
          avgVisitMinutes: 180,
          estimatedCost: 22,
          imageUrl: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Boulders Beach African Penguin Colony',
          category: 'Nature',
          description: 'Protected white sand cove home to a free-roaming wild breeding colony of adorable African penguins.',
          lat: -34.1971,
          lng: 18.4514,
          avgVisitMinutes: 90,
          estimatedCost: 10,
          imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        },
      ],
      hotels: [
        {
          name: 'The Radisson Red Waterfront',
          pricePerNight: 120,
          rating: 4.7,
          address: 'V&A Waterfront, Cape Town',
          amenities: 'Rooftop Bar & Pool, Mountain Views, High Speed Wi-Fi, Pet Friendly',
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          bookingUrl: 'https://booking.com',
        },
      ],
      weather: [
        { date: new Date('2026-10-01'), min: 14, max: 24, condition: 'Sunny', icon: '01d', humidity: 58 },
      ],
    },
    {
      id: 'dest-rome',
      name: 'Rome',
      country: 'Italy',
      region: 'Southern Europe',
      category: 'Heritage',
      bestSeason: 'Spring (Apr-Jun) & Autumn (Sep-Oct)',
      avgCostTier: 2,
      description:
        'The Eternal City, an open-air museum of nearly 3,000 years of globally influential art, ancient Roman ruins, piazzas, and mouthwatering pasta traditions.',
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
      heroImageUrl: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1920&q=85',
      climateSummary: 'Sunny Mediterranean climate with warm summers and mild, refreshing spring and autumn days.',
      rating: 4.8,
      reviewCount: 530,
      lat: 41.9028,
      lng: 12.4964,
      attractions: [
        {
          name: 'The Colosseum & Roman Forum',
          category: 'Historical',
          description: 'The iconic grand amphitheater where gladiators once fought, alongside the ancient heart of the Roman Empire.',
          lat: 41.8902,
          lng: 12.4922,
          avgVisitMinutes: 210,
          estimatedCost: 18,
          imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Trevi Fountain & Spanish Steps',
          category: 'Sightseeing',
          description: 'Baroque masterpiece fountain where visitors toss coins to assure their return to Rome.',
          lat: 41.9009,
          lng: 12.4833,
          avgVisitMinutes: 90,
          estimatedCost: 0,
          imageUrl: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=800&q=80',
        },
      ],
      hotels: [
        {
          name: 'Hotel Campo de’ Fiori Boutique',
          pricePerNight: 210,
          rating: 4.7,
          address: 'Via dei Cappellari, Rome',
          amenities: 'Panoramic Roof Garden, Antique Interiors, Central Piazza Location',
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          bookingUrl: 'https://booking.com',
        },
      ],
      weather: [
        { date: new Date('2026-10-01'), min: 15, max: 24, condition: 'Sunny', icon: '01d', humidity: 60 },
      ],
    },
    {
      id: 'dest-nyc',
      name: 'New York City',
      country: 'United States',
      region: 'North America',
      category: 'Urban',
      bestSeason: 'Autumn (Sep-Nov) & Spring (Apr-Jun)',
      avgCostTier: 3,
      description:
        'The energetic metropolis that never sleeps, boasting iconic skyscrapers, Broadway theaters, sprawling Central Park, and world-defining culinary scenes.',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
      heroImageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1920&q=85',
      climateSummary: 'Four distinct seasons with crisp vibrant autumn foliage and energetic spring blossoms.',
      rating: 4.7,
      reviewCount: 780,
      lat: 40.7128,
      lng: -74.006,
      attractions: [
        {
          name: 'Central Park',
          category: 'Nature',
          description: 'An 843-acre urban sanctuary featuring walking trails, boating lakes, Bow Bridge, and tranquil meadows.',
          lat: 40.785091,
          lng: -73.968285,
          avgVisitMinutes: 180,
          estimatedCost: 0,
          imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Top of the Rock Observation Deck',
          category: 'Sightseeing',
          description: 'Sweeping unobstructed skyline views of Manhattan and the Empire State Building from Rockefeller Center.',
          lat: 40.7587,
          lng: -73.9787,
          avgVisitMinutes: 100,
          estimatedCost: 40,
          imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
        },
      ],
      hotels: [
        {
          name: 'The High Line Hotel Chelsea',
          pricePerNight: 350,
          rating: 4.7,
          address: '10th Ave, Chelsea, New York',
          amenities: 'Courtyard Garden, Intelligentsia Coffee Bar, Walk to Hudson Yards',
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          bookingUrl: 'https://booking.com',
        },
      ],
      weather: [
        { date: new Date('2026-10-01'), min: 13, max: 20, condition: 'Sunny', icon: '01d', humidity: 55 },
      ],
    },
  ];

  for (const d of destinationsData) {
    const dest = await prisma.destination.create({
      data: {
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
      },
    });

    for (const a of d.attractions) {
      await prisma.attraction.create({
        data: {
          destinationId: dest.id,
          name: a.name,
          category: a.category,
          description: a.description,
          lat: a.lat,
          lng: a.lng,
          avgVisitMinutes: a.avgVisitMinutes,
          estimatedCost: a.estimatedCost,
          imageUrl: a.imageUrl,
        },
      });
    }

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

    // Add 2 reviews per destination
    await prisma.review.create({
      data: {
        userId: demoUser.id,
        destinationId: dest.id,
        rating: 5,
        comment: `Visiting ${dest.name} was an absolutely transformative journey! The food, scenic beauty, and local hospitality exceeded every expectation. Wanderly's itinerary made it seamless.`,
        travelerType: 'Explorer',
      },
    });

    await prisma.review.create({
      data: {
        userId: familyUser.id,
        destinationId: dest.id,
        rating: 4,
        comment: `Great experience exploring ${dest.name}. Highly recommend checking the weather guide beforehand and reserving attractions early!`,
        travelerType: 'Family',
      },
    });
  }

  // 4. Create an initial sample trip for the demo user
  const baliTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      destinationId: 'dest-bali',
      title: 'Serene Bali Getaway',
      startDate: new Date('2026-11-10'),
      endDate: new Date('2026-11-13'),
      travelerCount: 2,
      budgetCeiling: 1500,
      status: 'planning',
    },
  });

  const day1 = await prisma.itineraryDay.create({
    data: {
      tripId: baliTrip.id,
      dayNumber: 1,
      date: new Date('2026-11-10'),
      notes: 'Arrival in Denpasar, transfer to Ubud hotel, afternoon relaxation.',
    },
  });

  const day2 = await prisma.itineraryDay.create({
    data: {
      tripId: baliTrip.id,
      dayNumber: 2,
      date: new Date('2026-11-11'),
      notes: 'Morning rice terrace walk, sacred monkey forest, and traditional Balinese dinner.',
    },
  });

  await prisma.itineraryItem.create({
    data: {
      itineraryDayId: day1.id,
      itemType: 'hotel',
      title: 'Check-in: Maya Ubud Resort & Spa',
      description: 'Check in and settle into the private garden villa.',
      cost: 190,
      startTime: '02:00 PM',
      orderIndex: 0,
    },
  });

  await prisma.itineraryItem.create({
    data: {
      itineraryDayId: day1.id,
      itemType: 'dining',
      title: 'Welcome Dinner by the Valley',
      description: 'Fresh organic Indonesian tasting menu.',
      cost: 45,
      startTime: '07:30 PM',
      orderIndex: 1,
    },
  });

  await prisma.itineraryItem.create({
    data: {
      itineraryDayId: day2.id,
      itemType: 'attraction',
      title: 'Tegallalang Rice Terraces Sunrise Trek',
      description: 'Walk through the stepped emerald paddies before the heat picks up.',
      cost: 10,
      startTime: '08:30 AM',
      orderIndex: 0,
    },
  });

  await prisma.itineraryItem.create({
    data: {
      itineraryDayId: day2.id,
      itemType: 'attraction',
      title: 'Sacred Monkey Forest Exploration',
      description: 'Visit ancient mossy temples and observe playful macaques.',
      cost: 12,
      startTime: '02:00 PM',
      orderIndex: 1,
    },
  });

  // 5. Add initial demo favorites
  await prisma.favorite.create({
    data: {
      userId: demoUser.id,
      itemType: 'destination',
      itemId: 'dest-kyoto',
      title: 'Kyoto',
      subtitle: 'Japan • Heritage',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    },
  });

  await prisma.favorite.create({
    data: {
      userId: demoUser.id,
      itemType: 'destination',
      itemId: 'dest-santorini',
      title: 'Santorini',
      subtitle: 'Greece • Island',
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    },
  });

  await prisma.favorite.create({
    data: {
      userId: adminUser.id,
      itemType: 'destination',
      itemId: 'dest-kyoto',
      title: 'Kyoto',
      subtitle: 'Japan • Heritage',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    },
  });

  await prisma.favorite.create({
    data: {
      userId: adminUser.id,
      itemType: 'destination',
      itemId: 'dest-banff',
      title: 'Banff National Park',
      subtitle: 'Canada • Nature & Adventure',
      imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
    },
  });

  console.log('Database seeded successfully with 8 destinations, attractions, hotels, reviews, and a sample trip!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
