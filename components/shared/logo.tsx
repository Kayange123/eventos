import Image from "next/image";
import Link from "next/link";

const appName = "Eventos";
const Logo = () => {
  return (
    <Link href="/">
      <div className="flex hover:opacity-75 transition items-center justify-center gap-x-3">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          height={30}
          width={30}
        />
        <p className="text-xl text-neutral-600 font-bold">{appName}</p>
      </div>
    </Link>
  );
};

export default Logo;
