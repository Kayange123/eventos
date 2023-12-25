import React from "react";
import Logo from "@/components/shared/logo";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Logo />
        <div className="flex">
          <SignedIn>
            <nav className="md:flex-between hidden w-full max-w-xs">
              <NavItems />
            </nav>
          </SignedIn>
          <div className="flex w-32 justify-end gap-3">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
              <MobileNav />
            </SignedIn>
            <SignedOut>
              <Button asChild size="lg" className="rounded-full">
                <Link href="/sign-in">Login</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
