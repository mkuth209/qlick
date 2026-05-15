import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { PRESETS, FONTS } from '../lib/constants.js'

const G = '#C9A84C'
const SWATCHES = ['#C9A84C','#FF3B30','#1A1A1A','#2D6A4F','#BFA060','#FF6B35','#6366F1','#0EA5E9','#E11D48','#D97706','#7C3AED','#059669']

// ── Live Preview ──────────────────────────────────────────────────────────────
function LivePreview({ design, restaurant }) {
  const isDark = design.theme === 'dark'
  const muted = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const heroBg = design.heroStyle === 'gradient'
    ? `linear-gradient(135deg,${design.primary}22,${design.bg})`
    : design.heroStyle === 'diagonal'
    ? `linear-gradient(160deg,${design.primary}33,${design.bg})`
    : design.bg
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(design.font)}:wght@400;700&display=swap`
  const sampleItems = [
    { emoji:'🍗', name:'Crispy Broast', desc:'Golden fried, signature spices', price:32 },
    { emoji:'🍤', name:'Garlic Shrimp', desc:'Jumbo shrimp, garlic butter', price:48 },
    { emoji:'🍟', name:'Loaded Fries', desc:'Cheese, jalapeños, crispy', price:22 },
    { emoji:'🥤', name:'Fresh Lemonade', desc:'Mint, ice, freshly squeezed', price:14 },
  ]
  const gridStyle = `
.items{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.item{background:${design.surface};border:1px solid ${border};border-radius:14px;padding:16px;text-align:center;}
.item-emoji{font-size:40px;margin-bottom:10px;display:block;}
.item-name{font-size:14px;font-weight:700;margin-bottom:4px;}
.item-desc{font-size:11px;color:${muted};margin-bottom:10px;line-height:1.4;}
.item-footer{display:flex;align-items:center;justify-content:space-between;}`
  const listStyle = `
.items{display:flex;flex-direction:column;gap:10px;}
.item{background:${design.surface};border:1px solid ${border};border-radius:14px;padding:14px;display:flex;gap:14px;align-items:center;}
.item-emoji{font-size:38px;flex-shrink:0;}
.item-body{flex:1;}
.item-name{font-size:14px;font-weight:700;margin-bottom:3px;}
.item-desc{font-size:12px;color:${muted};line-height:1.4;margin-bottom:6px;}
.item-footer{display:flex;align-items:center;justify-content:space-between;}`
  const isGrid = design.layout === 'grid'
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<link href="${fontUrl}" rel="stylesheet"/>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{background:${design.bg};color:${design.text};font-family:'${design.font}',Georgia,serif;min-height:100vh;}
.hero{padding:48px 20px 36px;background:${heroBg};text-align:center;position:relative;overflow:hidden;}
${design.heroStyle==='pattern'?`.hero::before{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,${design.primary}15 0,${design.primary}15 1px,transparent 0,transparent 32px),repeating-linear-gradient(90deg,${design.primary}15 0,${design.primary}15 1px,transparent 0,transparent 32px);background-size:32px 32px;}`:''}
.badge{display:inline-block;background:${design.primary}22;border:1px solid ${design.primary}44;color:${design.primary};border-radius:20px;padding:5px 14px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:18px;}
.hero h1{font-size:32px;font-weight:700;line-height:1.1;margin-bottom:10px;}
.meta{font-size:13px;color:${muted};}
.cat-nav{display:flex;overflow-x:auto;border-bottom:1px solid ${border};background:${design.bg};padding:0 16px;scrollbar-width:none;}
.cat-btn{padding:12px 18px;font-size:13px;font-weight:700;color:${muted};border:none;background:transparent;border-bottom:2px solid transparent;white-space:nowrap;font-family:'${design.font}',serif;}
.cat-btn.active{color:${design.primary};border-bottom-color:${design.primary};}
.menu{padding:20px 16px;max-width:600px;margin:0 auto;}
.cat-title{font-size:18px;font-weight:700;margin-bottom:14px;}
${isGrid ? gridStyle : listStyle}
.price{font-size:15px;font-weight:700;color:${design.primary};}
.add-btn{background:${design.primary};color:${isDark?'#000':'#fff'};border:none;border-radius:20px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;}
.cart-bar{position:fixed;bottom:16px;left:16px;right:16px;background:${design.primary};border-radius:14px;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;color:${isDark?'#000':'#fff'};font-weight:700;font-size:14px;}
.cart-count{background:rgba(0,0,0,0.15);border-radius:20px;padding:3px 10px;font-size:12px;}
</style></head><body>
<div class="hero"><div style="position:relative">
<div class="badge">🥡 Pickup Only</div>
<h1>${restaurant.name||'Restaurant Name'}</h1>
<div class="meta">⭐ 4.8 · ${restaurant.cuisine||'Cuisine'} · 15-20 min pickup</div>
</div></div>
<div class="cat-nav"><button class="cat-btn active">Popular</button><button class="cat-btn">Mains</button><button class="cat-btn">Sides</button><button class="cat-btn">Drinks</button></div>
<div class="menu"><div class="cat-title">Popular</div>
<div class="items">${sampleItems.map(item => isGrid
  ? `<div class="item"><span class="item-emoji">${item.emoji}</span><div class="item-name">${item.name}</div><div class="item-desc">${item.desc}</div><div class="item-footer"><span class="price">${item.price} SAR</span><button class="add-btn">+</button></div></div>`
  : `<div class="item"><div class="item-emoji">${item.emoji}</div><div class="item-body"><div class="item-name">${item.name}</div><div class="item-desc">${item.desc}</div><div class="item-footer"><span class="price">${item.price} SAR</span><button class="add-btn">+ Add</button></div></div></div>`
).join('')}</div></div>
<div class="cart-bar"><span class="cart-count">2 items</span><span>View Order</span><span>80 SAR</span></div>
</body></html>`
  return <iframe srcDoc={html} style={{width:'100%',height:'100%',border:'none'}} sandbox="allow-scripts" title="Preview"/>
}

// ── Color Picker ──────────────────────────────────────────────────────────────
function ColorPicker({ label, value, onChange }) {
  return (
    <div style={{marginBottom:16}}>
      <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.1em',textTransform:'uppercase',color:'#555',marginBottom:7}}>{label}</div>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
        <div style={{width:30,height:30,borderRadius:7,background:value,border:'2px solid #2a2a2a',flexShrink:0}}/>
        <input type="color" value={value} onChange={e=>onChange(e.target.value)} style={{width:30,height:30,borderRadius:7,border:'1px solid #2a2a2a',background:'none',cursor:'pointer',padding:2}}/>
        <input type="text" value={value} onChange={e=>onChange(e.target.value)} style={{flex:1,padding:'7px 10px',background:'#141414',border:'1px solid #252525',borderRadius:8,color:'#f0f0f0',fontSize:12,fontFamily:'monospace',outline:'none'}}/>
      </div>
      <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
        {SWATCHES.map(c=><div key={c} onClick={()=>onChange(c)} style={{width:20,height:20,borderRadius:5,background:c,cursor:'pointer',border:value===c?'2px solid #fff':'2px solid transparent'}}/>)}
      </div>
    </div>
  )
}

const inp = (extra={}) => ({ width:'100%', padding:'10px 14px', background:'#141414', border:'1px solid #252525', borderRadius:10, color:'#f0f0f0', fontSize:14, outline:'none', fontFamily:'inherit', boxSizing:'border-box', ...extra })

// ── Main ──────────────────────────────────────────────────────────────────────
export default function NewRestaurant() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // 0=info, 1=design, 2=publish
  const [saving, setSaving] = useState(false)

  const [info, setInfo] = useState({ name:'', cuisine:'', tagline:'', description:'', address:'', phone:'', hours:'', pickupTime:'15-20', currency:'SAR' })
  const [design, setDesign] = useState(PRESETS[0])
  const [designPanel, setDesignPanel] = useState('presets')

  const upInfo = k => e => setInfo(i=>({...i,[k]:e.target.value}))
  const upD = k => v => setDesign(d=>({...d,[k]:v}))

  const slug = info.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')

  const publish = async () => {
    if (!info.name || !info.cuisine) { alert('Please fill in name and cuisine.'); setStep(0); return }
    setSaving(true)
    const { data: rest, error } = await supabase.from('restaurants').insert({
      name: info.name, slug, cuisine: info.cuisine, tagline: info.tagline,
      description: info.description, address: info.address, phone: info.phone,
      hours: info.hours, pickup_time: info.pickupTime, currency: info.currency,
      design, status: 'active', emoji: design.emoji || '🏪',
    }).select().single()
    if (error) { alert('Error: ' + error.message); setSaving(false); return }
    navigate('/admin')
  }

  const STEPS = ['Restaurant Info','Design App','Review & Publish']

  return (
    <div style={{minHeight:'100vh',background:'#080808',color:'#f0f0f0',fontFamily:"'SF Pro Display',-apple-system,sans-serif",display:'flex',flexDirection:'column'}}>

      {/* Topbar */}
      <div style={{padding:'13px 24px',borderBottom:'1px solid #161616',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#080808'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <a href="/admin" style={{color:'#555',textDecoration:'none',fontSize:13}}>← Admin</a>
          <span style={{color:'#2a2a2a'}}>/</span>
          <span style={{fontSize:13,fontWeight:700,color:'#f0f0f0'}}>New Restaurant</span>
        </div>
        {/* Step indicator */}
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          {STEPS.map((s,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:6}}>
              <div onClick={()=>i<step&&setStep(i)} style={{padding:'5px 14px',borderRadius:20,fontSize:12,fontWeight:700,background:step===i?G:step>i?'rgba(201,168,76,0.15)':'#141414',color:step===i?'#0C0B07':step>i?G:'#444',cursor:i<step?'pointer':'default',border:`1px solid ${step>=i?G:'#252525'}`}}>{step>i?'✓ ':''}{s}</div>
              {i<STEPS.length-1&&<div style={{width:20,height:1,background:'#252525'}}/>}
            </div>
          ))}
        </div>
        <div style={{width:80}}/>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden',height:'calc(100vh - 57px)'}}>

        {/* ── STEP 0: INFO ── */}
        {step===0&&(
          <div style={{maxWidth:560,width:'100%',margin:'0 auto',padding:'40px 28px',overflowY:'auto'}}>
            <div style={{marginBottom:32}}>
              <div style={{fontSize:24,fontWeight:800,letterSpacing:'-0.03em',marginBottom:6}}>Restaurant Info</div>
              <div style={{fontSize:14,color:'#555'}}>Tell us about the restaurant — we'll build the app around it.</div>
            </div>
            {/* Logo Upload */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',color:'#555',marginBottom:7}}>Restaurant Logo</div>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:72,height:72,borderRadius:18,background:'#141414',border:'2px dashed #2a2a2a',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0}}>
                  {info.logoUrl ? <img src={info.logoUrl} alt="logo" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{fontSize:32}}>🍔</span>}
                </div>
                <div style={{flex:1}}>
                  <label style={{display:'block',padding:'10px 16px',background:'#141414',border:'1.5px solid #2a2a2a',borderRadius:10,color:'#888',fontSize:13,fontWeight:600,cursor:'pointer',textAlign:'center'}}>
                    📸 Upload Logo
                    <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>{
                      const file=e.target.files[0];
                      if(file){
                        const reader=new FileReader();
                        reader.onload=ev=>setInfo(i=>({...i,logoUrl:ev.target.result}));
                        reader.readAsDataURL(file);
                      }
                    }}/>
                  </label>
                  <div style={{fontSize:11,color:'#444',marginTop:6,textAlign:'center'}}>PNG, JPG up to 5MB</div>
                </div>
              </div>
            </div>

            {[['name','Restaurant Name *','e.g. Al Nakheel, Burger Lab'],['cuisine','Cuisine Type *','e.g. Fried Chicken, Saudi, Sushi'],['tagline','Tagline','e.g. Crispy. Golden. Perfect.'],['address','Address','123 Tahlia St, Riyadh'],['phone','Phone','+966 50 000 0000'],['hours','Opening Hours','Daily 10:00 AM – 12:00 AM'],['pickupTime','Pickup Time (min)','15-20']].map(([k,label,ph])=>(
              <div key={k} style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',color:'#555',marginBottom:7}}>{label}</div>
<div style={{marginBottom:20}}>
  <div style={{fontSize:11,fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',color:'#555',marginBottom:7}}>Restaurant Logo</div>
  <div style={{display:'flex',alignItems:'center',gap:14}}>
    <div style={{width:72,height:72,borderRadius:18,background:'#141414',border:'2px dashed #2a2a2a',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0}}>
      {info.logoUrl ? <img src={info.logoUrl} alt="logo" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{fontSize:28}}>🍔</span>}
    </div>
    <label style={{display:'block',padding:'10px 16px',background:'#141414',border:'1.5px solid #2a2a2a',borderRadius:10,color:'#888',fontSize:13,fontWeight:600,cursor:'pointer',textAlign:'center'}}>
      📸 Upload Logo
      <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>{const file=e.target.files[0];if(file){const reader=new FileReader();reader.onload=ev=>setInfo(i=>({...i,logoUrl:ev.target.result}));reader.readAsDataURL(file);}}}/>
    </label>
  </div>
</div>

                <input style={inp()} placeholder={ph} value={info[k]} onChange={upInfo(k)}/>
              </div>
            ))}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',color:'#555',marginBottom:7}}>Description</div>
              <textarea style={inp({minHeight:80,resize:'vertical'})} placeholder="Brief story about the restaurant…" value={info.description} onChange={upInfo('description')}/>
            </div>
            <div style={{marginBottom:28}}>
              <div style={{fontSize:11,fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',color:'#555',marginBottom:8}}>Currency</div>
              <div style={{display:'flex',gap:8}}>
                {['SAR','USD','EUR','AED'].map(c=>(
                  <button key={c} onClick={()=>setInfo(i=>({...i,currency:c}))} style={{flex:1,padding:'9px 0',borderRadius:9,border:'1.5px solid',borderColor:info.currency===c?G:'#252525',background:info.currency===c?`${G}18`:'#141414',color:info.currency===c?G:'#555',fontSize:12,fontWeight:700,cursor:'pointer'}}>{c}</button>
                ))}
              </div>
            </div>
            <button onClick={()=>{if(!info.name||!info.cuisine){alert('Name and cuisine required');return}setStep(1)}} style={{width:'100%',padding:'13px',background:`linear-gradient(135deg,${G},#E8C06A)`,border:'none',borderRadius:12,color:'#0C0B07',fontSize:15,fontWeight:800,cursor:'pointer'}}>
              Next: Design the App →
            </button>
          </div>
        )}

        {/* ── STEP 1: DESIGN ── */}
        {step===1&&(
          <>
            {/* Controls */}
            <div style={{width:280,minWidth:280,borderRight:'1px solid #161616',display:'flex',flexDirection:'column',overflow:'hidden'}}>
              {/* Panel tabs */}
              <div style={{display:'flex',borderBottom:'1px solid #161616',background:'#0c0c0c'}}>
                {[{id:'presets',icon:'🎨',label:'Presets'},{id:'colors',icon:'🖌️',label:'Colors'},{id:'font',icon:'Aa',label:'Font'},{id:'layout',icon:'⊞',label:'Layout'},{id:'hero',icon:'🖼️',label:'Hero'}].map(p=>(
                  <button key={p.id} onClick={()=>setDesignPanel(p.id)} style={{flex:1,padding:'9px 2px',background:'transparent',border:'none',borderBottom:designPanel===p.id?`2px solid ${G}`:'2px solid transparent',color:designPanel===p.id?G:'#444',fontSize:'9px',fontWeight:800,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:2,letterSpacing:'0.04em',textTransform:'uppercase'}}>
                    <span style={{fontSize:13}}>{p.icon}</span><span>{p.label}</span>
                  </button>
                ))}
              </div>
              <div style={{flex:1,overflowY:'auto',padding:'18px 16px'}}>
                {/* Preview: restaurant name reminder */}
                <div style={{marginBottom:16,padding:'10px 14px',background:'#111',borderRadius:10,border:'1px solid #1e1e1e',fontSize:12,color:'#666'}}>
                  Designing for: <span style={{color:'#f0f0f0',fontWeight:700}}>{info.name}</span>
                </div>

                {designPanel==='presets'&&(
                  <div style={{display:'flex',flexDirection:'column',gap:7}}>
                    {PRESETS.map(p=>(
                      <button key={p.id} onClick={()=>setDesign(p)} style={{padding:'11px 13px',background:design.id===p.id?`${G}18`:'#111',border:`1.5px solid ${design.id===p.id?G:'#1e1e1e'}`,borderRadius:11,cursor:'pointer',display:'flex',alignItems:'center',gap:10,textAlign:'left'}}>
                        <div style={{width:34,height:34,borderRadius:8,background:p.bg,border:'1px solid #2a2a2a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{p.emoji}</div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:700,fontSize:13,color:design.id===p.id?G:'#f0f0f0',marginBottom:3}}>{p.name}</div>
                          <div style={{display:'flex',gap:4}}>
                            {[p.bg,p.primary,p.surface].map((c,i)=><div key={i} style={{width:11,height:11,borderRadius:3,background:c,border:'1px solid #2a2a2a'}}/>)}
                            <span style={{fontSize:9,color:'#444',marginLeft:3}}>{p.font.split(' ')[0]}</span>
                          </div>
                        </div>
                        {design.id===p.id&&<span style={{color:G,fontSize:14}}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}

                {designPanel==='colors'&&(
                  <>
                    <div style={{marginBottom:18}}>
                      <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.1em',textTransform:'uppercase',color:'#555',marginBottom:8}}>Mode</div>
                      <div style={{display:'flex',gap:8}}>
                        {['dark','light'].map(t=>(
                          <button key={t} onClick={()=>setDesign(d=>({...d,theme:t,bg:t==='dark'?'#0D0B07':'#FAFAF8',surface:t==='dark'?'#161310':'#FFFFFF',text:t==='dark'?'#F5EDD8':'#1A1A1A'}))} style={{flex:1,padding:'8px 0',borderRadius:9,border:'1.5px solid',borderColor:design.theme===t?G:'#252525',background:design.theme===t?`${G}18`:'#111',color:design.theme===t?G:'#555',fontSize:12,fontWeight:700,cursor:'pointer'}}>
                            {t==='dark'?'🌙 Dark':'☀️ Light'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <ColorPicker label="Accent Color" value={design.primary} onChange={upD('primary')}/>
                    <ColorPicker label="Background" value={design.bg} onChange={upD('bg')}/>
                    <ColorPicker label="Card Surface" value={design.surface} onChange={upD('surface')}/>
                    <ColorPicker label="Text Color" value={design.text} onChange={upD('text')}/>
                  </>
                )}

                {designPanel==='font'&&(
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    {FONTS.map(f=>(
                      <button key={f} onClick={()=>upD('font')(f)} style={{padding:'11px 14px',background:design.font===f?`${G}18`:'#111',border:`1.5px solid ${design.font===f?G:'#1e1e1e'}`,borderRadius:10,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <span style={{fontSize:14,color:design.font===f?G:'#f0f0f0'}}>{f}</span>
                        {design.font===f&&<span style={{color:G,fontSize:12}}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}

                {designPanel==='layout'&&(
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                    {[{id:'grid',label:'Grid',icon:'⊞',desc:'2-col cards'},{id:'list',label:'List',icon:'≡',desc:'Rows'},{id:'minimal',label:'Minimal',icon:'—',desc:'Clean lines'},{id:'bold',label:'Bold',icon:'█',desc:'Full width'}].map(l=>(
                      <button key={l.id} onClick={()=>upD('layout')(l.id)} style={{padding:'14px 10px',background:design.layout===l.id?`${G}18`:'#111',border:`1.5px solid ${design.layout===l.id?G:'#1e1e1e'}`,borderRadius:11,cursor:'pointer',textAlign:'center'}}>
                        <div style={{fontSize:22,marginBottom:5,color:design.layout===l.id?G:'#555'}}>{l.icon}</div>
                        <div style={{fontSize:12,fontWeight:700,color:design.layout===l.id?G:'#f0f0f0',marginBottom:2}}>{l.label}</div>
                        <div style={{fontSize:10,color:'#444'}}>{l.desc}</div>
                      </button>
                    ))}
                  </div>
                )}

                {designPanel==='hero'&&(
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {[{id:'gradient',label:'Gradient',desc:'Soft accent wash'},{id:'pattern',label:'Grid Pattern',desc:'Geometric grid'},{id:'solid',label:'Solid',desc:'Clean only'},{id:'diagonal',label:'Diagonal',desc:'Angled sweep'}].map(h=>(
                      <button key={h.id} onClick={()=>upD('heroStyle')(h.id)} style={{padding:'13px 14px',background:design.heroStyle===h.id?`${G}18`:'#111',border:`1.5px solid ${design.heroStyle===h.id?G:'#1e1e1e'}`,borderRadius:11,cursor:'pointer',display:'flex',alignItems:'center',gap:12}}>
                        <div style={{width:38,height:26,borderRadius:6,background:h.id==='gradient'?`linear-gradient(135deg,${design.primary}44,${design.bg})`:h.id==='diagonal'?`linear-gradient(160deg,${design.primary}55,${design.bg})`:design.bg,border:'1px solid #2a2a2a',flexShrink:0}}/>
                        <div style={{textAlign:'left'}}>
                          <div style={{fontWeight:700,fontSize:13,color:design.heroStyle===h.id?G:'#f0f0f0',marginBottom:2}}>{h.label}</div>
                          <div style={{fontSize:10,color:'#444'}}>{h.desc}</div>
                        </div>
                        {design.heroStyle===h.id&&<span style={{marginLeft:'auto',color:G,fontSize:12}}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom nav */}
              <div style={{padding:'14px 16px',borderTop:'1px solid #161616',display:'flex',gap:8}}>
                <button onClick={()=>setStep(0)} style={{padding:'10px 16px',background:'#141414',border:'1px solid #252525',borderRadius:10,color:'#777',fontSize:13,fontWeight:700,cursor:'pointer'}}>← Back</button>
                <button onClick={()=>setStep(2)} style={{flex:1,padding:'10px',background:`linear-gradient(135deg,${G},#E8C06A)`,border:'none',borderRadius:10,color:'#0C0B07',fontSize:13,fontWeight:800,cursor:'pointer'}}>Review & Publish →</button>
              </div>
            </div>

            {/* Live Preview */}
            <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
              <div style={{padding:'10px 20px',borderBottom:'1px solid #161616',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#080808'}}>
                <div style={{fontSize:11,color:'#444',fontFamily:'monospace'}}>qlick.sa/<span style={{color:'#888'}}>{slug||'restaurant-name'}</span></div>
                <div style={{fontSize:11,color:'#333'}}>Live Preview</div>
              </div>
              <div style={{flex:1,overflow:'hidden',display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'24px 0 0',background:'#050505'}}>
                <div style={{width:375,height:'calc(100% - 24px)',borderRadius:'20px 20px 0 0',overflow:'hidden',boxShadow:'0 -8px 40px rgba(0,0,0,0.6)',border:'1px solid #252525',borderBottom:'none'}}>
                  <LivePreview design={design} restaurant={info}/>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── STEP 2: REVIEW & PUBLISH ── */}
        {step===2&&(
          <div style={{maxWidth:560,width:'100%',margin:'0 auto',padding:'40px 28px',overflowY:'auto'}}>
            <div style={{marginBottom:32}}>
              <div style={{fontSize:24,fontWeight:800,letterSpacing:'-0.03em',marginBottom:6}}>Ready to publish</div>
              <div style={{fontSize:14,color:'#555'}}>Review everything before going live.</div>
            </div>

            {/* Summary cards */}
            <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:16,padding:22,marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#555',marginBottom:14}}>Restaurant Info</div>
              {[['Name',info.name],['Cuisine',info.cuisine],['Tagline',info.tagline||'—'],['Address',info.address||'—'],['Phone',info.phone||'—'],['Hours',info.hours||'—'],['Pickup Time',info.pickupTime+' min'],['Currency',info.currency]].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #161616',fontSize:13}}>
                  <span style={{color:'#555'}}>{k}</span><span style={{color:'#f0f0f0',fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:16,padding:22,marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#555',marginBottom:14}}>Design</div>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:44,height:44,borderRadius:11,background:design.bg,border:'2px solid #252525',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{design.emoji}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{design.name||'Custom Design'}</div>
                  <div style={{display:'flex',gap:6,alignItems:'center'}}>
                    {[design.bg,design.primary,design.surface].map((c,i)=><div key={i} style={{width:16,height:16,borderRadius:4,background:c,border:'1px solid #2a2a2a'}}/>)}
                    <span style={{fontSize:11,color:'#555'}}>{design.font} · {design.layout} · {design.heroStyle}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:16,padding:22,marginBottom:28}}>
              <div style={{fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#555',marginBottom:14}}>Your Links</div>
              {[['📱 Customer App',`qlick.sa/${slug}`],['📊 Owner Dashboard',`qlick.sa/${slug}/dashboard`]].map(([label,url])=>(
                <div key={label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #161616'}}>
                  <span style={{fontSize:13,color:'#888'}}>{label}</span>
                  <span style={{fontSize:12,color:G,fontFamily:'monospace'}}>{url}</span>
                </div>
              ))}
            </div>

            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setStep(1)} style={{padding:'12px 20px',background:'#141414',border:'1px solid #252525',borderRadius:12,color:'#777',fontSize:14,fontWeight:700,cursor:'pointer'}}>← Edit Design</button>
              <button onClick={publish} disabled={saving} style={{flex:1,padding:'13px',background:saving?'#1a1a1a':`linear-gradient(135deg,${G},#E8C06A)`,border:'none',borderRadius:12,color:saving?'#555':'#0C0B07',fontSize:15,fontWeight:800,cursor:saving?'not-allowed':'pointer'}}>
                {saving?'Publishing…':'🚀 Publish Restaurant'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
