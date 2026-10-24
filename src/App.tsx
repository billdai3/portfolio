import { Analytics } from '@vercel/analytics/react'
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import LabPage from './pages/LabPage'
import NotFoundPage from './pages/NotFoundPage'
import WorkPage from './pages/WorkPage'

const WorkProjectPage = lazy(() => import('./pages/WorkProjectPage'))
const LabProjectPage = lazy(() => import('./pages/LabProjectPage'))
const DevGsapPlaygroundPage = lazy(() => import('./pages/DevGsapPlaygroundPage'))
const DevLoadingPlaygroundPage = lazy(() => import('./pages/DevLoadingPlaygroundPage'))
const DevMdxStyleguidePage = lazy(() => import('./pages/DevMdxStyleguidePage'))
const DevSandboxPage = lazy(() => import('./pages/DevSandboxPage'))

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
              <Suspense fallback={null}>
                <WorkProjectPage />
              </Suspense>
            }
          />
          <Route path="lab" element={<LabPage />} />
          <Route
            path="lab/:slug"
            element={
              <Suspense fallback={null}>
                <LabProjectPage />
              </Suspense>
            }
          />
          <Route path="about" element={<AboutPage />} />
          {import.meta.env.DEV ? (
            <>
              <Route
                path="dev/gsap"
                element={
                  <Suspense fallback={null}>
                    <DevGsapPlaygroundPage />
                  </Suspense>
                }
              />
              <Route
                path="dev/loading"
                element={
                  <Suspense fallback={null}>
                    <DevLoadingPlaygroundPage />
                  </Suspense>
                }
              />
              <Route
                path="dev/mdx-styleguide"
                element={
                  <Suspense fallback={null}>
                    <DevMdxStyleguidePage />
                  </Suspense>
                }
              />
              <Route
                path="dev/sandbox"
                element={
                  <Suspense fallback={null}>
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
  )
}
