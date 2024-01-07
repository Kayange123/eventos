"use server";

import { db } from "@/lib/database";
import { Category } from "@prisma/client";

export const createCategory = async ({
  categoryName,
}: {
  categoryName: string;
}): Promise<Category> => {
  try {
    const newCategory = await db.category.create({
      data: {
        name: categoryName,
      },
    });
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    throw new Error("Failed to create category");
  }
};
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const categories = await db.category.findMany();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    throw new Error("Failed to fetch category");
  }
};
