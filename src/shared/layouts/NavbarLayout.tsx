import { Navbar } from "@/shared/components/navigation";
import type { NavbarLayoutProps } from "@/shared/types";

const NavbarLayout = ({ children }: NavbarLayoutProps) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default NavbarLayout;
