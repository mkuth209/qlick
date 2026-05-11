import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const R = "#E03020"

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@qlick.help'

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    setError('')

    try {
      // Check if it's the admin email
      if (email !== ADMIN_EMAIL) {
        setError('Access denied. Admin only.')
        setLoading(false)
        return
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        // Fallback to old password check for now
        if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
          sessionStorage.setItem('qlick_admin', 'true')
          navigate('/admin')
        } else {
          setError('Incorrect email or password')
        }
      } else {
        sessionStorage.setItem('qlick_admin', 'true')
        navigate('/admin')
      }
    } catch (err) {
      // Fallback to old password check
      if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
        sessionStorage.setItem('qlick_admin', 'true')
        navigate('/admin')
      } else {
        setError('Incorrect email or password')
      }
    }

    setLoading(false)
  }

  const inp = {
    width: '100%',
    padding: '12px 16px',
    background: '#1a1a1a',
    border: `1.5px solid #2a2a2a`,
    borderRadius: 12,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    marginBottom: 12,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: R, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 16px' }}>🍔</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>qlick</div>
          <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>Admin Panel</div>
        </div>

        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 24, padding: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 24 }}>Welcome back 👋</div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#666', marginBottom: 6 }}>Email</div>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="admin@qlick.help"
            style={inp}
            onFocus={e => e.target.style.borderColor = R}
            onBlur={e => e.target.style.borderColor = '#2a2a2a'}
          />

          <div style={{ fontSize: 12, fontWeight: 700, color: '#666', marginBottom: 6 }}>Password</div>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Your password"
            style={inp}
            onFocus={e => e.target.style.borderColor = R}
            onBlur={e => e.target.style.borderColor = '#2a2a2a'}
          />

          {error && <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 12 }}>{error}</div>}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: '13px', background: R, border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4, opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </div>
      </div>
    </div>
  )
}
