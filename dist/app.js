const products=[
{name:'화들짝 케이스',price:'15,000원',kind:'cream',cutout:'assets/c-1.png',image:'assets/provided-startled.png',caseType:'에폭시 범퍼 케이스',magsafe:null},
{name:'블루리본 케이스',price:'15,000원',kind:'blue',cutout:'assets/c-2.png',image:'assets/provided-blue.png',caseType:'에폭시 범퍼 케이스',magsafe:null},
{name:'핑크 큐피드 케이스',price:'15,000원',kind:'',cutout:'assets/c-3.png',image:'assets/provided-cupid.png',caseType:'에폭시 범퍼 케이스',magsafe:null},
{name:'해피 케이스',price:'8,000원',kind:'clear',cutout:'assets/c-4.png',image:'assets/provided-happy.png',caseType:'투명 케이스',magsafe:null},
{name:'네잎클로버 케이스',price:'8,000원',kind:'clover',cutout:'assets/c-5.png',image:'assets/provided-clover.png',caseType:'투명 케이스',magsafe:null}];

const site=document.querySelector('#site');
const phoneGroups={
 'iPhone': ['iPhone 11','iPhone 11 Pro','iPhone 11 Pro Max',...['12','13','14','15','16'].flatMap(n=>['iPhone '+n,...(['12','13'].includes(n)?['iPhone '+n+' mini']:[]),...(['14','15','16'].includes(n)?['iPhone '+n+' Plus']:[]),'iPhone '+n+' Pro','iPhone '+n+' Pro Max']),'iPhone SE (2세대)','iPhone SE (3세대)'],
 'Galaxy S': ['21','22','23','24','25'].flatMap(n=>['Galaxy S'+n,'Galaxy S'+n+'+','Galaxy S'+n+' Ultra']),
 'Galaxy Z': ['3','4','5','6'].flatMap(n=>['Galaxy Z Flip'+n,'Galaxy Z Fold'+n])
};
const modelSelect=document.querySelector('#phone-model');
Object.entries(phoneGroups).forEach(([label,models])=>{const group=document.createElement('optgroup');group.label=label;models.forEach(model=>{const option=document.createElement('option');option.value=model;option.textContent=model;group.append(option)});modelSelect.append(group)});
const other=document.createElement('option');other.value='other';other.textContent='기타 기종 (직접 입력)';modelSelect.append(other);
function photo(i){const p=products[i];return `<div class="photo ${p.kind}" data-product="${i}"></div>`}
function card(i){const p=products[i];return `<button class="card" data-open="${i}" aria-label="${p.name} 상세보기">${photo(i)}<div class="card-bottom"><h3>${p.name}</h3><p>${p.price}</p></div></button>`}
document.querySelector('#cards').innerHTML=[2,1,4,3].map(card).join('')+card(0);
document.querySelector('#cards [data-open="0"]').hidden=true;
document.querySelector('#show-more').onclick=()=>{const el=document.querySelector('#cards [data-open="0"]');el.hidden=!el.hidden;const button=document.querySelector('#show-more');button.setAttribute('aria-expanded',String(!el.hidden));button.textContent=el.hidden?'제품 더보기 ＋':'제품 접기 −'};
site.className='romance';document.querySelector('#direction').textContent='PICKYOU / PLAYFUL ROMANCE';
function sync(){document.querySelectorAll('[data-product]').forEach(el=>{const product=products[Number(el.dataset.product)];el.querySelector('img')?.remove();const img=document.createElement('img');img.src=el.hasAttribute('data-cutout')?product.cutout:product.image;img.alt=product.name+' 익규 제품 목업';img.loading=el.closest('.hero')?'eager':'lazy';el.append(img)})}
const dialog=document.querySelector('#product-dialog');
const quantity=document.querySelector('#quantity');
const customModel=document.querySelector('#custom-model');
const formatPrice=value=>new Intl.NumberFormat('ko-KR').format(value)+'원';
let activeProduct=null;
const magsafeRadios=document.querySelectorAll('input[name="magsafe"]');
function getMagsafePrice(){return Number(document.querySelector('input[name="magsafe"]:checked')?.value||0)}
function unitPrice(){return Number(activeProduct.price.replace(/[^0-9]/g,''))+getMagsafePrice()}
function updateTotal(){
 if(!activeProduct)return;
 const value=Number(quantity.value);
 const valid=Number.isInteger(value)&&value>=1&&value<=99;
 document.querySelector('#quantity-minus').disabled=valid&&value===1;
 document.querySelector('#quantity-plus').disabled=valid&&value===99;
 if(!valid){
  document.querySelector('#product-subtotal').textContent='—';
  document.querySelector('#product-total').textContent='—';
  return;
 }
 const subtotal=unitPrice()*value;
 document.querySelector('#product-subtotal').textContent=formatPrice(subtotal);
 document.querySelector('#product-total').textContent=formatPrice(subtotal+3000);
}
magsafeRadios.forEach(radio=>radio.addEventListener('change',updateTotal));
modelSelect.onchange=()=>{const custom=modelSelect.value==='other';document.querySelector('#custom-model-field').hidden=!custom;customModel.required=custom;if(custom)customModel.focus()};
quantity.addEventListener('input',updateTotal);quantity.addEventListener('change',()=>{quantity.value=String(Math.max(1,Math.min(99,Math.trunc(Number(quantity.value)||1))));updateTotal()});
function changeQuantity(delta){quantity.value=String(Math.max(1,Math.min(99,(Math.trunc(Number(quantity.value))||1)+delta)));updateTotal()}
document.querySelector('#quantity-minus').onclick=()=>changeQuantity(-1);
document.querySelector('#quantity-plus').onclick=()=>changeQuantity(1);
document.querySelectorAll('[data-open]').forEach(button=>button.onclick=()=>{const index=Number(button.dataset.open);activeProduct=products[index];document.querySelector('#product-title').textContent=activeProduct.name;document.querySelector('#price').textContent=activeProduct.price;document.querySelector('#product-view').innerHTML=photo(index);document.querySelector('#product-options').reset();document.querySelector('#custom-model-field').hidden=true;customModel.required=false;quantity.value='1';updateTotal();sync();dialog.showModal()});
dialog.querySelector('.close').onclick=()=>dialog.close();
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close()}});
document.querySelector('#product-options').onsubmit=event=>event.preventDefault();
const dmDialog=document.querySelector('#dm-dialog');
const dmMessage=document.querySelector('#dm-message');
function showDmGuide(message=''){
 document.querySelector('#dm-message-group').hidden=!message;
 document.querySelector('#copy-order').hidden=!message;
 document.querySelector('#choose-product').hidden=!!message;
 dmMessage.value=message;
 document.querySelector('#copy-order').textContent='문의 내용 복사';
 document.querySelector('#dm-copy-status').textContent='';
 dmDialog.showModal();
}
customModel.addEventListener('input',()=>customModel.setCustomValidity(''));
document.querySelector('#product-cta').onclick=()=>{
 customModel.setCustomValidity(modelSelect.value==='other'&&!customModel.value.trim()?'기종을 입력해 주세요.':'');
 if(!document.querySelector('#product-options').reportValidity())return;
 const model=modelSelect.value==='other'?customModel.value.trim():modelSelect.value;
 const count=Number(quantity.value);
 const subtotal=unitPrice()*count;
 const magsafeText=getMagsafePrice()===1500?'맥세이프 추가 (+1,500원)':'일반 케이스 (+0원)';
 showDmGuide(['안녕하세요! ICKYOU 케이스 구매 문의드립니다.','',`제품: ${activeProduct.name}`,`휴대폰 기종: ${model}`,`맥세이프: ${magsafeText}`,`수량: ${count}개`,`상품금액: ${formatPrice(subtotal)}`,'배송비: 3,000원',`합계: ${formatPrice(subtotal+3000)}`].join('\n'));
};
document.querySelectorAll('a.pill.dark[href="#collection"]').forEach(button=>button.onclick=event=>{event.preventDefault();showDmGuide()});
dmDialog.querySelector('.close').onclick=()=>dmDialog.close();
document.querySelector('#choose-product').onclick=()=>dmDialog.close();
dmDialog.addEventListener('click',event=>{if(event.target===dmDialog){const box=dmDialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dmDialog.close()}});
document.querySelector('#copy-order').onclick=async()=>{
 let copied=false;
 try{await navigator.clipboard.writeText(dmMessage.value);copied=true}catch{
  dmMessage.focus();dmMessage.select();
  try{copied=document.execCommand('copy')}catch{}
 }
 document.querySelector('#copy-order').textContent=copied?'복사 완료 ✓':'문의 내용 복사';
 document.querySelector('#dm-copy-status').textContent=copied?'복사했어요. 인스타그램 DM에 붙여넣어 보내 주세요.':'문의 내용을 길게 누르거나 선택해서 복사해 주세요.';
};
let timer;function toast(text){const el=document.querySelector('#toast');el.textContent=text;el.style.display='block';clearTimeout(timer);timer=setTimeout(()=>el.style.display='none',3500)}document.querySelectorAll('.unlinked').forEach(button=>button.onclick=()=>toast(button.dataset.label+' 링크를 준비 중입니다.'));
sync();
