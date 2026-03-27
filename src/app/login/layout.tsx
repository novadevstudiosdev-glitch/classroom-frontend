import { NavbarLayout } from "@/shared/layouts";
import type { NavbarLayoutProps } from "@/shared/types";

export default function LoginLayout({ children }: NavbarLayoutProps) {
  return <NavbarLayout>{children}</NavbarLayout>;
}
