/**
 * Category Service
 * Business logic layer for category-related API operations
 */

import { API_ENDPOINTS } from "@/config/api.config";
import { Category } from "@/types";
import {
    CategoryApiResponse,
    CreateCategoryDto,
    UpdateCategoryDto,
} from "@/types/api.types";
import { getCategoryStyle } from "@/utils/category-icons";
import { httpClient } from "./http.client";

class CategoryService {
  /**
   * Fetch all categories from the backend
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await httpClient.get<CategoryApiResponse[]>(
        API_ENDPOINTS.CATEGORIES,
      );

      // Transform API response to internal Category type
      return response.map(this.transformToCategory);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  /**
   * Fetch a single category by ID
   */
  async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await httpClient.get<CategoryApiResponse>(
        `${API_ENDPOINTS.CATEGORIES}/${id}`,
      );
      return this.transformToCategory(response);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new category
   */
  async createCategory(data: CreateCategoryDto): Promise<Category> {
    try {
      const response = await httpClient.post<CategoryApiResponse>(
        API_ENDPOINTS.CATEGORIES,
        data,
      );
      return this.transformToCategory(response);
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  /**
   * Update an existing category
   */
  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
    try {
      const response = await httpClient.put<CategoryApiResponse>(
        `${API_ENDPOINTS.CATEGORIES}/${id}`,
        data,
      );
      return this.transformToCategory(response);
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      await httpClient.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }

  /**
   * Transform API response to internal Category type
   */
  private transformToCategory(apiCategory: CategoryApiResponse): Category {
    const style = getCategoryStyle(apiCategory.name);

    return {
      id: String(apiCategory.id),
      name: apiCategory.name,
      icon: apiCategory.icon || style.icon,
      color: apiCategory.color || style.color,
      type: apiCategory.type || "expense",
      createdAt: apiCategory.createdAt || new Date().toISOString(),
    };
  }
}

// Singleton instance
export const categoryService = new CategoryService();
