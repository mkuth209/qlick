export const PRESETS = [
  { id:'dark-arabic',   name:'Dark Arabic',      emoji:'🌙', theme:'dark',  primary:'#C9A84C', bg:'#0D0B07', surface:'#161310', text:'#F5EDD8', font:'Amiri',               heroStyle:'pattern',  layout:'list' },
  { id:'bold-street',   name:'Bold Street',      emoji:'🔥', theme:'dark',  primary:'#FF3B30', bg:'#0A0A0A', surface:'#141414', text:'#FFFFFF',  font:'Bebas Neue',          heroStyle:'gradient', layout:'grid' },
  { id:'clean-white',   name:'Clean White',      emoji:'✨', theme:'light', primary:'#1A1A1A', bg:'#FAFAF8', surface:'#FFFFFF', text:'#1A1A1A',  font:'Playfair Display',    heroStyle:'solid',    layout:'grid' },
  { id:'fresh-green',   name:'Fresh & Healthy',  emoji:'🥗', theme:'light', primary:'#2D6A4F', bg:'#F4F9F1', surface:'#FFFFFF', text:'#1B2D23',  font:'DM Serif Display',    heroStyle:'gradient', layout:'grid' },
  { id:'luxury-gold',   name:'Luxury Gold',      emoji:'👑', theme:'dark',  primary:'#BFA060', bg:'#0C0C0A', surface:'#181510', text:'#EDE5D0',  font:'Cormorant Garamond',  heroStyle:'pattern',  layout:'list' },
  { id:'vibrant-pop',   name:'Vibrant Pop',      emoji:'🎨', theme:'light', primary:'#FF6B35', bg:'#FFF8F4', surface:'#FFFFFF', text:'#1A0A00',  font:'Syne',                heroStyle:'gradient', layout:'grid' },
]

export const FONTS = [
  'Amiri','Bebas Neue','Playfair Display','DM Serif Display',
  'Cormorant Garamond','Syne','Fraunces','Outfit','Lexend'
]

export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Me@1122123'
