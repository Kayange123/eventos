import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Separator } from "../ui/separator";
import Logo from "./logo";
import NavItems from "./NavItems";

const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="align-middle">
          <Image
            src="/assets/icons/menu.svg"
            alt="menu icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
          <Logo />
          <Separator />
          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
