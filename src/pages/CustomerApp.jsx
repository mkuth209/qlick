import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

function groupBy(arr, key) {
  return arr.reduce((acc, item) => { const k = item[key]; if (!acc[k]) acc[k] = []; acc[k].push(item); return acc }, {})
}

export default function CustomerApp() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [order, setOrder] = useState(null)
  const [orderStatus, setOrderStatus] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: r } = await supabase.from('restaurants').select('*').eq('slug', id).single()
      const { data: m } = await supabase.from('menu_items').select('*').eq('restaurant_id', r?.id).eq('available', true).order('category')
      setRestaurant(r)
      setMenu(m || [])
      setLoading(false)
    }
    load()
    const ch = supabase.channel('cust-menu').on('postgres_changes',{event:'*',schema:'public',table:'menu_items'},()=>load()).subscribe()
    return () => supabase.removeChannel(ch)
  }, [id])

  const design = restaurant?.design || { primary:'#f97316', bg:'#0a0a0a', surface:'#111', text:'#f0f0f0', theme:'dark', font:'system-ui', layout:'list', heroStyle:'gradient' }
  const isDark = design.theme === 'dark'
  const muted = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const heroBg = design.heroStyle==='gradient' ? `linear-gradient(135deg,${design.primary}22,${design.bg})` : design.heroStyle==='diagonal' ? `linear-gradient(160deg,${design.primary}33,${design.bg})` : design.bg

  const grouped = groupBy(menu.filter(m=>m.available), 'category')
  const categories = Object.keys(grouped)
  const cartQty = (id) => cart.find(c=>c.id===id)?.qty||0
  const addToCart = (item) => setCart(p => { const e=p.find(c=>c.id===item.id); return e?p.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c):[...p,{...item,qty:1}] })
  const inc = (id) => setCart(p=>p.map(c=>c.id===id?{...c,qty:c.qty+1}:c))
  const dec = (id) => setCart(p=>{ const i=p.find(c=>c.id===id); return i?.qty===1?p.filter(c=>c.id!==id):p.map(c=>c.id===id?{...c,qty:c.qty-1}:c) })
  const total = cart.reduce((s,c)=>s+c.price*c.qty,0)
  const totalQty = cart.reduce((s,c)=>s+c.qty,0)

  const placeOrder = async () => {
    const num = '#'+Math.floor(1000+Math.random()*9000)
    const { data } = await supabase.from('orders').insert({ restaurant_id:restaurant.id, order_number:num, items:cart, subtotal:total, total, status:'pending' }).select().single()
    setCart([]); setCartOpen(false); setOrder({...data,order_number:num})
    const t1=setTimeout(()=>setOrderStatus(1),3000)
    const t2=setTimeout(()=>setOrderStatus(2),8000)
    return ()=>{clearTimeout(t1);clearTimeout(t2)}
  }

  const fontUrl = design.font && design.font !== 'system-ui' ? `https://fonts.googleapis.com/css2?family=${encodeURIComponent(design.font)}:wght@400;700&display=swap` : null

  useEffect(() => {
    if (!fontUrl) return
    const link = document.createElement('link')
    link.rel='stylesheet'; link.href=fontUrl
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [fontUrl])

  const s = { minHeight:'100vh', background:design.bg, color:design.text, fontFamily:`'${design.font}',Georgia,serif`, paddingBottom:100 }

  if (loading) return <div style={{...s,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{fontSize:40}}>🍽️</div></div>
  if (!restaurant) return <div style={{...s,display:'flex',alignItems:'center',justifyContent:'center',color:muted}}>Restaurant not found.</div>

  // Order success screen
  if (order) {
    const steps = ['Order Received','Preparing','Ready for Pickup 🥡']
    return (
      <div style={{...s,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,gap:24}}>
        <style>{`@keyframes pop{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}`}</style>
        <div style={{fontSize:72,animation:'pop 0.5s ease'}}>✅</div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:22,fontWeight:900,marginBottom:6}}>Order Placed!</div>
          <div style={{fontSize:14,color:muted}}>{order.order_number} · Est. {restaurant.pickup_time||'15-20'} min</div>
        </div>
        <div style={{width:'100%',maxWidth:340,background:design.surface,borderRadius:16,padding:20,border:`1px solid ${border}`}}>
          {steps.map((step,i)=>(
            <div key={step} style={{display:'flex',alignItems:'center',gap:14,marginBottom:i<steps.length-1?20:0}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:i<=orderStatus?design.primary:'transparent',border:`2px solid ${i<=orderStatus?design.primary:border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0,color:isDark?'#000':'#fff',transition:'all 0.5s'}}>
                {i<orderStatus?'✓':i===orderStatus?'●':'○'}
              </div>
              <div style={{fontSize:14,fontWeight:i<=orderStatus?700:400,color:i<=orderStatus?design.text:muted,transition:'all 0.5s'}}>{step}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>{setOrder(null);setOrderStatus(0)}} style={{padding:'12px 32px',background:design.surface,border:`1px solid ${border}`,borderRadius:12,color:muted,fontSize:14,fontWeight:700,cursor:'pointer'}}>← Back to Menu</button>
      </div>
    )
  }

  return (
    <div style={s}>
      {/* Hero */}
      <div style={{padding:'52px 20px 36px',background:heroBg,textAlign:'center',position:'relative',overflow:'hidden'}}>
        {design.heroStyle==='pattern'&&<div style={{position:'absolute',inset:0,backgroundImage:`repeating-linear-gradient(0deg,${design.primary}15 0,${design.primary}15 1px,transparent 0,transparent 32px),repeating-linear-gradient(90deg,${design.primary}15 0,${design.primary}15 1px,transparent 0,transparent 32px)`,backgroundSize:'32px 32px'}}/>}
        <div style={{position:'relative'}}>
          <div style={{display:'inline-block',background:`${design.primary}22`,border:`1px solid ${design.primary}44`,color:design.primary,borderRadius:20,padding:'5px 14px',fontSize:11,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:18}}>🥡 Pickup Only</div>
          <h1 style={{fontSize:32,fontWeight:700,lineHeight:1.1,marginBottom:10}}>{restaurant.name}</h1>
          {restaurant.tagline&&<p style={{fontSize:14,color:muted,marginBottom:8}}>{restaurant.tagline}</p>}
          <div style={{fontSize:13,color:muted}}>⭐ 4.8 · {restaurant.cuisine} · {restaurant.pickup_time||'15-20'} min pickup</div>
        </div>
      </div>

      {/* Category nav */}
      <div style={{display:'flex',overflowX:'auto',borderBottom:`1px solid ${border}`,background:design.bg,padding:'0 16px',scrollbarWidth:'none',position:'sticky',top:0,zIndex:5}}>
        {categories.map(cat=>(
          <button key={cat} onClick={()=>document.getElementById('cat-'+cat)?.scrollIntoView({behavior:'smooth',block:'start'})} style={{flexShrink:0,padding:'12px 18px',background:'transparent',border:'none',borderBottom:`2px solid ${design.primary}`,color:design.primary,fontSize:13,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',fontFamily:`'${design.font}',serif`}}>
            {cat}
          </button>
        ))}
      </div>

      {/* Menu */}
      <div style={{padding:'20px 16px',maxWidth:640,margin:'0 auto'}}>
        {categories.map(cat=>(
          <div key={cat} id={'cat-'+cat} style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:800,marginBottom:14}}>{cat}</h2>
            <div style={design.layout==='grid'?{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}:{display:'flex',flexDirection:'column',gap:10}}>
              {grouped[cat].map(item=>{
                const qty = cartQty(item.id)
                return design.layout==='grid' ? (
                  <div key={item.id} style={{background:design.surface,border:`1px solid ${border}`,borderRadius:14,padding:16,textAlign:'center'}}>
                    <div style={{fontSize:44,marginBottom:10}}>{item.emoji||'🍽️'}</div>
                    <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{item.name}</div>
                    <div style={{fontSize:11,color:muted,marginBottom:10,lineHeight:1.4}}>{item.description}</div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <span style={{fontWeight:800,fontSize:14,color:design.primary}}>{item.price} {restaurant.currency||'SAR'}</span>
                      <button onClick={()=>addToCart(item)} style={{background:qty>0?design.primary:'transparent',border:`1px solid ${qty>0?design.primary:border}`,borderRadius:20,padding:'5px 12px',fontSize:12,fontWeight:700,cursor:'pointer',color:qty>0?(isDark?'#000':'#fff'):muted}}>
                        {qty>0?`+${qty}`:'+ Add'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={item.id} style={{background:design.surface,border:`1px solid ${border}`,borderRadius:14,padding:14,display:'flex',gap:14,alignItems:'center'}}>
                    <div style={{fontSize:42,flexShrink:0}}>{item.emoji||'🍽️'}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:15,marginBottom:3}}>{item.name}</div>
                      <div style={{fontSize:12,color:muted,marginBottom:8,lineHeight:1.4}}>{item.description}</div>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <span style={{fontWeight:800,fontSize:14,color:design.primary}}>{item.price} {restaurant.currency||'SAR'}</span>
                        <button onClick={()=>addToCart(item)} style={{background:qty>0?design.primary:'transparent',border:`1px solid ${qty>0?design.primary:border}`,borderRadius:20,padding:'6px 14px',fontSize:12,fontWeight:700,cursor:'pointer',color:qty>0?(isDark?'#000':'#fff'):muted}}>
                          {qty>0?`Added (${qty})`:'+ Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        {!menu.length&&<div style={{textAlign:'center',padding:60,color:muted}}>Menu coming soon 🍽️</div>}
      </div>

      {/* Floating cart */}
      {totalQty>0&&(
        <div style={{position:'fixed',bottom:20,left:16,right:16,zIndex:30}}>
          <button onClick={()=>setCartOpen(true)} style={{width:'100%',maxWidth:640,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',background:`linear-gradient(135deg,${design.primary},${design.primary}cc)`,border:'none',borderRadius:16,color:isDark?'#000':'#fff',fontSize:15,fontWeight:800,cursor:'pointer',boxShadow:`0 8px 32px ${design.primary}55`}}>
            <span style={{background:'rgba(0,0,0,0.15)',borderRadius:20,padding:'2px 10px',fontSize:13}}>{totalQty} item{totalQty>1?'s':''}</span>
            <span>View Order</span>
            <span>{total.toFixed(2)} {restaurant.currency||'SAR'}</span>
          </button>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen&&(
        <>
          <div onClick={()=>setCartOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:40}}/>
          <div style={{position:'fixed',bottom:0,left:0,right:0,background:design.surface,borderRadius:'20px 20px 0 0',zIndex:50,padding:20,maxHeight:'80vh',overflowY:'auto',border:`1px solid ${border}`}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <div style={{fontWeight:800,fontSize:18}}>Your Order</div>
              <button onClick={()=>setCartOpen(false)} style={{background:'transparent',border:`1px solid ${border}`,borderRadius:'50%',width:32,height:32,color:muted,fontSize:16,cursor:'pointer'}}>✕</button>
            </div>
            {cart.map(c=>(
              <div key={c.id} style={{display:'flex',alignItems:'center',gap:12,marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${border}`}}>
                <div style={{fontSize:30}}>{c.emoji||'🍽️'}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{c.name}</div>
                  <div style={{fontSize:13,color:design.primary,fontWeight:700}}>{(c.price*c.qty).toFixed(2)} {restaurant.currency||'SAR'}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <button onClick={()=>dec(c.id)} style={{width:28,height:28,borderRadius:'50%',background:'transparent',border:`1px solid ${border}`,color:muted,fontSize:16,cursor:'pointer'}}>−</button>
                  <span style={{fontWeight:700,minWidth:16,textAlign:'center'}}>{c.qty}</span>
                  <button onClick={()=>inc(c.id)} style={{width:28,height:28,borderRadius:'50%',background:design.primary,border:'none',color:isDark?'#000':'#fff',fontSize:16,cursor:'pointer'}}>+</button>
                </div>
              </div>
            ))}
            <div style={{background:isDark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.04)',borderRadius:12,padding:14,marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',fontWeight:800,fontSize:16}}>
                <span>Total</span><span>{total.toFixed(2)} {restaurant.currency||'SAR'}</span>
              </div>
            </div>
            <button onClick={placeOrder} style={{width:'100%',padding:15,background:`linear-gradient(135deg,${design.primary},${design.primary}cc)`,border:'none',borderRadius:14,color:isDark?'#000':'#fff',fontSize:16,fontWeight:800,cursor:'pointer'}}>
              🥡 Place Pickup Order · {total.toFixed(2)} {restaurant.currency||'SAR'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
