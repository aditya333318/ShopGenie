import { Product, ShoppingMission, Coupon } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- Audio & Electronics ---
  {
    id: 'prod-audio-1',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    brand: 'Sony',
    category: 'Audio & Electronics',
    price: 348,
    originalPrice: 399,
    discountPercent: 13,
    rating: 4.8,
    reviewCount: 3420,
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    badge: 'Best ANC',
    description: 'Industry-leading noise canceling with two processors and 8 microphones. Crystal clear hands-free calling and up to 30-hour battery life.',
    features: [
      'Dual Processor V1 & QN1 HD Noise Canceling',
      'Ultra-comfortable, lightweight design in soft fit leather',
      'Up to 30-hour battery life with quick charging (3 min for 3 hours)',
      'Multipoint connection allows swift switching between devices',
      'Speak-to-Chat and ambient sound modes'
    ],
    specs: {
      'Battery Life': '30 Hours (ANC On)',
      'Weight': '250g',
      'Bluetooth': 'v5.2 (LDAC, AAC, SBC)',
      'Charging': 'USB-C Fast Charging',
      'Driver Size': '30mm Carbon Fiber'
    },
    inStock: true,
    stockCount: 18,
    fastShipping: true,
    tags: ['headphones', 'anc', 'wireless', 'bluetooth', 'sony', 'travel', 'audiophile'],
    pros: ['Superb active noise cancellation', 'Class-leading microphone clarity', 'Comfortable for all-day wear'],
    cons: ['Does not fold as compactly as XM4', 'Touch controls can be sensitive in rain'],
    userReviews: [
      {
        id: 'rev-1',
        author: 'Alex M.',
        rating: 5,
        date: '2026-06-14',
        title: 'Best travel headphones ever made',
        comment: 'Silenced the airplane jet rumble completely. 8 hour flight and zero ear fatigue.',
        verified: true
      },
      {
        id: 'rev-2',
        author: 'Devon K.',
        rating: 4,
        date: '2026-07-02',
        title: 'Amazing sound, wish it folded smaller',
        comment: 'Soundstage is rich and balanced. The case is a bit bulky compared to older models but sound quality is worth it.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-audio-2',
    title: 'Nothing Ear (a) High-Res Wireless Earbuds',
    brand: 'Nothing',
    category: 'Audio & Electronics',
    price: 99,
    originalPrice: 119,
    discountPercent: 17,
    rating: 4.6,
    reviewCount: 980,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    badge: 'Editor Choice',
    description: 'Iconic transparent design with punchy bass, smart 45dB Active Noise Cancellation, and Hi-Res Audio certified with LDAC.',
    features: [
      'Smart ANC with 45dB noise reduction and real-time leakage detection',
      '11mm custom dynamic driver with Bass Enhance algorithm',
      'Up to 42.5 hours total playback with charging case',
      'Clear Voice Technology with 3 mics per bud',
      'ChatGPT integration with Nothing OS'
    ],
    specs: {
      'Battery Life': '9.5h buds / 42.5h with case',
      'Water Resistance': 'IP54 (buds) / IP55 (case)',
      'Weight': '4.8g per bud',
      'Codecs': 'LDAC, AAC, SBC'
    },
    inStock: true,
    stockCount: 42,
    fastShipping: true,
    tags: ['earbuds', 'wireless', 'nothing', 'transparent', 'budget-friendly', 'commute', 'anc'],
    pros: ['Incredible sound-to-price ratio', 'Eye-catching design', 'Super lightweight and comfortable'],
    cons: ['No wireless charging on the case', 'Case scratches easily if kept with keys'],
    userReviews: [
      {
        id: 'rev-3',
        author: 'Marcus L.',
        rating: 5,
        date: '2026-07-18',
        title: 'Unbelievable value under $100',
        comment: 'Beats out my $200 earbuds in daily comfort and the bass punch is phenomenal.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-audio-3',
    title: 'Sonos Era 100 Smart Architectural Speaker',
    brand: 'Sonos',
    category: 'Audio & Electronics',
    price: 249,
    rating: 4.7,
    reviewCount: 1450,
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    badge: 'Home Audio Pick',
    description: 'Next-gen acoustic architecture with stereo sound, rich deep bass, Bluetooth, and Apple AirPlay 2 connectivity.',
    features: [
      'Dual angled tweeters for spacious stereo separation',
      '25% larger woofer delivering deeper bass response',
      'Trueplay room tuning optimization via iOS/Android',
      'Wi-Fi 6, Bluetooth 5.0, and USB-C line-in ready',
      'Works with Amazon Alexa and Sonos Voice Control'
    ],
    specs: {
      'Connectivity': 'Wi-Fi 6, Bluetooth 5.0, AirPlay 2',
      'Amplifiers': '3x Class-D digital amplifiers',
      'Dimensions': '182.5 x 120 x 130.5 mm',
      'Weight': '2.02 kg'
    },
    inStock: true,
    stockCount: 12,
    fastShipping: true,
    tags: ['speaker', 'sonos', 'smart-home', 'hifi', 'airplay', 'wifi-audio', 'minimalist'],
    pros: ['Room-filling stereo sound', 'Seamless multi-room grouping', 'Line-in support via USB-C adapter'],
    cons: ['USB-C adapter sold separately', 'No built-in battery (wall powered)'],
    userReviews: [
      {
        id: 'rev-4',
        author: 'Elena R.',
        rating: 5,
        date: '2026-08-01',
        title: 'Fills my entire living room with crisp sound',
        comment: 'Setup took 2 minutes. The stereo imaging from a single compact cylinder is astonishing.',
        verified: true
      }
    ]
  },

  // --- Work & Ergonomics ---
  {
    id: 'prod-work-1',
    title: 'Logitech MX Master 3S Wireless Performance Mouse',
    brand: 'Logitech',
    category: 'Work & Ergonomics',
    price: 99,
    originalPrice: 119,
    discountPercent: 17,
    rating: 4.9,
    reviewCount: 8900,
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    badge: 'Top Productivity',
    description: 'Quiet Click technology, 8K DPI glass-tracking sensor, and MagSpeed electromagnetic scrolling for supreme precision.',
    features: [
      'MagSpeed scroll wheel scrolls 1,000 lines in 1 second',
      'Quiet Clicks feel satisfying with 90% less click noise',
      '8,000 DPI Darkfield sensor tracks seamlessly on glass',
      'Customizable gesture buttons and thumb wheel',
      'Easy-Switch connects up to 3 computers across macOS & Windows'
    ],
    specs: {
      'DPI': '200 to 8000 DPI',
      'Battery': 'Up to 70 days per full charge',
      'Connectivity': 'Bluetooth Low Energy & Logi Bolt',
      'Weight': '141g'
    },
    inStock: true,
    stockCount: 35,
    fastShipping: true,
    tags: ['mouse', 'logitech', 'ergonomic', 'office', 'productivity', 'designer', 'developer'],
    pros: ['Remarkably quiet clicks', 'Incredible thumb scroll wheel', 'Ergonomic palm support'],
    cons: ['Right-handed layout only', 'Heavy for fast-paced gaming'],
    userReviews: [
      {
        id: 'rev-5',
        author: 'Jordan P.',
        rating: 5,
        date: '2026-05-20',
        title: 'The gold standard of productivity mice',
        comment: 'Fixed my wrist pain after switching. The magnetic wheel is addictive.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-work-2',
    title: 'BenQ ScreenBar Halo Wireless Monitor Light Bar',
    brand: 'BenQ',
    category: 'Work & Ergonomics',
    price: 179,
    rating: 4.8,
    reviewCount: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    badge: 'Eye Comfort',
    description: 'Precision optical desk lamp with back ambient light, wireless rotary controller, and zero screen glare.',
    features: [
      'Patented asymmetrical optical design eliminates screen reflection',
      'Integrated back ambient light balances room contrast to reduce eye fatigue',
      'Wireless precision puck controller with smart brightness sensors',
      'Stepless color temperature tuning (2700K - 6500K)',
      'Fits curved and ultra-wide monitors without clamp strain'
    ],
    specs: {
      'Color Temperature': '2700K - 6500K',
      'Illuminance': 'Center 800 Lux (height 45cm)',
      'CRI': '>95 Ra for true color accuracy',
      'Power Source': 'USB-A (5V/1.5A)'
    },
    inStock: true,
    stockCount: 15,
    fastShipping: true,
    tags: ['lighting', 'desk', 'workspace', 'ergonomics', 'monitor', 'eye-strain', 'remote-work'],
    pros: ['Saves enormous desk space', 'Zero glare on monitor glass', 'Backlight adds relaxing aura'],
    cons: ['Wireless puck requires 3x AAA batteries', 'Premium price tag'],
    userReviews: [
      {
        id: 'rev-6',
        author: 'Chloe T.',
        rating: 5,
        date: '2026-07-29',
        title: 'Cured my late-night coding headaches',
        comment: 'The backlighting alone makes nighttime work so much easier on the eyes.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-work-3',
    title: 'Keychron Q1 Pro Custom Wireless Mechanical Keyboard',
    brand: 'Keychron',
    category: 'Work & Ergonomics',
    price: 199,
    originalPrice: 220,
    discountPercent: 10,
    rating: 4.8,
    reviewCount: 860,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    badge: 'Enthusiast Grade',
    description: '75% layout QMK/VIA custom mechanical keyboard crafted from solid CNC aluminum with double-gasket acoustic dampening.',
    features: [
      'Full CNC machined 6063 aluminum body',
      'Double-gasket acoustic mounting design for deep, cushioned typing sound',
      'QMK & VIA web configurator for unlimited key remapping and macros',
      'Hot-swappable PCB supports 3-pin & 5-pin MX switches',
      'Seamless Bluetooth 5.1 connection with up to 3 devices + Type-C wired'
    ],
    specs: {
      'Layout': '75% (81 keys with Rotary Encoder Knob)',
      'Switches': 'Keychron K Pro Red (Linear / Lubed)',
      'Battery': '4000mAh (Up to 300 hours non-backlit)',
      'Weight': '1750g (Solid CNC Aluminum)'
    },
    inStock: true,
    stockCount: 9,
    fastShipping: false,
    tags: ['keyboard', 'mechanical', 'custom', 'keychron', 'typing', 'developer', 'aluminum'],
    pros: ['Thick marbly sound signature right out of the box', 'Heavy premium aluminum build', 'Mac/Windows switch keycaps included'],
    cons: ['Very heavy (not for traveling)', 'No 2.4GHz USB dongle, Bluetooth only'],
    userReviews: [
      {
        id: 'rev-7',
        author: 'Vikram S.',
        rating: 5,
        date: '2026-08-11',
        title: 'Feels like a $400 custom build',
        comment: 'The lubed switches and double gaskets produce that deep satisfying clack.',
        verified: true
      }
    ]
  },

  // --- Coffee & Culinary ---
  {
    id: 'prod-coffee-1',
    title: 'Fellow Stagg EKG Electric Pour-Over Kettle',
    brand: 'Fellow',
    category: 'Coffee & Culinary',
    price: 165,
    originalPrice: 195,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 4100,
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
    badge: 'Barista Choice',
    description: 'Variable temperature electric kettle with precision gooseneck spout, high-res LCD screen, and built-in brew stopwatch.',
    features: [
      'To-the-degree PID temperature control (135°F to 212°F / 57°C to 100°C)',
      'Precision gooseneck pour spout engineered for optimal flow rate',
      '60-minute temperature HOLD mode keeps water ready',
      'Counterbalanced ergonomic handle for steady, effortless pouring',
      'Quick 1200W heating element boils water rapidly'
    ],
    specs: {
      'Capacity': '0.9 Liters',
      'Power': '1200W, 120V~',
      'Material': '304 stainless steel body, matte finish',
      'Cord Length': '2.5 ft'
    },
    inStock: true,
    stockCount: 22,
    fastShipping: true,
    tags: ['coffee', 'kettle', 'pour-over', 'fellow', 'barista', 'tea', 'kitchen', 'minimalist'],
    pros: ['Pinpoint accurate temperature control', 'Balanced weight distribution', 'Stunning countertop aesthetic'],
    cons: ['Capacity is under 1L (single to double brews)', 'Not dishwasher safe'],
    userReviews: [
      {
        id: 'rev-8',
        author: 'Samantha B.',
        rating: 5,
        date: '2026-06-22',
        title: 'Elevated my morning coffee ritual',
        comment: 'The pour control is magical. Extracts nuanced flavors from light roasts perfectly.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-coffee-2',
    title: 'Baratza Encore ESP Conical Burr Coffee Grinder',
    brand: 'Baratza',
    category: 'Coffee & Culinary',
    price: 199,
    rating: 4.7,
    reviewCount: 2300,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    badge: 'Espresso & Filter',
    description: 'All-around grinder with high-precision M2 burrs, fine micro-steps for espresso and wide macro-steps for French press.',
    features: [
      '40mm European-made conical M2 steel burrs',
      'Dual-range adjustment system: settings 1-20 for espresso, 21-40 for drip/chemex',
      'Anti-static dosing cup with 54mm and 58mm portafilter adapter rings',
      'Simple single-touch pulse button and continuous on/off knob'
    ],
    specs: {
      'Burr Type': '40mm M2 Conical Steel',
      'Grind Range': '200 to 1200 microns',
      'Hopper Capacity': '230g bean capacity',
      'Speed': '550 RPM low-heat operation'
    },
    inStock: true,
    stockCount: 14,
    fastShipping: true,
    tags: ['grinder', 'coffee', 'espresso', 'baratza', 'pour-over', 'burr-grinder'],
    pros: ['Versatile from fine espresso to coarse cold brew', 'Easily replaceable parts for longevity', 'Low retention'],
    cons: ['Slightly noisy compared to commercial grinders', 'Plastic housing'],
    userReviews: [
      {
        id: 'rev-9',
        author: 'Dave G.',
        rating: 5,
        date: '2026-07-11',
        title: 'Best entry-to-intermediate espresso grinder',
        comment: 'Dialed in my espresso machine on setting 14 on day one. Fluffy clumps-free grinds.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-coffee-3',
    title: 'Ember Temperature Control Smart Mug 2 (14 oz)',
    brand: 'Ember',
    category: 'Coffee & Culinary',
    price: 149,
    originalPrice: 179,
    discountPercent: 17,
    rating: 4.6,
    reviewCount: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    badge: 'Smart Living',
    description: 'Maintains your chosen drinking temperature (120°F - 145°F) for up to 80 minutes, or all day on the charging coaster.',
    features: [
      'Keeps beverage hot between 120°F and 145°F (49°C - 62.5°C)',
      'Smart LED indicates when temperature is reached',
      'Auto-sleep sensor wakes upon pouring hot liquid or motion',
      'Ceramic coating is scratch-resistant and hand-washable',
      'Companion iOS/Android app to customize presets and notifications'
    ],
    specs: {
      'Capacity': '14 fl oz (414 ml)',
      'Battery': '80 minutes off coaster, unlimited on coaster',
      'Waterproof': 'IPX7 (fully submersible up to 1 meter)',
      'Finish': 'Matte Ceramic'
    },
    inStock: true,
    stockCount: 28,
    fastShipping: true,
    tags: ['mug', 'ember', 'smart-mug', 'coffee', 'tea', 'desk-gadget', 'gift'],
    pros: ['Every sip is consistently hot from first to last', 'Clean modern design', 'Reliable coaster charging'],
    cons: ['Battery life limited to 80 mins without coaster', 'Hand wash only'],
    userReviews: [
      {
        id: 'rev-10',
        author: 'Rachel W.',
        rating: 5,
        date: '2026-08-05',
        title: 'I cannot drink coffee from a regular mug anymore',
        comment: 'No more microwaving cold coffee during long morning meetings.',
        verified: true
      }
    ]
  },

  // --- Outdoor & Fitness ---
  {
    id: 'prod-fitness-1',
    title: 'Garmin Forerunner 265 GPS Running Smartwatch',
    brand: 'Garmin',
    category: 'Outdoor & Fitness',
    price: 449,
    rating: 4.9,
    reviewCount: 1680,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    badge: 'Runner Top Pick',
    description: 'Brilliant AMOLED touchscreen display, training readiness metrics, multi-band GPS, and up to 13 days of battery life.',
    features: [
      'Vibrant 1.3" AMOLED touch display with physical button backups',
      'Multi-band GNSS with SatIQ technology for superior positioning accuracy',
      'Morning Report provides sleep summary, recovery outlook, and HRV status',
      'Wrist-based running power and running dynamics metrics',
      'Download songs from Spotify, Deezer, or Amazon Music for phone-free listening'
    ],
    specs: {
      'Display': '1.3" AMOLED (416 x 416 px)',
      'Battery Life': 'Up to 13 days in smartwatch mode / 20 hrs GPS',
      'Water Rating': '5 ATM (50 meters)',
      'Weight': '47g'
    },
    inStock: true,
    stockCount: 11,
    fastShipping: true,
    tags: ['garmin', 'running', 'smartwatch', 'gps', 'fitness', 'marathon', 'triathlon'],
    pros: ['Stunning AMOLED screen without sacrificing battery', 'Incredible training metrics and recovery insights', 'Pinpoint accurate GPS tracks'],
    cons: ['Higher price tier', 'No built-in microphone for voice calls'],
    userReviews: [
      {
        id: 'rev-11',
        author: 'Brian K.',
        rating: 5,
        date: '2026-07-14',
        title: 'Helped me PR my half marathon',
        comment: 'The training readiness score kept me from overtraining. Battery easily lasts 10 days with daily GPS runs.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-fitness-2',
    title: 'Theragun Mini (2nd Gen) Portable Massage Gun',
    brand: 'Therabody',
    category: 'Outdoor & Fitness',
    price: 159,
    originalPrice: 199,
    discountPercent: 20,
    rating: 4.7,
    reviewCount: 3890,
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    badge: 'Recovery Essential',
    description: 'Compact, ultra-portable percussive therapy device designed to relieve muscle tension and accelerate recovery anywhere.',
    features: [
      '20% smaller and 30% lighter than previous generation',
      'QuietForce Technology motor delivers deep muscle treatment quietly',
      '3 calibrated speeds (1750, 2100, 2400 PPM) with LED speed indicators',
      'Ergonomic triangle shape allows comfortable grip on hard-to-reach areas',
      'Includes 3 attachment heads: Standard Ball, Dampener, and Thumb'
    ],
    specs: {
      'Amplitude': '12mm deep muscle penetration',
      'Stall Force': '20 lbs resistance',
      'Battery Life': '120 minutes USB-C rechargeable',
      'Weight': '1 lb (450g)'
    },
    inStock: true,
    stockCount: 30,
    fastShipping: true,
    tags: ['theragun', 'massage', 'recovery', 'fitness', 'travel', 'pain-relief', 'wellness'],
    pros: ['Genuinely fits into a gym bag pocket', 'Surprising percussive power for its size', 'Universal USB-C charging'],
    cons: ['Non-swappable battery', 'No Bluetooth app guidance'],
    userReviews: [
      {
        id: 'rev-12',
        author: 'Taylor N.',
        rating: 5,
        date: '2026-06-30',
        title: 'A lifesaver for sore calves and desk back',
        comment: 'Small enough to keep on my desk. Relieves knot tension in 2 minutes.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-fitness-3',
    title: 'Osprey Talon 22 Lightweight Technical Daypack',
    brand: 'Osprey',
    category: 'Outdoor & Fitness',
    price: 160,
    rating: 4.8,
    reviewCount: 1950,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    badge: 'Hiking Favorite',
    description: 'Streamlined multi-sport daypack featuring breathable AirScape suspension, trekking pole attachments, and bio-stretch harness.',
    features: [
      'AirScape backpanel with die-cut foam keeps your back cool and dry',
      'BioStretch harness and continuous-wrap hipbelt for dynamic body movement',
      'External hydration reservoir sleeve with easy hose routing',
      'Stow-on-the-Go trekking pole attachment allows on-the-fly storage',
      'Dual-zippered hipbelt pockets for trail snacks and phone'
    ],
    specs: {
      'Volume': '22 Liters',
      'Weight': '0.9 kg (2.0 lbs)',
      'Dimensions': '51 x 25 x 23 cm',
      'Fabric': 'Bluesign-approved recycled 100D x 210D high-tenacity nylon'
    },
    inStock: true,
    stockCount: 19,
    fastShipping: true,
    tags: ['backpack', 'hiking', 'osprey', 'outdoor', 'daypack', 'camping', 'commute'],
    pros: ['Exceptional weight distribution', 'Back ventilation prevents sweat puddles', 'Osprey All Mighty Lifetime Guarantee'],
    cons: ['Rain cover not included (sold separately)', 'Not water submersible'],
    userReviews: [
      {
        id: 'rev-13',
        author: 'Greg D.',
        rating: 5,
        date: '2026-05-18',
        title: 'The best daypack ever made',
        comment: 'Hiked 14 miles in Yosemite and forgot I was even wearing a pack.',
        verified: true
      }
    ]
  },

  // --- Smart Home & Lifestyle ---
  {
    id: 'prod-smart-1',
    title: 'Roborock Q Revo Self-Washing Robot Vacuum & Mop',
    brand: 'Roborock',
    category: 'Smart Home & Lifestyle',
    price: 679,
    originalPrice: 899,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 2150,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    badge: 'Mega Deal',
    description: 'Multifunctional dock washes dual spinning mops with 45°C warm air drying, auto-empties dust for 7 weeks, and delivers 5500Pa suction.',
    features: [
      'Dual spinning mops rotate at 200 RPM with pressurized scrubbing',
      'Auto-lifting mops (7mm) to keep carpets completely dry during vacuuming',
      'Multifunctional dock: auto-wash, auto-dry, auto-dust empty, auto-refill',
      'Reactive 3D obstacle avoidance and PreciSense LiDAR navigation',
      '5500Pa Extreme Suction removes embedded pet hair and debris'
    ],
    specs: {
      'Suction Power': '5,500 Pa',
      'Dustbag Capacity': '2.7L (Up to 7 weeks)',
      'Water Tanks': '5L Clean / 4.2L Dirty Water',
      'Battery': '5200mAh (Up to 180 min runtime)'
    },
    inStock: true,
    stockCount: 8,
    fastShipping: true,
    tags: ['robot-vacuum', 'mop', 'roborock', 'smart-home', 'cleaning', 'automation', 'pet-friendly'],
    pros: ['True hands-off floor maintenance', 'Warm air mop drying stops mildew smells', 'Smart carpet detection'],
    cons: ['Dock footprint requires some floor space', 'Needs water refill once weekly'],
    userReviews: [
      {
        id: 'rev-14',
        author: 'Jessica H.',
        rating: 5,
        date: '2026-07-25',
        title: 'Saved me 5 hours of chores every week',
        comment: 'With two golden retrievers, this is the single best appliance I have ever bought.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-smart-2',
    title: 'Anker Prime 20,000mAh Power Bank (200W Output)',
    brand: 'Anker',
    category: 'Smart Home & Lifestyle',
    price: 109,
    originalPrice: 129,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 5200,
    imageUrl: 'https://images.unsplash.com/photo-1609592426868-80f4f9f697fc?auto=format&fit=crop&w=800&q=80',
    badge: 'Powerhouse',
    description: 'Fast-charge two laptops simultaneously with up to 100W per port. Real-time smart digital display shows wattage, remaining time, and battery health.',
    features: [
      '200W total output: charge 2 MacBook Pros at 100W each',
      'Ultra-fast 100W input recharges the power bank from 0 to 100% in 1 hour 15 mins',
      'Smart interactive color display monitors battery percentage, port draw, and temps',
      'ActiveShield 2.0 temperature monitoring system checks safety 3M times per day',
      'Compact soda-can size with TSA airline-approved capacity'
    ],
    specs: {
      'Capacity': '20,000 mAh (72 Wh)',
      'Ports': '2x USB-C (100W Max each), 1x USB-A (65W)',
      'Recharge Time': '75 minutes at 100W USB-C',
      'Weight': '540g'
    },
    inStock: true,
    stockCount: 45,
    fastShipping: true,
    tags: ['anker', 'power-bank', 'charger', 'travel', 'usb-c', 'laptop-battery', 'tech-gear'],
    pros: ['Charges a MacBook Pro and iPhone simultaneously at full speed', 'Gorgeous digital status screen', 'Blazing fast recharge speed'],
    cons: ['Heavier than single-phone power banks', 'Requires 100W wall brick for fastest recharging'],
    userReviews: [
      {
        id: 'rev-15',
        author: 'Daniel C.',
        rating: 5,
        date: '2026-08-19',
        title: 'Essential for digital nomads',
        comment: 'Worked from coffee shops all day without plugging into the wall once.',
        verified: true
      }
    ]
  },

  // --- Photography & Creator ---
  {
    id: 'prod-photo-1',
    title: 'DJI Osmo Pocket 3 Creator Combo Gimbal Camera',
    brand: 'DJI',
    category: 'Photography & Creator',
    price: 669,
    rating: 4.9,
    reviewCount: 3120,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    badge: 'Creator Essential',
    description: '1-inch CMOS pocket gimbal camera with 4K/120fps video, 2-inch rotatable OLED screen, full-pixel fast focusing, and DJI Mic 2 transmitter.',
    features: [
      '1-inch CMOS sensor captures rich highlights and pristine low-light details',
      'Rotatable 2-inch touchscreen switches horizontally for YouTube & vertically for Shorts/TikTok',
      '3-axis mechanical gimbal stabilization ensures buttery-smooth walking footage',
      'ActiveTrack 6.0 with face auto-detect and dynamic framing',
      'Includes DJI Mic 2 transmitter for studio-grade wireless audio with noise canceling'
    ],
    specs: {
      'Sensor': '1-inch CMOS',
      'Video Resolution': '4K up to 120fps / 10-bit D-Log M & HLG',
      'Battery': '1300mAh (80% charge in 16 minutes)',
      'Weight': '179g'
    },
    inStock: true,
    stockCount: 7,
    fastShipping: true,
    tags: ['dji', 'camera', 'vlog', 'creator', '4k', 'gimbal', 'youtube', 'content-creation'],
    pros: ['Incredible low-light performance for a pocket device', 'Wireless mic 2 included in combo is crystal clear', 'Starts up in 1 second by rotating screen'],
    cons: ['Not waterproof without diving casing', 'High demand / limited inventory'],
    userReviews: [
      {
        id: 'rev-16',
        author: 'Sophie V.',
        rating: 5,
        date: '2026-08-02',
        title: 'Replaced my heavy mirrorless rig for daily vlogging',
        comment: 'The 1-inch sensor is unreal in low light. The wireless mic pairs instantly.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-photo-2',
    title: 'Peak Design Everyday Backpack 20L (V2)',
    brand: 'Peak Design',
    category: 'Photography & Creator',
    price: 279,
    rating: 4.8,
    reviewCount: 2900,
    imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
    badge: 'Iconic Design',
    description: 'Award-winning everyday and photo carry with dual side access, MagLatch hardware, FlexFold origami dividers, and weatherproof nylon shell.',
    features: [
      'UltraZip weather-resistant zippers with abrasion-resistant thread',
      'MagLatch hardware provides one-handed top access and 3L internal expansion',
      '3 FlexFold origami dividers configure custom compartments for camera lenses or tech gear',
      'Dedicated padded laptop sleeve holds up to 16" MacBook Pro',
      '100% recycled 400D weatherproof nylon canvas shell'
    ],
    specs: {
      'Capacity': '20 Liters (expands to 23L)',
      'Laptop Pocket': '16" MacBook Pro compatible',
      'Weight': '2.01 kg with dividers',
      'Material': 'Weatherproof 400D Double Poly-Coated DWR Nylon'
    },
    inStock: true,
    stockCount: 16,
    fastShipping: true,
    tags: ['backpack', 'peak-design', 'camera-bag', 'laptop-bag', 'photography', 'commute', 'weatherproof'],
    pros: ['Configurable FlexFold dividers protect delicate gear', 'Instant side access to camera without taking pack off', 'Extremely durable shell'],
    cons: ['Empty weight is slightly hefty due to thick structural padding', 'Stiff straps during first week of break-in'],
    userReviews: [
      {
        id: 'rev-17',
        author: 'Chris E.',
        rating: 5,
        date: '2026-07-09',
        title: '6 years of daily commuting and still looks brand new',
        comment: 'Best modular organization system in any backpack on the market.',
        verified: true
      }
    ]
  }
];

export const SHOPPING_MISSIONS: ShoppingMission[] = [
  {
    id: 'mission-desk',
    title: 'Ultimate Remote Work Setup',
    prompt: 'I want to build an ergonomic and aesthetic work-from-home desk setup with mouse, lighting, and keyboard under $500.',
    icon: 'Briefcase',
    category: 'Work & Ergonomics',
    budget: 500,
    badgeText: 'Productivity'
  },
  {
    id: 'mission-coffee',
    title: 'Artisan Barista Starter Kit',
    prompt: 'Help me find the best pour-over coffee setup with a precision temperature kettle and grinder for under $400.',
    icon: 'Coffee',
    category: 'Coffee & Culinary',
    budget: 400,
    badgeText: 'Coffee Ritual'
  },
  {
    id: 'mission-travel',
    title: 'Nomad Tech & Audio Essentials',
    prompt: 'Find me top-rated noise canceling headphones and a fast high-capacity laptop power bank for international travel.',
    icon: 'Plane',
    category: 'Audio & Electronics',
    budget: 500,
    badgeText: 'Travel Ready'
  },
  {
    id: 'mission-vlog',
    title: 'Content Creator Setup',
    prompt: 'I want to start a 4K vlog/video channel. Recommend the best compact stabilized camera and weatherproof gear bag.',
    icon: 'Camera',
    category: 'Photography & Creator',
    budget: 1000,
    badgeText: 'Creator Pack'
  },
  {
    id: 'mission-fitness',
    title: 'Marathon & Recovery Kit',
    prompt: 'Recommend fitness gear for marathon training including a multi-band GPS running watch and a deep muscle massage gun.',
    icon: 'Activity',
    category: 'Outdoor & Fitness',
    budget: 650,
    badgeText: 'Athletic Edge'
  },
  {
    id: 'mission-smart',
    title: 'Hands-Free Smart Clean',
    prompt: 'Find me a high-end robot vacuum with automated mopping and self-emptying dock on sale.',
    icon: 'Sparkles',
    category: 'Smart Home & Lifestyle',
    budget: 750,
    badgeText: 'Smart Home'
  }
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'SKILLSLAB20',
    discountPercentage: 20,
    minSpend: 150,
    description: '20% off orders over $150 (Google Skills Lab Special)'
  },
  {
    code: 'GEMINI15',
    discountPercentage: 15,
    minSpend: 80,
    description: '15% off orders over $80'
  },
  {
    code: 'FREESHIP',
    discountPercentage: 5,
    minSpend: 50,
    description: '5% bonus off + Free Express Shipping'
  }
];
