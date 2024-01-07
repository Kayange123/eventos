"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventDefaultValues } from "@/constants";
import { eventFormSchema } from "@/lib/validateForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Dropdown from "./Dropdown";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { FileUploader } from "./FileUploader";
import { useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useUploadThing } from "@/lib/uploadThing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/actions/event.actions";
import { Event } from "@prisma/client";

interface EventFormProps {
  userId: string;
  type: "Create" | "Update";
  event?: Event;
}

const EventForm = ({ userId, type, event }: EventFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const formEvent =
    event && type === "Update"
      ? {
          ...event,
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
          description: event.description || "",
          location: event.location || "",
          price: event.price || "",
          url: event.url || "",
        }
      : eventDefaultValues;
  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: formEvent,
  });

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    //const eventData = values;
    let uploadedImageUrl = values.imageUrl;
    if (files.length > 0) {
      const uploadedImages = await startUpload(files);
      if (!uploadedImages) return;
      uploadedImageUrl = uploadedImages[0].url;
    }

    if (type === "Create") {
      try {
        const newEvent = await createEvent({
          event: { ...values, imageUrl: uploadedImageUrl },
          path: "/profile",
          userId,
        });
        if (newEvent) {
          form.reset();
          toast.success("Event created successfully");
          router.push(`/events/${newEvent.id}`);
        }
      } catch (error) {
        toast.error("Failed to create form");
      }
    }
    if (type === "Update") {
      if (!event?.id) {
        router.back();
      }
      try {
        const updatedEvent = await updateEvent({
          event: { ...values, imageUrl: uploadedImageUrl },
          path: `/events/${event?.id}`,
          userId,
          eventId: event?.id!,
        });
        if (updatedEvent) {
          toast.success("Event created successfully");
          form.reset();
          router.push(`/events/${updatedEvent.id}`);
        }
      } catch (error) {
        toast.error("Failed to create form");
      }
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="w-full">
                  <Input
                    className="input-field w-fulls"
                    placeholder="Enter an event title"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="w-full">
                  <Dropdown
                    onChangeHandler={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <Textarea
                    className="textarea rounded-xl"
                    placeholder="Provide a description for your event"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-md bg-grey-50 gap-2 pl-5 py-1.5">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      alt="location marker"
                      width={24}
                      height={24}
                    />
                    <Input
                      className="input-field"
                      placeholder="Event location or online"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-md bg-grey-50 gap-2 pl-5 py-1.5">
                    <Image
                      src="/assets/icons/link.svg"
                      alt="link"
                      width={24}
                      height={24}
                    />
                    <Input
                      className="input-field"
                      type="url"
                      placeholder="https://"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-md bg-grey-50 gap-2 pl-5 py-1.5">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />

                    <p className="ml-3 whitespace-nowrap text-gray-600">
                      Start date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="MMM dd, yyyy h:mm aa"
                      wrapperClassName="datePicker"
                      disabled={form.formState.isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-md bg-grey-50 gap-2 pl-5 py-1.5">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />

                    <p className="ml-3 whitespace-nowrap text-gray-600">
                      End date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="MMM dd, yyyy h:mm aa"
                      wrapperClassName="datePicker"
                      disabled={form.formState.isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-md bg-grey-50 gap-2 pl-5 py-1.5">
                    <Image
                      src="/assets/icons/dollar.svg"
                      alt="dollar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled={form.formState.isSubmitting}
                    />
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl className="flex items-center justify-end">
                            <div>
                              <Label
                                htmlFor="isFree"
                                className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Free Ticket
                              </Label>
                              <Checkbox
                                disabled={form.formState.isSubmitting}
                                onCheckedChange={field.onChange}
                                checked={field.value}
                                id="isFree"
                                className="h-5 mr-2 w-5"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          size="lg"
          disabled={form.formState.isSubmitting}
          type="submit"
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Submiting..." : `${type} Event`}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
