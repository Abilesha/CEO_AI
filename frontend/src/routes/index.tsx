/**
 * routes/index.tsx
 * ----------------
 * Application routing configuration using React Router v7.
 * Add new routes here as pages are created.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@layouts/MainLayout'
import { HomePage } from '@pages/Home'
import { AnalyticsPage } from '@pages/Analytics'
import { ReportsPage } from '@pages/Reports'
import { DecisionsPage } from '@pages/Decisions'
import { TeamPage } from '@pages/Team'
import { SettingsPage } from '@pages/Settings'

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
        <Route
          path="/analytics"
          element={
            <MainLayout>
              <AnalyticsPage />
            </MainLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <MainLayout>
              <ReportsPage />
            </MainLayout>
          }
        />
        <Route
          path="/decisions"
          element={
            <MainLayout>
              <DecisionsPage />
            </MainLayout>
          }
        />
        <Route
          path="/team"
          element={
            <MainLayout>
              <TeamPage />
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <SettingsPage />
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
