import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ReporterDashboard from './pages/ReporterDashboard'
import AuthorityDashboard from './pages/AuthorityDashboard'
import StaffDashboard from './pages/StaffDashboard'
import CreateReportPage from './pages/CreateReportPage'

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>

          {/* =========================
              PUBLIC ROUTES
          ========================== */}

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />


          {/* =========================
              REPORTER ROUTES
          ========================== */}

          <Route
            path="/reporter"
            element={
              <ProtectedRoute
                allowedRoles={['reporter']}
              >
                <ReporterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reporter/report"
            element={
              <ProtectedRoute
                allowedRoles={['reporter']}
              >
                <CreateReportPage />
              </ProtectedRoute>
            }
          />


          {/* =========================
              AUTHORITY ROUTES
          ========================== */}

          <Route
            path="/authority"
            element={
              <ProtectedRoute
                allowedRoles={['authority']}
              >
                <AuthorityDashboard />
              </ProtectedRoute>
            }
          />


          {/* =========================
              STAFF ROUTES
          ========================== */}

          <Route
            path="/staff"
            element={
              <ProtectedRoute
                allowedRoles={['staff']}
              >
                <StaffDashboard />
              </ProtectedRoute>
            }
          />


          {/* =========================
              FALLBACK ROUTE
          ========================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App