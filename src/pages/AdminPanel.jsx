import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const R = "#E03020"
const DARK = "#0a0a0a"
const CARD = "#111"
const BORDER = "#1e1e1e"

// ── SMALL COMPONENTS ──────────────────────────────────────────────────────────
function StatCard({ icon, label, value, trend, color=R }) {
  return (
    <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:18, padding:"18px 20px", flex:1, minWidth:140 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div style={{ width:42, height:42, borderRadius:13, background:`${color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
        {trend!=null && <div style={{ fontSize:11, fontWeight:700, color:trend>=0?"#10b981":"#ef4444", background:trend>=0?"#d1fae520":"#fee2e220", padding:"3px 8px", borderRadius:20 }}>{trend>=0?"↑":"↓"}{Math.abs(trend)}%</div>}
      </div>
      <div style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:2 }}>{value}</div>
      <div style={{ fontSize:12, color:"#666" }}>{label}</div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    active:    { label:"Active",    color:"#10b981", bg:"#10b98120" },
    pending:   { label:"Pending",   color:"#f59e0b", bg:"#f59e0b20" },
    suspended: { label:"Suspended", color:"#ef4444", bg:"#ef444420" },
  }
  const s = map[status] || map.pending
  return <span style={{ padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, color:s.color, background:s.bg }}>{s.label}</span>
}

function PlanBadge({ plan }) {
  return <span style={{ padding:"3px 8px", borderRadius:10, fontSize:10, fontWeight:800, background:plan==="yearly"?"#6366f115":"#0ea5e915", color:plan==="yearly"?"#6366f1":"#0ea5e9", border:`1px solid ${plan==="yearly"?"#6366f133":"#0ea5e933"}` }}>{plan==="yearly"?"Yearly 🔥":"Monthly"}</span>
}

// ── PAGES ─────────────────────────────────────────────────────────────────────
function OverviewPage({ restaurants, onNavigate }) {
  const active = restaurants.filter(r=>r.status==="active").length
  const pending = restaurants.filter(r=>r.status==="pending").length
  const suspended = restaurants.filter(r=>r.status==="suspended").length
  const mrr = restaurants.filter(r=>r.status==="active").reduce((s,r)=>s+(r.subscription_plan==="yearly"?250:300),0)

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em" }}>Welcome back, Mohammed 👋</div>
          <div style={{ fontSize:13, color:"#555", marginTop:2 }}>Here's your platform overview</div>
        </div>
        <div style={{ fontSize:12, color:"#555", background:"#1a1a1a", padding:"7px 14px", borderRadius:20 }}>
          {new Date().toLocaleDateString("en",{weekday:"long",month:"long",day:"numeric"})}
        </div>
      </div>

      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
        <StatCard icon="🏪" label="Total Restaurants" value={restaurants.length} color="#6366f1"/>
        <StatCard icon="✅" label="Active" value={active} color="#10b981"/>
        <StatCard icon="⏳" label="Pending" value={pending} color="#f59e0b"/>
        <StatCard icon="💰" label="MRR" value={`﷼${mrr.toLocaleString()}`} color={R}/>
      </div>

      {pending > 0 && (
        <div style={{ background:"#f59e0b10", border:"1.5px solid #f59e0b33", borderRadius:16, padding:"16px 20px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:24 }}>⏳</span>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:"#f59e0b" }}>{pending} restaurant{pending>1?"s":""} waiting for approval</div>
              <div style={{ fontSize:12, color:"#666", marginTop:2 }}>Review and activate them to start earning</div>
            </div>
          </div>
          <button onClick={()=>onNavigate("approvals")} style={{ padding:"8px 18px", background:"#f59e0b", border:"none", borderRadius:10, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Review Now</button>
        </div>
      )}

      <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:20, padding:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontWeight:700, fontSize:15 }}>Recent Restaurants</div>
          <button onClick={()=>onNavigate("restaurants")} style={{ fontSize:13, color:R, background:"transparent", border:"none", cursor:"pointer", fontWeight:600 }}>View all →</button>
        </div>
        {restaurants.length === 0 ? (
          <div style={{ textAlign:"center", padding:40, color:"#444" }}>No restaurants yet. <button onClick={()=>onNavigate("new")} style={{ color:R, background:"none", border:"none", cursor:"pointer", fontWeight:700 }}>Create one →</button></div>
        ) : restaurants.slice(0,5).map(r => (
          <div key={r.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:"1px solid #1a1a1a" }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${R}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{r.emoji||"🍔"}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{r.name}</div>
              <div style={{ fontSize:11, color:"#555" }}>{r.owner_name || r.owner_email || "—"}</div>
            </div>
            <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
              <StatusBadge status={r.status}/>
              <PlanBadge plan={r.subscription_plan||"monthly"}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RestaurantsPage({ restaurants, onNavigate, onRefresh }) {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(null)

  const filtered = restaurants
    .filter(r => filter==="all" || r.status===filter)
    .filter(r => r.name?.toLowerCase().includes(search.toLowerCase()) || r.owner_name?.toLowerCase().includes(search.toLowerCase()) || r.owner_email?.toLowerCase().includes(search.toLowerCase()))

  const updateStatus = async (id, status) => {
    await supabase.from('restaurants').update({ status }).eq('id', id)
    onRefresh()
    setSelected(null)
  }

  if (selected) {
    const r = restaurants.find(x => x.id === selected)
    if (!r) return null
    return (
      <div>
        <button onClick={()=>setSelected(null)} style={{ display:"flex", alignItems:"center", gap:8, background:"transparent", border:"none", color:"#666", cursor:"pointer", fontSize:13, marginBottom:24, padding:0 }}>← Back</button>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28 }}>
          <div style={{ width:60, height:60, borderRadius:18, background:`${R}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>{r.emoji||"🍔"}</div>
          <div>
            <div style={{ fontSize:22, fontWeight:900 }}>{r.name}</div>
            <div style={{ fontSize:13, color:"#555" }}>{r.cuisine}</div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
            <StatusBadge status={r.status}/>
            <PlanBadge plan={r.subscription_plan||"monthly"}/>
          </div>
        </div>

        <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:20, padding:24, marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:"#555", marginBottom:16 }}>Info</div>
          {[["Owner", r.owner_name||"—"],["Email", r.owner_email||"—"],["Subscription", r.subscription_plan==="yearly"?"Yearly — ﷼3,000/yr":"Monthly — ﷼300/mo"],["Status", r.status],["Slug", r.slug]].map(([label, val]) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #1a1a1a", fontSize:13 }}>
              <span style={{ color:"#555" }}>{label}</span>
              <span style={{ fontWeight:600, color:"#fff" }}>{val}</span>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>window.open(`/${r.slug}`,'_blank')} style={{ flex:1, padding:"12px", background:`${R}15`, border:`1px solid ${R}33`, borderRadius:12, color:R, fontSize:13, fontWeight:700, cursor:"pointer" }}>📱 View App</button>
          <button onClick={()=>window.open(`/${r.slug}/dashboard`,'_blank')} style={{ flex:1, padding:"12px", background:"#6366f115", border:"1px solid #6366f133", borderRadius:12, color:"#6366f1", fontSize:13, fontWeight:700, cursor:"pointer" }}>📊 Dashboard</button>
          {r.status==="pending" && <button onClick={()=>updateStatus(r.id,"active")} style={{ flex:1, padding:"12px", background:"#10b981", border:"none", borderRadius:12, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>✅ Activate</button>}
          {r.status==="active" && <button onClick={()=>updateStatus(r.id,"suspended")} style={{ flex:1, padding:"12px", background:"#fee2e220", border:"1px solid #ef444433", borderRadius:12, color:"#ef4444", fontSize:13, fontWeight:700, cursor:"pointer" }}>⏸ Suspend</button>}
          {r.status==="suspended" && <button onClick={()=>updateStatus(r.id,"active")} style={{ flex:1, padding:"12px", background:"#10b98120", border:"1px solid #10b98133", borderRadius:12, color:"#10b981", fontSize:13, fontWeight:700, cursor:"pointer" }}>▶ Reactivate</button>}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em" }}>Restaurants</div>
        <button onClick={()=>onNavigate("new")} style={{ padding:"9px 20px", background:R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>+ New Restaurant</button>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, owner or email..." style={{ width:"100%", padding:"11px 16px", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:12, color:"#fff", fontSize:13, outline:"none", marginBottom:14, fontFamily:"inherit", boxSizing:"border-box" }}/>

      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {["all","active","pending","suspended"].map(f => (
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:"7px 14px", borderRadius:20, border:"1.5px solid", borderColor:filter===f?R:"#2a2a2a", background:filter===f?`${R}10`:"transparent", color:filter===f?R:"#555", fontSize:12, fontWeight:700, cursor:"pointer", textTransform:"capitalize" }}>
            {f} <span style={{ background:filter===f?R:"#2a2a2a", color:filter===f?"#fff":"#666", borderRadius:10, padding:"1px 6px", fontSize:10, marginLeft:4 }}>
              {f==="all"?restaurants.length:restaurants.filter(r=>r.status===f).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:40, color:"#444", fontSize:13 }}>No restaurants found</div>
      ) : filtered.map(r => (
        <div key={r.id} onClick={()=>setSelected(r.id)} style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:18, padding:18, marginBottom:10, cursor:"pointer" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="#333"}
          onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:`${R}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{r.emoji||"🍔"}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{r.name}</div>
                <PlanBadge plan={r.subscription_plan||"monthly"}/>
              </div>
              <div style={{ fontSize:12, color:"#555" }}>{r.owner_name||r.owner_email||"—"} · {r.slug}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <StatusBadge status={r.status}/>
            </div>
            <div style={{ color:"#444", fontSize:18 }}>›</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ApprovalsPage({ restaurants, onRefresh }) {
  const pending = restaurants.filter(r => r.status === "pending")

  const approve = async (id) => {
    await supabase.from('restaurants').update({ status: 'active' }).eq('id', id)
    onRefresh()
  }

  const reject = async (id) => {
    await supabase.from('restaurants').update({ status: 'suspended' }).eq('id', id)
    onRefresh()
  }

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em", marginBottom:20 }}>Pending Approvals</div>
      {pending.length === 0 ? (
        <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:20, padding:48, textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
          <div style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>All caught up!</div>
          <div style={{ fontSize:13, color:"#555" }}>No pending approvals right now.</div>
        </div>
      ) : pending.map(r => (
        <div key={r.id} style={{ background:CARD, border:"1.5px solid #f59e0b33", borderRadius:20, padding:22, marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
            <div style={{ width:52, height:52, borderRadius:16, background:`${R}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>{r.emoji||"🍔"}</div>
            <div>
              <div style={{ fontWeight:800, fontSize:16 }}>{r.name}</div>
              <div style={{ fontSize:12, color:"#555" }}>{r.cuisine}</div>
            </div>
            <div style={{ marginLeft:"auto" }}>
              <div style={{ fontSize:11, color:"#f59e0b", fontWeight:700, background:"#f59e0b20", padding:"4px 10px", borderRadius:20 }}>⏳ Pending Review</div>
            </div>
          </div>

          <div style={{ background:"#1a1a1a", borderRadius:14, padding:16, marginBottom:16 }}>
            {[["Owner", r.owner_name||"—"],["Email", r.owner_email||"—"],["Plan", r.subscription_plan==="yearly"?"Yearly — ﷼3,000":"Monthly — ﷼300"],["Slug", r.slug]].map(([label,val]) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #252525", fontSize:13 }}>
                <span style={{ color:"#555" }}>{label}</span>
                <span style={{ fontWeight:600, color:"#fff" }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>reject(r.id)} style={{ flex:1, padding:"12px", background:"#fee2e220", border:"1px solid #ef444433", borderRadius:12, color:"#ef4444", fontSize:14, fontWeight:700, cursor:"pointer" }}>❌ Reject</button>
            <button onClick={()=>approve(r.id)} style={{ flex:2, padding:"12px", background:"#10b981", border:"none", borderRadius:12, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>✅ Approve & Activate</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function NewRestaurantPage() {
  const navigate = useNavigate()
  return (
    <div style={{ textAlign:"center", padding:"60px 0" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🍔</div>
      <div style={{ fontSize:20, fontWeight:800, marginBottom:8 }}>Create New Restaurant</div>
      <div style={{ fontSize:14, color:"#555", marginBottom:24 }}>Use the full wizard to set up a new restaurant</div>
      <button onClick={()=>navigate('/admin/new')} style={{ padding:"14px 32px", background:R, border:"none", borderRadius:14, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer" }}>🚀 Open Restaurant Wizard</button>
    </div>
  )
}

function BillingPage({ restaurants }) {
  const active = restaurants.filter(r=>r.status==="active")
  const mrr = active.reduce((s,r)=>s+(r.subscription_plan==="yearly"?250:300),0)
  const arr = mrr * 12

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em", marginBottom:20 }}>Billing & Revenue</div>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
        <StatCard icon="💰" label="MRR" value={`﷼${mrr.toLocaleString()}`} color="#10b981"/>
        <StatCard icon="📈" label="ARR" value={`﷼${arr.toLocaleString()}`} color={R}/>
        <StatCard icon="✅" label="Active" value={active.length} color="#6366f1"/>
        <StatCard icon="⏸" label="Suspended" value={restaurants.filter(r=>r.status==="suspended").length} color="#f59e0b"/>
      </div>

      <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:20, padding:24 }}>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>All Subscriptions</div>
        {restaurants.length === 0 ? (
          <div style={{ color:"#444", fontSize:13, textAlign:"center", padding:24 }}>No restaurants yet</div>
        ) : restaurants.map(r => (
          <div key={r.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:"1px solid #1a1a1a" }}>
            <div style={{ fontSize:22 }}>{r.emoji||"🍔"}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{r.name}</div>
              <div style={{ fontSize:11, color:"#555" }}>{r.owner_email||"—"}</div>
            </div>
            <PlanBadge plan={r.subscription_plan||"monthly"}/>
            <div style={{ fontWeight:800, fontSize:14, color:r.status==="active"?"#10b981":r.status==="suspended"?"#ef4444":"#f59e0b" }}>
              {r.status==="active"?`﷼${r.subscription_plan==="yearly"?250:300}/mo`:r.status==="suspended"?"Suspended":"Pending"}
            </div>
            <StatusBadge status={r.status}/>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const inp = { width:"100%", padding:"10px 14px", background:"#1a1a1a", border:"1.5px solid #2a2a2a", borderRadius:12, color:"#fff", fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }
  return (
    <div style={{ maxWidth:600 }}>
      <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em", marginBottom:20 }}>Platform Settings</div>
      <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:20, padding:24, marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:"#555", marginBottom:16 }}>Pricing</div>
        {[["Monthly Price (SAR)","300"],["Yearly Price (SAR)","3000"]].map(([l,v]) => (
          <div key={l} style={{ marginBottom:12 }}>
            <div style={{ fontSize:12, color:"#555", marginBottom:5 }}>{l}</div>
            <input defaultValue={v} style={inp}/>
          </div>
        ))}
      </div>
      <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:20, padding:24, marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:"#555", marginBottom:16 }}>Account</div>
        {[["Admin Email","admin@qlick.help"],["Platform Name","Qlick"],["Domain","qlick.help"]].map(([l,v]) => (
          <div key={l} style={{ marginBottom:12 }}>
            <div style={{ fontSize:12, color:"#555", marginBottom:5 }}>{l}</div>
            <input defaultValue={v} style={inp}/>
          </div>
        ))}
      </div>
      <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}} style={{ padding:"12px 24px", background:saved?"#10b981":R, border:"none", borderRadius:12, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", transition:"background 0.3s" }}>
        {saved?"✓ Saved!":"Save Settings"}
      </button>
    </div>
  )
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !pw) { setError("Please fill in all fields"); return }
    setLoading(true)
    setError("")
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password: pw })
      if (authError) {
        if (pw === import.meta.env.VITE_ADMIN_PASSWORD) {
          sessionStorage.setItem('qlick_admin', 'true')
          onLogin()
        } else {
          setError("Incorrect email or password")
        }
      } else {
        sessionStorage.setItem('qlick_admin', 'true')
        onLogin()
      }
    } catch {
      if (pw === import.meta.env.VITE_ADMIN_PASSWORD) {
        sessionStorage.setItem('qlick_admin', 'true')
        onLogin()
      } else {
        setError("Incorrect email or password")
      }
    }
    setLoading(false)
  }

  const inp = (err) => ({ width:"100%", padding:"12px 16px", background:"#1a1a1a", border:`1.5px solid ${err?"#ef4444":"#2a2a2a"}`, borderRadius:12, color:"#fff", fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box", marginBottom:12 })

  return (
    <div style={{ minHeight:"100vh", background:DARK, display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"'DM Sans',-apple-system,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>
      <div style={{ width:"100%", maxWidth:380 }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ width:64, height:64, borderRadius:20, background:R, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 16px" }}>🍔</div>
          <div style={{ fontSize:28, fontWeight:900, color:"#fff", letterSpacing:"-0.03em" }}>qlick</div>
          <div style={{ fontSize:13, color:"#555", marginTop:4 }}>Admin Panel</div>
        </div>
        <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:24, padding:32 }}>
          <div style={{ fontSize:18, fontWeight:800, marginBottom:20 }}>Welcome back 👋</div>
          <div style={{ fontSize:12, color:"#555", marginBottom:6 }}>Email</div>
          <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setError("")}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="admin@qlick.help" style={inp(error)}
            onFocus={e=>e.target.style.borderColor=R} onBlur={e=>e.target.style.borderColor=error?"#ef4444":"#2a2a2a"}/>
          <div style={{ fontSize:12, color:"#555", marginBottom:6 }}>Password</div>
          <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setError("")}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="Your password" style={inp(error)}
            onFocus={e=>e.target.style.borderColor=R} onBlur={e=>e.target.style.borderColor=error?"#ef4444":"#2a2a2a"}/>
          {error && <div style={{ fontSize:12, color:"#ef4444", marginBottom:8 }}>{error}</div>}
          <button onClick={handleLogin} disabled={loading} style={{ width:"100%", padding:"13px", background:R, border:"none", borderRadius:12, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", marginTop:4, opacity:loading?0.7:1, fontFamily:"inherit" }}>
            {loading?"Signing in...":"Sign In →"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── NAV ───────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"overview",     icon:"📊", label:"Overview" },
  { id:"restaurants",  icon:"🏪", label:"Restaurants" },
  { id:"approvals",    icon:"⏳", label:"Approvals", alert:true },
  { id:"new",          icon:"➕", label:"New Restaurant" },
  { id:"billing",      icon:"💰", label:"Billing" },
  { id:"settings",     icon:"⚙️", label:"Settings" },
]

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(!!sessionStorage.getItem('qlick_admin'))
  const [page, setPage] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRestaurants = async () => {
    const { data } = await supabase.from('restaurants').select('*').order('created_at', { ascending: false })
    setRestaurants(data || [])
    setLoading(false)
  }

  useEffect(() => { if (loggedIn) fetchRestaurants() }, [loggedIn])

  const pendingCount = restaurants.filter(r => r.status === "pending").length

  const signOut = () => {
    supabase.auth.signOut()
    sessionStorage.removeItem('qlick_admin')
    setLoggedIn(false)
  }

  if (!loggedIn) return <LoginPage onLogin={()=>setLoggedIn(true)}/>

  return (
    <div style={{ minHeight:"100vh", background:DARK, color:"#fff", fontFamily:"'DM Sans',-apple-system,sans-serif", display:"flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#2a2a2a; border-radius:2px; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Sidebar */}
      <div style={{ width:sidebarOpen?230:62, minWidth:sidebarOpen?230:62, background:CARD, borderRight:`1px solid ${BORDER}`, display:"flex", flexDirection:"column", transition:"width 0.3s ease", overflow:"hidden", position:"sticky", top:0, height:"100vh", alignSelf:"flex-start" }}>
        <div style={{ padding:"18px 14px", borderBottom:`1px solid ${BORDER}`, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:12, background:R, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🍔</div>
          {sidebarOpen && <div style={{ overflow:"hidden" }}>
            <div style={{ fontWeight:800, fontSize:14 }}>qlick.help</div>
            <div style={{ fontSize:10, color:"#555" }}>Admin Panel</div>
          </div>}
        </div>

        <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
          {NAV.map(item => (
            <button key={item.id} onClick={()=>setPage(item.id)} style={{ width:"100%", padding:"10px 11px", marginBottom:2, background:page===item.id?`${R}15`:"transparent", border:"none", borderRadius:11, color:page===item.id?R:"#555", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:9, textAlign:"left", transition:"all 0.15s", position:"relative" }}>
              <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace:"nowrap" }}>{item.label}</span>}
              {item.alert && pendingCount > 0 && (
                <span style={{ marginLeft:"auto", background:"#f59e0b", color:"#fff", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:900, flexShrink:0 }}>{pendingCount}</span>
              )}
              {page===item.id && <div style={{ position:"absolute", left:0, top:"20%", bottom:"20%", width:3, borderRadius:"0 2px 2px 0", background:R }}/>}
            </button>
          ))}
        </nav>

        <div style={{ padding:"10px 8px", borderTop:`1px solid ${BORDER}` }}>
          <button onClick={signOut} style={{ width:"100%", padding:"10px 11px", background:"transparent", border:"1px solid #2a2a2a", borderRadius:11, color:"#555", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:9, fontFamily:"inherit" }}>
            <span>🚪</span>{sidebarOpen&&<span>Sign Out</span>}
          </button>
        </div>

        <button onClick={()=>setSidebarOpen(v=>!v)} style={{ padding:12, background:"transparent", border:"none", borderTop:`1px solid ${BORDER}`, color:"#333", fontSize:12, cursor:"pointer" }}>
          {sidebarOpen?"◀":"▶"}
        </button>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"28px 32px", minHeight:"100vh" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:80, color:"#444" }}>Loading...</div>
        ) : (
          <div style={{ maxWidth:960, margin:"0 auto", animation:"fadeIn 0.25s ease" }} key={page}>
            {page==="overview"    && <OverviewPage restaurants={restaurants} onNavigate={setPage}/>}
            {page==="restaurants" && <RestaurantsPage restaurants={restaurants} onNavigate={setPage} onRefresh={fetchRestaurants}/>}
            {page==="approvals"   && <ApprovalsPage restaurants={restaurants} onRefresh={fetchRestaurants}/>}
            {page==="new"         && <NewRestaurantPage/>}
            {page==="billing"     && <BillingPage restaurants={restaurants}/>}
            {page==="settings"    && <SettingsPage/>}
          </div>
        )}
      </div>
    </div>
  )
}
