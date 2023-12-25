import React from "react";
import Logo from "./logo";

const year = new Date().getFullYear();
const Footer = () => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 py-2 sm:flex-row">
        <Logo />
        <p className="text-muted-foreground">{`${year} Eventos - All rights reserved!`}</p>
      </div>
    </footer>
  );
};

export default Footer;
