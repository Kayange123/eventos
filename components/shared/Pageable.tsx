"use client";

import React from "react";
import { CollectionProps } from "./Collection";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/types";

type PageableProps = Pick<
  CollectionProps,
  "page" | "totalPages" | "urlParamName"
>;

const Pageable = ({ urlParamName, page, totalPages }: PageableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (btnType: "prev" | "next") => {
    const pageTogo = btnType == "prev" ? Number(page) - 1 : Number(page) + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageTogo.toString(),
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="flex gap-2">
      <Button
        className="w-28"
        type="button"
        variant="outline"
        size="lg"
        onClick={() => handleClick("prev")}
        disabled={Number(page) <= 1}
      >
        Previous
      </Button>
      <Button
        className="w-28"
        type="button"
        variant="outline"
        size="lg"
        onClick={() => handleClick("next")}
        disabled={Number(page) >= totalPages!}
      >
        Next
      </Button>
    </div>
  );
};

export default Pageable;
