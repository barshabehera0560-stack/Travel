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

const indiaDestinations: DestinationSeedItem[] = [
  {
    id: 'dest-agra',
    name: 'Agra & Taj Mahal',
    country: 'India',
    region: 'South Asia',
    category: 'Heritage',
    bestSeason: 'Winter (Oct-Mar)',
    avgCostTier: 1,
    description:
      'Home to the peerless white marble Taj Mahal beside the sacred Yamuna River, alongside majestic red sandstone fortresses and historic Mughal gardens.',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Crisp, sunny winters with clear skies. Warm summers and lush monsoons.',
    rating: 4.9,
    reviewCount: 720,
    lat: 27.1751,
    lng: 78.0421,
    attractions: [
      {
        name: 'The Taj Mahal Mausoleum',
        category: 'Heritage',
        description: 'Iconic 17th-century white ivory-marble mausoleum commissioned by Mughal Emperor Shah Jahan, recognized as a Wonder of the World.',
        lat: 27.1751,
        lng: 78.0421,
        avgVisitMinutes: 180,
        estimatedCost: 14,
        imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Agra Red Fort',
        category: 'Historical',
        description: 'Imposing red sandstone fortress that served as the imperial residence for successive Mughal emperors.',
        lat: 27.1795,
        lng: 78.0211,
        avgVisitMinutes: 120,
        estimatedCost: 8,
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'The Oberoi Amarvilas Agra',
        pricePerNight: 420,
        rating: 4.9,
        address: 'Taj East Gate Road, Agra, Uttar Pradesh',
        amenities: 'Direct Taj Mahal Balcony Views, Royal Mughal Pool, Luxury Spa, Fine Dining',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
      {
        name: 'ITC Mughal Resort & Spa',
        pricePerNight: 110,
        rating: 4.7,
        address: 'Fatehabad Road, Tajganj, Agra',
        amenities: 'Kaya Kalp Spa, Mughal Gardens, Swimming Pools, Multi-Cuisine Restaurants',
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 19, max: 32, condition: 'Sunny', icon: '01d', humidity: 48 },
      { date: new Date('2026-10-02'), min: 20, max: 33, condition: 'Clear', icon: '01d', humidity: 44 },
    ],
  },
  {
    id: 'dest-varanasi',
    name: 'Varanasi',
    country: 'India',
    region: 'South Asia',
    category: 'Heritage',
    bestSeason: 'Winter (Oct-Mar)',
    avgCostTier: 1,
    description:
      'The spiritual soul of India on the sacred banks of the Ganges, renowned for spellbinding evening Ganga Aarti, ancient cobblestone alleys, and sunrise wooden boat rides.',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Mild and pleasant winter months ideal for ghat explorations and sunrise boat tours.',
    rating: 4.9,
    reviewCount: 540,
    lat: 25.3176,
    lng: 82.9739,
    attractions: [
      {
        name: 'Dashashwamedh Ghat & Ganga Aarti',
        category: 'Cultural',
        description: 'Varanasi’s most vibrant riverfront ghat where priests perform the grand evening Aarti ceremony with brass oil lamps and incantations.',
        lat: 25.3076,
        lng: 83.0107,
        avgVisitMinutes: 90,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Kashi Vishwanath Temple Corridor',
        category: 'Religious',
        description: 'Historic golden-spired temple dedicated to Lord Shiva, newly connected directly to the sacred Ganges riverbanks.',
        lat: 25.3109,
        lng: 83.0107,
        avgVisitMinutes: 120,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'BrijRama Palace Heritage Hotel',
        pricePerNight: 240,
        rating: 4.9,
        address: 'Darbhanga Ghat, Dashashwamedh, Varanasi',
        amenities: 'Historic 18th-Century Ghat Palace, Pure Vegetarian Dining, Flute Recitals',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 21, max: 32, condition: 'Sunny', icon: '01d', humidity: 55 },
      { date: new Date('2026-10-02'), min: 20, max: 31, condition: 'Clear', icon: '01d', humidity: 50 },
    ],
  },
  {
    id: 'dest-kerala',
    name: 'Kerala & Alleppey',
    country: 'India',
    region: 'South Asia',
    category: 'Beach',
    bestSeason: 'Winter (Sep-Mar)',
    avgCostTier: 1,
    description:
      'God’s Own Country blessed with labyrinthine emerald backwaters, handcrafted thatched houseboats, spice-scented hills, and soothing Ayurvedic therapies.',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Tropical and lush green throughout the year with balmy temperatures between 24°C and 31°C.',
    rating: 4.9,
    reviewCount: 610,
    lat: 9.4981,
    lng: 76.3388,
    attractions: [
      {
        name: 'Alleppey Backwaters Houseboat Cruise',
        category: 'Scenic',
        description: 'Glide through palm-fringed canals, village paddy fields, and Vembanad Lake aboard a traditional Kettuvallam wooden houseboat.',
        lat: 9.4981,
        lng: 76.3388,
        avgVisitMinutes: 300,
        estimatedCost: 35,
        imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Marari Beach & Coconut Groves',
        category: 'Nature',
        description: 'Pristine quiet golden sand beach lined with swaying palms, traditional fishing villages, and tranquil sea breeze.',
        lat: 9.6008,
        lng: 76.2974,
        avgVisitMinutes: 120,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Kumarakom Lake Resort',
        pricePerNight: 290,
        rating: 4.9,
        address: 'Kumarakom North Post, Kottayam, Kerala',
        amenities: 'Meandering Infinity Pool, Ayurvedic Spa, Heritage Lake Villas, Sunset Cruise',
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 24, max: 30, condition: 'Partly Cloudy', icon: '02d', humidity: 76 },
      { date: new Date('2026-10-02'), min: 24, max: 31, condition: 'Sunny', icon: '01d', humidity: 74 },
    ],
  },
  {
    id: 'dest-manali',
    name: 'Manali & Solang Valley',
    country: 'India',
    region: 'South Asia',
    category: 'Mountain',
    bestSeason: 'Summer for Trekking (Mar-Jun) & Winter for Snow (Dec-Feb)',
    avgCostTier: 1,
    description:
      'Himachal’s premier mountain haven crowned by pine-scented valleys, thrilling snow adventures at Rohtang Pass, and gushing glacial waters of the Beas River.',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Cool mountain summers (12°C-25°C) and snowy winters with sub-zero temperatures and powder skiing.',
    rating: 4.8,
    reviewCount: 580,
    lat: 32.2432,
    lng: 77.1892,
    attractions: [
      {
        name: 'Rohtang Pass & Atal Tunnel',
        category: 'Mountain',
        description: 'High mountain pass at 3,978 meters offering panoramic Himalayan vistas, glacier snow sports, and alpine views.',
        lat: 32.3716,
        lng: 77.2466,
        avgVisitMinutes: 240,
        estimatedCost: 10,
        imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Solang Valley Adventure Arena',
        category: 'Adventure',
        description: 'Picturesque side valley renowned for paragliding, zorbing, quad biking, and winter ski slopes.',
        lat: 32.3167,
        lng: 77.1583,
        avgVisitMinutes: 180,
        estimatedCost: 15,
        imageUrl: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'The Himalayan Luxury Castle & Resort',
        pricePerNight: 160,
        rating: 4.8,
        address: 'Hadimba Road, Manali, Himachal Pradesh',
        amenities: 'Victorian Gothic Architecture, Apple Orchard Views, Fireplace Rooms, Pool',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 6, max: 18, condition: 'Sunny', icon: '01d', humidity: 50 },
      { date: new Date('2026-10-02'), min: 5, max: 17, condition: 'Clear', icon: '01d', humidity: 48 },
    ],
  },
  {
    id: 'dest-udaipur',
    name: 'Udaipur',
    country: 'India',
    region: 'South Asia',
    category: 'Heritage',
    bestSeason: 'Winter (Oct-Mar)',
    avgCostTier: 2,
    description:
      'The Venice of the East adorned with romantic floating marble palaces on Lake Pichola, ornate courtyards, and panoramic Aravalli mountain sunsets.',
    imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Delightful winter weather with balmy afternoons and crisp, starry evenings.',
    rating: 4.9,
    reviewCount: 490,
    lat: 24.5854,
    lng: 73.7125,
    attractions: [
      {
        name: 'City Palace Complex & Museum',
        category: 'Heritage',
        description: 'Monumental 400-year-old lakeside palace complex blending Rajasthani and Mughal architectural splendors.',
        lat: 24.5764,
        lng: 73.6835,
        avgVisitMinutes: 180,
        estimatedCost: 6,
        imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Lake Pichola Sunset Boat Ride',
        category: 'Scenic',
        description: 'Cruise past the shimmering white Lake Palace and Jag Mandir island under golden twilight hues.',
        lat: 24.5714,
        lng: 73.6789,
        avgVisitMinutes: 90,
        estimatedCost: 8,
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Taj Lake Palace Udaipur',
        pricePerNight: 550,
        rating: 4.9,
        address: 'Pichola, Udaipur, Rajasthan',
        amenities: 'Island Floating Palace, Private Boat Transfers, Royal Jharokha Dining, Jiva Spa',
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 18, max: 31, condition: 'Sunny', icon: '01d', humidity: 46 },
      { date: new Date('2026-10-02'), min: 19, max: 32, condition: 'Clear', icon: '01d', humidity: 42 },
    ],
  },
  {
    id: 'dest-rishikesh',
    name: 'Rishikesh',
    country: 'India',
    region: 'South Asia',
    category: 'Adventure',
    bestSeason: 'Spring (Feb-May) & Autumn (Sep-Nov)',
    avgCostTier: 1,
    description:
      'The Yoga Capital of the World set at the Himalayan foothills, famed for adrenaline-pumping white-water rafting, tranquil riverside ashrams, and bungee jumping.',
    imageUrl: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Subtropical highland climate with refreshing mountain breezes and sparkling clean river air.',
    rating: 4.8,
    reviewCount: 510,
    lat: 30.0869,
    lng: 78.2676,
    attractions: [
      {
        name: 'Ganges White-Water River Rafting',
        category: 'Adventure',
        description: 'Navigate thrilling Grade III & IV rapids through scenic forested Himalayan gorges between Shivpuri and Rishikesh.',
        lat: 30.1342,
        lng: 78.3842,
        avgVisitMinutes: 180,
        estimatedCost: 15,
        imageUrl: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Ram Jhula & Beatles Ashram',
        category: 'Cultural',
        description: 'Iconic iron suspension bridge over the turquoise Ganges leading to the legendary Chaurasi Kutia ashram.',
        lat: 30.1234,
        lng: 78.3156,
        avgVisitMinutes: 90,
        estimatedCost: 2,
        imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Ananda in the Himalayas',
        pricePerNight: 480,
        rating: 4.9,
        address: 'Palace Estate, Narendra Nagar, Uttarakhand',
        amenities: 'Award-Winning Wellness Sanctuary, Mountain View Suites, Yoga Pavilions',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 17, max: 28, condition: 'Sunny', icon: '01d', humidity: 52 },
      { date: new Date('2026-10-02'), min: 16, max: 27, condition: 'Clear', icon: '01d', humidity: 50 },
    ],
  },
  {
    id: 'dest-darjeeling',
    name: 'Darjeeling',
    country: 'India',
    region: 'South Asia',
    category: 'Mountain',
    bestSeason: 'Spring (Mar-May) & Autumn (Oct-Dec)',
    avgCostTier: 1,
    description:
      'The Queen of the Hills overlooking Mount Kanchenjunga, celebrated for rolling emerald tea estates, colonial Himalayan Toy Train railways, and misty sunrises.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Temperate alpine climate with cool mountain mists and clear sunrise views of Himalayan summits.',
    rating: 4.8,
    reviewCount: 430,
    lat: 27.041,
    lng: 88.2663,
    attractions: [
      {
        name: 'Tiger Hill Kanchenjunga Sunrise',
        category: 'Scenic',
        description: 'Famous dawn viewpoint witnessing the first pink-golden rays of sunlight illuminate the world’s third-highest peak.',
        lat: 26.9942,
        lng: 88.2865,
        avgVisitMinutes: 120,
        estimatedCost: 2,
        imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Darjeeling Himalayan Toy Train',
        category: 'Heritage',
        description: 'UNESCO World Heritage 2-foot narrow gauge steam railway snaking through steep mountain zig-zags and Batasia Loop.',
        lat: 27.0415,
        lng: 88.2652,
        avgVisitMinutes: 120,
        estimatedCost: 12,
        imageUrl: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'The Elgin Darjeeling Heritage Hotel',
        pricePerNight: 130,
        rating: 4.7,
        address: 'H.D. Lama Road, Darjeeling, West Bengal',
        amenities: 'Colonial Manor Ambience, Oak Wood Paneling, Kanchenjunga Views, Afternoon Tea',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 10, max: 19, condition: 'Sunny', icon: '01d', humidity: 60 },
      { date: new Date('2026-10-02'), min: 9, max: 18, condition: 'Clear', icon: '01d', humidity: 58 },
    ],
  },
  {
    id: 'dest-andaman',
    name: 'Andaman & Nicobar Islands',
    country: 'India',
    region: 'South Asia',
    category: 'Island',
    bestSeason: 'Dry Season (Oct-May)',
    avgCostTier: 2,
    description:
      'An idyllic tropical paradise in the Bay of Bengal boasting Radhanagar’s award-winning white sands, kaleidoscope coral reefs, and bioluminescent night waters.',
    imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Warm tropical island breezes with water temperatures averaging 28°C and supreme underwater visibility.',
    rating: 4.9,
    reviewCount: 470,
    lat: 11.9761,
    lng: 92.9876,
    attractions: [
      {
        name: 'Radhanagar Beach (Beach No. 7)',
        category: 'Beach',
        description: 'Voted one of Asia’s best beaches, famed for blinding white sands, turquoise shallows, and lush rainforest backdrops.',
        lat: 11.9842,
        lng: 92.9511,
        avgVisitMinutes: 200,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Elephant Beach Scuba & Snorkel Reef',
        category: 'Adventure',
        description: 'Vibrant fringing coral reefs teeming with sea turtles, clownfish, manta rays, and sea anemones.',
        lat: 12.0125,
        lng: 92.9583,
        avgVisitMinutes: 180,
        estimatedCost: 45,
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'Taj Exotica Resort & Spa Andamans',
        pricePerNight: 410,
        rating: 4.9,
        address: 'Radhanagar Beach, Havelock Island, Andaman Islands',
        amenities: 'Private Beachfront Villas, Olympic Sized Pool, Jiva Spa, Turtle Nesting Tours',
        imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 25, max: 31, condition: 'Sunny', icon: '01d', humidity: 72 },
      { date: new Date('2026-10-02'), min: 24, max: 30, condition: 'Partly Cloudy', icon: '02d', humidity: 74 },
    ],
  },
  {
    id: 'dest-mumbai',
    name: 'Mumbai',
    country: 'India',
    region: 'South Asia',
    category: 'Urban',
    bestSeason: 'Winter (Nov-Feb)',
    avgCostTier: 2,
    description:
      'India’s bustling financial and entertainment capital, renowned for Victorian Gothic architecture, the glowing Queen’s Necklace curve of Marine Drive, and vibrant culture.',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1920&q=85',
    climateSummary: 'Pleasant winter season with cool evening sea breezes along the Arabian coast.',
    rating: 4.8,
    reviewCount: 650,
    lat: 18.922,
    lng: 72.8347,
    attractions: [
      {
        name: 'Gateway of India & Colaba Harbor',
        category: 'Heritage',
        description: 'Triumphal basalt arch monument erected on the waterfront overlooking the Arabian Sea, completed in 1924.',
        lat: 18.922,
        lng: 72.8347,
        avgVisitMinutes: 90,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Marine Drive (The Queen’s Necklace)',
        category: 'Scenic',
        description: '3.6-kilometer C-shaped boulevard framing Back Bay, famous for sunset strolls and dazzling evening streetlamps.',
        lat: 18.9432,
        lng: 72.823,
        avgVisitMinutes: 90,
        estimatedCost: 0,
        imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      },
    ],
    hotels: [
      {
        name: 'The Taj Mahal Palace Mumbai',
        pricePerNight: 350,
        rating: 4.9,
        address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra',
        amenities: 'Iconic Arabian Sea Views, Heritage Architecture, Wasabi by Morimoto, Luxury Spa',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        bookingUrl: 'https://booking.com',
      },
    ],
    weather: [
      { date: new Date('2026-10-01'), min: 23, max: 32, condition: 'Sunny', icon: '01d', humidity: 65 },
      { date: new Date('2026-10-02'), min: 23, max: 33, condition: 'Clear', icon: '01d', humidity: 62 },
    ],
  },
];

async function main() {
  console.log('--- Upserting Premier India Tourist Places into Neon Database ---');
  for (const d of indiaDestinations) {
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

    console.log(`✔ Added India destination: ${d.name} (${d.category})`);
  }

  const totalCount = await prisma.destination.count();
  console.log(`\n🎉 Success! Total destinations now available in database: ${totalCount}`);
}

main()
  .catch((e) => {
    console.error('Error adding India destinations:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
