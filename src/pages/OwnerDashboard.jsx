import { useState, useEffect } from "react";

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T = {
  en: {
    dir: "ltr",
    font: "'DM Sans', sans-serif",
    arabicFont: "",
    overview: "Overview", orders: "Orders", menu: "Menu", stock: "Stock",
    analytics: "Analytics", employees: "Employees", branches: "Branches",
    reviews: "Reviews", hours: "Working Hours", payment: "Payments", settings: "Settings",
    goodMorning: "Good morning 👋", todayOverview: "Here's your restaurant today",
    ordersToday: "Orders Today", revenue: "Revenue", pending: "Pending",
    avgRating: "Avg Rating", lowStock: "Low Stock", itemsNeedRestock: "items need restock",
    weeklyRevenue: "Weekly Revenue", vsLastWeek: "vs last week", ordersByHour: "Orders by Hour",
    branchPerformance: "Branch Performance", recentOrders: "Recent Orders",
    lowStockAlert: "Low Stock Alert", needRestocking: "item(s) need restocking",
    onlyLeft: "only", left: "left", alertAt: "alert at",
    accept: "Accept", markReady: "Mark Ready", complete: "Complete", reject: "Reject",
    whatsappDriver: "📱 WhatsApp Driver", orderTypes: "Order Types", paymentMethods: "Payment Methods",
    bestSelling: "🏆 Best Selling Items", branchRevenue: "Branch Revenue Comparison",
    totalRevenue: "Total Revenue", totalOrders: "Total Orders", avgOrderValue: "Avg Order Value",
    returningCustomers: "Returning Customers", rejectionRate: "Rejection Rate", avgPrepTime: "Avg Prep Time",
    revenuetrend: "Revenue Trend", peak: "Peak",
    addEmployee: "+ Add Employee", newEmployee: "New Employee", fullName: "Full Name",
    phone: "Phone", email: "Email", password: "Password", role: "Role", branch: "Branch",
    totalEmployees: "Total", onlineNow: "Online Now", ordersHandled: "Orders Handled",
    online: "Online since", lastSeen: "Last seen", active: "Active now",
    addBranch: "+ Add Branch", manage: "Manage", staff: "staff",
    addItem: "+ Add Item", newItem: "New Item", itemName: "Item Name",
    category: "Category", price: "Price (SAR)", emoji: "Emoji", stockQty: "Stock Qty",
    lowStockAlertLabel: "Low Stock Alert", customize: "⚙️ Options", available: "Available",
    off: "Off", sizePricing: "Sizes & Pricing", optionsAddons: "Options & Add-ons",
    required: "Required", newSize: "New size (e.g. Large)", saveCustom: "Save Customization",
    newGroup: "New group name (e.g. Sauce)", choiceName: "Choice name",
    stockMgmt: "Stock Management", stockLevels: "Stock Levels", inStock: "In Stock",
    outOfStock: "Out of Stock", restock: "Restock", totalItems: "Total Items",
    weeklySchedule: "Weekly Schedule", specialModes: "Special Modes", activate: "Activate",
    ramadanHours: "🌙 Ramadan Hours", ramadanSub: "Special schedule for Ramadan",
    holidayMode: "🎉 Holiday Mode", holidaySub: "Close all branches instantly",
    emergencyClose: "⛔ Emergency Close", emergencySub: "Close everything with one click",
    saveHours: "Save Hours", saved: "✓ Saved!",
    connectedAccount: "Connected Account", payoutHistory: "Payout History",
    download: "Download", thisMonthBreakdown: "This Month Breakdown",
    grossRevenue: "Gross Revenue", moyasarFee: "Moyasar Fees (1.9%)", netPayout: "Net Payout",
    totalEarned: "Total Earned", pendingPayout: "Pending", thisMonth: "This Month",
    paid: "✓ Paid", pendingStatus: "⏳ Pending", change: "Change",
    operations: "Operations", restaurantOpen: "Restaurant is Open", openSub: "Customers can see & order",
    acceptingOrders: "Accepting Orders", acceptingSub: "New orders can be placed",
    deliveryAvail: "Delivery Available", deliverySub: "Enable delivery orders",
    dineInAvail: "Dine-in Available", dineInSub: "Enable table ordering",
    restaurantInfo: "Restaurant Info", name: "Name", cuisine: "Cuisine",
    whatsapp: "WhatsApp", pickupTime: "Pickup Time", minDelivery: "Min Delivery Order",
    deliveryFee: "Delivery Fee", save: "Save", yourLinks: "Your Links",
    customerApp: "📱 Customer App", ownerDash: "📊 Owner Dashboard",
    managerLogin: "🧑‍💼 Manager Login", employeeLogin: "👷 Employee Login", copy: "Copy",
    allBranches: "All Branches", previewAs: "Preview as:", prototype: "Qlick Dashboard — Prototype",
    open: "● Open", closed: "○ Closed", day: "day", week: "week", month: "month", year: "year",
    pickup: "Pickup", delivery: "Delivery", dineIn: "Dine-in",
    doneSt: "Done", rejected: "Rejected", preparing: "Preparing", ready: "Ready 🥡",
    pendingSt: "Pending", address: "Address",
    sat:"Saturday", sun:"Sunday", mon:"Monday", tue:"Tuesday", wed:"Wednesday", thu:"Thursday", fri:"Friday",
    to: "to", closed_day: "Closed", allDay: "24h",
    orders_count: "orders", size: "size", optionGroups: "option groups",
  },
  ar: {
    dir: "rtl",
    font: "'Tajawal', sans-serif",
    arabicFont: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap",
    overview: "نظرة عامة", orders: "الطلبات", menu: "القائمة", stock: "المخزون",
    analytics: "التحليلات", employees: "الموظفون", branches: "الفروع",
    reviews: "التقييمات", hours: "ساعات العمل", payment: "المدفوعات", settings: "الإعدادات",
    goodMorning: "صباح الخير 👋", todayOverview: "إليك أداء مطعمك اليوم",
    ordersToday: "طلبات اليوم", revenue: "الإيرادات", pending: "قيد الانتظار",
    avgRating: "متوسط التقييم", lowStock: "مخزون منخفض", itemsNeedRestock: "منتج يحتاج إعادة تخزين",
    weeklyRevenue: "إيرادات الأسبوع", vsLastWeek: "مقارنة بالأسبوع الماضي", ordersByHour: "الطلبات بالساعة",
    branchPerformance: "أداء الفروع", recentOrders: "الطلبات الأخيرة",
    lowStockAlert: "تنبيه مخزون منخفض", needRestocking: "منتج يحتاج إعادة تخزين",
    onlyLeft: "متبقي فقط", left: "", alertAt: "تنبيه عند",
    accept: "قبول", markReady: "جاهز", complete: "إتمام", reject: "رفض",
    whatsappDriver: "📱 واتساب السائق", orderTypes: "أنواع الطلبات", paymentMethods: "طرق الدفع",
    bestSelling: "🏆 الأكثر مبيعاً", branchRevenue: "مقارنة إيرادات الفروع",
    totalRevenue: "إجمالي الإيرادات", totalOrders: "إجمالي الطلبات", avgOrderValue: "متوسط قيمة الطلب",
    returningCustomers: "العملاء العائدون", rejectionRate: "نسبة الرفض", avgPrepTime: "متوسط وقت التحضير",
    revenuetrend: "اتجاه الإيرادات", peak: "ذروة",
    addEmployee: "+ إضافة موظف", newEmployee: "موظف جديد", fullName: "الاسم الكامل",
    phone: "الجوال", email: "البريد الإلكتروني", password: "كلمة المرور", role: "الدور", branch: "الفرع",
    totalEmployees: "الإجمالي", onlineNow: "متصل الآن", ordersHandled: "الطلبات المعالجة",
    online: "متصل منذ", lastSeen: "آخر ظهور", active: "نشط الآن",
    addBranch: "+ إضافة فرع", manage: "إدارة", staff: "موظف",
    addItem: "+ إضافة منتج", newItem: "منتج جديد", itemName: "اسم المنتج",
    category: "الفئة", price: "السعر (ريال)", emoji: "رمز", stockQty: "الكمية", 
    lowStockAlertLabel: "تنبيه المخزون المنخفض", customize: "⚙️ الخيارات", available: "متاح",
    off: "غير متاح", sizePricing: "الأحجام والأسعار", optionsAddons: "الخيارات والإضافات",
    required: "إلزامي", newSize: "حجم جديد (مثل: كبير)", saveCustom: "حفظ التخصيص",
    newGroup: "اسم المجموعة (مثل: الصوص)", choiceName: "اسم الخيار",
    stockMgmt: "إدارة المخزون", stockLevels: "مستويات المخزون", inStock: "متوفر",
    outOfStock: "نفد المخزون", restock: "إعادة تخزين", totalItems: "إجمالي المنتجات",
    weeklySchedule: "الجدول الأسبوعي", specialModes: "الأوضاع الخاصة", activate: "تفعيل",
    ramadanHours: "🌙 أوقات رمضان", ramadanSub: "جدول خاص لشهر رمضان",
    holidayMode: "🎉 وضع الإجازة", holidaySub: "إغلاق جميع الفروع فوراً",
    emergencyClose: "⛔ إغلاق طارئ", emergencySub: "إغلاق كل شيء بنقرة واحدة",
    saveHours: "حفظ الأوقات", saved: "✓ تم الحفظ!",
    connectedAccount: "الحساب المرتبط", payoutHistory: "سجل المدفوعات",
    download: "تحميل", thisMonthBreakdown: "تفاصيل هذا الشهر",
    grossRevenue: "الإيرادات الإجمالية", moyasarFee: "رسوم ميسر (1.9%)", netPayout: "صافي الدفع",
    totalEarned: "إجمالي الأرباح", pendingPayout: "قيد الانتظار", thisMonth: "هذا الشهر",
    paid: "✓ مدفوع", pendingStatus: "⏳ قيد الانتظار", change: "تغيير",
    operations: "العمليات", restaurantOpen: "المطعم مفتوح", openSub: "العملاء يمكنهم الرؤية والطلب",
    acceptingOrders: "استقبال الطلبات", acceptingSub: "يمكن وضع طلبات جديدة",
    deliveryAvail: "خدمة التوصيل", deliverySub: "تفعيل طلبات التوصيل",
    dineInAvail: "الجلوس بالمطعم", dineInSub: "تفعيل طلبات الطاولات",
    restaurantInfo: "معلومات المطعم", name: "الاسم", cuisine: "نوع المطبخ",
    whatsapp: "واتساب", pickupTime: "وقت الاستلام", minDelivery: "الحد الأدنى للتوصيل",
    deliveryFee: "رسوم التوصيل", save: "حفظ", yourLinks: "روابطك",
    customerApp: "📱 تطبيق العميل", ownerDash: "📊 لوحة المالك",
    managerLogin: "🧑‍💼 دخول المدير", employeeLogin: "👷 دخول الموظف", copy: "نسخ",
    allBranches: "جميع الفروع", previewAs: "معاينة كـ:", prototype: "لوحة Qlick — نموذج",
    open: "● مفتوح", closed: "○ مغلق", day: "يوم", week: "أسبوع", month: "شهر", year: "سنة",
    pickup: "استلام", delivery: "توصيل", dineIn: "داخل المطعم",
    doneSt: "منتهي", rejected: "مرفوض", preparing: "قيد التحضير", ready: "جاهز 🥡",
    pendingSt: "قيد الانتظار", address: "العنوان",
    sat:"السبت", sun:"الأحد", mon:"الاثنين", tue:"الثلاثاء", wed:"الأربعاء", thu:"الخميس", fri:"الجمعة",
    to: "إلى", closed_day: "مغلق", allDay: "٢٤ ساعة",
    orders_count: "طلب", size: "حجم", optionGroups: "مجموعة خيارات",
  }
};

const R = "#E03020";
const ROLES = {
  owner:    { en:"Owner",    ar:"المالك",   icon:"👑", color:"#7c3aed" },
  manager:  { en:"Manager",  ar:"المدير",   icon:"🧑‍💼", color:"#0ea5e9" },
  employee: { en:"Employee", ar:"الموظف",  icon:"👷", color:"#10b981" },
};

const BRANCHES = [
  { id:1, name:"Tahlia",   nameAr:"التحلية",  address:"Tahlia St, Jeddah",      addressAr:"شارع التحلية، جدة",      status:"open",   orders:24, revenue:2840 },
  { id:2, name:"Corniche", nameAr:"الكورنيش", address:"Corniche Rd, Jeddah",    addressAr:"طريق الكورنيش، جدة",    status:"open",   orders:18, revenue:1920 },
  { id:3, name:"Airport",  nameAr:"المطار",   address:"King Abdulaziz Airport", addressAr:"مطار الملك عبدالعزيز", status:"closed", orders:0,  revenue:0    },
  { id:4, name:"Andalus",  nameAr:"الأندلس",  address:"Andalus St, Jeddah",     addressAr:"شارع الأندلس، جدة",     status:"open",   orders:31, revenue:3210 },
];

const INIT_ORDERS = [
  { id:"#2041", branch:1, bName:"Tahlia",   bNameAr:"التحلية",  customer:"محمد أ.",  phone:"+966501234567", items:[{name:"Xtreme Chicken",nameAr:"اكستريم تشيكن",qty:2,price:22},{name:"Loaded Fries",nameAr:"فراي ملودد",qty:1,price:14}], total:58,  status:"pending",   time:"منذ دقيقتين",  type:"pickup"  },
  { id:"#2040", branch:2, bName:"Corniche", bNameAr:"الكورنيش", customer:"سارة خ.",  phone:"+966507654321", items:[{name:"Mix Box",nameAr:"ميكس بوكس",qty:1,price:95}],                                                                    total:95,  status:"preparing", time:"منذ 8 دقائق",  type:"delivery" },
  { id:"#2039", branch:1, bName:"Tahlia",   bNameAr:"التحلية",  customer:"أحمد ر.",  phone:"+966509876543", items:[{name:"Double Smash",nameAr:"دبل سماش",qty:2,price:28},{name:"Drinks",nameAr:"مشروبات",qty:2,price:6}],               total:68,  status:"ready",     time:"منذ 15 دقيقة", type:"pickup"  },
  { id:"#2038", branch:4, bName:"Andalus",  bNameAr:"الأندلس",  customer:"فاطمة م.", phone:"+966502345678", items:[{name:"Family Meal",nameAr:"وجبة عائلية",qty:1,price:89}],                                                              total:89,  status:"completed", time:"منذ 32 دقيقة", type:"dine-in" },
  { id:"#2037", branch:2, bName:"Corniche", bNameAr:"الكورنيش", customer:"خالد س.",  phone:"+966508765432", items:[{name:"Crispy Strips",nameAr:"ستربس مقرمشة",qty:3,price:18}],                                                          total:54,  status:"completed", time:"منذ 45 دقيقة", type:"pickup"  },
  { id:"#2036", branch:1, bName:"Tahlia",   bNameAr:"التحلية",  customer:"نورة ه.",  phone:"+966503456789", items:[{name:"Mini Mix Box",nameAr:"ميني ميكس بوكس",qty:1,price:95}],                                                         total:95,  status:"rejected",  time:"منذ ساعة",     type:"delivery"},
];

const INIT_MENU = [
  { id:1, cat:"Offers",      catAr:"العروض",      name:"Mix Box",        nameAr:"ميكس بوكس",        price:95, available:true,  orders:142, emoji:"📦", rating:4.8, stock:24, alert:10,
    sizes:[{label:"Regular",labelAr:"عادي",price:95},{label:"Large",labelAr:"كبير",price:120}],
    options:[{group:"Sauce",groupAr:"الصوص",required:false,choices:[{name:"Ketchup",nameAr:"كاتشب",price:0},{name:"BBQ",nameAr:"باربيكيو",price:0},{name:"Garlic",nameAr:"ثوم",price:0}]}] },
  { id:2, cat:"Offers",      catAr:"العروض",      name:"Mini Mix Box",   nameAr:"ميني ميكس بوكس",   price:95, available:true,  orders:98,  emoji:"🎁", rating:4.7, stock:18, alert:5,  sizes:[], options:[] },
  { id:3, cat:"Best Seller", catAr:"الأكثر مبيعاً", name:"Xtreme Chicken", nameAr:"اكستريم تشيكن",    price:22, available:true,  orders:287, emoji:"🍗", rating:4.9, stock:45, alert:10,
    sizes:[{label:"Single",labelAr:"فردي",price:22},{label:"Double",labelAr:"مزدوج",price:34}],
    options:[{group:"Remove",groupAr:"إزالة",required:false,choices:[{name:"Without Bacon",nameAr:"بدون لحم",price:0}]},{group:"Add-ons",groupAr:"إضافات",required:false,choices:[{name:"Extra Patty",nameAr:"باتي إضافي",price:8},{name:"Cheese",nameAr:"جبن",price:3}]}] },
  { id:4, cat:"Best Seller", catAr:"الأكثر مبيعاً", name:"Double Smash",   nameAr:"دبل سماش",          price:28, available:false, orders:201, emoji:"🍔", rating:4.6, stock:3,  alert:10, sizes:[], options:[] },
  { id:5, cat:"Sides",       catAr:"المقبلات",    name:"Loaded Fries",   nameAr:"فراي ملودد",        price:14, available:true,  orders:334, emoji:"🍟", rating:4.8, stock:60, alert:15,
    sizes:[{label:"Small",labelAr:"صغير",price:10},{label:"Regular",labelAr:"عادي",price:14},{label:"Large",labelAr:"كبير",price:18}],
    options:[{group:"Toppings",groupAr:"الإضافات",required:false,choices:[{name:"Cheese Sauce",nameAr:"صوص جبن",price:2},{name:"Jalapeños",nameAr:"هالابينيو",price:1}]}] },
  { id:6, cat:"Drinks",      catAr:"المشروبات",   name:"Fresh Lemonade", nameAr:"ليموناضة طازجة",    price:10, available:true,  orders:156, emoji:"🍋", rating:4.5, stock:80, alert:20, sizes:[], options:[] },
];

const EMPLOYEES = [
  { id:1, name:"Ali Hassan",  nameAr:"علي حسن",    role:"manager",  branch:1, bName:"Tahlia",   bNameAr:"التحلية",  status:"online",  login:"8:00 AM",  handled:34, phone:"+966501111111" },
  { id:2, name:"Omar Khalid", nameAr:"عمر خالد",   role:"employee", branch:1, bName:"Tahlia",   bNameAr:"التحلية",  status:"online",  login:"9:00 AM",  handled:18, phone:"+966502222222" },
  { id:3, name:"Saad Nasser", nameAr:"سعد ناصر",   role:"employee", branch:2, bName:"Corniche", bNameAr:"الكورنيش", status:"offline", login:"—",        handled:0,  phone:"+966503333333" },
  { id:4, name:"Faris Saleh", nameAr:"فارس صالح",  role:"manager",  branch:2, bName:"Corniche", bNameAr:"الكورنيش", status:"online",  login:"7:30 AM",  handled:22, phone:"+966505555555" },
  { id:5, name:"Rami Adel",   nameAr:"رامي عادل",  role:"employee", branch:4, bName:"Andalus",  bNameAr:"الأندلس",  status:"online",  login:"10:00 AM", handled:11, phone:"+966506666666" },
];

const REVIEWS = [
  { id:1, customer:"محمد أ.",  rating:5, comment:"أفضل برجر في جدة! الاكستريم تشيكن 🔥",    date:"اليوم",         branch:"Tahlia",   branchAr:"التحلية",   item:"Xtreme Chicken", itemAr:"اكستريم تشيكن" },
  { id:2, customer:"سارة خ.",  rating:4, comment:"أكل رائع، استلام سريع. سأطلب مجدداً!",    date:"أمس",           branch:"Corniche", branchAr:"الكورنيش",  item:"Mix Box",        itemAr:"ميكس بوكس" },
  { id:3, customer:"أحمد ر.",  rating:5, comment:"مثالي في كل مرة. لا يخذل أبداً.",         date:"منذ يومين",     branch:"Tahlia",   branchAr:"التحلية",   item:"Double Smash",   itemAr:"دبل سماش" },
  { id:4, customer:"فاطمة م.", rating:3, comment:"الأكل جيد لكن التحضير أخذ وقتاً أطول.",   date:"منذ 3 أيام",    branch:"Andalus",  branchAr:"الأندلس",   item:"Family Meal",    itemAr:"وجبة عائلية" },
  { id:5, customer:"خالد س.",  rating:5, comment:"الستربس لذيذة جداً!",                      date:"منذ 4 أيام",    branch:"Corniche", branchAr:"الكورنيش",  item:"Crispy Strips",  itemAr:"ستربس مقرمشة" },
];

const PAYOUTS = [
  { id:1, date:"7 مايو 2026",  dateEn:"May 7, 2026",  amount:4280, status:"paid",    ref:"TXN-88821" },
  { id:2, date:"30 أبريل 2026", dateEn:"Apr 30, 2026", amount:3910, status:"paid",    ref:"TXN-88654" },
  { id:3, date:"8 مايو 2026",  dateEn:"May 8, 2026",  amount:1240, status:"pending", ref:"TXN-88999" },
];

const WEEKLY_REV = [3200,4100,3800,5200,4800,6100,7960];
const WEEKLY_DAYS = { en:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], ar:["إث","ثل","أر","خم","جم","سب","أح"] };
const HOURLY = [2,4,8,12,18,24,31,28,22,19,26,34,28,14];
const H_LABELS = ["6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p"];

const ORDER_STATUS = (t) => ({
  pending:   { label:t.pendingSt,  color:"#f59e0b", bg:"#fef3c7", next:"preparing", btn:t.accept },
  preparing: { label:t.preparing,  color:"#3b82f6", bg:"#dbeafe", next:"ready",     btn:t.markReady },
  ready:     { label:t.ready,      color:"#10b981", bg:"#d1fae5", next:"completed", btn:t.complete },
  completed: { label:t.doneSt,     color:"#6b7280", bg:"#f3f4f6", next:null,        btn:null },
  rejected:  { label:t.rejected,   color:"#ef4444", bg:"#fee2e2", next:null,        btn:null },
});

const TYPE_ICON = { pickup:"🥡", delivery:"🛵", "dine-in":"🪑" };
const TYPE_LABEL = (t) => ({ pickup:t.pickup, delivery:t.delivery, "dine-in":t.dineIn });

// ── COMPONENTS ────────────────────────────────────────────────────────────────
const inp = (extra={}) => ({ width:"100%", padding:"9px 13px", background:"#f8f8f8", border:"1.5px solid #f0f0f0", borderRadius:11, fontSize:13, color:"#1a1a1a", outline:"none", fontFamily:"inherit", boxSizing:"border-box", ...extra });

function Badge({ status, t }) {
  const s = ORDER_STATUS(t)[status]||ORDER_STATUS(t).pending;
  return <span style={{ padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, color:s.color, background:s.bg }}>{s.label}</span>;
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

function Tog({ label, sub, value, onChange }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom:"1px solid #f8f8f8" }}>
      <div><div style={{ fontSize:14, fontWeight:600 }}>{label}</div>{sub&&<div style={{ fontSize:12, color:"#888", marginTop:1 }}>{sub}</div>}</div>
      <button onClick={()=>onChange(!value)} style={{ width:46, height:25, borderRadius:13, background:value?R:"#e0e0e0", border:"none", cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
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
      {action&&<button onClick={onClick} style={{ padding:"9px 18px", background:R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>{action}</button>}
    </div>
  );
}

// ── PAGES ─────────────────────────────────────────────────────────────────────
function OverviewPage({ role, bf, t, lang }) {
  const orders = bf==="all"?INIT_ORDERS:INIT_ORDERS.filter(o=>o.branch===bf);
  const revenue = orders.filter(o=>o.status==="completed").reduce((s,o)=>s+o.total,0);
  const pending = orders.filter(o=>o.status==="pending").length;
  const maxR = Math.max(...WEEKLY_REV);
  const days = WEEKLY_DAYS[lang];

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.03em" }}>{t.goodMorning}</div>
          <div style={{ fontSize:13, color:"#888", marginTop:2 }}>{t.todayOverview}</div>
        </div>
        <div style={{ fontSize:12, color:"#888", background:"#f8f8f8", padding:"7px 14px", borderRadius:20 }}>{new Date().toLocaleDateString(lang==="ar"?"ar-SA":"en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
      </div>

      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:22 }}>
        <StatCard icon="📦" label={t.ordersToday} value={orders.length} trend={12} color={R}/>
        <StatCard icon="💰" label={t.revenue} value={`﷼${revenue}`} trend={8} color="#10b981"/>
        <StatCard icon="⏳" label={t.pending} value={pending} color="#f59e0b"/>
        {role!=="employee"&&<StatCard icon="⭐" label={t.avgRating} value="4.7" trend={3} color="#6366f1"/>}
        {role!=="employee"&&<StatCard icon="⚠️" label={t.lowStock} value={INIT_MENU.filter(m=>m.stock<=m.alert).length} color="#ef4444" sub={`${t.itemsNeedRestock}`}/>}
      </div>

      {INIT_MENU.filter(m=>m.stock<=m.alert).length>0&&(
        <div style={{ background:"#fef3c7", border:"1.5px solid #f59e0b", borderRadius:16, padding:"13px 17px", marginBottom:18, display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:20 }}>⚠️</span>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:"#92400e" }}>{t.lowStockAlert}</div>
            <div style={{ fontSize:11, color:"#b45309" }}>{INIT_MENU.filter(m=>m.stock<=m.alert).map(m=>`${m.emoji} ${lang==="ar"?m.nameAr:m.name} (${m.stock})`).join(" · ")}</div>
          </div>
        </div>
      )}

      {role!=="employee"&&(
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:15 }}>{t.weeklyRevenue}</div>
            <div style={{ fontSize:12, color:"#10b981", fontWeight:700, background:"#d1fae5", padding:"4px 12px", borderRadius:20 }}>↑ 14% {t.vsLastWeek}</div>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120 }}>
            {WEEKLY_REV.map((val,i)=>(
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div style={{ fontSize:9, color:"#aaa" }}>﷼{(val/1000).toFixed(1)}k</div>
                <div style={{ width:"100%", background:`linear-gradient(180deg,${R},${R}77)`, borderRadius:"6px 6px 0 0", height:`${(val/maxR)*95}px`, minHeight:4 }}/>
                <div style={{ fontSize:10, color:"#bbb" }}>{days[i]}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>{t.ordersByHour}</div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:70, overflowX:"auto" }}>
          {HOURLY.map((val,i)=>(
            <div key={i} style={{ flexShrink:0, width:28, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <div style={{ width:"100%", background:val===Math.max(...HOURLY)?R:`${R}44`, borderRadius:"3px 3px 0 0", height:`${(val/Math.max(...HOURLY))*60}px`, minHeight:3 }}/>
              <div style={{ fontSize:8, color:"#ccc" }}>{H_LABELS[i]}</div>
            </div>
          ))}
        </div>
      </Card>

      {role!=="employee"&&bf==="all"&&(
        <Card>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>{t.branchPerformance}</div>
          {BRANCHES.map(b=>(
            <div key={b.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #f8f8f8" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:b.status==="open"?"#10b981":"#ef4444", flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>{lang==="ar"?b.nameAr:b.name}</div>
                <div style={{ fontSize:11, color:"#aaa" }}>{lang==="ar"?b.addressAr:b.address}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontWeight:800, fontSize:14, color:R }}>﷼{b.revenue.toLocaleString()}</div>
                <div style={{ fontSize:11, color:"#aaa" }}>{b.orders} {t.orders_count}</div>
              </div>
              <div style={{ width:80, background:"#f0f0f0", borderRadius:4, height:6 }}>
                <div style={{ width:`${(b.revenue/3210)*100}%`, background:R, borderRadius:4, height:"100%" }}/>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Card mb={0}>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>{t.recentOrders}</div>
        {orders.slice(0,5).map(o=>(
          <div key={o.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 0", borderBottom:"1px solid #f8f8f8" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:"#f8f8f8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{TYPE_ICON[o.type]}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:13 }}>{o.id} · {o.customer}</div>
                <div style={{ fontSize:11, color:"#aaa" }}>{o.time} · {lang==="ar"?o.bNameAr:o.bName}</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontWeight:700, fontSize:13 }}>﷼{o.total}</span>
              <Badge status={o.status} t={t}/>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function OrdersPage({ bf, t, lang }) {
  const [orders, setOrders] = useState(INIT_ORDERS);
  const [filter, setFilter] = useState("all");
  const statuses = ORDER_STATUS(t);
  const filtered = (bf==="all"?orders:orders.filter(o=>o.branch===bf)).filter(o=>filter==="all"||o.status===filter);
  const update = (id,next)=>setOrders(p=>p.map(o=>o.id===id?{...o,status:next}:o));
  const filterList = ["all","pending","preparing","ready","completed","rejected"];
  const filterLabels = { all:lang==="ar"?"الكل":"All", pending:t.pendingSt, preparing:t.preparing, ready:t.ready, completed:t.doneSt, rejected:t.rejected };

  return (
    <div>
      <STitle title={t.orders}/>
      <div style={{ display:"flex", gap:7, marginBottom:18, flexWrap:"wrap" }}>
        {filterList.map(f=>{
          const count=(bf==="all"?orders:orders.filter(o=>o.branch===bf)).filter(o=>f==="all"||o.status===f).length;
          return <button key={f} onClick={()=>setFilter(f)} style={{ padding:"7px 14px", borderRadius:20, border:"1.5px solid", borderColor:filter===f?R:"#e8e8e8", background:filter===f?`${R}10`:"#fff", color:filter===f?R:"#666", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
            {filterLabels[f]} {count>0&&<span style={{ background:filter===f?R:"#f0f0f0", color:filter===f?"#fff":"#999", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:800 }}>{count}</span>}
          </button>;
        })}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(o=>{
          const s=statuses[o.status];
          return (
            <Card key={o.id} mb={0}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:13 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:`${R}10`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{TYPE_ICON[o.type]}</div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:15 }}>{o.id}</div>
                    <div style={{ fontSize:11, color:"#aaa" }}>{o.customer} · {o.time}</div>
                    {o.type==="delivery"&&<div style={{ fontSize:11, color:"#0ea5e9", marginTop:1 }}>📞 {o.phone}</div>}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
                  <Badge status={o.status} t={t}/>
                  <div style={{ fontSize:11, color:"#bbb" }}>{lang==="ar"?o.bNameAr:o.bName} · {TYPE_LABEL(t)[o.type]}</div>
                </div>
              </div>
              <div style={{ background:"#f8f8f8", borderRadius:11, padding:"11px 13px", marginBottom:13 }}>
                {o.items.map((item,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#555", marginBottom:i<o.items.length-1?5:0 }}>
                    <span>{lang==="ar"?item.nameAr:item.name} × {item.qty}</span>
                    <span style={{ fontWeight:600 }}>﷼{item.price*item.qty}</span>
                  </div>
                ))}
                <div style={{ borderTop:"1px solid #e8e8e8", marginTop:8, paddingTop:8, display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:13 }}>
                  <span>{lang==="ar"?"الإجمالي":"Total"}</span><span style={{ color:R }}>﷼{o.total}</span>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                {o.status==="pending"&&<button onClick={()=>update(o.id,"rejected")} style={{ padding:"8px 14px", background:"#fee2e2", border:"none", borderRadius:10, color:"#ef4444", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.reject}</button>}
                {o.type==="delivery"&&o.status!=="completed"&&o.status!=="rejected"&&<button style={{ padding:"8px 14px", background:"#e0f2fe", border:"none", borderRadius:10, color:"#0ea5e9", fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.whatsappDriver}</button>}
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

function MenuPage({ role, t, lang }) {
  const [menu, setMenu] = useState(INIT_MENU);
  const [customizing, setCustomizing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const toggle = id=>setMenu(p=>p.map(m=>m.id===id?{...m,available:!m.available}:m));
  const cats = [...new Set(menu.map(m=>m.cat))];

  const Customizer = ({ item, onClose }) => {
    const [sizes, setSizes] = useState(item.sizes||[]);
    const [options, setOptions] = useState(item.options||[]);
    const [nSize, setNSize] = useState({label:"",price:""});
    const [nChoice, setNChoice] = useState({group:"",name:"",price:""});
    return (
      <>
        <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200 }}/>
        <div style={{ position:"fixed", top:"5%", left:"50%", transform:"translateX(-50%)", width:"90%", maxWidth:580, background:"#fff", borderRadius:22, zIndex:201, maxHeight:"88vh", overflowY:"auto", padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div style={{ fontSize:17, fontWeight:800 }}>{item.emoji} {lang==="ar"?item.nameAr:item.name}</div>
            <button onClick={onClose} style={{ width:30, height:30, borderRadius:"50%", background:"#f5f5f5", border:"none", cursor:"pointer", fontSize:15 }}>✕</button>
          </div>
          <div style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.07em", color:"#aaa", marginBottom:10 }}>{t.sizePricing}</div>
          {sizes.map((sz,i)=>(
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
          {options.map((grp,gi)=>(
            <div key={gi} style={{ background:"#f8f8f8", borderRadius:13, padding:13, marginBottom:9 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>{lang==="ar"?grp.groupAr:grp.group}</div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <label style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#888", cursor:"pointer" }}>
                    <input type="checkbox" checked={grp.required} onChange={e=>setOptions(p=>p.map((g,i)=>i===gi?{...g,required:e.target.checked}:g))} style={{ accentColor:R }}/>{t.required}
                  </label>
                  <button onClick={()=>setOptions(p=>p.filter((_,i)=>i!==gi))} style={{ width:24, height:24, borderRadius:6, background:"#fee2e2", border:"none", color:"#ef4444", cursor:"pointer", fontSize:13 }}>×</button>
                </div>
              </div>
              {grp.choices.map((ch,ci)=>(
                <div key={ci} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                  <div style={{ flex:1, fontSize:12, color:"#555" }}>{lang==="ar"?ch.nameAr:ch.name}</div>
                  <div style={{ fontSize:12, color:R, fontWeight:600 }}>{ch.price>0?`+﷼${ch.price}`:(lang==="ar"?"مجاني":"Free")}</div>
                  <button onClick={()=>setOptions(p=>p.map((g,i)=>i===gi?{...g,choices:g.choices.filter((_,j)=>j!==ci)}:g))} style={{ width:20, height:20, borderRadius:5, background:"#fee2e2", border:"none", color:"#ef4444", cursor:"pointer", fontSize:11 }}>×</button>
                </div>
              ))}
              <div style={{ display:"flex", gap:6, marginTop:7 }}>
                <input value={nChoice.group===grp.group?nChoice.name:""} onChange={e=>setNChoice(p=>({...p,group:grp.group,name:e.target.value}))} style={inp({flex:1,padding:"7px 10px"})} placeholder={t.choiceName}/>
                <input value={nChoice.group===grp.group?nChoice.price:""} onChange={e=>setNChoice(p=>({...p,price:e.target.value}))} type="number" style={inp({width:60,padding:"7px 8px"})} placeholder="+﷼"/>
                <button onClick={()=>{if(nChoice.name&&nChoice.group===grp.group){setOptions(p=>p.map((g,i)=>i===gi?{...g,choices:[...g.choices,{name:nChoice.name,nameAr:nChoice.name,price:Number(nChoice.price)||0}]}:g));setNChoice({group:"",name:"",price:""})}}} style={{ padding:"7px 11px", background:R, border:"none", borderRadius:9, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>+</button>
              </div>
            </div>
          ))}
          <div style={{ display:"flex", gap:8, marginBottom:18 }}>
            <input value={!options.find(g=>g.group===nChoice.group)?nChoice.group:""} onChange={e=>setNChoice(p=>({...p,group:e.target.value,name:"",price:""}))} style={inp({flex:1})} placeholder={t.newGroup}/>
            <button onClick={()=>{if(nChoice.group&&!options.find(g=>g.group===nChoice.group)){setOptions(p=>[...p,{group:nChoice.group,groupAr:nChoice.group,required:false,choices:[]}]);setNChoice({group:"",name:"",price:""})}}} style={{ padding:"9px 14px", background:"#f0f0f0", border:"none", borderRadius:10, color:"#555", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ {lang==="ar"?"مجموعة":"Group"}</button>
          </div>
          <button onClick={onClose} style={{ width:"100%", padding:13, background:R, border:"none", borderRadius:13, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>{t.saveCustom}</button>
        </div>
      </>
    );
  };

  return (
    <div>
      <STitle title={t.menu} action={role!=="employee"?t.addItem:null} onClick={()=>setShowAdd(v=>!v)}/>
      {showAdd&&(
        <Card>
          <CardTitle>{t.newItem}</CardTitle>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            {[[t.itemName,"🍔"],[t.category,"Best Seller"],[t.price,"25"],[t.emoji,"🍔"],[t.stockQty,"50"],[t.lowStockAlertLabel,"10"]].map(([l,ph])=>(
              <div key={l}><div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{l}</div><input placeholder={ph} style={inp()}/></div>
            ))}
          </div>
          <button style={{ padding:"9px 18px", background:R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>{lang==="ar"?"إضافة":"Add"}</button>
        </Card>
      )}
      {cats.map(cat=>{
        const catItems = menu.filter(m=>m.cat===cat);
        const catLabel = lang==="ar"?catItems[0]?.catAr:cat;
        return (
          <div key={cat} style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.07em", color:"#aaa", marginBottom:9 }}>{catLabel}</div>
            {catItems.map(item=>(
              <div key={item.id} style={{ background:"#fff", borderRadius:15, padding:"13px 15px", marginBottom:8, border:`1.5px solid ${item.stock<=item.alert?"#fde68a":"#f0f0f0"}`, opacity:item.available?1:0.6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <div style={{ width:48, height:48, borderRadius:13, background:`${R}10`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:25 }}>{item.emoji}</div>
                    {item.stock<=item.alert&&<div style={{ position:"absolute", top:-4, right:-4, width:15, height:15, borderRadius:"50%", background:"#f59e0b", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8 }}>⚠️</div>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{lang==="ar"?item.nameAr:item.name}</div>
                    <div style={{ display:"flex", gap:10, fontSize:11, color:"#888", flexWrap:"wrap" }}>
                      <span style={{ color:R, fontWeight:700 }}>﷼{item.price}</span>
                      <span>📦 {item.orders}</span>
                      <span>⭐ {item.rating}</span>
                      <span style={{ color:item.stock<=item.alert?"#f59e0b":"#10b981", fontWeight:600 }}>🗃️ {item.stock}</span>
                      {item.sizes.length>0&&<span>📐 {item.sizes.length} {t.size}</span>}
                      {item.options.length>0&&<span>⚙️ {item.options.length} {t.optionGroups}</span>}
                    </div>
                  </div>
                  {role!=="employee"&&(
                    <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                      <button onClick={()=>setCustomizing(item)} style={{ padding:"5px 9px", background:"#ede9fe", border:"1px solid #c4b5fd", borderRadius:8, color:"#7c3aed", fontSize:11, fontWeight:700, cursor:"pointer" }}>{t.customize}</button>
                      <button onClick={()=>toggle(item.id)} style={{ padding:"5px 9px", borderRadius:18, border:"1.5px solid", borderColor:item.available?"#10b981":"#e8e8e8", background:item.available?"#d1fae5":"#f8f8f8", color:item.available?"#10b981":"#aaa", fontSize:11, fontWeight:700, cursor:"pointer" }}>{item.available?t.available:t.off}</button>
                      <button style={{ width:28, height:28, borderRadius:7, background:"#f8f8f8", border:"none", cursor:"pointer", fontSize:13 }}>✏️</button>
                      <button style={{ width:28, height:28, borderRadius:7, background:"#fee2e2", border:"none", cursor:"pointer", fontSize:13 }}>🗑️</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}
      {customizing&&<Customizer item={customizing} onClose={()=>setCustomizing(null)}/>}
    </div>
  );
}

function StockPage({ t, lang }) {
  const [menu, setMenu] = useState(INIT_MENU);
  const low = menu.filter(m=>m.stock<=m.alert);
  const upd = (id,k,v)=>setMenu(p=>p.map(m=>m.id===id?{...m,[k]:Math.max(0,Number(v))}:m));

  return (
    <div>
      <STitle title={t.stockMgmt}/>
      {low.length>0&&(
        <div style={{ background:"#fef3c7", border:"1.5px solid #f59e0b", borderRadius:15, padding:"13px 16px", marginBottom:18 }}>
          <div style={{ fontWeight:800, fontSize:13, color:"#92400e", marginBottom:5 }}>⚠️ {low.length} {t.needRestocking}</div>
          {low.map(m=><div key={m.id} style={{ fontSize:11, color:"#b45309" }}>{m.emoji} {lang==="ar"?m.nameAr:m.name} — {t.onlyLeft} {m.stock} {t.left} ({t.alertAt} {m.alert})</div>)}
        </div>
      )}
      <div style={{ display:"flex", gap:12, marginBottom:18 }}>
        <StatCard icon="🗃️" label={t.totalItems} value={menu.length} color="#6366f1"/>
        <StatCard icon="✅" label={t.inStock} value={menu.filter(m=>m.stock>m.alert).length} color="#10b981"/>
        <StatCard icon="⚠️" label={t.lowStock} value={low.length} color="#f59e0b"/>
        <StatCard icon="❌" label={t.outOfStock} value={menu.filter(m=>m.stock===0).length} color="#ef4444"/>
      </div>
      <Card>
        <CardTitle>{t.stockLevels}</CardTitle>
        {menu.map(item=>(
          <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid #f8f8f8" }}>
            <div style={{ fontSize:24, flexShrink:0 }}>{item.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13, marginBottom:3 }}>{lang==="ar"?item.nameAr:item.name}</div>
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
      </Card>
    </div>
  );
}

function AnalyticsPage({ t, lang }) {
  const [period, setPeriod] = useState("week");
  const top = [...INIT_MENU].sort((a,b)=>b.orders-a.orders);
  const maxR = Math.max(...WEEKLY_REV);
  const days = WEEKLY_DAYS[lang];
  const periods = [t.day,t.week,t.month,t.year];
  const periodKeys = ["day","week","month","year"];

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
        <StatCard icon="💰" label={t.totalRevenue} value="﷼27,960" trend={14} color="#10b981"/>
        <StatCard icon="📦" label={t.totalOrders} value="384" trend={9} color={R}/>
        <StatCard icon="🧾" label={t.avgOrderValue} value="﷼76.4" trend={3} color="#6366f1"/>
        <StatCard icon="👥" label={t.returningCustomers} value="68%" trend={5} color="#0ea5e9"/>
        <StatCard icon="❌" label={t.rejectionRate} value="2.1%" trend={-1} color="#f59e0b"/>
        <StatCard icon="⏱️" label={t.avgPrepTime} value="14 min" trend={-8} color="#10b981"/>
      </div>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontWeight:700, fontSize:15 }}>{t.revenuetrend}</div>
          <div style={{ fontSize:12, color:"#10b981", fontWeight:700, background:"#d1fae5", padding:"4px 12px", borderRadius:20 }}>↑ 14% {t.vsLastWeek}</div>
        </div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120 }}>
          {WEEKLY_REV.map((val,i)=>(
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
              <div style={{ fontSize:9, color:"#aaa" }}>﷼{(val/1000).toFixed(1)}k</div>
              <div style={{ width:"100%", background:`linear-gradient(180deg,${R},${R}66)`, borderRadius:"6px 6px 0 0", height:`${(val/maxR)*95}px`, minHeight:4, position:"relative" }}>
                {val===maxR&&<div style={{ position:"absolute", top:-20, left:"50%", transform:"translateX(-50%)", background:R, color:"#fff", fontSize:9, fontWeight:700, padding:"2px 5px", borderRadius:5, whiteSpace:"nowrap" }}>{t.peak}</div>}
              </div>
              <div style={{ fontSize:10, color:"#bbb" }}>{days[i]}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>{t.bestSelling}</div>
        {top.map((item,i)=>(
          <div key={item.id} style={{ display:"flex", alignItems:"center", gap:11, padding:"10px 0", borderBottom:"1px solid #f8f8f8" }}>
            <div style={{ width:28, height:28, borderRadius:8, background:i===0?`${R}15`:i===1?"#fef3c7":i===2?"#f0fdf4":"#f8f8f8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:i===0?R:i===1?"#d97706":i===2?"#16a34a":"#999" }}>
              {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
            </div>
            <div style={{ fontSize:20 }}>{item.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{lang==="ar"?item.nameAr:item.name}</div>
              <div style={{ display:"flex", gap:10, fontSize:11, color:"#aaa" }}>
                <span>{item.orders} {t.orders_count}</span><span>⭐{item.rating}</span><span style={{ color:R, fontWeight:700 }}>﷼{item.price}</span>
              </div>
            </div>
            <div style={{ width:80, background:"#f0f0f0", borderRadius:4, height:6 }}>
              <div style={{ width:`${(item.orders/top[0].orders)*100}%`, background:i===0?R:i===1?"#f59e0b":i===2?"#10b981":"#94a3b8", borderRadius:4, height:"100%" }}/>
            </div>
            <div style={{ fontWeight:800, fontSize:13, color:"#1a1a1a", minWidth:65, textAlign:"right" }}>﷼{(item.orders*item.price).toLocaleString()}</div>
          </div>
        ))}
      </Card>
      <div style={{ display:"flex", gap:12, marginBottom:12 }}>
        <Card mb={0}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:13 }}>{t.orderTypes}</div>
          {[["🥡",t.pickup,"58%","#E03020"],["🛵",t.delivery,"31%","#0ea5e9"],["🪑",t.dineIn,"11%","#10b981"]].map(([ic,type,p,c])=>(
            <div key={type} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, fontWeight:600, marginBottom:4 }}><span>{ic} {type}</span><span style={{ color:c }}>{p}</span></div>
              <div style={{ background:"#f0f0f0", borderRadius:4, height:7 }}><div style={{ width:p, background:c, borderRadius:4, height:"100%" }}/></div>
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
      <Card mb={0}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:13 }}>{t.branchRevenue}</div>
        {BRANCHES.map(b=>(
          <div key={b.id} style={{ display:"flex", alignItems:"center", gap:11, marginBottom:11 }}>
            <div style={{ fontSize:12, fontWeight:600, minWidth:70, color:"#555" }}>{lang==="ar"?b.nameAr:b.name}</div>
            <div style={{ flex:1, background:"#f0f0f0", borderRadius:5, height:10 }}>
              <div style={{ width:`${(b.revenue/3210)*100}%`, background:`linear-gradient(90deg,${R},${R}88)`, borderRadius:5, height:"100%" }}/>
            </div>
            <div style={{ fontWeight:800, fontSize:13, color:R, minWidth:60, textAlign:"right" }}>﷼{b.revenue.toLocaleString()}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function EmployeesPage({ t, lang }) {
  const [emps] = useState(EMPLOYEES);
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div>
      <STitle title={t.employees} action={t.addEmployee} onClick={()=>setShowAdd(v=>!v)}/>
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
              <select style={inp()}>{BRANCHES.map(b=><option key={b.id}>{lang==="ar"?b.nameAr:b.name}</option>)}</select></div>
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

function BranchesPage({ t, lang }) {
  const [branches, setBranches] = useState(BRANCHES);
  const toggle = id=>setBranches(p=>p.map(b=>b.id===id?{...b,status:b.status==="open"?"closed":"open"}:b));
  return (
    <div>
      <STitle title={t.branches} action={t.addBranch}/>
      {branches.map(b=>(
        <Card key={b.id} mb={12}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:15, marginBottom:1 }}>{lang==="ar"?b.nameAr:b.name}</div>
              <div style={{ fontSize:12, color:"#aaa" }}>📍 {lang==="ar"?b.addressAr:b.address}</div>
            </div>
            <button onClick={()=>toggle(b.id)} style={{ padding:"6px 13px", borderRadius:20, border:"1.5px solid", borderColor:b.status==="open"?"#10b981":"#e8e8e8", background:b.status==="open"?"#d1fae5":"#f8f8f8", color:b.status==="open"?"#10b981":"#888", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              {b.status==="open"?t.open:t.closed}
            </button>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {[["📦",`${b.orders} ${t.orders_count}`],["💰",`﷼${b.revenue.toLocaleString()}`],["👥",`${EMPLOYEES.filter(e=>e.branch===b.id).length} ${t.staff}`]].map(([icon,val])=>(
              <div key={val} style={{ flex:1, background:"#f8f8f8", borderRadius:11, padding:"9px 12px", display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ fontSize:16 }}>{icon}</span><span style={{ fontWeight:700, fontSize:12 }}>{val}</span>
              </div>
            ))}
            <button style={{ padding:"9px 15px", background:`${R}10`, border:`1px solid ${R}30`, borderRadius:11, color:R, fontSize:12, fontWeight:700, cursor:"pointer" }}>{t.manage}</button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ReviewsPage({ t, lang }) {
  const avg = (REVIEWS.reduce((s,r)=>s+r.rating,0)/REVIEWS.length).toFixed(1);
  return (
    <div>
      <STitle title={t.reviews}/>
      <div style={{ background:`linear-gradient(135deg,${R},${R}bb)`, borderRadius:22, padding:22, marginBottom:18, color:"#fff", display:"flex", gap:22, alignItems:"center" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:50, fontWeight:900 }}>{avg}</div>
          <div style={{ fontSize:17, marginTop:3 }}>{"⭐".repeat(Math.round(avg))}</div>
          <div style={{ fontSize:11, opacity:0.8, marginTop:3 }}>{REVIEWS.length} {lang==="ar"?"تقييم":"reviews"}</div>
        </div>
        <div style={{ flex:1 }}>
          {[5,4,3,2,1].map(star=>{
            const count=REVIEWS.filter(r=>r.rating===star).length;
            return <div key={star} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:11, opacity:0.8, minWidth:8 }}>{star}</span>
              <div style={{ flex:1, background:"rgba(255,255,255,0.2)", borderRadius:4, height:7 }}>
                <div style={{ width:`${(count/REVIEWS.length)*100}%`, background:"#fff", borderRadius:4, height:"100%" }}/>
              </div>
              <span style={{ fontSize:11, opacity:0.7, minWidth:8 }}>{count}</span>
            </div>;
          })}
        </div>
      </div>
      {REVIEWS.map(r=>(
        <Card key={r.id} mb={10}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
            <div><div style={{ fontWeight:700, fontSize:13 }}>{r.customer}</div><div style={{ fontSize:11, color:"#aaa" }}>{lang==="ar"?r.branchAr:r.branch} · {lang==="ar"?r.itemAr:r.item}</div></div>
            <div style={{ textAlign:"right" }}><div style={{ fontSize:14 }}>{"⭐".repeat(r.rating)}</div><div style={{ fontSize:10, color:"#bbb", marginTop:1 }}>{r.date}</div></div>
          </div>
          <div style={{ fontSize:13, color:"#555", lineHeight:1.5 }}>{r.comment}</div>
        </Card>
      ))}
    </div>
  );
}

function HoursPage({ t, lang }) {
  const DAYS_KEYS = ["sat","sun","mon","tue","wed","thu","fri"];
  const [hours, setHours] = useState(DAYS_KEYS.map(d=>({day:d,open:true,from:"10:00",to:"00:00",allDay:false})));
  const [saved, setSaved] = useState(false);
  const upd = (i,k,v)=>setHours(p=>p.map((h,j)=>j===i?{...h,[k]:v}:h));

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

function SettingsPage({ t, lang }) {
  const [isOpen,setIsOpen]=useState(true);
  const [accepting,setAccepting]=useState(true);
  const [delivery,setDelivery]=useState(true);
  const [dineIn,setDineIn]=useState(true);
  const [saved,setSaved]=useState(false);
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
        {[[t.name,"Fresh Burger"],[t.cuisine,"Burgers & Chicken"],[t.phone,"+966 12 000 0000"],[t.whatsapp,"+966 50 000 0000"],[t.pickupTime,"15-20 min"],[t.minDelivery,"﷼30"],[t.deliveryFee,"﷼10"]].map(([l,v])=>(
          <div key={l} style={{ marginBottom:11 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#aaa", marginBottom:4 }}>{l}</div>
            <input defaultValue={v} style={inp()} onFocus={e=>{e.target.style.borderColor=R;e.target.style.background="#fff"}} onBlur={e=>{e.target.style.borderColor="#f0f0f0";e.target.style.background="#f8f8f8"}}/>
          </div>
        ))}
        <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}} style={{ padding:"9px 20px", background:saved?"#10b981":R, border:"none", borderRadius:11, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.3s" }}>{saved?t.saved:t.save}</button>
      </Card>
      <Card mb={0}>
        <CardTitle>{t.yourLinks}</CardTitle>
        {[[t.customerApp,"qlick.sa/freshburger"],[t.ownerDash,"qlick.sa/freshburger/dashboard"],[t.managerLogin,"qlick.sa/freshburger/manager"],[t.employeeLogin,"qlick.sa/freshburger/employee"]].map(([l,url])=>(
          <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid #f8f8f8" }}>
            <div><div style={{ fontSize:13, fontWeight:600 }}>{l}</div><div style={{ fontSize:11, color:R, fontFamily:"monospace", marginTop:1 }}>{url}</div></div>
            <button onClick={()=>navigator.clipboard?.writeText(url)} style={{ padding:"5px 11px", background:`${R}10`, border:`1px solid ${R}30`, borderRadius:8, color:R, fontSize:11, fontWeight:700, cursor:"pointer" }}>{t.copy}</button>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
const NAV_IDS = {
  owner:   ["overview","orders","menu","stock","analytics","employees","branches","reviews","hours","payment","settings"],
  manager: ["overview","orders","menu","stock","analytics","employees","branches","reviews","hours","settings"],
  employee:["orders","menu","stock"],
};
const NAV_ICONS = { overview:"📊",orders:"📦",menu:"🍽️",stock:"🗃️",analytics:"📈",employees:"👥",branches:"🏪",reviews:"⭐",hours:"🕐",payment:"💳",settings:"⚙️" };

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("en");
  const [role, setRole] = useState("owner");
  const [page, setPage] = useState("overview");
  const [bf, setBf] = useState("all");
  const [open, setOpen] = useState(true);
  const t = T[lang];
  const dir = t.dir;
  const nav = NAV_IDS[role];
  const pending = INIT_ORDERS.filter(o=>o.status==="pending").length;

  useEffect(()=>{
    if(t.arabicFont){
      const link=document.createElement("link");
      link.rel="stylesheet";link.href=t.arabicFont;
      document.head.appendChild(link);
      return ()=>document.head.removeChild(link);
    }
  },[lang]);

  useEffect(()=>{setPage(nav[0]);setBf(role==="employee"?1:"all")},[role]);

  const navLabel = (id) => {
    const map = { overview:t.overview,orders:t.orders,menu:t.menu,stock:t.stock,analytics:t.analytics,employees:t.employees,branches:t.branches,reviews:t.reviews,hours:t.hours,payment:t.payment,settings:t.settings };
    return map[id];
  };

  return (
    <div dir={dir} style={{ minHeight:"100vh", background:"#f5f5f7", color:"#1a1a1a", fontFamily:t.font, display:"flex", flexDirection:"column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#e0e0e0;border-radius:2px}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Top bar */}
      <div style={{ background:"#111", padding:"8px 18px", display:"flex", alignItems:"center", gap:10, position:"sticky", top:0, zIndex:1000 }}>
        <div style={{ fontSize:11, color:"#666", fontWeight:600 }}>{t.previewAs}</div>
        {Object.entries(ROLES).map(([k,v])=>(
          <button key={k} onClick={()=>setRole(k)} style={{ padding:"5px 13px", borderRadius:20, border:"none", background:role===k?v.color:"#222", color:role===k?"#fff":"#777", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5, transition:"all 0.2s" }}>
            {v.icon} {lang==="ar"?v.ar:v.en}
          </button>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ fontSize:10, color:"#444" }}>{t.prototype}</div>
          {/* Language toggle */}
          <button onClick={()=>setLang(l=>l==="en"?"ar":"en")} style={{ padding:"5px 14px", borderRadius:20, border:"1px solid #333", background:"#1e1e1e", color:"#ddd", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
            🌐 {lang==="en"?"عربي":"English"}
          </button>
        </div>
      </div>

      <div style={{ display:"flex", flex:1 }}>
        {/* Sidebar */}
        <div style={{ width:open?230:62, minWidth:open?230:62, background:"#fff", borderRight:dir==="ltr"?"1px solid #f0f0f0":"none", borderLeft:dir==="rtl"?"1px solid #f0f0f0":"none", display:"flex", flexDirection:"column", transition:"width 0.3s cubic-bezier(0.4,0,0.2,1)", overflow:"hidden", boxShadow:dir==="ltr"?"2px 0 8px rgba(0,0,0,0.04)":"-2px 0 8px rgba(0,0,0,0.04)", position:"sticky", top:40, height:"calc(100vh - 40px)", alignSelf:"flex-start" }}>

          <div style={{ padding:"15px 13px", borderBottom:"1px solid #f0f0f0", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:12, background:`linear-gradient(135deg,${R},${R}bb)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, flexShrink:0 }}>🍔</div>
            {open&&<div style={{ overflow:"hidden" }}>
              <div style={{ fontWeight:800, fontSize:13, whiteSpace:"nowrap" }}>{lang==="ar"?"البرجر الطازج":"Fresh Burger"}</div>
              <div style={{ fontSize:10, color:ROLES[role].color, fontWeight:700 }}>{ROLES[role].icon} {lang==="ar"?ROLES[role].ar:ROLES[role].en}</div>
            </div>}
          </div>

          {open&&role!=="employee"&&(
            <div style={{ padding:"8px 11px", borderBottom:"1px solid #f0f0f0" }}>
              <select value={bf} onChange={e=>setBf(e.target.value==="all"?"all":parseInt(e.target.value))} style={{ width:"100%", padding:"7px 9px", background:"#f8f8f8", border:"1px solid #f0f0f0", borderRadius:9, fontSize:12, fontWeight:600, color:"#1a1a1a", outline:"none", cursor:"pointer", fontFamily:t.font }}>
                <option value="all">{t.allBranches}</option>
                {BRANCHES.map(b=><option key={b.id} value={b.id}>{lang==="ar"?b.nameAr:b.name}</option>)}
              </select>
            </div>
          )}
          {open&&role==="employee"&&(
            <div style={{ padding:"8px 11px", borderBottom:"1px solid #f0f0f0" }}>
              <div style={{ background:`${R}10`, borderRadius:9, padding:"7px 10px", fontSize:11, fontWeight:700, color:R }}>📍 {lang==="ar"?"فرع التحلية":"Tahlia Branch"}</div>
            </div>
          )}

          <nav style={{ flex:1, padding:"9px 7px", overflowY:"auto" }}>
            {nav.map(id=>(
              <button key={id} onClick={()=>setPage(id)} style={{ width:"100%", padding:"10px 11px", marginBottom:2, background:page===id?`${R}10`:"transparent", border:"none", borderRadius:11, color:page===id?R:"#888", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:9, textAlign:dir==="rtl"?"right":"left", transition:"all 0.15s", position:"relative" }}>
                <span style={{ fontSize:16, flexShrink:0 }}>{NAV_ICONS[id]}</span>
                {open&&<span style={{ whiteSpace:"nowrap" }}>{navLabel(id)}</span>}
                {id==="orders"&&pending>0&&<span style={{ marginLeft:dir==="ltr"?"auto":"0", marginRight:dir==="rtl"?"auto":"0", background:R, color:"#fff", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:900, flexShrink:0 }}>{pending}</span>}
                {page===id&&<div style={{ position:"absolute", [dir==="ltr"?"left":"right"]:0, top:"20%", bottom:"20%", width:3, borderRadius:dir==="ltr"?"0 2px 2px 0":"2px 0 0 2px", background:R }}/>}
              </button>
            ))}
          </nav>

          <div style={{ padding:"8px 7px", borderTop:"1px solid #f0f0f0" }}>
            <button style={{ width:"100%", padding:"9px 11px", background:`${R}10`, border:`1px solid ${R}30`, borderRadius:11, color:R, fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
              <span>📱</span>{open&&<span>{t.customerApp}</span>}
            </button>
          </div>
          <button onClick={()=>setOpen(v=>!v)} style={{ padding:11, background:"transparent", border:"none", borderTop:"1px solid #f0f0f0", color:"#ccc", fontSize:12, cursor:"pointer" }}>
            {dir==="ltr"?(open?"◀":"▶"):(open?"▶":"◀")}
          </button>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"22px 26px", minHeight:"calc(100vh - 40px)" }}>
          <div style={{ maxWidth:900, margin:"0 auto", animation:"fadeIn 0.25s ease" }} key={page+role+lang}>
            {page==="overview"  &&<OverviewPage role={role} bf={bf} t={t} lang={lang}/>}
            {page==="orders"    &&<OrdersPage bf={role==="employee"?1:bf} t={t} lang={lang}/>}
            {page==="menu"      &&<MenuPage role={role} t={t} lang={lang}/>}
            {page==="stock"     &&<StockPage t={t} lang={lang}/>}
            {page==="analytics" &&<AnalyticsPage t={t} lang={lang}/>}
            {page==="employees" &&<EmployeesPage t={t} lang={lang}/>}
            {page==="branches"  &&<BranchesPage t={t} lang={lang}/>}
            {page==="reviews"   &&<ReviewsPage t={t} lang={lang}/>}
            {page==="hours"     &&<HoursPage t={t} lang={lang}/>}
            {page==="payment"   &&<PaymentPage t={t} lang={lang}/>}
            {page==="settings"  &&<SettingsPage t={t} lang={lang}/>}
          </div>
        </div>
      </div>
    </div>
  );
}
