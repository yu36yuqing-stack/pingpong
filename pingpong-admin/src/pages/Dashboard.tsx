import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../lib/api';

type Course = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
};

type Profile = {
  id: number;
  name: string;
  role: string;
  openid: string;
};

function fmt(v: string) {
  // backend returns ISO string; keep simple
  return v?.replace('T', ' ');
}

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // create form
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');

  const canCreate = useMemo(() => {
    return title.trim() && startTime && endTime && location.trim() && !busy;
  }, [title, startTime, endTime, location, busy]);

  function logout() {
    localStorage.removeItem('token');
    onLogout();
  }

  async function load() {
    setErr(null);
    setBusy(true);
    try {
      const [p, list] = await Promise.all([
        apiFetch<Profile>('/user/profile'),
        apiFetch<Course[]>('/admin/courses')
      ]);
      setProfile(p);
      setCourses(list);
    } catch (e: any) {
      const msg = e?.message || '加载失败';
      setErr(msg);
      // token invalid / role mismatch
      if (String(msg).includes('401') || String(msg).includes('403')) {
        logout();
      }
    } finally {
      setBusy(false);
    }
  }

  async function createCourse() {
    setErr(null);
    setBusy(true);
    try {
      await apiFetch<Course>('/admin/courses', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          startTime,
          endTime,
          location: location.trim()
        })
      });
      setTitle('');
      setStartTime('');
      setEndTime('');
      setLocation('');
      await load();
    } catch (e: any) {
      setErr(e?.message || '创建失败');
    } finally {
      setBusy(false);
    }
  }

  async function deleteCourse(id: number) {
    if (!confirm(`确认删除课程 #${id} ?`)) return;
    setErr(null);
    setBusy(true);
    try {
      await apiFetch<void>(`/admin/courses/${id}`, { method: 'DELETE' });
      await load();
    } catch (e: any) {
      setErr(e?.message || '删除失败');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 1060, margin: '28px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>课程管理</h2>
          {profile && (
            <div style={{ marginTop: 6, color: '#666', fontSize: 13 }}>
              当前用户：{profile.name}（{profile.role}） · UID {profile.id}
            </div>
          )}
        </div>
        <div>
          <button onClick={load} disabled={busy} style={{ marginRight: 8 }}>
            {busy ? '刷新中…' : '刷新'}
          </button>
          <button onClick={logout}>退出</button>
        </div>
      </div>

      {err && (
        <div style={{ marginTop: 12, padding: 10, background: '#fff0f0', border: '1px solid #ffd2d2', borderRadius: 8, color: '#a10000' }}>
          {err}
        </div>
      )}

      <div style={{ marginTop: 18, padding: 16, background: '#fff', borderRadius: 12 }}>
        <h3 style={{ marginTop: 0 }}>新建课程</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#555' }}>标题</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：晚间训练" />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#555' }}>地点</span>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="例如：1号台" />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#555' }}>开始时间（ISO）</span>
            <input value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="2026-01-28T00:00:00" />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#555' }}>结束时间（ISO）</span>
            <input value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="2026-12-31T23:59:59" />
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={createCourse} disabled={!canCreate}>
            创建
          </button>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <table width="100%" cellPadding={10} style={{ background: '#fff', borderRadius: 12 }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ width: 70 }}>ID</th>
              <th>标题</th>
              <th style={{ width: 210 }}>开始</th>
              <th style={{ width: 210 }}>结束</th>
              <th style={{ width: 140 }}>地点</th>
              <th style={{ width: 90 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td>{fmt(c.startTime)}</td>
                <td>{fmt(c.endTime)}</td>
                <td>{c.location}</td>
                <td>
                  <button onClick={() => deleteCourse(c.id)} disabled={busy}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={6} style={{ color: '#666' }}>
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
