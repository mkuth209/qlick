import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const R = "#E03020"
const ROLES = {
  owner:   { label:"Owner",   labelAr:"المالك",  icon:"👑", color:"#7c3aed" },
  manager: { label:"Manager", labelAr:"المدير",  icon:"🧑‍💼", color:"#0ea5e9" },
  employee:{ label:"Employee",labelAr:"الموظف", icon:"👷", color:"#10b981" },
}

const T = {
  en: {
    dir:"ltr", font:"'DM Sans',sans-serif",
    overview:"Overview", orders:"Orders", menu:"Menu", stock:"Stock",
    analytics:"Analytics", employees:"Employees", branches:"Branches",
    reviews:"Reviews", hours:"Working Hours", payment:"Payments", settings:"Settings",
    goodMorning:"Good morning 👋", todayOverview:"Here's your restaurant today",
    ordersToday:"Orders Today", revenue:"Revenue", pending:"Pending", avgRating:"Avg Rating",
    recentOrders:"Recent Orders", noOrders:"No orders yet.",
    accept:"Accept", markReady:"Mark Ready", complete:"Complete", reject:"Reject",
    whatsappDriver:"📱 WhatsApp Driver", total:"Total",
    addItem:"+ Add Item", available:"Available", off:"Off",
    stockMgmt:"Stock Management", inStock:"In Stock", outOfStock:"Out of Stock",
    lowStock:"Low Stock", restock:"Restock", totalItems:"Total Items",
    totalRevenue:"Total Revenue", totalOrders:"Total Orders", avgOrderValue:"Avg Order Value",
    bestSelling:"🏆 Best Selling Items", orderTypes:"Order Types", paymentMethods:"Payment Methods",
    pickup:"Pickup", delivery:"Delivery", dineIn:"Dine-in",
    addEmployee:"+ Add Employee", onlineNow:"Online Now", ordersHandled:"Orders Handled",
    addBranch:"+ Add Branch", manage:"Manage", staff:"staff",
    weeklySchedule:"Weekly Schedule", specialModes:"Special Modes", activate:"Activate",
    saveHours:"Save Hours", saved:"✓ Saved!",
    connectedAccount:"Connected Account", payoutHistory:"Payout History",
    download:"Download", thisMonthBreakdown:"This Month Breakdown",
    grossRevenue:"Gross Revenue", netPayout:"Net Payout",
    operations:"Operations", restaurantOpen:"Restaurant is Open",
    openSub:"Customers can see & order", acceptingOrders:"Accepting Orders",
    deliveryAvail:"Delivery Available", dineInAvail:"Dine-in Available",
    restaurantInfo:"Restaurant Info", save:"Save", yourLinks:"Your Links",
    customerApp:"📱 Customer App", ownerDash:"📊 Owner Dashboard",
    allBranches:"All Branches", noData:"No data yet",
    sat:"Saturday", sun:"Sunday", mon:"Monday", tue:"Tuesday",
    wed:"Wednesday", thu:"Thursday", fri:"Friday",
    open:"● Open", closed:"○ Closed", to:"to", allDay:"24h", closed_day:"Closed",
    name:"Name", cuisine:"Cuisine", phone:"Phone", pickupTime:"Pickup Time",
    copy:"Copy", logout:"Sign Out",
    totalEarned:"Total Earned", pendingPayout:"Pending", thisMonth:"This Month",
    moyasarFee:"Moyasar Fees (1.9%)", paid:"✓ Paid", pendingStatus:"⏳ Pending",
    change:"Change", totalEmployees:"Total", online:"Online since",
    lastSeen:"Last seen", active:"Active now",
    newEmployee:"New Employee", fullName:"Full Name", email:"Email",
    password:"Password", role:"Role", branch:"Branch", orders_count:"orders",
  },
  ar: {
    dir:"rtl", font:"'Tajawal',sans-serif",
    overview:"نظرة عامة", orders:"الطلبات", menu:"القائمة", stock:"المخزون",
    analytics:"التحليلات", employees:"الموظفون", branches:"الفروع",
    reviews:"التقييمات", hours:"ساعات العمل", payment:"المدفوعات", settings:"الإعدادات",
    goodMorning:"صباح الخير 👋", todayOverview:"إليك أداء مطعمك اليوم",
    ordersToday:"طلبات اليوم", revenue:"الإيرادات", pending:"قيد الانتظار", avgRating:"متوسط التقييم",
    recentOrders:"الطلبات الأخيرة", noOrders:"لا توجد طلبات بعد.",
    accept:"قبول", markReady:"جاهز", complete:"إتمام", reject:"رفض",
    whatsappDriver:"📱 واتساب السائق", total:"الإجمالي",
    addItem:"+ إضافة منتج", available:"متاح", off:"غير متاح",
    stockMgmt:"إدارة المخزون", inStock:"متوفر", outOfStock:"نفد",
    lowStock:"منخفض", restock:"إعادة تخزين", totalItems:"إجمالي المنتجات",
    totalRevenue:"إجمالي الإيرادات", totalOrders:"إجمالي الطلبات", avgOrderValue:"متوسط قيمة الطلب",
    bestSelling:"🏆 الأكثر مبيعاً", orderTypes:"أنواع الطلبات", paymentMethods:"طرق الدفع",
    pickup:"استلام", delivery:"توصيل", dineIn:"داخل المطعم",
    addEmployee:"+ إضافة موظف", onlineNow:"متصل الآن", ordersHandled:"الطلبات المعالجة",
    addBranch:"+ إضافة فرع", manage:"إدارة", staff:"موظف",
    weeklySchedule:"الجدول الأسبوعي", specialModes:"الأوضاع الخاصة", activate:"تفعيل",
    saveHours:"حفظ الأوقات", saved:"✓ تم الحفظ!",
    connectedAccount:"الحساب المرتبط", payoutHistory:"سجل المدفوعات",
    download:"تحميل", thisMonthBreakdown:"تفاصيل هذا الشهر",
    grossRevenue:"الإيرادات الإجمالية", netPayout:"صافي الدفع",
    operations:"العمليات", restaurantOpen:"المطعم مفتوح",
    openSub:"العملاء يمكنهم الرؤية والطلب", acceptingOrders:"استقبال الطلبات",
    deliveryAvail:"خدمة التوصيل", dineInAvail:"الجلوس بالمطعم",
    restaurantInfo:"معلومات المطعم", save:"حفظ", yourLinks:"روابطك",
    customerApp:"📱 تطبيق العميل", ownerDash:"📊 لوحة المالك",
    allBranches:"جميع الفروع", noData:"لا توجد بيانات بعد",
    sat:"السبت", sun:"الأحد", mon:"الاثنين", tue:"الثلاثاء",
    wed:"الأربعاء", thu:"الخميس", fri:"الجمعة",
    open:"● مفتوح", closed:"○ مغلق", to:"إلى", allDay:"٢٤ ساعة", closed_day:"مغلق",
    name:"الاسم", cuisine:"نوع المطبخ", phone:"الجوال", pickupTime:"وقت الاستلام",
    copy:"نسخ", logout:"تسجيل الخروج",
    totalEarned:"إجمالي الأرباح", pendingPayout:"قيد الانتظار", thisMonth:"هذا الشهر",
    moyasarFee:"رسوم ميسر (1.9%)", paid:"✓ مدفوع", pendingStatus:"⏳ قيد الانتظار",
    change:"تغيير", totalEmployees:"الإجمالي", online:"متصل منذ",
    lastSeen:"آخر ظهور", active:"نشط الآن",
    newEmployee:"موظف جديد", fullName:"الاسم الكامل", email:"البريد الإلكتروني",
    password:"كلمة المرور", role:"الدور", branch:"الفرع", orders_count:"طلب",
  }
}

const ORDER_STATUS = (t) => ({
  pending:   { label:t.pending,   color:"#f59e0b", bg:"#fef3c7", next:"preparing", btn:t.accept },
  preparing: { label:"Preparing", color:"#3b82f6", bg:"#dbeafe", next:"ready",     btn:t.markReady },
  ready:     { label:"Ready 🥡",  color:"#10b981", bg:"#d1fae5", next:"completed", btn:t.complete },
  completed: { label:"Done",      color:"#6b7280", bg:"#f3f4f6", next:null,        btn:null },
  rejected:  { label:"Rejected",  color:"#ef4444", bg:"#fee2e2", next:null,        btn:null },
})

const TYPE_ICON = { pickup:"🥡", delivery:"🛵", "dine-in":"🪑" }

const EMPLOYEES = [
  { id:1, name:"Ali Hassan",  nameAr:"علي حسن",    role:"manager",  branch:1, bName:"Tahlia",   bNameAr:"التحلية",  status:"online",  login:"8:00 AM",  handled:34, phone:"+966501111111" },
  { id:2, name:"Omar Khalid", nameAr:"عمر خالد",   role:"employee", branch:1, bName:"Tahlia",   bNameAr:"التحلية",  status:"online",  login:"9:00 AM",  handled:18, phone:"+966502222222" },
  { id:3, name:"Saad Nasser", nameAr:"سعد ناصر",   role:"employee", branch:2, bName:"Corniche", bNameAr:"الكورنيش", status:"offline", login:"—",        handled:0,  phone:"+966503333333" },
  { id:4, name:"Faris Saleh", nameAr:"فارس صالح",  role:"manager",  branch:2, bName:"Corniche", bNameAr:"الكورنيش", status:"online",  login:"7:30 AM",  handled:22, phone:"+966505555555" },
  { id:5, name:"Rami Adel",   nameAr:"رامي عادل",  role:"employee", branch:4, bName:"Andalus",  bNameAr:"الأندلس",  status:"online",  login:"10:00 AM", handled:11, phone:"+966506666666" },
];

const PAYOUTS = [
  { id:1, date:"7 مايو 2026",  dateEn:"May 7, 2026",  amount:4280, status:"paid",    ref:"TXN-88821" },
  { id:2, date:"30 أبريل 2026", dateEn:"Apr 30, 2026", amount:3910, status:"paid",    ref:"TXN-88654" },
  { id:3, date:"8 مايو 2026",  dateEn:"May 8, 2026",  amount:1240, status:"pending", ref:"TXN-88999" },
];

const BRANCHES = [
  { id:1, name:"Tahlia",   nameAr:"التحلية",  address:"Tahlia St, Jeddah" },
  { id:2, name:"Corniche", nameAr:"الكورنيش", address:"Corniche Rd, Jeddah" },
  { id:3, name:"Airport",  nameAr:"المطار",   address:"King Abdulaziz Airport" },
  { id:4, name:"Andalus",  nameAr:"الأندلس",  address:"Andalus St, Jeddah" },
];


// ── SMALL COMPONENTS ──────────────────────────────────────────────────────────
const inp = (extra={}) => ({ width:"100%", padding:"9px 13px", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:11, fontSize:13, color:"#fff", outline:"none", fontFamily:"inherit", boxSizing:"border-box", ...extra })

function STitle({ title, action, onClick }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
      <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em", color:"#fff" }}>{title}</div>
      {action && <button onClick={onClick} style={{ padding:"9px 18px", background:R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>{action}</button>}
    </div>
  )
}

function Card({ children, mb=14, extra={} }) {
  return <div style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:20, padding:22, marginBottom:mb, ...extra }}>{children}</div>
}

function StatCard({ icon, label, value, color=R, trend, sub }) {
  return (
    <div style={{ background:"#fff", borderRadius:18, padding:"18px 20px", flex:1, minWidth:140, border:"1px solid #f0f0f0", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div style={{ width:42, height:42, borderRadius:13, background:`${color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
        {trend!=null&&<div style={{ fontSize:11, fontWeight:700, color:trend>=0?"#10b981":"#ef4444", background:trend>=0?"#d1fae5":"#fee2e2", padding:"3px 8px", borderRadius:20 }}>{trend>=0?"↑":"↓"}{Math.abs(trend)}%</div>}
      </div>
      <div style={{ fontSize:26, fontWeight:900, color:"#1a1a1a", marginBottom:2 }}>{value}</div>
      <div style={{ fontSize:12, color:"#888" }}>{label}</div>
      {sub&&<div style={{ fontSize:11, color:"#bbb", marginTop:1 }}>{sub}</div>}
    </div>
  );
}



function CardTitle({ children }) {
  return <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:"#aaa", marginBottom:14 }}>{children}</div>;
}

function Badge({ status, t }) {
  const s = ORDER_STATUS(t)[status] || ORDER_STATUS(t).pending
  return <span style={{ padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, color:s.color, background:s.bg }}>{s.label}</span>
}

function Tog({ label, sub, value, onChange }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom:"1px solid #1a1a1a" }}>
      <div><div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{label}</div>{sub&&<div style={{ fontSize:12, color:"#555", marginTop:1 }}>{sub}</div>}</div>
      <button onClick={()=>onChange(!value)} style={{ width:46, height:25, borderRadius:13, background:value?R:"#2a2a2a", border:"none", cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
        <div style={{ width:19, height:19, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:value?24:3, transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }}/>
      </button>
    </div>
  )
}

// ── PAGES ─────────────────────────────────────────────────────────────────────
function OverviewPage({ restaurant, t, lang }) {
  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: ordersData }, { data: reviewsData }] = await Promise.all([
        supabase.from('orders').select('*').eq('restaurant_id', restaurant.id).order('created_at', { ascending: false }).limit(20),
        supabase.from('reviews').select('*').eq('restaurant_id', restaurant.id)
      ])
      setOrders(ordersData || [])
      setReviews(reviewsData || [])
      setLoading(false)
    }
    fetchData()

    // Real-time orders
    const sub = supabase.channel('orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurant.id}` }, () => fetchData()).subscribe()
    return () => supabase.removeChannel(sub)
  }, [restaurant.id])

  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
  const revenue = todayOrders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0)
  const pending = todayOrders.filter(o => o.status === 'pending').length
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—'

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em", color:"#fff" }}>{t.goodMorning}</div>
          <div style={{ fontSize:13, color:"#555", marginTop:2 }}>{t.todayOverview}</div>
        </div>
        <div style={{ fontSize:12, color:"#444", background:"#1a1a1a", padding:"7px 14px", borderRadius:20 }}>{new Date().toLocaleDateString(lang==="ar"?"ar-SA":"en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
      </div>

      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:22 }}>
        <StatCard icon="📦" label={t.ordersToday} value={todayOrders.length} color={R}/>
        <StatCard icon="💰" label={t.revenue} value={`﷼${revenue.toLocaleString()}`} color="#10b981"/>
        <StatCard icon="⏳" label={t.pending} value={pending} color="#f59e0b"/>
        <StatCard icon="⭐" label={t.avgRating} value={avgRating} color="#6366f1"/>
      </div>

      <Card>
        <div style={{ fontWeight:700, fontSize:15, color:"#fff", marginBottom:14 }}>{t.recentOrders}</div>
        {loading ? <div style={{ color:"#444", fontSize:13 }}>Loading...</div> :
         orders.length === 0 ? <div style={{ color:"#444", fontSize:13 }}>{t.noOrders}</div> :
         orders.slice(0,8).map(o => (
          <div key={o.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 0", borderBottom:"1px solid #1a1a1a" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:"#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{TYPE_ICON[o.type]||"🥡"}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:"#fff" }}>#{o.id.slice(-6)} · {o.customer_name||"Customer"}</div>
                <div style={{ fontSize:11, color:"#555" }}>{new Date(o.created_at).toLocaleTimeString()}</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontWeight:700, fontSize:13, color:"#fff" }}>﷼{o.total}</span>
              <Badge status={o.status} t={t}/>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

function OrdersPage({ restaurant, t, lang }) {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase.from('orders').select('*').eq('restaurant_id', restaurant.id).order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    fetchOrders()
    const sub = supabase.channel('orders2').on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurant.id}` }, fetchOrders).subscribe()
    return () => supabase.removeChannel(sub)
  }, [restaurant.id])

  const updateStatus = async (id, next) => {
    await supabase.from('orders').update({ status: next }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: next } : o))
  }

  const filtered = orders.filter(o => filter === "all" || o.status === filter)
  const statuses = ORDER_STATUS(t)
  const filterList = ["all","pending","preparing","ready","completed","rejected"]

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em", color:"#fff", marginBottom:18 }}>{t.orders}</div>
      <div style={{ display:"flex", gap:7, marginBottom:18, flexWrap:"wrap" }}>
        {filterList.map(f => {
          const count = orders.filter(o => f==="all" || o.status===f).length
          return (
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:"7px 14px", borderRadius:20, border:"1.5px solid", borderColor:filter===f?R:"#2a2a2a", background:filter===f?`${R}15`:"transparent", color:filter===f?R:"#555", fontSize:12, fontWeight:700, cursor:"pointer", textTransform:"capitalize", display:"flex", alignItems:"center", gap:5 }}>
              {f==="all"?(lang==="ar"?"الكل":"All"):statuses[f]?.label||f}
              {count>0 && <span style={{ background:filter===f?R:"#2a2a2a", color:filter===f?"#fff":"#666", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:800 }}>{count}</span>}
            </button>
          )
        })}
      </div>

      {loading ? <div style={{ color:"#444", fontSize:13 }}>Loading...</div> :
       filtered.length === 0 ? <div style={{ color:"#444", fontSize:13, padding:40, textAlign:"center" }}>{t.noOrders}</div> :
       filtered.map(o => {
        const s = statuses[o.status] || statuses.pending
        const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items || []
        return (
          <Card key={o.id} mb={12}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:13 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:`${R}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{TYPE_ICON[o.type]||"🥡"}</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:15, color:"#fff" }}>#{o.id.slice(-6)}</div>
                  <div style={{ fontSize:11, color:"#555" }}>{o.customer_name||"Customer"} · {new Date(o.created_at).toLocaleTimeString()}</div>
                  {o.type==="delivery" && o.customer_phone && <div style={{ fontSize:11, color:"#0ea5e9", marginTop:1 }}>📞 {o.customer_phone}</div>}
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
                <Badge status={o.status} t={t}/>
                <div style={{ fontSize:11, color:"#444" }}>{o.type||"pickup"}</div>
              </div>
            </div>

            <div style={{ background:"#1a1a1a", borderRadius:11, padding:"11px 13px", marginBottom:13 }}>
              {items.map((item, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#888", marginBottom:i<items.length-1?5:0 }}>
                  <span>{item.name} × {item.qty||1}</span>
                  <span style={{ fontWeight:600 }}>﷼{(item.price*(item.qty||1)).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop:"1px solid #2a2a2a", marginTop:8, paddingTop:8, display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:13, color:"#fff" }}>
                <span>{t.total}</span><span style={{ color:R }}>﷼{o.total}</span>
              </div>
            </div>

            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              {o.status==="pending" && <button onClick={()=>updateStatus(o.id,"rejected")} style={{ padding:"8px 14px", background:"#fee2e220", border:"1px solid #ef444433", borderRadius:10, color:"#ef4444", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.reject}</button>}
              {o.type==="delivery" && o.status!=="completed" && o.status!=="rejected" && (
                <button onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(o.delivery_address||'')}`, '_blank')} style={{ padding:"8px 14px", background:"#e0f2fe20", border:"1px solid #0ea5e933", borderRadius:10, color:"#0ea5e9", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.whatsappDriver}</button>
              )}
              {s.next && <button onClick={()=>updateStatus(o.id,s.next)} style={{ padding:"8px 18px", background:s.color, border:"none", borderRadius:10, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>{s.btn}</button>}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function MenuPage({ restaurant, t, role }) {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState({ name:"", category:"", price:"", emoji:"🍽️" })

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('menu_items').select('*').eq('restaurant_id', restaurant.id).order('category')
      setMenu(data || [])
      setLoading(false)
    }
    fetch()
  }, [restaurant.id])

  const toggle = async (id, val) => {
    await supabase.from('menu_items').update({ available: !val }).eq('id', id)
    setMenu(prev => prev.map(m => m.id === id ? { ...m, available: !val } : m))
  }

  const addItem = async () => {
    if (!newItem.name || !newItem.price) return
    const { data } = await supabase.from('menu_items').insert({
      restaurant_id: restaurant.id,
      name: newItem.name,
      category: newItem.category || 'General',
      price: parseFloat(newItem.price),
      emoji: newItem.emoji,
      available: true,
      stock: 100,
    }).select().single()
    if (data) { setMenu(prev => [...prev, data]); setNewItem({ name:"", category:"", price:"", emoji:"🍽️" }); setShowAdd(false) }
  }

  const deleteItem = async (id) => {
    await supabase.from('menu_items').delete().eq('id', id)
    setMenu(prev => prev.filter(m => m.id !== id))
  }

  const cats = [...new Set(menu.map(m => m.category||"General"))]

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em", color:"#fff" }}>{t.menu}</div>
        {role !== "employee" && <button onClick={()=>setShowAdd(v=>!v)} style={{ padding:"9px 18px", background:R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>{t.addItem}</button>}
      </div>

      {showAdd && (
        <Card>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            {[["Name","Item name","name"],["Category","e.g. Burgers","category"],["Price","e.g. 25","price"],["Emoji","🍔","emoji"]].map(([label,ph,key]) => (
              <div key={key}>
                <div style={{ fontSize:11, color:"#555", marginBottom:4 }}>{label}</div>
                <input value={newItem[key]} onChange={e=>setNewItem(p=>({...p,[key]:e.target.value}))} placeholder={ph} style={{ width:"100%", padding:"9px 13px", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:11, color:"#fff", fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
              </div>
            ))}
          </div>
          <button onClick={addItem} style={{ padding:"9px 20px", background:R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Add</button>
        </Card>
      )}

      {loading ? <div style={{ color:"#444", fontSize:13 }}>Loading...</div> :
       menu.length === 0 ? <div style={{ color:"#444", fontSize:13, padding:40, textAlign:"center" }}>{t.noData}</div> :
       cats.map(cat => (
        <div key={cat} style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:"#444", marginBottom:10 }}>{cat}</div>
          {menu.filter(m=>(m.category||"General")===cat).map(item => (
            <div key={item.id} style={{ background:"#111", border:`1.5px solid ${item.stock<=item.low_stock_alert?"#f59e0b33":"#1e1e1e"}`, borderRadius:15, padding:"13px 16px", marginBottom:8, display:"flex", alignItems:"center", gap:12, opacity:item.available?1:0.6 }}>
              <div style={{ width:48, height:48, borderRadius:13, background:`${R}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:25, flexShrink:0 }}>{item.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14, color:"#fff", marginBottom:2 }}>{item.name}</div>
                <div style={{ fontSize:11, color:"#555" }}>﷼{item.price} · Stock: {item.stock}</div>
              </div>
              {role !== "employee" && (
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button onClick={()=>toggle(item.id, item.available)} style={{ padding:"5px 10px", borderRadius:18, border:"1.5px solid", borderColor:item.available?"#10b981":"#2a2a2a", background:item.available?"#10b98120":"transparent", color:item.available?"#10b981":"#555", fontSize:11, fontWeight:700, cursor:"pointer" }}>{item.available?t.available:t.off}</button>
                  <button onClick={()=>deleteItem(item.id)} style={{ width:28, height:28, borderRadius:7, background:"#fee2e220", border:"none", cursor:"pointer", fontSize:13 }}>🗑️</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function StockPage({ restaurant, t }) {
  const [menu, setMenu] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('menu_items').select('*').eq('restaurant_id', restaurant.id)
      setMenu(data || [])
    }
    fetch()
  }, [restaurant.id])

  const updateStock = async (id, val) => {
    const stock = Math.max(0, Number(val))
    await supabase.from('menu_items').update({ stock }).eq('id', id)
    setMenu(prev => prev.map(m => m.id === id ? { ...m, stock } : m))
  }

  const low = menu.filter(m => m.stock <= m.low_stock_alert)

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em", color:"#fff", marginBottom:20 }}>{t.stockMgmt}</div>

      {low.length > 0 && (
        <div style={{ background:"#fef3c710", border:"1.5px solid #f59e0b44", borderRadius:16, padding:"13px 17px", marginBottom:18 }}>
          <div style={{ fontWeight:700, fontSize:13, color:"#f59e0b", marginBottom:4 }}>⚠️ {low.length} {t.lowStock}</div>
          {low.map(m => <div key={m.id} style={{ fontSize:11, color:"#b45309" }}>{m.emoji} {m.name} — {m.stock} left</div>)}
        </div>
      )}

      <div style={{ display:"flex", gap:12, marginBottom:18 }}>
        <StatCard icon="🗃️" label={t.totalItems} value={menu.length} color="#6366f1"/>
        <StatCard icon="✅" label={t.inStock} value={menu.filter(m=>m.stock>m.low_stock_alert).length} color="#10b981"/>
        <StatCard icon="⚠️" label={t.lowStock} value={low.length} color="#f59e0b"/>
        <StatCard icon="❌" label={t.outOfStock} value={menu.filter(m=>m.stock===0).length} color="#ef4444"/>
      </div>

      <Card>
        {menu.map(item => (
          <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid #1a1a1a" }}>
            <div style={{ fontSize:24, flexShrink:0 }}>{item.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13, color:"#fff", marginBottom:3 }}>{item.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ flex:1, background:"#2a2a2a", borderRadius:4, height:6, maxWidth:110 }}>
                  <div style={{ width:`${Math.min((item.stock/100)*100,100)}%`, background:item.stock===0?"#ef4444":item.stock<=item.low_stock_alert?"#f59e0b":"#10b981", borderRadius:4, height:"100%" }}/>
                </div>
                <span style={{ fontSize:11, color:item.stock===0?"#ef4444":item.stock<=item.low_stock_alert?"#f59e0b":"#10b981", fontWeight:700 }}>{item.stock}</span>
              </div>
            </div>
            <input type="number" value={item.stock} onChange={e=>updateStock(item.id,e.target.value)} style={{ width:65, padding:"6px 8px", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:9, fontSize:13, fontWeight:700, outline:"none", textAlign:"center", color:"#fff" }}/>
            <button style={{ padding:"6px 11px", background:R, border:"none", borderRadius:9, color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>{t.restock}</button>
          </div>
        ))}
      </Card>
    </div>
  )
}

function AnalyticsPage({ restaurant, t, lang }) {
  const [orders, setOrders] = useState([])
  const [menu, setMenu] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const [{ data: o }, { data: m }] = await Promise.all([
        supabase.from('orders').select('*').eq('restaurant_id', restaurant.id),
        supabase.from('menu_items').select('*').eq('restaurant_id', restaurant.id)
      ])
      setOrders(o || [])
      setMenu(m || [])
    }
    fetch()
  }, [restaurant.id])

  const completed = orders.filter(o => o.status === 'completed')
  const totalRev = completed.reduce((s, o) => s + o.total, 0)
  const avgOrder = completed.length ? (totalRev / completed.length).toFixed(1) : 0

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em", color:"#fff", marginBottom:20 }}>{t.analytics}</div>

      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:22 }}>
        <StatCard icon="💰" label={t.totalRevenue} value={`﷼${totalRev.toLocaleString()}`} color="#10b981"/>
        <StatCard icon="📦" label={t.totalOrders} value={orders.length} color={R}/>
        <StatCard icon="🧾" label={t.avgOrderValue} value={`﷼${avgOrder}`} color="#6366f1"/>
      </div>

      <Card>
        <div style={{ fontWeight:700, fontSize:15, color:"#fff", marginBottom:14 }}>{t.bestSelling}</div>
        {menu.length === 0 ? <div style={{ color:"#444", fontSize:13 }}>{t.noData}</div> :
         [...menu].sort((a,b)=>(b.orders||0)-(a.orders||0)).slice(0,6).map((item,i) => (
          <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #1a1a1a" }}>
            <div style={{ width:28, height:28, borderRadius:8, background:i===0?`${R}20`:"#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:i===0?R:"#555" }}>
              {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
            </div>
            <div style={{ fontSize:20 }}>{item.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13, color:"#fff" }}>{item.name}</div>
              <div style={{ fontSize:11, color:"#555" }}>﷼{item.price}</div>
            </div>
          </div>
        ))}
      </Card>

      <div style={{ display:"flex", gap:12 }}>
        <Card mb={0} extra={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:14, color:"#fff", marginBottom:13 }}>{t.orderTypes}</div>
          {[["🥡",t.pickup,orders.filter(o=>o.type==="pickup").length],["🛵",t.delivery,orders.filter(o=>o.type==="delivery").length],["🪑",t.dineIn,orders.filter(o=>o.type==="dine-in").length]].map(([ic,type,count])=>(
            <div key={type} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, fontWeight:600, marginBottom:4, color:"#888" }}><span>{ic} {type}</span><span style={{ color:"#fff" }}>{count}</span></div>
              <div style={{ background:"#2a2a2a", borderRadius:4, height:7 }}><div style={{ width:`${orders.length?((count/orders.length)*100):0}%`, background:R, borderRadius:4, height:"100%" }}/></div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

function ReviewsPage({ restaurant, t }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('reviews').select('*').eq('restaurant_id', restaurant.id).order('created_at', { ascending: false })
      setReviews(data || [])
      setLoading(false)
    }
    fetch()
  }, [restaurant.id])

  const avg = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : "—"

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em", color:"#fff", marginBottom:20 }}>{t.reviews}</div>

      {reviews.length > 0 && (
        <div style={{ background:`linear-gradient(135deg,${R},${R}bb)`, borderRadius:22, padding:22, marginBottom:18, color:"#fff", display:"flex", gap:22, alignItems:"center" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:50, fontWeight:900 }}>{avg}</div>
            <div style={{ fontSize:18, marginTop:3 }}>{"⭐".repeat(Math.round(parseFloat(avg)||0))}</div>
            <div style={{ fontSize:11, opacity:0.8, marginTop:3 }}>{reviews.length} reviews</div>
          </div>
          <div style={{ flex:1 }}>
            {[5,4,3,2,1].map(star=>{
              const count=reviews.filter(r=>r.rating===star).length
              return <div key={star} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <span style={{ fontSize:11, opacity:0.8 }}>{star}</span>
                <div style={{ flex:1, background:"rgba(255,255,255,0.2)", borderRadius:4, height:7 }}>
                  <div style={{ width:`${reviews.length?(count/reviews.length)*100:0}%`, background:"#fff", borderRadius:4, height:"100%" }}/>
                </div>
                <span style={{ fontSize:11, opacity:0.7 }}>{count}</span>
              </div>
            })}
          </div>
        </div>
      )}

      {loading ? <div style={{ color:"#444", fontSize:13 }}>Loading...</div> :
       reviews.length === 0 ? <div style={{ color:"#444", fontSize:13, padding:40, textAlign:"center" }}>{t.noData}</div> :
       reviews.map(r => (
        <Card key={r.id} mb={10}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#fff" }}>{r.customer_name||"Customer"}</div>
              <div style={{ fontSize:11, color:"#555" }}>{r.item||""}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:14 }}>{"⭐".repeat(r.rating)}</div>
              <div style={{ fontSize:10, color:"#444", marginTop:1 }}>{new Date(r.created_at).toLocaleDateString()}</div>
            </div>
          </div>
          {r.comment && <div style={{ fontSize:13, color:"#888", lineHeight:1.5 }}>{r.comment}</div>}
        </Card>
      ))}
    </div>
  )
}

function HoursPage({ t }) {
  const DAYS_KEYS = ["sat","sun","mon","tue","wed","thu","fri"]
  const [hours, setHours] = useState(DAYS_KEYS.map(d=>({day:d,open:true,from:"10:00",to:"00:00",allDay:false})))
  const [saved, setSaved] = useState(false)
  const upd = (i,k,v) => setHours(p=>p.map((h,j)=>j===i?{...h,[k]:v}:h))

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em", color:"#fff", marginBottom:20 }}>{t.hours}</div>
      <Card>
        <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:"#444", marginBottom:14 }}>{t.weeklySchedule}</div>
        {hours.map((h,i)=>(
          <div key={h.day} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:"1px solid #1a1a1a", flexWrap:"wrap" }}>
            <div style={{ width:90, fontSize:13, fontWeight:600, color:"#fff" }}>{t[h.day]}</div>
            <Tog label="" value={h.open} onChange={v=>upd(i,"open",v)}/>
            {h.open&&!h.allDay&&<>
              <input type="time" value={h.from} onChange={e=>upd(i,"from",e.target.value)} style={{ padding:"6px 8px", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:9, fontSize:12, outline:"none", color:"#fff" }}/>
              <span style={{ fontSize:12, color:"#444" }}>{t.to}</span>
              <input type="time" value={h.to} onChange={e=>upd(i,"to",e.target.value)} style={{ padding:"6px 8px", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:9, fontSize:12, outline:"none", color:"#fff" }}/>
            </>}
            {h.open&&<label style={{ display:"flex", alignItems:"center", gap:5, cursor:"pointer", fontSize:12, color:"#555", marginLeft:"auto" }}>
              <input type="checkbox" checked={h.allDay} onChange={e=>upd(i,"allDay",e.target.checked)} style={{ accentColor:R }}/>{t.allDay}
            </label>}
            {!h.open&&<span style={{ fontSize:12, color:"#333" }}>{t.closed_day}</span>}
          </div>
        ))}
      </Card>
      <Card>
        <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:"#444", marginBottom:14 }}>{t.specialModes}</div>
        {[["🌙 Ramadan","Special Ramadan schedule"],["🎉 Holiday Mode","Close all branches instantly"],["⛔ Emergency","Close everything now"]].map(([l,s])=>(
          <div key={l} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 0", borderBottom:"1px solid #1a1a1a" }}>
            <div><div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{l}</div><div style={{ fontSize:11, color:"#444", marginTop:1 }}>{s}</div></div>
            <button style={{ padding:"7px 13px", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:9, color:"#666", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.activate}</button>
          </div>
        ))}
      </Card>
      <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}} style={{ padding:"11px 22px", background:saved?"#10b981":R, border:"none", borderRadius:12, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.3s" }}>{saved?t.saved:t.saveHours}</button>
    </div>
  )
}

function BranchesPage({ restaurant, t, lang }) {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('branches').select('*').eq('restaurant_id', restaurant.id)
      setBranches(data || [])
      setLoading(false)
    }
    fetch()
  }, [restaurant.id])

  const toggle = async (id, status) => {
    const next = status === 'open' ? 'closed' : 'open'
    await supabase.from('branches').update({ status: next }).eq('id', id)
    setBranches(prev => prev.map(b => b.id === id ? { ...b, status: next } : b))
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em", color:"#fff" }}>{t.branches}</div>
        <button style={{ padding:"9px 18px", background:R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>{t.addBranch}</button>
      </div>

      {loading ? <div style={{ color:"#444", fontSize:13 }}>Loading...</div> :
       branches.length === 0 ? <div style={{ color:"#444", fontSize:13, padding:40, textAlign:"center" }}>{t.noData}</div> :
       branches.map(b => (
        <Card key={b.id} mb={12}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:"#fff", marginBottom:1 }}>{lang==="ar"&&b.name_ar?b.name_ar:b.name}</div>
              <div style={{ fontSize:12, color:"#555" }}>📍 {b.address}</div>
            </div>
            <button onClick={()=>toggle(b.id,b.status)} style={{ padding:"6px 13px", borderRadius:20, border:"1.5px solid", borderColor:b.status==="open"?"#10b981":"#2a2a2a", background:b.status==="open"?"#10b98120":"transparent", color:b.status==="open"?"#10b981":"#555", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              {b.status==="open"?t.open:t.closed}
            </button>
          </div>
          <button style={{ padding:"9px 15px", background:`${R}15`, border:`1px solid ${R}30`, borderRadius:11, color:R, fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.manage}</button>
        </Card>
      ))}
    </div>
  )
}

function SettingsPage({ restaurant, t, lang }) {
  const [isOpen, setIsOpen] = useState(true)
  const [accepting, setAccepting] = useState(true)
  const [delivery, setDelivery] = useState(true)
  const [dineIn, setDineIn] = useState(true)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ name: restaurant.name, cuisine: restaurant.cuisine||"", phone: restaurant.phone||"", pickup_time: restaurant.pickup_time||"15-20" })

  const save = async () => {
    await supabase.from('restaurants').update(form).eq('id', restaurant.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const slug = restaurant.slug
  const links = [
    [t.customerApp, `qlick.help/${slug}`],
    [t.ownerDash, `qlick.help/${slug}/dashboard`],
  ]

  return (
    <div style={{ maxWidth:600 }}>
      <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em", color:"#fff", marginBottom:20 }}>{t.settings}</div>
      <Card>
        <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:"#444", marginBottom:14 }}>{t.operations}</div>
        <Tog label={t.restaurantOpen} sub={t.openSub} value={isOpen} onChange={setIsOpen}/>
        <Tog label={t.acceptingOrders} value={accepting} onChange={setAccepting}/>
        <Tog label={t.deliveryAvail} value={delivery} onChange={setDelivery}/>
        <Tog label={t.dineInAvail} value={dineIn} onChange={setDineIn}/>
      </Card>
      <Card>
        <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:"#444", marginBottom:14 }}>{t.restaurantInfo}</div>
        {[[t.name,"name"],[t.cuisine,"cuisine"],[t.phone,"phone"],[t.pickupTime,"pickup_time"]].map(([label,key])=>(
          <div key={key} style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#555", marginBottom:4 }}>{label}</div>
            <input value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} style={{ width:"100%", padding:"10px 14px", background:"#1a1a1a", border:"1.5px solid #2a2a2a", borderRadius:12, fontSize:14, color:"#fff", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
              onFocus={e=>{e.target.style.borderColor=R}} onBlur={e=>{e.target.style.borderColor="#2a2a2a"}}/>
          </div>
        ))}
        <button onClick={save} style={{ padding:"9px 20px", background:saved?"#10b981":R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.3s" }}>{saved?t.saved:t.save}</button>
      </Card>
      <Card mb={0}>
        <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:"#444", marginBottom:14 }}>{t.yourLinks}</div>
        {links.map(([label,url])=>(
          <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #1a1a1a" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:"#fff" }}>{label}</div>
              <div style={{ fontSize:11, color:R, fontFamily:"monospace", marginTop:1 }}>{url}</div>
            </div>
            <button onClick={()=>navigator.clipboard?.writeText(url)} style={{ padding:"5px 11px", background:`${R}15`, border:`1px solid ${R}30`, borderRadius:8, color:R, fontSize:11, fontWeight:700, cursor:"pointer" }}>{t.copy}</button>
          </div>
        ))}
      </Card>
    </div>
  )
}



function EmployeesPage({ t, lang }) {
  const [emps] = useState(EMPLOYEES);
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontSize:22,fontWeight:900}}>Employees</div><button onClick={()=>setShowAdd(v=>!v)} style={{padding:"9px 18px",background:"#E03020",border:"none",borderRadius:11,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>+ Add Employee</button></div>
      {showAdd&&(
        <Card>
          <CardTitle>{t.newEmployee}</CardTitle>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            {[[t.fullName,"Ahmed"],[t.phone,"+966 5X"],[t.email,"x@x.com"],[t.password,"••••••••"]].map(([l,ph])=>(
              <div key={l}><div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{l}</div><input placeholder={ph} type={l===t.password?"password":"text"} style={inp()}/></div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            <div><div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{t.role}</div>
              <select style={inp()}><option>{lang==="ar"?"موظف":"Employee"}</option><option>{lang==="ar"?"مدير":"Manager"}</option></select></div>
            <div><div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{t.branch}</div>
              <select style={inp()}><option>Main Branch</option></select></div>
          </div>
          <button style={{ padding:"9px 18px", background:R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>{lang==="ar"?"إضافة":"Add"}</button>
        </Card>
      )}
      <div style={{ display:"flex", gap:12, marginBottom:18 }}>
        <StatCard icon="👥" label={t.totalEmployees} value={emps.length} color="#6366f1"/>
        <StatCard icon="🟢" label={t.onlineNow} value={emps.filter(e=>e.status==="online").length} color="#10b981"/>
        <StatCard icon="📦" label={t.ordersHandled} value={emps.reduce((s,e)=>s+e.handled,0)} color={R}/>
      </div>
      {emps.map(emp=>(
        <Card key={emp.id} mb={10}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:`${emp.role==="manager"?"#0ea5e9":"#E03020"}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:21 }}>
                {emp.role==="manager"?"🧑‍💼":"👷"}
              </div>
              <div style={{ position:"absolute", bottom:0, right:0, width:12, height:12, borderRadius:"50%", background:emp.status==="online"?"#10b981":"#d1d5db", border:"2px solid #fff" }}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:2 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{lang==="ar"?emp.nameAr:emp.name}</div>
                <span style={{ padding:"2px 7px", borderRadius:10, fontSize:10, fontWeight:700, background:emp.role==="manager"?"#dbeafe":"#f0f0f0", color:emp.role==="manager"?"#0ea5e9":"#888" }}>
                  {emp.role==="manager"?(lang==="ar"?"مدير":"Manager"):(lang==="ar"?"موظف":"Employee")}
                </span>
              </div>
              <div style={{ fontSize:11, color:"#aaa" }}>📍 {lang==="ar"?emp.bNameAr:emp.bName} · 📞 {emp.phone}</div>
              <div style={{ fontSize:11, color:"#aaa", marginTop:1 }}>
                {emp.status==="online"?`🟢 ${t.online} ${emp.login} · ${emp.handled} ${t.orders_count}`:`⚫ ${t.lastSeen}`}
              </div>
            </div>
            <div style={{ display:"flex", gap:5 }}>
              <button style={{ padding:"6px 11px", background:"#f8f8f8", border:"1px solid #f0f0f0", borderRadius:9, color:"#666", fontSize:11, fontWeight:700, cursor:"pointer" }}>{lang==="ar"?"تعديل":"Edit"}</button>
              <button style={{ padding:"6px 11px", background:"#fee2e2", border:"1px solid #fecaca", borderRadius:9, color:"#ef4444", fontSize:11, fontWeight:700, cursor:"pointer" }}>{lang==="ar"?"حذف":"Remove"}</button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}


function PaymentPage({ t, lang }) {
  const pending = PAYOUTS.find(p=>p.status==="pending")?.amount||0;
  const paid = PAYOUTS.filter(p=>p.status==="paid").reduce((s,p)=>s+p.amount,0);
  return (
    <div>
      <STitle title={t.payment}/>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:18 }}>
        <StatCard icon="💰" label={t.totalEarned} value={`﷼${paid.toLocaleString()}`} color="#10b981"/>
        <StatCard icon="⏳" label={t.pendingPayout} value={`﷼${pending.toLocaleString()}`} color="#f59e0b"/>
        <StatCard icon="📊" label={t.thisMonth} value="﷼7,960" trend={14} color={R}/>
        <StatCard icon="💳" label="Moyasar" value="1.9%" color="#6366f1"/>
      </div>
      <Card>
        <CardTitle>{t.connectedAccount}</CardTitle>
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:13, background:"#f8f8f8", borderRadius:13 }}>
          <div style={{ width:44, height:44, borderRadius:13, background:"#10b98120", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🏦</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:14 }}>{lang==="ar"?"بنك الراجحي":"Al Rajhi Bank"}</div>
            <div style={{ fontSize:12, color:"#888" }}>IBAN: SA•• •••• •••• •••• 4521</div>
            <div style={{ fontSize:11, color:"#10b981", marginTop:1 }}>✓ {lang==="ar"?"موثق عبر ميسر":"Verified via Moyasar"}</div>
          </div>
          <button style={{ padding:"7px 13px", background:`${R}10`, border:`1px solid ${R}30`, borderRadius:9, color:R, fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.change}</button>
        </div>
      </Card>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:13 }}>
          <CardTitle>{t.payoutHistory}</CardTitle>
          <button style={{ padding:"5px 11px", background:"#f8f8f8", border:"1px solid #f0f0f0", borderRadius:8, color:"#555", fontSize:11, fontWeight:700, cursor:"pointer" }}>{t.download}</button>
        </div>
        {PAYOUTS.map(p=>(
          <div key={p.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #f8f8f8" }}>
            <div><div style={{ fontWeight:700, fontSize:13 }}>{lang==="ar"?p.date:p.dateEn}</div><div style={{ fontSize:11, color:"#aaa" }}>{p.ref}</div></div>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ fontWeight:800, fontSize:14 }}>﷼{p.amount.toLocaleString()}</div>
              <span style={{ padding:"3px 9px", borderRadius:20, fontSize:10, fontWeight:700, background:p.status==="paid"?"#d1fae5":"#fef3c7", color:p.status==="paid"?"#10b981":"#d97706" }}>{p.status==="paid"?t.paid:t.pendingStatus}</span>
            </div>
          </div>
        ))}
      </Card>
      <Card mb={0}>
        <CardTitle>{t.thisMonthBreakdown}</CardTitle>
        {[[t.grossRevenue,"﷼8,120","#1a1a1a"],[t.moyasarFee,"−﷼154","#ef4444"],[t.netPayout,"﷼7,966",R]].map(([l,v,c],i)=>(
          <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:i<2?"1px solid #f8f8f8":"none" }}>
            <span style={{ fontSize:13, color:i===2?"#1a1a1a":"#666", fontWeight:i===2?800:500 }}>{l}</span>
            <span style={{ fontSize:13, fontWeight:800, color:c }}>{v}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── NAV CONFIG ────────────────────────────────────────────────────────────────
const NAV = {
  owner:   [{id:"overview",icon:"📊"},{id:"orders",icon:"📦",badge:true},{id:"menu",icon:"🍽️"},{id:"stock",icon:"🗃️"},{id:"analytics",icon:"📈"},{id:"employees",icon:"👥"},{id:"branches",icon:"🏪"},{id:"reviews",icon:"⭐"},{id:"hours",icon:"🕐"},{id:"payment",icon:"💳"},{id:"settings",icon:"⚙️"}],
  manager: [{id:"overview",icon:"📊"},{id:"orders",icon:"📦",badge:true},{id:"menu",icon:"🍽️"},{id:"stock",icon:"🗃️"},{id:"analytics",icon:"📈"},{id:"employees",icon:"👥"},{id:"branches",icon:"🏪"},{id:"reviews",icon:"⭐"},{id:"hours",icon:"🕐"},{id:"settings",icon:"⚙️"}],
  employee:[{id:"orders",icon:"📦",badge:true},{id:"menu",icon:"🍽️"},{id:"stock",icon:"🗃️"}],
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function OwnerDashboard() {
  const { id: slug } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState("overview")
  const [lang, setLang] = useState("en")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const role = "owner" // TODO: get from auth

  const t = T[lang]
  const dir = t.dir

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('restaurants').select('*').eq('slug', slug).single()
      if (!data) { navigate('/'); return }
      setRestaurant(data)
      setLoading(false)
    }
    fetch()
  }, [slug])

  useEffect(() => {
    if (!restaurant) return
    const fetchPending = async () => {
      const { count } = await supabase.from('orders').select('*', { count:'exact', head:true }).eq('restaurant_id', restaurant.id).eq('status','pending')
      setPendingCount(count || 0)
    }
    fetchPending()
    const sub = supabase.channel('pending').on('postgres_changes', { event:'*', schema:'public', table:'orders', filter:`restaurant_id=eq.${restaurant.id}` }, fetchPending).subscribe()
    return () => supabase.removeChannel(sub)
  }, [restaurant])

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800;900&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:2px}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  if (loading) return <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", color:"#444", fontFamily:"'DM Sans',sans-serif" }}>Loading...</div>

  const nav = NAV[role]
  const navLabel = (id) => ({ overview:t.overview,orders:t.orders,menu:t.menu,stock:t.stock,analytics:t.analytics,employees:t.employees,branches:t.branches,reviews:t.reviews,hours:t.hours,payment:t.payment,settings:t.settings })[id]

  return (
    <div dir={dir} style={{ minHeight:"100vh", background:"#0a0a0a", color:"#fff", fontFamily:t.font, display:"flex" }}>

      {/* Sidebar */}
      <div style={{ width:sidebarOpen?230:62, minWidth:sidebarOpen?230:62, background:"#0d0d0d", borderRight:"1px solid #1a1a1a", display:"flex", flexDirection:"column", transition:"width 0.3s ease", overflow:"hidden", position:"sticky", top:0, height:"100vh", alignSelf:"flex-start" }}>

        {/* Logo */}
        <div style={{ padding:"16px 13px", borderBottom:"1px solid #1a1a1a", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:12, background:`${R}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{restaurant.emoji||"🍔"}</div>
          {sidebarOpen && <div style={{ overflow:"hidden" }}>
            <div style={{ fontWeight:800, fontSize:13, whiteSpace:"nowrap", color:"#fff" }}>{restaurant.name}</div>
            <div style={{ fontSize:10, color:ROLES[role].color, fontWeight:700 }}>{ROLES[role].icon} {lang==="ar"?ROLES[role].labelAr:ROLES[role].label}</div>
          </div>}
        </div>

        {/* Lang toggle */}
        {sidebarOpen && (
          <div style={{ padding:"8px 12px", borderBottom:"1px solid #1a1a1a" }}>
            <button onClick={()=>setLang(l=>l==="en"?"ar":"en")} style={{ width:"100%", padding:"7px 10px", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:9, fontSize:12, fontWeight:700, color:"#666", cursor:"pointer", fontFamily:t.font }}>
              🌐 {lang==="en"?"عربي":"English"}
            </button>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
          {nav.map(item => (
            <button key={item.id} onClick={()=>setPage(item.id)} style={{ width:"100%", padding:"10px 11px", marginBottom:2, background:page===item.id?`${R}15`:"transparent", border:"none", borderRadius:11, color:page===item.id?R:"#555", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:9, textAlign:"left", transition:"all 0.15s", position:"relative" }}>
              <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace:"nowrap" }}>{navLabel(item.id)}</span>}
              {item.badge && pendingCount > 0 && <span style={{ marginLeft:"auto", background:R, color:"#fff", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:900, flexShrink:0 }}>{pendingCount}</span>}
              {page===item.id && <div style={{ position:"absolute", left:0, top:"20%", bottom:"20%", width:3, borderRadius:"0 2px 2px 0", background:R }}/>}
            </button>
          ))}
        </nav>

        {/* View App */}
        <div style={{ padding:"9px 8px", borderTop:"1px solid #1a1a1a" }}>
          <button onClick={()=>window.open(`/${restaurant.slug}`,'_blank')} style={{ width:"100%", padding:"9px 11px", background:`${R}15`, border:`1px solid ${R}30`, borderRadius:11, color:R, fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            <span>📱</span>{sidebarOpen&&<span>{t.customerApp}</span>}
          </button>
        </div>

        <button onClick={()=>setSidebarOpen(v=>!v)} style={{ padding:12, background:"transparent", border:"none", borderTop:"1px solid #1a1a1a", color:"#333", fontSize:12, cursor:"pointer" }}>{sidebarOpen?"◀":"▶"}</button>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"24px 28px", minHeight:"100vh" }}>
        <div style={{ maxWidth:920, margin:"0 auto", animation:"fadeIn 0.25s ease" }} key={page+lang}>
          {page==="overview"  && <OverviewPage restaurant={restaurant} t={t} lang={lang}/>}
          {page==="orders"    && <OrdersPage restaurant={restaurant} t={t} lang={lang}/>}
          {page==="menu"      && <MenuPage restaurant={restaurant} t={t} role={role}/>}
          {page==="stock"     && <StockPage restaurant={restaurant} t={t}/>}
          {page==="analytics" && <AnalyticsPage restaurant={restaurant} t={t} lang={lang}/>}
          {page==="branches"  && <BranchesPage restaurant={restaurant} t={t} lang={lang}/>}
          {page==="reviews"   && <ReviewsPage restaurant={restaurant} t={t}/>}
          {page==="hours"     && <HoursPage t={t}/>}
          {page==="employees" && <EmployeesPage t={t} lang={lang}/>}
          {page==="payment"   && <PaymentPage t={t} lang={lang}/>}
          {page==="settings"  && <SettingsPage restaurant={restaurant} t={t} lang={lang}/>}
        </div>
      </div>
    </div>
  )
}






