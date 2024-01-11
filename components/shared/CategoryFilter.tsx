"use client";

import { formUrlQuery, removeKeysFromQuery } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getAllCategories } from "@/actions/category.action";
import { Category } from "@prisma/client";

const CategoryFilter = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const categoryList = await getAllCategories();
      categoryList && setCategories(categoryList);
    })();
  }, []);
  const onSelectCategory = (category: string) => {
    let newUrl = "";
    if (category && category != "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "category",
        value: category,
      });
    } else {
      newUrl = removeKeysFromQuery({
        keysToRemove: ["category"],
        params: searchParams.toString(),
      });
    }
    router.push(newUrl, { scroll: false });
  };
  return (
    <Select onValueChange={(value: string) => onSelectCategory(value)}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Filter category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          defaultChecked
          value="All"
          className="select-item p-regular-14"
        >
          All categories
        </SelectItem>
        {categories?.map((category) => (
          <SelectItem
            key={category.id}
            value={category.name}
            className="p-regular-14 select-item"
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryFilter;
