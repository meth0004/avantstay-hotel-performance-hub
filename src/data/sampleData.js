// Sample data for The Code - 160 unit condo-hotel
// Context: F1 weekend in Austin - high occupancy period

// Owner data - mix of individual owners and Pearlstone (institutional)
const ownerNames = [
    'Sarah Chen', 'Michael Brooks', 'Jennifer Martinez', 'David Kim', 'Emily Watson',
    'Robert Johnson', 'Lisa Anderson', 'James Wilson', 'Maria Garcia', 'Christopher Lee',
    'Amanda Taylor', 'Daniel Brown', 'Jessica Davis', 'Thomas Moore', 'Michelle White',
    'Andrew Harris', 'Stephanie Clark', 'Kevin Lewis', 'Laura Robinson', 'Mark Walker',
    'Nicole Hall', 'Brian Allen', 'Katherine Young', 'Jason King', 'Heather Wright',
    'Eric Scott', 'Rebecca Green', 'Steven Adams', 'Ashley Baker', 'Ryan Nelson',
    'Megan Hill', 'Justin Campbell', 'Amber Mitchell', 'Brandon Roberts', 'Vanessa Turner',
    'Tyler Phillips', 'Morgan Evans', 'Derek Edwards', 'Courtney Collins', 'Austin Stewart'
];

export const owners = [
    { id: 'pearlstone', name: 'Pearlstone Capital', isCrown: false, onboardedAt: '2025-01-01' },
    ...ownerNames.map((name, i) => ({
        id: `owner-${i + 1}`,
        name,
        isCrown: true,
        onboardedAt: i < 15 ? '2025-01-01' : i < 20 ? '2026-01-15' : '2026-01-05'
    }))
];

// Room type definitions
export const roomTypes = [
    { id: 'studio', name: 'Studio', count: 60, baseADR: 289 },
    { id: '1br', name: '1BR Suite', count: 60, baseADR: 389 },
    { id: '2br', name: '2BR Suite', count: 34, baseADR: 549 },
    { id: 'penthouse', name: 'Penthouse', count: 6, baseADR: 1299 }
];

// Helper function to generate normally distributed random numbers
const normalRandom = (mean = 0, stdDev = 1) => {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
};

// Generate rooms with realistic data
const generateRooms = () => {
    const allRooms = [];
    let roomNumber = 101;

    roomTypes.forEach(roomType => {
        const roomTypeRooms = [];

        for (let i = 0; i < roomType.count; i++) {
            const isPearlstone = (roomType.id === 'studio' && i < 20) ||
                (roomType.id === '1br' && i < 20) ||
                (roomType.id === '2br' && i < 8) ||
                (roomType.id === 'penthouse' && i < 2);

            const owner = isPearlstone
                ? owners[0]
                : owners[Math.floor(Math.random() * (owners.length - 1)) + 1];

            // Generate RS value
            let rs = normalRandom(75, 8);
            if (Math.random() < 0.05) {
                rs = Math.random() < 0.5 ? normalRandom(95, 3) : normalRandom(55, 3);
            }
            rs = Math.max(40, Math.min(110, rs));

            // CIRS
            let cirs;
            if (roomType.id === 'studio') {
                const rand = Math.random();
                if (rand < 0.35) cirs = 'Occupied';
                else if (rand < 0.55) cirs = 'Not Ready';
                else if (rand < 0.65) cirs = 'Blocked';
                else cirs = 'Ready';
            } else if (roomType.id === '1br') {
                const rand = Math.random();
                if (rand < 0.25) cirs = 'Occupied';
                else if (rand < 0.40) cirs = 'Not Ready';
                else if (rand < 0.48) cirs = 'Blocked';
                else cirs = 'Ready';
            } else {
                const rand = Math.random();
                if (rand < 0.15) cirs = 'Occupied';
                else if (rand < 0.25) cirs = 'Not Ready';
                else if (rand < 0.30) cirs = 'Blocked';
                else cirs = 'Ready';
            }

            // Metrics
            const daysInPeriod = 30;

            // Past Period Occupancy Breakdown
            // Owner nights (crown owners only)
            const ownerNights = owner.isCrown ? Math.floor(Math.random() * 6) : 0; // 0-5 nights for crown owners
            // Blocked nights (maintenance, repairs, etc.)
            const blockedNights = Math.random() < 0.25 ? Math.floor(Math.random() * 4) + 1 : 0; // 1-4 nights, 25% chance
            // Guest nights (remaining occupancy after owner and blocked)
            const remainingForGuests = daysInPeriod - ownerNights - blockedNights;
            const guestOccupancyRate = 0.55 + Math.random() * 0.35; // 55-90% of remaining days
            const guestNights = Math.floor(remainingForGuests * guestOccupancyRate);

            // Total occupied nights and occupancy rate
            const occupiedNights = guestNights + ownerNights + blockedNights;
            const occupancyRate = occupiedNights / daysInPeriod;

            // Calculate individual percentages
            const guestOccupancyPct = Math.round((guestNights / daysInPeriod) * 100);
            const ownerOccupancyPct = Math.round((ownerNights / daysInPeriod) * 100);
            const blockedOccupancyPct = Math.round((blockedNights / daysInPeriod) * 100);

            const adr = roomType.baseADR * (0.9 + Math.random() * 0.2);
            const actualRevenue = Math.floor(guestNights * adr); // Only guest nights generate actual revenue
            const imputedRevenue = Math.round(ownerNights * adr);

            // Future Period (Next 30 Days) Breakdown
            // Future owner bookings
            const futureOwnerNights = owner.isCrown ? Math.floor(Math.random() * 5) : 0; // 0-4 nights planned
            // Future blocked nights (scheduled maintenance, etc.)
            const futureBlockedNights = Math.random() < 0.15 ? Math.floor(Math.random() * 3) + 1 : 0; // 1-3 nights, 15% chance
            // Future guest bookings
            const futureRemainingForGuests = daysInPeriod - futureOwnerNights - futureBlockedNights;
            const futureGuestBookingRate = 0.3 + Math.random() * 0.4; // 30-70% of remaining days booked
            const futureGuestNights = Math.floor(futureRemainingForGuests * futureGuestBookingRate);

            // Future availability is the unbooked portion
            const futureBookedNights = futureGuestNights + futureOwnerNights + futureBlockedNights;
            const futureAvailableNights = daysInPeriod - futureBookedNights;

            // Calculate future percentages
            const futureGuestPct = Math.round((futureGuestNights / daysInPeriod) * 100);
            const futureOwnerPct = Math.round((futureOwnerNights / daysInPeriod) * 100);
            const futureBlockedPct = Math.round((futureBlockedNights / daysInPeriod) * 100);

            const futureNightsWeighted = Math.floor(futureAvailableNights * (0.8 + Math.random() * 0.4));

            const bookings = Math.floor(3 + Math.random() * 8);
            const rsChange = (Math.random() - 0.5) * 6;

            roomTypeRooms.push({
                id: `room-${roomNumber}`,
                number: String(roomNumber),
                roomTypeId: roomType.id,
                roomTypeName: roomType.name,
                owner,
                cirs,
                rs: Math.round(rs * 10) / 10,
                rsChange: Math.round(rsChange * 10) / 10,
                bookings,
                actualRevenue,
                imputedRevenue,
                ownerNights,
                guestNights,
                blockedNights,
                guestOccupancyPct,
                ownerOccupancyPct,
                blockedOccupancyPct,
                futureAvailableNights,
                futureGuestNights,
                futureOwnerNights,
                futureBlockedNights,
                futureGuestPct,
                futureOwnerPct,
                futureBlockedPct,
                futureNightsWeighted,
                occupancy: Math.round(occupancyRate * 100),
                occupiedNights,
                adr: Math.round(adr),
                checkoutTime: cirs === 'Occupied' && Math.random() > 0.5 ? '11:00 AM' : null,
                nextCheckinTime: Math.random() > 0.7 ? '3:00 PM' : null
            });

            roomNumber++;
        }

        roomTypeRooms.sort((a, b) => a.rs - b.rs);

        // Outliers based on median
        const medianRS = roomTypeRooms[Math.floor(roomTypeRooms.length / 2)].rs;
        roomTypeRooms.forEach((room, idx) => {
            room.rank = idx + 1;
            room.isOutlier = Math.abs(room.rs - medianRS) / medianRS >= 0.20;
            room.outlierReason = room.rs > medianRS
                ? `Over-earner: +${Math.round((room.rs - medianRS) / medianRS * 100)}% vs median`
                : `Under-earner: ${Math.round((room.rs - medianRS) / medianRS * 100)}% vs median`;
        });

        allRooms.push(...roomTypeRooms);
    });

    return allRooms;
};

export const rooms = generateRooms();

// Room type summary stats
export const roomTypeSummary = roomTypes.map(rt => {
    const typeRooms = rooms.filter(r => r.roomTypeId === rt.id);
    const totalRevenue = typeRooms.reduce((sum, r) => sum + r.actualRevenue, 0);
    const totalImputedRevenue = typeRooms.reduce((sum, r) => sum + r.imputedRevenue, 0);
    const totalOwnerNights = typeRooms.reduce((sum, r) => sum + r.ownerNights, 0);

    const avgOccupancy = Math.round(typeRooms.reduce((sum, r) => sum + r.occupancy, 0) / typeRooms.length);
    const avgADR = Math.round(typeRooms.reduce((sum, r) => sum + r.adr, 0) / typeRooms.length);
    const revPAR = Math.round(avgADR * avgOccupancy / 100);
    const sortedByRS = [...typeRooms].sort((a, b) => a.rs - b.rs);
    const medianRS = sortedByRS[Math.floor(sortedByRS.length / 2)]?.rs || 0;
    const outlierCount = typeRooms.filter(r => r.isOutlier).length;

    // Future avail stats
    const totalFutureAvailable = typeRooms.reduce((sum, r) => sum + r.futureAvailableNights, 0);
    const totalFutureCapacity = typeRooms.length * 30; // 30 day period
    const avgFutureAvailability = Math.round((totalFutureAvailable / totalFutureCapacity) * 100);

    const cirsCount = {
        Ready: typeRooms.filter(r => r.cirs === 'Ready').length,
        'Not Ready': typeRooms.filter(r => r.cirs === 'Not Ready').length,
        Blocked: typeRooms.filter(r => r.cirs === 'Blocked').length,
        Occupied: typeRooms.filter(r => r.cirs === 'Occupied').length
    };

    return {
        ...rt,
        totalRevenue,
        totalImputedRevenue,
        totalOwnerNights,
        avgOccupancy,
        avgADR,
        revPAR,
        medianRS: Math.round(medianRS * 10) / 10,
        outlierCount,
        avgFutureAvailability, // %
        cirsCount
    };
});

// Owner rollup data
export const ownerRollup = owners.map(owner => {
    const ownerRooms = rooms.filter(r => r.owner.id === owner.id);
    if (ownerRooms.length === 0) return null;

    const totalActualRevenue = ownerRooms.reduce((sum, r) => sum + r.actualRevenue, 0);
    const totalImputedRevenue = ownerRooms.reduce((sum, r) => sum + r.imputedRevenue, 0);
    const totalBookings = ownerRooms.reduce((sum, r) => sum + r.bookings, 0);

    // New metrics
    const totalOccupiedNights = ownerRooms.reduce((sum, r) => sum + r.occupiedNights, 0);
    const totalCapacityNights = ownerRooms.length * 30;
    const occupancyPct = Math.round((totalOccupiedNights / totalCapacityNights) * 100);

    const totalFutureAvailable = ownerRooms.reduce((sum, r) => sum + r.futureAvailableNights, 0);
    const futureAvailabilityPct = Math.round((totalFutureAvailable / totalCapacityNights) * 100);

    const totalOwnerNights = ownerRooms.reduce((sum, r) => sum + r.ownerNights, 0);

    const avgRS = Math.round(ownerRooms.reduce((sum, r) => sum + r.rs, 0) / ownerRooms.length * 10) / 10;
    const rsSpread = ownerRooms.length > 1
        ? Math.max(...ownerRooms.map(r => r.rs)) - Math.min(...ownerRooms.map(r => r.rs))
        : 0;

    return {
        ...owner,
        units: ownerRooms.length,
        totalActualRevenue,
        totalImputedRevenue,
        totalBookings,
        occupancyPct,
        futureAvailabilityPct,
        totalOwnerNights,
        avgRS,
        rsSpread: Math.round(rsSpread * 10) / 10,
        rooms: ownerRooms
    };
}).filter(Boolean).sort((a, b) => b.units - a.units);

// Ops planning data (Expanded with more scenario data as requested)
export const opsData = {
    horizons: ['Next 24h', 'Next 48h', 'Next 72h', 'Next 7 Days'],
    roomTypeReadiness: roomTypes.map(rt => {
        // Force specific scenarios for screenshot matching/demo
        // Studio: High Risk
        // 1BR: Medium Risk
        // 2BR: Low Risk
        const typeRooms = rooms.filter(r => r.roomTypeId === rt.id);
        const readyCount = typeRooms.filter(r => r.cirs === 'Ready').length;
        const notReadyCount = typeRooms.filter(r => r.cirs === 'Not Ready').length;
        const blockedCount = typeRooms.filter(r => r.cirs === 'Blocked').length;
        const occupiedCount = typeRooms.filter(r => r.cirs === 'Occupied').length;

        let arrivals, departures, top3NotReady, riskLevel;

        if (rt.id === 'studio') {
            arrivals = 12;
            departures = 8;
            top3NotReady = 3; // All top 3 are not ready
            riskLevel = 'High';
        } else if (rt.id === '1br') {
            arrivals = 8;
            departures = 5;
            top3NotReady = 1;
            riskLevel = 'Medium';
        } else if (rt.id === '2br') {
            arrivals = 4;
            departures = 4;
            top3NotReady = 0;
            riskLevel = 'Low';
        } else {
            arrivals = 1;
            departures = 1;
            top3NotReady = 0;
            riskLevel = 'Low';
        }

        return {
            roomTypeId: rt.id,
            roomTypeName: rt.name,
            arrivals,
            departures,
            readyCount,
            notReadyCount,
            blockedCount,
            occupiedCount,
            top3NotReady,
            riskLevel,
            rooms: typeRooms.map(room => ({
                ...room,
                readinessNote: getReadinessNote(room)
            }))
        };
    })
};

function getReadinessNote(room) {
    if (room.cirs === 'Not Ready' && room.rank <= 3) {
        return 'At Risk: Top Option Needs Turnover';
    }
    if (room.cirs === 'Blocked' && room.rank <= 3) {
        return 'At Risk: Top Option Blocked';
    }
    if (room.cirs === 'Occupied' && room.checkoutTime) {
        return 'Turning Today — Monitor';
    }
    if (room.cirs === 'Ready' && room.rank <= 3) {
        return 'Good To Go';
    }
    if (room.cirs === 'Not Ready') {
        return 'Needs Turnover';
    }
    if (room.cirs === 'Blocked') {
        return 'Blocked';
    }
    return null;
}

// Room type comparison data (Expanded metrics)
export const roomTypeComparison = roomTypeSummary.map(rt => {
    const typeRooms = rooms.filter(r => r.roomTypeId === rt.id);
    const totalNights = 30 * rt.count;
    const blockedNights = typeRooms.reduce((sum, r) => sum + r.blockedNights, 0);
    const ownerStayNights = typeRooms.reduce((sum, r) => sum + r.ownerNights, 0);
    const cancellationRate = Math.round((3 + Math.random() * 8) * 10) / 10;

    // Fairness spread
    const sortedByRevenue = [...typeRooms].sort((a, b) => b.actualRevenue - a.actualRevenue);
    const topRevenue = sortedByRevenue[0]?.actualRevenue || 0;
    const bottomRevenue = sortedByRevenue[sortedByRevenue.length - 1]?.actualRevenue || 0;

    return {
        ...rt,
        cancellationRate,
        blockedNights,
        blockedNightsPct: Math.round(blockedNights / totalNights * 100 * 10) / 10,
        ownerStayNights,
        ownerStayNightsPct: Math.round(ownerStayNights / totalNights * 100 * 10) / 10,
        imputedRevenue: rt.totalImputedRevenue,
        fairnessSpread: {
            top: topRevenue,
            bottom: bottomRevenue,
            pct: Math.round((topRevenue - bottomRevenue) / bottomRevenue * 100)
        }
    };
});

// Technical - dynamically calculate outlier counts
const outliersByRoomType = {};
roomTypes.forEach(rt => {
    const typeRooms = rooms.filter(r => r.roomTypeId === rt.id);
    outliersByRoomType[rt.name] = typeRooms.filter(r => r.isOutlier).length;
});

export const technicalData = {
    recomputeJobs: [
        { id: 'job-001', startTime: '2026-01-07 06:00:00', endTime: '2026-01-07 06:02:34', status: 'Success', scope: 'All Room Types', trigger: 'Nightly', rowsProcessed: 160, errors: 0 },
        { id: 'job-002', startTime: '2026-01-07 10:15:22', endTime: '2026-01-07 10:15:45', status: 'Success', scope: 'Studio', trigger: 'Event', rowsProcessed: 60, errors: 0 },
        { id: 'job-003', startTime: '2026-01-06 18:00:00', endTime: '2026-01-06 18:01:05', status: 'Failed', scope: '1BR Suite', trigger: 'Manual', rowsProcessed: 32, errors: 4, errorMessage: "Missing Folio Data" },
        { id: 'job-004', startTime: '2026-01-06 06:00:00', endTime: '2026-01-06 06:02:22', status: 'Success', scope: 'All Room Types', trigger: 'Nightly', rowsProcessed: 160, errors: 0 },
        { id: 'job-005', startTime: '2026-01-05 14:15:00', endTime: '2026-01-05 14:15:45', status: 'Success', scope: '2BR Suite', trigger: 'Event', rowsProcessed: 34, errors: 0 }
    ],
    inputFreshness: [
        { source: 'Bookings', lastUpdated: '2026-01-07 12:30:00', coverage: 100, alert: null },
        { source: 'Folios / Revenue', lastUpdated: '2026-01-07 12:15:00', coverage: 100, alert: null },
        { source: 'Owner Stays', lastUpdated: '2026-01-07 08:00:00', coverage: 98, alert: '2 Rooms Missing Imputed Values' },
        { source: 'Blocks', lastUpdated: '2026-01-07 11:45:00', coverage: 100, alert: null },
        { source: 'Inventory', lastUpdated: '2026-01-07 06:00:00', coverage: 100, alert: null },
        { source: 'CIRS Feed', lastUpdated: '2026-01-07 12:28:00', coverage: 100, alert: null }
    ],
    anomalies: [
        { type: 'warning', message: 'Late Revenue Postings', details: '2 Bookings posted after recompute window (Rooms 145, 189)' },
        { type: 'critical', message: 'Missing Folio Data', details: 'Job-003 Failed for 1BR Suite due to API timeout.' },
        { type: 'info', message: 'High Outlier Count', details: 'Studio Room Type has >20% outliers.' }
    ],
    outlierConfig: {
        threshold: 20,
        outliersByRoomType
    }
};

export const getRoomDetails = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return null;

    return {
        ...room,
        rsDrivers: [
            { timestamp: '2026-01-07 11:30:00', type: 'recompute', description: 'RS Recomputed', delta: room.rsChange },
            { timestamp: '2026-01-06 14:22:00', type: 'checkout', description: 'Checkout Posted', amount: Math.floor(room.adr * 2.5), delta: 3.2 },
            { timestamp: '2026-01-05 09:00:00', type: 'owner_stay', description: 'Owner Stay Applied', amount: room.imputedRevenue, delta: -1.8 },
            { timestamp: '2026-01-04 06:00:00', type: 'recompute', description: 'Nightly RS Recompute', delta: 0.5 },
            { timestamp: '2026-01-03 16:45:00', type: 'availability', description: 'Future Availability Changed', nights: 3, delta: -0.7 }
        ],
        bookingHistory: [
            { id: 'BK-78234', dates: 'Jan 5-7, 2026', status: 'Completed', revenue: Math.floor(room.adr * 2), channel: 'Direct' },
            { id: 'BK-77891', dates: 'Jan 1-3, 2026', status: 'Completed', revenue: Math.floor(room.adr * 2), channel: 'Airbnb' },
            { id: 'BK-77456', dates: 'Dec 28-31, 2025', status: 'Completed', revenue: Math.floor(room.adr * 3), channel: 'Booking.com' }
        ],
        ownerStays: room.owner.isCrown ? [
            { dates: 'Dec 20-21, 2025', nights: 2, imputedValue: Math.floor(room.adr * 2) }
        ] : []
    };
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export const formatRS = (val) => {
    if (val === 0 || val === 100) return Math.round(val).toString();
    return val.toFixed(1);
};

export const formatPercent = (value) => {
    return `${value}%`;
};

// Helper to calc effective window
export const getEffectiveWindow = (onboardedAt, reportingStart) => {
    const onboard = new Date(onboardedAt);
    const start = new Date(reportingStart);
    const effectiveStart = onboard > start ? onboard : start;

    // Format: "Jan 01"
    const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

    // Calc nights diff (mock: assume reporting end is Jan 30 approx)
    const reportEnd = new Date('2026-01-31');
    const diffTime = Math.abs(reportEnd - effectiveStart);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
        isPartial: onboard > start,
        windowLabel: `${fmt(effectiveStart)} - ${fmt(reportEnd)}`,
        nights: diffDays
    };
};


