import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const G = '#C9A84C'

function Topbar({ onLogout }) {
  return (
    <div style={{ padding:'14px 28px', borderBottom:'1px solid #161616', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#080808', position:'sticky', top:0, zIndex:10 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${G},#E8C06A)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#0C0B07', fontFamily:'Syne,sans-serif' }}>Q</div>
        <div>
          <div style={{ fontWeight:800, fontSize:15, letterSpacing:'-0.03em', color:'#f0f0f0' }}>Qlick Admin</div>
          <div style={{ fontSize:11, color:'#444' }}>All your restaurants</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <a href="/admin/new" style={{ padding:'9px 20px', background:`linear-gradient(135deg,${G},#E8C06A)`, border:'none', borderRadius:10, color:'#0C0B07', fontSize:13, fontWeight:800, cursor:'pointer', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6 }}>+ New Restaurant</a>
        <button onClick={onLogout} style={{ padding:'9px 16px', background:'#141414', border:'1px solid #252525', borderRadius:10, color:'#555', fontSize:13, fontWeight:600, cursor:'pointer' }}>Logout</button>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color = G }) {
  return (
    <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:14, padding:'20px 22px', flex:1, minWidth:140 }}>
      <div style={{ fontSize:22, marginBottom:10 }}>{icon}</div>
      <div style={{ fontSize:28, fontWeight:900, color, marginBottom:2, fontFamily:'Syne,sans-serif' }}>{value}</div>
      <div style={{ fontSize:12, color:'#555' }}>{label}</div>
    </div>
  )
}

export default function AdminPanel() {
  const [restaurants, setRestaurants] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const logout = () => { sessionStorage.removeItem('qlick_admin'); navigate('/admin/login') }

  useEffect(() => {
    const load = async () => {
      const [{ data: r }, { data: o }] = await Promise.all([
        supabase.from('restaurants').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*'),
      ])
      setRestaurants(r || [])
      setOrders(o || [])
      setLoading(false)
    }
    load()
  }, [])

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + (o.total || 0), 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length

  const filtered = restaurants.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine?.toLowerCase().includes(search.toLowerCase())
  )

  const deleteRestaurant = async (id) => {
    if (!confirm('Delete this restaurant? This cannot be undone.')) return
    await supabase.from('restaurants').delete().eq('id', id)
    await supabase.from('menu_items').delete().eq('restaurant_id', id)
    await supabase.from('orders').delete().eq('restaurant_id', id)
    setRestaurants(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div style={{ minHeight:'100vh', background:'#080808', color:'#f0f0f0', fontFamily:"'SF Pro Display',-apple-system,sans-serif" }}>
      <Topbar onLogout={logout} />
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 28px' }}>

        {/* Stats */}
        <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:36 }}>
          <StatCard icon="🏪" label="Total Restaurants" value={restaurants.length} />
          <StatCard icon="📦" label="Total Orders" value={orders.length} color="#f97316" />
          <StatCard icon="💰" label="Total Revenue" value={`${totalRevenue.toFixed(0)} SAR`} color="#10b981" />
          <StatCard icon="⏳" label="Pending Orders" value={pendingOrders} color="#f59e0b" />
        </div>

        {/* Search + list */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, gap:16 }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search restaurants…"
            style={{ flex:1, maxWidth:340, padding:'10px 16px', background:'#111', border:'1px solid #1e1e1e', borderRadius:10, color:'#f0f0f0', fontSize:14, outline:'none', fontFamily:'inherit' }}
          />
          <div style={{ fontSize:13, color:'#444' }}>{filtered.length} restaurant{filtered.length !== 1 ? 's' : ''}</div>
        </div>

        {loading && <div style={{ textAlign:'center', color:'#333', padding:60, fontSize:14 }}>Loading…</div>}

        {!loading && !filtered.length && (
          <div style={{ textAlign:'center', padding:80 }}>
            <div style={{ fontSize:52, marginBottom:16 }}>🏪</div>
            <div style={{ fontSize:17, fontWeight:700, color:'#2a2a2a', marginBottom:8 }}>No restaurants yet</div>
            <a href="/admin/new" style={{ display:'inline-block', padding:'12px 28px', background:`linear-gradient(135deg,${G},#E8C06A)`, borderRadius:12, color:'#0C0B07', fontWeight:800, fontSize:14, textDecoration:'none' }}>Create your first →</a>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(r => {
            const rOrders = orders.filter(o => o.restaurant_id === r.id)
            const rRevenue = rOrders.filter(o => o.status === 'completed').reduce((s, o) => s + (o.total || 0), 0)
            const rPending = rOrders.filter(o => o.status === 'pending').length
            const design = r.design || {}

            return (
              <div key={r.id} style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:16, padding:'20px 22px', display:'flex', alignItems:'center', gap:18 }}>
                {/* Color swatch */}
                <div style={{ width:48, height:48, borderRadius:13, background:design.bg || '#1a1a1a', border:'2px solid #252525', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                  {r.emoji || '🏪'}
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                    <div style={{ fontWeight:800, fontSize:16, color:'#f0f0f0' }}>{r.name}</div>
                    <div style={{ padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:700, background: r.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: r.status === 'active' ? '#10b981' : '#f59e0b' }}>
                      {r.status === 'active' ? '● Active' : '○ Pending'}
                    </div>
                    {rPending > 0 && <div style={{ padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:700, background:'rgba(249,115,22,0.12)', color:'#f97316' }}>{rPending} pending</div>}
                  </div>
                  <div style={{ fontSize:12, color:'#555', marginBottom:6 }}>{r.cuisine} · {r.address || 'No address'}</div>
                  <div style={{ display:'flex', gap:16, fontSize:12, color:'#444' }}>
                    <span>📦 {rOrders.length} orders</span>
                    <span>💰 {rRevenue.toFixed(0)} SAR</span>
                    <span style={{ fontFamily:'monospace' }}>qlick.sa/{r.slug}</span>
                  </div>
                </div>

                {/* Color bar */}
                {design.primary && (
                  <div style={{ width:4, height:48, borderRadius:2, background:design.primary, flexShrink:0 }} />
                )}

                {/* Actions */}
                <div style={{display:'flex', flexShrink:0, gap:8}}>
                  <a href={`/${r.slug}`} target="_blank" rel="noreferrer" style={{ padding:'8px 14px', background:'#1a1a1a', border:'1px solid #252525', borderRadius:9, color:'#888', fontSize:12, fontWeight:700, textDecoration:'none' }}>📱 App</a>
                  <a href={`/${r.slug}/dashboard`} target="_blank" rel="noreferrer" style={{ padding:'8px 14px', background:'#1a1a1a', border:'1px solid #252525', borderRadius:9, color:'#888', fontSize:12, fontWeight:700, textDecoration:'none' }}>📊 Dashboard</a>
                  <a href={`/admin/${r.id}/edit`} style={{ padding:'8px 14px', background:'#1a1a1a', border:'1px solid #252525', borderRadius:9, color:'#888', fontSize:12, fontWeight:700, textDecoration:'none' }}>✏️ Edit</a>
                  <button onClick={() => deleteRestaurant(r.id)} style={{ padding:'8px 14px', background:'#1a1a1a', border:'1px solid #252525', borderRadius:9, color:'#f87171', fontSize:12, fontWeight:700, cursor:'pointer' }}>🗑️</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
