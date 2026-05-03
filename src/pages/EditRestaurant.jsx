import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function EditRestaurant() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('restaurants').select('*').eq('id', id).single().then(({ data }) => {
      setRestaurant(data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div style={{minHeight:'100vh',background:'#080808',display:'flex',alignItems:'center',justifyContent:'center',color:'#555',fontFamily:'system-ui'}}>Loading…</div>

  return (
    <div style={{minHeight:'100vh',background:'#080808',color:'#f0f0f0',fontFamily:"'SF Pro Display',-apple-system,sans-serif"}}>
      <div style={{padding:'14px 24px',borderBottom:'1px solid #161616',display:'flex',alignItems:'center',gap:10,background:'#080808'}}>
        <a href="/admin" style={{color:'#555',textDecoration:'none',fontSize:13}}>← Admin</a>
        <span style={{color:'#2a2a2a'}}>/</span>
        <span style={{fontSize:13,fontWeight:700,color:'#f0f0f0'}}>Edit · {restaurant?.name}</span>
      </div>
      <div style={{maxWidth:560,margin:'0 auto',padding:'40px 28px'}}>
        <div style={{fontSize:22,fontWeight:800,marginBottom:24}}>Edit Restaurant</div>
        {/* Quick edit fields */}
        {['name','cuisine','tagline','address','phone','hours'].map(k=>(
          <div key={k} style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:800,letterSpacing:'0.08em',color:'#555',marginBottom:6,textTransform:'capitalize'}}>{k}</div>
            <input defaultValue={restaurant?.[k]||''} style={{width:'100%',padding:'10px 14px',background:'#141414',border:'1px solid #252525',borderRadius:10,color:'#f0f0f0',fontSize:14,outline:'none',fontFamily:'inherit',boxSizing:'border-box'}}
              onChange={e=>setRestaurant(r=>({...r,[k]:e.target.value}))}/>
          </div>
        ))}
        <div style={{display:'flex',gap:10,marginTop:24}}>
          <button onClick={()=>navigate('/admin')} style={{padding:'11px 20px',background:'#141414',border:'1px solid #252525',borderRadius:10,color:'#777',fontSize:14,fontWeight:700,cursor:'pointer'}}>Cancel</button>
          <button onClick={async()=>{
            await supabase.from('restaurants').update({
              name:restaurant.name,cuisine:restaurant.cuisine,tagline:restaurant.tagline,
              address:restaurant.address,phone:restaurant.phone,hours:restaurant.hours
            }).eq('id',id)
            navigate('/admin')
          }} style={{flex:1,padding:'12px',background:'linear-gradient(135deg,#C9A84C,#E8C06A)',border:'none',borderRadius:10,color:'#0C0B07',fontSize:14,fontWeight:800,cursor:'pointer'}}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}
