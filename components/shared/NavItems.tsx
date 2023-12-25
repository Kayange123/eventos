"use client";

import { headerLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItems = () => {
  const pathname = usePathname();
  return (
    <ul className="flex md:flex-between w-full flex-col items-start gap-5 md:flex-row">
      {headerLinks.map((link, index) => (
        <li key={index}>
          <Link
            className={cn(
              "flex-center p-medium-16 whitespace-nowrap",
              pathname === link.route && "text-primary-500"
            )}
            href={link.route}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavItems;
