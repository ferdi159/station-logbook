import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './hooks/useTheme'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Logbook } from './pages/Logbook'
import { LogEntryForm } from './pages/LogEntryForm'
import { Automation } from './pages/Automation'
import { AutomationForm } from './pages/AutomationForm'
import { Contacts } from './pages/Contacts'
import { ContactForm } from './pages/ContactForm'
import { LessonsLearned } from './pages/LessonsLearned'
import { LessonForm } from './pages/LessonForm'
import { Search } from './pages/Search'
import { Settings } from './pages/Settings'
import { InstallBanner } from './components/InstallBanner'

export default function App() {
  return (
    <ThemeProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          className: '!bg-[var(--color-surface)] !text-[var(--color-text)] !border !border-[var(--color-border)]',
        }}
      />
      <InstallBanner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/logbook" element={<Logbook />} />
          <Route path="/logbook/new" element={<LogEntryForm />} />
          <Route path="/logbook/:id" element={<LogEntryForm />} />
          <Route path="/automation" element={<Automation />} />
          <Route path="/automation/new" element={<AutomationForm />} />
          <Route path="/automation/:id" element={<AutomationForm />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/new" element={<ContactForm />} />
          <Route path="/contacts/:id" element={<ContactForm />} />
          <Route path="/lessons" element={<LessonsLearned />} />
          <Route path="/lessons/new" element={<LessonForm />} />
          <Route path="/lessons/:id" element={<LessonForm />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}
