import { createBrowserRouter } from "react-router-dom";
import GeneralError from "./pages/errors/general-error";
import NotFoundError from "./pages/errors/not-found-error";
import MaintenanceError from "./pages/errors/maintenance-error";

const router = createBrowserRouter([
  // Auth routes
  {
    path: "/login",
    lazy: async () => ({
      Component: (await import("./pages/auth/mobile-login")).default,
    }),
  },

  // Main routes
  {
    path: "/",
    lazy: async () => {
      const AppShell = await import("./components/app-shell");
      return { Component: AppShell.default };
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("./pages/dashboard")).default,
        }),
      },
      {
        path: "students",
        lazy: async () => ({
          Component: (await import("./pages/students")).default,
        }),
      },
      {
        path: "tests/test-pattern",
        lazy: async () => ({
          Component: (await import("./pages/exams/mock-test")).default,
        }),
      },
      {
        path: "/tests/test-factory",
        lazy: async () => ({
          Component: (await import("./pages/exams/test-factory")).default,
        }),
      },
      {
        path: "tests/create-test",
        lazy: async () => ({
          Component: (await import("./pages/exams/create-tests")).default,
        }),
      },
      {
        path: "tests/update-test/:testId",
        lazy: async () => ({
          Component: (await import("./pages/exams/update-tests")).default,
        }),
      },
      {
        path: "questions-factory",
        lazy: async () => ({
          Component: (await import("./pages/questions_factory/QuestionFactory"))
            .default,
        }),
      },
      { path: "*", Component: NotFoundError },
    ],
  },

  // Error routes
  { path: "/500", Component: GeneralError },
  { path: "/404", Component: NotFoundError },
  { path: "/503", Component: MaintenanceError },

  // Fallback 404 route
  { path: "*", Component: NotFoundError },
],{
  basename: import.meta.env.BASE_URL,
});

export default router;
