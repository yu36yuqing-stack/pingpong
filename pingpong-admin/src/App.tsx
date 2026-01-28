import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(!!localStorage.getItem('token'));
  }, []);

  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}
