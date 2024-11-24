import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Navbar from "./components/navbar.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import ConversationsPage from "./pages/ConversationsPage.tsx";

const router = createBrowserRouter([
  {
    path: "*",
    element: <AuthPage />,
  },
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <ConversationsPage/>
      </>
    ),
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="d-flex h-full w-full bg-ternary-dark text-primary-light">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  </React.StrictMode>
);
