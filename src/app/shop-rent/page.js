"use client";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import RentPage from "@/components/RentPage";
import { DashboardProvider } from "@/context/DashboardContext";

export default function ShopRentPage() {
  return (
    <ProtectedRoute>
      <DashboardProvider>
        <RentPage />
      </DashboardProvider>
    </ProtectedRoute>
  );
}
