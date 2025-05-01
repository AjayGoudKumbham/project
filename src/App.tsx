
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import JobSearchPage from "./pages/JobSearch";
import NotFound from "./pages/NotFound";
import CareerChatbot from "./components/CareerChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/resume-analysis" element={<ResumeAnalysis />} />
          <Route path="/job-search" element={<JobSearchPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CareerChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
