import { BrowserRouter, Route, Routes } from 'react-router-dom'

import AppLayout from './components/layout/AppLayout'

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
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reporter" element={<ReporterDashboard />} />
          <Route path="/reporter/report" element={<CreateReportPage />} />
          <Route path="/authority" element={<AuthorityDashboard />} />
          <Route path="/staff" element={<StaffDashboard />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App