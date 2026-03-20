import { HomeView } from "@/features/home/views";
import { NavbarLayout } from "@/shared/layouts";

export default function HomePage() {
  return (
    <NavbarLayout>
      <div>
        <HomeView />
      </div>
    </NavbarLayout>
      
  );
}
