const products=[
{name:'화들짝 케이스',price:'15,000원',kind:'cream',cutout:'assets/c-1.png',image:'assets/provided-startled.png',caseType:'에폭시 범퍼 케이스',magsafe:null},
{name:'블루리본 케이스',price:'15,000원',kind:'blue',cutout:'assets/c-2.png',image:'assets/provided-blue.png',caseType:'에폭시 범퍼 케이스',magsafe:null},
{name:'핑크 큐피드 케이스',price:'15,000원',kind:'',cutout:'assets/c-3.png',image:'assets/provided-cupid.png',caseType:'에폭시 범퍼 케이스',magsafe:null},
{name:'해피 케이스',price:'8,000원',kind:'clear',cutout:'assets/c-4.png',image:'assets/provided-happy.png',caseType:'투명 케이스',magsafe:null},
{name:'네잎클로버 케이스',price:'8,000원',kind:'clover',cutout:'assets/c-5.png',image:'assets/provided-clover.png',caseType:'투명 케이스',magsafe:null}];
const site=document.querySelector('#site');const images=Object.fromEntries(products.map((p,i)=>[i,p.image]));
function photo(i){const p=products[i];return `<div class="photo ${p.kind}" data-product="${i}"><span class="camera"></span><span class="photo-label">${p.name.toUpperCase()}<br><small>iPhone 16 Pro 목업</small></span></div>`}
function card(i){const p=products[i];return `<button class="card" data-open="${i}" aria-label="${p.name} 상세 미리보기">${photo(i)}<div class="card-bottom"><h3>${p.name}</h3><p>${p.price}</p></div></button>`}
document.querySelector('#cards').innerHTML=[2,1,4,3].map(card).join('');
document.querySelector('#cards').insertAdjacentHTML('beforeend',card(0));document.querySelector('#cards [data-open="0"]').hidden=true;
document.querySelector('#show-more').onclick=()=>{const el=document.querySelector('#cards [data-open="0"]');el.hidden=!el.hidden;document.querySelector('#show-more').setAttribute('aria-expanded',String(!el.hidden));document.querySelector('#show-more').textContent=el.hidden?'제품 더보기 ＋':'제품 접기 −';if(!el.hidden)sync()};
const directions={romance:'PICKYOU / PLAYFUL ROMANCE',editorial:'02 / QUIET EDITORIAL — 세리프와 넓은 여백, 감각적인 매거진',play:'03 / LUCKY PLAYGROUND — 코발트블루와 핑크, 유쾌한 포스터'};
function theme(value){if(!directions[value])value='romance';site.className=value;document.querySelectorAll('[data-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===value)));document.querySelector('#direction').textContent=directions[value];history.replaceState(null,'',`?concept=${value}${location.hash}`)}
document.querySelectorAll('[data-theme]').forEach(b=>b.onclick=()=>theme(b.dataset.theme));theme('romance');
const assetDialog=document.querySelector('#asset-dialog');document.querySelector('#assets').onclick=()=>assetDialog.showModal();document.querySelectorAll('dialog .close').forEach(b=>b.onclick=()=>b.closest('dialog').close());document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
document.querySelector('#uploads').innerHTML=products.map((p,i)=>`<label>${String(i+1).padStart(2,'0')} / ${p.name}<input type="file" accept="image/png,image/jpeg,image/webp" data-upload="${i}"></label>`).join('');
function sync(){document.querySelectorAll('[data-product]').forEach(el=>{const i=el.dataset.product;el.querySelector('img')?.remove();if(images[i]){const img=document.createElement('img');img.src=el.hasAttribute('data-cutout')&&images[i]===products[i].image?products[i].cutout:images[i];img.alt=products[i].name+' 익규 제품 목업';img.loading=el.closest('.hero')?'eager':'lazy';el.append(img)}})}
document.querySelectorAll('[data-upload]').forEach(input=>input.onchange=()=>{const file=input.files[0];if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)){toast('PNG, JPG, WebP 사진을 선택해 주세요.');return}const i=input.dataset.upload;if(images[i])URL.revokeObjectURL(images[i]);images[i]=URL.createObjectURL(file);sync();toast(products[i].name+' 사진을 적용했습니다.')});
document.querySelector('#reset').onclick=()=>{Object.values(images).forEach(URL.revokeObjectURL);Object.keys(images).forEach(k=>delete images[k]);products.forEach((p,i)=>images[i]=p.image);document.querySelectorAll('input').forEach(i=>i.value='');sync();toast('사진을 초기화했습니다.')};
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const i=+b.dataset.open;document.querySelector('#product-title').textContent=products[i].name;document.querySelector('#price').textContent=products[i].price;document.querySelector('#product-options').innerHTML=`<p>${products[i].caseType?'케이스 종류: '+products[i].caseType:'실버 테두리 디자인 · 에폭시 범퍼 적용 여부 확인 예정'}<br>맥세이프 추가 +1,500원 · 이 디자인의 지원 여부 확인 예정</p>`;document.querySelector('#product-view').innerHTML=photo(i);sync();document.querySelector('#product-dialog').showModal()});
let timer;function toast(t){const el=document.querySelector('#toast');el.textContent=t;el.style.display='block';clearTimeout(timer);timer=setTimeout(()=>el.style.display='none',3500)}document.querySelectorAll('.unlinked').forEach(b=>b.onclick=()=>toast(b.dataset.label+' 링크는 추후 연결 예정입니다.'));

sync();

document.querySelector('#product-cta').onclick=()=>document.querySelector('#product-dialog').close();
