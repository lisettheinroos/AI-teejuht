
document.querySelectorAll('.copy').forEach(function(btn){
  btn.addEventListener('click',function(){
    var card=btn.closest('.card');var ex=card?card.querySelector('.ex'):null;
    if(!ex)return;
    var text=ex.textContent.trim();
    var done=function(){btn.textContent='Kopeeritud';btn.classList.add('done');setTimeout(function(){btn.textContent='Kopeeri';btn.classList.remove('done');},1600);};
    try{
      navigator.clipboard.writeText(text).then(done).catch(function(){btn.textContent='Vali tekst ja kopeeri käsitsi';});
    }catch(e){btn.textContent='Vali tekst ja kopeeri käsitsi';}
  });
});
(function(){
  document.querySelectorAll('.open-sk').forEach(function(b){b.addEventListener('click',function(){var d=document.getElementById(b.getAttribute('data-dlg'));if(!d)return;if(d.parentNode!==document.body)document.body.appendChild(d);if(d.showModal)d.showModal();else d.setAttribute('open','');});});
  document.querySelectorAll('dialog.sk-dlg').forEach(function(d){
    d.querySelector('.amb-x').addEventListener('click',function(){d.close?d.close():d.removeAttribute('open');});
    d.addEventListener('click',function(e){if(e.target===d&&d.close)d.close();});
  });
})();
(function(){
  var d=document.getElementById('amb-dlg');if(!d)return;
  document.querySelectorAll('.open-amb').forEach(function(b){b.addEventListener('click',function(){if(d.showModal)d.showModal();else d.setAttribute('open','');});});
  d.querySelector('.amb-x').addEventListener('click',function(){d.close?d.close():d.removeAttribute('open');});
  d.addEventListener('click',function(e){if(e.target===d&&d.close)d.close();});
})();
(function(){
  var boxes=document.querySelectorAll('#checklist input');
  var count=document.getElementById('count'),fill=document.getElementById('fill'),status=document.getElementById('status');
  function update(){
    var n=0;boxes.forEach(function(b){if(b.checked)n++;});
    count.textContent=n+'/5';fill.style.width=(n/5*100)+'%';
    status.textContent=n===5?'Valmis saatmiseks.':(n===0?'Vaata need läbi enne, kui AI abil tehtud teksti edasi saadad.':(n===4?'Jäänud on veel 1 kontroll.':'Jäänud on veel '+(5-n)+' kontrolli.'));
  }
  boxes.forEach(function(b){b.addEventListener('change',update);});
})();


(function(){
  var boxes=Array.prototype.slice.call(document.querySelectorAll('#minuclaude .tdone input'));
  var fill=document.getElementById('st-fill'),cnt=document.getElementById('st-count'),K='ai-teejuht-seadistus';
  var saved=[];try{saved=JSON.parse(localStorage.getItem(K)||'[]')||[];}catch(e){saved=[];}
  function upd(store){
    var on=[];boxes.forEach(function(b){b.closest('.tstep').classList.toggle('done',b.checked);if(b.checked)on.push(b.dataset.step);});
    var n=on.length,N=boxes.length;
    if(fill)fill.style.width=(N?n/N*100:0)+'%';
    if(cnt)cnt.textContent=n===N&&N?'Kõik '+N+' sammu tehtud!':n+'/'+N+' sammu tehtud';
    if(store){try{localStorage.setItem(K,JSON.stringify(on));}catch(e){}}
  }
  boxes.forEach(function(b){if(saved.indexOf(b.dataset.step)>-1)b.checked=true;b.addEventListener('change',function(){upd(true);});});
  upd(false);
  var d=document.getElementById('amb-dlg');
  if(d){document.body.appendChild(d);document.querySelectorAll('[data-open-amb]').forEach(function(b){b.addEventListener('click',function(){if(d.showModal)d.showModal();else d.setAttribute('open','');});});}
})();
(function(){
  var road=document.querySelector('.road'),box=document.querySelector('.rpanels');if(!road||!box)return;
  var wrap=road.parentNode,stages=Array.prototype.slice.call(road.querySelectorAll('.rstage'));
  var cur=1;
  function isRow(){return getComputedStyle(road).getPropertyValue('--row').trim()==='1';}
  function place(){
    if(isRow()){if(box.parentNode!==wrap||box.previousElementSibling!==road)wrap.appendChild(box);}
    else{var st=stages[cur-1];if(st.nextSibling!==box)st.after(box);}
  }
  function select(n,scroll){
    cur=n;
    stages.forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.stage===n?'true':'false');});
    box.querySelectorAll('.rpanel').forEach(function(p){p.hidden=+p.dataset.stage!==n;});
    place();
    if(scroll&&!isRow()){var r=box.getBoundingClientRect();if(r.bottom>window.innerHeight||r.top<0)stages[n-1].scrollIntoView({block:'start',behavior:'smooth'});}
  }
  stages.forEach(function(b){b.addEventListener('click',function(){select(+b.dataset.stage,true);});});
  if(window.ResizeObserver)new ResizeObserver(place).observe(wrap);else window.addEventListener('resize',place);
  select(1,false);
})();
(function(){
  var R={
    elu:"Mind kutsutakse [nimi]. Tegelen [töö või elu põhiline asi] ja vabal ajal [hobid]. Minu igapäevaelus on [nt kaks last ja koer].\n\nMulle meeldivad lühikesed ja konkreetsed vastused, sammud punktidena ja päris näited. Mulle ei meeldi pikad sissejuhatused, liigne kiitmine ja ingliskeelsed sõnad.\n\nKui mu küsimus on ebaselge, küsi enne vastamist täpsustavaid küsimusi. Kui sa ei tea, ütle seda ausalt. Faktidele lisa allikas.\n\nRaha, tervise ja õiguse küsimustes aita mul küsimused ette valmistada, aga otsuse teen mina koos spetsialistiga.\n\nVasta eesti keeles, sina-vormis, sõbralikult ja asjalikult.",
    kontor:"Töötan ettevõttes [ettevõte] ametikohal [ametikoht]. Minu töö hõlmab [nt dokumente, aruandlust ja suhtlust kolleegidega]. Kasutan Microsoft 365 tööriistu (Outlook, Teams, Excel ja SharePoint).\n\nVasta eesti keeles lühidalt ja praktiliselt. Eelista konkreetseid samme. Kirjades ole sõbralik ja asjalik. Ära kasuta pikka kriipsu.\n\nKui küsimus puudutab isikuandmeid, tuleta mulle meelde ettevõtte AI-poliitika nõudeid.\n\nKui küsin fakte (seadused, numbrid, kuupäevad, hinnad), otsi vastus veebist ja lisa allika link. Kui kindlat vastust ei leia, ütle seda ausalt ja ära mõtle ise välja.",
    myyk:"Töötan ettevõtte [ettevõte] müügiosakonnas ametikohal [ametikoht]. Suhtlen klientidega [keeled, nt eesti ja inglise] keeles.\n\nPakkumistes ja kliendikirjades ole viisakas, konkreetne ja lühike. Vasta samas keeles, milles klient kirjutas.\n\nÄra mõtle välja hindu, tähtaegu ega tehnilisi andmeid. Kui info puudub, märgi see koht kujul [TÄPSUSTA].\n\nKui küsin fakte (standardid, turuinfo, hinnad), otsi vastus veebist ja lisa allika link. Kui kindlat vastust ei leia, ütle seda ausalt ja ära mõtle ise välja.",
    tootmine:"Töötan ettevõtte [ettevõte] tootmises ametikohal [ametikoht].\n\nKirjuta lihtsas keeles ja lühikeste lausetena. Vormista juhendid ja teated punktidena. Kui palun, kirjuta tekst ka vene keeles ja lisa eestikeelne tagasitõlge.\n\nTööohutuse teemadel tuleta meelde, et kehtib alati ettevõtte enda juhend.\n\nKui küsin fakte (nõuded, standardid, numbrid), otsi vastus veebist ja lisa allika link. Kui kindlat vastust ei leia, ütle seda ausalt ja ära mõtle ise välja.",
    juht:"Töötan ettevõttes [ettevõte] ametikohal [ametikoht] ja juhin [meeskonda või osakonda].\n\nAlusta vastust lühikese kokkuvõttega ja lisa üksikasjad selle järel. Numbrid ja võrdlused esita tabelina.\n\nKui annad soovituse, too välja riskid ja vähemalt ühe alternatiivi. Inimesi puudutavad otsused teen mina.\n\nKui küsin fakte (seadused, turuinfo, numbrid), otsi vastus veebist ja lisa allika link. Kui kindlat vastust ei leia, ütle seda ausalt ja ära mõtle ise välja."
  };
  var out=document.getElementById('role-text');if(!out)return;
  function show(k){out.textContent=R[k];}
  document.querySelectorAll('#minuclaude [data-role]').forEach(function(b){
    b.addEventListener('click',function(){document.querySelectorAll('#minuclaude [data-role]').forEach(function(x){x.classList.toggle('on',x===b);});show(b.dataset.role);});
  });
  show('elu');
})();

(function(){
  var b=document.querySelector('.totop');if(!b)return;
  function upd(){b.classList.toggle('show',window.scrollY>window.innerHeight*0.8);}
  window.addEventListener('scroll',upd,{passive:true});upd();
  b.addEventListener('click',function(){window.scrollTo({top:0});var h=document.querySelector('.hero h1');if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true});}});
})();


/* PilveAIm: ühine navigatsioon */
(function(){
  var toc=document.querySelector('details.toc');
  if(toc){
    var mq=window.matchMedia('(min-width:900px)');
    function sync(){ if(mq.matches) toc.open=true; else if(!toc.dataset.touched) toc.open=false; }
    toc.querySelector('summary').addEventListener('click',function(){toc.dataset.touched='1';});
    sync(); (mq.addEventListener?mq.addEventListener('change',sync):mq.addListener(sync));
    toc.addEventListener('click',function(e){var a=e.target.closest('a');if(a&&!mq.matches){setTimeout(function(){toc.open=false;},50);}});
    var links=[].slice.call(toc.querySelectorAll('a[data-spy]'));
    var pairs=links.map(function(a){var id=(a.getAttribute('href').split('#')[1]||'');return {a:a,s:id?document.getElementById(id):null};}).filter(function(p){return p.s;});
    if(pairs.length){
      var tick=false;
      function spy(){tick=false;var hit=pairs[0];pairs.forEach(function(p){if(p.s.getBoundingClientRect().top<=120)hit=p;});
        links.forEach(function(l){l.classList.toggle('on',l===hit.a);if(l===hit.a)l.setAttribute('aria-current','location');else l.removeAttribute('aria-current');});}
      window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(spy);}},{passive:true});spy();
    }
  }
  function openFor(id){var el=id&&document.getElementById(id);if(!el)return;var d=el.closest('details');while(d){d.open=true;d=d.parentElement&&d.parentElement.closest('details');}
    requestAnimationFrame(function(){el.scrollIntoView();});}
  window.addEventListener('hashchange',function(){openFor(location.hash.slice(1));});
  if(location.hash)openFor(location.hash.slice(1));
})();

/* Pehme sissetulek kerimisel (austab prefers-reduced-motion) */
(function(){
  if(!('IntersectionObserver' in window))return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var els=[].slice.call(document.querySelectorAll('.hm-card,.hm-rule,.hm-about-in,.ix-card,.wm-story,.guide main > section'));
  var vh=window.innerHeight||800;
  els=els.filter(function(e){return e.getBoundingClientRect().top>vh*0.92;});
  els.forEach(function(e){e.classList.add('rv');});
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:0.06});
  els.forEach(function(e){io.observe(e);});
})();

