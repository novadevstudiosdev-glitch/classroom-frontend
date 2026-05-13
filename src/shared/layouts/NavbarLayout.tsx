import { Navbar } from "@/shared/components/navigation";
import type { NavbarLayoutProps } from "@/shared/types";

const NavbarLayout = ({ children }: NavbarLayoutProps) => {
  return (
    <>
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(2,4,9,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <Navbar />
      </div>
      {children}
    </>
  );
};

export default NavbarLayout;
