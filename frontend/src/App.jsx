import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Placeholder routes for future navigation items */}
        <Route path="/new" element={<Navigate to="/" replace />} />
        <Route path="/recent" element={
          <div className="flex items-center justify-center h-full text-slate-400">
            Recent Conversations (Coming Soon)
          </div>
        } />
        <Route path="/bookmarks" element={
          <div className="flex items-center justify-center h-full text-slate-400">
            Bookmarks (Coming Soon)
          </div>
        } />
        <Route path="/reports" element={
          <div className="flex items-center justify-center h-full text-slate-400">
            Saved Reports (Coming Soon)
          </div>
        } />
        <Route path="/guidelines" element={
          <div className="flex items-center justify-center h-full text-slate-400">
            Medical Guidelines Explorer (Coming Soon)
          </div>
        } />
        <Route path="/settings" element={
          <div className="flex items-center justify-center h-full text-slate-400">
            Settings (Coming Soon)
          </div>
        } />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;