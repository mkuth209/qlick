import { useState, useEffect, useRef } from "react";

const RESTAURANT = {
  name: "Fresh Burger",
  nameAr: "البرجر الطازج",
  color: "#E03020",
  colorDark: "#B02010",
  colorLight: "#FF5040",
};

const CATEGORIES = ["Offers", "Best Seller", "Boxes", "Chicken Burger", "Grilled", "Sides", "Drinks"];

const MENU = {
  "Offers": [
    { id: 1, name: "Mix Box", nameAr: "ميكس بوكس", desc: "6 Single Burgers, Family Fries, 3 Sauces", descAr: "٦ برجر فردي، فراي عائلي، ٣ صوصات", price: 95, originalPrice: 121, cal: 1200, image: "🍔", tag: "20% OFF" },
    { id: 2, name: "Mini Mix Box", nameAr: "ميني ميكس بوكس", desc: "10 Junior Burgers, Family Fries, 3 Sauces", descAr: "١٠ برجر جونيور، فراي عائلي، ٣ صوصات", price: 95, originalPrice: 121, cal: 980, image: "📦", tag: "20% OFF" },
  ],
  "Best Seller": [
    { id: 3, name: "Xtreme Chicken", nameAr: "اكستريم تشيكن", desc: "Crispy Chicken, Beef Bacon, Xtreme Sauce, Iceburg, Tomato", descAr: "دجاج مقرمش، لحم بقري، صوص اكستريم، خس، طماطم", price: 22, cal: 600, image: "🍗", tag: "🔥 Popular" },
    { id: 4, name: "Double Smash", nameAr: "دبل سماش", desc: "Double Smashed Patty, Special Sauce, Pickles, Onions", descAr: "باتي مزدوج، صوص خاص، مخللات، بصل", price: 28, cal: 750, image: "🍔", tag: "⭐ Top Rated" },
    { id: 5, name: "Crispy Strips", nameAr: "ستربس مقرمشة", desc: "5 Crispy Chicken Strips, Dipping Sauce", descAr: "٥ قطع ستربس مقرمشة، صوص تغميس", price: 18, cal: 450, image: "🍗" },
  ],
  "Boxes": [
    { id: 6, name: "Strips Bucket 12pc", nameAr: "باكيت ستربس 12 قطعة", desc: "12 Crispy Strips, Coleslaw, Special Sauce", descAr: "١٢ ستربس مقرمشة، كول سلو، صوص خاص", price: 55, cal: 900, image: "🪣" },
    { id: 7, name: "Family Meal", nameAr: "وجبة عائلية", desc: "4 Burgers, 4 Fries, 4 Drinks", descAr: "٤ برجر، ٤ فراي، ٤ مشروبات", price: 89, cal: 2200, image: "👨‍👩‍👧‍👦", tag: "Best Value" },
  ],
  "Chicken Burger": [
    { id: 8, name: "Classic Chicken", nameAr: "كلاسيك تشيكن", desc: "Crispy Chicken Fillet, Lettuce, Mayo, Bun", descAr: "فيليه دجاج مقرمش، خس، مايو، خبز", price: 16, cal: 520, image: "🍗" },
    { id: 9, name: "Spicy Chicken", nameAr: "سبايسي تشيكن", desc: "Spicy Crispy Chicken, Jalapeños, Spicy Sauce", descAr: "دجاج حار مقرمش، هالابينيو، صوص حار", price: 18, cal: 580, image: "🌶️" },
  ],
  "Grilled": [
    { id: 10, name: "Grilled Burger", nameAr: "برجر مشوي", desc: "Flame Grilled Beef Patty, Mushrooms, Swiss Cheese", descAr: "باتي لحم مشوي، فطر، جبن سويسري", price: 24, cal: 620, image: "🔥" },
  ],
  "Sides": [
    { id: 11, name: "Loaded Fries", nameAr: "فراي ملودد", desc: "Crispy Fries, Cheese Sauce, Jalapeños, Bacon Bits", descAr: "فراي مقرمش، صوص جبن، هالابينيو، قطع لحم", price: 14, cal: 480, image: "🍟", tag: "Fan Fave" },
    { id: 12, name: "Onion Rings", nameAr: "حلقات البصل", desc: "Crispy Battered Onion Rings, Dipping Sauce", descAr: "حلقات بصل مقرمشة، صوص تغميس", price: 12, cal: 380, image: "🧅" },
  ],
  "Drinks": [
    { id: 13, name: "Fresh Lemonade", nameAr: "ليموناضة طازجة", desc: "Freshly Squeezed Lemon, Mint, Ice", descAr: "ليمون طازج، نعناع، ثلج", price: 10, cal: 120, image: "🍋" },
    { id: 14, name: "Soft Drink", nameAr: "مشروب غازي", desc: "Pepsi, 7Up, Mirinda — Your Choice", descAr: "بيبسي، سفن أب، ميرندا — اختيارك", price: 6, cal: 150, image: "🥤" },
  ],
};

const PROMOS = [
  { id: 1, title: "Fast. Hot. Cheaper!", titleAr: "سريع ساخن سعر أقل", color: "#1a1a2e", image: "🏍️" },
  { id: 2, title: "Sunday & Monday Deal", titleAr: "عرض الأحد والاثنين", color: "#2d1b00", image: "🎉" },
  { id: 3, title: "Family Box is Back!", titleAr: "وجبة العائلة عادت!", color: "#0d2818", image: "👨‍👩‍👧‍👦" },
];

const CAT_AR = {
  "Offers": "العروض", "Best Seller": "الأكثر مبيعاً", "Boxes": "الصناديق",
  "Chicken Burger": "برجر الدجاج", "Grilled": "المشويات", "Sides": "المقبلات", "Drinks": "المشروبات"
};

const R = RESTAURANT.color;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Tajawal:wght@400;500;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { display: none; }
  @keyframes logoIn { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideUpModal { from{transform:translateX(-50%) translateY(100%)} to{transform:translateX(-50%) translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes bounceIn { 0%{transform:scale(0)} 60%{transform:scale(1.15)} 100%{transform:scale(1)} }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
`;

function SplashScreen({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"absolute", inset:0, background:R, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:100 }}>
      <div style={{ animation:"logoIn 0.8s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div style={{ width:120, height:120, background:"rgba(255,255,255,0.15)", borderRadius:32, display:"flex", alignItems:"center", justifyContent:"center", fontSize:64, marginBottom:20, backdropFilter:"blur(10px)", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>🍔</div>
        <div style={{ textAlign:"center", color:"#fff", fontFamily:"'Bebas Neue',sans-serif", fontSize:38, letterSpacing:4 }}>FRESH BURGER</div>
        <div style={{ textAlign:"center", color:"rgba(255,255,255,0.6)", fontSize:12, letterSpacing:5, marginTop:4 }}>SINCE 2014</div>
      </div>
      <div style={{ position:"absolute", bottom:60, display:"flex", gap:6 }}>
        {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:3, background:"rgba(255,255,255,0.4)", animation:`shimmer 1s ease-in-out ${i*0.3}s infinite` }}/>)}
      </div>
    </div>
  );
}

function LangScreen({ onSelect }) {
  return (
    <div style={{ position:"absolute", inset:0, background:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, zIndex:99 }}>
      <div style={{ width:80, height:80, borderRadius:24, background:R, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, marginBottom:32, animation:"slideUp 0.5s ease both", boxShadow:`0 16px 40px ${R}44` }}>🍔</div>
      <div style={{ fontSize:22, fontWeight:700, color:"#1a1a1a", marginBottom:8, animation:"slideUp 0.5s 0.1s ease both" }}>Choose Language</div>
      <div style={{ fontSize:16, color:"#888", marginBottom:40, animation:"slideUp 0.5s 0.2s ease both" }}>اختر اللغة</div>
      <div style={{ width:"100%", maxWidth:340, display:"flex", flexDirection:"column", gap:12 }}>
        {[["عربي","AR",0.3],["English","EN",0.4]].map(([label,code,delay]) => (
          <button key={code} onClick={() => onSelect(code)} style={{ width:"100%", padding:"18px 24px", background:"#fff", border:"2px solid #e8e8e8", borderRadius:18, fontSize:17, fontWeight:700, color:"#1a1a1a", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", justifyContent:"space-between", animation:`slideUp 0.5s ${delay}s ease both`, transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=R; e.currentTarget.style.background="#fff5f5"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#e8e8e8"; e.currentTarget.style.background="#fff"; }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>{code === "AR" ? "🇸🇦" : "🇬🇧"}</span>
              {label}
            </div>
            <span style={{ width:30, height:30, borderRadius:"50%", background:"#f5f5f5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AuthScreen({ onDone, lang }) {
  const ar = lang === "AR";
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", phone:"", email:"" });

  return (
    <div dir={ar?"rtl":"ltr"} style={{ position:"absolute", inset:0, background:"#fff", display:"flex", flexDirection:"column", zIndex:98, fontFamily: ar ? "'Tajawal',sans-serif" : "inherit" }}>
      <div style={{ background:R, padding:"40px 24px 60px", textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🍔</div>
        <div style={{ color:"#fff", fontSize:20, fontWeight:800 }}>{ar ? "البرجر الطازج" : "Fresh Burger"}</div>
      </div>
      <div style={{ margin:"-28px 20px 0", background:"#fff", borderRadius:24, padding:24, boxShadow:"0 8px 32px rgba(0,0,0,0.1)", flex:1 }}>
        <div style={{ display:"flex", background:"#f5f5f5", borderRadius:14, padding:4, marginBottom:24 }}>
          {[["login", ar?"دخول":"Login"],["signup", ar?"تسجيل":"Sign Up"]].map(([m,label]) => (
            <button key={m} onClick={() => setMode(m)} style={{ flex:1, padding:"10px", borderRadius:11, border:"none", background:mode===m?"#fff":"transparent", color:mode===m?"#1a1a1a":"#888", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s" }}>{label}</button>
          ))}
        </div>

        {mode === "signup" && (
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#aaa", marginBottom:6 }}>{ar?"الاسم الكامل":"Full Name"}</div>
            <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder={ar?"محمد أحمد":"Mohammed Ahmed"} style={{ width:"100%", padding:"13px 16px", background:"#f8f8f8", border:"1.5px solid #f0f0f0", borderRadius:12, fontSize:14, outline:"none", fontFamily:"inherit" }}/>
          </div>
        )}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#aaa", marginBottom:6 }}>{ar?"رقم الجوال":"Phone Number"}</div>
          <input value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} placeholder="+966 5X XXX XXXX" type="tel" style={{ width:"100%", padding:"13px 16px", background:"#f8f8f8", border:"1.5px solid #f0f0f0", borderRadius:12, fontSize:14, outline:"none", fontFamily:"inherit" }}/>
        </div>
        {mode === "signup" && (
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#aaa", marginBottom:6 }}>{ar?"البريد الإلكتروني":"Email"}</div>
            <input value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="example@email.com" type="email" style={{ width:"100%", padding:"13px 16px", background:"#f8f8f8", border:"1.5px solid #f0f0f0", borderRadius:12, fontSize:14, outline:"none", fontFamily:"inherit" }}/>
          </div>
        )}
        <button onClick={onDone} style={{ width:"100%", padding:16, background:R, border:"none", borderRadius:14, color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", marginTop:8, fontFamily:"inherit" }}>
          {mode === "login" ? (ar?"دخول":"Login") : (ar?"إنشاء حساب":"Create Account")}
        </button>
        <button onClick={onDone} style={{ width:"100%", padding:12, background:"transparent", border:"none", color:"#aaa", fontSize:13, cursor:"pointer", marginTop:8, fontFamily:"inherit" }}>
          {ar?"تخطي":"Skip for now"}
        </button>
      </div>
    </div>
  );
}

function ItemModal({ item, onClose, onAdd, lang }) {
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [note, setNote] = useState("");
  const ar = lang === "AR";

  if (!item) return null;

  const sizes = [
    { label: "Small", labelAr: "صغير", price: item.price - 4 },
    { label: "Medium", labelAr: "وسط", price: item.price },
    { label: "Large", labelAr: "كبير", price: item.price + 5 },
  ];
  const options = ["Extra Sauce", "No Onions", "Extra Cheese", "Well Done"];
  const optionsAr = ["صوص إضافي", "بدون بصل", "جبن إضافي", "مطهو جيداً"];

  const currentPrice = selectedSize ? selectedSize.price : item.price;

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200 }}/>
      <div dir={ar?"rtl":"ltr"} style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"#fff", borderRadius:"24px 24px 0 0", zIndex:201, maxHeight:"90vh", overflowY:"auto", fontFamily: ar ? "'Tajawal',sans-serif" : "inherit" }}>
        <div style={{ animation:"slideUpModal 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <div style={{ height:220, background:`linear-gradient(135deg,${R}11,${R}33)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:100, position:"relative" }}>
            {item.image}
            <button onClick={onClose} style={{ position:"absolute", top:16, right:16, width:36, height:36, borderRadius:"50%", background:"#fff", border:"none", fontSize:18, cursor:"pointer" }}>✕</button>
            {item.tag && <div style={{ position:"absolute", top:16, left:16, background:R, color:"#fff", padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700 }}>{item.tag}</div>}
          </div>

          <div style={{ padding:"20px 20px 0" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
              <div style={{ fontSize:22, fontWeight:800, color:"#1a1a1a", flex:1 }}>{ar ? item.nameAr : item.name}</div>
              <div style={{ fontSize:22, fontWeight:800, color:R }}>﷼{currentPrice}.00</div>
            </div>
            {item.originalPrice && <div style={{ fontSize:13, color:"#aaa", textDecoration:"line-through", marginBottom:4 }}>﷼{item.originalPrice}.00</div>}
            <div style={{ fontSize:13, color:"#666", lineHeight:1.5, marginBottom:10 }}>{ar ? item.descAr : item.desc}</div>
            <div style={{ display:"flex", gap:14, fontSize:12, color:"#bbb", marginBottom:20 }}>
              <span>🔥 {item.cal} {ar?"سعر حراري":"Cal"}</span>
              <span>🚶 {Math.round(item.cal/4.3)} {ar?"دقيقة مشي":"min walk"}</span>
            </div>

            {/* Size */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>{ar?"الحجم":"Size"}</div>
              <div style={{ fontSize:12, color:"#aaa", marginBottom:10 }}>{ar?"اختر حجماً":"Choose a size"}</div>
              <div style={{ display:"flex", gap:8 }}>
                {sizes.map((sz,i) => (
                  <button key={i} onClick={() => setSelectedSize(sz)} style={{ flex:1, padding:"10px 8px", borderRadius:12, border:`2px solid ${selectedSize?.label===sz.label?R:"#e8e8e8"}`, background:selectedSize?.label===sz.label?`${R}10`:"#fff", cursor:"pointer", fontFamily:"inherit" }}>
                    <div style={{ fontSize:12, fontWeight:700, color:selectedSize?.label===sz.label?R:"#1a1a1a" }}>{ar?sz.labelAr:sz.label}</div>
                    <div style={{ fontSize:12, color:R, fontWeight:700, marginTop:2 }}>﷼{sz.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>{ar?"تخصيص":"Customize"}</div>
              <div style={{ fontSize:12, color:"#aaa", marginBottom:10 }}>{ar?"اختياري":"Optional"}</div>
              {options.map((opt,i) => (
                <label key={opt} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid #f5f5f5", cursor:"pointer" }}>
                  <div onClick={() => setSelectedOptions(prev => prev.includes(opt) ? prev.filter(o=>o!==opt) : [...prev,opt])} style={{ width:22, height:22, borderRadius:6, border:`2px solid ${selectedOptions.includes(opt)?R:"#ddd"}`, background:selectedOptions.includes(opt)?R:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer" }}>
                    {selectedOptions.includes(opt) && <span style={{ color:"#fff", fontSize:13 }}>✓</span>}
                  </div>
                  <span style={{ fontSize:14, color:"#1a1a1a" }}>{ar?optionsAr[i]:opt}</span>
                </label>
              ))}
            </div>

            {/* Notes */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>{ar?"ملاحظات":"Notes"}</div>
              <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={ar?"اكتب ملاحظتك...":"Write your note..."} style={{ width:"100%", padding:"12px 16px", border:"1.5px solid #e8e8e8", borderRadius:12, fontSize:14, color:"#1a1a1a", resize:"none", height:80, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
            </div>
          </div>

          <div style={{ padding:"16px 20px 32px", display:"flex", gap:12, alignItems:"center", borderTop:"1px solid #f5f5f5" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, background:"#f8f8f8", borderRadius:12, padding:"8px 16px" }}>
              <button onClick={() => setQty(q=>Math.max(1,q-1))} style={{ width:28, height:28, borderRadius:"50%", background:qty>1?R:"#e8e8e8", border:"none", color:qty>1?"#fff":"#aaa", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
              <span style={{ fontWeight:700, fontSize:16, minWidth:20, textAlign:"center" }}>{qty}</span>
              <button onClick={() => setQty(q=>q+1)} style={{ width:28, height:28, borderRadius:"50%", background:R, border:"none", color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
            </div>
            <button onClick={() => { onAdd(item, qty, currentPrice); onClose(); }} style={{ flex:1, padding:14, background:R, border:"none", borderRadius:14, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
              {ar?"إضافة":"Add"} · ﷼{(currentPrice*qty).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function HomeTab({ onItemPress, cart, lang }) {
  const [activeCat, setActiveCat] = useState("Offers");
  const [promoBanner, setPromoBanner] = useState(0);
  const [orderType, setOrderType] = useState("Pickup");
  const ar = lang === "AR";

  useEffect(() => {
    const t = setInterval(() => setPromoBanner(p => (p+1) % PROMOS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const totalItems = cart.reduce((s,c) => s+c.qty, 0);

  return (
    <div dir={ar?"rtl":"ltr"} style={{ flex:1, overflowY:"auto", paddingBottom: totalItems > 0 ? 160 : 90, fontFamily: ar ? "'Tajawal',sans-serif" : "inherit" }}>
      {/* Promo Banner */}
      <div style={{ margin:"16px 16px 0", borderRadius:18, overflow:"hidden", height:160, position:"relative" }}>
        {PROMOS.map((p,i) => (
          <div key={p.id} style={{ position:"absolute", inset:0, background:p.color, display:"flex", alignItems:"center", opacity:i===promoBanner?1:0, transition:"opacity 0.5s ease", borderRadius:18 }}>
            <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,${R}33,transparent)`, borderRadius:18 }}/>
            <div style={{ position:"absolute", [ar?"right":"left"]:20, bottom:20 }}>
              <div style={{ color:"#fff", fontWeight:800, fontSize:20, lineHeight:1.2 }}>{ar?p.titleAr:p.title}</div>
            </div>
            <div style={{ fontSize:80, position:"absolute", [ar?"left":"right"]:16, opacity:0.35 }}>{p.image}</div>
          </div>
        ))}
        <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", display:"flex", gap:5 }}>
          {PROMOS.map((_,i) => <div key={i} style={{ width:i===promoBanner?20:6, height:6, borderRadius:3, background:i===promoBanner?"#fff":"rgba(255,255,255,0.4)", transition:"all 0.3s" }}/>)}
        </div>
      </div>

      {/* Order Type */}
      <div style={{ display:"flex", gap:10, padding:"14px 16px 0", overflowX:"auto", scrollbarWidth:"none" }}>
        {[["🥡", ar?"استلام":"Pickup"], ["🛵", ar?"توصيل":"Delivery"], ["🚗", ar?"كار هوب":"Car Hop"]].map(([icon,label]) => (
          <button key={label} onClick={() => setOrderType(label)} style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"12px 20px", background:orderType===label?`${R}15`:"#f8f8f8", border:`1.5px solid ${orderType===label?R:"transparent"}`, borderRadius:16, cursor:"pointer", fontFamily:"inherit" }}>
            <span style={{ fontSize:24 }}>{icon}</span>
            <span style={{ fontSize:12, fontWeight:700, color:orderType===label?R:"#555" }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Category Nav */}
      <div style={{ display:"flex", gap:8, padding:"14px 16px 12px", overflowX:"auto", scrollbarWidth:"none", position:"sticky", top:0, background:"#fafafa", zIndex:10, borderBottom:"1px solid #f5f5f5" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCat(cat)} style={{ flexShrink:0, padding:"8px 16px", borderRadius:20, border:"none", background:activeCat===cat?R:"#f0f0f0", color:activeCat===cat?"#fff":"#555", fontSize:13, fontWeight:700, cursor:"pointer", transition:"all 0.2s", fontFamily:"inherit" }}>
            {ar ? CAT_AR[cat] : cat}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div style={{ padding:16 }}>
        <div style={{ fontSize:18, fontWeight:800, marginBottom:14, color:"#1a1a1a" }}>{ar ? CAT_AR[activeCat] : activeCat}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {(MENU[activeCat] || []).map(item => (
            <button key={item.id} onClick={() => onItemPress(item)} style={{ display:"flex", gap:14, background:"#fff", border:"1.5px solid #f0f0f0", borderRadius:18, padding:14, cursor:"pointer", textAlign:ar?"right":"left", width:"100%", position:"relative", overflow:"hidden", fontFamily:"inherit" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=R; e.currentTarget.style.background="#fff8f8"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#f0f0f0"; e.currentTarget.style.background="#fff"; }}>
              {item.tag && <div style={{ position:"absolute", top:10, [ar?"left":"right"]:10, background:item.tag.includes("OFF")?"#16a34a":R, color:"#fff", padding:"3px 8px", borderRadius:10, fontSize:10, fontWeight:700 }}>{item.tag}</div>}
              <div style={{ width:90, height:90, borderRadius:14, background:`linear-gradient(135deg,${R}11,${R}22)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:50, flexShrink:0 }}>{item.image}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:15, color:"#1a1a1a", marginBottom:4 }}>{ar ? item.nameAr : item.name}</div>
                <div style={{ fontSize:12, color:"#888", lineHeight:1.4, marginBottom:6, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{ar ? item.descAr : item.desc}</div>
                <div style={{ fontSize:11, color:"#bbb", marginBottom:6 }}>🔥 {item.cal} {ar?"سعر حراري":"Cal"}</div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <span style={{ fontWeight:800, fontSize:16, color:R }}>﷼{item.price}.00</span>
                    {item.originalPrice && <span style={{ fontSize:12, color:"#bbb", textDecoration:"line-through", marginLeft:6 }}>﷼{item.originalPrice}</span>}
                  </div>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:R, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:20 }}>+</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ lang }) {
  const ar = lang === "AR";
  const orders = [
    { id:"#1042", date: ar?"اليوم، ٢:٣٠ م":"Today, 2:30 PM", status:"Delivered", statusAr:"تم التوصيل", items: ar?"اكستريم تشيكن، فراي ملودد":"Xtreme Chicken, Loaded Fries", total:36 },
    { id:"#1038", date: ar?"أمس، ٧:١٥ م":"Yesterday, 7:15 PM", status:"Delivered", statusAr:"تم التوصيل", items: ar?"ميكس بوكس":"Mix Box", total:95 },
    { id:"#1031", date: ar?"الاثنين، ١:٠٠ م":"Mon, 1:00 PM", status:"Delivered", statusAr:"تم التوصيل", items: ar?"دبل سماش × ٢، مشروبات":"Double Smash × 2, Drinks", total:62 },
  ];
  return (
    <div dir={ar?"rtl":"ltr"} style={{ flex:1, overflowY:"auto", padding:"20px 16px 90px", fontFamily: ar ? "'Tajawal',sans-serif" : "inherit" }}>
      <div style={{ fontSize:20, fontWeight:800, marginBottom:20, color:"#1a1a1a" }}>{ar?"طلباتي":"My Orders"}</div>
      {orders.map(o => (
        <div key={o.id} style={{ background:"#fff", border:"1.5px solid #f0f0f0", borderRadius:18, padding:16, marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontWeight:700, fontSize:15 }}>{o.id}</span>
            <span style={{ background:"#d1fae5", color:"#065f46", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>{ar?o.statusAr:o.status}</span>
          </div>
          <div style={{ fontSize:13, color:"#888", marginBottom:4 }}>{o.items}</div>
          <div style={{ fontSize:12, color:"#bbb", marginBottom:12 }}>{o.date}</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontWeight:800, fontSize:16, color:R }}>﷼{o.total}.00</span>
            <button style={{ padding:"8px 16px", background:`${R}15`, border:`1px solid ${R}`, borderRadius:10, color:R, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>{ar?"إعادة الطلب":"Reorder"}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function RewardsTab({ lang }) {
  const ar = lang === "AR";
  const points = 1240;
  const nextReward = 2000;
  const rewards = [
    { name: ar?"فراي مجاني":"Free Fries", nameAr:"فراي مجاني", pts:500 },
    { name: ar?"مشروب مجاني":"Free Drink", nameAr:"مشروب مجاني", pts:800 },
    { name: ar?"برجر مجاني":"Free Burger", nameAr:"برجر مجاني", pts:1500 },
    { name: ar?"وجبة مجانية":"Free Meal", nameAr:"وجبة مجانية", pts:2000 },
  ];
  return (
    <div dir={ar?"rtl":"ltr"} style={{ flex:1, overflowY:"auto", padding:"20px 16px 90px", fontFamily: ar ? "'Tajawal',sans-serif" : "inherit" }}>
      <div style={{ fontSize:20, fontWeight:800, marginBottom:20, color:"#1a1a1a" }}>{ar?"المكافآت":"Rewards"}</div>
      <div style={{ background:`linear-gradient(135deg,${R},${RESTAURANT.colorDark})`, borderRadius:24, padding:24, marginBottom:20, color:"#fff" }}>
        <div style={{ fontSize:13, opacity:0.8, marginBottom:4 }}>{ar?"نقاطك":"Your Points"}</div>
        <div style={{ fontSize:48, fontWeight:900, marginBottom:4 }}>{points.toLocaleString()}</div>
        <div style={{ fontSize:13, opacity:0.7 }}>{nextReward-points} {ar?"نقطة للمكافأة التالية":"points to next reward"}</div>
        <div style={{ marginTop:14, background:"rgba(255,255,255,0.2)", borderRadius:10, height:8 }}>
          <div style={{ width:`${(points/nextReward)*100}%`, background:"#fff", borderRadius:10, height:"100%", transition:"width 1s ease" }}/>
        </div>
      </div>
      <div style={{ fontSize:16, fontWeight:700, marginBottom:12 }}>{ar?"المكافآت المتاحة":"Available Rewards"}</div>
      {rewards.map(r => (
        <div key={r.pts} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", background:"#fff", border:"1.5px solid #f0f0f0", borderRadius:16, marginBottom:10 }}>
          <div>
            <div style={{ fontWeight:700, fontSize:14 }}>{ar?r.nameAr:r.name}</div>
            <div style={{ fontSize:12, color:"#888", marginTop:2 }}>{r.pts} {ar?"نقطة":"points"}</div>
          </div>
          <button disabled={points<r.pts} style={{ padding:"8px 16px", background:points>=r.pts?R:"#f0f0f0", border:"none", borderRadius:10, color:points>=r.pts?"#fff":"#aaa", fontSize:13, fontWeight:700, cursor:points>=r.pts?"pointer":"not-allowed", fontFamily:"inherit" }}>
            {points>=r.pts ? (ar?"استبدال":"Redeem") : `${r.pts-points} ${ar?"نقطة":"more"}`}
          </button>
        </div>
      ))}
    </div>
  );
}

function AccountTab({ lang, onLogout }) {
  const ar = lang === "AR";
  const menuItems = [
    ["👤", ar?"حسابي":"My Account", ar?"تعديل الملف الشخصي":"Edit profile & address"],
    ["💳", ar?"المحفظة":"Wallet", ar?"الرصيد: ﷼٥٠.٠٠":"Balance: ﷼50.00"],
    ["⭐", ar?"النقاط":"Points", ar?"١٢٤٠ نقطة":"1,240 points"],
    ["📦", ar?"الطلبات":"Orders", ar?"عرض سجل الطلبات":"View order history"],
    ["🎁", ar?"رمز الإحالة":"Referral Code", ar?"شارك واكسب نقاطاً":"Share & earn points"],
    ["📍", ar?"الفروع":"Branches", ar?"أقرب فرع":"Find nearest branch"],
    ["💬", ar?"تواصل معنا":"Contact Us", ar?"المساعدة والدعم":"Help & support"],
    ["📄", ar?"الشروط والأحكام":"Terms & Conditions", ""],
    ["🌐", ar?"English":"عربي", ar?"Switch to English":"التبديل للعربية"],
  ];
  return (
    <div dir={ar?"rtl":"ltr"} style={{ flex:1, overflowY:"auto", paddingBottom:90, fontFamily: ar ? "'Tajawal',sans-serif" : "inherit" }}>
      <div style={{ background:R, padding:"28px 20px 50px" }}>
        <div style={{ fontSize:18, fontWeight:700, color:"#fff", textAlign:"center" }}>{ar?"الحساب":"Account"}</div>
      </div>
      <div style={{ margin:"-28px 16px 0", background:"#fff", borderRadius:20, padding:20, display:"flex", alignItems:"center", gap:14, border:"1px solid #f0f0f0", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ width:56, height:56, borderRadius:"50%", background:`${R}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>👤</div>
        <div>
          <div style={{ fontWeight:700, fontSize:16 }}>{ar?"محمد":"Mohammed"}</div>
          <div style={{ fontSize:13, color:"#888" }}>+966 50 000 0000</div>
        </div>
      </div>
      <div style={{ padding:"20px 16px 0" }}>
        {menuItems.map(([icon,label,sub]) => (
          <button key={label} style={{ width:"100%", display:"flex", alignItems:"center", gap:14, padding:"14px 0", background:"transparent", border:"none", borderBottom:"1px solid #f5f5f5", cursor:"pointer", textAlign:ar?"right":"left", fontFamily:"inherit" }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"#f8f8f8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:14, color:"#1a1a1a" }}>{label}</div>
              {sub && <div style={{ fontSize:12, color:"#888", marginTop:1 }}>{sub}</div>}
            </div>
            <span style={{ color:"#ccc", fontSize:18 }}>{ar?"‹":"›"}</span>
          </button>
        ))}

        {/* Logout */}
        <button onClick={onLogout} style={{ width:"100%", marginTop:20, padding:"14px", background:"#fee2e2", border:"1px solid #fecaca", borderRadius:14, color:"#ef4444", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          {ar?"تسجيل الخروج":"Log Out"}
        </button>

        <div style={{ marginTop:16, padding:"16px 0", display:"flex", gap:12 }}>
          {["Instagram","TikTok","Twitter"].map(s => (
            <button key={s} style={{ flex:1, padding:10, background:"#f8f8f8", border:"none", borderRadius:12, fontSize:12, fontWeight:600, color:"#555", cursor:"pointer", fontFamily:"inherit" }}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose, onIncrease, onDecrease, lang }) {
  const ar = lang === "AR";
  const total = cart.reduce((s,c) => s+c.price*c.qty, 0);
  const [ordered, setOrdered] = useState(false);
  const [status, setStatus] = useState(0);
  const [payMethod, setPayMethod] = useState("online");
  const [notes, setNotes] = useState("");

  const placeOrder = () => {
    setOrdered(true);
    setTimeout(() => setStatus(1), 3000);
    setTimeout(() => setStatus(2), 7000);
  };

  const steps = ar
    ? ["تم استلام الطلب","قيد التحضير 👨‍🍳","جاهز للاستلام 🥡"]
    : ["Order Received","Preparing 👨‍🍳","Ready for Pickup 🥡"];

  if (ordered) return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:300 }}/>
      <div dir={ar?"rtl":"ltr"} style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"#fff", borderRadius:"24px 24px 0 0", zIndex:301, padding:"32px 24px 48px", textAlign:"center", fontFamily: ar ? "'Tajawal',sans-serif" : "inherit" }}>
        <div style={{ fontSize:64, marginBottom:16, animation:"bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>✅</div>
        <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>{ar?"تم الطلب!":"Order Placed!"}</div>
        <div style={{ fontSize:14, color:"#888", marginBottom:28 }}>{ar?"وقت الاستلام المتوقع: ١٥-٢٠ دقيقة":"Est. pickup: 15-20 min"}</div>
        <div style={{ background:"#f8f8f8", borderRadius:20, padding:20, marginBottom:24 }}>
          {steps.map((step,i) => (
            <div key={step} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:i<2?16:0 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:i<=status?R:"#e8e8e8", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, transition:"all 0.5s", flexShrink:0 }}>{i<status?"✓":i===status?"●":"○"}</div>
              <div style={{ fontSize:14, fontWeight:i<=status?700:400, color:i<=status?"#1a1a1a":"#aaa", transition:"all 0.5s" }}>{step}</div>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{ width:"100%", padding:14, background:R, border:"none", borderRadius:14, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>{ar?"العودة للقائمة":"Back to Menu"}</button>
      </div>
    </>
  );

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:300 }}/>
      <div dir={ar?"rtl":"ltr"} style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"#fff", borderRadius:"24px 24px 0 0", zIndex:301, maxHeight:"85vh", overflowY:"auto", fontFamily: ar ? "'Tajawal',sans-serif" : "inherit" }}>
        <div style={{ animation:"slideUpModal 0.3s ease" }}>
          <div style={{ padding:"20px 20px 0", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontSize:20, fontWeight:800 }}>{ar?"طلبك":"Your Order"}</div>
            <button onClick={onClose} style={{ width:34, height:34, borderRadius:"50%", background:"#f5f5f5", border:"none", fontSize:16, cursor:"pointer" }}>✕</button>
          </div>
          <div style={{ padding:"0 20px" }}>
            {cart.map(item => (
              <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid #f5f5f5" }}>
                <div style={{ fontSize:32 }}>{item.image}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:14 }}>{ar?item.nameAr:item.name}</div>
                  <div style={{ fontWeight:700, fontSize:14, color:R }}>﷼{(item.price*item.qty).toFixed(2)}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <button onClick={() => onDecrease(item.id)} style={{ width:30, height:30, borderRadius:"50%", background:"#f5f5f5", border:"none", fontSize:18, cursor:"pointer" }}>−</button>
                  <span style={{ fontWeight:700, fontSize:15, minWidth:20, textAlign:"center" }}>{item.qty}</span>
                  <button onClick={() => onIncrease(item.id)} style={{ width:30, height:30, borderRadius:"50%", background:R, border:"none", color:"#fff", fontSize:18, cursor:"pointer" }}>+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method */}
          <div style={{ padding:"16px 20px 0" }}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>{ar?"طريقة الدفع":"Payment Method"}</div>
            <div style={{ display:"flex", gap:8 }}>
              {[["online", ar?"دفع إلكتروني":"Online Payment", "💳"],["cash", ar?"نقداً":"Cash", "💵"]].map(([val,label,icon]) => (
                <button key={val} onClick={() => setPayMethod(val)} style={{ flex:1, padding:"12px", borderRadius:12, border:`2px solid ${payMethod===val?R:"#e8e8e8"}`, background:payMethod===val?`${R}10`:"#fff", cursor:"pointer", fontFamily:"inherit" }}>
                  <div style={{ fontSize:20, marginBottom:4 }}>{icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:payMethod===val?R:"#555" }}>{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ padding:"14px 20px 0" }}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:8 }}>{ar?"ملاحظات":"Notes"}</div>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder={ar?"مثل: اتركوا الطلب عند الباب...":"e.g. Leave at door, Call me..."} style={{ width:"100%", padding:"12px 16px", border:"1.5px solid #e8e8e8", borderRadius:12, fontSize:13, resize:"none", height:64, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          </div>

          <div style={{ padding:"14px 20px", background:"#f8f8f8", margin:"14px 20px", borderRadius:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#888", marginBottom:5 }}><span>{ar?"المجموع الفرعي":"Subtotal"}</span><span>﷼{total.toFixed(2)}</span></div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#888", marginBottom:5 }}><span>{ar?"التوصيل":"Delivery"}</span><span style={{ color:"#10b981", fontWeight:700 }}>{ar?"مجاني":"Free"}</span></div>
            <div style={{ display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:16 }}><span>{ar?"الإجمالي":"Total"}</span><span style={{ color:R }}>﷼{total.toFixed(2)}</span></div>
          </div>
          <div style={{ padding:"0 20px 40px" }}>
            <button onClick={placeOrder} style={{ width:"100%", padding:16, background:R, border:"none", borderRadius:16, color:"#fff", fontSize:16, fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}>
              🥡 {ar?"تأكيد الطلب":"Place Order"} · ﷼{total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [lang, setLang] = useState("EN");
  const [tab, setTab] = useState("home");
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const ar = lang === "AR";

  const addToCart = (item, qty=1, price) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id===item.id ? {...c, qty:c.qty+qty} : c);
      return [...prev, {...item, qty, price: price || item.price}];
    });
  };

  const increase = id => setCart(prev => prev.map(c => c.id===id ? {...c,qty:c.qty+1} : c));
  const decrease = id => setCart(prev => {
    const item = prev.find(c => c.id===id);
    if (item?.qty===1) return prev.filter(c => c.id!==id);
    return prev.map(c => c.id===id ? {...c,qty:c.qty-1} : c);
  });

  const totalItems = cart.reduce((s,c) => s+c.qty, 0);
  const totalPrice = cart.reduce((s,c) => s+c.price*c.qty, 0);

  const TABS = [
    { id:"home",    icon:"🏠", label:"Home",    labelAr:"الرئيسية" },
    { id:"orders",  icon:"📦", label:"Orders",  labelAr:"الطلبات" },
    { id:"rewards", icon:"🎁", label:"Rewards", labelAr:"المكافآت" },
    { id:"account", icon:"👤", label:"Account", labelAr:"حسابي" },
  ];

  return (
    <div style={{ width:"100%", maxWidth:430, margin:"0 auto", height:"100vh", background:"#fafafa", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden", fontFamily:"'SF Pro Display',-apple-system,sans-serif" }}>
      <style>{CSS}</style>

      {screen==="splash" && <SplashScreen onDone={() => setScreen("lang")}/>}
      {screen==="lang" && <LangScreen onSelect={code => { setLang(code); setScreen("auth"); }}/>}
      {screen==="auth" && <AuthScreen onDone={() => setScreen("main")} lang={lang}/>}

      {screen==="main" && (
        <>
          {/* Header */}
          <div dir={ar?"rtl":"ltr"} style={{ background:R, padding:"16px 20px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:16, fontFamily: ar ? "'Tajawal',sans-serif" : "inherit" }}>
                {ar ? RESTAURANT.nameAr : RESTAURANT.name}
              </div>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:11, marginTop:1 }}>
                {ar ? "● مفتوح الآن" : "● Open Now"}
              </div>
            </div>
            <button onClick={() => setCartOpen(true)} style={{ position:"relative", background:"rgba(255,255,255,0.2)", border:"none", borderRadius:12, padding:"8px 12px", cursor:"pointer" }}>
              <span style={{ fontSize:20 }}>🛍️</span>
              {totalItems>0 && <div style={{ position:"absolute", top:-4, right:-4, width:18, height:18, borderRadius:"50%", background:"#fff", color:R, fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{totalItems}</div>}
            </button>
          </div>

          {/* Content */}
          <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
            {tab==="home"    && <HomeTab onItemPress={setSelectedItem} cart={cart} lang={lang}/>}
            {tab==="orders"  && <OrdersTab lang={lang}/>}
            {tab==="rewards" && <RewardsTab lang={lang}/>}
            {tab==="account" && <AccountTab lang={lang} onLogout={() => setScreen("auth")}/>}
          </div>

          {/* Cart Bar */}
          {totalItems>0 && tab==="home" && (
            <div style={{ position:"absolute", bottom:72, left:12, right:12, zIndex:20 }}>
              <button onClick={() => setCartOpen(true)} style={{ width:"100%", padding:"14px 20px", background:R, border:"none", borderRadius:16, color:"#fff", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", fontSize:14, fontWeight:700, boxShadow:`0 8px 24px ${R}66`, fontFamily: ar ? "'Tajawal',sans-serif" : "inherit" }}>
                <span style={{ background:"rgba(255,255,255,0.2)", borderRadius:20, padding:"3px 12px" }}>{totalItems} {ar?"منتج":"item"}{totalItems>1&&!ar?"s":""}</span>
                <span>{ar?"عرض الطلب":"View Order"}</span>
                <span>﷼{totalPrice.toFixed(2)}</span>
              </button>
            </div>
          )}

          {/* Bottom Nav */}
          <div dir={ar?"rtl":"ltr"} style={{ background:"#fff", borderTop:"1px solid #f0f0f0", display:"flex", padding:"8px 0 16px", position:"relative", zIndex:10 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"4px 0", background:"transparent", border:"none", cursor:"pointer", fontFamily: ar ? "'Tajawal',sans-serif" : "inherit" }}>
                <span style={{ fontSize:22 }}>{t.icon}</span>
                <span style={{ fontSize:10, fontWeight:600, color:tab===t.id?R:"#aaa" }}>{ar?t.labelAr:t.label}</span>
                {tab===t.id && <div style={{ width:4, height:4, borderRadius:"50%", background:R }}/>}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={addToCart} lang={lang}/>}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onIncrease={increase} onDecrease={decrease} lang={lang}/>}
    </div>
  );
}
