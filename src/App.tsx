import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import LabPage from './pages/LabPage'
import WorkPage from './pages/WorkPage'

const DevGsapPlaygroundPage = lazy(() => import('./pages/DevGsapPlaygroundPage'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="work" element={<WorkPage />} />
        <Route path="lab" element={<LabPage />} />
        <Route path="about" element={<AboutPage />} />
        {import.meta.env.DEV ? (
          <Route
            path="dev/gsap"
            element={
              <Suspense fallback={null}>
                <DevGsapPlaygroundPage />
              </Suspense>
            }
          />
        ) : null}
      </Route>
    </Routes>
  )
}
