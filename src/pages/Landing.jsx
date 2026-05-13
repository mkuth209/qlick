import { useState, useEffect } from "react";

const R = "#E03020";
const DOT = "#C0392B";

function Logo({ size=28 }) {
  const dot = size * 0.38;
  return (
    <div style={{ display:"inline-flex", alignItems:"flex-end", gap:0, lineHeight:1 }}>
      <span style={{ fontSize:size, fontWeight:900, color:"#fff", fontFamily:"'Arial Black','Helvetica Neue',sans-serif", letterSpacing:"-0.02em", lineHeight:1 }}>qlick</span>
      <span style={{ width:dot, height:dot, borderRadius:"50%", background:DOT, marginLeft:size*0.05, marginBottom:size*0.08, flexShrink:0, display:"inline-block" }}/>
    </div>
  );
}

const DARK = "#0a0a0a";
const CARD = "#111111";
const BORDER = "#1e1e1e";

const FEATURES = [
  { icon:"📱", title:"Customer Mobile App", titleAr:"تطبيق العميل", desc:"Beautiful branded app. Customers order, track, earn rewards — all in seconds.", descAr:"تطبيق احترافي بهويتك البصرية. طلب، تتبع، ومكافآت — في ثوانٍ." },
  { icon:"📊", title:"Owner Dashboard", titleAr:"لوحة تحكم المالك", desc:"Real-time orders, analytics, staff, branches — your entire operation in one place.", descAr:"طلبات فورية، تحليلات، موظفون، فروع — كل عملياتك في مكان واحد." },
  { icon:"🚗", title:"Drivers & Delivery", titleAr:"السائقون والتوصيل", desc:"Assign orders to drivers. One tap sends the full delivery card via WhatsApp.", descAr:"عيّن الطلبات للسائقين. نقرة واحدة ترسل بطاقة التوصيل الكاملة عبر واتساب." },
  { icon:"🪑", title:"Dine-in & QR Orders", titleAr:"طلبات داخل المطعم", desc:"QR code per table. Customers scan and order — no waiter needed.", descAr:"QR لكل طاولة. العميل يطلب مباشرة — بدون نادل." },
  { icon:"📈", title:"Financial Analytics", titleAr:"تحليلات مالية", desc:"Revenue trends, best sellers, peak hours, branch comparison. Know your numbers.", descAr:"اتجاهات الإيرادات، الأكثر مبيعاً، أوقات الذروة. اعرف أرقامك." },
  { icon:"🎟️", title:"Coupons & Loyalty", titleAr:"كوبونات وولاء", desc:"Create discount codes. Reward repeat customers with a loyalty points system.", descAr:"أنشئ رموز خصم. كافئ عملاءك المتكررين بنظام نقاط الولاء." },
  { icon:"👥", title:"Staff Management", titleAr:"إدارة الفريق", desc:"Owner, Manager, Employee — each with their own login and access level.", descAr:"مالك، مدير، موظف — لكل منهم صلاحياته ودخوله الخاص." },
  { icon:"🌐", title:"Full Arabic Support", titleAr:"دعم عربي كامل", desc:"RTL Arabic interface. App auto-detects phone language. Tajawal font.", descAr:"واجهة عربية كاملة. التطبيق يكتشف لغة الهاتف تلقائياً." },
  { icon:"💳", title:"Saudi Payments", titleAr:"المدفوعات السعودية", desc:"Apple Pay, Mada, STC Pay, Cash on delivery. Powered by Moyasar.", descAr:"Apple Pay، مدى، STC Pay، نقداً. مدعوم بميسر." },
];

const STEPS = [
  { n:"01", title:"You subscribe", titleAr:"تشترك", desc:"Choose your plan and complete payment. Mohammed sets up your complete system within 24 hours.", descAr:"اختر خطتك وأكمل الدفع. محمد يُعد نظامك الكامل خلال 24 ساعة." },
  { n:"02", title:"You get everything", titleAr:"تحصل على كل شيء", desc:"Customer app + owner dashboard — both live, branded, and ready to use from day one.", descAr:"تطبيق العملاء + لوحة تحكم المالك — كلاهما حي، بهويتك، جاهز من اليوم الأول." },
  { n:"03", title:"You fill your info", titleAr:"تضيف بياناتك", desc:"Add your real menu, photos, branches, staff, and payment portal. You control everything.", descAr:"أضف قائمتك الحقيقية، صور، فروع، موظفين، بوابة دفع. أنت تتحكم بكل شيء." },
  { n:"04", title:"Your app goes live", titleAr:"تطبيقك ينطلق", desc:"Published on the App Store and Google Play under your restaurant's name. 🚀", descAr:"منشور على App Store وGoogle Play باسم مطعمك. 🚀" },
];

const STATS = [
  { value:"0%", label:"Commission on orders", labelAr:"عمولة على الطلبات" },
  { value:"24h", label:"Setup time", labelAr:"وقت الإعداد" },
  { value:"2", label:"Apps in one system", labelAr:"تطبيق في نظام واحد" },
  { value:"﷼0", label:"Hidden fees", labelAr:"رسوم خفية" },
];

const FAQS = [
  { q:"Do you take commission on my orders?", qAr:"هل تأخذون عمولة على طلباتي؟", a:"Never. 0% commission. You keep 100% of every order your customers place.", aAr:"أبداً. 0% عمولة. أنت تحتفظ بـ 100% من كل طلب يضعه عملاؤك." },
  { q:"What's included in the Yearly plan that's not in Monthly?", qAr:"ماذا يضيف الاشتراك السنوي عن الشهري؟", a:"The Yearly plan includes App Store and Google Play accounts created and paid for under your restaurant's name — free. With Monthly, you create your own accounts (Apple $99/yr + Google $25 one time).", aAr:"الخطة السنوية تشمل إنشاء وسداد تكاليف حسابات App Store وGoogle Play باسم مطعمك — مجاناً. مع الشهرية، تحتاج لإنشاء حساباتك الخاصة (Apple 99$/سنة + Google 25$ مرة)." },
  { q:"Does the customer app look like my brand?", qAr:"هل تطبيق العميل يحمل هويتي البصرية؟", a:"Yes. Your logo, your colors, your name — on iOS and Android. Customers never see Qlick.", aAr:"نعم. شعارك، ألوانك، اسمك — على iOS وAndroid. العملاء لا يرون Qlick أبداً." },
  { q:"Can I manage everything myself?", qAr:"هل أستطيع إدارة كل شيء بنفسي؟", a:"Yes. Menu, branches, staff, hours, stock, coupons, analytics — all from your dashboard with no technical knowledge needed.", aAr:"نعم. القائمة، الفروع، الموظفون، الأوقات، المخزون، الكوبونات — كل شيء من لوحتك بدون أي خبرة تقنية." },
  { q:"How long until my app is on the App Store?", qAr:"كم يستغرق نشر تطبيقي على App Store؟", a:"3–7 days for Apple, 1–3 days for Google Play after you approve the final design.", aAr:"3-7 أيام لـ Apple، و1-3 أيام لـ Google Play بعد موافقتك على التصميم النهائي." },
  { q:"Can I have multiple branches?", qAr:"هل يمكنني إضافة فروع متعددة؟", a:"Yes, unlimited branches. Each with its own staff, hours, delivery zones and menu.", aAr:"نعم، فروع غير محدودة. كل فرع بموظفيه وأوقاته ومناطق توصيله وقائمته." },
];

const MONTHLY_FEATURES = [
  { text:"iOS & Android customer app", textAr:"تطبيق iOS وAndroid للعملاء", ok:true },
  { text:"Owner, Manager & Employee dashboards", textAr:"لوحة تحكم المالك والمدير والموظف", ok:true },
  { text:"Unlimited branches", textAr:"فروع غير محدودة", ok:true },
  { text:"Full financial analytics", textAr:"تحليلات مالية متقدمة", ok:true },
  { text:"Delivery, pickup & dine-in", textAr:"توصيل، استلام، وجلوس داخل المطعم", ok:true },
  { text:"Coupons & loyalty program", textAr:"كوبونات وبرنامج ولاء", ok:true },
  { text:"Arabic & English support", textAr:"دعم كامل للعربية والإنجليزية", ok:true },
  { text:"Apple Pay, Mada & STC Pay", textAr:"Apple Pay، مدى، STC Pay", ok:true },
  { text:"Driver management & WhatsApp", textAr:"إدارة السائقين وإرسال واتساب", ok:true },
  { text:"App Store & Google Play accounts", textAr:"حسابات App Store وGoogle Play", ok:false, note:"You create your own ($99 + $25)", noteAr:"تنشئ حساباتك الخاصة (99$ + 25$)" },
];

const YEARLY_FEATURES = [
  { text:"iOS & Android customer app", textAr:"تطبيق iOS وAndroid للعملاء", ok:true },
  { text:"Owner, Manager & Employee dashboards", textAr:"لوحة تحكم المالك والمدير والموظف", ok:true },
  { text:"Unlimited branches", textAr:"فروع غير محدودة", ok:true },
  { text:"Full financial analytics", textAr:"تحليلات مالية متقدمة", ok:true },
  { text:"Delivery, pickup & dine-in", textAr:"توصيل، استلام، وجلوس داخل المطعم", ok:true },
  { text:"Coupons & loyalty program", textAr:"كوبونات وبرنامج ولاء", ok:true },
  { text:"Arabic & English support", textAr:"دعم كامل للعربية والإنجليزية", ok:true },
  { text:"Apple Pay, Mada & STC Pay", textAr:"Apple Pay، مدى، STC Pay", ok:true },
  { text:"Driver management & WhatsApp", textAr:"إدارة السائقين وإرسال واتساب", ok:true },
  { text:"App Store & Google Play accounts — FREE", textAr:"حسابات App Store وGoogle Play — مجاناً", ok:true, highlight:true },
];

export default function App() {
  const [lang, setLang] = useState("en");
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalPlan, setModalPlan] = useState("yearly");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fullName:"", storeName:"", email:"", phone:"" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);

  const ar = lang === "ar";
  const dir = ar ? "rtl" : "ltr";
  const MONTHLY = 300;
  const YEARLY = 3000;
  const SAVINGS = MONTHLY * 12 - YEARLY;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveFeature(f => (f + 1) % FEATURES.length), 2800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { document.body.style.overflow = showModal ? "hidden" : ""; }, [showModal]);

  useEffect(() => {
    if (ar) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap";
      document.head.appendChild(link);
    }
  }, [ar]);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = ar ? "مطلوب" : "Required";
    if (!form.storeName.trim()) e.storeName = ar ? "مطلوب" : "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = ar ? "بريد غير صحيح" : "Invalid email";
    if (!form.phone.trim() || form.phone.trim().length < 9) e.phone = ar ? "رقم غير صحيح" : "Invalid phone";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openModal = (plan="yearly") => {
    setModalPlan(plan);
    setStep(1);
    setSubmitted(false);
    setForm({ fullName:"", storeName:"", email:"", phone:"" });
    setErrors({});
    setShowModal(true);
  };

  const Field = ({ id, label, placeholder, type="text" }) => (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:12, fontWeight:700, color:"#555", marginBottom:5 }}>{label}</div>
      <input type={type} value={form[id]}
        onChange={e => { setForm(f=>({...f,[id]:e.target.value})); setErrors(er=>({...er,[id]:""})); }}
        placeholder={placeholder}
        style={{ background:"#1a1a1a", border:`1.5px solid ${errors[id]?"#ef4444":"#2a2a2a"}`, borderRadius:11, padding:"12px 15px", color:"#fff", fontFamily:"inherit", fontSize:14, outline:"none", width:"100%", boxSizing:"border-box" }}
        onFocus={e=>e.target.style.borderColor=R}
        onBlur={e=>e.target.style.borderColor=errors[id]?"#ef4444":"#2a2a2a"}/>
      {errors[id] && <div style={{ fontSize:11, color:"#ef4444", marginTop:3 }}>{errors[id]}</div>}
    </div>
  );

  return (
    <div dir={dir} style={{ background:DARK, color:"#fff", fontFamily:ar?"'Tajawal',sans-serif":"'Syne',sans-serif", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${R};border-radius:2px}
        html{scroll-behavior:smooth}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes slideUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{opacity:0.3}50%{opacity:0.6}}
        .btn-r{background:${R};color:#fff;border:none;padding:12px 28px;border-radius:100px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:inherit}
        .btn-r:hover{background:#ff4030;transform:translateY(-2px);box-shadow:0 12px 32px ${R}55}
        .btn-o{background:transparent;color:#fff;border:1px solid #333;padding:12px 28px;border-radius:100px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:inherit}
        .btn-o:hover{border-color:#555;background:#1a1a1a}
        .fc{background:${CARD};border:1px solid ${BORDER};border-radius:20px;padding:24px;cursor:pointer;transition:all 0.3s}
        .fc:hover,.fc.active{border-color:${R}55;background:#161616;transform:translateY(-3px);box-shadow:0 8px 32px ${R}22}
        .sc{background:${CARD};border:1px solid ${BORDER};border-radius:20px;padding:28px;transition:all 0.3s}
        .sc:hover{border-color:${R}44;background:#161616}
        .fq{border-bottom:1px solid ${BORDER};padding:20px 0;cursor:pointer}
        .mo{position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease;backdrop-filter:blur(12px)}
        .mb{background:#111;border:1px solid #222;border-radius:28px;padding:32px;width:100%;max-width:480px;animation:slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);max-height:90vh;overflow-y:auto}
      `}</style>

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 5%", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", background:scrolled?"rgba(10,10,10,0.95)":"transparent", backdropFilter:scrolled?"blur(20px)":"none", borderBottom:scrolled?`1px solid ${BORDER}`:"1px solid transparent", transition:"all 0.3s" }}>
        <Logo size={26}/>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={()=>setLang(l=>l==="en"?"ar":"en")} style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:20, padding:"6px 14px", color:"#666", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            {ar?"EN":"عربي"}
          </button>
          <button className="btn-r" style={{ padding:"8px 20px", fontSize:13 }} onClick={()=>openModal("yearly")}>
            {ar?"ابدأ الآن":"Get Started →"}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"120px 5% 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"15%", left:"50%", transform:"translateX(-50%)", width:700, height:500, background:`radial-gradient(ellipse,${R}18 0%,transparent 65%)`, pointerEvents:"none", animation:"glow 4s ease-in-out infinite" }}/>

        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${R}18`, border:`1px solid ${R}40`, borderRadius:100, padding:"7px 18px", fontSize:12, fontWeight:700, color:R, marginBottom:36, animation:"fadeIn 0.6s ease" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:R, animation:"pulse 1.5s ease infinite" }}/>
          {ar?"النظام الرقمي المتكامل للمطاعم في السعودية":"Saudi Arabia's Complete Digital Restaurant OS"}
        </div>

        <h1 style={{ fontSize:"clamp(44px,8vw,92px)", fontWeight:900, lineHeight:1.02, letterSpacing:"-0.04em", marginBottom:28, animation:"fadeUp 0.6s 0.1s ease both", maxWidth:960 }}>
          {ar ? <>نظام مطعمك<br/><span style={{ background:`linear-gradient(135deg,${R},#ff7060)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>الرقمي المتكامل.</span></> :
          <>Your Restaurant.<br/><span style={{ background:`linear-gradient(135deg,${R},#ff7060)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Fully Digital.</span>{" "}<span style={{ background:`linear-gradient(135deg,#fff,#888)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Fully Managed.</span></>}
        </h1>

        <p style={{ fontSize:"clamp(15px,2vw,19px)", color:"#555", maxWidth:580, lineHeight:1.75, marginBottom:52, animation:"fadeUp 0.6s 0.2s ease both" }}>
          {ar?"qlick ليس مجرد تطبيق — إنه نظام تشغيل كامل لمطعمك. تطبيق عملاء، لوحة تحكم، طلبات، توصيل، موظفون، تحليلات — كل شيء في مكان واحد.":"Qlick is not just an app — it's a complete operating system for your restaurant. Customer app, dashboard, orders, delivery, staff, analytics — everything in one place."}
        </p>

        <div style={{ display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center", marginBottom:80, animation:"fadeUp 0.6s 0.3s ease both" }}>
          <button className="btn-r" style={{ padding:"15px 40px", fontSize:15 }} onClick={()=>openModal("yearly")}>{ar?"ابدأ الآن":"Get Started →"}</button>
          <button className="btn-o" style={{ padding:"15px 40px", fontSize:15 }}>{ar?"شاهد العرض":"Watch Demo"}</button>
        </div>

        <div style={{ display:"flex", gap:48, flexWrap:"wrap", justifyContent:"center", marginBottom:80, animation:"fadeUp 0.6s 0.4s ease both" }}>
          {STATS.map((s,i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:34, fontWeight:900, letterSpacing:"-0.04em" }}>{s.value}</div>
              <div style={{ fontSize:13, color:"#444", marginTop:4 }}>{ar?s.labelAr:s.label}</div>
            </div>
          ))}
        </div>

        {/* Mock */}
        <div style={{ position:"relative", animation:"float 5s ease-in-out infinite" }}>
          <div style={{ width:340, height:200, background:CARD, border:`1px solid ${BORDER}`, borderRadius:24, padding:20, display:"flex", gap:16, alignItems:"stretch", boxShadow:`0 32px 80px rgba(0,0,0,0.6)` }}>
            <div style={{ width:80, background:"#1a1a1a", borderRadius:14, border:`1px solid ${BORDER}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, padding:"12px 8px" }}>
              <div style={{ width:40, height:40, borderRadius:11, background:"#0a0a0a", border:`1px solid #2a2a2a`, display:"flex", alignItems:"center", justifyContent:"center" }}><Logo size={13}/></div>
              <div style={{ fontSize:7, color:"#444", fontWeight:800, letterSpacing:1 }}>FRESH BURGER</div>
              <div style={{ width:48, height:2, background:R, borderRadius:1 }}/>
              {[48,40,44].map((w,i) => <div key={i} style={{ width:w, height:2, background:"#222", borderRadius:1 }}/>)}
              <div style={{ width:48, height:18, background:R, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:7, color:"#fff", fontWeight:800 }}>ORDER</div>
              </div>
            </div>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ fontSize:10, color:"#444", fontWeight:700 }}>LIVE ORDERS</div>
              {[["#2041","﷼58","pending","#f59e0b"],["#2040","﷼95","preparing","#3b82f6"],["#2039","﷼68","ready","#10b981"]].map(([id,amt,st,c]) => (
                <div key={id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#1a1a1a", borderRadius:8, padding:"7px 10px" }}>
                  <span style={{ fontSize:10, color:"#555", fontWeight:700 }}>{id}</span>
                  <span style={{ fontSize:11, fontWeight:800 }}>{amt}</span>
                  <span style={{ fontSize:8, padding:"2px 7px", borderRadius:8, background:`${c}22`, color:c, fontWeight:800 }}>{st}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position:"absolute", top:-18, right:-50, background:"#10b981", borderRadius:14, padding:"9px 16px", fontSize:12, fontWeight:800, color:"#fff", boxShadow:"0 8px 24px #10b98155", whiteSpace:"nowrap" }}>+24 orders today 🔥</div>
          <div style={{ position:"absolute", bottom:-14, left:-36, background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"9px 16px", fontSize:12, fontWeight:800, whiteSpace:"nowrap" }}>⭐ 4.9 · 384 reviews</div>
          <div style={{ position:"absolute", top:60, left:-60, background:CARD, border:`1px solid #7c3aed44`, borderRadius:14, padding:"9px 14px", fontSize:11, fontWeight:700, color:"#a78bfa", whiteSpace:"nowrap" }}>💰 ﷼7,960 this month</div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:"110px 5%", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:72 }}>
          <div style={{ fontSize:11, fontWeight:800, color:R, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:16 }}>System</div>
          <h2 style={{ fontSize:"clamp(32px,5vw,56px)", fontWeight:900, letterSpacing:"-0.03em", marginBottom:16 }}>
            {ar?"نظام تشغيل متكامل. كل شيء في مكان واحد.":"Complete OS. Everything in One Place."}
          </h2>
          <p style={{ color:"#555", fontSize:16, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
            {ar?"كل ما يحتاجه مطعمك رقمياً — مبني ومتصل ويعمل من اليوم الأول":"Everything your restaurant needs digitally — built, connected, and working from day one"}
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
          {FEATURES.map((f,i) => (
            <div key={i} className={`fc ${activeFeature===i?"active":""}`} onClick={()=>setActiveFeature(i)}>
              <div style={{ width:50, height:50, borderRadius:15, background:`${R}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, marginBottom:16 }}>{f.icon}</div>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:8 }}>{ar?f.titleAr:f.title}</div>
              <div style={{ fontSize:13, color:"#555", lineHeight:1.65 }}>{ar?f.descAr:f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:"110px 5%", background:"#0d0d0d" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:72 }}>
            <div style={{ fontSize:11, fontWeight:800, color:R, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:16 }}>Process</div>
            <h2 style={{ fontSize:"clamp(28px,5vw,52px)", fontWeight:900, letterSpacing:"-0.03em", marginBottom:16 }}>
              {ar?"من الاشتراك إلى تطبيق حي في 4 خطوات":"From Signup to Live App in 4 Steps"}
            </h2>
            <p style={{ color:"#555", fontSize:16 }}>{ar?"بسيط. سريع. لا تقنية مطلوبة منك.":"Simple. Fast. No technical knowledge required."}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:16 }}>
            {STEPS.map((s,i) => (
              <div key={i} className="sc">
                <div style={{ fontSize:40, fontWeight:900, color:`${R}44`, marginBottom:16, letterSpacing:"-0.04em" }}>{s.n}</div>
                <div style={{ width:40, height:2, background:R, borderRadius:1, marginBottom:16 }}/>
                <div style={{ fontWeight:800, fontSize:17, marginBottom:10 }}>{ar?s.titleAr:s.title}</div>
                <div style={{ fontSize:14, color:"#555", lineHeight:1.65 }}>{ar?s.descAr:s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding:"110px 5%" }}>
        <div style={{ maxWidth:920, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ fontSize:11, fontWeight:800, color:R, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:16 }}>Pricing</div>
            <h2 style={{ fontSize:"clamp(28px,5vw,52px)", fontWeight:900, letterSpacing:"-0.03em", marginBottom:16 }}>
              {ar?"خطتان. كل شيء مشمول.":"Two Plans. Everything Included."}
            </h2>
            <p style={{ color:"#555", fontSize:16 }}>{ar?"بدون عمولات. بدون رسوم خفية. بدون مفاجآت.":"No commissions. No hidden fees. No surprises."}</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

            {/* MONTHLY */}
            <div style={{ background:CARD, border:`2px solid ${BORDER}`, borderRadius:24, padding:36, position:"relative" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#555", marginBottom:20 }}>{ar?"شهري":"Monthly"}</div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:4, marginBottom:6 }}>
                <span style={{ fontSize:64, fontWeight:900, letterSpacing:"-0.04em", lineHeight:1 }}>﷼{MONTHLY}</span>
                <span style={{ fontSize:16, color:"#444", paddingBottom:12 }}>{ar?"/شهر":"/mo"}</span>
              </div>
              <div style={{ fontSize:12, color:"#444", marginBottom:32 }}>{ar?"يُدفع شهرياً":"Billed monthly"}</div>

              <div style={{ marginBottom:32 }}>
                {MONTHLY_FEATURES.map((f,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:11 }}>
                    <div style={{ width:19, height:19, borderRadius:"50%", background:f.ok?`${R}22`:"#1a1a1a", border:`1px solid ${f.ok?R+"44":"#2a2a2a"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, fontSize:10, color:f.ok?R:"#333" }}>
                      {f.ok?"✓":"✕"}
                    </div>
                    <div>
                      <div style={{ fontSize:13, color:f.ok?"#888":"#333", lineHeight:1.4 }}>{ar?f.textAr:f.text}</div>
                      {f.note && <div style={{ fontSize:11, color:"#333", marginTop:2 }}>({ar?f.noteAr:f.note})</div>}
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-o" style={{ width:"100%", padding:16, fontSize:14, borderRadius:14 }} onClick={()=>openModal("monthly")}>
                {ar?"اشترك الآن":"Subscribe Now"}
              </button>
              <div style={{ marginTop:12, fontSize:11, color:"#333", textAlign:"center" }}>
                {ar?"0% عمولة على طلبات عملائك":"0% commission on customer orders"}
              </div>
            </div>

            {/* YEARLY */}
            <div style={{ background:`linear-gradient(135deg,#160808,${CARD})`, border:`2px solid ${R}66`, borderRadius:24, padding:36, position:"relative", overflow:"hidden", boxShadow:`0 0 60px ${R}15` }}>
              <div style={{ position:"absolute", top:-50, left:"50%", transform:"translateX(-50%)", width:300, height:200, background:`radial-gradient(ellipse,${R}25 0%,transparent 70%)`, pointerEvents:"none" }}/>

              {/* Best value badge */}
              <div style={{ position:"absolute", top:20, [ar?"left":"right"]:20, background:R, borderRadius:20, padding:"5px 14px", fontSize:11, fontWeight:800, color:"#fff" }}>
                {ar?"الأفضل قيمة 🏆":"Best Value 🏆"}
              </div>

              <div style={{ fontSize:14, fontWeight:700, color:R, marginBottom:20 }}>{ar?"سنوي":"Yearly"}</div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:4, marginBottom:6 }}>
                <span style={{ fontSize:64, fontWeight:900, letterSpacing:"-0.04em", lineHeight:1 }}>﷼{Math.round(YEARLY/12)}</span>
                <span style={{ fontSize:16, color:"#555", paddingBottom:12 }}>{ar?"/شهر":"/mo"}</span>
              </div>
              <div style={{ fontSize:12, color:"#555", marginBottom:6 }}>{ar?"يُدفع سنوياً — ﷼3,000":"Billed yearly — ﷼3,000"}</div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#10b98122", border:"1px solid #10b98144", borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:700, color:"#10b981", marginBottom:32 }}>
                🎉 {ar?`وفّر ﷼${SAVINGS} سنوياً`:`Save ﷼${SAVINGS}/year`}
              </div>

              <div style={{ marginBottom:32 }}>
                {YEARLY_FEATURES.map((f,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:11 }}>
                    <div style={{ width:19, height:19, borderRadius:"50%", background:f.highlight?`${R}44`:`${R}22`, border:`1px solid ${f.highlight?R:R+"44"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, fontSize:10, color:R }}>✓</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:f.highlight?"#fff":"#888", fontWeight:f.highlight?700:400, lineHeight:1.4 }}>
                        {ar?f.textAr:f.text}
                        {f.highlight && <span style={{ marginLeft:6, fontSize:9, background:`${R}33`, color:R, padding:"2px 7px", borderRadius:10, fontWeight:800, verticalAlign:"middle" }}>FREE</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-r" style={{ width:"100%", padding:16, fontSize:14, borderRadius:14 }} onClick={()=>openModal("yearly")}>
                {ar?"اشترك الآن":"Subscribe Now"}
              </button>
              <div style={{ marginTop:12, fontSize:11, color:"#444", textAlign:"center" }}>
                {ar?"0% عمولة على طلبات عملائك":"0% commission on customer orders"}
              </div>
            </div>
          </div>

          {/* Comparison note */}
          <div style={{ marginTop:20, background:CARD, border:`1px solid ${BORDER}`, borderRadius:18, padding:20 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
              <div style={{ padding:`0 20px 0 0`, borderRight:`1px solid ${BORDER}` }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:8 }}>📅 {ar?"الخطة الشهرية — App Store":"Monthly Plan — App Store"}</div>
                <div style={{ fontSize:12, color:"#555", lineHeight:1.7 }}>
                  {ar?"تحتاج لإنشاء حساب Apple Developer ($99/سنة) وحساب Google Play ($25 مرة واحدة) بنفسك. نحن نتولى البناء والنشر.":"You create your own Apple Developer ($99/yr) and Google Play ($25 one time) accounts. We handle building and publishing."}
                </div>
              </div>
              <div style={{ padding:`0 0 0 20px` }}>
                <div style={{ fontSize:13, fontWeight:700, color:R, marginBottom:8 }}>🗓️ {ar?"الخطة السنوية — App Store مشمول":"Yearly Plan — App Store included"}</div>
                <div style={{ fontSize:12, color:"#555", lineHeight:1.7 }}>
                  {ar?"نحن ننشئ ونسدد تكاليف حسابات App Store وGoogle Play باسم مطعمك — مجاناً. لا تدفع أي شيء إضافي.":"We create and pay for App Store & Google Play accounts under your restaurant's name — free. You pay nothing extra."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:"110px 5%", background:"#0d0d0d" }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ fontSize:11, fontWeight:800, color:R, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:16 }}>FAQ</div>
            <h2 style={{ fontSize:"clamp(28px,5vw,48px)", fontWeight:900, letterSpacing:"-0.03em" }}>
              {ar?"أسئلة شائعة":"Frequently Asked Questions"}
            </h2>
          </div>
          {FAQS.map((f,i) => (
            <div key={i} className="fq" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
                <div style={{ fontWeight:700, fontSize:15, color:openFaq===i?"#fff":"#888", transition:"color 0.2s" }}>{ar?f.qAr:f.q}</div>
                <div style={{ width:28, height:28, borderRadius:"50%", background:openFaq===i?R:"#1a1a1a", border:`1px solid ${openFaq===i?R:BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0, transition:"all 0.2s", color:"#fff" }}>
                  {openFaq===i?"−":"+"}
                </div>
              </div>
              {openFaq===i && <div style={{ fontSize:14, color:"#555", lineHeight:1.7, marginTop:14, animation:"fadeIn 0.2s ease" }}>{ar?f.aAr:f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"80px 5%", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at center,${R}20 0%,transparent 65%)`, pointerEvents:"none" }}/>
        <div style={{ position:"relative" }}>
          <h2 style={{ fontSize:"clamp(28px,5vw,52px)", fontWeight:900, letterSpacing:"-0.03em", marginBottom:16 }}>
            {ar?"جاهز لرقمنة مطعمك؟":"Ready to digitize your restaurant?"}
          </h2>
          <p style={{ color:"#555", fontSize:16, marginBottom:36 }}>
            {ar?"انضم إلى مطاعم السعودية التي تدير عملياتها بالكامل مع Qlick":"Join Saudi restaurants running their full operation with Qlick"}
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-r" style={{ padding:"16px 40px", fontSize:15 }} onClick={()=>openModal("yearly")}>
              {ar?"اشترك سنوياً — الأفضل قيمة 🏆":"Subscribe Yearly — Best Value 🏆"}
            </button>
            <button className="btn-o" style={{ padding:"16px 40px", fontSize:15 }} onClick={()=>openModal("monthly")}>
              {ar?"ابدأ شهرياً":"Start Monthly"}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:"#050505", borderTop:`1px solid ${BORDER}`, padding:"48px 5%" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:24 }}>
          <div>
            <Logo size={22}/>
            <div style={{ fontSize:13, color:"#333", marginBottom:12 }}>{ar?"النظام الرقمي المتكامل للمطاعم في السعودية":"Saudi Arabia's Complete Digital Restaurant System"}</div>
            <div style={{ display:"flex", gap:16 }}>
              {["Instagram","TikTok","X"].map(s => (
                <span key={s} style={{ fontSize:12, color:"#333", cursor:"pointer" }} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="#333"}>{s}</span>
              ))}
            </div>
          </div>
          <div style={{ fontSize:13, color:"#222" }}>© 2026 Qlick. {ar?"جميع الحقوق محفوظة":"All rights reserved"}.</div>
        </div>
      </footer>

      {/* MODAL */}
      {showModal && (
        <div className="mo" onClick={e=>{if(e.target===e.currentTarget)setShowModal(false);}}>
          <div className="mb" dir={dir}>
            {!submitted ? (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                  <div>
                    {/* Plan switcher inside modal */}
                    <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                      {["monthly","yearly"].map(p => (
                        <button key={p} onClick={()=>setModalPlan(p)} style={{ padding:"5px 14px", borderRadius:20, border:"1px solid", borderColor:modalPlan===p?R:BORDER, background:modalPlan===p?`${R}22`:"transparent", color:modalPlan===p?R:"#444", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                          {p==="monthly"?(ar?"شهري":"Monthly"):(ar?"سنوي 🏆":"Yearly 🏆")}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize:22, fontWeight:800, letterSpacing:"-0.03em" }}>
                      {step===1?(ar?"أكمل بياناتك":"Complete Your Info"):(ar?"تأكيد الاشتراك":"Confirm Subscription")}
                    </div>
                    <div style={{ fontSize:13, color:"#444", marginTop:4 }}>
                      ﷼{modalPlan==="monthly"?MONTHLY:YEARLY} {modalPlan==="monthly"?(ar?"/شهر":"/mo"):(ar?"/سنة":"/yr")}
                      {modalPlan==="yearly" && (
                        <span style={{ marginLeft:8, fontSize:11, color:"#10b981", fontWeight:700 }}>
                          ✓ {ar?"App Store مشمول مجاناً":"App Store included free"}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={()=>setShowModal(false)} style={{ width:32, height:32, borderRadius:"50%", background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#555", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit" }}>✕</button>
                </div>

                {/* Steps indicator */}
                <div style={{ display:"flex", gap:8, marginBottom:24 }}>
                  {[1,2].map(s => <div key={s} style={{ flex:1, height:3, borderRadius:2, background:step>=s?R:"#2a2a2a", transition:"background 0.3s" }}/>)}
                </div>

                {step===1 ? (
                  <>
                    <Field id="fullName" label={ar?"الاسم الكامل":"Full Name"} placeholder={ar?"محمد أحمد":"Mohammed Ahmed"}/>
                    <Field id="storeName" label={ar?"اسم المطعم":"Restaurant Name"} placeholder={ar?"مطعم البرجر الطازج":"Fresh Burger Restaurant"}/>
                    <Field id="email" label={ar?"البريد الإلكتروني":"Email Address"} placeholder="example@email.com" type="email"/>
                    <Field id="phone" label={ar?"رقم الجوال":"Phone Number"} placeholder="+966 5X XXX XXXX" type="tel"/>
                    <button className="btn-r" style={{ width:"100%", padding:16, fontSize:15, borderRadius:14, marginTop:8 }} onClick={()=>{if(validate())setStep(2);}}>
                      {ar?"التالي ←":"Next →"}
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ background:"#1a1a1a", borderRadius:16, padding:20, marginBottom:16 }}>
                      {[
                        [ar?"الاسم":"Name", form.fullName],
                        [ar?"المطعم":"Restaurant", form.storeName],
                        ["Email", form.email],
                        [ar?"الجوال":"Phone", form.phone],
                        [ar?"الخطة":"Plan", modalPlan==="monthly"?(ar?"شهري":"Monthly"):(ar?"سنوي":"Yearly")],
                        [ar?"السعر":"Price", `﷼${modalPlan==="monthly"?MONTHLY:YEARLY} ${modalPlan==="monthly"?(ar?"/شهر":"/mo"):(ar?"/سنة":"/yr")}`],
                      ].map(([label,val]) => (
                        <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid #2a2a2a", fontSize:14 }}>
                          <span style={{ color:"#444" }}>{label}</span>
                          <span style={{ fontWeight:700 }}>{val}</span>
                        </div>
                      ))}
                    </div>

                    {modalPlan==="yearly" ? (
                      <div style={{ background:"#10b98115", border:"1px solid #10b98133", borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13, color:"#10b981", fontWeight:600 }}>
                        🏆 {ar?"الخطة السنوية تشمل حسابات App Store وGoogle Play باسم مطعمك — مجاناً!":"Yearly plan includes App Store & Google Play accounts under your restaurant's name — free!"}
                      </div>
                    ) : (
                      <div style={{ background:"#f59e0b15", border:"1px solid #f59e0b33", borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13, color:"#f59e0b" }}>
                        💡 {ar?"ملاحظة: حسابات App Store غير مشمولة في الخطة الشهرية. قم بالترقية للسنوية للحصول عليها مجاناً!":"App Store accounts not included in Monthly. Upgrade to Yearly to get them free!"}
                        <button onClick={()=>setModalPlan("yearly")} style={{ display:"block", marginTop:6, background:"transparent", border:"none", color:R, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", padding:0 }}>
                          {ar?"← ترقية للسنوية":"← Upgrade to Yearly"}
                        </button>
                      </div>
                    )}

                    <button className="btn-r" style={{ width:"100%", padding:16, fontSize:15, borderRadius:14, marginBottom:12 }} onClick={()=>setSubmitted(true)}>
                      {ar?"انتقل للدفع →":"Proceed to Payment →"}
                    </button>
                    <div style={{ textAlign:"center", fontSize:12, color:"#333", marginBottom:14 }}>🔒 {ar?"ستنتقل إلى بوابة ميسر الآمنة":"You'll be redirected to Moyasar secure payment"}</div>
                    <button className="btn-o" style={{ width:"100%", padding:12, fontSize:14, borderRadius:14 }} onClick={()=>setStep(1)}>
                      {ar?"رجوع":"Back"}
                    </button>
                  </>
                )}
              </>
            ) : (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ fontSize:64, marginBottom:20 }}>🎉</div>
                <div style={{ fontSize:24, fontWeight:800, letterSpacing:"-0.03em", marginBottom:12 }}>{ar?"تم الطلب!":"Request Sent!"}</div>
                <div style={{ fontSize:15, color:"#555", lineHeight:1.7, marginBottom:28 }}>
                  {ar?"سنتواصل معك خلال ساعات لإكمال الدفع وتفعيل نظامك الكامل.":"We'll contact you within hours to complete payment and activate your full system."}
                </div>
                <div style={{ background:"#1a1a1a", borderRadius:16, padding:16, marginBottom:24, fontSize:13, color:"#555" }}>
                  📱 {form.phone} · 📧 {form.email}
                </div>
                <button className="btn-r" style={{ width:"100%", padding:14, fontSize:15, borderRadius:14 }} onClick={()=>setShowModal(false)}>
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
