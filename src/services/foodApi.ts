/**
 * Service for interacting with the Open Food Facts API
 * With built-in fallback for common Indian food items
 */

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens: string;
  productName: string;
}

// Simple local cache
const cache: Record<string, NutritionData> = {};

// Built-in nutrition database for common food items (per 100g)
const LOCAL_DB: Record<string, NutritionData> = {
  'bread': { productName: 'Bread', calories: 265, protein: 9, carbs: 49, fat: 3.2, allergens: 'Gluten, Wheat' },
  'wheat bread': { productName: 'Wheat Bread', calories: 247, protein: 13, carbs: 41, fat: 3.4, allergens: 'Gluten, Wheat' },
  'rice': { productName: 'Cooked Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, allergens: 'None reported' },
  'biryani': { productName: 'Biryani', calories: 250, protein: 8.4, carbs: 32, fat: 10, allergens: 'None reported' },
  'dal': { productName: 'Dal (Lentil Soup)', calories: 116, protein: 9, carbs: 20, fat: 0.4, allergens: 'None reported' },
  'chapati': { productName: 'Chapati / Roti', calories: 120, protein: 3.5, carbs: 18, fat: 3.7, allergens: 'Gluten, Wheat' },
  'roti': { productName: 'Roti', calories: 120, protein: 3.5, carbs: 18, fat: 3.7, allergens: 'Gluten, Wheat' },
  'idli': { productName: 'Idli', calories: 39, protein: 2, carbs: 8, fat: 0.1, allergens: 'None reported' },
  'dosa': { productName: 'Dosa', calories: 133, protein: 4, carbs: 18, fat: 5, allergens: 'None reported' },
  'sambar': { productName: 'Sambar', calories: 65, protein: 3, carbs: 9, fat: 1.5, allergens: 'None reported' },
  'paneer': { productName: 'Paneer', calories: 265, protein: 18, carbs: 1.2, fat: 21, allergens: 'Milk' },
  'paneer tikka': { productName: 'Paneer Tikka', calories: 290, protein: 16, carbs: 8, fat: 22, allergens: 'Milk' },
  'curd': { productName: 'Curd / Yogurt', calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, allergens: 'Milk' },
  'pasta': { productName: 'Pasta', calories: 131, protein: 5, carbs: 25, fat: 1.1, allergens: 'Gluten, Wheat' },
  'pizza': { productName: 'Pizza', calories: 266, protein: 11, carbs: 33, fat: 10, allergens: 'Gluten, Wheat, Milk' },
  'burger': { productName: 'Burger', calories: 295, protein: 17, carbs: 24, fat: 14, allergens: 'Gluten, Wheat' },
  'sandwich': { productName: 'Sandwich', calories: 250, protein: 9, carbs: 28, fat: 11, allergens: 'Gluten, Wheat' },
  'cake': { productName: 'Cake', calories: 350, protein: 5, carbs: 50, fat: 15, allergens: 'Gluten, Wheat, Eggs, Milk' },
  'cookie': { productName: 'Cookies', calories: 400, protein: 5, carbs: 60, fat: 16, allergens: 'Gluten, Wheat, Eggs' },
  'biscuit': { productName: 'Biscuits', calories: 353, protein: 6.7, carbs: 68, fat: 8.1, allergens: 'Gluten, Wheat' },
  'milk': { productName: 'Milk', calories: 42, protein: 3.4, carbs: 5, fat: 1, allergens: 'Milk' },
  'egg': { productName: 'Boiled Egg', calories: 155, protein: 13, carbs: 1.1, fat: 11, allergens: 'Eggs' },
  'chicken': { productName: 'Chicken (Cooked)', calories: 239, protein: 27, carbs: 0, fat: 14, allergens: 'None reported' },
  'fruit': { productName: 'Mixed Fruits', calories: 52, protein: 0.7, carbs: 14, fat: 0.2, allergens: 'None reported' },
  'apple': { productName: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, allergens: 'None reported' },
  'banana': { productName: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, allergens: 'None reported' },
  'salad': { productName: 'Mixed Salad', calories: 20, protein: 1.5, carbs: 3.6, fat: 0.2, allergens: 'None reported' },
  'soup': { productName: 'Vegetable Soup', calories: 45, protein: 1.6, carbs: 7, fat: 1.2, allergens: 'None reported' },
  'noodles': { productName: 'Noodles', calories: 138, protein: 4.5, carbs: 25, fat: 2, allergens: 'Gluten, Wheat' },
  'maggi': { productName: 'Maggi Noodles', calories: 205, protein: 4.4, carbs: 26.5, fat: 9, allergens: 'Gluten, Wheat' },
  'poha': { productName: 'Poha', calories: 110, protein: 2.5, carbs: 22, fat: 1.5, allergens: 'None reported' },
  'upma': { productName: 'Upma', calories: 140, protein: 3.5, carbs: 20, fat: 5, allergens: 'Gluten, Wheat' },
  'puri': { productName: 'Puri', calories: 230, protein: 4, carbs: 28, fat: 12, allergens: 'Gluten, Wheat' },
  'samosa': { productName: 'Samosa', calories: 262, protein: 4.3, carbs: 24, fat: 17, allergens: 'Gluten, Wheat' },
  'vada': { productName: 'Medu Vada', calories: 179, protein: 7, carbs: 15, fat: 10, allergens: 'None reported' },
  'pastry': { productName: 'Pastry', calories: 320, protein: 4, carbs: 40, fat: 16, allergens: 'Gluten, Wheat, Eggs, Milk' },
  'pastries': { productName: 'Assorted Pastries', calories: 320, protein: 4, carbs: 40, fat: 16, allergens: 'Gluten, Wheat, Eggs, Milk' },
  'bun': { productName: 'Bun', calories: 310, protein: 8, carbs: 55, fat: 6, allergens: 'Gluten, Wheat' },
  'meals': { productName: 'Prepared Meals', calories: 200, protein: 10, carbs: 28, fat: 6, allergens: 'Varies' },
  'pulao': { productName: 'Vegetable Pulao', calories: 170, protein: 3.5, carbs: 30, fat: 4, allergens: 'None reported' },
  'chole': { productName: 'Chole (Chickpea Curry)', calories: 180, protein: 9, carbs: 27, fat: 5, allergens: 'None reported' },
  'rajma': { productName: 'Rajma (Kidney Bean Curry)', calories: 140, protein: 8, carbs: 22, fat: 2.5, allergens: 'None reported' },
  'paratha': { productName: 'Paratha', calories: 260, protein: 5, carbs: 30, fat: 13, allergens: 'Gluten, Wheat' },
};

/**
 * Searches for a food item and returns its nutritional data.
 * Tries Open Food Facts API first, falls back to local database.
 */
export const searchFood = async (foodName: string): Promise<NutritionData | null> => {
  const query = foodName.trim().toLowerCase();
  
  if (!query) return null;
  
  // Check cache
  if (cache[query]) {
    return cache[query];
  }

  // 1. Try the Open Food Facts API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
        const product = data.products[0];
        const nutriments = product.nutriments || {};
        
        const parsedData: NutritionData = {
          productName: product.product_name || foodName,
          calories: nutriments['energy-kcal'] || nutriments['energy-kcal_100g'] || 0,
          protein: nutriments.proteins || nutriments.proteins_100g || 0,
          carbs: nutriments.carbohydrates || nutriments.carbohydrates_100g || 0,
          fat: nutriments.fat || nutriments.fat_100g || 0,
          allergens: product.allergens_from_ingredients || product.allergens || 'None reported',
        };

        cache[query] = parsedData;
        return parsedData;
      }
    }
  } catch (error) {
    console.warn('Open Food Facts API unavailable, using local database:', error);
  }

  // 2. Fallback to local database
  // Try exact match first
  if (LOCAL_DB[query]) {
    cache[query] = LOCAL_DB[query];
    return LOCAL_DB[query];
  }

  // Try partial match (e.g., "chicken biryani" matches "biryani")
  for (const [key, data] of Object.entries(LOCAL_DB)) {
    if (query.includes(key) || key.includes(query)) {
      const result = { ...data, productName: foodName };
      cache[query] = result;
      return result;
    }
  }

  return null;
};
