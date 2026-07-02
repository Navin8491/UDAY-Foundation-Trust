import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FloatingActions } from "@/components/site/FloatingActions";
import { LanguageProvider } from "@/context/LanguageContext";

export function RootLayout() {
  return (
    <LanguageProvider>
      <SiteHeader />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <SiteFooter />
      <FloatingActions />
    </LanguageProvider>
  );
}
export default RootLayout;
