import { useState, useEffect, useRef } from "react";

const R = "#E03020";
const DARK = "#0a0a0a";
const CARD = "#111111";
const BORDER = "#1e1e1e";

const FEATURES = [
  { icon: "📱", title: "Customer Mobile App", titleAr: "تطبيق العميل", desc: "Beautiful branded iOS & Android app. Customers order, pay, and track in seconds.", descAr: "تطبيق احترافي لنظامي iOS وAndroid. طلب، دفع، وتتبع في ثوانٍ." },
  { icon: "📊", title: "Owner Dashboard", titleAr: "لوحة تحكم المالك", desc: "Real-time orders, analytics, employees, branches — all in one place.", descAr: "طلبات فورية، تحليلات، موظفون، فروع — كل شيء في مكان واحد." },
  { icon: "🛵", title: "Delivery Management", titleAr: "إدارة التوصيل", desc: "Toggle delivery zones, set fees, copy address to WhatsApp driver.", descAr: "تفعيل مناطق التوصيل، تحديد الرسوم، إرسال العنوان للسائق عبر واتساب." },
  { icon: "🪑", title: "Dine-in & QR Orders", titleAr: "طلبات داخل المطعم", desc: "QR code per table. Customers scan and order without a waiter.", descAr: "QR لكل طاولة. العميل يطلب مباشرة بدون نادل." },
  { icon: "📈", title: "Financial Analytics", titleAr: "تحليلات مالية", desc: "Revenue trends, best sellers, peak hours, branch comparison.", descAr: "اتجاهات الإيرادات، الأكثر مبيعاً، أوقات الذروة، مقارنة الفروع." },
  { icon: "🎟️", title: "Coupons & Loyalty", titleAr: "كوبونات وولاء", desc: "Create discount codes. Reward repeat customers with loyalty points.", descAr: "إنشاء رموز خصم. مكافأة العملاء المتكررين بنقاط الولاء." },
  { icon: "🌐", title: "Bilingual EN/AR", titleAr: "ثنائي اللغة", desc: "Full Arabic RTL support. App auto-detects phone language.", descAr: "دعم كامل للعربية. التطبيق يكتشف لغة الهاتف تلقائياً." },
  { icon: "💳", title: "Saudi Payments", titleAr: "المدفوعات السعودية", desc: "Apple Pay, Mada, STC Pay, Cash. Powered by Moyasar.", descAr: "Apple Pay، مدى، STC Pay، نقداً. مدعوم بميسر." },
  { icon: "🔒", title: "Role-Based Access", titleAr: "صلاحيات متعددة", desc: "Owner, Manager, Employee — each with their own login and access level.", descAr: "مالك، مدير، موظف — لكل منهم صلاحياته الخاصة." },
];

const STATS = [
  { value: "5 min", label: "To launch your app", labelAr: "لإطلاق تطبيقك" },
  { value: "0%", label: "Commission on orders", labelAr: "عمولة على الطلبات" },
  { value: "24/7", label: "Order automation", labelAr: "أتمتة الطلبات" },
  { value: "100%", label: "Your brand", labelAr: "علامتك التجارية" },
];


function Field({ id, label, placeholder, type = "text", form, setForm, errors, setErrors }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#666", marginBottom: 6 }}>{label}</div>
      <input
        type={type}
        value={form[id]}
        onChange={e => { setForm(f => ({ ...f, [id]: e.target.value })); setErrors(er => ({ ...er, [id]: "" })); }}
        placeholder={placeholder}
        style={{ background: "#1a1a1a", border: `1.5px solid ${errors[id] ? "#ef4444" : "#2a2a2a"}`, borderRadius: 12, padding: "13px 16px", color: "#fff", fontFamily: "inherit", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color 0.2s" }}
        onFocus={e => { e.target.style.borderColor = "#E03020"; }}
        onBlur={e => { e.target.style.borderColor = errors[id] ? "#ef4444" : "#2a2a2a"; }}
      />
      {errors[id] && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors[id]}</div>}
    </div>
  );
}
export default function App() {
  const [lang, setLang] = useState("en");
  const [billing, setBilling] = useState("monthly"); // monthly | yearly
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1); // 1=info, 2=confirm
  const [form, setForm] = useState({ fullName: "", storeName: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const ar = lang === "ar";
  const dir = ar ? "rtl" : "ltr";

  const MONTHLY = 300;
  const YEARLY = 3000;
  const MONTHLY_FROM_YEARLY = Math.round(YEARLY / 12);
  const SAVINGS = MONTHLY * 12 - YEARLY;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveFeature(f => (f + 1) % FEATURES.length), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
  }, [showModal]);

  const t = {
    tryNow: ar ? "ابدأ الآن" : "Get Started →",
    heroTag: ar ? "منصة المطاعم الرائدة في السعودية" : "Saudi Arabia's #1 Restaurant Platform",
    heroTitle1: ar ? "أطلق تطبيق مطعمك" : "Launch Your Restaurant",
    heroTitle2: ar ? "في 5 دقائق" : "App in 5 Minutes",
    heroSub: ar ? "qlick تبني تطبيقاً احترافياً لمطعمك مع لوحة تحكم كاملة — بدون تقنية، بدون تعقيد." : "Qlick builds your restaurant a professional app with a full owner dashboard — no tech skills needed.",
    featuresTitle: ar ? "كل ما تحتاجه في مكان واحد" : "Everything You Need in One Place",
    featuresSub: ar ? "منصة متكاملة تحول مطعمك إلى تجربة رقمية احترافية" : "A complete platform that transforms your restaurant into a digital powerhouse",
    pricingTitle: ar ? "سعر واحد. كل شيء مشمول." : "One Price. Everything Included.",
    pricingSub: ar ? "بدون عمولات. بدون رسوم خفية. بدون مفاجآت." : "No commissions. No hidden fees. No surprises.",
    monthly: ar ? "شهري" : "Monthly",
    yearly: ar ? "سنوي" : "Yearly",
    saveTag: ar ? "وفّر شهرين 🎉" : "Save 2 Months 🎉",
    perMonth: ar ? "/شهر" : "/mo",
    perYear: ar ? "/سنة" : "/yr",
    billedMonthly: ar ? "يُدفع شهرياً" : "Billed monthly",
    billedYearly: ar ? "يُدفع سنوياً — وفّر ﷼600" : "Billed yearly — Save ﷼600",
    equivalent: ar ? "ما يعادل" : "Equivalent to",
    includes: ar ? "يشمل كل شيء:" : "Includes everything:",
    allFeatures: ar ? [
      "تطبيق iOS وAndroid للعملاء",
      "لوحة تحكم المالك والمدير والموظف",
      "إدارة الفروع غير المحدودة",
      "تحليلات مالية متقدمة",
      "خدمة التوصيل والاستلام والجلوس",
      "كوبونات وبرنامج ولاء",
      "دعم العربية والإنجليزية",
      "Apple Pay و Mada و STC Pay",
      "دعم فني 24/7",
    ] : [
      "iOS & Android customer app",
      "Owner, Manager & Employee dashboards",
      "Unlimited branches",
      "Full financial analytics",
      "Delivery, pickup & dine-in",
      "Coupons & loyalty program",
      "Arabic & English support",
      "Apple Pay, Mada & STC Pay",
      "24/7 technical support",
    ],
    getStarted: ar ? "اشترك الآن" : "Subscribe Now",
    noCommission: ar ? "0% عمولة على طلبات عملائك" : "0% commission on your customer orders",
    // Modal
    modalTitle: ar ? "أكمل بياناتك" : "Complete Your Info",
    modalSub: ar ? "خطوة واحدة وتطبيقك جاهز!" : "One step and your app is ready!",
    fullName: ar ? "الاسم الكامل" : "Full Name",
    storeName: ar ? "اسم المطعم / المتجر" : "Restaurant / Store Name",
    email: ar ? "البريد الإلكتروني" : "Email Address",
    phone: ar ? "رقم الجوال" : "Phone Number",
    next: ar ? "التالي ←" : "Next →",
    back: ar ? "رجوع" : "Back",
    confirmTitle: ar ? "تأكيد الاشتراك" : "Confirm Subscription",
    plan: ar ? "الخطة" : "Plan",
    price: ar ? "السعر" : "Price",
    name: ar ? "الاسم" : "Name",
    store: ar ? "المتجر" : "Store",
    proceedPayment: ar ? "انتقل للدفع →" : "Proceed to Payment →",
    paymentNote: ar ? "ستنتقل إلى بوابة ميسر الآمنة للدفع" : "You'll be redirected to Moyasar secure payment",
    successTitle: ar ? "تم الطلب! 🎉" : "Request Sent! 🎉",
    successSub: ar ? "سنتواصل معك خلال ساعات لإكمال الدفع وتفعيل تطبيقك." : "We'll contact you within hours to complete payment and activate your app.",
    required: ar ? "هذا الحقل مطلوب" : "This field is required",
    invalidEmail: ar ? "البريد الإلكتروني غير صحيح" : "Invalid email address",
    invalidPhone: ar ? "رقم الجوال غير صحيح" : "Invalid phone number",
    footerTag: ar ? "منصة الطلبات الأولى في السعودية" : "Saudi Arabia's Premier Ordering Platform",
    rights: ar ? "جميع الحقوق محفوظة" : "All rights reserved",
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = t.required;
    if (!form.storeName.trim()) e.storeName = t.required;
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = t.invalidEmail;
    if (!form.phone.trim() || form.phone.trim().length < 9) e.phone = t.invalidPhone;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) setStep(2); };

  const openModal = () => { setStep(1); setSubmitted(false); setForm({ fullName:"", storeName:"", email:"", phone:"" }); setErrors({}); setShowModal(true); };

  // Field moved outside - see below

  return (
    <div dir={dir} style={{ background: DARK, color: "#fff", fontFamily: ar ? "'Tajawal', sans-serif" : "'Syne', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${R}; border-radius: 2px; }
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        .nav-link { color:#888; text-decoration:none; font-size:14px; font-weight:500; transition:color 0.2s; }
        .nav-link:hover { color:#fff; }
        .btn-primary { background:${R}; color:#fff; border:none; padding:12px 28px; border-radius:100px; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.2s; font-family:inherit; }
        .btn-primary:hover { background:#ff4030; transform:translateY(-1px); box-shadow:0 8px 24px ${R}44; }
        .btn-outline { background:transparent; color:#fff; border:1px solid #333; padding:12px 28px; border-radius:100px; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s; font-family:inherit; }
        .btn-outline:hover { border-color:#555; background:#1a1a1a; }
        .feature-card { background:${CARD}; border:1px solid ${BORDER}; border-radius:20px; padding:24px; cursor:pointer; transition:all 0.3s; }
        .feature-card:hover, .feature-card.active { border-color:${R}44; background:#1a1a1a; transform:translateY(-2px); }
        .check-item { display:flex; align-items:center; gap:10; margin-bottom:10; font-size:14px; color:#ccc; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeIn 0.2s ease; backdrop-filter:blur(8px); }
        .modal-box { background:#111; border:1px solid #222; border-radius:28px; padding:36px; width:100%; max-width:480px; animation:slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1); max-height:90vh; overflow-y:auto; }
      `}</style>

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 5%", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", background:scrolled?"rgba(10,10,10,0.95)":"transparent", backdropFilter:scrolled?"blur(20px)":"none", borderBottom:scrolled?`1px solid ${BORDER}`:"1px solid transparent", transition:"all 0.3s" }}>
        <a href="#home" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:36, height:36, borderRadius:10, background:R, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🍔</div>
          <span style={{ fontSize:22, fontWeight:800, color:"#fff", letterSpacing:"-0.03em" }}>qlick</span>
        </a>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={()=>setLang(l=>l==="en"?"ar":"en")} style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:20, padding:"6px 14px", color:"#888", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            {ar?"EN":"عربي"}
          </button>
          <button className="btn-primary" style={{ padding:"8px 20px", fontSize:13 }} onClick={openModal}>{t.tryNow}</button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"120px 5% 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:600, height:600, background:`radial-gradient(circle,${R}15 0%,transparent 70%)`, pointerEvents:"none" }}/>
        
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${R}15`, border:`1px solid ${R}33`, borderRadius:100, padding:"6px 16px", fontSize:12, fontWeight:700, color:R, marginBottom:32, animation:"fadeIn 0.6s ease" }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:R, animation:"pulse 1.5s ease infinite" }}/>
          {t.heroTag}
        </div>

        <h1 style={{ fontSize:"clamp(42px,8vw,88px)", fontWeight:900, lineHeight:1.05, letterSpacing:"-0.04em", marginBottom:24, animation:"fadeUp 0.6s 0.1s ease both", maxWidth:900 }}>
          {t.heroTitle1}<br/>
          <span style={{ background:`linear-gradient(135deg,${R},#ff6050)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{t.heroTitle2}</span>
        </h1>

        <p style={{ fontSize:"clamp(15px,2vw,19px)", color:"#888", maxWidth:560, lineHeight:1.7, marginBottom:48, animation:"fadeUp 0.6s 0.2s ease both" }}>{t.heroSub}</p>

        <div style={{ display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center", marginBottom:80, animation:"fadeUp 0.6s 0.3s ease both" }}>
          <button className="btn-primary" style={{ padding:"14px 36px", fontSize:15 }} onClick={openModal}>{t.tryNow}</button>
          <button className="btn-outline" style={{ padding:"14px 36px", fontSize:15 }}>{ar?"شاهد العرض":"Watch Demo"}</button>
        </div>

        <div style={{ display:"flex", gap:40, flexWrap:"wrap", justifyContent:"center", animation:"fadeUp 0.6s 0.4s ease both" }}>
          {STATS.map((s,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:32, fontWeight:900, letterSpacing:"-0.03em" }}>{s.value}</div>
              <div style={{ fontSize:13, color:"#555", marginTop:4 }}>{ar?s.labelAr:s.label}</div>
            </div>
          ))}
        </div>

        {/* Mock preview */}
        <div style={{ marginTop:80, position:"relative", animation:"float 4s ease-in-out infinite" }}>
          <div style={{ width:320, height:180, background:CARD, border:`1px solid ${BORDER}`, borderRadius:24, padding:20, display:"flex", gap:16, alignItems:"center" }}>
            <div style={{ width:80, height:140, background:"#1a1a1a", borderRadius:14, border:`1px solid ${BORDER}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:R, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🍔</div>
              <div style={{ fontSize:8, color:"#555", fontWeight:700 }}>FRESH BURGER</div>
              <div style={{ width:50, height:3, background:R, borderRadius:2 }}/>
              <div style={{ width:40, height:3, background:"#2a2a2a", borderRadius:2 }}/>
              <div style={{ width:45, height:3, background:"#2a2a2a", borderRadius:2 }}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:"#555", marginBottom:8 }}>Live Orders</div>
              {[["#2041","﷼58","pending"],["#2040","﷼95","preparing"],["#2039","﷼68","ready"]].map(([id,amt,st])=>(
                <div key={id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <span style={{ fontSize:11, color:"#666" }}>{id}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:"#fff" }}>{amt}</span>
                  <span style={{ fontSize:9, padding:"2px 6px", borderRadius:8, background:st==="pending"?"#fef3c7":st==="preparing"?"#dbeafe":"#d1fae5", color:st==="pending"?"#92400e":st==="preparing"?"#1e40af":"#065f46", fontWeight:700 }}>{st}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position:"absolute", top:-20, right:-40, background:"#10b981", borderRadius:12, padding:"8px 14px", fontSize:12, fontWeight:700, color:"#fff", boxShadow:"0 8px 24px #10b98144", whiteSpace:"nowrap" }}>+24 orders today 🔥</div>
          <div style={{ position:"absolute", bottom:-16, left:-30, background:CARD, border:`1px solid ${BORDER}`, borderRadius:12, padding:"8px 14px", fontSize:12, fontWeight:700, color:"#fff", whiteSpace:"nowrap" }}>⭐ 4.9 rating</div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding:"100px 5%", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <div style={{ fontSize:12, fontWeight:700, color:R, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:16 }}>Features</div>
          <h2 style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:900, letterSpacing:"-0.03em", marginBottom:16 }}>{t.featuresTitle}</h2>
          <p style={{ color:"#666", fontSize:16, maxWidth:500, margin:"0 auto" }}>{t.featuresSub}</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
          {FEATURES.map((f,i)=>(
            <div key={i} className={`feature-card ${activeFeature===i?"active":""}`} onClick={()=>setActiveFeature(i)}>
              <div style={{ width:48, height:48, borderRadius:14, background:`${R}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:16 }}>{f.icon}</div>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:8, color:"#fff" }}>{ar?f.titleAr:f.title}</div>
              <div style={{ fontSize:13, color:"#666", lineHeight:1.6 }}>{ar?f.descAr:f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding:"100px 5%", background:"#0d0d0d" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ fontSize:12, fontWeight:700, color:R, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:16 }}>Pricing</div>
            <h2 style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:900, letterSpacing:"-0.03em", marginBottom:16 }}>{t.pricingTitle}</h2>
            <p style={{ color:"#666", fontSize:16 }}>{t.pricingSub}</p>
          </div>

          {/* Toggle */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:40 }}>
            <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:100, padding:4, display:"flex", gap:4 }}>
              <button onClick={()=>setBilling("monthly")} style={{ padding:"10px 28px", borderRadius:100, border:"none", background:billing==="monthly"?R:"transparent", color:billing==="monthly"?"#fff":"#666", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s" }}>{t.monthly}</button>
              <button onClick={()=>setBilling("yearly")} style={{ padding:"10px 28px", borderRadius:100, border:"none", background:billing==="yearly"?R:"transparent", color:billing==="yearly"?"#fff":"#666", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s", display:"flex", alignItems:"center", gap:8 }}>
                {t.yearly}
                <span style={{ background:"#10b98120", border:"1px solid #10b98133", color:"#10b981", fontSize:11, padding:"2px 8px", borderRadius:20, fontWeight:800 }}>{t.saveTag}</span>
              </button>
            </div>
          </div>

          {/* Price Card */}
          <div style={{ background:CARD, border:`1px solid ${R}44`, borderRadius:28, padding:40, textAlign:"center", position:"relative", overflow:"hidden" }}>
            {/* Glow */}
            <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:300, height:200, background:`radial-gradient(circle,${R}20 0%,transparent 70%)`, pointerEvents:"none" }}/>
            
            <div style={{ fontSize:14, fontWeight:700, color:"#666", marginBottom:16 }}>
              {billing==="yearly"?t.billedYearly:t.billedMonthly}
            </div>

            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:4, marginBottom:8 }}>
              <span style={{ fontSize:72, fontWeight:900, letterSpacing:"-0.04em", lineHeight:1 }}>﷼{billing==="monthly"?MONTHLY:MONTHLY_FROM_YEARLY}</span>
              <span style={{ fontSize:18, color:"#555", paddingBottom:14 }}>{t.perMonth}</span>
            </div>

            {billing==="yearly" && (
              <div style={{ fontSize:14, color:"#555", marginBottom:8 }}>
                {t.equivalent} ﷼{YEARLY}{t.perYear}
              </div>
            )}

            {billing==="yearly" && (
              <div style={{ display:"inline-block", background:"#10b98120", border:"1px solid #10b98133", borderRadius:20, padding:"6px 16px", fontSize:13, fontWeight:700, color:"#10b981", marginBottom:32 }}>
                🎉 {ar?`وفّر ﷼${SAVINGS} سنوياً`:`Save ﷼${SAVINGS}/year — 2 months free!`}
              </div>
            )}

            {billing==="monthly" && <div style={{ height:40 }}/>}

            {/* Features list */}
            <div style={{ textAlign:ar?"right":"left", marginBottom:36, background:"#0d0d0d", borderRadius:18, padding:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#666", marginBottom:14 }}>{t.includes}</div>
              {t.allFeatures.map((f,i)=>(
                <div key={i} className="check-item">
                  <div style={{ width:20, height:20, borderRadius:"50%", background:`${R}20`, border:`1px solid ${R}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11, color:R }}>✓</div>
                  {f}
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ width:"100%", padding:18, fontSize:16, borderRadius:16 }} onClick={openModal}>{t.getStarted}</button>
            
            <div style={{ marginTop:16, fontSize:12, color:"#444" }}>
              {t.noCommission}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:"#050505", borderTop:`1px solid ${BORDER}`, padding:"48px 5%" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:24 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:R, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🍔</div>
              <span style={{ fontSize:20, fontWeight:800, letterSpacing:"-0.03em" }}>qlick</span>
            </div>
            <div style={{ fontSize:13, color:"#444" }}>{t.footerTag}</div>
          </div>
          <div style={{ fontSize:13, color:"#333" }}>© 2026 Qlick. {t.rights}.</div>
        </div>
      </footer>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e=>{ if(e.target===e.currentTarget) setShowModal(false); }}>
          <div className="modal-box" dir={dir}>
            {!submitted ? (
              <>
                {/* Header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:800, color:R, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>
                      {billing==="monthly"?t.monthly:t.yearly} — ﷼{billing==="monthly"?MONTHLY:YEARLY}
                    </div>
                    <div style={{ fontSize:22, fontWeight:800, letterSpacing:"-0.03em" }}>{step===1?t.modalTitle:t.confirmTitle}</div>
                    {step===1 && <div style={{ fontSize:13, color:"#666", marginTop:4 }}>{t.modalSub}</div>}
                  </div>
                  <button onClick={()=>setShowModal(false)} style={{ width:32, height:32, borderRadius:"50%", background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#888", fontSize:16, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                </div>

                {/* Step indicator */}
                <div style={{ display:"flex", gap:8, marginBottom:28 }}>
                  {[1,2].map(s=>(
                    <div key={s} style={{ flex:1, height:3, borderRadius:2, background:step>=s?R:"#2a2a2a", transition:"background 0.3s" }}/>
                  ))}
                </div>

                {step===1 ? (
                  <>
                    <Field id="fullName" label={t.fullName} placeholder={ar?"محمد أحمد":"Mohammed Ahmed"} form={form} setForm={setForm} errors={errors} setErrors={setErrors}/>
                    <Field id="storeName" label={t.storeName} placeholder={ar?"مطعم البرجر الطازج":"Fresh Burger Restaurant"} form={form} setForm={setForm} errors={errors} setErrors={setErrors}/>
                    <Field id="email" label={t.email} placeholder="example@email.com" type="email" form={form} setForm={setForm} errors={errors} setErrors={setErrors}/>
                    <Field id="phone" label={t.phone} placeholder="+966 5X XXX XXXX" type="tel" form={form} setForm={setForm} errors={errors} setErrors={setErrors}/>
                    <button className="btn-primary" style={{ width:"100%", padding:16, fontSize:15, borderRadius:14, marginTop:8 }} onClick={handleNext}>{t.next}</button>
                  </>
                ) : (
                  <>
                    {/* Summary */}
                    <div style={{ background:"#1a1a1a", borderRadius:16, padding:20, marginBottom:24 }}>
                      {[[t.name, form.fullName],[t.store, form.storeName],["Email", form.email],[t.phone, form.phone],[t.plan, billing==="monthly"?t.monthly:t.yearly],[t.price, `﷼${billing==="monthly"?MONTHLY:YEARLY} ${billing==="monthly"?t.perMonth:t.perYear}`]].map(([label,val])=>(
                        <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #2a2a2a", fontSize:14 }}>
                          <span style={{ color:"#666" }}>{label}</span>
                          <span style={{ fontWeight:700, color:"#fff" }}>{val}</span>
                        </div>
                      ))}
                    </div>

                    {billing==="yearly" && (
                      <div style={{ background:"#10b98115", border:"1px solid #10b98133", borderRadius:12, padding:"12px 16px", marginBottom:20, fontSize:13, color:"#10b981", fontWeight:600, textAlign:"center" }}>
                        🎉 {ar?`توفر ﷼${SAVINGS} — شهرين مجاناً!`:`You're saving ﷼${SAVINGS} — 2 months free!`}
                      </div>
                    )}

                    <button className="btn-primary" style={{ width:"100%", padding:16, fontSize:15, borderRadius:14, marginBottom:12 }} onClick={()=>setSubmitted(true)}>{t.proceedPayment}</button>
                    <div style={{ textAlign:"center", fontSize:12, color:"#444", marginBottom:16 }}>🔒 {t.paymentNote}</div>
                    <button className="btn-outline" style={{ width:"100%", padding:12, fontSize:14, borderRadius:14 }} onClick={()=>setStep(1)}>{t.back}</button>
                  </>
                )}
              </>
            ) : (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ fontSize:64, marginBottom:20 }}>🎉</div>
                <div style={{ fontSize:24, fontWeight:800, letterSpacing:"-0.03em", marginBottom:12 }}>{t.successTitle}</div>
                <div style={{ fontSize:15, color:"#666", lineHeight:1.7, marginBottom:28 }}>{t.successSub}</div>
                <div style={{ background:"#1a1a1a", borderRadius:16, padding:16, marginBottom:24, fontSize:13, color:"#888" }}>
                  📱 {form.phone} · 📧 {form.email}
                </div>
                <button className="btn-primary" style={{ width:"100%", padding:14, fontSize:15, borderRadius:14 }} onClick={()=>setShowModal(false)}>
                  {ar?"حسناً، شكراً!":"Got it, thanks!"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
