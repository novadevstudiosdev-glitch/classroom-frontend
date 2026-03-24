import { HomeView } from "@/features/home/views";
import { NavbarLayout } from "@/shared/layouts";
import { BackgroundOrbs } from "@/features/home/layout/BackgroundOrbs";

export default function HomePage() {
  return (
    <NavbarLayout>
      <div>
        <BackgroundOrbs />
        <HomeView />
      </div>
    </NavbarLayout>
      
  );
}
