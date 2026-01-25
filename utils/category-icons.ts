/**
 * Category Icon Mapper
 * Maps category names to appropriate icons and colors
 */

interface CategoryStyle {
  icon: string;
  color: string;
}

export const categoryIconMap: Record<string, CategoryStyle> = {
  // Healthcare
  Medicine: { icon: "💊", color: "#EF4444" },
  Fitness: { icon: "💪", color: "#F97316" },
  "Personal Care": { icon: "💅", color: "#EC4899" },

  // Travel & Transport
  Travel: { icon: "✈️", color: "#3B82F6" },
  Fuel: { icon: "⛽", color: "#F59E0B" },

  // Food & Drinks
  "Food & Drinks": { icon: "🍕", color: "#EF4444" },
  Groceries: { icon: "🛒", color: "#10B981" },

  // Shopping & Entertainment
  Shopping: { icon: "🛍️", color: "#EC4899" },
  Entertainment: { icon: "🎮", color: "#8B5CF6" },

  // Home & Bills
  "Bills and Utilities": { icon: "📄", color: "#F59E0B" },
  Rent: { icon: "🏠", color: "#3B82F6" },
  Household: { icon: "🏡", color: "#14B8A6" },

  // Financial
  Investments: { icon: "📈", color: "#10B981" },
  "Credit bills": { icon: "💳", color: "#EF4444" },
  ATM: { icon: "🏧", color: "#3B82F6" },

  // Others
  Charity: { icon: "❤️", color: "#EC4899" },
  Others: { icon: "📦", color: "#6B7280" },
};

/**
 * Get icon and color for a category name
 */
export function getCategoryStyle(categoryName: string): CategoryStyle {
  return categoryIconMap[categoryName] || { icon: "📦", color: "#6B7280" };
}

/**
 * Get all category names that have defined styles
 */
export function getAvailableCategoryNames(): string[] {
  return Object.keys(categoryIconMap);
}
