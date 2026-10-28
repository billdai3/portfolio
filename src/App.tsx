import { Analytics } from "@vercel/analytics/react";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { GridIconLoadingBlock } from "./components/GridIconLoading";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LabPage from "./pages/LabPage";
import NotFoundPage from "./pages/NotFoundPage";
import WorkPage from "./pages/WorkPage";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const WorkProjectPage = lazy(() => import("./pages/WorkProjectPage"));
const LabProjectPage = lazy(() => import("./pages/LabProjectPage"));
const DevGsapPlaygroundPage = import.meta.env.DEV
  ? lazy(() => import("./pages/DevGsapPlaygroundPage"))
  : null;
const DevLoadingPlaygroundPage = import.meta.env.DEV
  ? lazy(() => import("./pages/DevLoadingPlaygroundPage"))
  : null;
const DevMdxStyleguidePage = import.meta.env.DEV
  ? lazy(() => import("./pages/DevMdxStyleguidePage"))
  : null;
const DevSandboxPage = import.meta.env.DEV
  ? lazy(() => import("./pages/DevSandboxPage"))
  : null;

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="work" element={<WorkPage />} />
          <Route
            path="work/:slug"
            element={
              <Suspense fallback={<GridIconLoadingBlock />}>
                <WorkProjectPage />
              </Suspense>
            }
          />
          <Route path="lab" element={<LabPage />} />
          <Route
            path="lab/:slug"
            element={
              <Suspense fallback={<GridIconLoadingBlock />}>
                <LabProjectPage />
              </Suspense>
            }
          />
          <Route
            path="about"
            element={
              <Suspense fallback={<GridIconLoadingBlock />}>
                <AboutPage />
              </Suspense>
            }
          />
          {import.meta.env.DEV &&
          DevGsapPlaygroundPage &&
          DevLoadingPlaygroundPage &&
          DevMdxStyleguidePage &&
          DevSandboxPage ? (
            <>
              <Route
                path="dev/gsap"
                element={
                  <Suspense fallback={<GridIconLoadingBlock />}>
                    <DevGsapPlaygroundPage />
                  </Suspense>
                }
              />
              <Route
                path="dev/loading"
                element={
                  <Suspense fallback={<GridIconLoadingBlock />}>
                    <DevLoadingPlaygroundPage />
                  </Suspense>
                }
              />
              <Route
                path="dev/mdx-styleguide"
                element={
                  <Suspense fallback={<GridIconLoadingBlock />}>
                    <DevMdxStyleguidePage />
                  </Suspense>
                }
              />
              <Route
                path="dev/sandbox"
                element={
                  <Suspense fallback={<GridIconLoadingBlock />}>
                    <DevSandboxPage />
                  </Suspense>
                }
              />
            </>
          ) : null}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Analytics />
    </>
  );
}
