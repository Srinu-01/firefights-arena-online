
import React from "react";  // Add explicit React import
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TournamentsList from "./pages/TournamentsList";
import TournamentDetail from "./pages/TournamentDetail";
import Leaderboard from "./pages/Leaderboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SquadRegistration from "./pages/SquadRegistration";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tournaments" element={<TournamentsList />} />
              <Route path="/tournament/:id" element={<TournamentDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/:id" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/squad-registration" element={<SquadRegistration />} />
              <Route path="/squad-registration/:id" element={<SquadRegistration />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);

export default App;
