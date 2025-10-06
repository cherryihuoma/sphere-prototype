// Sphere frontend prototype — with working category filter + post creation

const app = document.getElementById('app');

/* ---------- Mock Data ---------- */
const user = {
  name: "ÎæmCherry & 𝕿𝖎m𝖎𝖝 𝕻𝖆𝖒𝖎𝖑𝖊𝖗𝖎𝖓",
  handle: "@cherryihuoma & 1𝔞𝔫𝔡𝔬𝔫𝔩𝔶𝔗𝔦𝔪𝔦𝔵𝔓",
  balance: 3500,
  avatarInitials: "C & T",
};

// LIKE BUTTON TOGGLE FIX
document.addEventListener('DOMContentLoaded', () => {
  // Target all like buttons (both posts & comments)
  const likeButtons = document.querySelectorAll('.like-btn');

  likeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const liked = btn.classList.toggle('liked');
      const countEl = btn.querySelector('.like-count');
      let count = parseInt(countEl.textContent) || 0;

      if (liked) {
        count++;
      } else {
        count--;
      }

      countEl.textContent = count;
    });
  });
});

// Posts have a "category" field
let posts = [
  { id:1, author:"Seyi", handle:"@seyi", text:"Campus hack: how I landed 3 clients in 2 weeks.", likes: 24, category:"Hustle" },
  { id:2, author:"Ada", handle:"@ada", text:"Quick UI tip: keep your spacing scale consistent.", likes: 40, category:"Nearby" },
  { id:3, author:"Femi", handle:"@femi", text:"Who wants a weekend football trivia challenge? Winner gets airtime!", likes: 14, category:"Games" },
  { id:4, author:"Zara", handle:"@zara", text:"Selling cute digital art packs for ₦1,000 👩🏾‍🎨", likes: 12, category:"Market" },
];

const games = [
  { id:'g1', name:"Trivia Blitz", desc:"Answer fast, climb leaderboard." },
  { id:'g2', name:"Endless Runner", desc:"Simple tap controls - top score wins credits." },
  { id:'g3', name:"Football Quiz", desc:"Prove you know the league." },
];

const market = [
  { id:'m1', title:"Logo Design - Fast", price: 1500, seller:"@designbytay" },
  { id:'m2', title:"Social Media Templates", price: 800, seller:"@templates" },
];

/* ---------- Utility ---------- */
function $el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k === 'class') e.className = v;
    else if(k === 'text') e.textContent = v;
    else if(k === 'html') e.innerHTML = v;
    else if(k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
    else e.setAttribute(k,v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if(!c) return;
    if(typeof c === 'string') e.appendChild(document.createTextNode(c));
    else e.appendChild(c);
  });
  return e;
}

/* ---------- Components ---------- */
function LeftColumn(){
  const avatar = $el('div',{class:'avatar', text:user.avatarInitials});
  const info = $el('div',{class:'user-info'}, [
    $el('h3',{text:user.name}),
    $el('p',{class:'muted', text:user.handle}),
  ]);
  const profileCard = $el('div',{class:'profile-card card'}, [avatar, info]);

  const walletCard = $el('div',{class:'wallet-quick'}, [
    $el('div',{class:'wallet-left'}, [
      $el('h4',{text:'Quick Wallet'}),
      $el('p',{text:`₦${user.balance.toLocaleString()}`})
    ]),
    $el('div',{class:'wallet-actions'}, [
      $el('button',{class:'btn', text:'Send', onClick:()=>toast('Send clicked (mock)')}),
      $el('button',{class:'btn ghost', text:'Top-up', onClick:()=>toast('Top-up clicked (mock)')})
    ])
  ]);

  const chipNames = ['Nearby','Hustle','Games','Market'];
  const chips = chipNames.map((name, i) => 
    $el('div',{
      class:'chip',
      text:name,
      onClick:()=>toggleChip(name)
    })
  );
  const chipWrap = $el('div',{class:'chips'}, chips);

  return $el('div',{class:'left-col'}, [profileCard, walletCard, chipWrap]);
}

/* ---------- Category filter ---------- */
let activeCategory = null;
function toggleChip(name){
  activeCategory = (activeCategory === name) ? null : name;
  document.querySelectorAll('.chip').forEach(chip=>{
    chip.classList.toggle('active', chip.textContent === activeCategory);
  });
  render(); // re-render feed based on category
}

/* ---------- Post Card ---------- */
function PostCard(p){
  const avatar = $el('div',{class:'avatar-sm', text:p.author[0]});
  const meta = $el('div',{class:'post-meta'}, [
    avatar,
    $el('div',{}, [
      $el('div',{text:p.author}),
      $el('div',{class:'muted', text:p.handle})
    ])
  ]);
  const body = $el('div',{class:'post-body', text:p.text});
  const tag = $el('div',{class:'tag', text:p.category});
  const actions = $el('div',{class:'actions'}, [
      $el('button',{class:'btn ghost', text:`❤ ${p.likes}`, onClick:()=>likePost(p.id)}),
      $el('button',{class:'btn ghost', text:'Share', onClick:()=>toast('Link copied (mock)')})
    ]);
  return $el('div',{class:'card'}, [meta, body, tag, actions]);
}

/* ---------- Main Column ---------- */
function MainColumn(){
  const composeInput = $el('input',{class:'input', placeholder:'Share something...'});
  const categorySelect = $el('select',{class:'input'}, 
    ['Nearby','Hustle','Games','Market'].map(cat => 
      $el('option',{value:cat, text:cat})
    )
  );
  const composeBtn = $el('button',{class:'btn', text:'Post'});

  composeBtn.addEventListener('click',()=>{
    const text = composeInput.value.trim();
    const category = categorySelect.value;
    if(!text) return toast('Write something first!');
    posts.unshift({
      id: Date.now(),
      author: user.name.split('&')[0].trim(),
      handle: user.handle.split('&')[0].trim(),
      text,
      likes: 0,
      category
    });
    composeInput.value = '';
    render();
    toast('Post added!');
  });

  const compose = $el('div',{class:'compose'}, [
    composeInput,
    categorySelect,
    composeBtn
  ]);

  let visiblePosts = activeCategory ? posts.filter(p => p.category === activeCategory) : posts;

  const feed = $el('div',{class:'feed'}, visiblePosts.length
    ? visiblePosts.map(p => PostCard(p))
    : $el('p',{class:'muted', text:'No posts in this category yet 😅'})
  );
  
  return $el('div',{class:'main-col'}, [compose, feed]);
}

/* ---------- Right Column ---------- */
function RightColumn(){
  const title = $el('h3',{text:'Games & Rewards'});
  const gamesGrid = $el('div',{class:'games-grid'}, games.map(g =>
    $el('div',{class:'game-card'}, [
      $el('div',{}, [$el('strong',{text:g.name}), $el('div',{class:'small', text:g.desc})]),
      $el('button',{class:'btn', text:'Play', onClick:()=>toast(`Launch ${g.name} (mock)`)})
    ])
  ));

  const marketTitle = $el('h4',{text:'Marketplace Picks'});
  const marketList = $el('div',{}, market.map(m =>
    $el('div',{class:'card', style:'margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;'}, [
      $el('div',{}, [$el('div',{text:m.title}), $el('div',{class:'muted', text:`by ${m.seller}`})]),
      $el('div',{}, [$el('div',{text:`₦${m.price}`}), $el('button',{class:'btn', text:'Buy', onClick:()=>toast(`Bought ${m.title} (mock)`)})])
    ])
  ));

  return $el('div',{class:'right-col'}, [title, gamesGrid, marketTitle, marketList]);
}

/* ---------- Helpers ---------- */
function toast(message){
  let el = document.querySelector('.sys-toast');
  if(!el){
    el = $el('div',{class:'sys-toast'});
    el.style.position = 'fixed';
    el.style.bottom = '20px';
    el.style.left = '50%';
    el.style.transform = 'translateX(-50%)';
    el.style.background = 'linear-gradient(90deg,var(--green),var(--blue))';
    el.style.color = '#fff';
    el.style.padding = '10px 18px';
    el.style.borderRadius = '999px';
    el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
    el.style.transition = 'opacity .34s ease';
    el.style.opacity = '0';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(()=> { el.style.opacity = '0'; }, 2000);
}

function likePost(id){
  const p = posts.find(x=>x.id===id);
  if(!p) return;
  p.likes++;
  render();
}

/* ---------- Render ---------- */
function render(){
  app.innerHTML = '';
  const left = LeftColumn();
  const main = MainColumn();
  const right = RightColumn();
  const container = $el('div',{class:'app-root'}, [left, main, right]);
  const bottom = $el('div',{class:'bottom-nav'}, [
    $el('button',{class:'btn ghost', text:'Home', onClick:()=>toast('Home')}),
    $el('button',{class:'btn ghost', text:'Games', onClick:()=>toast('Games')}),
    $el('button',{class:'btn ghost', text:'Market', onClick:()=>toast('Market')}),
    $el('button',{class:'btn', text:'Wallet', onClick:()=>toast('Wallet opened')})
  ]);
  app.appendChild(container);
  app.appendChild(bottom);
}

/* ---------- Init ---------- */
function init(){
  render();
}
init();