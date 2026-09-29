
import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Camera, 
  Landmark, 
  User,
  Warehouse,
  BarChart3
} from 'lucide-react';
import { Screen, MarketplaceItem, ColdStorage, Language } from './types';

export const COLORS = {
  oceanBlue: '#0066CC',
  growthGreen: '#00A86B',
  coralAlert: '#FF6B35',
  darkText: '#1A1A1A',
  lightBG: '#F5F8FA',
};

export const NAV_ITEMS = [
  { id: Screen.DASHBOARD, label: 'Home', icon: <LayoutDashboard size={24} /> },
  { id: Screen.MARKETPLACE, label: 'Market', icon: <ShoppingBag size={24} /> },
  { id: Screen.DISEASE, label: 'Detect', icon: <Camera size={24} /> },
  { id: Screen.SCHEMES, label: 'Schemes', icon: <Landmark size={24} /> },
  { id: Screen.PROFILE, label: 'Profile', icon: <User size={24} /> },
];

export const TRANSLATIONS: any = {
  en: {
    home: "Home",
    market: "Market",
    detect: "Detect",
    storage: "Storage",
    schemes: "Gov Hub",
    profile: "Profile",
    analytics: "Analytics",
    health_index: "Pond Health Index",
    excellent: "EXCELLENT CONDITION",
    quick_actions: "QUICK ACTIONS",
    add_feeding: "Add Feeding",
    water_test: "Water Test",
    harvesting: "Harvesting",
    expenses: "Expenses",
    temp: "Temperature",
    ph: "pH Level",
    oxygen: "Oxygen",
    ammonia: "Ammonia",
    aeration_needed: "Evening Aeration Needed",
    view_history: "VIEW HISTORY",
    your_farm: "YOUR FARM",
    logout: "LOGOUT SESSION",
    settings: "Farm Settings",
    language: "Language",
    sign_out: "SIGN OUT FROM FARM"
  },
  hi: {
    home: "होम",
    market: "बाज़ार",
    detect: "जांच",
    storage: "स्टोरेज",
    schemes: "सरकारी योजनाएं",
    profile: "प्रोफ़ाइल",
    analytics: "विश्लेषण",
    health_index: "तालाब स्वास्थ्य सूचकांक",
    excellent: "उत्कृष्ट स्थिति",
    quick_actions: "त्वरित कार्रवाई",
    add_feeding: "चारा डालें",
    water_test: "पानी की जांच",
    harvesting: "कटाई",
    expenses: "खर्च",
    temp: "तापमान",
    ph: "pH स्तर",
    oxygen: "ऑक्सीजन",
    ammonia: "अमोनिया",
    aeration_needed: "शाम को वातन की आवश्यकता",
    view_history: "इतिहास देखें",
    your_farm: "आपका फार्म",
    logout: "लॉगआउट",
    settings: "फार्म सेटिंग्स",
    language: "भाषा",
    sign_out: "फार्म से बाहर निकलें"
  }
};

export const MOCK_MARKETPLACE: MarketplaceItem[] = [
  // --- FEEDS (5 Items) ---
  { 
    id: 'f1', 
    name: 'Skretting Optiline Floating Feed', 
    category: 'FEED', 
    price: 1850, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1518013391915-e443594b9bcd?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'f2', 
    name: 'Cargill AquaGrow Sinking Pellets', 
    category: 'FEED', 
    price: 1420, 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1590250005740-454746f36214?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'f3', 
    name: 'High-Protein Carp Starter Crumble', 
    category: 'FEED', 
    price: 1600, 
    rating: 4.6, 
    image: 'https://images.unsplash.com/photo-1626262323028-617f0bd06bb2?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'f4', 
    name: 'Organic Kelp Growth Supplement', 
    category: 'FEED', 
    price: 780, 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1545167622-3a6ac756aff4?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'f5', 
    name: 'CP Prima Tilapia Grower Feed', 
    category: 'FEED', 
    price: 1950, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400' 
  },

  // --- MEDICINES & BIOTICS (6 Items) ---
  { 
    id: 'm1', 
    name: 'Gut-Pro Bio-Biotics Pellets', 
    category: 'MEDICINE', 
    price: 950, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'm2', 
    name: 'Soil-Master Probiotic Powder', 
    category: 'MEDICINE', 
    price: 1450, 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f159f96d?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'm3', 
    name: 'Nitro-Clean Nitrifying Bacteria', 
    category: 'MEDICINE', 
    price: 1100, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1579165466541-71e2247fb1c5?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'm4', 
    name: 'Aqua-Bond Bio-Probiotic Booster', 
    category: 'MEDICINE', 
    price: 1250, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'm5', 
    name: 'BKC-80 Disinfectant Solution', 
    category: 'MEDICINE', 
    price: 2100, 
    rating: 4.5, 
    image: 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'm6', 
    name: 'Paracid Anti-Parasite Treatment', 
    category: 'MEDICINE', 
    price: 890, 
    rating: 4.4, 
    image: 'https://images.unsplash.com/photo-1584017947486-5c9c36693556?auto=format&fit=crop&q=80&w=400' 
  },

  // --- EQUIPMENT (6 Items) ---
  { 
    id: 'e1', 
    name: 'Heavy-Duty 2HP Paddlewheel Aerator', 
    category: 'EQUIPMENT', 
    price: 15400, 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'e2', 
    name: 'Precision DO Meter V4 (Digital)', 
    category: 'EQUIPMENT', 
    price: 8500, 
    rating: 5.0, 
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'e3', 
    name: 'Solar Powered Smart Aerator', 
    category: 'EQUIPMENT', 
    price: 24500, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'e4', 
    name: 'Automatic Fish Feeder (Timer)', 
    category: 'EQUIPMENT', 
    price: 5200, 
    rating: 4.5, 
    image: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'e5', 
    name: 'Water Quality Testing Kit (Digital)', 
    category: 'EQUIPMENT', 
    price: 4200, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1582719201913-b4f70a776c1a?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 'e6', 
    name: 'Submersible High-Flow Water Pump', 
    category: 'EQUIPMENT', 
    price: 7800, 
    rating: 4.6, 
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400' 
  },

  // --- SEEDS (3 Items) ---
  { 
    id: 's1', 
    name: 'Premium SPF Shrimp Seeds (PL-20)', 
    category: 'SEEDS', 
    price: 4500, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 's2', 
    name: 'Indian Major Carp Seed Mix', 
    category: 'SEEDS', 
    price: 3200, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1524704685771-adad009cda1f?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: 's3', 
    name: 'GIFT Tilapia Fingerlings (Genetics)', 
    category: 'SEEDS', 
    price: 5600, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=400' 
  },
];

export const MOCK_COLD_STORAGE: ColdStorage[] = [
  { 
    id: '1', 
    name: 'Coastal Bengal Cold Chain (CBCC)', 
    distance: '1.2km', 
    capacity: '200 MT', 
    pricePerDay: 40, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: '2', 
    name: 'Sunrise Arctic Logistics', 
    distance: '5.8km', 
    capacity: '500 MT', 
    pricePerDay: 35, 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1532634896-26909d0d4b89?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: '3', 
    name: 'Midnapore Harvest Hub (Deep Freeze)', 
    distance: '12km', 
    capacity: '150 MT', 
    pricePerDay: 45, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1589793907316-f94025b46850?auto=format&fit=crop&q=80&w=400' 
  },
];
