import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import LabPage from './pages/LabPage'
import LabProjectPage from './pages/LabProjectPage'
import WorkPage from './pages/WorkPage'

const DevGsapPlaygroundPage = lazy(() => import('./pages/DevGsapPlaygroundPage'))
const DevMdxStyleguidePage = lazy(() => import('./pages/DevMdxStyleguidePage'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="work" element={<WorkPage />} />
        <Route path="lab" element={<LabPage />} />
        <Route path="lab/:slug" element={<LabProjectPage />} />
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
              path="dev/mdx-styleguide"
              element={
                <Suspense fallback={null}>
                  <DevMdxStyleguidePage />
                </Suspense>
              }
            />
          </>
        ) : null}
      </Route>
    </Routes>
  )
}
