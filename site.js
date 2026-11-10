
const services = [
  {
    id: "strutture",
    title: "Strutture Metalliche",
    description: "Carpenteria metallica e strutture in acciaio per capannoni industriali e progetti su misura.",
    image: "images/strutture/capannone-13.png"
  },
  {
    id: "recinzioni",
    title: "Recinzioni Metalliche",
    description: "Recinzioni in metallo su misura per proprietà private, attività commerciali e aree industriali.",
    image: "images/recinzioni/recinzioni-01.png"
  },
  {
    id: "cancelli",
    title: "Cancelli e Porte Metalliche",
    description: "Realizzazione di cancelli e porte metalliche per diverse esigenze di accesso e sicurezza.",
    image: "images/cancelli/porte%20metalliche%20-01.png"
  },
  {
    id: "ringhiere",
    title: "Ringhiere e Parapetti",
    description: "Ringhiere e parapetti metallici per scale, balconi e spazi interni ed esterni.",
    image: "images/ringhiere/ringhiere.png"
  },
  {
    id: "pergole",
    title: "Pergole e Coperture",
    description: "Pergole, tettoie e coperture metalliche progettate per diverse esigenze.",
    image: "images/pergole/pergola.png"
  },
  {
    id: "facciate",
    title: "Facciate e Rivestimenti",
    description: "Rivestimenti e soluzioni metalliche per facciate di edifici.",
    image: "images/facciate/facciate-0.1.png"
  },
  {
    id: "scale",
    title: "Scale Metalliche",
    description: "Scale metalliche su misura per ambienti industriali e privati.",
    image: "images/scale/scale%20metalliche%200.1.png"
  }
];

const servicePhotos = {
  strutture: Array.from({length:14},(_,i)=>i+1)
    .filter(i=>i!==5)
    .map(i=>`images/strutture/capannone-${String(i).padStart(2,"0")}.png`)
    .concat(["images/strutture/carburante%20.png"]),

  recinzioni: Array.from({length:14},(_,i)=>
    `images/recinzioni/recinzioni-${String(i+1).padStart(2,"0")}.png`
  ),

  cancelli: [
    "images/cancelli/porrte%20metalliche%200.6.png",
    ...Array.from({length:5},(_,i)=>
      `images/cancelli/porte%20metalliche%20-0${i+1}.png`)
  ],

  ringhiere: [
    "images/ringhiere/Sunlit%20Mediterranean%20Apartment%20Facade.png",
    "images/ringhiere/ringhiere%20.png",
    ...Array.from({length:4},(_,i)=>
      `images/ringhiere/ringhiere%20e%20parapeti-0${i+1}.png`),
    "images/ringhiere/ringhiere%20e%20parapeti.png",
    "images/ringhiere/ringhiere.png"
  ],

  pergole: [
    "images/pergole/Sunlit%20Garden%20Pergola%20and%20Mountain%20Vista.png",
    "images/pergole/pergola.png"
  ],

  facciate: [
    "images/facciate/facciate-0.1.png"
  ],

  scale: [
    "images/scale/Scale%20metalliche%200.4.png",
    "images/scale/scale%20metaliche%200.2.png",
    "images/scale/scale%20metalliche%200.1.png",
    "images/scale/scale%20metalliche%200.3.png"
  ]
};

const navLinks = [
  ["index.html","Home"],
  ["chi-siamo.html","Chi siamo"],
  ["servizi.html","Servizi"],
  ["realizzazioni.html","Realizzazioni"],
  ["contatti.html","Contatti"]
];

function renderLayout(){
  const header=document.getElementById("site-header");
  const footer=document.getElementById("site-footer");
  const current=location.pathname.split("/").pop() || "index.html";

  if(header){
    header.innerHTML=`
      <header class="site-header">
        <a href="index.html" class="brand">
          <img src="logo.png" alt="Logo ADE DI ESTREFI ERJON">
          <span class="brand-text">
            <span class="brand-name">ADE DI ESTREFI ERJON</span>
            <span class="brand-subtitle">CARPENTERIA METALLICA</span>
          </span>
        </a>
        <nav class="main-nav" aria-label="Navigazione principale">
          ${navLinks.map(([url,label])=>
            `<a href="${url}" ${current===url?'class="active" aria-current="page"':""}>${label}</a>`
          ).join("")}
        </nav>
      </header>`;
  }

  if(footer){
    footer.innerHTML=`
      <footer class="site-footer">
        © 2026 ADE DI ESTREFI ERJON — Tutti i diritti riservati.
      </footer>`;
  }
}

function renderServices(){
  const target=document.getElementById("service-cards");
  if(!target)return;

  target.innerHTML=services.map(s=>`
    <a class="service-card" href="realizzazioni.html#${s.id}">
      <img src="${s.image}" alt="${s.title} - ADE DI ESTREFI ERJON"
           loading="lazy" decoding="async">
      <h3>${s.title}</h3>
      <p>${s.description}</p>
    </a>
  `).join("");
}

function renderGalleries(){
  const target=document.getElementById("galleries");
  if(!target)return;

  target.innerHTML=services.map(s=>{
    const photos=servicePhotos[s.id]||[];
    return `
      <section class="gallery-group" id="${s.id}">
        <h2>${s.title}</h2>
        <p>${s.description}</p>
        <div class="gallery-grid">
          ${photos.map((src,i)=>`
            <img src="${src}"
                 alt="${s.title} - lavoro ${i+1} - ADE DI ESTREFI ERJON"
                 loading="lazy"
                 decoding="async"
                 tabindex="0"
                 role="button"
                 data-category="${s.id}"
                 data-index="${i}">
          `).join("")}
        </div>
      </section>`;
  }).join("");

  target.addEventListener("click",e=>{
    const img=e.target.closest("img[data-category]");
    if(img)openLightbox(img.dataset.category,Number(img.dataset.index));
  });

  target.addEventListener("keydown",e=>{
    if(e.key!=="Enter" && e.key!==" ")return;
    const img=e.target.closest("img[data-category]");
    if(img){
      e.preventDefault();
      openLightbox(img.dataset.category,Number(img.dataset.index));
    }
  });

  if(location.hash){
    const id=decodeURIComponent(location.hash.slice(1));
    const element=document.getElementById(id);
    if(element)requestAnimationFrame(()=>element.scrollIntoView());
  }
}

function openLightbox(category,startIndex){
  const photos=servicePhotos[category];
  if(!photos || !photos.length)return;

  document.getElementById("lightbox")?.remove();

  const overlay=document.createElement("div");
  overlay.id="lightbox";
  overlay.setAttribute("role","dialog");
  overlay.setAttribute("aria-modal","true");
  overlay.setAttribute("aria-label","Galleria fotografica");

  overlay.innerHTML=`
    <img alt="Fotografia ingrandita">
    <button class="lightbox-control lightbox-close"
            aria-label="Chiudi">×</button>
    <button class="lightbox-control lightbox-prev"
            aria-label="Foto precedente">‹</button>
    <button class="lightbox-control lightbox-next"
            aria-label="Foto successiva">›</button>
    <div class="lightbox-counter"></div>
  `;

  const img=overlay.querySelector("img");
  const counter=overlay.querySelector(".lightbox-counter");
  let index=startIndex;
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow="hidden";

  function show(next){
    index=(next+photos.length)%photos.length;
    img.classList.remove("zoomed");
    img.src=photos[index];
    img.alt=`Fotografia ${index+1} - ADE DI ESTREFI ERJON`;
    counter.textContent=`${index+1} / ${photos.length}`;
  }

  function close(){
    document.removeEventListener("keydown",keyboard,true);
    document.body.style.overflow=previousOverflow;
    overlay.remove();
  }

  function keyboard(e){
    if(e.key==="Escape"){
      e.stopImmediatePropagation();
      close();
    }else if(e.key==="ArrowLeft"){
      show(index-1);
    }else if(e.key==="ArrowRight"){
      show(index+1);
    }
  }

  overlay.querySelector(".lightbox-close").onclick=close;
  overlay.querySelector(".lightbox-prev").onclick=()=>show(index-1);
  overlay.querySelector(".lightbox-next").onclick=()=>show(index+1);
  img.onclick=()=>img.classList.toggle("zoomed");

  overlay.onclick=e=>{
    if(e.target===overlay)close();
  };

  document.addEventListener("keydown",keyboard,true);
  document.body.appendChild(overlay);
  show(index);
  overlay.querySelector(".lightbox-close").focus();
}

document.addEventListener("DOMContentLoaded",()=>{
  renderLayout();
  renderServices();
  renderGalleries();
});
