import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'

import { ScrollToHash } from '@/components/ScrollToHash'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'

// área administrativa carregada sob demanda (não pesa na landing)
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'))

function PageFallback() {
  return (
    <div className="grid min-h-dvh place-items-center bg-brand-mist" role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-sky border-t-brand-navy" />
      <span className="sr-only">Carregando…</span>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" richColors closeButton />
    </>
  )
}
