import NavbarLayout from "@/components/ui/NavbarLayout";
import type { NavbarLayoutProps } from "@/types/navbar-layout.types";

export default function LoginLayout({ children }: NavbarLayoutProps) {
  return <NavbarLayout>{children}</NavbarLayout>;
}
