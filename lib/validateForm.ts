import * as z from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long")
    .max(500, "Description must be less than 500 characters"),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters long")
    .max(100, "Location must be less than 100 characters"),
  imageUrl: z.string(),
  startDateTime: z.date().min(new Date(), "Event must be in the future"),
  endDateTime: z.date().min(new Date(), "Event must be in the future"),
  price: z.string(),
  categoryId: z.string(),
  isFree: z.boolean(),
  url: z.string().url("Please enter a valid URL"),
});
