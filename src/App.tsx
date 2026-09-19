import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Banners from "./pages/Banners";
import Videos from "./pages/Videos";
import Galleries from "./pages/Galleries";
import NotFound from "./pages/NotFound";
import Certifications from "./pages/Certifications";
import FAQ from "./pages/FAQ";
import LatestUpdates from "./pages/LatestUpdates";
import Testimonial from "./pages/Testimonial";
import Blogs from "./pages/Blogs";
import AboutUs from "./pages/AboutUs";
import MenuCategories from "./pages/MenuCategories";
import MenuCategoryForm from "./pages/MenuCategoryForm";
import MenuItems from "./pages/MenuItems";
import MenuItemForm from "./pages/MenuItemForm";
import Courses from "./pages/Courses";
import Resources from "./pages/Resources";
import ManageCertifications from "./pages/ManageCertifications";
import PortfolioPage from "./pages/Portfolio";
import Pricing from "./pages/Pricing";
import Test from "./pages/Test";
import LogoCarousel from "./pages/LogoCarousel";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Navigate to="/banners" replace />} />
          <Route path="/banners" element={<Banners />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/galleries" element={<Galleries />} />
          <Route path="/Test" element={<Test />} />
          {/* Placeholder routes for other sections */}
          <Route path="/logos" element={<NotFound />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/news" element={<LatestUpdates />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/managecertifications" element={<ManageCertifications />} />
          <Route path="/testimonials" element={<Testimonial />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/menu-categories" element={<MenuCategories />} />
          <Route path="/menu-categories/new" element={<MenuCategoryForm />} />
          <Route path="/menu-categories/edit/:id" element={<MenuCategoryForm />} />
          <Route path="/menu-items" element={<MenuItems />} />
          <Route path="/menu-items/new" element={<MenuItemForm />} />
          <Route path="/menu-items/edit/:id" element={<MenuItemForm />} />
          <Route path="/updates" element={<NotFound />} />
          <Route path="/doctors" element={<NotFound />} />
          <Route path="/equipment" element={<NotFound />} />
          <Route path="/posts" element={<NotFound />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/categories" element={<NotFound />} />
          <Route path="/authors" element={<NotFound />} />
          <Route path="/logocarousel" element={<LogoCarousel />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
