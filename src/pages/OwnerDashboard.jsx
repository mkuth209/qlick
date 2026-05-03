import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const STATUS = {
  pending:   { label:'Pending',    color:'#f59e0b', next:'preparing',  btn:'Accept Order' },
  preparing: { label:'Preparing',  color:'#3b82f6', next:'ready',      btn:'Mark Ready' },
  ready:     { label:'Ready 🥡',   color:'#10b981', next:'completed',  btn:'Complete' },
  completed: { label:'Completed',  color:'#555',    next:null,         btn:null },
}

function Badge({ status }) {
  const s = STATUS[status]||STATUS.pending
  return <span style={{padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:s.color+'22',color:s.color}}>{s.label}</span>
}

export default function OwnerDashboard() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [orders, setOrders] = useState([])
  const [menu, setMenu] = useState([])
  const [reviews, setReviews] = useState([])
  const [page, setPage] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState({name:'',description:'',price:'',category:'',emoji:'🍽️'})
  const [orderFilter, setOrderFilter] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const fetchAll = async () => {
    const { data: r } = await supabase.from('restaurants').select('*').eq('slug', id).single()
    if (!r) { setLoading(false); return }
    setRestaurant(r)
    const [{ data: o }, { data: m }, { data: rv }] = await Promise.all([
      supabase.from('orders').select('*').eq('restaurant_id', r.id).order('created_at',{ascending:false}),
      supabase.from('menu_items').select('*').eq('restaurant_id', r.id).order('category'),
      supabase.from('reviews').select('*').eq('restaurant_id', r.id).order('created_at',{ascending:false}),
    ])
    setOrders(o||[]); setMenu(m||[]); setReviews(rv||[])
    setLoading(false)
  }

  useEffect(() => {
    fetchAll()
    const ch = supabase.channel('owner-dash')
      .on('postgres_changes',{event:'*',schema:'public',table:'orders'},fetchAll)
      .on('postgres_changes',{event:'*',schema:'public',table:'menu_items'},fetchAll)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [id])

  if (loading) return <div style={{minHeight:'100vh',background:'#080808',display:'flex',alignItems:'center',justifyContent:'center',color:'#555',fontFamily:'system-ui'}}>Loading…</div>
  if (!restaurant) return <div style={{minHeight:'100vh',background:'#080808',display:'flex',alignItems:'center',justifyContent:'center',color:'#555',fontFamily:'system-ui'}}>Restaurant not found.</div>

  const design = restaurant.design || {}
  const G = design.primary || '#6366f1'

  const today = orders.filter(o=>new Date(o.created_at).toDateString()===new Date().toDateString())
  const revenue = today.filter(o=>o.status==='completed').reduce((s,o)=>s+(o.total||0),0)
  const pending = orders.filter(o=>o.status==='pending').length
  const filtered = orderFilter==='all' ? orders : orders.filter(o=>o.status===orderFilter)

  const updateStatus = async (oid, next) => { await supabase.from('orders').update({status:next}).eq('id',oid); fetchAll() }
  const toggleAvail = async (mid, cur) => { await supabase.from('menu_items').update({available:!cur}).eq('id',mid); fetchAll() }
  const deleteItem = async (mid) => { await supabase.from('menu_items').delete().eq('id',mid); fetchAll() }
  const saveEdit = async () => { await supabase.from('menu_items').update({name:editForm.name,description:editForm.description,price:parseFloat(editForm.price),category:editForm.category,emoji:editForm.emoji}).eq('id',editId); setEditId(null); fetchAll() }
  const addItem = async () => {
    if (!newItem.name||!newItem.price||!newItem.category) return
    await supabase.from('menu_items').insert({...newItem,price:parseFloat(newItem.price),restaurant_id:restaurant.id,available:true})
    setNewItem({name:'',description:'',price:'',category:'',emoji:'🍽️'}); setShowAdd(false); fetchAll()
  }

  const inp = (s={}) => ({width:'100%',padding:'8px 12px',background:'#0d0d0d',border:'1px solid #252525',borderRadius:8,color:'#f0f0f0',fontSize:13,outline:'none',fontFamily:'inherit',...s})
  const cats = [...new Set(menu.map(m=>m.category))]
  const avgRating = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : 0

  const NAV = [
    {id:'overview',icon:'📊',label:'Overview'},
    {id:'orders',icon:'📦',label:'Orders',badge:pending},
    {id:'menu',icon:'🍽️',label:'Menu'},
    {id:'reviews',icon:'⭐',label:'Reviews'},
    {id:'settings',icon:'⚙️',label:'Settings'},
  ]

  return (
    <div style={{minHeight:'100vh',background:'#080808',color:'#f0f0f0',fontFamily:"'SF Pro Display',-apple-system,sans-serif",display:'flex'}}>

      {/* Sidebar */}
      <div style={{width:sidebarOpen?220:60,minWidth:sidebarOpen?220:60,background:'#0d0d0d',borderRight:'1px solid #161616',display:'flex',flexDirection:'column',transition:'width 0.3s',overflow:'hidden'}}>
        <div style={{padding:'18px 14px',borderBottom:'1px solid #161616',display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${G},${G}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{restaurant.emoji||'🏪'}</div>
          {sidebarOpen&&<div style={{overflow:'hidden'}}>
            <div style={{fontWeight:800,fontSize:13,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{restaurant.name}</div>
            <div style={{fontSize:10,color:'#444'}}>Owner Dashboard</div>
          </div>}
        </div>
        <nav style={{flex:1,padding:'12px 10px'}}>
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>setPage(item.id)} style={{width:'100%',padding:'10px 12px',marginBottom:4,background:page===item.id?G+'22':'transparent',border:'none',borderRadius:10,color:page===item.id?G:'#555',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:10,textAlign:'left',position:'relative'}}>
              <span style={{fontSize:16,flexShrink:0}}>{item.icon}</span>
              {sidebarOpen&&<span style={{whiteSpace:'nowrap'}}>{item.label}</span>}
              {item.badge>0&&<span style={{marginLeft:'auto',background:'#f59e0b',color:'#000',borderRadius:10,padding:'1px 7px',fontSize:10,fontWeight:900,flexShrink:0}}>{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{borderTop:'1px solid #161616',padding:'10px'}}>
          <a href={`/${id}`} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:8,padding:'9px 12px',background:'transparent',border:'1px solid #1e1e1e',borderRadius:10,color:'#555',fontSize:12,fontWeight:700,textDecoration:'none',width:'100%',boxSizing:'border-box'}}>
            <span>📱</span>{sidebarOpen&&<span>View Customer App</span>}
          </a>
        </div>
        <button onClick={()=>setSidebarOpen(v=>!v)} style={{padding:14,background:'transparent',border:'none',borderTop:'1px solid #161616',color:'#333',fontSize:14,cursor:'pointer'}}>{sidebarOpen?'◀':'▶'}</button>
      </div>

      {/* Main */}
      <div style={{flex:1,overflowY:'auto',padding:28}}>

        {/* OVERVIEW */}
        {page==='overview'&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:900,marginBottom:20,letterSpacing:'-0.03em'}}>Overview</h1>
            <div style={{display:'flex',gap:14,flexWrap:'wrap',marginBottom:28}}>
              {[{icon:'📦',label:"Today's Orders",value:today.length,color:G},{icon:'💰',label:'Revenue Today',value:`${revenue.toFixed(0)} SAR`,color:'#10b981'},{icon:'⏳',label:'Pending',value:pending,color:'#f59e0b'},{icon:'⭐',label:'Avg Rating',value:avgRating||'—',color:'#f59e0b'}].map(s=>(
                <div key={s.label} style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:14,padding:'18px 20px',flex:1,minWidth:140}}>
                  <div style={{fontSize:22,marginBottom:8}}>{s.icon}</div>
                  <div style={{fontSize:26,fontWeight:900,color:s.color,marginBottom:2}}>{s.value}</div>
                  <div style={{fontSize:12,color:'#555'}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:14,padding:20}}>
              <div style={{fontSize:13,fontWeight:700,color:'#888',marginBottom:14,textTransform:'uppercase',letterSpacing:'0.05em'}}>Recent Orders</div>
              {orders.slice(0,6).map(o=>(
                <div key={o.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #161616'}}>
                  <div><span style={{fontWeight:700,fontSize:14}}>{o.order_number}</span><span style={{color:'#444',fontSize:12,marginLeft:10}}>{o.items?.length} item{o.items?.length!==1?'s':''}</span></div>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontWeight:700,fontSize:13}}>{o.total} SAR</span>
                    <Badge status={o.status}/>
                  </div>
                </div>
              ))}
              {!orders.length&&<div style={{color:'#333',fontSize:13}}>No orders yet.</div>}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {page==='orders'&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:900,marginBottom:16,letterSpacing:'-0.03em'}}>Orders</h1>
            <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
              {['all','pending','preparing','ready','completed'].map(f=>{
                const count = f==='all'?orders.length:orders.filter(o=>o.status===f).length
                return <button key={f} onClick={()=>setOrderFilter(f)} style={{padding:'7px 14px',borderRadius:20,border:'1px solid',borderColor:orderFilter===f?G:'#252525',background:orderFilter===f?G+'22':'#111',color:orderFilter===f?G:'#555',fontSize:12,fontWeight:700,cursor:'pointer',textTransform:'capitalize'}}>
                  {f} {count>0&&<span style={{background:'#1e1e1e',borderRadius:10,padding:'1px 6px',marginLeft:4,fontSize:10}}>{count}</span>}
                </button>
              })}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {filtered.map(o=>{
                const s=STATUS[o.status]||STATUS.pending
                return (
                  <div key={o.id} style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:14,padding:18}}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:12}}>
                      <div><div style={{fontWeight:800,fontSize:16,marginBottom:2}}>{o.order_number}</div><div style={{fontSize:11,color:'#444'}}>{new Date(o.created_at).toLocaleString()}</div></div>
                      <Badge status={o.status}/>
                    </div>
                    <div style={{marginBottom:12}}>
                      {o.items?.map((item,i)=><div key={i} style={{fontSize:13,color:'#666',marginBottom:3}}>{item.emoji} {item.name} × {item.qty} — {(item.price*item.qty).toFixed(2)} SAR</div>)}
                    </div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <span style={{fontWeight:800,fontSize:15}}>Total: {o.total} SAR</span>
                      {s.next&&<button onClick={()=>updateStatus(o.id,s.next)} style={{padding:'8px 16px',background:s.color,border:'none',borderRadius:10,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer'}}>{s.btn}</button>}
                    </div>
                  </div>
                )
              })}
              {!filtered.length&&<div style={{color:'#333',fontSize:13,padding:20}}>No orders here.</div>}
            </div>
          </div>
        )}

        {/* MENU */}
        {page==='menu'&&(
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <h1 style={{fontSize:22,fontWeight:900,letterSpacing:'-0.03em'}}>Menu</h1>
              <button onClick={()=>setShowAdd(v=>!v)} style={{padding:'9px 18px',background:G,border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer'}}>{showAdd?'✕ Cancel':'+ Add Item'}</button>
            </div>
            {showAdd&&(
              <div style={{background:'#111',border:`1px solid ${G}44`,borderRadius:14,padding:18,marginBottom:20}}>
                <div style={{fontSize:13,fontWeight:700,color:G,marginBottom:14}}>New Item</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                  {[['name','Name'],['category','Category'],['price','Price (SAR)'],['emoji','Emoji']].map(([k,ph])=>(
                    <input key={k} style={inp()} placeholder={ph} value={newItem[k]} onChange={e=>setNewItem(v=>({...v,[k]:e.target.value}))}/>
                  ))}
                </div>
                <input style={{...inp(),marginBottom:10}} placeholder="Description" value={newItem.description} onChange={e=>setNewItem(v=>({...v,description:e.target.value}))}/>
                <button onClick={addItem} style={{padding:'9px 20px',background:G,border:'none',borderRadius:8,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer'}}>Add to Menu</button>
              </div>
            )}
            {cats.map(cat=>(
              <div key={cat} style={{marginBottom:28}}>
                <h2 style={{fontSize:14,fontWeight:800,color:'#888',marginBottom:12,textTransform:'uppercase',letterSpacing:'0.05em'}}>{cat}</h2>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {menu.filter(m=>m.category===cat).map(item=>(
                    <div key={item.id} style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:12,padding:14,opacity:item.available?1:0.5}}>
                      {editId===item.id?(
                        <div>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                            {[['name','Name'],['category','Category'],['price','Price'],['emoji','Emoji']].map(([k,ph])=>(
                              <input key={k} style={inp()} placeholder={ph} value={editForm[k]||''} onChange={e=>setEditForm(v=>({...v,[k]:e.target.value}))}/>
                            ))}
                          </div>
                          <input style={{...inp(),marginBottom:10}} placeholder="Description" value={editForm.description||''} onChange={e=>setEditForm(v=>({...v,description:e.target.value}))}/>
                          <div style={{display:'flex',gap:8}}>
                            <button onClick={saveEdit} style={{padding:'7px 16px',background:'#10b981',border:'none',borderRadius:8,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer'}}>Save</button>
                            <button onClick={()=>setEditId(null)} style={{padding:'7px 16px',background:'#1e1e1e',border:'none',borderRadius:8,color:'#888',fontSize:12,fontWeight:700,cursor:'pointer'}}>Cancel</button>
                          </div>
                        </div>
                      ):(
                        <div style={{display:'flex',alignItems:'center',gap:12}}>
                          <div style={{fontSize:32}}>{item.emoji}</div>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{item.name}</div>
                            <div style={{fontSize:12,color:'#555',marginBottom:4}}>{item.description}</div>
                            <div style={{fontWeight:800,fontSize:13,color:G}}>{item.price} SAR</div>
                          </div>
                          <div style={{display:'flex',gap:7,alignItems:'center'}}>
                            <button onClick={()=>toggleAvail(item.id,item.available)} style={{padding:'5px 11px',borderRadius:20,border:'1px solid',borderColor:item.available?'#10b981':'#333',background:item.available?'#10b98122':'#1a1a1a',color:item.available?'#10b981':'#555',fontSize:11,fontWeight:700,cursor:'pointer'}}>{item.available?'On':'Off'}</button>
                            <button onClick={()=>{setEditId(item.id);setEditForm({...item})}} style={{padding:'5px 10px',background:'#1a1a1a',border:'1px solid #252525',borderRadius:8,color:'#888',fontSize:12,cursor:'pointer'}}>✏️</button>
                            <button onClick={()=>deleteItem(item.id)} style={{padding:'5px 10px',background:'#1a1a1a',border:'1px solid #252525',borderRadius:8,color:'#f87171',fontSize:12,cursor:'pointer'}}>🗑️</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {!menu.length&&<div style={{color:'#333',fontSize:13}}>No menu items yet. Add your first item above!</div>}
          </div>
        )}

        {/* REVIEWS */}
        {page==='reviews'&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:900,marginBottom:20,letterSpacing:'-0.03em'}}>Reviews</h1>
            <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:14,padding:20,marginBottom:20,display:'flex',gap:28,alignItems:'center'}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:48,fontWeight:900,color:'#f59e0b'}}>{avgRating}</div>
                <div style={{fontSize:22}}>{'⭐'.repeat(Math.round(avgRating))}</div>
                <div style={{fontSize:12,color:'#555',marginTop:4}}>{reviews.length} reviews</div>
              </div>
              <div style={{flex:1}}>
                {[5,4,3,2,1].map(star=>{
                  const count=reviews.filter(r=>r.rating===star).length
                  return <div key={star} style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                    <span style={{fontSize:12,color:'#888',minWidth:12}}>{star}</span>
                    <div style={{flex:1,background:'#1e1e1e',borderRadius:4,height:8}}>
                      <div style={{width:reviews.length?`${(count/reviews.length)*100}%`:'0%',background:'#f59e0b',borderRadius:4,height:'100%',transition:'width 0.5s'}}/>
                    </div>
                    <span style={{fontSize:12,color:'#555',minWidth:16}}>{count}</span>
                  </div>
                })}
              </div>
            </div>
            {reviews.map(r=>(
              <div key={r.id} style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:12,padding:16,marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <div style={{fontSize:16}}>{'⭐'.repeat(r.rating)}</div>
                  <div style={{fontSize:11,color:'#444'}}>{new Date(r.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{fontSize:14,color:'#aaa',lineHeight:1.5}}>{r.comment||'No comment.'}</div>
              </div>
            ))}
            {!reviews.length&&<div style={{color:'#333',fontSize:13}}>No reviews yet.</div>}
          </div>
        )}

        {/* SETTINGS */}
        {page==='settings'&&(
          <div>
            <h1 style={{fontSize:22,fontWeight:900,marginBottom:20,letterSpacing:'-0.03em'}}>Settings</h1>
            <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:14,padding:22,marginBottom:16,maxWidth:500}}>
              <div style={{fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#555',marginBottom:14}}>Restaurant Info</div>
              {['name','cuisine','tagline','address','phone','hours'].map(k=>(
                <div key={k} style={{marginBottom:12}}>
                  <div style={{fontSize:10,fontWeight:700,textTransform:'capitalize',color:'#555',marginBottom:5}}>{k}</div>
                  <input defaultValue={restaurant[k]||''} style={{width:'100%',padding:'9px 13px',background:'#0d0d0d',border:'1px solid #252525',borderRadius:9,color:'#f0f0f0',fontSize:14,outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}
                    id={`setting-${k}`}/>
                </div>
              ))}
              <button onClick={async()=>{
                const updates={}
                ;['name','cuisine','tagline','address','phone','hours'].forEach(k=>{
                  const el=document.getElementById(`setting-${k}`)
                  if(el) updates[k]=el.value
                })
                await supabase.from('restaurants').update(updates).eq('id',restaurant.id)
                fetchAll()
                alert('Saved!')
              }} style={{marginTop:8,padding:'11px 24px',background:G,border:'none',borderRadius:10,color:'#fff',fontSize:14,fontWeight:800,cursor:'pointer'}}>Save Settings</button>
            </div>
            <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:14,padding:22,maxWidth:500}}>
              <div style={{fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#555',marginBottom:14}}>Your Links</div>
              {[[`📱 Customer App`,`${window.location.origin}/${id}`],[`📊 Dashboard`,`${window.location.origin}/${id}/dashboard`]].map(([label,url])=>(
                <div key={label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #161616'}}>
                  <span style={{fontSize:13,color:'#888'}}>{label}</span>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:12,color:G,fontFamily:'monospace'}}>{url}</span>
                    <button onClick={()=>navigator.clipboard?.writeText(url)} style={{padding:'4px 10px',background:'#1a1a1a',border:'1px solid #252525',borderRadius:6,color:'#666',fontSize:11,cursor:'pointer'}}>Copy</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
