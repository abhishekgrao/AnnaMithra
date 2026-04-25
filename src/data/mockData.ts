export interface FoodItem {
  id: string;
  name: string;
  type: string;
  quantity: string;
  distance: string;
  expiry: string;
  donor: string;
  urgencyScore: number;
  urgencyLevel: 'high' | 'medium' | 'low';
  urgencyLabel: string;
  verified: boolean;
  demand: string;
  latitude: number;
  longitude: number;
  distributionType: 'sell' | 'donate' | 'both';
  foodType?: string;
  preparedAt?: string;
  storageTempType?: string;
  currentTemp?: string;
  packagingType?: string;
  storageEnv?: string;
  maxSafeDuration?: string;
  remainingSafeTime?: string;
  safetyBuffer?: string;
  transportFeasible?: string;
  vendorTrustScore?: number;
  pastAccuracyScore?: number;
}

export const MOCK_FOOD_ITEMS: FoodItem[] = [
  {
    id: '1', name: 'KFC Fried Chicken Bucket', type: 'Fast Food',
    quantity: '15 pieces', distance: '0.8 km', expiry: '30 mins',
    donor: 'KFC', urgencyScore: 95, urgencyLevel: 'high',
    urgencyLabel: '⚡ High Priority - 30 min', verified: true, demand: 'Very High',
    latitude: 12.3260, longitude: 76.6127,
    distributionType: 'sell',
    foodType: 'Deep Fried Meat (TCS Food)', preparedAt: '20:30',
    storageTempType: 'Ambient / Cooling', currentTemp: '42°C (Danger Zone)',
    packagingType: 'Vented Cardboard Bucket', storageEnv: 'Countertop',
    maxSafeDuration: '4 hrs', remainingSafeTime: '30 mins', safetyBuffer: '0 mins',
    transportFeasible: '⚠️ MARGINAL', vendorTrustScore: 88, pastAccuracyScore: 95
  },
  {
    id: '2', name: 'Veg Dum Biryani', type: 'Main Course',
    quantity: '10 portions', distance: '1.2 km', expiry: '4 hours',
    donor: 'Taj Hotel', urgencyScore: 60, urgencyLevel: 'medium',
    urgencyLabel: '⏰ Medium - 4 hr', verified: true, demand: 'High',
    latitude: 12.3346, longitude: 76.5619,
    distributionType: 'both',
    foodType: 'Mixed Cooked Rice & Veg', preparedAt: '22:00',
    storageTempType: 'Heated', currentTemp: '65°C',
    packagingType: 'Sealed Alum Containers', storageEnv: 'Warming Cabinet',
    maxSafeDuration: '6+ hrs', remainingSafeTime: '4 hrs', safetyBuffer: '-30 mins',
    transportFeasible: '✅ YES', vendorTrustScore: 98, pastAccuracyScore: 99
  },
  {
    id: '3', name: 'Masala Dosa & Sambar', type: 'South Indian',
    quantity: '5 portions', distance: '2.5 km', expiry: '1 hour',
    donor: 'MTR (Mavalli Tiffin Room)', urgencyScore: 85, urgencyLevel: 'high',
    urgencyLabel: '⚡ High Priority - 1 hr', verified: false, demand: 'Medium',
    latitude: 12.3213, longitude: 76.6183,
    distributionType: 'donate',
    foodType: 'Fermented Batter Crepe & Stew', preparedAt: '21:30',
    storageTempType: 'Mixed (Dosa/Sambar)', currentTemp: 'Sambar 68°C / Dosa 32°C',
    packagingType: 'Foil Wraps & Plastic Tubs', storageEnv: 'Prep Table',
    maxSafeDuration: '4 hrs', remainingSafeTime: '1 hr 30 mins', safetyBuffer: '-30 mins',
    transportFeasible: '✅ YES', vendorTrustScore: 95, pastAccuracyScore: 92
  },
  {
    id: '4', name: 'McDonald\'s Happy Meals', type: 'Fast Food',
    quantity: '3 meals', distance: '3.1 km', expiry: '5 hours',
    donor: 'McDonald\'s', urgencyScore: 30, urgencyLevel: 'low',
    urgencyLabel: '✅ Low Priority - 5 hr', verified: true, demand: 'Low',
    latitude: 12.3382, longitude: 76.6019,
    distributionType: 'donate',
    foodType: 'Burgers & Fries', preparedAt: '23:00',
    storageTempType: 'Chilled', currentTemp: '4°C',
    packagingType: 'Paper Bags & Cardboard', storageEnv: 'Walk-in Fridge',
    maxSafeDuration: '2-3 days', remainingSafeTime: '6 hrs', safetyBuffer: '-1 hr',
    transportFeasible: '✅ YES', vendorTrustScore: 85, pastAccuracyScore: 89
  },
  {
    id: '5', name: 'Paneer Butter Masala', type: 'North Indian',
    quantity: '20 portions', distance: '0.4 km', expiry: '45 mins',
    donor: 'Haldiram\'s', urgencyScore: 92, urgencyLevel: 'high',
    urgencyLabel: '⚡ High Priority - 45 min', verified: true, demand: 'Very High',
    latitude: 12.3232, longitude: 76.6278,
    distributionType: 'sell',
    foodType: 'Dairy-Based Gravy (High Risk)', preparedAt: '20:45',
    storageTempType: 'Cooling / Ambient', currentTemp: '48°C (Danger Zone)',
    packagingType: 'Sealed Plastic Tubs', storageEnv: 'Countertop',
    maxSafeDuration: '4 hrs', remainingSafeTime: '45 mins', safetyBuffer: '0 mins',
    transportFeasible: '✅ YES (Barely)', vendorTrustScore: 92, pastAccuracyScore: 94
  },
  {
    id: '6', name: 'Chole Bhature', type: 'North Indian',
    quantity: '8 portions', distance: '1.8 km', expiry: '8 hours',
    donor: 'Bikanerwala', urgencyScore: 20, urgencyLevel: 'low',
    urgencyLabel: '✅ Low Priority - 8 hr', verified: true, demand: 'Moderate',
    latitude: 12.3421, longitude: 76.6312,
    distributionType: 'donate',
    foodType: 'Spiced Chickpeas & Fried Bread', preparedAt: '18:00',
    storageTempType: 'Ambient', currentTemp: '28°C',
    packagingType: 'Paper Wraps', storageEnv: 'Shelving',
    maxSafeDuration: '12 hrs', remainingSafeTime: '8 hrs', safetyBuffer: '-2 hrs',
    transportFeasible: '✅ YES', vendorTrustScore: 89, pastAccuracyScore: 93
  },
  {
    id: '7', name: 'Fresh Fruit Platters', type: 'Healthy',
    quantity: '12 platters', distance: '1.5 km', expiry: '2 hours',
    donor: 'Fruit Shop', urgencyScore: 45, urgencyLevel: 'medium',
    urgencyLabel: '⏰ Medium - 2 hr', verified: false, demand: 'High',
    latitude: 12.3150, longitude: 76.5912,
    distributionType: 'sell',
    foodType: 'Cut Mixed Fruits', preparedAt: '23:30',
    storageTempType: 'Chilled', currentTemp: '8°C',
    packagingType: 'Clamshell Containers', storageEnv: 'Display Cooler',
    maxSafeDuration: '6 hrs', remainingSafeTime: '2 hrs', safetyBuffer: '-1 hr 15m',
    transportFeasible: '✅ YES', vendorTrustScore: 97, pastAccuracyScore: 96
  },
  {
    id: '8', name: 'South Indian + Continental mains', type: 'Luxury Dining',
    quantity: '~30 plates', distance: '2.3 km', expiry: '1 hour',
    donor: 'Grand Mercure', urgencyScore: 75, urgencyLevel: 'high',
    urgencyLabel: '⚡ High Priority - 1 hr', verified: true, demand: 'High',
    latitude: 12.295921, longitude: 76.639982,
    distributionType: 'donate',
    foodType: 'Mixed Cuisine (Pasta/Curry)', preparedAt: '21:15',
    storageTempType: 'Cooling', currentTemp: '55°C (Danger Zone)',
    packagingType: 'Commercial Food Pans', storageEnv: 'Kitchen Staging',
    maxSafeDuration: '4 hrs', remainingSafeTime: '1 hr 30 mins', safetyBuffer: '-30 mins',
    transportFeasible: '✅ YES', vendorTrustScore: 94, pastAccuracyScore: 91
  },
  {
    id: '9', name: 'Chicken Kebab & Ghee Rice', type: 'Main Course',
    quantity: '12 portions', distance: '1.4 km', expiry: '2 hours',
    donor: 'Empire Restaurant', urgencyScore: 70, urgencyLevel: 'medium',
    urgencyLabel: '⏰ Medium - 2 hr', verified: true, demand: 'High',
    latitude: 12.3312, longitude: 76.6145,
    distributionType: 'sell',
    foodType: 'Fried Chicken & Rice', preparedAt: '21:30',
    storageTempType: 'Heated', currentTemp: '62°C',
    packagingType: 'Aluminium Trays', storageEnv: 'Hot Box',
    maxSafeDuration: '4 hrs', remainingSafeTime: '2 hrs', safetyBuffer: '0 mins',
    transportFeasible: '✅ YES', vendorTrustScore: 96, pastAccuracyScore: 94
  },
  {
    id: '10', name: 'Italian Pasta Selection', type: 'Continental',
    quantity: '8 portions', distance: '2.1 km', expiry: '1.5 hours',
    donor: 'Loyal World', urgencyScore: 80, urgencyLevel: 'high',
    urgencyLabel: '⚡ High Priority - 1.5 hr', verified: true, demand: 'Medium',
    latitude: 12.3245, longitude: 76.6412,
    distributionType: 'sell',
    foodType: 'Pasta in Creamy Sauce', preparedAt: '22:00',
    storageTempType: 'Heated', currentTemp: '60°C',
    packagingType: 'Plastic Containers', storageEnv: 'Display Warming',
    maxSafeDuration: '3 hrs', remainingSafeTime: '1.5 hrs', safetyBuffer: '-15 mins',
    transportFeasible: '✅ YES', vendorTrustScore: 91, pastAccuracyScore: 90
  },
  {
    id: '11', name: 'Fruit Bun & Wheat Bread', type: 'Bakery',
    quantity: '20 packs', distance: '3.5 km', expiry: '2 days',
    donor: 'Vishal Mega Mart', urgencyScore: 25, urgencyLevel: 'low',
    urgencyLabel: '✅ Low Priority - 2 days', verified: true, demand: 'High',
    latitude: 12.3412, longitude: 76.5812,
    distributionType: 'sell',
    foodType: 'Packaged Bread', preparedAt: '10:00',
    storageTempType: 'Ambient', currentTemp: '24°C',
    packagingType: 'Plastic Wraps', storageEnv: 'Aisle Shelving',
    maxSafeDuration: '4 days', remainingSafeTime: '2 days', safetyBuffer: '-1 day',
    transportFeasible: '✅ YES', vendorTrustScore: 88, pastAccuracyScore: 95
  },
  {
    id: '12', name: 'Britannia Bread', type: 'Bakery',
    quantity: '50 packs', distance: '0.5 km', expiry: '3 days',
    donor: 'shop', urgencyScore: 50, urgencyLevel: 'medium',
    urgencyLabel: '⏰ Medium - 3 days', verified: true, demand: 'High',
    latitude: 12.3282, longitude: 76.6012,
    distributionType: 'sell',
    foodType: 'Packaged Sliced Bread', preparedAt: '09:00',
    storageTempType: 'Ambient', currentTemp: '24°C',
    packagingType: 'Plastic Wraps', storageEnv: 'Storage Rack',
    maxSafeDuration: '5 days', remainingSafeTime: '3 days', safetyBuffer: '-1 day',
    transportFeasible: '✅ YES', vendorTrustScore: 92, pastAccuracyScore: 96
  },
  {
    id: '13', name: 'Vada Pav & Garlic Bread', type: 'Fast Food',
    quantity: '15 items', distance: '1.7 km', expiry: '1 hour',
    donor: 'King\'s Coffee', urgencyScore: 88, urgencyLevel: 'high',
    urgencyLabel: '⚡ High Priority - 1 hr', verified: true, demand: 'High',
    latitude: 12.3182, longitude: 76.6212,
    distributionType: 'sell',
    foodType: 'Buns & Potato Fritters', preparedAt: '22:15',
    storageTempType: 'Ambient', currentTemp: '28°C',
    packagingType: 'Paper Bags', storageEnv: 'Counter',
    maxSafeDuration: '3 hrs', remainingSafeTime: '1 hr', safetyBuffer: '0 mins',
    transportFeasible: '✅ YES', vendorTrustScore: 94, pastAccuracyScore: 92
  },
  {
    id: '14', name: 'Buffet surplus (rice, curries, desserts)', type: 'Main Course',
    quantity: '~40 servings', distance: '1.8 km', expiry: '45 mins',
    donor: 'Radisson Blu Plaza', urgencyScore: 96, urgencyLevel: 'high',
    urgencyLabel: '⚡ High Priority - 45 min', verified: true, demand: 'Very High',
    latitude: 12.299551, longitude: 76.664234,
    distributionType: 'sell',
    foodType: 'Mixed Buffet (Rice/Gravies)', preparedAt: '20:00',
    storageTempType: 'Heated', currentTemp: '62°C',
    packagingType: 'Buffet Trays / Foils', storageEnv: 'Bain-marie (Hot)',
    maxSafeDuration: '6 hrs', remainingSafeTime: '2 hrs', safetyBuffer: '-1 hr 15m',
    transportFeasible: '✅ YES', vendorTrustScore: 97, pastAccuracyScore: 96
  }
];
