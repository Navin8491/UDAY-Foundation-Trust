import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { Toaster } from "sonner";

// Lazy-loaded public pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Programs = lazy(() => import("./pages/Programs"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Team = lazy(() => import("./pages/Team"));
const Events = lazy(() => import("./pages/Events"));
const GetInvolved = lazy(() => import("./pages/GetInvolved"));
const Donate = lazy(() => import("./pages/Donate"));
const Contact = lazy(() => import("./pages/Contact"));
const Transparency = lazy(() => import("./pages/Transparency"));

// Legal pages
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ReturnPolicy = lazy(() => import("./pages/ReturnPolicy"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));

// Lazy-loaded admin pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminDonations = lazy(() => import("./pages/admin/Donations"));
const AdminEvents = lazy(() => import("./pages/admin/Events"));
const AdminGallery = lazy(() => import("./pages/admin/Gallery"));
const AdminPrograms = lazy(() => import("./pages/admin/Programs"));
const AdminTeam = lazy(() => import("./pages/admin/Team"));
const AdminVolunteers = lazy(() => import("./pages/admin/Volunteers"));
const AdminPartnerships = lazy(() => import("./pages/admin/Partnerships"));
const AdminCertificates = lazy(() => import("./pages/admin/Certificates"));
const AdminTransparency = lazy(() => import("./pages/admin/Transparency"));
const AdminContact = lazy(() => import("./pages/admin/ContactMessages"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));

// Loading spinner fallback
function Loading() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

// 404 page
function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" closeButton richColors />
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public NGO Website Layout */}
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/projects" element={<Navigate to="/events" replace />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/team" element={<Team />} />
            <Route path="/events" element={<Events />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/blog" element={<Navigate to="/events" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>



          {/* Premium Admin Panel Layout (Frontend-only) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="programs" element={<AdminPrograms />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="volunteers" element={<AdminVolunteers />} />
            <Route path="partnerships" element={<AdminPartnerships />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="transparency" element={<AdminTransparency />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
