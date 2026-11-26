// PERSONALIZE HERE. No other files need to change for the names or letter.
const CONFIG = {
  name: 'Vishnupriya', // her name, e.g. 'Anu'
  from: 'ABHIJITH', // sender's name
  birthday: new Date(Date.now() + 10000).toISOString(), // Midnight IST. Keep this for deployment.
  wish: 'Here’s to nineteen, new beginnings, favourite books, beautiful skies and all the little things that make life wonderful.',
  solo: 'assets/images/portrait-1.webp',
  photos: [
    {src: 'assets/images/portrait-1.webp', caption: 'A little elegance.'},
    {src: 'assets/images/portrait-2.webp', caption: 'A page full of smiles.'},
    {src: 'assets/images/portrait-3.webp', caption: 'A moment of quiet beauty.'},
    {src: 'assets/images/portrait-4.webp', caption: 'A little lavender magic.'}
  ],
  // Replace this draft later. Use \n\n for a new paragraph or a template literal.
  letter: `Vishnupriya!

  Happy birthdayyy : )
  
  I wasn't really sure what to write here honestly. We've barely had that many conversations, and I know we're not exactly close, but I still wanted to write you something instead of just sending a birthday text and leaving it at that.
  
  I still remember some of our little conversations, even the ones that were just about exams, notes or random college stuff. They're probably pretty ordinary, but I guess I just wanted to say that I did appreciate those moments.
  
  Anyway, I didn't want your birthday to pass without wishing you properly. I hope you have a really lovely day. Take care : )
  
  Happy birthday once again!`
  };
// Preload all portrait images in the background
const preloadedImages = CONFIG.photos.map(photo => {
    const img = new Image();
    img.fetchPriority = 'high';
    img.src = photo.src;
    return img;
});
const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
// Local testing only, never active on GitHub Pages. ?test=10 or ?preview=1
const local = location.protocol === 'file:' || ['localhost','127.0.0.1','::1','[::1]'].includes(location.hostname);
let deadline = new Date(CONFIG.birthday).getTime();
if (local && params.get('test') === '10') deadline = Date.now() + 10000;
if (local && params.get('preview') === '1') deadline = Date.now();
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const chapters = [...document.querySelectorAll('.chapter')];
let chapter = 0, photo = 0, unlocked = false, timerId;
document.querySelectorAll('[data-name-inline]').forEach(el => el.textContent = CONFIG.name.trim() ? ', ' + CONFIG.name.trim() : '');
$('wish').textContent = CONFIG.wish;
$('salutation').textContent = CONFIG.name.trim() ? 'Dear ' + CONFIG.name.trim() + ',' : 'A little birthday note,';
$('letterText').textContent = CONFIG.letter;
$('signature').textContent = CONFIG.from.trim() ? '— ' + CONFIG.from.trim() : '';
$('signature').hidden = !CONFIG.from.trim();
for (let i = 0; i < 65; i++) {
  const s = document.createElement('span'); s.className = 'star';
  const size = 1 + Math.random() * 2.2;
  s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${size}px;height:${size}px;animation-delay:-${Math.random()*4}s`;
  $('stars').append(s);
}
chapters.forEach(() => $('chapterDots').append(document.createElement('span')));
function showChapter(n, focus = true) {
  chapter = Math.max(0, Math.min(n, chapters.length-1));
  chapters.forEach((el,i) => el.hidden = i !== chapter);
  [...$('chapterDots').children].forEach((el,i) => el.classList.toggle('active',i===chapter));
  $('progress').textContent = `${chapter+1} / ${chapters.length}`;
  $('back').disabled = chapter===0;
  window.scrollTo(0,0);
  if (focus) chapters[chapter].querySelector('h1').focus({preventScroll:true});
}
function confetti() {
  if (reduced) return;
  for(let i=0;i<45;i++) {
    const el=document.createElement('span');el.className='confetti';el.textContent=i%3===0?'✦':'▪';
    el.style.cssText=`left:${Math.random()*100}%;color:${['#f6dba0','#d8c5f2','#fff1dc'][i%3]};animation-delay:${Math.random()*.7}s`;
    document.body.append(el);setTimeout(()=>el.remove(),3500);
  }
}
function unlock() {
  if (unlocked) return; unlocked = true; clearInterval(timerId);
  $('solo').src = CONFIG.solo; showPhoto(0);
  $('countdown').hidden = true; $('story').hidden = false;
  showChapter(0,false); confetti();
}
function tick() {
  const left = Math.max(0, Math.ceil((deadline-Date.now())/1000));
  if (left===0) {unlock();return;}
  $('hours').textContent = String(Math.floor(left/3600)).padStart(2,'0');
  $('minutes').textContent = String(Math.floor(left/60)%60).padStart(2,'0');
  $('seconds').textContent = String(left%60).padStart(2,'0');
}
document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>showChapter(chapter+1)));
$('back').addEventListener('click',()=>showChapter(chapter-1));
function resetInteractions() {
  document.querySelectorAll('.candle').forEach(c=>{c.classList.remove('out');c.disabled=false;});
  $('cakeMessage').textContent='Tap the three candles to make your wish.';
  $('envelope').hidden=false; $('envelope').classList.remove('open');$('envelope').disabled=false;
  $('envelope').setAttribute('aria-expanded','false');$('letter').hidden=true;showPhoto(0);
}
$('restart').addEventListener('click',()=>{resetInteractions();showChapter(0);});
document.querySelectorAll('.candle').forEach(c=>c.addEventListener('click',()=>{
  c.classList.add('out');c.disabled=true;
  if (document.querySelectorAll('.candle.out').length===3) {
    $('cakeMessage').textContent='May even the wishes you keep to yourself come true.';confetti();
  }
}));
CONFIG.photos.forEach((_,i)=>{const button=document.createElement('button');button.setAttribute('aria-label',`Show photo ${i+1}`);button.addEventListener('click',()=>showPhoto(i));$('photoDots').append(button);});
function showPhoto(n) {
  if(!CONFIG.photos.length) return;
  photo=(n+CONFIG.photos.length)%CONFIG.photos.length; const p=CONFIG.photos[photo];
  const img=$('galleryPhoto');img.src=p.src;img.alt=`Birthday portrait ${photo+1} of ${CONFIG.photos.length}`;
  img.classList.remove('swap');void img.offsetWidth;img.classList.add('swap');
  $('caption').textContent=p.caption;
  [...$('photoDots').children].forEach((el,i)=>el.setAttribute('aria-current',String(i===photo)));
}
$('prevPhoto').addEventListener('click',()=>showPhoto(photo-1));$('nextPhoto').addEventListener('click',()=>showPhoto(photo+1));
let touchX=0,touchY=0;
$('polaroid').addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;touchY=e.changedTouches[0].clientY;},{passive:true});
$('polaroid').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX,dy=e.changedTouches[0].clientY-touchY;if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy))showPhoto(photo+(dx<0?1:-1));},{passive:true});
$('envelope').addEventListener('click',()=>{
  $('envelope').disabled=true;$('envelope').classList.add('open');$('envelope').setAttribute('aria-expanded','true');
  setTimeout(()=>{$('envelope').hidden=true;$('letter').hidden=false;},reduced?0:550);
});
if (!unlocked) {timerId=setInterval(tick,250);tick();}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!unlocked)tick();});
