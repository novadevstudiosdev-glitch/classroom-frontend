import Navbar from "@/components/Navbar";
import type { NavbarLayoutProps } from "@/types/navbar-layout.types";

const NavbarLayout = ({ children }: NavbarLayoutProps) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default NavbarLayout;
