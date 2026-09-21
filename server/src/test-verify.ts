import http from 'http';

const BASE_URL = 'http://localhost:5000/api';

async function request(path: string, options: any = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data: any = await res.json();
  return { status: res.status, data };
}

async function runTests() {
  console.log('====================================================');
  console.log('  RUNNING AUTOMATED E2E VERIFICATION FOR WANDERLY   ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    const health = await request('/health');
    assert(health.status === 200 && health.data.status === 'healthy', 'Health Check endpoint is active');

    // 2. Demo Login
    const login = await request('/auth/demo-login', { method: 'POST' });
    assert(login.status === 200 && !!login.data.data.token, 'Demo Login generates valid JWT token');
    const token = login.data.data.token;
    const authHeaders = { Authorization: `Bearer ${token}` };

    // 3. User Me & Preferences
    const me = await request('/auth/me', { headers: authHeaders });
    assert(me.status === 200 && me.data.data.email === 'priya@wanderly.com', 'Fetch authenticated user profile');

    // 4. Destination Discovery & Filtering
    const destinations = await request('/destinations?category=Heritage');
    assert(destinations.status === 200 && destinations.data.data.length >= 2, 'Filter destinations by category');

    const searchResult = await request('/destinations?search=Bali');
    assert(searchResult.status === 200 && searchResult.data.data[0].name === 'Bali', 'Search destinations by query');

    // 5. Destination Details with Weather Intelligence
    const destDetail = await request('/destinations/dest-kyoto');
    assert(
      destDetail.status === 200 &&
      destDetail.data.data.weather &&
      destDetail.data.data.weather.forecast.length >= 4,
      'Destination profile includes weather intelligence and forecast'
    );

    // 6. Multi-Destination Budget Comparison
    const compare = await request('/budget/compare', {
      method: 'POST',
      body: JSON.stringify({
        destinationIds: ['dest-kyoto', 'dest-bali'],
        durationDays: 5,
        travelerCount: 2,
        budgetTier: 2,
      }),
    });
    assert(
      compare.status === 200 &&
      compare.data.data.comparisons.length === 2 &&
      compare.data.data.comparisons[0].grandTotal > 0,
      'Side-by-side budget comparison computes grand total and breakdown'
    );

    // 7. Trip Creation & Auto-Generation
    const newTrip = await request('/trips', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        destinationId: 'dest-bali',
        title: 'Automated Test Trip to Bali',
        startDate: '2026-11-01',
        endDate: '2026-11-05',
        travelerCount: 2,
        budgetCeiling: 2000,
        autoGenerate: true,
      }),
    });
    assert(newTrip.status === 201 && newTrip.data.data.days.length === 5, 'Create trip with day-wise breakdown');

    const tripId = newTrip.data.data.id;
    const day1Id = newTrip.data.data.days[0].id;

    // 8. Add Itinerary Item & Recalculate
    const addedItem = await request(`/trips/${tripId}/days/${day1Id}/items`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        itemType: 'dining',
        title: 'Sunset Seafood Barbeque',
        description: 'Beachside grilled prawns and mocktails',
        cost: 60,
        startTime: '07:00 PM',
      }),
    });
    assert(addedItem.status === 201 && addedItem.data.data.cost === 60, 'Add custom itinerary item');

    const updatedTrip = await request(`/trips/${tripId}`, { headers: authHeaders });
    assert(
      updatedTrip.status === 200 &&
      updatedTrip.data.data.calculatedBudget.totalCost > 0,
      'Live budget estimator updates automatically'
    );

    // 9. Favorites Wishlist Toggle
    const favToggle = await request('/favorites/toggle', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        itemType: 'destination',
        itemId: 'dest-banff',
        title: 'Banff',
      }),
    });
    assert(favToggle.status === 200, 'Toggle favorite item on wishlist');

    // 10. Community Reviews Submission
    const review = await request('/reviews', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        destinationId: 'dest-kyoto',
        rating: 5,
        comment: 'Unforgettable cultural architecture and breathtaking zen gardens!',
        travelerType: 'Explorer',
      }),
    });
    assert(review.status === 201 && review.data.data.rating === 5, 'Submit verified traveler review');
    const createdReviewId = review.data.data.id;

    // 11. AI Travel Chatbot Recommendation with Destination Cards
    const aiChat = await request('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Can you recommend a 5-day budget trip to Kyoto under ₹60,000?',
      }),
    });
    assert(
      aiChat.status === 200 &&
      aiChat.data.data.reply.length > 50 &&
      aiChat.data.data.destinations.length >= 1 &&
      !!aiChat.data.data.destinations[0].imageUrl &&
      aiChat.data.data.suggestedPrompts.length >= 1,
      'AI Travel Chatbot returns grounded recommendations with destination cards and images'
    );

    // ==========================================
    // 12. ADMIN PANEL & RBAC VERIFICATION
    // ==========================================
    console.log('\n--- Testing Admin Panel & RBAC Security ---');

    // 11a. Traveler attempting admin access must receive 403 Forbidden
    const forbiddenCheck = await request('/admin/stats', { headers: authHeaders });
    assert(forbiddenCheck.status === 403, 'Traveler token receives 403 Forbidden on /admin/stats');

    // 11b. Demo Admin Login
    const adminLogin = await request('/auth/demo-admin-login', { method: 'POST' });
    assert(
      adminLogin.status === 200 && adminLogin.data.data.user.role === 'admin',
      'Demo Admin Login succeeds with admin role'
    );
    const adminToken = adminLogin.data.data.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };

    // 11c. Admin Overview Stats
    const adminStats = await request('/admin/stats', { headers: adminHeaders });
    assert(
      adminStats.status === 200 &&
      adminStats.data.data.totals.destinations >= 8 &&
      typeof adminStats.data.data.totals.platformBudgetVolume === 'number',
      'Admin fetches dashboard stats and INR platform volume'
    );

    // 11d. Destination CRUD
    const newDest = await request('/admin/destinations', {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        name: 'Jodhpur Blue City',
        country: 'India',
        region: 'Rajasthan',
        category: 'Heritage',
        avgCostTier: 2,
        bestSeason: 'Oct - Mar',
        climateSummary: 'Sunny warm days, cool desert evenings',
        description: 'The iconic Blue City featuring Mehrangarh Fort and vibrant bazaars.',
        imageUrl: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=800',
        heroImageUrl: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=1600',
        lat: 26.2389,
        lng: 73.0243,
      }),
    });
    assert(newDest.status === 201 && newDest.data.data.name === 'Jodhpur Blue City', 'Admin creates new destination');
    const createdDestId = newDest.data.data.id;

    // 11e. Attraction CRUD
    const newAttr = await request('/admin/attractions', {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        destinationId: createdDestId,
        name: 'Mehrangarh Fort',
        category: 'Fort',
        description: 'Imposing hilltop fort museum overlooking the blue houses.',
        lat: 26.2978,
        lng: 73.0185,
        avgVisitMinutes: 150,
        estimatedCost: 600,
        imageUrl: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=800',
      }),
    });
    assert(newAttr.status === 201 && newAttr.data.data.estimatedCost === 600, 'Admin adds attraction with INR cost');

    // 11f. Hotel CRUD
    const newHotel = await request('/admin/hotels', {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        destinationId: createdDestId,
        name: 'Raas Jodhpur',
        pricePerNight: 8500,
        rating: 4.8,
        address: 'Tunwar ji ka Jhalra, Jodhpur',
        amenities: ['Pool', 'Fort View', 'Spa', 'Fine Dining'],
        imageUrl: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=800',
        bookingUrl: 'https://raashotels.com',
      }),
    });
    assert(newHotel.status === 201 && newHotel.data.data.pricePerNight === 8500, 'Admin creates hotel with ₹8,500/night rate');

    // 11g. User Management & RBAC
    const usersList = await request('/admin/users', { headers: adminHeaders });
    assert(usersList.status === 200 && usersList.data.data.length >= 3, 'Admin lists registered users');

    // 11h. Review Moderation & Rating Recalculation
    const delReview = await request(`/admin/reviews/${createdReviewId}`, {
      method: 'DELETE',
      headers: adminHeaders,
    });
    assert(delReview.status === 200 && delReview.data.success, 'Admin deletes review and triggers rating recalculation');

    // 11i. Clean up test destination
    const delDest = await request(`/admin/destinations/${createdDestId}`, {
      method: 'DELETE',
      headers: adminHeaders,
    });
    assert(delDest.status === 200 && delDest.data.success, 'Admin deletes destination and cascaded assets');

    console.log(`\n----------------------------------------------------`);
    console.log(`  SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`----------------------------------------------------\n`);

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

runTests();
