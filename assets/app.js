const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2200)};
const state={};

const toolSearch=$('#toolSearch'),toolCards=[...$$('.tool-card')];
function filterTools(query='',category='all'){
  const q=query.trim().toLowerCase();let visible=0;
  toolCards.forEach(card=>{const matchText=!q||(card.dataset.name||card.textContent).toLowerCase().includes(q);const matchCategory=category==='all'||(card.dataset.category||'').split(' ').includes(category);const show=matchText&&matchCategory;card.classList.toggle('filtered-out',!show);if(show)visible++});
  $('#noResults').classList.toggle('hidden',visible>0);
}
toolSearch.addEventListener('input',()=>{filterTools(toolSearch.value,$('.category.active')?.dataset.filter||'all');if(location.hash!=='#alat')location.hash='alat'});
$$('.category').forEach(button=>button.onclick=()=>{$$('.category').forEach(x=>x.classList.remove('active'));button.classList.add('active');filterTools(toolSearch.value,button.dataset.filter)});
$$('[data-query]').forEach(button=>button.onclick=()=>{toolSearch.value=button.dataset.query;filterTools(toolSearch.value,'all');$$('.category').forEach(x=>x.classList.toggle('active',x.dataset.filter==='all'));location.hash='alat'});
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();toolSearch.focus()}});

$$('[data-open]').forEach(card=>card.onclick=()=>{
  $$('.tool-panel').forEach(p=>p.classList.remove('active'));
  $('#'+card.dataset.open).classList.add('active');
  $('#workspace').classList.remove('hidden');
  setTimeout(()=>$('#workspace').scrollIntoView({behavior:'smooth',block:'start'}),40);
});
$('#closeWorkspace').onclick=()=>$('#workspace').classList.add('hidden');
$$('.choose-file').forEach(b=>b.onclick=()=>$('#'+b.dataset.pick).click());

function formatBytes(n){if(n<1024)return n+' B';if(n<1048576)return(n/1024).toFixed(1)+' KB';return(n/1048576).toFixed(2)+' MB'}
function loadImage(file){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=URL.createObjectURL(file)})}
async function prepareImage(input){
  const file=input.files[0];
  if(!file||!/^image\/(jpeg|png|webp)$/.test(file.type))return toast('Pilih gambar JPG, PNG, atau WEBP');
  const mode=input.id.replace('Input',''),img=await loadImage(file),editor=$('#'+mode+'Editor');
  state[mode]={file,img,ratio:img.width/img.height};
  editor.querySelector('.image-preview').src=img.src;
  editor.querySelector('.file-info').textContent=`${file.name} · ${img.width} × ${img.height} px · ${formatBytes(file.size)}`;
  editor.classList.remove('hidden');
  if(mode==='resize'){$('#resizeWidth').value=img.width;$('#resizeHeight').value=img.height}
}
$$('.image-source').forEach(input=>input.onchange=()=>prepareImage(input));
$('#compressQuality').oninput=e=>$('#compressQualityText').textContent=e.target.value+'%';
$('#resizeWidth').oninput=e=>{const s=state.resize;if(s&&$('#resizeLock').checked)$('#resizeHeight').value=Math.max(1,Math.round(+e.target.value/s.ratio))};
$('#resizeHeight').oninput=e=>{const s=state.resize;if(s&&$('#resizeLock').checked)$('#resizeWidth').value=Math.max(1,Math.round(+e.target.value*s.ratio))};

function exportImage(mode){
  const s=state[mode];if(!s)return toast('Pilih gambar terlebih dahulu');
  let w=s.img.width,h=s.img.height,type=s.file.type,quality=.9,suffix=mode;
  if(mode==='compress'){quality=+$('#compressQuality').value/100;type=s.file.type==='image/png'?'image/webp':s.file.type}
  if(mode==='resize'){w=+$('#resizeWidth').value;h=+$('#resizeHeight').value;quality=.92}
  if(mode==='convert'){type=$('#convertFormat').value;quality=.92;suffix=type.split('/')[1]}
  if(!w||!h||w*h>120000000)return toast('Dimensi gambar tidak valid atau terlalu besar');
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext('2d');if(type==='image/jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h)}ctx.drawImage(s.img,0,0,w,h);
  canvas.toBlob(blob=>{if(!blob)return toast('Format ini tidak didukung browser');const a=document.createElement('a'),ext=type.split('/')[1].replace('jpeg','jpg');a.href=URL.createObjectURL(blob);a.download=(s.file.name.replace(/\.[^.]+$/,'')||'gambar')+`-${suffix}.${ext}`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2500);toast(`Selesai · ${formatBytes(blob.size)}`)},type,quality);
}
$$('.process-image').forEach(b=>b.onclick=()=>exportImage(b.dataset.mode));

let expression='';
function renderCalc(v){$('#calcDisplay').value=v||'0'}
$$('[data-val]').forEach(b=>b.onclick=()=>{const v=b.dataset.val;if(expression==='Error')expression='';if(/[+\-*/%]$/.test(expression)&&/[+\-*/%]/.test(v))expression=expression.slice(0,-1);expression+=v;renderCalc(expression.replace(/\*/g,'×').replace(/\//g,'÷'))});
$$('[data-calc]').forEach(b=>b.onclick=()=>{if(b.dataset.calc==='clear')expression='';if(b.dataset.calc==='back')expression=expression.slice(0,-1);if(b.dataset.calc==='equals'){try{if(!/^[0-9+\-*/%.() ]+$/.test(expression))throw 0;const result=Function('"use strict";return ('+expression+')')();expression=Number.isFinite(result)?String(Math.round(result*1e10)/1e10):'Error'}catch{expression='Error'}}renderCalc(expression)});

const captionTemplates={
  santai:[t=>`Lagi menikmati ${t}. Hal sederhana yang bikin hari terasa lebih menyenangkan ✨`,t=>`${t} dulu, urusan lain menyusul 😌 Siapa yang sama?`,t=>`Hari ini ditemani ${t}. Kadang bahagia memang sesederhana itu 💜`],
  promosi:[t=>`Saatnya coba ${t}! Kualitas pilihan, praktis, dan siap menemani harimu. Yuk, pesan sekarang 🛍️`,t=>`Sedang cari ${t}? Ini waktunya mendapatkan pilihan terbaik. Jangan sampai kehabisan!`,t=>`${t} yang kamu tunggu sudah hadir ✨ Klik, pesan, dan nikmati hari ini.`],
  inspiratif:[t=>`${t} mengingatkan kita: langkah kecil hari ini bisa menjadi perubahan besar esok hari.`,t=>`Mulai saja dari ${t}. Tidak harus sempurna, yang penting terus bertumbuh 🌱`,t=>`Setiap cerita hebat punya awal. Biarkan ${t} menjadi bagian dari perjalananmu.`],
  lucu:[t=>`Katanya bahagia itu mahal. Untung masih ada ${t} 😂`,t=>`Rencana hari ini: fokus. Kenyataannya: kepikiran ${t} terus 🤭`,t=>`${t}: 1, niat produktif: 0. Besok kita coba lagi! 😄`]
};
$('#makeCaption').onclick=()=>{const topic=$('#captionTopic').value.trim(),tone=$('#captionTone').value,platform=$('#captionPlatform').value;if(!topic)return toast('Isi topik atau produk dulu');const tags=topic.toLowerCase().replace(/[^a-z0-9\s]/gi,'').split(/\s+/).filter(Boolean).slice(0,3).map(x=>'#'+x).join(' ');$('#captionResults').innerHTML=captionTemplates[tone].map((fn,i)=>`<div class="caption-item"><p>${escapeHtml(fn(topic))}<br><small>${tags} #${platform.toLowerCase()}</small></p><button class="copy-caption" data-copy="${i}">Salin</button></div>`).join('');$$('.copy-caption').forEach((b,i)=>b.onclick=async()=>{await navigator.clipboard.writeText($('#captionResults').children[i].innerText.replace('Salin','').trim());toast('Caption disalin')})};
function escapeHtml(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}
$('#year').textContent=new Date().getFullYear();
