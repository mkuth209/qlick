import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T = {
  en: {
    dir:"ltr", font:"'DM Sans', sans-serif", arabicFont:"",
    overview:"Overview", orders:"Orders", menu:"Menu", stock:"Stock",
    analytics:"Analytics", employees:"Employees", branches:"Branches",
    reviews:"Reviews", hours:"Working Hours", payment:"Payments", settings:"Settings",
    goodMorning:"Good morning 👋", todayOverview:"Here's your restaurant today",
    ordersToday:"Orders Today", revenue:"Revenue", pending:"Pending",
    avgRating:"Avg Rating", lowStock:"Low Stock", itemsNeedRestock:"items need restock",
    weeklyRevenue:"Weekly Revenue", vsLastWeek:"vs last week", ordersByHour:"Orders by Hour",
    branchPerformance:"Branch Performance", recentOrders:"Recent Orders",
    lowStockAlert:"Low Stock Alert", needRestocking:"item(s) need restocking",
    onlyLeft:"only", left:"left", alertAt:"alert at",
    accept:"Accept", markReady:"Mark Ready", complete:"Complete", reject:"Reject",
    whatsappDriver:"📱 WhatsApp Driver", orderTypes:"Order Types", paymentMethods:"Payment Methods",
    bestSelling:"🏆 Best Selling Items", branchRevenue:"Branch Revenue Comparison",
    totalRevenue:"Total Revenue", totalOrders:"Total Orders", avgOrderValue:"Avg Order Value",
    returningCustomers:"Returning Customers", rejectionRate:"Rejection Rate", avgPrepTime:"Avg Prep Time",
    revenuetrend:"Revenue Trend", peak:"Peak",
    addEmployee:"+ Add Employee", newEmployee:"New Employee", fullName:"Full Name",
    phone:"Phone", email:"Email", password:"Password", role:"Role", branch:"Branch",
    totalEmployees:"Total", onlineNow:"Online Now", ordersHandled:"Orders Handled",
    online:"Online since", lastSeen:"Last seen", active:"Active now",
    addBranch:"+ Add Branch", manage:"Manage", staff:"staff",
    addItem:"+ Add Item", newItem:"New Item", itemName:"Item Name",
    category:"Category", price:"Price (SAR)", emoji:"Emoji", stockQty:"Stock Qty",
    lowStockAlertLabel:"Low Stock Alert", customize:"⚙️ Options", available:"Available",
    off:"Off", sizePricing:"Sizes & Pricing", optionsAddons:"Options & Add-ons",
    required:"Required", newSize:"New size (e.g. Large)", saveCustom:"Save Customization",
    newGroup:"New group name (e.g. Sauce)", choiceName:"Choice name",
    stockMgmt:"Stock Management", stockLevels:"Stock Levels", inStock:"In Stock",
    outOfStock:"Out of Stock", restock:"Restock", totalItems:"Total Items",
    weeklySchedule:"Weekly Schedule", specialModes:"Special Modes", activate:"Activate",
    ramadanHours:"🌙 Ramadan Hours", ramadanSub:"Special schedule for Ramadan",
    holidayMode:"🎉 Holiday Mode", holidaySub:"Close all branches instantly",
    emergencyClose:"⛔ Emergency Close", emergencySub:"Close everything with one click",
    saveHours:"Save Hours", saved:"✓ Saved!",
    connectedAccount:"Connected Account", payoutHistory:"Payout History",
    download:"Download", thisMonthBreakdown:"This Month Breakdown",
    grossRevenue:"Gross Revenue", moyasarFee:"Moyasar Fees (1.9%)", netPayout:"Net Payout",
    totalEarned:"Total Earned", pendingPayout:"Pending", thisMonth:"This Month",
    paid:"✓ Paid", pendingStatus:"⏳ Pending", change:"Change",
    operations:"Operations", restaurantOpen:"Restaurant is Open", openSub:"Customers can see & order",
    acceptingOrders:"Accepting Orders", acceptingSub:"New orders can be placed",
    deliveryAvail:"Delivery Available", deliverySub:"Enable delivery orders",
    dineInAvail:"Dine-in Available", dineInSub:"Enable table ordering",
    restaurantInfo:"Restaurant Info", name:"Name", cuisine:"Cuisine",
    whatsapp:"WhatsApp", pickupTime:"Pickup Time", minDelivery:"Min Delivery Order",
    deliveryFee:"Delivery Fee", save:"Save", yourLinks:"Your Links",
    customerApp:"📱 Customer App", ownerDash:"📊 Owner Dashboard",
    managerLogin:"🧑‍💼 Manager Login", employeeLogin:"👷 Employee Login", copy:"Copy",
    allBranches:"All Branches",
    open:"● Open", closed:"○ Closed", day:"day", week:"week", month:"month", year:"year",
    pickup:"Pickup", delivery:"Delivery", dineIn:"Dine-in",
    doneSt:"Done", rejected:"Rejected", preparing:"Preparing", ready:"Ready 🥡",
    pendingSt:"Pending", address:"Address",
    sat:"Saturday", sun:"Sunday", mon:"Monday", tue:"Tuesday", wed:"Wednesday", thu:"Thursday", fri:"Friday",
    to:"to", closed_day:"Closed", allDay:"24h",
    orders_count:"orders", size:"size", optionGroups:"option groups",
  },
  ar: {
    dir:"rtl", font:"'Tajawal', sans-serif",
    arabicFont:"https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap",
    overview:"نظرة عامة", orders:"الطلبات", menu:"القائمة", stock:"المخزون",
    analytics:"التحليلات", employees:"الموظفون", branches:"الفروع",
    reviews:"التقييمات", hours:"ساعات العمل", payment:"المدفوعات", settings:"الإعدادات",
    goodMorning:"صباح الخير 👋", todayOverview:"إليك أداء مطعمك اليوم",
    ordersToday:"طلبات اليوم", revenue:"الإيرادات", pending:"قيد الانتظار",
    avgRating:"متوسط التقييم", lowStock:"مخزون منخفض", itemsNeedRestock:"منتج يحتاج إعادة تخزين",
    weeklyRevenue:"إيرادات الأسبوع", vsLastWeek:"مقارنة بالأسبوع الماضي", ordersByHour:"الطلبات بالساعة",
    branchPerformance:"أداء الفروع", recentOrders:"الطلبات الأخيرة",
    lowStockAlert:"تنبيه مخزون منخفض", needRestocking:"منتج يحتاج إعادة تخزين",
    onlyLeft:"متبقي فقط", left:"", alertAt:"تنبيه عند",
    accept:"قبول", markReady:"جاهز", complete:"إتمام", reject:"رفض",
    whatsappDriver:"📱 واتساب السائق", orderTypes:"أنواع الطلبات", paymentMethods:"طرق الدفع",
    bestSelling:"🏆 الأكثر مبيعاً", branchRevenue:"مقارنة إيرادات الفروع",
    totalRevenue:"إجمالي الإيرادات", totalOrders:"إجمالي الطلبات", avgOrderValue:"متوسط قيمة الطلب",
    returningCustomers:"العملاء العائدون", rejectionRate:"نسبة الرفض", avgPrepTime:"متوسط وقت التحضير",
    revenuetrend:"اتجاه الإيرادات", peak:"ذروة",
    addEmployee:"+ إضافة موظف", newEmployee:"موظف جديد", fullName:"الاسم الكامل",
    phone:"الجوال", email:"البريد الإلكتروني", password:"كلمة المرور", role:"الدور", branch:"الفرع",
    totalEmployees:"الإجمالي", onlineNow:"متصل الآن", ordersHandled:"الطلبات المعالجة",
    online:"متصل منذ", lastSeen:"آخر ظهور", active:"نشط الآن",
    addBranch:"+ إضافة فرع", manage:"إدارة", staff:"موظف",
    addItem:"+ إضافة منتج", newItem:"منتج جديد", itemName:"اسم المنتج",
    category:"الفئة", price:"السعر (ريال)", emoji:"رمز", stockQty:"الكمية",
    lowStockAlertLabel:"تنبيه المخزون المنخفض", customize:"⚙️ الخيارات", available:"متاح",
    off:"غير متاح", sizePricing:"الأحجام والأسعار", optionsAddons:"الخيارات والإضافات",
    required:"إلزامي", newSize:"حجم جديد (مثل: كبير)", saveCustom:"حفظ التخصيص",
    newGroup:"اسم المجموعة (مثل: الصوص)", choiceName:"اسم الخيار",
    stockMgmt:"إدارة المخزون", stockLevels:"مستويات المخزون", inStock:"متوفر",
    outOfStock:"نفد المخزون", restock:"إعادة تخزين", totalItems:"إجمالي المنتجات",
    weeklySchedule:"الجدول الأسبوعي", specialModes:"الأوضاع الخاصة", activate:"تفعيل",
    ramadanHours:"🌙 أوقات رمضان", ramadanSub:"جدول خاص لشهر رمضان",
    holidayMode:"🎉 وضع الإجازة", holidaySub:"إغلاق جميع الفروع فوراً",
    emergencyClose:"⛔ إغلاق طارئ", emergencySub:"إغلاق كل شيء بنقرة واحدة",
    saveHours:"حفظ الأوقات", saved:"✓ تم الحفظ!",
    connectedAccount:"الحساب المرتبط", payoutHistory:"سجل المدفوعات",
    download:"تحميل", thisMonthBreakdown:"تفاصيل هذا الشهر",
    grossRevenue:"الإيرادات الإجمالية", moyasarFee:"رسوم ميسر (1.9%)", netPayout:"صافي الدفع",
    totalEarned:"إجمالي الأرباح", pendingPayout:"قيد الانتظار", thisMonth:"هذا الشهر",
    paid:"✓ مدفوع", pendingStatus:"⏳ قيد الانتظار", change:"تغيير",
    operations:"العمليات", restaurantOpen:"المطعم مفتوح", openSub:"العملاء يمكنهم الرؤية والطلب",
    acceptingOrders:"استقبال الطلبات", acceptingSub:"يمكن وضع طلبات جديدة",
    deliveryAvail:"خدمة التوصيل", deliverySub:"تفعيل طلبات التوصيل",
    dineInAvail:"الجلوس بالمطعم", dineInSub:"تفعيل طلبات الطاولات",
    restaurantInfo:"معلومات المطعم", name:"الاسم", cuisine:"نوع المطبخ",
    whatsapp:"واتساب", pickupTime:"وقت الاستلام", minDelivery:"الحد الأدنى للتوصيل",
    deliveryFee:"رسوم التوصيل", save:"حفظ", yourLinks:"روابطك",
    customerApp:"📱 تطبيق العميل", ownerDash:"📊 لوحة المالك",
    managerLogin:"🧑‍💼 دخول المدير", employeeLogin:"👷 دخول الموظف", copy:"نسخ",
    allBranches:"جميع الفروع",
    open:"● مفتوح", closed:"○ مغلق", day:"يوم", week:"أسبوع", month:"شهر", year:"سنة",
    pickup:"استلام", delivery:"توصيل", dineIn:"داخل المطعم",
    doneSt:"منتهي", rejected:"مرفوض", preparing:"قيد التحضير", ready:"جاهز 🥡",
    pendingSt:"قيد الانتظار", address:"العنوان",
    sat:"السبت", sun:"الأحد", mon:"الاثنين", tue:"الثلاثاء", wed:"الأربعاء", thu:"الخميس", fri:"الجمعة",
    to:"إلى", closed_day:"مغلق", allDay:"٢٤ ساعة",
    orders_count:"طلب", size:"حجم", optionGroups:"مجموعة خيارات",
  }
};

const R = "#E03020";

const PAYOUTS = [
  { id:1, date:"7 مايو 2026",   dateEn:"May 7, 2026",  amount:4280, status:"paid",    ref:"TXN-88821" },
  { id:2, date:"30 أبريل 2026", dateEn:"Apr 30, 2026", amount:3910, status:"paid",    ref:"TXN-88654" },
  { id:3, date:"8 مايو 2026",   dateEn:"May 8, 2026",  amount:1240, status:"pending", ref:"TXN-88999" },
];

const H_LABELS = ["6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p"];
const WEEKLY_DAYS = { en:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], ar:["إث","ثل","أر","خم","جم","سب","أح"] };

const ORDER_STATUS = (t) => ({
  pending:   { label:t.pendingSt,  color:"#f59e0b", bg:"#fef3c7", next:"preparing", btn:t.accept },
  preparing: { label:t.preparing,  color:"#3b82f6", bg:"#dbeafe", next:"ready",     btn:t.markReady },
  ready:     { label:t.ready,      color:"#10b981", bg:"#d1fae5", next:"completed", btn:t.complete },
  completed: { label:t.doneSt,     color:"#6b7280", bg:"#f3f4f6", next:null,        btn:null },
  rejected:  { label:t.rejected,   color:"#ef4444", bg:"#fee2e2", next:null,        btn:null },
});

const TYPE_ICON = { pickup:"🥡", delivery:"🛵", "dine-in":"🪑" };
const TYPE_LABEL = (t) => ({ pickup:t.pickup, delivery:t.delivery, "dine-in":t.dineIn });

const NAV_IDS = ["overview","orders","menu","stock","analytics","employees","branches","reviews","hours","payment","settings"];
const NAV_ICONS = { overview:"📊",orders:"📦",menu:"🍽️",stock:"🗃️",analytics:"📈",employees:"👥",branches:"🏪",reviews:"⭐",hours:"🕐",payment:"💳",settings:"⚙️" };

// ── HELPERS ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr, lang) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (lang === "ar") {
    if (diff < 60) return `منذ ${diff} ثانية`;
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    return `منذ ${Math.floor(diff / 3600)} ساعة`;
  }
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function relativeDate(dateStr, lang) {
  if (!dateStr) return "";
  const diffDays = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (lang === "ar") {
    if (diffDays === 0) return "اليوم";
    if (diffDays === 1) return "أمس";
    return `منذ ${diffDays} أيام`;
  }
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function fmtId(id) {
  if (!id) return "#----";
  const s = String(id);
  return "#" + (s.length > 6 ? s.slice(-6).toUpperCase() : s.toUpperCase());
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────
const inp = (extra = {}) => ({
  width:"100%", padding:"9px 13px", background:"#f8f8f8", border:"1.5px solid #f0f0f0",
  borderRadius:11, fontSize:13, color:"#1a1a1a", outline:"none", fontFamily:"inherit",
  boxSizing:"border-box", ...extra
});

function Badge({ status, t }) {
  const s = ORDER_STATUS(t)[status] || ORDER_STATUS(t).pending;
  return <span style={{ padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, color:s.color, background:s.bg }}>{s.label}</span>;
}

function StatCard({ icon, label, value, color=R, trend, sub }) {
  return (
    <div style={{ background:"#fff", borderRadius:18, padding:"18px 20px", flex:1, minWidth:140, border:"1px solid #f0f0f0", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div style={{ width:42, height:42, borderRadius:13, background:`${color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
        {trend != null && <div style={{ fontSize:11, fontWeight:700, color:trend>=0?"#10b981":"#ef4444", background:trend>=0?"#d1fae5":"#fee2e2", padding:"3px 8px", borderRadius:20 }}>{trend>=0?"↑":"↓"}{Math.abs(trend)}%</div>}
      </div>
      <div style={{ fontSize:26, fontWeight:900, color:"#1a1a1a", marginBottom:2 }}>{value}</div>
      <div style={{ fontSize:12, color:"#888" }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:"#bbb", marginTop:1 }}>{sub}</div>}
    </div>
  );
}

function Tog({ label, sub, value, onChange }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom:"1px solid #f8f8f8" }}>
      <div>
        <div style={{ fontSize:14, fontWeight:600 }}>{label}</div>
        {sub && <div style={{ fontSize:12, color:"#888", marginTop:1 }}>{sub}</div>}
      </div>
      <button onClick={() => onChange(!value)} style={{ width:46, height:25, borderRadius:13, background:value?R:"#e0e0e0", border:"none", cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
        <div style={{ width:19, height:19, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:value?24:3, transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
      </button>
    </div>
  );
}

function Card({ children, mb=14 }) {
  return <div style={{ background:"#fff", borderRadius:20, padding:22, marginBottom:mb, border:"1px solid #f0f0f0", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>{children}</div>;
}

function CardTitle({ children }) {
  return <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:"#aaa", marginBottom:14 }}>{children}</div>;
}

function STitle({ title, action, onClick }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
      <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em" }}>{title}</div>
      {action && <button onClick={onClick} style={{ padding:"9px 18px", background:R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>{action}</button>}
    </div>
  );
}

// ── PAGES ─────────────────────────────────────────────────────────────────────
function OverviewPage({ orders, menuItems, branches, weeklyRev, hourly, bf, t, lang }) {
  const filtered = bf === "all" ? orders : orders.filter(o => o.branch_id === bf);
  const revenue = filtered.filter(o => o.status === "completed").reduce((s, o) => s + (o.total || 0), 0);
  const pending = filtered.filter(o => o.status === "pending").length;
  const lowStock = menuItems.filter(m => m.stock <= m.alert);
  const maxR = Math.max(...weeklyRev, 1);
  const maxH = Math.max(...hourly, 1);
  const days = WEEKLY_DAYS[lang];
  const totalRev = weeklyRev.reduce((s, v) => s + v, 0);
  const firstHalf = weeklyRev.slice(0, 3).reduce((s, v) => s + v, 0);
  const secondHalf = weeklyRev.slice(4).reduce((s, v) => s + v, 0);
  const weekTrend = firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : 0;
  const maxBranchRev = Math.max(...branches.map(b => b.revenue || 0), 1);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em" }}>{t.goodMorning}</div>
          <div style={{ fontSize:13, color:"#888", marginTop:2 }}>{t.todayOverview}</div>
        </div>
        <div style={{ fontSize:12, color:"#888", background:"#f8f8f8", padding:"7px 14px", borderRadius:20 }}>
          {new Date().toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { weekday:"long", month:"long", day:"numeric" })}
        </div>
      </div>

      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:22 }}>
        <StatCard icon="📦" label={t.ordersToday} value={filtered.length} color={R}/>
        <StatCard icon="💰" label={t.revenue} value={`﷼${revenue.toLocaleString()}`} color="#10b981"/>
        <StatCard icon="⏳" label={t.pending} value={pending} color="#f59e0b"/>
        <StatCard icon="⚠️" label={t.lowStock} value={lowStock.length} color="#ef4444" sub={t.itemsNeedRestock}/>
      </div>

      {lowStock.length > 0 && (
        <div style={{ background:"#fef3c7", border:"1.5px solid #f59e0b", borderRadius:16, padding:"13px 17px", marginBottom:18, display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:20 }}>⚠️</span>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:"#92400e" }}>{t.lowStockAlert}</div>
            <div style={{ fontSize:11, color:"#b45309" }}>{lowStock.map(m => `${m.emoji || "📦"} ${m.name} (${m.stock})`).join(" · ")}</div>
          </div>
        </div>
      )}

      {totalRev > 0 && (
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:15 }}>{t.weeklyRevenue}</div>
            <div style={{ fontSize:12, color:"#10b981", fontWeight:700, background:"#d1fae5", padding:"4px 12px", borderRadius:20 }}>
              {weekTrend >= 0 ? "↑" : "↓"}{Math.abs(weekTrend)}% {t.vsLastWeek}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120 }}>
            {weeklyRev.map((val, i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div style={{ fontSize:9, color:"#aaa" }}>﷼{(val / 1000).toFixed(1)}k</div>
                <div style={{ width:"100%", background:`linear-gradient(180deg,${R},${R}77)`, borderRadius:"6px 6px 0 0", height:`${(val / maxR) * 95}px`, minHeight:4 }}/>
                <div style={{ fontSize:10, color:"#bbb" }}>{days[i]}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>{t.ordersByHour}</div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:70, overflowX:"auto" }}>
          {hourly.map((val, i) => (
            <div key={i} style={{ flexShrink:0, width:28, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <div style={{ width:"100%", background:val === maxH && val > 0 ? R : `${R}44`, borderRadius:"3px 3px 0 0", height:`${(val / maxH) * 60}px`, minHeight:3 }}/>
              <div style={{ fontSize:8, color:"#ccc" }}>{H_LABELS[i]}</div>
            </div>
          ))}
        </div>
      </Card>

      {bf === "all" && branches.length > 0 && (
        <Card>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>{t.branchPerformance}</div>
          {branches.map(b => (
            <div key={b.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #f8f8f8" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:b.status==="open"?"#10b981":"#ef4444", flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>{lang==="ar"?(b.name_ar||b.name):b.name}</div>
                <div style={{ fontSize:11, color:"#aaa" }}>{b.address || ""}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontWeight:800, fontSize:14, color:R }}>﷼{(b.revenue||0).toLocaleString()}</div>
                <div style={{ fontSize:11, color:"#aaa" }}>{b.orders||0} {t.orders_count}</div>
              </div>
              <div style={{ width:80, background:"#f0f0f0", borderRadius:4, height:6 }}>
                <div style={{ width:`${((b.revenue||0)/maxBranchRev)*100}%`, background:R, borderRadius:4, height:"100%" }}/>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Card mb={0}>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>{t.recentOrders}</div>
        {filtered.slice(0, 5).map(o => (
          <div key={o.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 0", borderBottom:"1px solid #f8f8f8" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:"#f8f8f8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{TYPE_ICON[o.type]||"📦"}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:13 }}>{fmtId(o.id)} · {o.customer_name}</div>
                <div style={{ fontSize:11, color:"#aaa" }}>{timeAgo(o.created_at,lang)} · {o._bName||""}</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontWeight:700, fontSize:13 }}>﷼{o.total}</span>
              <Badge status={o.status} t={t}/>
            </div>
          </div>
        ))}
        {!filtered.length && <div style={{ textAlign:"center", padding:30, color:"#ccc", fontSize:13 }}>{lang==="ar"?"لا توجد طلبات اليوم":"No orders yet"}</div>}
      </Card>
    </div>
  );
}

function OrdersPage({ orders, setOrders, bf, t, lang }) {
  const [filter, setFilter] = useState("all");
  const statuses = ORDER_STATUS(t);
  const bfOrders = bf === "all" ? orders : orders.filter(o => o.branch_id === bf);
  const filtered = bfOrders.filter(o => filter === "all" || o.status === filter);
  const filterList = ["all","pending","preparing","ready","completed","rejected"];
  const filterLabels = { all:lang==="ar"?"الكل":"All", pending:t.pendingSt, preparing:t.preparing, ready:t.ready, completed:t.doneSt, rejected:t.rejected };

  const update = async (id, next) => {
    await supabase.from("orders").update({ status: next }).eq("id", id);
    setOrders(p => p.map(o => o.id === id ? { ...o, status: next } : o));
  };

  return (
    <div>
      <STitle title={t.orders}/>
      <div style={{ display:"flex", gap:7, marginBottom:18, flexWrap:"wrap" }}>
        {filterList.map(f => {
          const count = bfOrders.filter(o => f==="all"||o.status===f).length;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:"7px 14px", borderRadius:20, border:"1.5px solid", borderColor:filter===f?R:"#e8e8e8", background:filter===f?`${R}10`:"#fff", color:filter===f?R:"#666", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
              {filterLabels[f]} {count>0&&<span style={{ background:filter===f?R:"#f0f0f0", color:filter===f?"#fff":"#999", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:800 }}>{count}</span>}
            </button>
          );
        })}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(o => {
          const s = statuses[o.status] || statuses.pending;
          const items = Array.isArray(o.items) ? o.items : (typeof o.items === "string" ? JSON.parse(o.items||"[]") : []);
          return (
            <Card key={o.id} mb={0}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:13 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:`${R}10`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{TYPE_ICON[o.type]||"📦"}</div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:15 }}>{fmtId(o.id)}</div>
                    <div style={{ fontSize:11, color:"#aaa" }}>{o.customer_name} · {timeAgo(o.created_at, lang)}</div>
                    {o.type==="delivery"&&<div style={{ fontSize:11, color:"#0ea5e9", marginTop:1 }}>📞 {o.customer_phone}</div>}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
                  <Badge status={o.status} t={t}/>
                  <div style={{ fontSize:11, color:"#bbb" }}>{o._bName||""} · {TYPE_LABEL(t)[o.type]||o.type}</div>
                </div>
              </div>
              <div style={{ background:"#f8f8f8", borderRadius:11, padding:"11px 13px", marginBottom:13 }}>
                {items.map((item, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#555", marginBottom:i<items.length-1?5:0 }}>
                    <span>{item.name} × {item.qty||1}</span>
                    <span style={{ fontWeight:600 }}>﷼{(item.price||0)*(item.qty||1)}</span>
                  </div>
                ))}
                <div style={{ borderTop:"1px solid #e8e8e8", marginTop:8, paddingTop:8, display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:13 }}>
                  <span>{lang==="ar"?"الإجمالي":"Total"}</span><span style={{ color:R }}>﷼{o.total}</span>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                {o.status==="pending"&&<button onClick={()=>update(o.id,"rejected")} style={{ padding:"8px 14px", background:"#fee2e2", border:"none", borderRadius:10, color:"#ef4444", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.reject}</button>}
                {o.type==="delivery"&&o.status!=="completed"&&o.status!=="rejected"&&(
                  <a href={`https://wa.me/${(o.customer_phone||"").replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{ padding:"8px 14px", background:"#e0f2fe", border:"none", borderRadius:10, color:"#0ea5e9", fontSize:12, fontWeight:700, cursor:"pointer", textDecoration:"none" }}>{t.whatsappDriver}</a>
                )}
                {s.next&&<button onClick={()=>update(o.id,s.next)} style={{ padding:"8px 18px", background:s.color, border:"none", borderRadius:10, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>{s.btn}</button>}
              </div>
            </Card>
          );
        })}
        {!filtered.length&&<div style={{ textAlign:"center", padding:50, color:"#ccc", fontSize:13 }}>{lang==="ar"?"لا توجد طلبات":"No orders found"}</div>}
      </div>
    </div>
  );
}

function MenuPage({ menuItems, setMenuItems, orders, restaurantId, t, lang }) {
  const [customizing, setCustomizing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", category:"", price:"", emoji:"🍔", stock:"50", low_stock_alert:"10" });

  const itemOrderCounts = useMemo(() => {
    const counts = {};
    orders.forEach(o => {
      (Array.isArray(o.items)?o.items:[]).forEach(item => {
        if (item.name) counts[item.name] = (counts[item.name]||0) + (item.qty||1);
      });
    });
    return counts;
  }, [orders]);

  const toggle = async (id) => {
    const item = menuItems.find(m => m.id === id);
    await supabase.from("menu_items").update({ available:!item.available }).eq("id", id);
    setMenuItems(p => p.map(m => m.id===id?{...m,available:!m.available}:m));
  };

  const addItem = async () => {
    if (!form.name || !form.price) return;
    const { data, error } = await supabase.from("menu_items").insert({
      name: form.name, category: form.category||"General",
      price: Number(form.price), emoji: form.emoji||"🍔",
      stock: Number(form.stock)||0, low_stock_alert: Number(form.low_stock_alert)||10,
      available: true, restaurant_id: restaurantId,
    }).select().single();
    if (!error && data) {
      setMenuItems(p => [...p, { ...data, alert:data.low_stock_alert, sizes:[], options:[] }]);
      setForm({ name:"", category:"", price:"", emoji:"🍔", stock:"50", low_stock_alert:"10" });
      setShowAdd(false);
    }
  };

  const deleteItem = async (id) => {
    await supabase.from("menu_items").delete().eq("id", id);
    setMenuItems(p => p.filter(m => m.id !== id));
  };

  const cats = [...new Set(menuItems.map(m => m.category||"General"))];

  const Customizer = ({ item, onClose }) => {
    const [sizes, setSizes] = useState(item.sizes||[]);
    const [options, setOptions] = useState(item.options||[]);
    const [nSize, setNSize] = useState({ label:"", price:"" });
    const [nChoice, setNChoice] = useState({ group:"", name:"", price:"" });
    return (
      <>
        <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200 }}/>
        <div style={{ position:"fixed", top:"5%", left:"50%", transform:"translateX(-50%)", width:"90%", maxWidth:580, background:"#fff", borderRadius:22, zIndex:201, maxHeight:"88vh", overflowY:"auto", padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div style={{ fontSize:17, fontWeight:800 }}>{item.emoji} {item.name}</div>
            <button onClick={onClose} style={{ width:30, height:30, borderRadius:"50%", background:"#f5f5f5", border:"none", cursor:"pointer", fontSize:15 }}>✕</button>
          </div>
          <div style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.07em", color:"#aaa", marginBottom:10 }}>{t.sizePricing}</div>
          {sizes.map((sz, i) => (
            <div key={i} style={{ display:"flex", gap:8, marginBottom:7 }}>
              <input value={sz.label} onChange={e=>setSizes(p=>p.map((s,j)=>j===i?{...s,label:e.target.value}:s))} style={inp({flex:1})} placeholder={lang==="ar"?"الحجم":"Size"}/>
              <input value={sz.price} onChange={e=>setSizes(p=>p.map((s,j)=>j===i?{...s,price:e.target.value}:s))} type="number" style={inp({width:80})} placeholder="﷼"/>
              <button onClick={()=>setSizes(p=>p.filter((_,j)=>j!==i))} style={{ width:30, height:30, borderRadius:8, background:"#fee2e2", border:"none", color:"#ef4444", cursor:"pointer" }}>×</button>
            </div>
          ))}
          <div style={{ display:"flex", gap:8, marginBottom:18 }}>
            <input value={nSize.label} onChange={e=>setNSize(p=>({...p,label:e.target.value}))} style={inp({flex:1})} placeholder={t.newSize}/>
            <input value={nSize.price} onChange={e=>setNSize(p=>({...p,price:e.target.value}))} type="number" style={inp({width:70})} placeholder="﷼"/>
            <button onClick={()=>{if(nSize.label){setSizes(p=>[...p,{...nSize}]);setNSize({label:"",price:""})}}} style={{ padding:"9px 14px", background:R, border:"none", borderRadius:10, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>+</button>
          </div>
          <div style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.07em", color:"#aaa", marginBottom:10 }}>{t.optionsAddons}</div>
          {options.map((grp, gi) => (
            <div key={gi} style={{ background:"#f8f8f8", borderRadius:13, padding:13, marginBottom:9 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>{grp.group}</div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <label style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#888", cursor:"pointer" }}>
                    <input type="checkbox" checked={grp.required} onChange={e=>setOptions(p=>p.map((g,i)=>i===gi?{...g,required:e.target.checked}:g))} style={{ accentColor:R }}/>{t.required}
                  </label>
                  <button onClick={()=>setOptions(p=>p.filter((_,i)=>i!==gi))} style={{ width:24, height:24, borderRadius:6, background:"#fee2e2", border:"none", color:"#ef4444", cursor:"pointer", fontSize:13 }}>×</button>
                </div>
              </div>
              {grp.choices.map((ch, ci) => (
                <div key={ci} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                  <div style={{ flex:1, fontSize:12, color:"#555" }}>{ch.name}</div>
                  <div style={{ fontSize:12, color:R, fontWeight:600 }}>{ch.price>0?`+﷼${ch.price}`:(lang==="ar"?"مجاني":"Free")}</div>
                  <button onClick={()=>setOptions(p=>p.map((g,i)=>i===gi?{...g,choices:g.choices.filter((_,j)=>j!==ci)}:g))} style={{ width:20, height:20, borderRadius:5, background:"#fee2e2", border:"none", color:"#ef4444", cursor:"pointer", fontSize:11 }}>×</button>
                </div>
              ))}
              <div style={{ display:"flex", gap:6, marginTop:7 }}>
                <input value={nChoice.group===grp.group?nChoice.name:""} onChange={e=>setNChoice(p=>({...p,group:grp.group,name:e.target.value}))} style={inp({flex:1,padding:"7px 10px"})} placeholder={t.choiceName}/>
                <input value={nChoice.group===grp.group?nChoice.price:""} onChange={e=>setNChoice(p=>({...p,price:e.target.value}))} type="number" style={inp({width:60,padding:"7px 8px"})} placeholder="+﷼"/>
                <button onClick={()=>{if(nChoice.name&&nChoice.group===grp.group){setOptions(p=>p.map((g,i)=>i===gi?{...g,choices:[...g.choices,{name:nChoice.name,price:Number(nChoice.price)||0}]}:g));setNChoice({group:"",name:"",price:""})}}} style={{ padding:"7px 11px", background:R, border:"none", borderRadius:9, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>+</button>
              </div>
            </div>
          ))}
          <div style={{ display:"flex", gap:8, marginBottom:18 }}>
            <input value={!options.find(g=>g.group===nChoice.group)?nChoice.group:""} onChange={e=>setNChoice(p=>({...p,group:e.target.value,name:"",price:""}))} style={inp({flex:1})} placeholder={t.newGroup}/>
            <button onClick={()=>{if(nChoice.group&&!options.find(g=>g.group===nChoice.group)){setOptions(p=>[...p,{group:nChoice.group,required:false,choices:[]}]);setNChoice({group:"",name:"",price:""})}}} style={{ padding:"9px 14px", background:"#f0f0f0", border:"none", borderRadius:10, color:"#555", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ {lang==="ar"?"مجموعة":"Group"}</button>
          </div>
          <button onClick={()=>{setMenuItems(p=>p.map(m=>m.id===item.id?{...m,sizes,options}:m));onClose();}} style={{ width:"100%", padding:13, background:R, border:"none", borderRadius:13, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>{t.saveCustom}</button>
        </div>
      </>
    );
  };

  return (
    <div>
      <STitle title={t.menu} action={t.addItem} onClick={()=>setShowAdd(v=>!v)}/>
      {showAdd&&(
        <Card>
          <CardTitle>{t.newItem}</CardTitle>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            {[[t.itemName,"name","🍔"],[t.category,"category","Best Seller"],[t.price,"price","25"],[t.emoji,"emoji","🍔"],[t.stockQty,"stock","50"],[t.lowStockAlertLabel,"low_stock_alert","10"]].map(([label,key,ph])=>(
              <div key={key}>
                <div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{label}</div>
                <input placeholder={ph} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} style={inp()}/>
              </div>
            ))}
          </div>
          <button onClick={addItem} style={{ padding:"9px 18px", background:R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>{lang==="ar"?"إضافة":"Add"}</button>
        </Card>
      )}
      {cats.map(cat=>{
        const catItems = menuItems.filter(m=>(m.category||"General")===cat);
        return (
          <div key={cat} style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.07em", color:"#aaa", marginBottom:9 }}>{cat}</div>
            {catItems.map(item=>(
              <div key={item.id} style={{ background:"#fff", borderRadius:15, padding:"13px 15px", marginBottom:8, border:`1.5px solid ${item.stock<=item.alert?"#fde68a":"#f0f0f0"}`, opacity:item.available?1:0.6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <div style={{ width:48, height:48, borderRadius:13, background:`${R}10`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:25 }}>{item.emoji||"📦"}</div>
                    {item.stock<=item.alert&&<div style={{ position:"absolute", top:-4, right:-4, width:15, height:15, borderRadius:"50%", background:"#f59e0b", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8 }}>⚠️</div>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{item.name}</div>
                    <div style={{ display:"flex", gap:10, fontSize:11, color:"#888", flexWrap:"wrap" }}>
                      <span style={{ color:R, fontWeight:700 }}>﷼{item.price}</span>
                      <span>📦 {itemOrderCounts[item.name]||0}</span>
                      <span style={{ color:item.stock<=item.alert?"#f59e0b":"#10b981", fontWeight:600 }}>🗃️ {item.stock}</span>
                      {(item.sizes||[]).length>0&&<span>📐 {item.sizes.length} {t.size}</span>}
                      {(item.options||[]).length>0&&<span>⚙️ {item.options.length} {t.optionGroups}</span>}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                    <button onClick={()=>setCustomizing(item)} style={{ padding:"5px 9px", background:"#ede9fe", border:"1px solid #c4b5fd", borderRadius:8, color:"#7c3aed", fontSize:11, fontWeight:700, cursor:"pointer" }}>{t.customize}</button>
                    <button onClick={()=>toggle(item.id)} style={{ padding:"5px 9px", borderRadius:18, border:"1.5px solid", borderColor:item.available?"#10b981":"#e8e8e8", background:item.available?"#d1fae5":"#f8f8f8", color:item.available?"#10b981":"#aaa", fontSize:11, fontWeight:700, cursor:"pointer" }}>{item.available?t.available:t.off}</button>
                    <button onClick={()=>deleteItem(item.id)} style={{ width:28, height:28, borderRadius:7, background:"#fee2e2", border:"none", cursor:"pointer", fontSize:13 }}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
      {!menuItems.length&&<div style={{ textAlign:"center", padding:50, color:"#ccc", fontSize:13 }}>{lang==="ar"?"لا توجد منتجات":"No menu items yet"}</div>}
      {customizing&&<Customizer item={customizing} onClose={()=>setCustomizing(null)}/>}
    </div>
  );
}

function StockPage({ menuItems, setMenuItems, t, lang }) {
  const low = menuItems.filter(m => m.stock <= m.alert);

  const upd = async (id, key, val) => {
    const v = Math.max(0, Number(val));
    const dbKey = key === "alert" ? "low_stock_alert" : key;
    await supabase.from("menu_items").update({ [dbKey]:v }).eq("id", id);
    setMenuItems(p => p.map(m => m.id===id?{...m,[key]:v}:m));
  };

  return (
    <div>
      <STitle title={t.stockMgmt}/>
      {low.length>0&&(
        <div style={{ background:"#fef3c7", border:"1.5px solid #f59e0b", borderRadius:15, padding:"13px 16px", marginBottom:18 }}>
          <div style={{ fontWeight:800, fontSize:13, color:"#92400e", marginBottom:5 }}>⚠️ {low.length} {t.needRestocking}</div>
          {low.map(m=><div key={m.id} style={{ fontSize:11, color:"#b45309" }}>{m.emoji||"📦"} {m.name} — {t.onlyLeft} {m.stock} {t.left} ({t.alertAt} {m.alert})</div>)}
        </div>
      )}
      <div style={{ display:"flex", gap:12, marginBottom:18 }}>
        <StatCard icon="🗃️" label={t.totalItems} value={menuItems.length} color="#6366f1"/>
        <StatCard icon="✅" label={t.inStock} value={menuItems.filter(m=>m.stock>m.alert).length} color="#10b981"/>
        <StatCard icon="⚠️" label={t.lowStock} value={low.length} color="#f59e0b"/>
        <StatCard icon="❌" label={t.outOfStock} value={menuItems.filter(m=>m.stock===0).length} color="#ef4444"/>
      </div>
      <Card>
        <CardTitle>{t.stockLevels}</CardTitle>
        {menuItems.map(item=>(
          <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid #f8f8f8" }}>
            <div style={{ fontSize:24, flexShrink:0 }}>{item.emoji||"📦"}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13, marginBottom:3 }}>{item.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ flex:1, background:"#f0f0f0", borderRadius:4, height:6, maxWidth:110 }}>
                  <div style={{ width:`${Math.min((item.stock/100)*100,100)}%`, background:item.stock===0?"#ef4444":item.stock<=item.alert?"#f59e0b":"#10b981", borderRadius:4, height:"100%" }}/>
                </div>
                <span style={{ fontSize:11, color:item.stock===0?"#ef4444":item.stock<=item.alert?"#f59e0b":"#10b981", fontWeight:700 }}>{item.stock}</span>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
              <div>
                <div style={{ fontSize:9, color:"#aaa", marginBottom:2 }}>{lang==="ar"?"المخزون":"Stock"}</div>
                <input type="number" value={item.stock} onChange={e=>upd(item.id,"stock",e.target.value)} style={{ width:65, padding:"6px 8px", background:"#f8f8f8", border:"1px solid #f0f0f0", borderRadius:9, fontSize:13, fontWeight:700, outline:"none", textAlign:"center" }}/>
              </div>
              <div>
                <div style={{ fontSize:9, color:"#aaa", marginBottom:2 }}>{lang==="ar"?"تنبيه عند":"Alert at"}</div>
                <input type="number" value={item.alert} onChange={e=>upd(item.id,"alert",e.target.value)} style={{ width:65, padding:"6px 8px", background:"#f8f8f8", border:"1px solid #f0f0f0", borderRadius:9, fontSize:13, fontWeight:700, outline:"none", textAlign:"center" }}/>
              </div>
              <button style={{ padding:"6px 11px", background:R, border:"none", borderRadius:9, color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", marginTop:14 }}>{t.restock}</button>
            </div>
          </div>
        ))}
        {!menuItems.length&&<div style={{ textAlign:"center", padding:30, color:"#ccc", fontSize:13 }}>{lang==="ar"?"لا توجد منتجات":"No items"}</div>}
      </Card>
    </div>
  );
}

function AnalyticsPage({ orders, menuItems, branches, weeklyRev, t, lang }) {
  const [period, setPeriod] = useState("week");
  const periods = [t.day, t.week, t.month, t.year];
  const periodKeys = ["day","week","month","year"];
  const days = WEEKLY_DAYS[lang];

  const completedOrders = orders.filter(o => o.status === "completed");
  const totalRev = completedOrders.reduce((s, o) => s + (o.total||0), 0);
  const totalOrd = orders.length;
  const avgVal = completedOrders.length > 0 ? (totalRev / completedOrders.length).toFixed(1) : 0;
  const rejectionRate = totalOrd > 0 ? ((orders.filter(o=>o.status==="rejected").length / totalOrd) * 100).toFixed(1) : 0;

  const maxR = Math.max(...weeklyRev, 1);
  const firstHalf = weeklyRev.slice(0,3).reduce((s,v)=>s+v,0);
  const secondHalf = weeklyRev.slice(4).reduce((s,v)=>s+v,0);
  const weekTrend = firstHalf > 0 ? Math.round(((secondHalf-firstHalf)/firstHalf)*100) : 0;

  const topItems = useMemo(() => {
    const counts = {};
    orders.forEach(o => {
      (Array.isArray(o.items)?o.items:[]).forEach(item => {
        if (!item.name) return;
        if (!counts[item.name]) counts[item.name] = { name:item.name, orders:0, price:item.price||0, emoji:"📦" };
        counts[item.name].orders += item.qty||1;
      });
    });
    menuItems.forEach(m => { if (counts[m.name]) counts[m.name].emoji = m.emoji||"📦"; });
    return Object.values(counts).sort((a,b)=>b.orders-a.orders).slice(0,6);
  }, [orders, menuItems]);

  const maxBranchRev = Math.max(...branches.map(b=>b.revenue||0), 1);
  const pickupCount = orders.filter(o=>o.type==="pickup").length;
  const deliveryCount = orders.filter(o=>o.type==="delivery").length;
  const dineInCount = orders.filter(o=>o.type==="dine-in").length;
  const typeTotal = Math.max(pickupCount+deliveryCount+dineInCount, 1);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em" }}>{t.analytics}</div>
        <div style={{ display:"flex", gap:4, background:"#f0f0f0", borderRadius:11, padding:3 }}>
          {periodKeys.map((p,i)=>(
            <button key={p} onClick={()=>setPeriod(p)} style={{ padding:"5px 12px", borderRadius:9, border:"none", background:period===p?"#fff":"transparent", color:period===p?"#1a1a1a":"#888", fontSize:12, fontWeight:700, cursor:"pointer", boxShadow:period===p?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>{periods[i]}</button>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
        <StatCard icon="💰" label={t.totalRevenue} value={`﷼${totalRev.toLocaleString()}`} color="#10b981"/>
        <StatCard icon="📦" label={t.totalOrders} value={totalOrd} color={R}/>
        <StatCard icon="🧾" label={t.avgOrderValue} value={`﷼${avgVal}`} color="#6366f1"/>
        <StatCard icon="❌" label={t.rejectionRate} value={`${rejectionRate}%`} color="#f59e0b"/>
      </div>

      {weeklyRev.some(v=>v>0)&&(
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontWeight:700, fontSize:15 }}>{t.revenuetrend}</div>
            <div style={{ fontSize:12, color:"#10b981", fontWeight:700, background:"#d1fae5", padding:"4px 12px", borderRadius:20 }}>
              {weekTrend>=0?"↑":"↓"}{Math.abs(weekTrend)}% {t.vsLastWeek}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120 }}>
            {weeklyRev.map((val,i)=>(
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div style={{ fontSize:9, color:"#aaa" }}>﷼{(val/1000).toFixed(1)}k</div>
                <div style={{ width:"100%", background:`linear-gradient(180deg,${R},${R}66)`, borderRadius:"6px 6px 0 0", height:`${(val/maxR)*95}px`, minHeight:4, position:"relative" }}>
                  {val===maxR&&val>0&&<div style={{ position:"absolute", top:-20, left:"50%", transform:"translateX(-50%)", background:R, color:"#fff", fontSize:9, fontWeight:700, padding:"2px 5px", borderRadius:5, whiteSpace:"nowrap" }}>{t.peak}</div>}
                </div>
                <div style={{ fontSize:10, color:"#bbb" }}>{days[i]}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {topItems.length>0&&(
        <Card>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>{t.bestSelling}</div>
          {topItems.map((item,i)=>(
            <div key={item.name} style={{ display:"flex", alignItems:"center", gap:11, padding:"10px 0", borderBottom:"1px solid #f8f8f8" }}>
              <div style={{ width:28, height:28, borderRadius:8, background:i===0?`${R}15`:i===1?"#fef3c7":i===2?"#f0fdf4":"#f8f8f8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:i===0?R:i===1?"#d97706":i===2?"#16a34a":"#999" }}>
                {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
              </div>
              <div style={{ fontSize:20 }}>{item.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>{item.name}</div>
                <div style={{ display:"flex", gap:10, fontSize:11, color:"#aaa" }}>
                  <span>{item.orders} {t.orders_count}</span>
                  <span style={{ color:R, fontWeight:700 }}>﷼{item.price}</span>
                </div>
              </div>
              <div style={{ width:80, background:"#f0f0f0", borderRadius:4, height:6 }}>
                <div style={{ width:`${(item.orders/(topItems[0]?.orders||1))*100}%`, background:i===0?R:i===1?"#f59e0b":i===2?"#10b981":"#94a3b8", borderRadius:4, height:"100%" }}/>
              </div>
              <div style={{ fontWeight:800, fontSize:13, color:"#1a1a1a", minWidth:65, textAlign:"right" }}>﷼{(item.orders*item.price).toLocaleString()}</div>
            </div>
          ))}
        </Card>
      )}

      <div style={{ display:"flex", gap:12, marginBottom:12 }}>
        <Card mb={0}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:13 }}>{t.orderTypes}</div>
          {[["🥡",t.pickup,pickupCount,"#E03020"],["🛵",t.delivery,deliveryCount,"#0ea5e9"],["🪑",t.dineIn,dineInCount,"#10b981"]].map(([ic,type,count,c])=>(
            <div key={type} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, fontWeight:600, marginBottom:4 }}><span>{ic} {type}</span><span style={{ color:c }}>{Math.round((count/typeTotal)*100)}%</span></div>
              <div style={{ background:"#f0f0f0", borderRadius:4, height:7 }}><div style={{ width:`${(count/typeTotal)*100}%`, background:c, borderRadius:4, height:"100%" }}/></div>
            </div>
          ))}
        </Card>
        <Card mb={0}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:13 }}>{t.paymentMethods}</div>
          {[["💳","Apple Pay","44%","#1a1a1a"],["💳","Mada / مدى","31%","#16a34a"],["📱","STC Pay","18%","#7c3aed"],["💵",lang==="ar"?"نقداً":"Cash","7%","#d97706"]].map(([ic,m,p,c])=>(
            <div key={m} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, fontWeight:600, marginBottom:4 }}><span>{ic} {m}</span><span style={{ color:c }}>{p}</span></div>
              <div style={{ background:"#f0f0f0", borderRadius:4, height:7 }}><div style={{ width:p, background:c, borderRadius:4, height:"100%" }}/></div>
            </div>
          ))}
        </Card>
      </div>

      {branches.length>0&&(
        <Card mb={0}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:13 }}>{t.branchRevenue}</div>
          {branches.map(b=>(
            <div key={b.id} style={{ display:"flex", alignItems:"center", gap:11, marginBottom:11 }}>
              <div style={{ fontSize:12, fontWeight:600, minWidth:70, color:"#555" }}>{lang==="ar"?(b.name_ar||b.name):b.name}</div>
              <div style={{ flex:1, background:"#f0f0f0", borderRadius:5, height:10 }}>
                <div style={{ width:`${((b.revenue||0)/maxBranchRev)*100}%`, background:`linear-gradient(90deg,${R},${R}88)`, borderRadius:5, height:"100%" }}/>
              </div>
              <div style={{ fontWeight:800, fontSize:13, color:R, minWidth:60, textAlign:"right" }}>﷼{(b.revenue||0).toLocaleString()}</div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function EmployeesPage({ staff, setStaff, branches, restaurantId, t, lang }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", phone:"", email:"", role:"employee", branch_id:"" });

  const addEmp = async () => {
    if (!form.name) return;
    const { data, error } = await supabase.from("staff").insert({
      name: form.name, phone: form.phone, email: form.email, role: form.role,
      branch_id: form.branch_id || branches[0]?.id || null,
      restaurant_id: restaurantId, status: "offline",
    }).select().single();
    if (!error && data) {
      setStaff(p => [...p, data]);
      setForm({ name:"", phone:"", email:"", role:"employee", branch_id:"" });
      setShowAdd(false);
    }
  };

  const removeEmp = async (id) => {
    await supabase.from("staff").delete().eq("id", id);
    setStaff(p => p.filter(e => e.id !== id));
  };

  const getBranch = (bid) => branches.find(b => b.id === bid);

  return (
    <div>
      <STitle title={t.employees} action={t.addEmployee} onClick={()=>setShowAdd(v=>!v)}/>
      {showAdd&&(
        <Card>
          <CardTitle>{t.newEmployee}</CardTitle>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            {[[t.fullName,"name","Ahmed"],[t.phone,"phone","+966 5X"],[t.email,"email","x@x.com"]].map(([label,key,ph])=>(
              <div key={key}>
                <div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{label}</div>
                <input placeholder={ph} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} style={inp()}/>
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{t.role}</div>
              <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} style={inp()}>
                <option value="employee">{lang==="ar"?"موظف":"Employee"}</option>
                <option value="manager">{lang==="ar"?"مدير":"Manager"}</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{t.branch}</div>
              <select value={form.branch_id} onChange={e=>setForm(p=>({...p,branch_id:e.target.value}))} style={inp()}>
                {branches.map(b=><option key={b.id} value={b.id}>{lang==="ar"?(b.name_ar||b.name):b.name}</option>)}
              </select>
            </div>
          </div>
          <button onClick={addEmp} style={{ padding:"9px 18px", background:R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>{lang==="ar"?"إضافة":"Add"}</button>
        </Card>
      )}
      <div style={{ display:"flex", gap:12, marginBottom:18 }}>
        <StatCard icon="👥" label={t.totalEmployees} value={staff.length} color="#6366f1"/>
        <StatCard icon="🟢" label={t.onlineNow} value={staff.filter(e=>e.status==="online").length} color="#10b981"/>
      </div>
      {staff.map(emp=>{
        const br = getBranch(emp.branch_id);
        return (
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
                  <div style={{ fontWeight:700, fontSize:14 }}>{emp.name}</div>
                  <span style={{ padding:"2px 7px", borderRadius:10, fontSize:10, fontWeight:700, background:emp.role==="manager"?"#dbeafe":"#f0f0f0", color:emp.role==="manager"?"#0ea5e9":"#888" }}>
                    {emp.role==="manager"?(lang==="ar"?"مدير":"Manager"):(lang==="ar"?"موظف":"Employee")}
                  </span>
                </div>
                <div style={{ fontSize:11, color:"#aaa" }}>
                  {br?`📍 ${lang==="ar"?(br.name_ar||br.name):br.name} · `:""}📞 {emp.phone||"—"}
                </div>
                <div style={{ fontSize:11, color:"#aaa", marginTop:1 }}>
                  {emp.status==="online"?`🟢 ${t.active}`:`⚫ ${t.lastSeen}`}
                </div>
              </div>
              <button onClick={()=>removeEmp(emp.id)} style={{ padding:"6px 11px", background:"#fee2e2", border:"1px solid #fecaca", borderRadius:9, color:"#ef4444", fontSize:11, fontWeight:700, cursor:"pointer" }}>{lang==="ar"?"حذف":"Remove"}</button>
            </div>
          </Card>
        );
      })}
      {!staff.length&&<div style={{ textAlign:"center", padding:50, color:"#ccc", fontSize:13 }}>{lang==="ar"?"لا يوجد موظفون":"No staff yet"}</div>}
    </div>
  );
}

function BranchesPage({ branches, setBranches, orders, staff, restaurantId, t, lang }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", name_ar:"", address:"" });

  const toggle = async (id) => {
    const b = branches.find(br=>br.id===id);
    const newStatus = b.status==="open"?"closed":"open";
    await supabase.from("branches").update({ status:newStatus }).eq("id", id);
    setBranches(p=>p.map(br=>br.id===id?{...br,status:newStatus}:br));
  };

  const addBranch = async () => {
    if (!form.name) return;
    const { data, error } = await supabase.from("branches").insert({
      name: form.name,
      name_ar: form.name_ar || form.name,
      address: form.address,
      status: "open",
      restaurant_id: restaurantId,
    }).select().single();
    if (!error && data) {
      setBranches(p => [...p, data]);
      setForm({ name:"", name_ar:"", address:"" });
      setShowAdd(false);
    }
  };

  const deleteBranch = async (id) => {
    await supabase.from("branches").delete().eq("id", id);
    setBranches(p => p.filter(b => b.id !== id));
  };

  return (
    <div>
      <STitle title={t.branches} action={t.addBranch} onClick={()=>setShowAdd(v=>!v)}/>
      {showAdd&&(
        <Card>
          <CardTitle>{lang==="ar"?"فرع جديد":"New Branch"}</CardTitle>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{lang==="ar"?"الاسم (إنجليزي)":"Name (English)"}</div>
              <input placeholder="Tahlia" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={inp()}/>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{lang==="ar"?"الاسم (عربي)":"Name (Arabic)"}</div>
              <input placeholder="التحلية" value={form.name_ar} onChange={e=>setForm(p=>({...p,name_ar:e.target.value}))} style={inp()}/>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{t.address}</div>
              <input placeholder={lang==="ar"?"شارع التحلية، جدة":"Tahlia St, Jeddah"} value={form.address} onChange={e=>setForm(p=>({...p,address:e.target.value}))} style={inp()}/>
            </div>
          </div>
          <button onClick={addBranch} style={{ padding:"9px 18px", background:R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>{lang==="ar"?"إضافة":"Add"}</button>
        </Card>
      )}
      {branches.map(b=>(
        <Card key={b.id} mb={12}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:15, marginBottom:1 }}>{lang==="ar"?(b.name_ar||b.name):b.name}</div>
              <div style={{ fontSize:12, color:"#aaa" }}>📍 {b.address||"—"}</div>
            </div>
            <button onClick={()=>toggle(b.id)} style={{ padding:"6px 13px", borderRadius:20, border:"1.5px solid", borderColor:b.status==="open"?"#10b981":"#e8e8e8", background:b.status==="open"?"#d1fae5":"#f8f8f8", color:b.status==="open"?"#10b981":"#888", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              {b.status==="open"?t.open:t.closed}
            </button>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {[["📦",`${b.orders||0} ${t.orders_count}`],["💰",`﷼${(b.revenue||0).toLocaleString()}`],["👥",`${staff.filter(e=>e.branch_id===b.id).length} ${t.staff}`]].map(([icon,val])=>(
              <div key={val} style={{ flex:1, background:"#f8f8f8", borderRadius:11, padding:"9px 12px", display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ fontSize:16 }}>{icon}</span><span style={{ fontWeight:700, fontSize:12 }}>{val}</span>
              </div>
            ))}
            <button style={{ padding:"9px 15px", background:`${R}10`, border:`1px solid ${R}30`, borderRadius:11, color:R, fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.manage}</button>
            <button onClick={()=>deleteBranch(b.id)} style={{ padding:"9px 12px", background:"#fee2e2", border:"1px solid #fecaca", borderRadius:11, color:"#ef4444", fontSize:12, fontWeight:700, cursor:"pointer" }}>🗑️</button>
          </div>
        </Card>
      ))}
      {!branches.length&&<div style={{ textAlign:"center", padding:50, color:"#ccc", fontSize:13 }}>{lang==="ar"?"لا توجد فروع":"No branches"}</div>}
    </div>
  );
}

function ReviewsPage({ reviews, t, lang }) {
  const avg = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : "—";
  return (
    <div>
      <STitle title={t.reviews}/>
      <div style={{ background:`linear-gradient(135deg,${R},${R}bb)`, borderRadius:22, padding:22, marginBottom:18, color:"#fff", display:"flex", gap:22, alignItems:"center" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:50, fontWeight:900 }}>{avg}</div>
          <div style={{ fontSize:17, marginTop:3 }}>{"⭐".repeat(Math.round(Number(avg)||0))}</div>
          <div style={{ fontSize:11, opacity:0.8, marginTop:3 }}>{reviews.length} {lang==="ar"?"تقييم":"reviews"}</div>
        </div>
        <div style={{ flex:1 }}>
          {[5,4,3,2,1].map(star=>{
            const count = reviews.filter(r=>r.rating===star).length;
            return (
              <div key={star} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <span style={{ fontSize:11, opacity:0.8, minWidth:8 }}>{star}</span>
                <div style={{ flex:1, background:"rgba(255,255,255,0.2)", borderRadius:4, height:7 }}>
                  <div style={{ width:`${reviews.length?(count/reviews.length)*100:0}%`, background:"#fff", borderRadius:4, height:"100%" }}/>
                </div>
                <span style={{ fontSize:11, opacity:0.7, minWidth:8 }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
      {reviews.map(r=>(
        <Card key={r.id} mb={10}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:13 }}>{r.customer_name}</div>
              <div style={{ fontSize:11, color:"#aaa" }}>{r.item||""}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:14 }}>{"⭐".repeat(r.rating)}</div>
              <div style={{ fontSize:10, color:"#bbb", marginTop:1 }}>{relativeDate(r.created_at, lang)}</div>
            </div>
          </div>
          <div style={{ fontSize:13, color:"#555", lineHeight:1.5 }}>{r.comment}</div>
        </Card>
      ))}
      {!reviews.length&&<div style={{ textAlign:"center", padding:50, color:"#ccc", fontSize:13 }}>{lang==="ar"?"لا توجد تقييمات":"No reviews yet"}</div>}
    </div>
  );
}

function HoursPage({ t, lang }) {
  const DAYS_KEYS = ["sat","sun","mon","tue","wed","thu","fri"];
  const [hours, setHours] = useState(DAYS_KEYS.map(d=>({day:d,open:true,from:"10:00",to:"00:00",allDay:false})));
  const [saved, setSaved] = useState(false);
  const upd = (i,k,v) => setHours(p=>p.map((h,j)=>j===i?{...h,[k]:v}:h));

  return (
    <div>
      <STitle title={t.hours}/>
      <Card>
        <CardTitle>{t.weeklySchedule}</CardTitle>
        {hours.map((h,i)=>(
          <div key={h.day} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:"1px solid #f8f8f8", flexWrap:"wrap" }}>
            <div style={{ width:85, fontSize:13, fontWeight:600 }}>{t[h.day]}</div>
            <Tog label="" value={h.open} onChange={v=>upd(i,"open",v)}/>
            {h.open&&!h.allDay&&<>
              <input type="time" value={h.from} onChange={e=>upd(i,"from",e.target.value)} style={{ padding:"6px 8px", background:"#f8f8f8", border:"1px solid #f0f0f0", borderRadius:9, fontSize:12, outline:"none" }}/>
              <span style={{ fontSize:12, color:"#aaa" }}>{t.to}</span>
              <input type="time" value={h.to} onChange={e=>upd(i,"to",e.target.value)} style={{ padding:"6px 8px", background:"#f8f8f8", border:"1px solid #f0f0f0", borderRadius:9, fontSize:12, outline:"none" }}/>
            </>}
            {h.open&&<label style={{ display:"flex", alignItems:"center", gap:5, cursor:"pointer", fontSize:12, color:"#888", marginLeft:"auto" }}>
              <input type="checkbox" checked={h.allDay} onChange={e=>upd(i,"allDay",e.target.checked)} style={{ accentColor:R }}/>{t.allDay}
            </label>}
            {!h.open&&<span style={{ fontSize:12, color:"#bbb" }}>{t.closed_day}</span>}
          </div>
        ))}
      </Card>
      <Card>
        <CardTitle>{t.specialModes}</CardTitle>
        {[[t.ramadanHours,t.ramadanSub],[t.holidayMode,t.holidaySub],[t.emergencyClose,t.emergencySub]].map(([l,s])=>(
          <div key={l} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 0", borderBottom:"1px solid #f8f8f8" }}>
            <div><div style={{ fontSize:14, fontWeight:600 }}>{l}</div><div style={{ fontSize:11, color:"#aaa", marginTop:1 }}>{s}</div></div>
            <button style={{ padding:"7px 13px", background:"#f8f8f8", border:"1px solid #f0f0f0", borderRadius:9, color:"#555", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.activate}</button>
          </div>
        ))}
      </Card>
      <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}} style={{ padding:"11px 22px", background:saved?"#10b981":R, border:"none", borderRadius:12, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.3s" }}>{saved?t.saved:t.saveHours}</button>
    </div>
  );
}

function PaymentPage({ restaurant, setRestaurant, orders, t, lang }) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    moyasar_public_key:  restaurant?.moyasar_public_key  || "",
    moyasar_secret_key:  restaurant?.moyasar_secret_key  || "",
    iban:                restaurant?.iban                || "",
    bank_name:           restaurant?.bank_name           || "",
  });
  const [methods, setMethods] = useState({
    apple_pay:  restaurant?.payment_methods?.apple_pay  ?? true,
    mada:       restaurant?.payment_methods?.mada       ?? true,
    stc_pay:    restaurant?.payment_methods?.stc_pay    ?? true,
    cash:       restaurant?.payment_methods?.cash       ?? false,
  });

  useEffect(()=>{
    if (restaurant) {
      setForm({
        moyasar_public_key: restaurant.moyasar_public_key || "",
        moyasar_secret_key: restaurant.moyasar_secret_key || "",
        iban:               restaurant.iban               || "",
        bank_name:          restaurant.bank_name          || "",
      });
      setMethods({
        apple_pay: restaurant.payment_methods?.apple_pay ?? true,
        mada:      restaurant.payment_methods?.mada      ?? true,
        stc_pay:   restaurant.payment_methods?.stc_pay   ?? true,
        cash:      restaurant.payment_methods?.cash      ?? false,
      });
    }
  }, [restaurant]);

  const now = new Date();
  const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const completedOrders = orders.filter(o=>o.status==="completed");
  const totalEarned = completedOrders.reduce((s,o)=>s+(o.total||0),0);
  const thisMonthGross = completedOrders.filter(o=>(o.created_at||"").startsWith(thisMonthStr)).reduce((s,o)=>s+(o.total||0),0);
  const moyasarFeeAmt = +(thisMonthGross*0.019).toFixed(2);
  const netPayout = +(thisMonthGross-moyasarFeeAmt).toFixed(2);

  const saveSettings = async () => {
    if (!restaurant) return;
    const updates = { ...form, payment_methods: methods };
    await supabase.from("restaurants").update(updates).eq("id", restaurant.id);
    setRestaurant(p=>({...p, ...updates}));
    setSaved(true);
    setTimeout(()=>setSaved(false), 2000);
  };

  const isConnected = form.moyasar_public_key && form.iban;

  return (
    <div>
      <STitle title={t.payment}/>

      {/* Revenue summary */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
        <StatCard icon="💰" label={t.totalEarned}   value={`﷼${totalEarned.toLocaleString()}`}    color="#10b981"/>
        <StatCard icon="📊" label={t.thisMonth}     value={`﷼${thisMonthGross.toLocaleString()}`} color={R}/>
        <StatCard icon="💸" label={t.netPayout}     value={`﷼${netPayout.toLocaleString()}`}      color="#6366f1"/>
      </div>

      {/* This month breakdown */}
      <Card>
        <CardTitle>{t.thisMonthBreakdown}</CardTitle>
        {[
          [t.grossRevenue, `﷼${thisMonthGross.toLocaleString()}`, "#1a1a1a"],
          [t.moyasarFee,   `−﷼${moyasarFeeAmt.toLocaleString()}`, "#ef4444"],
          [t.netPayout,    `﷼${netPayout.toLocaleString()}`,       R],
        ].map(([l,v,c],i)=>(
          <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:i<2?"1px solid #f8f8f8":"none" }}>
            <span style={{ fontSize:13, color:i===2?"#1a1a1a":"#666", fontWeight:i===2?800:500 }}>{l}</span>
            <span style={{ fontSize:13, fontWeight:800, color:c }}>{v}</span>
          </div>
        ))}
        {thisMonthGross===0&&<div style={{ textAlign:"center", padding:"16px 0", color:"#ccc", fontSize:12 }}>{lang==="ar"?"لا توجد مبيعات هذا الشهر":"No sales this month yet"}</div>}
      </Card>

      {/* Moyasar setup */}
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <CardTitle>{lang==="ar"?"إعداد ميسر":"Moyasar Setup"}</CardTitle>
          <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:isConnected?"#d1fae5":"#fef3c7", color:isConnected?"#10b981":"#d97706" }}>
            {isConnected?(lang==="ar"?"✓ مفعّل":"✓ Connected"):(lang==="ar"?"غير مفعّل":"Not Connected")}
          </span>
        </div>
        <div style={{ background:"#f0f7ff", border:"1px solid #bfdbfe", borderRadius:12, padding:"11px 14px", marginBottom:14, fontSize:12, color:"#3b82f6" }}>
          💡 {lang==="ar"
            ? "احصل على مفاتيح API من لوحة تحكم ميسر على moyasar.com"
            : "Get your API keys from the Moyasar dashboard at moyasar.com"}
        </div>
        {[
          [lang==="ar"?"المفتاح العام (Public Key)":"Public Key", "moyasar_public_key", "pk_live_..."],
          [lang==="ar"?"المفتاح السري (Secret Key)":"Secret Key", "moyasar_secret_key", "sk_live_..."],
        ].map(([label,key,ph])=>(
          <div key={key} style={{ marginBottom:11 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{label}</div>
            <input
              value={form[key]} placeholder={ph}
              onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
              type={key==="moyasar_secret_key"?"password":"text"}
              style={inp()}
              onFocus={e=>{e.target.style.borderColor=R;e.target.style.background="#fff"}}
              onBlur={e=>{e.target.style.borderColor="#f0f0f0";e.target.style.background="#f8f8f8"}}
            />
          </div>
        ))}
      </Card>

      {/* Bank account */}
      <Card>
        <CardTitle>{t.connectedAccount}</CardTitle>
        {[
          [lang==="ar"?"اسم البنك":"Bank Name",  "bank_name",  lang==="ar"?"بنك الراجحي":"Al Rajhi Bank"],
          ["IBAN",                                "iban",       "SA00 0000 0000 0000 0000 0000"],
        ].map(([label,key,ph])=>(
          <div key={key} style={{ marginBottom:11 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{label}</div>
            <input
              value={form[key]} placeholder={ph}
              onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
              style={inp()}
              onFocus={e=>{e.target.style.borderColor=R;e.target.style.background="#fff"}}
              onBlur={e=>{e.target.style.borderColor="#f0f0f0";e.target.style.background="#f8f8f8"}}
            />
          </div>
        ))}
      </Card>

      {/* Payment methods */}
      <Card>
        <CardTitle>{t.paymentMethods}</CardTitle>
        {[
          ["apple_pay",  "💳 Apple Pay",          lang==="ar"?"ادفع بـ Apple Pay":"Pay with Apple Pay"],
          ["mada",       "💳 Mada / مدى",          lang==="ar"?"بطاقات مدى":"Mada cards"],
          ["stc_pay",    "📱 STC Pay",              lang==="ar"?"ادفع بـ STC Pay":"Pay with STC Pay"],
          ["cash",       "💵 "+(lang==="ar"?"نقداً":"Cash"), lang==="ar"?"الدفع نقداً عند الاستلام":"Cash on delivery/pickup"],
        ].map(([key,label,sub])=>(
          <Tog key={key} label={label} sub={sub} value={methods[key]} onChange={v=>setMethods(p=>({...p,[key]:v}))}/>
        ))}
      </Card>

      <button onClick={saveSettings} style={{ padding:"11px 24px", background:saved?"#10b981":R, border:"none", borderRadius:12, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.3s" }}>
        {saved?t.saved:t.save}
      </button>
    </div>
  );
}

function SettingsPage({ restaurant, setRestaurant, t, lang, slug }) {
  const [isOpen, setIsOpen] = useState(true);
  const [accepting, setAccepting] = useState(true);
  const [delivery, setDelivery] = useState(true);
  const [dineIn, setDineIn] = useState(true);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name:"", cuisine:"", phone:"", whatsapp:"", pickup_time:"15-20 min", min_delivery:"﷼30", delivery_fee:"﷼10"
  });

  useEffect(()=>{
    if (restaurant) {
      setForm(p=>({ ...p, name:restaurant.name||"", cuisine:restaurant.cuisine||"", phone:restaurant.phone||"", whatsapp:restaurant.phone||"", pickup_time:restaurant.pickup_time||"15-20 min" }));
    }
  }, [restaurant]);

  const saveInfo = async () => {
    if (!restaurant) return;
    await supabase.from("restaurants").update({ name:form.name, cuisine:form.cuisine, phone:form.phone, pickup_time:form.pickup_time }).eq("id", restaurant.id);
    setRestaurant(p=>({...p, name:form.name, cuisine:form.cuisine, phone:form.phone, pickup_time:form.pickup_time}));
    setSaved(true);
    setTimeout(()=>setSaved(false), 2000);
  };

  const origin = typeof window!=="undefined"?window.location.origin:"";
  const links = [
    [t.customerApp, `${origin}/${slug}`],
    [t.ownerDash, `${origin}/${slug}/dashboard`],
    [t.managerLogin, `${origin}/${slug}/manager`],
    [t.employeeLogin, `${origin}/${slug}/employee`],
  ];

  const fields = [[t.name,"name"],[t.cuisine,"cuisine"],[t.phone,"phone"],[t.whatsapp,"whatsapp"],[t.pickupTime,"pickup_time"],[t.minDelivery,"min_delivery"],[t.deliveryFee,"delivery_fee"]];

  return (
    <div>
      <STitle title={t.settings}/>
      <Card>
        <CardTitle>{t.operations}</CardTitle>
        <Tog label={t.restaurantOpen} sub={t.openSub} value={isOpen} onChange={setIsOpen}/>
        <Tog label={t.acceptingOrders} sub={t.acceptingSub} value={accepting} onChange={setAccepting}/>
        <Tog label={t.deliveryAvail} sub={t.deliverySub} value={delivery} onChange={setDelivery}/>
        <Tog label={t.dineInAvail} sub={t.dineInSub} value={dineIn} onChange={setDineIn}/>
      </Card>
      <Card>
        <CardTitle>{t.restaurantInfo}</CardTitle>
        {fields.map(([label,key])=>(
          <div key={key} style={{ marginBottom:11 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{label}</div>
            <input value={form[key]||""} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} style={inp()} onFocus={e=>{e.target.style.borderColor=R;e.target.style.background="#fff"}} onBlur={e=>{e.target.style.borderColor="#f0f0f0";e.target.style.background="#f8f8f8"}}/>
          </div>
        ))}
        <button onClick={saveInfo} style={{ padding:"9px 20px", background:saved?"#10b981":R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.3s" }}>{saved?t.saved:t.save}</button>
      </Card>
      <Card mb={0}>
        <CardTitle>{t.yourLinks}</CardTitle>
        {links.map(([label,url])=>(
          <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid #f8f8f8" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>{label}</div>
              <div style={{ fontSize:11, color:R, fontFamily:"monospace", marginTop:1 }}>{url}</div>
            </div>
            <button onClick={()=>navigator.clipboard?.writeText(url)} style={{ padding:"5px 11px", background:`${R}10`, border:`1px solid ${R}30`, borderRadius:8, color:R, fontSize:11, fontWeight:700, cursor:"pointer" }}>{t.copy}</button>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function OwnerDashboard() {
  const { id: slug } = useParams();
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("overview");
  const [bf, setBf] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const t = T[lang];
  const dir = t.dir;

  const [restaurant, setRestaurant] = useState(null);
  const [branches, setBranches] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [staff, setStaff] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if (t.arabicFont) {
      const link = document.createElement("link");
      link.rel="stylesheet"; link.href=t.arabicFont;
      document.head.appendChild(link);
      return ()=>document.head.removeChild(link);
    }
  }, [lang]);

  useEffect(()=>{
    if (!slug) return;
    supabase.from("restaurants").select("*").eq("slug", slug).single()
      .then(({ data })=>setRestaurant(data));
  }, [slug]);

  useEffect(()=>{
    if (!restaurant) return;
    const rid = restaurant.id;
    setLoading(true);
    Promise.all([
      supabase.from("branches").select("*").eq("restaurant_id", rid),
      supabase.from("orders").select("*").eq("restaurant_id", rid).order("created_at",{ascending:false}),
      supabase.from("menu_items").select("*").eq("restaurant_id", rid),
      supabase.from("staff").select("*").eq("restaurant_id", rid),
      supabase.from("reviews").select("*").eq("restaurant_id", rid).order("created_at",{ascending:false}),
    ]).then(([{data:bData},{data:oData},{data:mData},{data:sData},{data:rData}])=>{
      setBranches(bData||[]);
      setOrders(oData||[]);
      setMenuItems((mData||[]).map(item=>({...item, alert:item.low_stock_alert??10, sizes:item.sizes||[], options:item.options||[]})));
      setStaff(sData||[]);
      setReviews(rData||[]);
      setLoading(false);
    });

    const channel = supabase.channel(`orders-${rid}`)
      .on("postgres_changes",{event:"*",schema:"public",table:"orders",filter:`restaurant_id=eq.${rid}`}, payload=>{
        if (payload.eventType==="INSERT") setOrders(p=>[payload.new,...p]);
        if (payload.eventType==="UPDATE") setOrders(p=>p.map(o=>o.id===payload.new.id?payload.new:o));
        if (payload.eventType==="DELETE") setOrders(p=>p.filter(o=>o.id!==payload.old.id));
      }).subscribe();

    return ()=>{ supabase.removeChannel(channel); };
  }, [restaurant]);

  const weeklyRev = useMemo(()=>{
    const result = [];
    for (let i=6; i>=0; i--) {
      const d = new Date(); d.setDate(d.getDate()-i);
      const day = d.toISOString().split("T")[0];
      result.push(orders.filter(o=>o.status==="completed"&&(o.created_at||"").startsWith(day)).reduce((s,o)=>s+(o.total||0),0));
    }
    return result;
  }, [orders]);

  const hourly = useMemo(()=>{
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter(o=>(o.created_at||"").startsWith(today));
    return H_LABELS.map((_,i)=>todayOrders.filter(o=>new Date(o.created_at).getHours()===i+6).length);
  }, [orders]);

  const enrichedBranches = useMemo(()=>
    branches.map(b=>{
      const bOrders = orders.filter(o=>o.branch_id===b.id);
      return { ...b, orders:bOrders.length, revenue:bOrders.filter(o=>o.status==="completed").reduce((s,o)=>s+(o.total||0),0) };
    }), [branches, orders]);

  const enrichedOrders = useMemo(()=>
    orders.map(o=>{
      const br = branches.find(b=>b.id===o.branch_id);
      return { ...o, _bName:br?(lang==="ar"?(br.name_ar||br.name):br.name):"" };
    }), [orders, branches, lang]);

  const pendingCount = orders.filter(o=>o.status==="pending").length;
  const navLabel = (id) => ({ overview:t.overview, orders:t.orders, menu:t.menu, stock:t.stock, analytics:t.analytics, employees:t.employees, branches:t.branches, reviews:t.reviews, hours:t.hours, payment:t.payment, settings:t.settings })[id]||id;

  if (loading && !restaurant) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f5f5f7", fontFamily:"'DM Sans', sans-serif" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>🍽️</div>
          <div style={{ fontSize:14, color:"#888" }}>{lang==="ar"?"جاري التحميل...":"Loading..."}</div>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} style={{ minHeight:"100vh", background:"#f5f5f7", color:"#1a1a1a", fontFamily:t.font, display:"flex" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#e0e0e0;border-radius:2px}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Sidebar */}
      <div style={{ width:sidebarOpen?230:62, minWidth:sidebarOpen?230:62, background:"#fff", borderRight:dir==="ltr"?"1px solid #f0f0f0":"none", borderLeft:dir==="rtl"?"1px solid #f0f0f0":"none", display:"flex", flexDirection:"column", transition:"width 0.3s cubic-bezier(0.4,0,0.2,1)", overflow:"hidden", boxShadow:dir==="ltr"?"2px 0 8px rgba(0,0,0,0.04)":"-2px 0 8px rgba(0,0,0,0.04)", position:"sticky", top:0, height:"100vh", alignSelf:"flex-start" }}>

        <div style={{ padding:"15px 13px", borderBottom:"1px solid #f0f0f0", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:12, background:`linear-gradient(135deg,${R},${R}bb)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, flexShrink:0 }}>
            {restaurant?.emoji||"🍽️"}
          </div>
          {sidebarOpen&&<div style={{ overflow:"hidden" }}>
            <div style={{ fontWeight:800, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{restaurant?.name||"..."}</div>
            <div style={{ fontSize:10, color:"#7c3aed", fontWeight:700 }}>👑 {lang==="ar"?"المالك":"Owner"}</div>
          </div>}
        </div>

        {sidebarOpen&&(
          <div style={{ padding:"8px 11px", borderBottom:"1px solid #f0f0f0" }}>
            <select value={bf} onChange={e=>setBf(e.target.value)} style={{ width:"100%", padding:"7px 9px", background:"#f8f8f8", border:"1px solid #f0f0f0", borderRadius:9, fontSize:12, fontWeight:600, color:"#1a1a1a", outline:"none", cursor:"pointer", fontFamily:t.font }}>
              <option value="all">{t.allBranches}</option>
              {branches.map(b=><option key={b.id} value={b.id}>{lang==="ar"?(b.name_ar||b.name):b.name}</option>)}
            </select>
          </div>
        )}

        <nav style={{ flex:1, padding:"9px 7px", overflowY:"auto" }}>
          {NAV_IDS.map(id=>(
            <button key={id} onClick={()=>setPage(id)} style={{ width:"100%", padding:"10px 11px", marginBottom:2, background:page===id?`${R}10`:"transparent", border:"none", borderRadius:11, color:page===id?R:"#888", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:9, textAlign:dir==="rtl"?"right":"left", transition:"all 0.15s", position:"relative" }}>
              <span style={{ fontSize:16, flexShrink:0 }}>{NAV_ICONS[id]}</span>
              {sidebarOpen&&<span style={{ whiteSpace:"nowrap" }}>{navLabel(id)}</span>}
              {id==="orders"&&pendingCount>0&&<span style={{ marginLeft:dir==="ltr"?"auto":"0", marginRight:dir==="rtl"?"auto":"0", background:R, color:"#fff", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:900, flexShrink:0 }}>{pendingCount}</span>}
              {page===id&&<div style={{ position:"absolute", [dir==="ltr"?"left":"right"]:0, top:"20%", bottom:"20%", width:3, borderRadius:dir==="ltr"?"0 2px 2px 0":"2px 0 0 2px", background:R }}/>}
            </button>
          ))}
        </nav>

        <div style={{ padding:"8px 7px", borderTop:"1px solid #f0f0f0" }}>
          <button onClick={()=>setLang(l=>l==="en"?"ar":"en")} style={{ width:"100%", padding:"8px 11px", background:"#f8f8f8", border:"1px solid #f0f0f0", borderRadius:11, color:"#555", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <span>🌐</span>{sidebarOpen&&<span>{lang==="en"?"عربي":"English"}</span>}
          </button>
          <button onClick={()=>window.open(`/${slug}`,"_blank")} style={{ width:"100%", padding:"8px 11px", background:`${R}10`, border:`1px solid ${R}30`, borderRadius:11, color:R, fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            <span>📱</span>{sidebarOpen&&<span>{t.customerApp}</span>}
          </button>
        </div>

        <button onClick={()=>setSidebarOpen(v=>!v)} style={{ padding:11, background:"transparent", border:"none", borderTop:"1px solid #f0f0f0", color:"#ccc", fontSize:12, cursor:"pointer" }}>
          {dir==="ltr"?(sidebarOpen?"◀":"▶"):(sidebarOpen?"▶":"◀")}
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex:1, overflowY:"auto", padding:"22px 26px", minHeight:"100vh" }}>
        <div style={{ maxWidth:900, margin:"0 auto", animation:"fadeIn 0.25s ease" }} key={page+lang}>
          {page==="overview"  &&<OverviewPage orders={enrichedOrders} menuItems={menuItems} branches={enrichedBranches} weeklyRev={weeklyRev} hourly={hourly} bf={bf} t={t} lang={lang}/>}
          {page==="orders"    &&<OrdersPage orders={enrichedOrders} setOrders={setOrders} bf={bf} t={t} lang={lang}/>}
          {page==="menu"      &&<MenuPage menuItems={menuItems} setMenuItems={setMenuItems} orders={orders} restaurantId={restaurant?.id} t={t} lang={lang}/>}
          {page==="stock"     &&<StockPage menuItems={menuItems} setMenuItems={setMenuItems} t={t} lang={lang}/>}
          {page==="analytics" &&<AnalyticsPage orders={orders} menuItems={menuItems} branches={enrichedBranches} weeklyRev={weeklyRev} t={t} lang={lang}/>}
          {page==="employees" &&<EmployeesPage staff={staff} setStaff={setStaff} branches={branches} restaurantId={restaurant?.id} t={t} lang={lang}/>}
          {page==="branches"  &&<BranchesPage branches={enrichedBranches} setBranches={setBranches} orders={orders} staff={staff} restaurantId={restaurant?.id} t={t} lang={lang}/>}
          {page==="reviews"   &&<ReviewsPage reviews={reviews} t={t} lang={lang}/>}
          {page==="hours"     &&<HoursPage t={t} lang={lang}/>}
          {page==="payment"   &&<PaymentPage restaurant={restaurant} setRestaurant={setRestaurant} orders={orders} t={t} lang={lang}/>}
          {page==="settings"  &&<SettingsPage restaurant={restaurant} setRestaurant={setRestaurant} t={t} lang={lang} slug={slug}/>}
        </div>
      </div>
    </div>
  );
}
