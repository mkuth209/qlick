import { useEffect } from 'react'

export default function Landing() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  const s = {
    page: { minHeight:'100vh', background:'#0C0B09', color:'#F5F0E8', fontFamily:"'DM Sans',sans-serif" },
    gold: '#E8A020',
  }

  return (
    <div style={s.page}>
      <style>{`
        h1,h2,.logo{font-family:'Syne',sans-serif;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)}}
        .hero-child{animation:fadeUp 0.6s ease both;}
      `}</style>

      {/* NAV */}
      <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 48px',borderBottom:'1px solid #2A2620',position:'sticky',top:0,background:'rgba(12,11,9,0.92)',backdropFilter:'blur(12px)',zIndex:100}}>
        <div className="logo" style={{fontSize:22,fontWeight:800,letterSpacing:'-0.04em'}}>Ql<span style={{color:s.gold}}>i</span>ck</div>
        <a href="/admin" style={{background:s.gold,color:'#0C0B09',padding:'9px 22px',borderRadius:8,fontSize:14,fontWeight:700,fontFamily:'Syne,sans-serif',textDecoration:'none'}}>Admin →</a>
      </nav>

      {/* HERO */}
      <div style={{position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,right:-100,width:500,height:500,opacity:0.03,backgroundImage:'repeating-linear-gradient(0deg,#E8A020 0,#E8A020 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,#E8A020 0,#E8A020 1px,transparent 0,transparent 40px)',backgroundSize:'40px 40px'}}/>
        <div style={{padding:'100px 48px 80px',maxWidth:1100,margin:'0 auto'}}>
          <div className="hero-child" style={{display:'inline-flex',alignItems:'center',gap:8,background:'#1C1A16',border:'1px solid #2A2620',borderRadius:20,padding:'6px 16px',fontSize:12,color:'#7A7060',fontWeight:500,marginBottom:32,letterSpacing:'0.05em',textTransform:'uppercase',animationDelay:'0s'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:s.gold,animation:'pulse 2s ease-in-out infinite'}}/>
            Built for restaurant builders
          </div>
          <h1 className="hero-child" style={{fontSize:72,fontWeight:800,lineHeight:1.0,letterSpacing:'-0.04em',marginBottom:24,maxWidth:700,animationDelay:'0.1s'}}>
            Launch any<br/>restaurant app<br/><span style={{WebkitTextStroke:'1px #4A4438',color:'transparent'}}>in minutes.</span>
          </h1>
          <p className="hero-child" style={{fontSize:18,color:'#7A7060',lineHeight:1.7,maxWidth:480,marginBottom:44,fontWeight:300,animationDelay:'0.2s'}}>
            You take the brief from the owner. Qlick builds the app. Customer ordering, real-time pickups, owner dashboard — done.
          </p>
          <div className="hero-child" style={{display:'flex',alignItems:'center',gap:16,animationDelay:'0.3s'}}>
            <a href="/admin" style={{background:s.gold,color:'#0C0B09',padding:'14px 32px',borderRadius:10,fontSize:15,fontWeight:700,fontFamily:'Syne,sans-serif',textDecoration:'none'}}>Create a Restaurant →</a>
            <a href="/admin/login" style={{background:'transparent',color:'#7A7060',padding:'14px 24px',borderRadius:10,fontSize:15,fontWeight:500,textDecoration:'none',border:'1px solid #2A2620'}}>Admin Login</a>
          </div>
          <div className="hero-child" style={{display:'flex',gap:40,marginTop:64,paddingTop:40,borderTop:'1px solid #2A2620',animationDelay:'0.4s'}}>
            {[['2 min','Average setup time'],['2 apps','Generated per restaurant'],['Live','Real-time order sync']].map(([num,label])=>(
              <div key={num}><div style={{fontFamily:'Syne,sans-serif',fontSize:32,fontWeight:800,color:s.gold}}>{num}</div><div style={{fontSize:13,color:'#7A7060',marginTop:2}}>{label}</div></div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{borderTop:'1px solid #2A2620',padding:'80px 48px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:s.gold,marginBottom:16}}>The workflow</div>
          <h2 style={{fontSize:42,fontWeight:800,letterSpacing:'-0.03em',marginBottom:48,lineHeight:1.1}}>Three steps.<br/>One working app.</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:2,background:'#2A2620',borderRadius:16,overflow:'hidden'}}>
            {[['01','📝','Enter restaurant info','Name, cuisine, menu categories, address, hours. Takes about 2 minutes.'],
              ['02','⚡','Design & customize','Pick a theme preset or fine-tune colors, fonts, layout — live preview updates instantly.'],
              ['03','🔗','Publish & share links','Customer app and owner dashboard go live. Share links — done.']].map(([num,icon,title,desc])=>(
              <div key={num} style={{background:'#141210',padding:'32px 28px'}}>
                <div style={{fontFamily:'Syne,sans-serif',fontSize:48,fontWeight:800,color:'#2A2620',marginBottom:20,lineHeight:1}}>{num}</div>
                <div style={{fontSize:28,marginBottom:14}}>{icon}</div>
                <div style={{fontFamily:'Syne,sans-serif',fontSize:18,fontWeight:700,marginBottom:10,color:'#F5F0E8'}}>{title}</div>
                <div style={{fontSize:14,color:'#7A7060',lineHeight:1.6}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{borderTop:'1px solid #2A2620',padding:'80px 48px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:s.gold,marginBottom:16}}>What's included</div>
          <h2 style={{fontSize:42,fontWeight:800,letterSpacing:'-0.03em',marginBottom:48,lineHeight:1.1}}>Everything a restaurant needs.<br/>Nothing it doesn't.</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:2,background:'#2A2620',borderRadius:16,overflow:'hidden'}}>
            {[['Customer App','Browse. Add to cart. Pickup.','Beautiful menu, live cart, and a pickup order flow with real-time status tracker.'],
              ['Owner Dashboard','Orders arrive in real time.','Accept, prepare, mark ready — one click per step. Full order management.'],
              ['Menu Management','Owner controls the menu.','Add items, edit prices, toggle availability. Changes reflect instantly.'],
              ['Design Studio','Each app looks unique.','6 presets + full color, font, layout customization with live preview.']].map(([tag,title,desc])=>(
              <div key={tag} style={{background:'#141210',padding:'36px 32px',position:'relative',overflow:'hidden'}}>
                <div style={{display:'inline-block',background:'#1C1A16',border:'1px solid #2A2620',borderRadius:6,padding:'4px 10px',fontSize:11,color:'#7A7060',fontWeight:500,marginBottom:16,letterSpacing:'0.05em',textTransform:'uppercase'}}>{tag}</div>
                <div style={{fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:700,marginBottom:10,color:'#F5F0E8'}}>{title}</div>
                <div style={{fontSize:14,color:'#7A7060',lineHeight:1.6}}>{desc}</div>
                <div style={{position:'absolute',bottom:-20,right:-20,width:80,height:80,borderRadius:'50%',background:s.gold,opacity:0.04}}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{borderTop:'1px solid #2A2620',padding:'80px 48px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{background:'#141210',border:'1px solid #2A2620',borderRadius:20,padding:'60px 48px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:40,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',inset:0,opacity:0.02,backgroundImage:'repeating-linear-gradient(45deg,#E8A020 0,#E8A020 1px,transparent 0,transparent 20px)'}}/>
            <h2 style={{fontSize:40,fontWeight:800,letterSpacing:'-0.03em',lineHeight:1.1,maxWidth:400,position:'relative'}}>
              Ready to onboard your first restaurant? <span style={{color:s.gold}}>Let's go.</span>
            </h2>
            <div style={{position:'relative',flexShrink:0,textAlign:'center'}}>
              <a href="/admin" style={{display:'inline-block',padding:'16px 36px',background:s.gold,borderRadius:12,color:'#0C0B09',fontWeight:800,fontSize:16,fontFamily:'Syne,sans-serif',textDecoration:'none'}}>Create a Restaurant →</a>
              <div style={{fontSize:12,color:'#4A4438',marginTop:10}}>Takes less than 2 minutes</div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{padding:'28px 48px',borderTop:'1px solid #2A2620',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontFamily:'Syne,sans-serif',fontSize:18,fontWeight:800,letterSpacing:'-0.04em'}}>Ql<span style={{color:s.gold}}>i</span>ck</div>
        <div style={{fontSize:13,color:'#4A4438'}}>Your restaurant, online in minutes.</div>
      </div>
    </div>
  )
}
