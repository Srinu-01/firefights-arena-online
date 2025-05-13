
import React from "react";  // Add explicit React import
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TournamentsList from "./pages/TournamentsList";
import TournamentDetail from "./pages/TournamentDetail";
import Champions from "./pages/Champions";
import ChampionDetail from "./pages/ChampionDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SquadRegistration from "./pages/SquadRegistration";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import AdminTournaments from "./pages/admin/Tournaments";
import AdminChampions from "./pages/admin/Champions";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/tournaments" element={<TournamentsList />} />
                <Route path="/tournament/:id" element={<TournamentDetail />} />
                <Route path="/champions" element={<Champions />} />
                <Route path="/champion/:id" element={<ChampionDetail />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/:id" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/squad-registration" element={<SquadRegistration />} />
                <Route path="/squad-registration/:id" element={<SquadRegistration />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminTournaments />} />
                    <Route path="tournaments" element={<AdminTournaments />} />
                    <Route path="champions" element={<AdminChampions />} />
                    <Route path="teams" element={<div>Teams Management</div>} />
                    <Route path="settings" element={<div>Settings</div>} />
                  </Route>
                </Route>
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);

export default App;
