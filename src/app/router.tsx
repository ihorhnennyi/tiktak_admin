import { isAuthed } from "@/features/auth/tokenService";
import Locales from "@/pages/Locales";
import Login from "@/pages/Login";
import Users from "@/pages/Users";
import AppShell from "@/shared/components/AppShell";
import * as React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

function RequireAuth({ children }: { children: React.ReactNode }) {
  return isAuthed() ? <>{children}</> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/users" replace /> },
      { path: "users", element: <Users /> },
      { path: "locales", element: <Locales /> },
    ],
  },
]);
