import { StoredUserAccount, UserProfile } from '../types/user';
import { Ingredient, BasePrice } from '../types/ingredient';

const KEYS = {
  ACTIVE_SESSION: 'pantryverdict_active_session',
  USERS_DB: 'pantryverdict_users_db',
  FAVORITES: 'pantryverdict_favorites',
  CUSTOM_PRICES: 'pantryverdict_custom_prices',
  SAVED_BOARDS: 'pantryverdict_saved_boards',
};

// Numeric input clamping
export function clampPriceInput(val: string | number): number {
  const numeric = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(numeric) || numeric <= 0) return 0;
  return Math.min(Math.max(numeric, 0.01), 100000);
}

export function clampVolumeInput(val: string | number): number {
  const numeric = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(numeric) || numeric <= 0) return 500;
  return Math.min(Math.max(numeric, 1), 50000);
}

// Session Storage
export function loadActiveSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(KEYS.ACTIVE_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to parse active session', e);
    return null;
  }
}

export function saveActiveSession(profile: UserProfile | null): void {
  try {
    if (profile) {
      localStorage.setItem(KEYS.ACTIVE_SESSION, JSON.stringify(profile));
    } else {
      localStorage.removeItem(KEYS.ACTIVE_SESSION);
    }
  } catch (e) {
    console.error('Failed to save active session', e);
  }
}

// User Database
export function loadAllUsers(): StoredUserAccount[] {
  try {
    const raw = localStorage.getItem(KEYS.USERS_DB);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUserAccount(account: StoredUserAccount): void {
  try {
    const users = loadAllUsers().filter(u => u.email.toLowerCase() !== account.email.toLowerCase());
    users.push(account);
    localStorage.setItem(KEYS.USERS_DB, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save user account', e);
  }
}

// Favorites ("My Pantry")
export function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : ['oil-evoo-cold-pressed', 'ghee-a2-desi-cow-bilona', 'flour-chakki-whole-wheat-atta'];
  } catch {
    return ['oil-evoo-cold-pressed', 'ghee-a2-desi-cow-bilona'];
  }
}

export function saveFavorites(favs: string[]): void {
  try {
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favs));
  } catch (e) {
    console.error('Failed to save favorites', e);
  }
}

// Custom Local Prices
export function loadCustomPrices(): Record<string, BasePrice> {
  try {
    const raw = localStorage.getItem(KEYS.CUSTOM_PRICES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCustomPrices(prices: Record<string, BasePrice>): void {
  try {
    localStorage.setItem(KEYS.CUSTOM_PRICES, JSON.stringify(prices));
  } catch (e) {
    console.error('Failed to save custom prices', e);
  }
}

// Export Matrix to CSV
export function exportComparisonToCSV(ingredients: Ingredient[], customPrices: Record<string, BasePrice>): void {
  if (ingredients.length === 0) return;

  const headers = [
    'Attribute',
    ...ingredients.map(i => `"${i.name.replace(/"/g, '""')}"`),
  ];

  const rows: string[][] = [
    ['Category', ...ingredients.map(i => i.category)],
    ['Brand', ...ingredients.map(i => i.brand || 'Artisanal / Generic')],
    ['Extraction Method', ...ingredients.map(i => i.extractionMethod)],
    ['Nutri-Score', ...ingredients.map(i => i.nutriscore)],
    ['NOVA Processing Group', ...ingredients.map(i => `Group ${i.novaGroup}`)],
    ['Smoke Point (°C)', ...ingredients.map(i => i.smokePoint ? `${i.smokePoint.celsius}°C (${i.smokePoint.fahrenheit}°F)` : 'N/A')],
    ['Ideal Cooking Usage', ...ingredients.map(i => i.smokePoint?.recommendedUsage || 'General Cooking')],
    ['Calories (kcal / 100g/ml)', ...ingredients.map(i => (i.nutriments?.calories ?? 0).toString())],
    ['Total Fat (g)', ...ingredients.map(i => (i.nutriments?.totalFat ?? 0).toString())],
    ['Saturated Fat (g)', ...ingredients.map(i => (i.nutriments?.saturatedFat ?? 0).toString())],
    ['Monounsaturated Fat (g)', ...ingredients.map(i => (i.nutriments?.monounsaturatedFat ?? 'N/A').toString())],
    ['Polyunsaturated Fat (g)', ...ingredients.map(i => (i.nutriments?.polyunsaturatedFat ?? 'N/A').toString())],
    ['Protein (g)', ...ingredients.map(i => (i.nutriments?.protein ?? 0).toString())],
    ['Fiber (g)', ...ingredients.map(i => (i.nutriments?.fiber ?? 0).toString())],
    ['Sodium (mg)', ...ingredients.map(i => (i.nutriments?.sodium ?? 0).toString())],
    ['Sugars (g)', ...ingredients.map(i => (i.nutriments?.sugars ?? 0).toString())],
    ['Clean Label (Zero Additives)', ...ingredients.map(i => i.cleanLabel ? 'YES' : 'NO')],
    ['Additives', ...ingredients.map(i => (i.additives || []).length > 0 ? `"${(i.additives || []).join(', ')}"` : 'None')],
    ['Current Store Price', ...ingredients.map(i => {
      const price = customPrices?.[i.id] || i.basePrice || { currency: '₹', amount: 100, unitQuantity: 1000, unitType: 'g' };
      return `"${price.currency}${price.amount} for ${price.unitQuantity}${price.unitType}"`;
    })],
    ['True Cost per 100g / 100ml', ...ingredients.map(i => {
      const price = customPrices?.[i.id] || i.basePrice || { currency: '₹', amount: 100, unitQuantity: 1000, unitType: 'g' };
      const costPer100 = (price.amount / (price.unitQuantity || 1)) * 100;
      return `"${price.currency}${costPer100.toFixed(2)}"`;
    })],
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => cell.includes(',') ? `"${cell.replace(/"/g, '""')}"` : cell).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `PantryVerdict_Comparison_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
