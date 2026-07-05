/**
 * routes/index.tsx
 * ----------------
 * Application routing configuration using React Router v7.
 * Includes ProtectedRoute and PublicRoute authentication guards.
 */

import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppContext } from '@context/AppContext'
import { MainLayout } from '@layouts/MainLayout'
import { HomePage } from '@pages/Home'
import { AnalyticsPage } from '@pages/Analytics'
import { SettingsPage } from '@pages/Settings'
import { LoginPage } from '@pages/Login'
import { StrategyPage } from '@pages/Strategy'
import { MarketingPage } from '@pages/Marketing'
import { LeadGenPage } from '@pages/LeadGen'
import { SalesPage } from '@pages/Sales'
import { CustomerSuccessPage } from '@pages/CustomerSuccess'
import { SchedulePage } from '@pages/Schedule'
import { BoardroomPage } from '@pages/Boardroom'
import { SimulatorPage } from '@pages/Simulator'
import { CrisisPage } from '@pages/Crisis'
import { ReportsPage } from '@pages/Reports'
import { DecisionsPage } from '@pages/Decisions'
import { TeamPage } from '@pages/Team'
import './index.css'

/* ---- Loading Spinner Overlay ---- */
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner">
        <div className="spinner-cube animate-pulse-glow">⬡</div>
        <span className="loading-text">Synthesizing Session...</span>
      </div>
    </div>
  )
}

/* ---- Protected Route Guard ---- */
interface GuardProps {
  children: ReactNode
}

function ProtectedRoute({ children }: GuardProps) {
  const { isAuthenticated, isLoading } = useAppContext()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

/* ---- Public Route Guard (Login page) ---- */
function PublicRoute({ children }: GuardProps) {
  const { isAuthenticated, isLoading } = useAppContext()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

/* ---- App Router ---- */
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---- Public Auth Routes ---- */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* ---- Protected Routes (wrapped in MainLayout & ProtectedRoute) ---- */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/strategy"
          element={
            <ProtectedRoute>
              <MainLayout>
                <StrategyPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MarketingPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leadgen"
          element={
            <ProtectedRoute>
              <MainLayout>
                <LeadGenPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SalesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AnalyticsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-success"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CustomerSuccessPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/boardroom"
          element={
            <ProtectedRoute>
              <MainLayout>
                <BoardroomPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/simulator"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SimulatorPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/crisis"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CrisisPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SchedulePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ReportsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/decisions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DecisionsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TeamPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ---- Catch-all redirect ---- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
