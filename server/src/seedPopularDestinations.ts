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

const popularDestinations: DestinationSeedItem[] = [
  {
    id: 'dest-london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Western Europe',
    category: 'Urban',
    bestSeason: 'Spring (May-Jun) & Autumn (Sep-Oct)',
    avgCostTier: 3,
    description:
      'A timeless global capital where centuries of royal history at Buckingham Palace and Westminster merge with cutting-edge culture, West End theater, and iconic red double-decker buses.',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Temperate maritime climate with mild summers and cool, crisp autumns.',
    rating: 4.8,
    reviewCount: 810,
    lat: 51.5074,
    lng: -0.1278,
    attractions: [
      {
        name: 'Big Ben & Palace of Westminster',
        category: 'Heritage',
        description: 'The iconic neo-gothic clock tower and British Parliament standing majestically on the River Thames.',
        lat: 51.5007,
        lng: -0.1246,
        avgVisitMinutes: 90,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Tower Bridge & Tower of London',
        category: 'Historical',
        description: 'World-famous Victorian bascule bridge and 1,000-year-old royal fortress housing the Crown Jewels.',
        lat: 51.5055,
        lng: -0.0754,
        avgVisitMinutes: 150,
        estimatedCost: 35,
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'The Savoy London',
        pricePerNight: 580,
        rating: 4.9,
        address: 'Strand, London, United Kingdom',
        amenities: 'Thames River Views, Gordon Ramsay Grill, Afternoon Tea, Butler Service',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 11, max: 17, condition: 'Partly Cloudy', icon: '02d', humidity: 68 },
      { date: new Date('2026-10-02'), min: 10, max: 16, condition: 'Sunny', icon: '01d', humidity: 65 },
    ],
  },
  {
    id: 'dest-singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Southeast Asia',
    category: 'Urban',
    bestSeason: 'Year-round (Nov-Jul)',
    avgCostTier: 2,
    description:
      'The Garden City of tomorrow featuring the illuminated Supertree Grove, futuristic Marina Bay Sands infinity pool, world-class street hawker cuisine, and Sentosa Island resorts.',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Tropical rainforest climate with warm sunshine and gentle ocean breezes year-round.',
    rating: 4.9,
    reviewCount: 670,
    lat: 1.3521,
    lng: 103.8198,
    attractions: [
      {
        name: 'Gardens by the Bay & Supertree Grove',
        category: 'Nature',
        description: 'Futuristic 101-hectare botanical wonderland featuring giant solar-powered vertical gardens and Cloud Forest waterfall dome.',
        lat: 1.2816,
        lng: 103.8636,
        avgVisitMinutes: 180,
        estimatedCost: 24,
        imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Marina Bay SkyPark & Waterfront',
        category: 'Urban',
        description: 'Cantilevered observation platform 57 levels in the sky offering 360-degree panoramas of the Singapore Strait.',
        lat: 1.2834,
        lng: 103.8607,
        avgVisitMinutes: 120,
        estimatedCost: 22,
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Marina Bay Sands',
        pricePerNight: 520,
        rating: 4.9,
        address: '10 Bayfront Avenue, Marina Bay, Singapore',
        amenities: 'Iconic Rooftop Infinity Pool, Celebrity Chef Restaurants, Banyan Tree Spa',
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 25, max: 32, condition: 'Partly Cloudy', icon: '02d', humidity: 75 },
      { date: new Date('2026-10-02'), min: 26, max: 32, condition: 'Sunny', icon: '01d', humidity: 73 },
    ],
  },
  {
    id: 'dest-sydney',
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    category: 'Urban',
    bestSeason: 'Spring (Sep-Nov) & Summer (Dec-Mar)',
    avgCostTier: 3,
    description:
      'Australia’s shimmering harbor jewel celebrated for the world-famous Sydney Opera House sails, sunrise surfing at Bondi Beach, and panoramic coastal cliff walks.',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Sunny subtropical climate with mild winters and warm golden summers.',
    rating: 4.9,
    reviewCount: 590,
    lat: -33.8688,
    lng: 151.2093,
    attractions: [
      {
        name: 'Sydney Opera House & Circular Quay',
        category: 'Cultural',
        description: 'Architectural masterpiece of interlocking white vaulted shells on Bennelong Point, UNESCO World Heritage site.',
        lat: -33.8568,
        lng: 151.2153,
        avgVisitMinutes: 120,
        estimatedCost: 30,
        imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Bondi to Coogee Coastal Walk',
        category: 'Scenic',
        description: '6-kilometer cliffside trail along ocean pools, dramatic sandstone cliffs, and pristine Pacific surf beaches.',
        lat: -33.8915,
        lng: 151.2767,
        avgVisitMinutes: 180,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Park Hyatt Sydney',
        pricePerNight: 650,
        rating: 4.9,
        address: '7 Hickson Road, The Rocks, Sydney, NSW',
        amenities: 'Harbour Front Balconies, Rooftop Heated Pool, Opera House Views, Luxury Spa',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 14, max: 23, condition: 'Sunny', icon: '01d', humidity: 58 },
      { date: new Date('2026-10-02'), min: 15, max: 24, condition: 'Clear', icon: '01d', humidity: 55 },
    ],
  },
  {
    id: 'dest-cairo',
    name: 'Cairo & Giza Pyramids',
    country: 'Egypt',
    region: 'North Africa',
    category: 'Heritage',
    bestSeason: 'Winter (Oct-Apr)',
    avgCostTier: 1,
    description:
      'The cradle of ancient civilization guarding the 4,500-year-old Great Pyramids of Giza and Sphinx, ancient pharaonic treasures, and legendary Nile River sunset feluccas.',
    imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Sunny desert climate with pleasant winter days and cool evening desert breezes.',
    rating: 4.8,
    reviewCount: 640,
    lat: 29.9792,
    lng: 31.1342,
    attractions: [
      {
        name: 'The Great Pyramid of Giza & Sphinx',
        category: 'Heritage',
        description: 'The sole surviving Wonder of the Ancient World, built for Pharaoh Khufu alongside the mythical limestone Great Sphinx.',
        lat: 29.9792,
        lng: 31.1342,
        avgVisitMinutes: 240,
        estimatedCost: 15,
        imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Khan el-Khalili Grand Bazaar',
        category: 'Cultural',
        description: 'Historic 14th-century medieval open-air market filled with spices, stained glass lanterns, copperware, and traditional coffeehouses.',
        lat: 30.0478,
        lng: 31.2622,
        avgVisitMinutes: 120,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Marriott Mena House Cairo',
        pricePerNight: 280,
        rating: 4.9,
        address: 'Pyramids Road, Giza, Cairo, Egypt',
        amenities: 'Direct Pyramid Garden Views, Historic Palace Architecture, Swimming Pool',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 18, max: 29, condition: 'Sunny', icon: '01d', humidity: 45 },
      { date: new Date('2026-10-02'), min: 19, max: 30, condition: 'Clear', icon: '01d', humidity: 42 },
    ],
  },
  {
    id: 'dest-venice',
    name: 'Venice',
    country: 'Italy',
    region: 'Southern Europe',
    category: 'Heritage',
    bestSeason: 'Spring (Apr-Jun) & Autumn (Sep-Nov)',
    avgCostTier: 3,
    description:
      'The floating city of lovers connected by 400 arched stone bridges, serenading gondoliers gliding along the Grand Canal, St. Mark’s golden basilica, and Doge’s Palace.',
    imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Mild coastal lagoon climate with golden afternoon light reflecting off canal waters.',
    rating: 4.8,
    reviewCount: 750,
    lat: 45.4408,
    lng: 12.3155,
    attractions: [
      {
        name: 'St. Mark’s Square & Basilica',
        category: 'Heritage',
        description: 'Vast piazza flanked by the ornate Byzantine cathedral covered in 85,000 square feet of luminous gold mosaics.',
        lat: 45.4342,
        lng: 12.3385,
        avgVisitMinutes: 120,
        estimatedCost: 15,
        imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Grand Canal & Rialto Bridge',
        category: 'Scenic',
        description: 'The ancient water artery of Venice traversed by vaporettos and elegant hand-carved black gondolas.',
        lat: 45.4381,
        lng: 12.3359,
        avgVisitMinutes: 90,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'The Gritti Palace Venice',
        pricePerNight: 720,
        rating: 4.9,
        address: 'Campo Santa Maria del Giglio, San Marco, Venice',
        amenities: 'Grand Canal Terraces, Murano Glass Chandeliers, Bar Longhi, Riva Yachting',
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 12, max: 20, condition: 'Sunny', icon: '01d', humidity: 65 },
      { date: new Date('2026-10-02'), min: 11, max: 19, condition: 'Partly Cloudy', icon: '02d', humidity: 62 },
    ],
  },
  {
    id: 'dest-istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    region: 'Eurasia',
    category: 'Heritage',
    bestSeason: 'Spring (Apr-May) & Autumn (Sep-Nov)',
    avgCostTier: 1,
    description:
      'Where Europe meets Asia across the Bosphorus Strait, adorned with the soaring domes of Hagia Sophia, the Blue Mosque, fragrant spice markets, and Ottoman palaces.',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Temperate transitional climate with sunny afternoons and crisp coastal breezes.',
    rating: 4.8,
    reviewCount: 690,
    lat: 41.0082,
    lng: 28.9784,
    attractions: [
      {
        name: 'Hagia Sophia Grand Mosque',
        category: 'Heritage',
        description: 'Sixth-century architectural marvel originally built as a Byzantine cathedral, famed for its colossal floating central dome.',
        lat: 41.0086,
        lng: 28.9802,
        avgVisitMinutes: 120,
        estimatedCost: 25,
        imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Bosphorus Sunset Ferry Cruise',
        category: 'Scenic',
        description: 'Sail between European and Asian continents past Ottoman water palaces, wooden yalı mansions, and suspension bridges.',
        lat: 41.0186,
        lng: 28.9723,
        avgVisitMinutes: 120,
        estimatedCost: 5,
        imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Four Seasons Hotel Istanbul at the Bosphorus',
        pricePerNight: 490,
        rating: 4.9,
        address: 'Ciragan Caddesi No. 28, Besiktas, Istanbul',
        amenities: 'Historic 19th-Century Palace, Bosphorus Waterfront Pool, Turkish Hammam',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 14, max: 22, condition: 'Sunny', icon: '01d', humidity: 64 },
      { date: new Date('2026-10-02'), min: 15, max: 21, condition: 'Clear', icon: '01d', humidity: 60 },
    ],
  },
  {
    id: 'dest-phuket',
    name: 'Phuket & Phi Phi Islands',
    country: 'Thailand',
    region: 'Southeast Asia',
    category: 'Beach',
    bestSeason: 'Dry Season (Nov-Apr)',
    avgCostTier: 1,
    description:
      'Thailand’s premier tropical island haven famous for sheer limestone karsts rising from emerald waters, Maya Bay snorkeling, sunset beach clubs, and vibrant night markets.',
    imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Tropical and balmy with average temperatures of 28°C-32°C and warm Andaman sea waters.',
    rating: 4.8,
    reviewCount: 710,
    lat: 7.8804,
    lng: 98.3923,
    attractions: [
      {
        name: 'Phi Phi Leh & Maya Bay',
        category: 'Beach',
        description: 'World-famous lagoon sheltered by 100-meter towering limestone cliffs and powdery white sands.',
        lat: 7.6775,
        lng: 98.7667,
        avgVisitMinutes: 240,
        estimatedCost: 15,
        imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Phang Nga Bay & James Bond Island',
        category: 'Scenic',
        description: 'Canoe through emerald sea caves and marvel at dramatic needle-shaped limestone islets.',
        lat: 8.2747,
        lng: 98.5012,
        avgVisitMinutes: 300,
        estimatedCost: 35,
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'The Shore at Katathani',
        pricePerNight: 320,
        rating: 4.9,
        address: 'Kata Noi Road, Muang, Phuket, Thailand',
        amenities: 'Private Pool Villas, Secluded Beachfront, Sunset Dining, Serenity Spa',
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 25, max: 31, condition: 'Sunny', icon: '01d', humidity: 76 },
      { date: new Date('2026-10-02'), min: 25, max: 32, condition: 'Partly Cloudy', icon: '02d', humidity: 74 },
    ],
  },
  {
    id: 'dest-machu-picchu',
    name: 'Machu Picchu & Cusco',
    country: 'Peru',
    region: 'South America',
    category: 'Adventure',
    bestSeason: 'Dry Season (May-Oct)',
    avgCostTier: 2,
    description:
      'The legendary Lost City of the Incas perched atop misty Andean peaks, connected by the ancient Inca Trail, vibrant Quechua textiles, and historic cobblestone Cusco plazas.',
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Crisp, sunny mountain days with cool starry nights in the Andes highlands.',
    rating: 4.9,
    reviewCount: 530,
    lat: -13.1631,
    lng: -72.545,
    attractions: [
      {
        name: 'Machu Picchu Incan Sanctuary',
        category: 'Heritage',
        description: '15th-century citadel constructed with dry-stone walls seamlessly integrated into sheer Andean granite ridges.',
        lat: -13.1631,
        lng: -72.545,
        avgVisitMinutes: 240,
        estimatedCost: 45,
        imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Sacred Valley of the Incas',
        category: 'Scenic',
        description: 'Breathtaking fertile valley of terraced Incan ruins, Pisac artisan markets, and Ollantaytambo stone fortress.',
        lat: -13.3275,
        lng: -72.0917,
        avgVisitMinutes: 300,
        estimatedCost: 20,
        imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Belmond Sanctuary Lodge Machu Picchu',
        pricePerNight: 850,
        rating: 4.9,
        address: 'Machu Picchu Citadel Gates, Aguas Calientes, Peru',
        amenities: 'Only Hotel Adjacent to Citadel Gates, Orchid Gardens, Andean Fine Dining',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 8, max: 21, condition: 'Sunny', icon: '01d', humidity: 48 },
      { date: new Date('2026-10-02'), min: 7, max: 20, condition: 'Clear', icon: '01d', humidity: 45 },
    ],
  },
  {
    id: 'dest-iceland',
    name: 'Reykjavik & Golden Circle',
    country: 'Iceland',
    region: 'Northern Europe',
    category: 'Adventure',
    bestSeason: 'Summer for Midnight Sun (Jun-Aug) & Winter for Northern Lights (Oct-Mar)',
    avgCostTier: 3,
    description:
      'The Land of Fire and Ice where dancing aurora borealis illuminate active geothermal geysers, thundering Gullfoss waterfalls, glacier caves, and the Blue Lagoon.',
    imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Subpolar oceanic climate kept temperate by the Gulf Stream, with magical twilight and northern lights.',
    rating: 4.9,
    reviewCount: 460,
    lat: 64.1466,
    lng: -21.9426,
    attractions: [
      {
        name: 'Gullfoss Waterfall & Geysir',
        category: 'Nature',
        description: 'Double-tiered golden cataract roaring into a rugged canyon beside erupting geothermal boiling hot springs.',
        lat: 64.3271,
        lng: -20.1199,
        avgVisitMinutes: 180,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'The Blue Lagoon Geothermal Spa',
        category: 'Relaxation',
        description: 'World-renowned mineral-rich milky blue geothermal seawater pool surrounded by mossy black lava fields.',
        lat: 63.8804,
        lng: -22.4495,
        avgVisitMinutes: 180,
        estimatedCost: 65,
        imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'The Retreat at Blue Lagoon Iceland',
        pricePerNight: 980,
        rating: 4.9,
        address: 'Nordurljosavegur 9, Grindavik, Iceland',
        amenities: 'Subterranean Spa, Private Geothermal Lagoon Access, Moss Restaurant',
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 2, max: 8, condition: 'Partly Cloudy', icon: '02d', humidity: 75 },
      { date: new Date('2026-10-02'), min: 1, max: 7, condition: 'Sunny', icon: '01d', humidity: 70 },
    ],
  },
  {
    id: 'dest-amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    region: 'Western Europe',
    category: 'Urban',
    bestSeason: 'Spring for Tulips (Apr-May) & Summer (Jun-Aug)',
    avgCostTier: 2,
    description:
      'The historic canal capital of Europe famous for narrow gabled merchant townhouses, tree-shaded waterways, world-class art at the Van Gogh Museum, and cycling culture.',
    imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Temperate oceanic climate with pleasant summer weather and romantic misty canals in autumn.',
    rating: 4.8,
    reviewCount: 620,
    lat: 52.3676,
    lng: 4.9041,
    attractions: [
      {
        name: 'Canal Ring (Grachtengordel)',
        category: 'Heritage',
        description: '17th-century UNESCO World Heritage concentric waterways lined with historic gabled houses and houseboats.',
        lat: 52.3667,
        lng: 4.8833,
        avgVisitMinutes: 120,
        estimatedCost: 18,
        imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Rijksmuseum & Museum Square',
        category: 'Cultural',
        description: 'Grand Dutch national museum housing Rembrandt’s The Night Watch, Vermeer masterpieces, and 8,000 historic treasures.',
        lat: 52.3599,
        lng: 4.8852,
        avgVisitMinutes: 180,
        estimatedCost: 22,
        imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Waldorf Astoria Amsterdam',
        pricePerNight: 620,
        rating: 4.9,
        address: 'Herengracht 542-556, Amsterdam, Netherlands',
        amenities: 'Six Historic 17th-Century Canal Palaces, Private Garden, Guerlain Spa',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 9, max: 16, condition: 'Sunny', icon: '01d', humidity: 70 },
      { date: new Date('2026-10-02'), min: 8, max: 15, condition: 'Partly Cloudy', icon: '02d', humidity: 68 },
    ],
  },
];

async function withRetry<T>(fn: () => Promise<T>, retries = 4): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      if (attempt >= retries) throw err;
      console.log(`Connection dropped (${err.message || 'P1017'}), retrying (${attempt}/${retries})...`);
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw new Error('Max retries reached');
}

async function main() {
  console.log('--- Upserting 10 Globally Popular Tourist Destinations ---');
  for (const d of popularDestinations) {
    await withRetry(async () => {
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

      console.log(`✔ Added/Updated: ${d.name} (${d.country} • ${d.category})`);
    });
  }

  const totalCount = await prisma.destination.count();
  console.log(`\n🎉 Success! Total destinations in database: ${totalCount}`);
}

main()
  .catch((e) => {
    console.error('Error adding popular destinations:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
