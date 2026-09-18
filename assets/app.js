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
  if(card.dataset.quick)renderQuickTool(card.dataset.quick);
  if(card.dataset.convert)renderFileTool(card.dataset.convert);
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

const quickTools={
  character:{icon:'🔢',title:'Penghitung Karakter',desc:'Hitung karakter, kata, baris, dan spasi.',html:`<div class="quick-form"><textarea id="qText" placeholder="Ketik atau tempel teks di sini..."></textarea><div class="quick-stats" id="qStats"></div></div>`,init(){const run=()=>{const s=$('#qText').value;$('#qStats').innerHTML=`<div><b>${s.length}</b>Karakter</div><div><b>${s.trim()?s.trim().split(/\s+/).length:0}</b>Kata</div><div><b>${s? s.split(/\n/).length:0}</b>Baris</div><div><b>${(s.match(/\s/g)||[]).length}</b>Spasi</div>`};$('#qText').oninput=run;run()}},
  case:{icon:'🔠',title:'Konversi Huruf',desc:'Ubah kapitalisasi teks.',html:textAreaActions(['UPPERCASE','lowercase','Format Judul']),init(){bindTextActions([s=>s.toUpperCase(),s=>s.toLowerCase(),s=>s.toLowerCase().replace(/\b\p{L}/gu,c=>c.toUpperCase())])}},
  sort:{icon:'↕️',title:'Urutkan Daftar',desc:'Satu item per baris.',html:textAreaActions(['A–Z','Z–A','Acak']),init(){bindTextActions([s=>lines(s).sort((a,b)=>a.localeCompare(b)).join('\n'),s=>lines(s).sort((a,b)=>b.localeCompare(a)).join('\n'),s=>lines(s).sort(()=>Math.random()-.5).join('\n')])}},
  replace:{icon:'✏️',title:'Cari & Ganti Teks',desc:'Ganti kata atau frasa.',html:`<div class="quick-form"><textarea id="qInput" placeholder="Tempel teks..."></textarea><input id="qFind" placeholder="Cari"><input id="qReplace" placeholder="Ganti dengan"><div class="quick-actions"><button class="primary-action" id="qRun">Ganti semua</button></div><div class="quick-output" id="qOutput">Hasil muncul di sini</div></div>`,init(){qRun.onclick=()=>qOutput.textContent=qInput.value.split(qFind.value).join(qReplace.value)}},
  password:{icon:'🔑',title:'Pembuat Sandi',desc:'Buat sandi acak yang kuat.',html:`<div class="quick-form"><label>Panjang sandi <input id="qLength" type="number" min="6" max="128" value="16"></label><div class="quick-actions"><button class="primary-action" id="qRun">Buat sandi</button></div><div class="quick-output" id="qOutput"></div></div>`,init(){qRun.onclick=()=>{const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';qOutput.textContent=Array.from(crypto.getRandomValues(new Uint32Array(+qLength.value)),n=>chars[n%chars.length]).join('')};qRun.click()}},
  random:{icon:'🎟️',title:'Undian Acak',desc:'Masukkan satu pilihan per baris.',html:`<div class="quick-form"><textarea id="qInput" placeholder="Andi\nBudi\nCitra"></textarea><div class="quick-actions"><button class="primary-action" id="qRun">Undi sekarang</button></div><div class="quick-output" id="qOutput">Pemenang muncul di sini</div></div>`,init(){qRun.onclick=()=>{const a=lines(qInput.value);qOutput.textContent=a.length?'🎉 '+a[Math.floor(Math.random()*a.length)]:'Masukkan daftar lebih dulu'}}},
  dice:{icon:'🎲',title:'Lempar Dadu',desc:'Pilih jumlah dadu lalu lempar.',html:`<div class="quick-form"><label>Jumlah dadu <input id="qCount" type="number" min="1" max="6" value="2"></label><div class="quick-actions"><button class="primary-action" id="qRun">Lempar</button></div><div class="quick-output" id="qOutput"></div></div>`,init(){qRun.onclick=()=>{const a=Array.from({length:+qCount.value},()=>1+Math.floor(Math.random()*6));qOutput.textContent=`${a.join('  •  ')}\nTotal: ${a.reduce((x,y)=>x+y,0)}`};qRun.click()}},
  coin:{icon:'🪙',title:'Lempar Koin',desc:'Kepala atau ekor?',html:`<div class="quick-form"><div class="quick-actions"><button class="primary-action" id="qRun">Lempar koin</button></div><div class="quick-output" id="qOutput">Tekan tombol untuk mulai</div></div>`,init(){qRun.onclick=()=>qOutput.textContent=Math.random()<.5?'🪙 KEPALA':'🪙 EKOR'}},
  dataunit:{icon:'💾',title:'Konverter Kapasitas Data',desc:'Konversi satuan data berbasis 1024.',html:converterHtml(['Byte','KB','MB','GB','TB']),init(){bindConverter({Byte:1,KB:1024,MB:1048576,GB:1073741824,TB:1099511627776})}},
  timestamp:{icon:'🕒',title:'Konversi Timestamp',desc:'Konversi Unix timestamp dan tanggal.',html:`<div class="quick-form"><input id="qInput" placeholder="Contoh: 1760000000 atau 2026-09-18 17:30"><div class="quick-actions"><button class="primary-action" id="qRun">Konversi</button></div><div class="quick-output" id="qOutput"></div></div>`,init(){qRun.onclick=()=>{const v=qInput.value.trim(),d=/^\d+$/.test(v)?new Date(+v*(v.length<=10?1000:1)):new Date(v);qOutput.textContent=isNaN(d)?'Format tidak valid':`${d.toLocaleString('id-ID')}\nUnix: ${Math.floor(d.getTime()/1000)}`}}},
  url:{icon:'🔗',title:'Encode & Decode URL',desc:'Konversi teks ke format URL.',html:textAreaActions(['Encode','Decode']),init(){bindTextActions([s=>encodeURIComponent(s),s=>decodeURIComponent(s)])}},
  base64:{icon:'🧬',title:'Base64 Teks',desc:'Encode atau decode teks UTF-8.',html:textAreaActions(['Encode','Decode']),init(){bindTextActions([s=>btoa(unescape(encodeURIComponent(s))),s=>decodeURIComponent(escape(atob(s)))])}},
  json:{icon:'📘',title:'Format JSON',desc:'Rapikan atau ringkas JSON.',html:textAreaActions(['Rapikan','Ringkas']),init(){bindTextActions([s=>JSON.stringify(JSON.parse(s),null,2),s=>JSON.stringify(JSON.parse(s))],true)}},
  uuid:{icon:'#️⃣',title:'Pembuat UUID',desc:'Hasilkan identifier unik versi 4.',html:`<div class="quick-form"><div class="quick-actions"><button class="primary-action" id="qRun">Buat UUID</button></div><div class="quick-output" id="qOutput"></div></div>`,init(){qRun.onclick=()=>qOutput.textContent=crypto.randomUUID();qRun.click()}},
  percent:{icon:'％',title:'Kalkulator Persen',desc:'Hitung berapa persen dari suatu nilai.',html:`<div class="quick-form"><input id="qPercent" type="number" placeholder="Persen, contoh 20"><input id="qValue" type="number" placeholder="Nilai, contoh 150000"><div class="quick-actions"><button class="primary-action" id="qRun">Hitung</button></div><div class="quick-output" id="qOutput"></div></div>`,init(){qRun.onclick=()=>qOutput.textContent=`${qPercent.value}% dari ${qValue.value} = ${(+qPercent.value*+qValue.value/100).toLocaleString('id-ID')}`}}
};
function lines(s){return s.split(/\r?\n/).map(x=>x.trim()).filter(Boolean)}
function textAreaActions(labels){return `<div class="quick-form"><textarea id="qInput" placeholder="Ketik atau tempel teks..."></textarea><div class="quick-actions">${labels.map((x,i)=>`<button data-qaction="${i}" class="${i===0?'primary-action':''}">${x}</button>`).join('')}</div><div class="quick-output" id="qOutput">Hasil muncul di sini</div></div>`}
function bindTextActions(fns,catchError=false){$$('[data-qaction]').forEach(b=>b.onclick=()=>{try{qOutput.textContent=fns[+b.dataset.qaction](qInput.value)}catch(e){qOutput.textContent=catchError?'JSON tidak valid':'Input tidak valid'}})}
function converterHtml(units){return `<div class="quick-form"><input id="qValue" type="number" value="1"><select id="qFrom">${units.map(x=>`<option>${x}</option>`).join('')}</select><select id="qTo">${units.map((x,i)=>`<option ${i===2?'selected':''}>${x}</option>`).join('')}</select><div class="quick-actions"><button class="primary-action" id="qRun">Konversi</button></div><div class="quick-output" id="qOutput"></div></div>`}
function bindConverter(map){qRun.onclick=()=>qOutput.textContent=(+qValue.value*map[qFrom.value]/map[qTo.value]).toLocaleString('id-ID',{maximumFractionDigits:8})+' '+qTo.value;qRun.click()}
function renderQuickTool(key){const t=quickTools[key];if(!t)return;$('#quickIcon').textContent=t.icon;$('#quickTitle').textContent=t.title;$('#quickDescription').textContent=t.desc;$('#quickToolBody').innerHTML=t.html;t.init()}
$('#year').textContent=new Date().getFullYear();

const fileToolConfigs={
  'docx-pdf':{icon:'📄',title:'Word ke PDF',desc:'Konversi dokumen DOCX menjadi PDF.',accept:'.docx',multiple:false,hint:'Pilih satu file DOCX · tata letak kompleks mungkin sedikit berubah',note:'Teks, tabel sederhana, dan gambar didukung. Hasil bisa berbeda dari Microsoft Word.'},
  'pdf-docx':{icon:'📝',title:'PDF ke Word',desc:'Ekstrak teks PDF menjadi dokumen Word.',accept:'.pdf,application/pdf',multiple:false,hint:'Pilih satu file PDF berbasis teks',note:'PDF hasil scan perlu OCR dan belum didukung. Tata letak kompleks akan disederhanakan.'},
  'image-pdf':{icon:'🖼️',title:'JPG/PNG ke PDF',desc:'Gabungkan gambar menjadi PDF.',accept:'image/jpeg,image/png',multiple:true,hint:'Pilih satu atau beberapa JPG/PNG · urutan mengikuti pilihan'},
  'pdf-jpg':{icon:'📸',title:'PDF ke JPG',desc:'Ubah halaman PDF menjadi JPG.',accept:'.pdf,application/pdf',multiple:false,hint:'Pilih satu PDF · hasil banyak halaman diunduh sebagai ZIP'},
  'pptx-pdf':{icon:'📊',title:'PPT ke PDF',desc:'Ekstrak isi presentasi PPTX ke PDF.',accept:'.pptx',multiple:false,hint:'Pilih satu file PPTX',note:'Versi ringan mengekstrak teks per slide. Desain, animasi, dan grafik kompleks tidak ikut.'},
  'merge-pdf':{icon:'🧩',title:'Gabungkan PDF',desc:'Satukan beberapa PDF menjadi satu.',accept:'.pdf,application/pdf',multiple:true,hint:'Pilih minimal dua PDF · urutan mengikuti pilihan'},
  'split-pdf':{icon:'✂️',title:'Pisahkan PDF',desc:'Ambil halaman tertentu dari PDF.',accept:'.pdf,application/pdf',multiple:false,hint:'Pilih satu PDF lalu tentukan halaman',range:true}
};
let activeFileTool='',selectedDocumentFiles=[];
function renderFileTool(key){
  const c=fileToolConfigs[key];if(!c)return;activeFileTool=key;selectedDocumentFiles=[];
  $('#fileToolIcon').textContent=c.icon;$('#fileToolTitle').textContent=c.title;$('#fileToolDescription').textContent=c.desc;
  const input=$('#documentInput');input.value='';input.accept=c.accept;input.multiple=c.multiple;
  $('#fileToolHint').textContent=c.hint;$('#conversionNote').textContent=c.note||'Semua proses berlangsung di perangkat. File tidak diunggah ke server.';
  $('#selectedFiles').classList.add('hidden');$('#runFileConversion').classList.add('hidden');$('#pageRangeWrap').classList.toggle('hidden',!c.range);
}
$('#pickDocument').onclick=()=>$('#documentInput').click();
$('#documentInput').onchange=e=>{
  selectedDocumentFiles=[...e.target.files];if(!selectedDocumentFiles.length)return;
  $('#selectedFiles').innerHTML=selectedDocumentFiles.map((f,i)=>`<div><span>${i+1}. ${escapeHtml(f.name)}</span><b>${formatBytes(f.size)}</b></div>`).join('');
  $('#selectedFiles').classList.remove('hidden');$('#runFileConversion').classList.remove('hidden');
};
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000)}
function safeBase(name){return name.replace(/\.[^.]+$/,'').replace(/[^\p{L}\p{N}_-]+/gu,'-')||'hasil'}
function parsePages(value,total){const out=new Set();value.split(',').forEach(part=>{const [a,b]=part.trim().split('-').map(Number);if(!a)return;for(let i=a;i<=Math.min(b||a,total);i++)if(i>0)out.add(i-1)});return [...out].sort((a,b)=>a-b)}
async function canvasToJpeg(canvas,quality=.9){return new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality))}
async function pdfTextPages(buffer){
  const pdf=await pdfjsLib.getDocument({data:buffer}).promise,pages=[];
  for(let n=1;n<=pdf.numPages;n++){const p=await pdf.getPage(n),content=await p.getTextContent();pages.push(content.items.map(x=>x.str).join(' '))}return pages;
}
$('#runFileConversion').onclick=async()=>{
  const button=$('#runFileConversion');if(!selectedDocumentFiles.length)return toast('Pilih file terlebih dahulu');
  button.disabled=true;button.textContent='Memproses…';
  try{
    if(activeFileTool==='image-pdf'){
      const pdf=await PDFLib.PDFDocument.create();for(const f of selectedDocumentFiles){const bytes=await f.arrayBuffer(),img=f.type==='image/png'?await pdf.embedPng(bytes):await pdf.embedJpg(bytes);const size=img.scale(1),landscape=size.width>size.height,page=pdf.addPage(landscape?[841.89,595.28]:[595.28,841.89]),pw=page.getWidth()-40,ph=page.getHeight()-40,scale=Math.min(pw/size.width,ph/size.height);page.drawImage(img,{x:(page.getWidth()-size.width*scale)/2,y:(page.getHeight()-size.height*scale)/2,width:size.width*scale,height:size.height*scale})}downloadBlob(new Blob([await pdf.save()],{type:'application/pdf'}),'gambar-gabungan.pdf');
    }else if(activeFileTool==='merge-pdf'){
      if(selectedDocumentFiles.length<2)throw new Error('Pilih minimal dua file PDF');const out=await PDFLib.PDFDocument.create();for(const f of selectedDocumentFiles){const src=await PDFLib.PDFDocument.load(await f.arrayBuffer()),pages=await out.copyPages(src,src.getPageIndices());pages.forEach(p=>out.addPage(p))}downloadBlob(new Blob([await out.save()],{type:'application/pdf'}),'pdf-gabungan.pdf');
    }else if(activeFileTool==='split-pdf'){
      const src=await PDFLib.PDFDocument.load(await selectedDocumentFiles[0].arrayBuffer()),indices=parsePages($('#pageRange').value,src.getPageCount());if(!indices.length)throw new Error('Isi halaman, misalnya 1-3, 5');const out=await PDFLib.PDFDocument.create(),pages=await out.copyPages(src,indices);pages.forEach(p=>out.addPage(p));downloadBlob(new Blob([await out.save()],{type:'application/pdf'}),'pdf-halaman-terpilih.pdf');
    }else if(activeFileTool==='pdf-jpg'){
      const f=selectedDocumentFiles[0],pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise,zip=new JSZip();for(let n=1;n<=pdf.numPages;n++){const page=await pdf.getPage(n),viewport=page.getViewport({scale:2}),canvas=document.createElement('canvas');canvas.width=viewport.width;canvas.height=viewport.height;await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;zip.file(`halaman-${n}.jpg`,await canvasToJpeg(canvas))}downloadBlob(await zip.generateAsync({type:'blob'}),safeBase(f.name)+'-jpg.zip');
    }else if(activeFileTool==='pdf-docx'){
      const f=selectedDocumentFiles[0],pages=await pdfTextPages(await f.arrayBuffer()),children=[];pages.forEach((text,i)=>{if(i)children.push(new docx.Paragraph({children:[new docx.PageBreak()]}));children.push(new docx.Paragraph({text,spacing:{line:360}}))});const blob=await docx.Packer.toBlob(new docx.Document({sections:[{children}]}));downloadBlob(blob,safeBase(f.name)+'.docx');
    }else if(activeFileTool==='docx-pdf'){
      const f=selectedDocumentFiles[0],result=await mammoth.convertToHtml({arrayBuffer:await f.arrayBuffer()}),box=document.createElement('div');box.className='pdf-render-source';box.innerHTML=result.value;document.body.appendChild(box);const {jsPDF}=window.jspdf,pdf=new jsPDF({unit:'pt',format:'a4'});await pdf.html(box,{margin:[40,40,40,40],autoPaging:'text',width:515,windowWidth:760});box.remove();pdf.save(safeBase(f.name)+'.pdf');
    }else if(activeFileTool==='pptx-pdf'){
      const f=selectedDocumentFiles[0],zip=await JSZip.loadAsync(await f.arrayBuffer()),slides=Object.keys(zip.files).filter(x=>/^ppt\/slides\/slide\d+\.xml$/.test(x)).sort((a,b)=>(+a.match(/\d+/)[0])-(+b.match(/\d+/)[0])),{jsPDF}=window.jspdf,pdf=new jsPDF({orientation:'landscape',unit:'pt',format:'a4'});for(let i=0;i<slides.length;i++){if(i)pdf.addPage('a4','landscape');const xml=await zip.file(slides[i]).async('text'),doc=new DOMParser().parseFromString(xml,'text/xml'),texts=[...doc.getElementsByTagName('a:t')].map(n=>n.textContent).filter(Boolean);pdf.setFontSize(15);pdf.text(pdf.splitTextToSize(texts.join('\n\n')||'(Slide tanpa teks)',720),55,65)}pdf.save(safeBase(f.name)+'.pdf');
    }
    toast('Konversi selesai');
  }catch(err){console.error(err);toast(err.message||'Konversi gagal. Periksa format file.')}finally{button.disabled=false;button.textContent='Konversi & unduh'}
};
if(window.pdfjsLib)pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
