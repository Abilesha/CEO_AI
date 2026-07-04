/**
 * routes/index.tsx
 * ----------------
 * Application routing configuration using React Router v7.
 * Add new routes here as pages are created.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@layouts/MainLayout'
import { HomePage } from '@pages/Home'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---- Public Routes ---- */}
        {/* <Route path="/login" element={<LoginPage />} /> */}

        {/* ---- Protected Routes (wrapped in MainLayout) ---- */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        {/* ---- Catch-all redirect ---- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
