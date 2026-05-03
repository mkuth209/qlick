import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_PASSWORD } from '../lib/constants.js'

export default function AdminLogin() {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('qlick_admin', 'true')
      navigate('/admin')
    } else {
      setError('Wrong password. Try again.')
      setPw('')
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#080808', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'SF Pro Display',-apple-system,sans-serif" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation:'fadeUp 0.4s ease', width:'100%', maxWidth:380, padding:'0 20px' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#C9A84C,#E8C06A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:800, color:'#0C0B07', margin:'0 auto 16px', fontFamily:'Syne,sans-serif' }}>Q</div>
          <div style={{ fontSize:22, fontWeight:800, color:'#f0f0f0', letterSpacing:'-0.03em' }}>Qlick Admin</div>
          <div style={{ fontSize:13, color:'#444', marginTop:4 }}>Your private control panel</div>
        </div>

        {/* Card */}
        <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:18, padding:32 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#555', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.08em' }}>Password</div>
          <div style={{ position:'relative', marginBottom:20 }}>
            <input
              type={show ? 'text' : 'password'}
              value={pw}
              onChange={e => { setPw(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="Enter admin password"
              autoFocus
              style={{ width:'100%', padding:'12px 44px 12px 16px', background:'#0d0d0d', border:`1.5px solid ${error ? '#f87171' : '#252525'}`, borderRadius:12, color:'#f0f0f0', fontSize:15, outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
            />
            <button onClick={() => setShow(v => !v)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16 }}>
              {show ? '🙈' : '👁️'}
            </button>
          </div>
          {error && <div style={{ color:'#f87171', fontSize:13, marginBottom:16, padding:'8px 12px', background:'rgba(248,113,113,0.08)', borderRadius:8 }}>{error}</div>}
          <button onClick={login} style={{ width:'100%', padding:'13px', background:'linear-gradient(135deg,#C9A84C,#E8C06A)', border:'none', borderRadius:12, color:'#0C0B07', fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:'Syne,sans-serif' }}>
            Enter Dashboard →
          </button>
        </div>
        <div style={{ textAlign:'center', marginTop:20, fontSize:12, color:'#333' }}>qlick.sa · Admin only</div>
      </div>
    </div>
  )
}
