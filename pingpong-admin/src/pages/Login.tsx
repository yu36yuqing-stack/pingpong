import { useMemo, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function Login({ onDone }: { onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [name, setName] = useState('管理员');
  const [role, setRole] = useState<'ADMIN' | 'USER'>('ADMIN');

  const canSubmit = useMemo(() => name.trim().length > 0 && !loading, [name, loading]);

  async function onLogin() {
    setErr(null);
    setLoading(true);
    try {
      const data = await apiFetch<{ token: string }>('/auth/dev-login', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), role })
      });
      localStorage.setItem('token', data.token);
      onDone();
    } catch (e: any) {
      setErr(e?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 460, margin: '72px auto', padding: 24, background: '#fff', borderRadius: 12 }}>
      <h2 style={{ marginTop: 0 }}>Pingpong 管理后台</h2>
      <p style={{ color: '#666', marginTop: 8 }}>
        当前使用 <code>/auth/dev-login</code> 进行演示登录（后续可替换为真实管理员账号体系）。
      </p>

      <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#555' }}>姓名</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入" />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#555' }}>角色</span>
          <select value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
        </label>

        <button onClick={onLogin} disabled={!canSubmit}>
          {loading ? '登录中…' : '登录'}
        </button>
      </div>

      {err && <div style={{ marginTop: 12, color: 'crimson', whiteSpace: 'pre-wrap' }}>{err}</div>}

      <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
        提示：只有 ADMIN 角色可访问 <code>/admin/*</code> 接口。
      </div>
    </div>
  );
}
