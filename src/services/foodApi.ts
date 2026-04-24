/**
 * Service for interacting with the Open Food Facts API
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

/**
 * Searches for a food item and returns its nutritional data
 */
export const searchFood = async (foodName: string): Promise<NutritionData | null> => {
  const query = foodName.trim().toLowerCase();
  
  if (!query) return null;
  
  // Check cache
  if (cache[query]) {
    return cache[query];
  }

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    
    if (!data.products || data.products.length === 0) {
      return null;
    }

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

    // Store in cache
    cache[query] = parsedData;
    
    return parsedData;
  } catch (error) {
    console.error('Error searching food:', error);
    return null;
  }
};
