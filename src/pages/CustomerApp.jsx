import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// ── Haversine distance (km) ───────────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

// ── Item Modal ────────────────────────────────────────────────────────────────
function ItemModal({ item, ar, R, onClose, onAdd }) {
  const [qty, setQty] = useState(1)
  if (!item) return null
  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }}/>
      <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:430, background:'#fff', borderRadius:'24px 24px 0 0', zIndex:201, maxHeight:'90vh', overflowY:'auto', fontFamily:'sans-serif' }}>
        <div style={{ height:200, background:`linear-gradient(135deg, ${R}22, ${R}44)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, position:'relative' }}>
          {item.emoji || '🍽️'}
          <button onClick={onClose} style={{ position:'absolute', top:16, right:16, width:36, height:36, borderRadius:'50%', background:'#fff', border:'none', fontSize:18, cursor:'pointer' }}>✕</button>
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
          <button onClick={()=>{ onAdd(item, qty); onClose(); }} style={{ flex:1, padding:14, background:R, border:'none', borderRadius:14, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer' }}>
            {ar?'أضف':'Add'} · ﷼{(item.price * qty).toFixed(2)}
          </button>
        </div>
      </div>
    </>
  )
}

// ── Auth Sheet — standalone component so inputs never lose focus ──────────────
function AuthSheet({ ar, R, initialMode, pendingOrder, onSuccess, onClose }) {
  const [mode, setMode]       = useState(initialMode || 'login')
  const [form, setForm]       = useState({ name:'', phone:'', email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const dir = ar ? 'rtl' : 'ltr'
  const inp = {
    width:'100%', padding:'12px 14px', background:'#f8f8f8', border:'1.5px solid #f0f0f0',
    borderRadius:12, fontSize:14, outline:'none', fontFamily:'inherit', boxSizing:'border-box', color:'#1a1a1a',
  }

  const doSignIn = async () => {
    setLoading(true); setError('')
    const { data, error: e } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (e) { setError(e.message); setLoading(false); return }
    const meta = data.user.user_metadata || {}
    const user = { id: data.user.id, email: data.user.email, name: meta.name || data.user.email.split('@')[0], phone: meta.phone || '' }
    setLoading(false)
    onSuccess(user)
  }

  const doSignUp = async () => {
    setLoading(true); setError('')
    const { data, error: e } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name, phone: form.phone } },
    })
    if (e) { setError(e.message); setLoading(false); return }
    const user = { id: data.user.id, email: form.email, name: form.name, phone: form.phone }
    setLoading(false)
    onSuccess(user)
  }

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:400 }}/>
      <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:430, background:'#fff', borderRadius:'24px 24px 0 0', zIndex:401, padding:'24px 24px 40px', fontFamily:'sans-serif' }} dir={dir}>
        {/* Handle */}
        <div style={{ width:40, height:4, borderRadius:2, background:'#e0e0e0', margin:'0 auto 20px' }}/>

        {/* Mode toggle */}
        <div style={{ display:'flex', background:'#f5f5f5', borderRadius:14, padding:4, marginBottom:22 }}>
          {['login','signup'].map(m => (
            <button key={m} onClick={()=>{ setMode(m); setError('') }} style={{ flex:1, padding:'10px 0', background:mode===m?'#fff':'transparent', border:'none', borderRadius:11, fontSize:14, fontWeight:700, color:mode===m?'#1a1a1a':'#aaa', cursor:'pointer', transition:'all 0.2s', boxShadow:mode===m?'0 1px 4px rgba(0,0,0,0.08)':'none' }}>
              {m==='login'?(ar?'تسجيل الدخول':'Sign In'):(ar?'إنشاء حساب':'Sign Up')}
            </button>
          ))}
        </div>

        {/* Sign up extra fields */}
        {mode === 'signup' && (
          <>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#bbb', marginBottom:5 }}>{ar?'الاسم':'NAME'}</div>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder={ar?'اسمك الكامل':'Your name'}
                style={inp}
                onFocus={e=>{ e.target.style.borderColor=R }}
                onBlur={e=>{ e.target.style.borderColor='#f0f0f0' }}
              />
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#bbb', marginBottom:5 }}>{ar?'الجوال':'PHONE'}</div>
              <input
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="+966 5X XXX XXXX"
                type="tel"
                style={inp}
                onFocus={e=>{ e.target.style.borderColor=R }}
                onBlur={e=>{ e.target.style.borderColor='#f0f0f0' }}
              />
            </div>
          </>
        )}

        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#bbb', marginBottom:5 }}>{ar?'البريد الإلكتروني':'EMAIL'}</div>
          <input
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            placeholder="you@example.com"
            type="email"
            style={inp}
            onFocus={e=>{ e.target.style.borderColor=R }}
            onBlur={e=>{ e.target.style.borderColor='#f0f0f0' }}
          />
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#bbb', marginBottom:5 }}>{ar?'كلمة المرور':'PASSWORD'}</div>
          <input
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            placeholder="••••••••"
            type="password"
            style={inp}
            onFocus={e=>{ e.target.style.borderColor=R }}
            onBlur={e=>{ e.target.style.borderColor='#f0f0f0' }}
          />
        </div>

        {error && (
          <div style={{ background:'#fee2e2', border:'1px solid #fecaca', borderRadius:11, padding:'10px 13px', marginBottom:14, fontSize:13, color:'#ef4444', fontWeight:600 }}>
            ❌ {error}
          </div>
        )}

        <button
          onClick={mode==='login' ? doSignIn : doSignUp}
          disabled={loading}
          style={{ width:'100%', padding:15, background:loading?'#ccc':R, border:'none', borderRadius:14, color:'#fff', fontSize:15, fontWeight:800, cursor:loading?'not-allowed':'pointer' }}>
          {loading ? '⏳' : mode==='login'?(ar?'دخول':'Sign In'):(ar?'إنشاء حساب':'Create Account')}
        </button>

        {pendingOrder && (
          <div style={{ textAlign:'center', marginTop:14, fontSize:12, color:'#aaa' }}>
            {ar?'سجّل دخولك لإتمام طلبك':'Sign in to complete your order'}
          </div>
        )}
      </div>
    </>
  )
}

// ── Order Details Sheet — standalone component so inputs never lose focus ─────
function OrderDetailsSheet({ ar, R, orderType, deliveryResult, subtotal, deliveryFee, discount, totalPrice, cart, onConfirm, onClose }) {
  const [details, setDetails]     = useState({ address:'', apt:'', deliveryNotes:'', orderNotes:'', paymentMethod:'cash' })
  const [confirming, setConfirming] = useState(false)

  const dir = ar ? 'rtl' : 'ltr'
  const darkInp = {
    width:'100%', padding:'12px 14px', background:'#1e1e1e', border:'1.5px solid rgba(255,255,255,0.1)',
    borderRadius:12, fontSize:14, outline:'none', fontFamily:'inherit', boxSizing:'border-box',
    color:'#fff', WebkitTextFillColor:'#fff',
  }
  const PAYMENT_METHODS = [
    { id:'apple_pay', icon:'', label:'Apple Pay' },
    { id:'mada',      icon:'💳', label:'Mada' },
    { id:'stc_pay',   icon:'📱', label:'STC Pay' },
    { id:'cash',      icon:'💵', label: ar?'الدفع عند الاستلام':'Cash on Delivery' },
  ]

  const handleConfirm = async () => {
    setConfirming(true)
    await onConfirm(details)
    setConfirming(false)
  }

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:500 }}/>
      <div dir={dir} style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:430, background:'#0f0f0f', borderRadius:'24px 24px 0 0', zIndex:501, maxHeight:'92vh', overflowY:'auto', fontFamily:"'SF Pro Display',-apple-system,sans-serif", paddingBottom:40 }}>
        <style>{`@keyframes sheetUp{from{transform:translateX(-50%) translateY(100%)}to{transform:translateX(-50%) translateY(0)}}`}</style>

        {/* Handle */}
        <div style={{ width:40, height:4, borderRadius:2, background:'rgba(255,255,255,0.15)', margin:'14px auto 0' }}/>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px 12px' }}>
          <div style={{ fontSize:18, fontWeight:800, color:'#fff' }}>
            {ar?'تفاصيل الطلب':'Order Details'}
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        {/* Order summary strip */}
        <div style={{ margin:'0 20px 20px', background:'#1a1a1a', borderRadius:16, padding:'14px 16px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#555', letterSpacing:'0.06em', marginBottom:10 }}>
            {ar?'ملخص الطلب':'ORDER SUMMARY'}
          </div>
          {cart.map(item => (
            <div key={item.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:16 }}>{item.emoji||'🍽️'}</span>
                <span style={{ fontSize:13, color:'#ccc' }}>{ar&&item.name_ar?item.name_ar:item.name}</span>
                <span style={{ fontSize:12, color:'#555' }}>×{item.qty}</span>
              </div>
              <span style={{ fontSize:13, color:'#aaa', fontWeight:600 }}>﷼{(item.price*item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Delivery address */}
        {orderType === 'delivery' && (
          <div style={{ margin:'0 20px 20px' }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#555', letterSpacing:'0.06em', marginBottom:12 }}>
              📍 {ar?'عنوان التوصيل':'DELIVERY ADDRESS'}
            </div>
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:11, color:'#555', marginBottom:5 }}>{ar?'العنوان الكامل':'Full address'} *</div>
              <input
                value={details.address}
                onChange={e => setDetails(p => ({ ...p, address: e.target.value }))}
                placeholder={ar?'الشارع والحي والمدينة':'Street, district, city'}
                style={darkInp}
                onFocus={e=>{ e.target.style.borderColor=R }}
                onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,0.1)' }}
              />
            </div>
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:11, color:'#555', marginBottom:5 }}>{ar?'رقم الشقة / المبنى (اختياري)':'Apt / Building (optional)'}</div>
              <input
                value={details.apt}
                onChange={e => setDetails(p => ({ ...p, apt: e.target.value }))}
                placeholder={ar?'مثال: شقة 5، برج النخيل':'e.g. Apt 5, Tower B'}
                style={darkInp}
                onFocus={e=>{ e.target.style.borderColor=R }}
                onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,0.1)' }}
              />
            </div>
            <div>
              <div style={{ fontSize:11, color:'#555', marginBottom:5 }}>{ar?'ملاحظات التوصيل (اختياري)':'Delivery notes (optional)'}</div>
              <input
                value={details.deliveryNotes}
                onChange={e => setDetails(p => ({ ...p, deliveryNotes: e.target.value }))}
                placeholder={ar?'مثال: اتصل عند الوصول':'e.g. Call when arrived'}
                style={darkInp}
                onFocus={e=>{ e.target.style.borderColor=R }}
                onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>
        )}

        {/* Order notes */}
        <div style={{ margin:'0 20px 20px' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#555', letterSpacing:'0.06em', marginBottom:12 }}>
            📝 {ar?'ملاحظات الطلب':'ORDER NOTES'}
          </div>
          <textarea
            value={details.orderNotes}
            onChange={e => setDetails(p => ({ ...p, orderNotes: e.target.value }))}
            placeholder={ar?'أي طلبات خاصة؟ (اختياري)':'Any special requests? (optional)'}
            rows={3}
            style={{ ...darkInp, resize:'none', lineHeight:1.5 }}
            onFocus={e=>{ e.target.style.borderColor=R }}
            onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,0.1)' }}
          />
        </div>

        {/* Payment method */}
        <div style={{ margin:'0 20px 24px' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#555', letterSpacing:'0.06em', marginBottom:12 }}>
            💳 {ar?'طريقة الدفع':'PAYMENT METHOD'}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {PAYMENT_METHODS.map(pm => (
              <button
                key={pm.id}
                onClick={() => setDetails(p => ({ ...p, paymentMethod: pm.id }))}
                style={{
                  display:'flex', alignItems:'center', gap:12, padding:'14px 16px',
                  background: details.paymentMethod===pm.id ? `${R}18` : '#1a1a1a',
                  border: `1.5px solid ${details.paymentMethod===pm.id ? R : 'rgba(255,255,255,0.08)'}`,
                  borderRadius:14, cursor:'pointer', textAlign:'left', width:'100%', transition:'all 0.15s',
                }}>
                <div style={{
                  width:22, height:22, borderRadius:'50%',
                  background: details.paymentMethod===pm.id ? R : 'rgba(255,255,255,0.1)',
                  border: `2px solid ${details.paymentMethod===pm.id ? R : 'rgba(255,255,255,0.2)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  {details.paymentMethod===pm.id && <div style={{ width:8, height:8, borderRadius:'50%', background:'#fff' }}/>}
                </div>
                <span style={{ fontSize:16 }}>{pm.icon}</span>
                <span style={{ fontSize:14, fontWeight:600, color: details.paymentMethod===pm.id ? '#fff' : '#aaa' }}>{pm.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price breakdown + confirm */}
        <div style={{ margin:'0 20px' }}>
          <div style={{ background:'#1a1a1a', borderRadius:16, padding:'16px', marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:13, color:'#666' }}>{ar?'المجموع الفرعي':'Subtotal'}</span>
              <span style={{ fontSize:13, color:'#aaa' }}>﷼{subtotal.toFixed(2)}</span>
            </div>
            {orderType === 'delivery' && (
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:13, color:'#666' }}>{ar?'التوصيل':'Delivery'}</span>
                <span style={{ fontSize:13, color: deliveryFee===0?'#10b981':'#aaa' }}>
                  {deliveryFee===0?(ar?'مجاني':'Free'):`﷼${deliveryFee}`}
                </span>
              </div>
            )}
            {discount > 0 && (
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:13, color:'#10b981', fontWeight:600 }}>{ar?'🎉 الخصم':'🎉 Discount'}</span>
                <span style={{ fontSize:13, color:'#10b981', fontWeight:700 }}>−﷼{discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:10, display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:16, fontWeight:800, color:'#fff' }}>{ar?'الإجمالي':'Total'}</span>
              <span style={{ fontSize:16, fontWeight:900, color:R }}>﷼{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={confirming || (orderType==='delivery' && !details.address.trim())}
            style={{
              width:'100%', padding:17,
              background: confirming||(orderType==='delivery'&&!details.address.trim()) ? '#333' : R,
              border:'none', borderRadius:16, color:'#fff', fontSize:16, fontWeight:800,
              cursor: confirming||(orderType==='delivery'&&!details.address.trim()) ? 'not-allowed' : 'pointer',
              transition:'all 0.2s',
            }}>
            {confirming
              ? `⏳ ${ar?'جاري الإرسال...':'Placing order...'}`
              : `${orderType==='delivery'?'🛵':'🥡'} ${ar?'تأكيد الطلب':'Confirm Order'} · ﷼${totalPrice.toFixed(2)}`}
          </button>
          {orderType==='delivery' && !details.address.trim() && (
            <div style={{ textAlign:'center', marginTop:8, fontSize:12, color:'#555' }}>
              {ar?'أدخل عنوان التوصيل للمتابعة':'Enter delivery address to continue'}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ── CustomerApp ───────────────────────────────────────────────────────────────
export default function CustomerApp() {
  const { id: slug } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [branches, setBranches] = useState([])
  const [deliveryZones, setDeliveryZones] = useState([])
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

  // ── ORDER TYPE & DELIVERY ────────────────────────────────────────────────────
  const [orderType, setOrderType] = useState('pickup')
  const [deliveryStep, setDeliveryStep] = useState('idle')
  const [customerCoords, setCustomerCoords] = useState(null)
  const [deliveryResult, setDeliveryResult] = useState(null)

  // ── CUSTOMER AUTH ────────────────────────────────────────────────────────────
  const [customerUser, setCustomerUser] = useState(null)
  const [authSheet, setAuthSheet] = useState(false)
  const [authInitialMode, setAuthInitialMode] = useState('login')
  const [pendingOrder, setPendingOrder] = useState(false)
  const [customerOrders, setCustomerOrders] = useState([])

  // ── ORDER DETAILS SHEET ──────────────────────────────────────────────────────
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)

  // ── COUPON & LOYALTY ─────────────────────────────────────────────────────────
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(null) // { code, type, value, discount, id, uses }
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [usingPoints, setUsingPoints] = useState(false)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)

  const ar = lang === 'ar'
  const dir = ar ? 'rtl' : 'ltr'

  // Load customer session
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
      const [{ data: items }, { data: br }, { data: dz }] = await Promise.all([
        supabase.from('menu_items').select('*').eq('restaurant_id', rest.id).eq('available', true).order('category'),
        supabase.from('branches').select('id,name,name_ar,lat,lng,status').eq('restaurant_id', rest.id),
        supabase.from('delivery_zones').select('*').eq('restaurant_id', rest.id).order('min_km', { ascending: true }),
      ])
      setMenu(items || [])
      setBranches(br || [])
      setDeliveryZones(dz || [])
      if (items && items.length > 0) setActiveCat(items[0].category || 'General')
      setLoading(false)
    }
    fetch()
  }, [slug])

  // Load customer orders
  useEffect(() => {
    if (customerUser?.email && restaurant) {
      supabase.from('orders').select('*')
        .eq('restaurant_id', restaurant.id)
        .eq('customer_email', customerUser.email)
        .order('created_at', { ascending: false })
        .then(({ data }) => setCustomerOrders(data || []))
    }
  }, [customerUser, restaurant])

  // Load loyalty points
  useEffect(() => {
    if (customerUser?.email && restaurant) {
      supabase.from('loyalty').select('points')
        .eq('restaurant_id', restaurant.id)
        .eq('customer_email', customerUser.email)
        .maybeSingle()
        .then(({ data }) => setLoyaltyPoints(data?.points || 0))
    } else {
      setLoyaltyPoints(0)
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
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const deliveryFee = orderType === 'delivery' && deliveryResult?.fee ? deliveryResult.fee : 0
  const couponDiscount = couponApplied
    ? (couponApplied.type === 'percent'
        ? Math.min(subtotal * couponApplied.value / 100, subtotal)
        : Math.min(couponApplied.value, subtotal))
    : 0
  const pointsUsed    = usingPoints && loyaltyPoints >= 100 ? Math.floor(loyaltyPoints / 100) * 100 : 0
  const pointsDiscount = pointsUsed * 0.1  // 100 pts = ﷼10
  const discount      = couponDiscount + pointsDiscount
  const totalPrice    = Math.max(0, subtotal + deliveryFee - discount)

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
    setAuthInitialMode(mode); setAuthSheet(true)
  }

  const onAuthSuccess = (user) => {
    localStorage.setItem('qlick_customer', JSON.stringify(user))
    setCustomerUser(user)
    setAuthSheet(false)
    if (pendingOrder) { setPendingOrder(false); setOrderDetailsOpen(true) }
  }

  const doSignOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('qlick_customer')
    setCustomerUser(null)
    setCustomerOrders([])
  }

  // ── DELIVERY LOGIC ───────────────────────────────────────────────────────────
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setDeliveryStep('error')
      setDeliveryResult({ error: ar?'جهازك لا يدعم تحديد الموقع':'Geolocation not supported' })
      return
    }
    setDeliveryStep('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setCustomerCoords({ lat, lng })
        calcDelivery(lat, lng)
      },
      () => {
        setDeliveryStep('error')
        setDeliveryResult({ error: ar?'تعذّر تحديد موقعك. يرجى السماح بالوصول للموقع.':'Could not get your location. Please allow location access.' })
      },
      { timeout: 10000 }
    )
  }

  const calcDelivery = (lat, lng) => {
    const geoBranches = branches.filter(b => b.lat && b.lng && b.status === 'open')
    if (geoBranches.length === 0) {
      const allZones = deliveryZones
      if (allZones.length === 0) {
        setDeliveryStep('error')
        setDeliveryResult({ error: ar?'التوصيل غير متاح حالياً':'Delivery not available' })
        return
      }
      setDeliveryStep('done')
      setDeliveryResult({ branch: null, zone: allZones[0], fee: allZones[0].fee, distance: null })
      return
    }
    let nearest = null, minDist = Infinity
    geoBranches.forEach(b => {
      const d = haversine(lat, lng, parseFloat(b.lat), parseFloat(b.lng))
      if (d < minDist) { minDist = d; nearest = b }
    })
    const branchZones = deliveryZones.filter(z => z.branch_id === nearest.id)
    const zone = branchZones.find(z => minDist >= z.min_km && minDist < z.max_km)
    if (!zone) {
      setDeliveryStep('error')
      setDeliveryResult({ error: ar?`أنت خارج نطاق التوصيل (${minDist.toFixed(1)} كم من أقرب فرع)`:`Outside delivery range (${minDist.toFixed(1)} km from nearest branch)` })
      return
    }
    setDeliveryStep('done')
    setDeliveryResult({ branch: nearest, zone, fee: zone.fee, distance: minDist })
  }

  const switchOrderType = (type) => {
    setOrderType(type)
    if (type === 'pickup') {
      setDeliveryStep('idle')
      setDeliveryResult(null)
      setCustomerCoords(null)
    }
  }

  // ── ORDER ACTIONS ────────────────────────────────────────────────────────────
  const placeOrder = () => {
    if (cart.length === 0) return
    if (!customerUser) { setPendingOrder(true); openAuth('login'); return }
    setOrderDetailsOpen(true)
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true); setCouponError('')
    const { data } = await supabase.from('coupons').select('*')
      .eq('restaurant_id', restaurant.id)
      .eq('code', couponCode.trim().toUpperCase())
      .eq('active', true)
      .maybeSingle()
    if (!data) { setCouponError(ar ? 'كود غير صالح أو غير نشط' : 'Invalid or inactive code'); setCouponLoading(false); return }
    if (data.expires_at && new Date(data.expires_at) < new Date()) { setCouponError(ar ? 'انتهت صلاحية الكوبون' : 'Coupon has expired'); setCouponLoading(false); return }
    if (data.max_uses !== null && data.uses >= data.max_uses) { setCouponError(ar ? 'تم الوصول للحد الأقصى للاستخدام' : 'Usage limit reached'); setCouponLoading(false); return }
    if (data.min_order > 0 && subtotal < data.min_order) { setCouponError(ar ? `الحد الأدنى للطلب ﷼${data.min_order}` : `Min order ﷼${data.min_order}`); setCouponLoading(false); return }
    const discountAmt = data.type === 'percent' ? Math.min(subtotal * data.value / 100, subtotal) : Math.min(data.value, subtotal)
    setCouponApplied({ ...data, discount: discountAmt })
    setCouponCode(''); setCouponLoading(false)
  }

  const removeCoupon = () => { setCouponApplied(null); setCouponCode(''); setCouponError('') }

  const confirmOrder = async (details) => {
    const fee = orderType === 'delivery' ? (deliveryResult?.fee || 0) : 0
    const finalTotal = Math.max(0, subtotal + fee - discount)
    await supabase.from('orders').insert({
      restaurant_id: restaurant.id,
      branch_id: deliveryResult?.branch?.id || null,
      items: cart.map(c => ({ id: c.id, name: c.name, price: c.price, qty: c.qty })),
      total: finalTotal,
      delivery_fee: fee,
      discount: discount > 0 ? discount : null,
      coupon_code: couponApplied?.code || null,
      status: 'pending',
      type: orderType,
      customer_name:    customerUser?.name  || '',
      customer_email:   customerUser?.email || '',
      customer_phone:   customerUser?.phone || '',
      delivery_address: orderType === 'delivery' ? details.address : null,
      delivery_notes:   orderType === 'delivery' ? [details.apt, details.deliveryNotes].filter(Boolean).join(' · ') : null,
      order_notes:      details.orderNotes || null,
      payment_method:   details.paymentMethod,
    })

    // Increment coupon uses
    if (couponApplied) {
      await supabase.from('coupons').update({ uses: (couponApplied.uses || 0) + 1 }).eq('id', couponApplied.id)
    }

    // Award / redeem loyalty points (1 point per ﷼1 spent, 100 pts = ﷼10 redemption)
    if (customerUser?.email) {
      const earned = Math.floor(finalTotal)
      const netPoints = Math.max(-(pointsUsed), earned - pointsUsed)
      const newPoints = Math.max(0, loyaltyPoints - pointsUsed + earned)
      await supabase.from('loyalty').upsert({
        restaurant_id: restaurant.id,
        customer_email: customerUser.email,
        points: newPoints,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'restaurant_id,customer_email' })
      setLoyaltyPoints(newPoints)
    }

    // Reset promo state
    setCouponApplied(null); setCouponCode(''); setCouponError(''); setUsingPoints(false)
    setOrderDetailsOpen(false); setCartOpen(false)
    setOrdered(true); setOrderStatus(0); setCart([])
    setTimeout(() => setOrderStatus(1), 3000)
    setTimeout(() => setOrderStatus(2), 7000)
  }

  // ── SPLASH ───────────────────────────────────────────────────────────────────
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

  // ── LANGUAGE ─────────────────────────────────────────────────────────────────
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

          {/* Order type toggle */}
          <div style={{ display:'flex', background:'#f5f5f5', borderRadius:14, padding:4, margin:'16px 20px 0' }}>
            {[['pickup', ar?'🥡 استلام':'🥡 Pickup'], ['delivery', ar?'🛵 توصيل':'🛵 Delivery']].map(([type, label]) => (
              <button key={type} onClick={()=>switchOrderType(type)} style={{ flex:1, padding:'10px 0', background:orderType===type?'#fff':'transparent', border:'none', borderRadius:11, fontSize:14, fontWeight:700, color:orderType===type?'#1a1a1a':'#aaa', cursor:'pointer', transition:'all 0.2s', boxShadow:orderType===type?'0 1px 4px rgba(0,0,0,0.08)':'none' }}>
                {label}
              </button>
            ))}
          </div>

          {/* Delivery location */}
          {orderType === 'delivery' && (
            <div style={{ margin:'12px 20px 0', padding:'14px', background:'#f8f8f8', borderRadius:14 }}>
              {deliveryStep === 'idle' && (
                <button onClick={detectLocation} style={{ width:'100%', padding:'12px 0', background:R, border:'none', borderRadius:12, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                  📍 {ar?'تحديد موقعي (GPS)':'Detect My Location (GPS)'}
                </button>
              )}
              {deliveryStep === 'locating' && (
                <div style={{ textAlign:'center', fontSize:13, color:'#888', padding:'8px 0' }}>
                  ⏳ {ar?'جاري تحديد موقعك...':'Detecting your location...'}
                </div>
              )}
              {deliveryStep === 'done' && deliveryResult && (
                <div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#10b981' }}>
                      ✓ {ar?'تم تحديد الموقع':'Location found'}
                      {deliveryResult.distance != null && <span style={{ color:'#888', fontWeight:400, fontSize:12 }}> · {deliveryResult.distance.toFixed(1)} km</span>}
                    </div>
                    <button onClick={()=>{ setDeliveryStep('idle'); setDeliveryResult(null); }} style={{ fontSize:11, color:'#aaa', background:'none', border:'none', cursor:'pointer' }}>
                      {ar?'تغيير':'Change'}
                    </button>
                  </div>
                  {deliveryResult.branch && <div style={{ fontSize:12, color:'#888' }}>📍 {deliveryResult.branch.name}</div>}
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontSize:13, fontWeight:700 }}>
                    <span style={{ color:'#555' }}>{ar?'رسوم التوصيل':'Delivery fee'}</span>
                    <span style={{ color: deliveryResult.fee===0?'#10b981':R }}>
                      {deliveryResult.fee===0?(ar?'مجاني':'Free'):`﷼${deliveryResult.fee}`}
                    </span>
                  </div>
                  {deliveryResult.zone?.min_order > 0 && subtotal < deliveryResult.zone.min_order && (
                    <div style={{ marginTop:6, fontSize:12, color:'#ef4444', fontWeight:600 }}>
                      ⚠️ {ar?`الحد الأدنى للطلب ﷼${deliveryResult.zone.min_order}`:`Min order ﷼${deliveryResult.zone.min_order}`}
                    </div>
                  )}
                </div>
              )}
              {deliveryStep === 'error' && deliveryResult?.error && (
                <div>
                  <div style={{ fontSize:13, color:'#ef4444', fontWeight:600, marginBottom:8 }}>
                    ❌ {deliveryResult.error}
                  </div>
                  <button onClick={()=>setDeliveryStep('idle')} style={{ fontSize:12, color:R, background:'none', border:'none', cursor:'pointer', fontWeight:700 }}>
                    {ar?'حاول مرة أخرى':'Try again'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Coupon code input */}
          <div style={{ margin:'12px 20px 0' }}>
            {couponApplied ? (
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', background:'#d1fae5', borderRadius:12, border:'1px solid #6ee7b7' }}>
                <span style={{ fontSize:16 }}>🎟️</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:'#065f46', fontFamily:'monospace' }}>{couponApplied.code}</div>
                  <div style={{ fontSize:11, color:'#047857' }}>
                    {ar ? `خصم` : 'Saving'} ﷼{couponDiscount.toFixed(2)}
                  </div>
                </div>
                <button onClick={removeCoupon} style={{ fontSize:11, color:'#ef4444', background:'#fee2e2', border:'none', borderRadius:7, padding:'4px 10px', fontWeight:700, cursor:'pointer' }}>
                  {ar?'إزالة':'Remove'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display:'flex', gap:8 }}>
                  <input
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                    placeholder={ar ? 'كود الخصم' : 'Coupon code'}
                    style={{ flex:1, padding:'11px 14px', background:'#f8f8f8', border:'1.5px solid #f0f0f0', borderRadius:12, fontSize:14, outline:'none', fontFamily:'monospace', letterSpacing:'0.05em' }}
                    onFocus={e => { e.target.style.borderColor = R }}
                    onBlur={e => { e.target.style.borderColor = '#f0f0f0' }}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    style={{ padding:'0 18px', background:couponLoading||!couponCode.trim()?'#e0e0e0':R, border:'none', borderRadius:12, color:'#fff', fontSize:13, fontWeight:700, cursor:couponLoading||!couponCode.trim()?'not-allowed':'pointer', whiteSpace:'nowrap' }}>
                    {couponLoading ? '...' : (ar ? 'تطبيق' : 'Apply')}
                  </button>
                </div>
                {couponError && (
                  <div style={{ fontSize:12, color:'#ef4444', fontWeight:600, marginTop:6 }}>❌ {couponError}</div>
                )}
              </div>
            )}
          </div>

          {/* Loyalty points redemption */}
          {customerUser && loyaltyPoints >= 100 && (
            <div style={{ margin:'8px 20px 0', padding:'11px 14px', background: usingPoints ? '#fef3c7' : '#f8f8f8', borderRadius:12, border: usingPoints ? '1.5px solid #f59e0b' : '1.5px solid transparent', display:'flex', alignItems:'center', gap:10, transition:'all 0.2s' }}>
              <span style={{ fontSize:20 }}>🏆</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#1a1a1a' }}>
                  {ar ? `نقاطك: ${loyaltyPoints} نقطة` : `Your points: ${loyaltyPoints} pts`}
                </div>
                <div style={{ fontSize:11, color:'#888' }}>
                  {ar
                    ? `استخدم ${pointsUsed} نقطة = خصم ﷼${pointsDiscount.toFixed(0)}`
                    : `Redeem ${pointsUsed} pts = ﷼${pointsDiscount.toFixed(0)} off`}
                </div>
              </div>
              <button onClick={() => setUsingPoints(v => !v)} style={{ width:40, height:22, borderRadius:11, background: usingPoints ? '#f59e0b' : '#e0e0e0', border:'none', cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
                <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left: usingPoints ? 21 : 3, transition:'left 0.2s' }}/>
              </button>
            </div>
          )}

          {/* Price breakdown */}
          <div style={{ padding:'16px 20px', background:'#f8f8f8', margin:'12px 20px 0', borderRadius:16 }}>
            {(orderType === 'delivery' || discount > 0) && (
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#888', marginBottom:6 }}>
                <span>{ar?'المجموع الفرعي':'Subtotal'}</span>
                <span>﷼{subtotal.toFixed(2)}</span>
              </div>
            )}
            {orderType === 'delivery' && (
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#888', marginBottom:6 }}>
                <span>{ar?'التوصيل':'Delivery'}</span>
                <span style={{ color: deliveryFee===0?'#10b981':'#1a1a1a' }}>
                  {deliveryStep==='done' ? (deliveryFee===0?(ar?'مجاني':'Free'):`﷼${deliveryFee}`) : '—'}
                </span>
              </div>
            )}
            {discount > 0 && (
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#10b981', fontWeight:700, marginBottom:6 }}>
                <span>{ar ? '🎉 الخصم' : '🎉 Discount'}</span>
                <span>−﷼{discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:16 }}>
              <span>{ar?'الإجمالي':'Total'}</span>
              <span style={{ color:R }}>﷼{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Signed-in user info */}
          {customerUser ? (
            <div style={{ margin:'12px 20px 0', padding:'11px 14px', background:`${R}08`, borderRadius:12, display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:20 }}>👤</span>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'#1a1a1a' }}>{customerUser.name}</div>
                <div style={{ fontSize:11, color:'#888' }}>{customerUser.email}</div>
              </div>
            </div>
          ) : (
            <div style={{ margin:'12px 20px 0', padding:'11px 14px', background:'#fef3c7', borderRadius:12, fontSize:13, color:'#92400e', fontWeight:600 }}>
              ⚠️ {ar?'تحتاج لتسجيل الدخول لإتمام الطلب':'You need to sign in to place an order'}
            </div>
          )}

          <div style={{ padding:'12px 20px 40px' }}>
            <button
              onClick={placeOrder}
              disabled={orderType==='delivery' && (deliveryStep==='locating' || deliveryStep==='error' || (deliveryResult?.zone?.min_order > 0 && subtotal < deliveryResult.zone.min_order))}
              style={{ width:'100%', padding:16, background:(orderType==='delivery' && deliveryStep !== 'done') ? '#ccc' : R, border:'none', borderRadius:16, color:'#fff', fontSize:16, fontWeight:800, cursor:(orderType==='delivery' && deliveryStep !== 'done') ? 'not-allowed' : 'pointer' }}>
              {!customerUser
                ? (ar?'تسجيل الدخول للطلب':'Sign In to Order')
                : orderType==='delivery' && deliveryStep !== 'done'
                  ? (ar?'حدد موقعك أولاً':'Set location first')
                  : `${ar?'التالي: تفاصيل الطلب':'Next: Order Details'} →`}
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

  // ── MAIN APP ──────────────────────────────────────────────────────────────────
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
              <div style={{ fontSize:56, fontWeight:900, marginBottom:4, letterSpacing:'-0.02em' }}>{loyaltyPoints}</div>
              <div style={{ fontSize:13, opacity:0.7, marginBottom:16 }}>{ar?'اطلب لتكسب نقاط':'Order to earn 1 pt per ﷼1 spent'}</div>
              {loyaltyPoints >= 100 && (
                <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:12, padding:'10px 14px', fontSize:13, fontWeight:600 }}>
                  🎉 {ar
                    ? `لديك ما يكفي لخصم ﷼${Math.floor(loyaltyPoints/100)*10}`
                    : `Redeem for ﷼${Math.floor(loyaltyPoints/100)*10} off your next order`}
                </div>
              )}
            </div>
            <div style={{ background:'#fff', borderRadius:18, padding:18, border:'1px solid #f0f0f0', marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:800, color:'#aaa', letterSpacing:'0.07em', marginBottom:14 }}>{ar?'كيف تعمل النقاط؟':'HOW POINTS WORK'}</div>
              {[
                ['🛍️', ar?'1 نقطة لكل ﷼1 تنفقه':'1 point for every ﷼1 spent'],
                ['🎁', ar?'100 نقطة = خصم ﷼10':'100 points = ﷼10 off'],
                ['⚡', ar?'تُضاف النقاط بعد كل طلب':'Points added after each order'],
              ].map(([icon, text]) => (
                <div key={text} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`${R}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{icon}</div>
                  <div style={{ fontSize:13, color:'#555', fontWeight:500 }}>{text}</div>
                </div>
              ))}
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
                  ['🏆', ar?'نقاطي':'My Points', ar?`${loyaltyPoints} نقطة`:`${loyaltyPoints} pts`, ()=>setTab('rewards')],
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

      {selectedItem && <ItemModal item={selectedItem} ar={ar} R={R} onClose={()=>setSelectedItem(null)} onAdd={addToCart}/>}
      {cartOpen && CartDrawer()}
      {authSheet && (
        <AuthSheet
          key="auth-sheet"
          ar={ar}
          R={R}
          initialMode={authInitialMode}
          pendingOrder={pendingOrder}
          onSuccess={onAuthSuccess}
          onClose={()=>{ setAuthSheet(false); setPendingOrder(false) }}
        />
      )}
      {orderDetailsOpen && (
        <OrderDetailsSheet
          key="order-details-sheet"
          ar={ar}
          R={R}
          orderType={orderType}
          deliveryResult={deliveryResult}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          discount={discount}
          totalPrice={totalPrice}
          cart={cart}
          onConfirm={confirmOrder}
          onClose={()=>setOrderDetailsOpen(false)}
        />
      )}
    </div>
  )
}
