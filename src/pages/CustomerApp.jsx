import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CustomerApp() {
  const { id: slug } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [screen, setScreen] = useState('splash') // splash | lang | main
  const [lang, setLang] = useState('en')
  const [tab, setTab] = useState('home')
  const [cart, setCart] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [activeCat, setActiveCat] = useState('')
  const [ordered, setOrdered] = useState(false)
  const [orderStatus, setOrderStatus] = useState(0)

  // ── CUSTOMER AUTH ────────────────────────────────────────────────────────────
  const [customerUser, setCustomerUser] = useState(null)
  const [authSheet, setAuthSheet] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'signup'
  const [authForm, setAuthForm] = useState({ name:'', phone:'', email:'', password:'' })
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [pendingOrder, setPendingOrder] = useState(false)
  const [customerOrders, setCustomerOrders] = useState([])

  const ar = lang === 'ar'
  const dir = ar ? 'rtl' : 'ltr'

  // Load customer session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('qlick_customer')
    if (stored) {
      try { setCustomerUser(JSON.parse(stored)) } catch (_) {}
    }
  }, [])

  useEffect(() => {
    const fetch = async () => {
      const { data: rest } = await supabase.from('restaurants').select('*').eq('slug', slug).single()
      if (!rest) { setLoading(false); return }
      setRestaurant(rest)
      const { data: items } = await supabase.from('menu_items').select('*').eq('restaurant_id', rest.id).eq('available', true).order('category')
      setMenu(items || [])
      if (items && items.length > 0) setActiveCat(items[0].category || 'General')
      setLoading(false)
    }
    fetch()
  }, [slug])

  // Load customer's orders for this restaurant
  useEffect(() => {
    if (customerUser?.email && restaurant) {
      supabase.from('orders').select('*')
        .eq('restaurant_id', restaurant.id)
        .eq('customer_email', customerUser.email)
        .order('created_at', { ascending: false })
        .then(({ data }) => setCustomerOrders(data || []))
    }
  }, [customerUser, restaurant])

  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreen('lang'), 2200)
      return () => clearTimeout(t)
    }
  }, [screen])

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center', color:'#444', fontFamily:'sans-serif' }}>
      Loading...
    </div>
  )

  if (!restaurant) return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'sans-serif' }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🍽️</div>
      <div style={{ fontSize:20, fontWeight:700, marginBottom:8 }}>Restaurant not found</div>
      <div style={{ fontSize:14, color:'#555' }}>This restaurant doesn't exist or has been removed.</div>
    </div>
  )

  const design = typeof restaurant.design === 'string' ? JSON.parse(restaurant.design) : (restaurant.design || {})
  const logoUrl = restaurant.logo_url || null
  const R = design.primary || '#E03020'
  const categories = [...new Set(menu.map(m => m.category || 'General'))]
  const catItems = menu.filter(m => (m.category || 'General') === activeCat)
  const totalItems = cart.reduce((s, c) => s + c.qty, 0)
  const totalPrice = cart.reduce((s, c) => s + c.price * c.qty, 0)

  const addToCart = (item, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id)
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + qty } : c)
      return [...prev, { ...item, qty }]
    })
  }
  const increase = id => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c))
  const decrease = id => setCart(prev => {
    const item = prev.find(c => c.id === id)
    if (item?.qty === 1) return prev.filter(c => c.id !== id)
    return prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c)
  })

  // ── AUTH ACTIONS ─────────────────────────────────────────────────────────────
  const openAuth = (mode = 'login') => {
    setAuthMode(mode); setAuthError(''); setAuthSheet(true)
  }

  const doSignIn = async () => {
    if (!authForm.email || !authForm.password) {
      setAuthError(ar ? 'يرجى إدخال البريد وكلمة المرور' : 'Enter email and password')
      return
    }
    setAuthLoading(true); setAuthError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: authForm.email.toLowerCase().trim(),
      password: authForm.password,
    })
    if (error) { setAuthError(ar ? 'بريد أو كلمة مرور غير صحيحة' : 'Invalid email or password'); setAuthLoading(false); return }
    const user = { email: authForm.email.toLowerCase().trim(), name: authForm.email.split('@')[0] }
    // Try to get name from existing order or auth metadata
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser?.user_metadata?.name) user.name = authUser.user_metadata.name
    if (authUser?.user_metadata?.phone) user.phone = authUser.user_metadata.phone
    localStorage.setItem('qlick_customer', JSON.stringify(user))
    setCustomerUser(user)
    setAuthSheet(false)
    setAuthLoading(false)
    setAuthForm({ name:'', phone:'', email:'', password:'' })
    if (pendingOrder) { setPendingOrder(false); await submitOrder(user) }
  }

  const doSignUp = async () => {
    if (!authForm.name || !authForm.email || !authForm.password) {
      setAuthError(ar ? 'يرجى إدخال الاسم والبريد وكلمة المرور' : 'Name, email and password are required')
      return
    }
    setAuthLoading(true); setAuthError('')
    const { error } = await supabase.auth.signUp({
      email: authForm.email.toLowerCase().trim(),
      password: authForm.password,
      options: { data: { name: authForm.name, phone: authForm.phone } },
    })
    if (error && !error.message.toLowerCase().includes('already registered')) {
      setAuthError(error.message); setAuthLoading(false); return
    }
    const user = { email: authForm.email.toLowerCase().trim(), name: authForm.name, phone: authForm.phone }
    localStorage.setItem('qlick_customer', JSON.stringify(user))
    setCustomerUser(user)
    setAuthSheet(false)
    setAuthLoading(false)
    setAuthForm({ name:'', phone:'', email:'', password:'' })
    if (pendingOrder) { setPendingOrder(false); await submitOrder(user) }
  }

  const doSignOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('qlick_customer')
    setCustomerUser(null)
    setCustomerOrders([])
  }

  // ── ORDER ACTIONS ────────────────────────────────────────────────────────────
  const placeOrder = () => {
    if (cart.length === 0) return
    if (!customerUser) { setPendingOrder(true); openAuth('login'); return }
    submitOrder(customerUser)
  }

  const submitOrder = async (user) => {
    await supabase.from('orders').insert({
      restaurant_id: restaurant.id,
      items: cart.map(c => ({ id: c.id, name: c.name, price: c.price, qty: c.qty })),
      total: totalPrice,
      status: 'pending',
      type: 'pickup',
      customer_name:  user.name  || '',
      customer_email: user.email || '',
      customer_phone: user.phone || '',
    })
    setOrdered(true)
    setCartOpen(false)
    setTimeout(() => setOrderStatus(1), 3000)
    setTimeout(() => setOrderStatus(2), 7000)
  }

  // ── INPUT STYLE ──────────────────────────────────────────────────────────────
  const inp = {
    width:'100%', padding:'12px 14px', background:'#f8f8f8', border:'1.5px solid #f0f0f0',
    borderRadius:12, fontSize:14, outline:'none', fontFamily:'inherit', boxSizing:'border-box', color:'#1a1a1a',
  }

  // ── SPLASH ──────────────────────────────────────────────────────────────────
  if (screen === 'splash') return (
    <div style={{ position:'fixed', inset:0, background:R, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:100, fontFamily:'sans-serif' }}>
      <style>{`@keyframes logoIn{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}} @keyframes shimmer{0%,100%{opacity:0.4}50%{opacity:1}}`}</style>
      <div style={{ animation:'logoIn 0.8s cubic-bezier(0.34,1.56,0.64,1) both' }}>
        <div style={{ width:120, height:120, background:'rgba(255,255,255,0.15)', borderRadius:32, display:'flex', alignItems:'center', justifyContent:'center', fontSize:64, marginBottom:20, backdropFilter:'blur(10px)' }}>
          {logoUrl ? <img src={logoUrl} alt={restaurant.name} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:32}}/> : <span style={{fontSize:64}}>{restaurant.emoji||'🍽️'}</span>}
        </div>
        <div style={{ textAlign:'center', color:'#fff', fontWeight:900, fontSize:28, letterSpacing:2 }}>{restaurant.name?.toUpperCase()}</div>
        {restaurant.tagline && <div style={{ textAlign:'center', color:'rgba(255,255,255,0.7)', fontSize:13, marginTop:4 }}>{restaurant.tagline}</div>}
      </div>
      <div style={{ position:'absolute', bottom:60, display:'flex', gap:6 }}>
        {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:3, background:'rgba(255,255,255,0.4)', animation:`shimmer 1s ease-in-out ${i*0.3}s infinite` }}/>)}
      </div>
    </div>
  )

  // ── LANGUAGE ────────────────────────────────────────────────────────────────
  if (screen === 'lang') return (
    <div style={{ position:'fixed', inset:0, background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, fontFamily:'sans-serif' }}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ width:80, height:80, borderRadius:24, background:R, display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, marginBottom:32, animation:'slideUp 0.5s ease both' }}>
        {restaurant.emoji||'🍽️'}
      </div>
      <div style={{ fontSize:22, fontWeight:700, color:'#1a1a1a', marginBottom:8, animation:'slideUp 0.5s 0.1s ease both' }}>Choose Language</div>
      <div style={{ fontSize:14, color:'#888', marginBottom:40, animation:'slideUp 0.5s 0.2s ease both' }}>اختر اللغة</div>
      <div style={{ width:'100%', maxWidth:340, display:'flex', flexDirection:'column', gap:12 }}>
        {[['عربي','ar',0.3],['English','en',0.4]].map(([label, code, delay]) => (
          <button key={code} onClick={()=>{ setLang(code); setScreen('main'); }} style={{ width:'100%', padding:'18px 24px', background:'#fff', border:'2px solid #e8e8e8', borderRadius:16, fontSize:17, fontWeight:600, color:'#1a1a1a', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between', animation:`slideUp 0.5s ${delay}s ease both` }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=R;e.currentTarget.style.background='#fff8f8'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='#e8e8e8';e.currentTarget.style.background='#fff'}}>
            {label}
            <span style={{ width:28, height:28, borderRadius:'50%', background:'#f5f5f5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  )

  // ── ITEM MODAL ───────────────────────────────────────────────────────────────
  const ItemModal = () => {
    const [qty, setQty] = useState(1)
    const item = selectedItem
    if (!item) return null
    return (
      <>
        <div onClick={()=>setSelectedItem(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }}/>
        <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:430, background:'#fff', borderRadius:'24px 24px 0 0', zIndex:201, maxHeight:'90vh', overflowY:'auto', fontFamily:'sans-serif' }}>
          <div style={{ height:200, background:`linear-gradient(135deg, ${R}22, ${R}44)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, position:'relative' }}>
            {item.emoji || '🍽️'}
            <button onClick={()=>setSelectedItem(null)} style={{ position:'absolute', top:16, right:16, width:36, height:36, borderRadius:'50%', background:'#fff', border:'none', fontSize:18, cursor:'pointer' }}>✕</button>
          </div>
          <div style={{ padding:'20px 20px 0' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <div style={{ fontSize:22, fontWeight:800, color:'#1a1a1a', flex:1 }}>{ar && item.name_ar ? item.name_ar : item.name}</div>
              <div style={{ fontSize:22, fontWeight:800, color:R }}>﷼{item.price}</div>
            </div>
            {item.description && <div style={{ fontSize:14, color:'#666', lineHeight:1.5, marginBottom:20 }}>{ar && item.description_ar ? item.description_ar : item.description}</div>}
          </div>
          <div style={{ padding:'16px 20px 32px', display:'flex', gap:12, alignItems:'center', borderTop:'1px solid #f5f5f5' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, background:'#f8f8f8', borderRadius:12, padding:'8px 16px' }}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{ width:28, height:28, borderRadius:'50%', background:qty>1?R:'#e8e8e8', border:'none', color:qty>1?'#fff':'#aaa', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
              <span style={{ fontWeight:700, fontSize:16, minWidth:20, textAlign:'center' }}>{qty}</span>
              <button onClick={()=>setQty(q=>q+1)} style={{ width:28, height:28, borderRadius:'50%', background:R, border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
            </div>
            <button onClick={()=>{ addToCart(item, qty); setSelectedItem(null); }} style={{ flex:1, padding:14, background:R, border:'none', borderRadius:14, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer' }}>
              {ar?'أضف':'Add'} · ﷼{(item.price * qty).toFixed(2)}
            </button>
          </div>
        </div>
      </>
    )
  }

  // ── AUTH SHEET ───────────────────────────────────────────────────────────────
  const AuthSheet = () => (
    <>
      <div onClick={()=>{ setAuthSheet(false); setPendingOrder(false); }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:400 }}/>
      <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:430, background:'#fff', borderRadius:'24px 24px 0 0', zIndex:401, padding:'24px 24px 40px', fontFamily:'sans-serif' }} dir={dir}>
        {/* Handle */}
        <div style={{ width:40, height:4, borderRadius:2, background:'#e0e0e0', margin:'0 auto 20px' }}/>

        {/* Mode toggle */}
        <div style={{ display:'flex', background:'#f5f5f5', borderRadius:14, padding:4, marginBottom:22 }}>
          {['login','signup'].map(m=>(
            <button key={m} onClick={()=>{ setAuthMode(m); setAuthError(''); }} style={{ flex:1, padding:'10px 0', background:authMode===m?'#fff':'transparent', border:'none', borderRadius:11, fontSize:14, fontWeight:700, color:authMode===m?'#1a1a1a':'#aaa', cursor:'pointer', transition:'all 0.2s', boxShadow:authMode===m?'0 1px 4px rgba(0,0,0,0.08)':'none' }}>
              {m==='login'?(ar?'تسجيل الدخول':'Sign In'):(ar?'إنشاء حساب':'Sign Up')}
            </button>
          ))}
        </div>

        {/* Sign Up extra fields */}
        {authMode === 'signup' && (
          <>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#bbb', marginBottom:5 }}>{ar?'الاسم':'NAME'}</div>
              <input value={authForm.name} onChange={e=>setAuthForm(p=>({...p,name:e.target.value}))} placeholder={ar?'اسمك الكامل':'Your name'} style={inp}
                onFocus={e=>{e.target.style.borderColor=R}} onBlur={e=>{e.target.style.borderColor='#f0f0f0'}}/>
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#bbb', marginBottom:5 }}>{ar?'الجوال':'PHONE'}</div>
              <input value={authForm.phone} onChange={e=>setAuthForm(p=>({...p,phone:e.target.value}))} placeholder="+966 5X XXX XXXX" style={inp} type="tel"
                onFocus={e=>{e.target.style.borderColor=R}} onBlur={e=>{e.target.style.borderColor='#f0f0f0'}}/>
            </div>
          </>
        )}

        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#bbb', marginBottom:5 }}>{ar?'البريد الإلكتروني':'EMAIL'}</div>
          <input value={authForm.email} onChange={e=>setAuthForm(p=>({...p,email:e.target.value}))} placeholder="you@example.com" type="email" style={inp}
            onFocus={e=>{e.target.style.borderColor=R}} onBlur={e=>{e.target.style.borderColor='#f0f0f0'}}/>
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#bbb', marginBottom:5 }}>{ar?'كلمة المرور':'PASSWORD'}</div>
          <input value={authForm.password} onChange={e=>setAuthForm(p=>({...p,password:e.target.value}))} placeholder="••••••••" type="password" style={inp}
            onFocus={e=>{e.target.style.borderColor=R}} onBlur={e=>{e.target.style.borderColor='#f0f0f0'}}/>
        </div>

        {authError && (
          <div style={{ background:'#fee2e2', border:'1px solid #fecaca', borderRadius:11, padding:'10px 13px', marginBottom:14, fontSize:13, color:'#ef4444', fontWeight:600 }}>
            ❌ {authError}
          </div>
        )}

        <button onClick={authMode==='login'?doSignIn:doSignUp} disabled={authLoading} style={{ width:'100%', padding:15, background:authLoading?'#ccc':R, border:'none', borderRadius:14, color:'#fff', fontSize:15, fontWeight:800, cursor:authLoading?'not-allowed':'pointer' }}>
          {authLoading ? '⏳' : authMode==='login'?(ar?'دخول':'Sign In'):(ar?'إنشاء حساب':'Create Account')}
        </button>

        {pendingOrder && (
          <div style={{ textAlign:'center', marginTop:14, fontSize:12, color:'#aaa' }}>
            {ar?'سجّل دخولك لإتمام طلبك':'Sign in to complete your order'}
          </div>
        )}
      </div>
    </>
  )

  // ── CART DRAWER ──────────────────────────────────────────────────────────────
  const CartDrawer = () => {
    if (ordered) return (
      <>
        <div onClick={()=>{setCartOpen(false);setOrdered(false);setOrderStatus(0);setCart([]);}} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:300 }}/>
        <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:430, background:'#fff', borderRadius:'24px 24px 0 0', zIndex:301, padding:'32px 24px 48px', textAlign:'center', fontFamily:'sans-serif' }}>
          <div style={{ fontSize:64, marginBottom:16 }}>✅</div>
          <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>{ar?'تم الطلب!':'Order Placed!'}</div>
          <div style={{ fontSize:14, color:'#888', marginBottom:32 }}>{ar?'وقت الاستلام المتوقع: 15-20 دقيقة':'Est. pickup: 15-20 min'}</div>
          <div style={{ background:'#f8f8f8', borderRadius:20, padding:20, marginBottom:24 }}>
            {[ar?'تم استلام الطلب':'Order Received', ar?'قيد التحضير 👨‍🍳':'Preparing 👨‍🍳', ar?'جاهز للاستلام 🥡':'Ready for Pickup 🥡'].map((step, i) => (
              <div key={step} style={{ display:'flex', alignItems:'center', gap:14, marginBottom:i<2?16:0 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:i<=orderStatus?R:'#e8e8e8', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:14, transition:'all 0.5s', flexShrink:0 }}>{i<orderStatus?'✓':i===orderStatus?'●':'○'}</div>
                <div style={{ fontSize:14, fontWeight:i<=orderStatus?700:400, color:i<=orderStatus?'#1a1a1a':'#aaa' }}>{step}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>{setCartOpen(false);setOrdered(false);setOrderStatus(0);setCart([]);}} style={{ width:'100%', padding:14, background:R, border:'none', borderRadius:14, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer' }}>{ar?'العودة للقائمة':'Back to Menu'}</button>
        </div>
      </>
    )

    return (
      <>
        <div onClick={()=>setCartOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:300 }}/>
        <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:430, background:'#fff', borderRadius:'24px 24px 0 0', zIndex:301, maxHeight:'80vh', overflowY:'auto', fontFamily:'sans-serif' }}>
          <div style={{ padding:'20px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontSize:20, fontWeight:800 }}>{ar?'طلبك':'Your Order'}</div>
            <button onClick={()=>setCartOpen(false)} style={{ width:34, height:34, borderRadius:'50%', background:'#f5f5f5', border:'none', fontSize:16, cursor:'pointer' }}>✕</button>
          </div>
          <div style={{ padding:'0 20px' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #f5f5f5' }}>
                <div style={{ fontSize:32 }}>{item.emoji||'🍽️'}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:14 }}>{ar&&item.name_ar?item.name_ar:item.name}</div>
                  <div style={{ fontWeight:700, fontSize:14, color:R }}>﷼{(item.price*item.qty).toFixed(2)}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <button onClick={()=>decrease(item.id)} style={{ width:30, height:30, borderRadius:'50%', background:'#f5f5f5', border:'none', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                  <span style={{ fontWeight:700, fontSize:15, minWidth:20, textAlign:'center' }}>{item.qty}</span>
                  <button onClick={()=>increase(item.id)} style={{ width:30, height:30, borderRadius:'50%', background:R, border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:'16px 20px', background:'#f8f8f8', margin:'16px 20px', borderRadius:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:16 }}>
              <span>{ar?'الإجمالي':'Total'}</span>
              <span style={{ color:R }}>﷼{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Show who is placing the order */}
          {customerUser ? (
            <div style={{ margin:'0 20px 16px', padding:'11px 14px', background:`${R}08`, borderRadius:12, display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:20 }}>👤</span>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'#1a1a1a' }}>{customerUser.name}</div>
                <div style={{ fontSize:11, color:'#888' }}>{customerUser.email}</div>
              </div>
            </div>
          ) : (
            <div style={{ margin:'0 20px 16px', padding:'11px 14px', background:'#fef3c7', borderRadius:12, fontSize:13, color:'#92400e', fontWeight:600 }}>
              ⚠️ {ar?'تحتاج لتسجيل الدخول لإتمام الطلب':'You need to sign in to place an order'}
            </div>
          )}

          <div style={{ padding:'0 20px 40px' }}>
            <button onClick={placeOrder} style={{ width:'100%', padding:16, background:R, border:'none', borderRadius:16, color:'#fff', fontSize:16, fontWeight:800, cursor:'pointer' }}>
              {!customerUser ? (ar?'تسجيل الدخول للطلب':'Sign In to Order') : `🥡 ${ar?'تأكيد الطلب':'Place Order'} · ﷼${totalPrice.toFixed(2)}`}
            </button>
          </div>
        </div>
      </>
    )
  }

  // ── STATUS BADGE ─────────────────────────────────────────────────────────────
  const statusStyle = (s) => {
    if (s === 'completed') return { bg:'#d1fae5', color:'#10b981', label: ar?'مكتمل':'Done' }
    if (s === 'preparing') return { bg:'#dbeafe', color:'#3b82f6', label: ar?'قيد التحضير':'Preparing' }
    if (s === 'ready')     return { bg:'#fef3c7', color:'#d97706', label: ar?'جاهز':'Ready' }
    if (s === 'rejected')  return { bg:'#fee2e2', color:'#ef4444', label: ar?'مرفوض':'Rejected' }
    return { bg:'#f0f0f0', color:'#888', label: ar?'قيد الانتظار':'Pending' }
  }

  const TABS = [
    { id:'home',    icon:'🏠', label:'Home',    labelAr:'الرئيسية' },
    { id:'orders',  icon:'📦', label:'Orders',  labelAr:'طلباتي' },
    { id:'rewards', icon:'🎁', label:'Rewards', labelAr:'المكافآت' },
    { id:'account', icon:'👤', label:'Account', labelAr:'حسابي' },
  ]

  // ── MAIN APP ─────────────────────────────────────────────────────────────────
  return (
    <div dir={dir} style={{ width:'100%', maxWidth:430, margin:'0 auto', height:'100vh', background:'#fafafa', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden', fontFamily:"'SF Pro Display',-apple-system,sans-serif" }}>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { display: none; }`}</style>

      {/* Header */}
      <div style={{ background:R, padding:'16px 20px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ color:'#fff', fontWeight:700, fontSize:16 }}>{restaurant.name}</div>
        <button onClick={()=>setCartOpen(true)} style={{ position:'relative', background:'rgba(255,255,255,0.2)', border:'none', borderRadius:12, padding:'8px 12px', cursor:'pointer' }}>
          <span style={{ fontSize:20 }}>🛍️</span>
          {totalItems > 0 && <div style={{ position:'absolute', top:-4, right:-4, width:18, height:18, borderRadius:'50%', background:'#fff', color:R, fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>{totalItems}</div>}
        </button>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column' }}>

        {/* ── HOME ── */}
        {tab === 'home' && (
          <div style={{ paddingBottom:totalItems>0?160:90 }}>
            <div style={{ display:'flex', gap:8, padding:'14px 16px', overflowX:'auto', scrollbarWidth:'none', position:'sticky', top:0, background:'#fff', zIndex:10, borderBottom:'1px solid #f5f5f5' }}>
              {categories.map(cat => (
                <button key={cat} onClick={()=>setActiveCat(cat)} style={{ flexShrink:0, padding:'8px 16px', borderRadius:20, border:'none', background:activeCat===cat?R:'#f5f5f5', color:activeCat===cat?'#fff':'#555', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.2s' }}>
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ padding:16 }}>
              <div style={{ fontSize:18, fontWeight:800, marginBottom:14, color:'#1a1a1a' }}>{activeCat}</div>
              {catItems.length === 0 ? (
                <div style={{ textAlign:'center', padding:40, color:'#aaa', fontSize:14 }}>No items in this category</div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {catItems.map(item => (
                    <button key={item.id} onClick={()=>setSelectedItem(item)} style={{ display:'flex', gap:14, background:'#fff', border:'1.5px solid #f0f0f0', borderRadius:18, padding:14, cursor:'pointer', textAlign:'left', width:'100%', transition:'all 0.2s' }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=R}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='#f0f0f0'}}>
                      <div style={{ width:90, height:90, borderRadius:14, background:`linear-gradient(135deg,${R}15,${R}25)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:50, flexShrink:0 }}>{item.emoji||'🍽️'}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:15, color:'#1a1a1a', marginBottom:4 }}>{ar&&item.name_ar?item.name_ar:item.name}</div>
                        {item.description && <div style={{ fontSize:12, color:'#888', lineHeight:1.4, marginBottom:8, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{ar&&item.description_ar?item.description_ar:item.description}</div>}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <span style={{ fontWeight:800, fontSize:16, color:R }}>﷼{item.price}</span>
                          <div style={{ width:32, height:32, borderRadius:'50%', background:R, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:20 }}>+</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div style={{ padding:'20px 16px 90px' }}>
            <div style={{ fontSize:20, fontWeight:800, marginBottom:20, color:'#1a1a1a' }}>{ar?'طلباتي':'My Orders'}</div>
            {!customerUser ? (
              <div style={{ textAlign:'center', padding:'40px 20px' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>📦</div>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>{ar?'سجّل دخولك لعرض طلباتك':'Sign in to see your orders'}</div>
                <div style={{ fontSize:13, color:'#888', marginBottom:24 }}>{ar?'جميع طلباتك في مكان واحد':'All your orders in one place'}</div>
                <button onClick={()=>openAuth('login')} style={{ padding:'12px 28px', background:R, border:'none', borderRadius:14, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                  {ar?'تسجيل الدخول':'Sign In'}
                </button>
              </div>
            ) : customerOrders.length === 0 ? (
              <div style={{ textAlign:'center', padding:40, color:'#aaa' }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📦</div>
                <div style={{ fontSize:14 }}>{ar?'لا توجد طلبات بعد':'No orders yet'}</div>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {customerOrders.map(order => {
                  const st = statusStyle(order.status)
                  return (
                    <div key={order.id} style={{ background:'#fff', borderRadius:16, padding:16, border:'1px solid #f0f0f0' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                        <div style={{ fontWeight:700, fontSize:13 }}>#{String(order.id).slice(-6).toUpperCase()}</div>
                        <span style={{ padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:700, background:st.bg, color:st.color }}>{st.label}</span>
                      </div>
                      <div style={{ fontSize:12, color:'#888', marginBottom:8 }}>
                        {new Date(order.created_at).toLocaleDateString(ar?'ar-SA':'en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                      </div>
                      {(order.items||[]).map((it,i)=>(
                        <div key={i} style={{ fontSize:13, color:'#555', marginBottom:3 }}>{it.emoji||''} {it.name} × {it.qty}</div>
                      ))}
                      <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, paddingTop:10, borderTop:'1px solid #f5f5f5' }}>
                        <span style={{ fontSize:13, color:'#888' }}>{ar?'الإجمالي':'Total'}</span>
                        <span style={{ fontWeight:800, color:R }}>﷼{order.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── REWARDS ── */}
        {tab === 'rewards' && (
          <div style={{ padding:'20px 16px 90px' }}>
            <div style={{ fontSize:20, fontWeight:800, marginBottom:20, color:'#1a1a1a' }}>{ar?'المكافآت':'Rewards'}</div>
            <div style={{ background:`linear-gradient(135deg,${R},${R}bb)`, borderRadius:24, padding:24, marginBottom:20, color:'#fff' }}>
              <div style={{ fontSize:13, opacity:0.8, marginBottom:4 }}>{ar?'نقاطك':'Your Points'}</div>
              <div style={{ fontSize:48, fontWeight:900, marginBottom:4 }}>0</div>
              <div style={{ fontSize:13, opacity:0.7 }}>{ar?'اطلب لتكسب نقاط':'Order to earn points'}</div>
            </div>
            {!customerUser && (
              <div style={{ textAlign:'center', padding:'16px 0' }}>
                <button onClick={()=>openAuth('signup')} style={{ padding:'12px 28px', background:R, border:'none', borderRadius:14, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                  {ar?'إنشاء حساب لكسب نقاط':'Sign up to earn points'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── ACCOUNT ── */}
        {tab === 'account' && (
          <div style={{ paddingBottom:90 }}>
            <div style={{ background:R, padding:'28px 20px 40px' }}>
              <div style={{ fontSize:18, fontWeight:700, color:'#fff', textAlign:'center' }}>{ar?'حسابي':'Account'}</div>
            </div>
            <div style={{ margin:'-24px 16px 0', background:'#fff', borderRadius:20, padding:20, display:'flex', alignItems:'center', gap:14, border:'1px solid #f0f0f0', boxShadow:'0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:`${R}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>
                {customerUser ? '👤' : '🔒'}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:16 }}>{customerUser ? customerUser.name : (ar?'ضيف':'Guest')}</div>
                <div style={{ fontSize:13, color:'#888' }}>{customerUser ? customerUser.email : (ar?'سجّل دخولك للمزيد':'Sign in for more features')}</div>
              </div>
              {customerUser && (
                <button onClick={doSignOut} style={{ padding:'7px 14px', background:'#fee2e2', border:'none', borderRadius:10, color:'#ef4444', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  {ar?'خروج':'Sign Out'}
                </button>
              )}
            </div>

            {!customerUser ? (
              <div style={{ padding:'20px 16px 0', display:'flex', flexDirection:'column', gap:10 }}>
                <button onClick={()=>openAuth('login')} style={{ width:'100%', padding:15, background:R, border:'none', borderRadius:14, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer' }}>
                  {ar?'تسجيل الدخول':'Sign In'}
                </button>
                <button onClick={()=>openAuth('signup')} style={{ width:'100%', padding:15, background:'#fff', border:`2px solid ${R}`, borderRadius:14, color:R, fontSize:15, fontWeight:700, cursor:'pointer' }}>
                  {ar?'إنشاء حساب جديد':'Create Account'}
                </button>
              </div>
            ) : (
              <div style={{ padding:'20px 16px 0' }}>
                {[
                  ['📦', ar?'طلباتي':'My Orders', `${customerOrders.length} ${ar?'طلب':'orders'}`, ()=>setTab('orders')],
                  ['🎁', ar?'نقاطي':'My Points', '0 pts', null],
                  ['🌐', ar?'English':'عربي', '', ()=>setLang(l=>l==='en'?'ar':'en')],
                ].map(([icon, label, sub, action]) => (
                  <button key={label} onClick={action||undefined} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'14px 0', background:'transparent', border:'none', borderBottom:'1px solid #f5f5f5', cursor:action?'pointer':'default', textAlign:'left' }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:'#f8f8f8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:14, color:'#1a1a1a' }}>{label}</div>
                      {sub && <div style={{ fontSize:12, color:'#888', marginTop:1 }}>{sub}</div>}
                    </div>
                    {action && <span style={{ color:'#ccc', fontSize:18 }}>›</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart bar */}
      {totalItems > 0 && tab === 'home' && (
        <div style={{ position:'absolute', bottom:72, left:12, right:12, zIndex:20 }}>
          <button onClick={()=>setCartOpen(true)} style={{ width:'100%', padding:'14px 20px', background:R, border:'none', borderRadius:16, color:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', fontSize:14, fontWeight:700, boxShadow:`0 8px 24px ${R}66` }}>
            <span style={{ background:'rgba(255,255,255,0.2)', borderRadius:20, padding:'3px 12px' }}>{totalItems} {ar?'منتج':'item'}{totalItems>1&&!ar?'s':''}</span>
            <span>{ar?'عرض الطلب':'View Order'}</span>
            <span>﷼{totalPrice.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Bottom nav */}
      <div style={{ background:'#fff', borderTop:'1px solid #f0f0f0', display:'flex', padding:'8px 0 16px', position:'relative', zIndex:10, flexShrink:0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'4px 0', background:'transparent', border:'none', cursor:'pointer' }}>
            <span style={{ fontSize:22 }}>{t.icon}</span>
            <span style={{ fontSize:10, fontWeight:600, color:tab===t.id?R:'#aaa' }}>{ar?t.labelAr:t.label}</span>
            {tab===t.id && <div style={{ width:4, height:4, borderRadius:'50%', background:R }}/>}
          </button>
        ))}
      </div>

      {selectedItem && <ItemModal/>}
      {cartOpen && <CartDrawer/>}
      {authSheet && <AuthSheet/>}
    </div>
  )
}
