let e,t,n=!1,l=null,s=!1;const o="undefined"!=typeof window?window:{},i=o.document||{head:{}},c={t:0,l:"",jmp:e=>e(),raf:e=>requestAnimationFrame(e),ael:(e,t,n,l)=>e.addEventListener(t,n,l),rel:(e,t,n,l)=>e.removeEventListener(t,n,l),ce:(e,t)=>new CustomEvent(e,t)},r=e=>Promise.resolve(e),a=(()=>{try{return new CSSStyleSheet,!0}catch(e){}return!1})(),u=(e,t,n)=>{n&&n.map(([n,l,s])=>{const o=e,i=f(t,s),r=d(n);c.ael(o,l,i,r),(t.s=t.s||[]).push(()=>c.rel(o,l,i,r))})},f=(e,t)=>n=>{256&e.t?e.o[t](n):(e.i=e.i||[]).push([t,n])},d=e=>0!=(2&e),p="http://www.w3.org/1999/xlink",y=new WeakMap,$=e=>"sc-"+e.u,h={},m=e=>"object"==(e=typeof e)||"function"===e,w=(e,t,...n)=>{let l=null,s=null,o=!1,i=!1,c=[];const r=t=>{for(let n=0;n<t.length;n++)l=t[n],Array.isArray(l)?r(l):null!=l&&"boolean"!=typeof l&&((o="function"!=typeof e&&!m(l))&&(l+=""),o&&i?c[c.length-1].p+=l:c.push(o?b(null,l):l),i=o)};if(r(n),t){t.key&&(s=t.key);{const e=t.className||t.class;e&&(t.class="object"!=typeof e?e:Object.keys(e).filter(t=>e[t]).join(" "))}}if("function"==typeof e)return e(null===t?{}:t,c,v);const a=b(e,null);return a.$=t,c.length>0&&(a.h=c),a.m=s,a},b=(e,t)=>({t:0,g:e,p:t,v:null,h:null,$:null,m:null}),g={},v={forEach:(e,t)=>e.map(j).forEach(t),map:(e,t)=>e.map(j).map(t).map(k)},j=e=>({vattrs:e.$,vchildren:e.h,vkey:e.m,vname:e.j,vtag:e.g,vtext:e.p}),k=e=>{if("function"==typeof e.vtag){const t=Object.assign({},e.vattrs);return e.vkey&&(t.key=e.vkey),e.vname&&(t.name=e.vname),w(e.vtag,t,...e.vchildren||[])}const t=b(e.vtag,e.vtext);return t.$=e.vattrs,t.h=e.vchildren,t.m=e.vkey,t.j=e.vname,t},O=(e,t,n,l,s,i)=>{if(n!==l){let r=le(e,t),a=t.toLowerCase();if("class"===t){const t=e.classList,s=M(n),o=M(l);t.remove(...s.filter(e=>e&&!o.includes(e))),t.add(...o.filter(e=>e&&!s.includes(e)))}else if("style"===t){for(const t in n)l&&null!=l[t]||(t.includes("-")?e.style.removeProperty(t):e.style[t]="");for(const t in l)n&&l[t]===n[t]||(t.includes("-")?e.style.setProperty(t,l[t]):e.style[t]=l[t])}else if("key"===t);else if("ref"===t)l&&l(e);else if(r||"o"!==t[0]||"n"!==t[1]){const o=m(l);if((r||o&&null!==l)&&!s)try{if(e.tagName.includes("-"))e[t]=l;else{let s=null==l?"":l;"list"===t?r=!1:null!=n&&e[t]==s||(e[t]=s)}}catch(e){}let c=!1;a!==(a=a.replace(/^xlink\:?/,""))&&(t=a,c=!0),null==l||!1===l?!1===l&&""!==e.getAttribute(t)||(c?e.removeAttributeNS(p,t):e.removeAttribute(t)):(!r||4&i||s)&&!o&&(l=!0===l?"":l,c?e.setAttributeNS(p,t,l):e.setAttribute(t,l))}else t="-"===t[2]?t.slice(3):le(o,a)?a.slice(2):a[2]+t.slice(3),n&&c.rel(e,t,n,!1),l&&c.ael(e,t,l,!1)}},S=/\s/,M=e=>e?e.split(S):[],x=(e,t,n,l)=>{const s=11===t.v.nodeType&&t.v.host?t.v.host:t.v,o=e&&e.$||h,i=t.$||h;for(l in o)l in i||O(s,l,o[l],void 0,n,t.t);for(l in i)O(s,l,o[l],i[l],n,t.t)},C=(t,l,s)=>{let o,c,r=l.h[s],a=0;if(null!==r.p)o=r.v=i.createTextNode(r.p);else{if(n||(n="svg"===r.g),o=r.v=i.createElementNS(n?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml",r.g),n&&"foreignObject"===r.g&&(n=!1),x(null,r,n),null!=e&&o["s-si"]!==e&&o.classList.add(o["s-si"]=e),r.h)for(a=0;a<r.h.length;++a)c=C(t,r,a),c&&o.appendChild(c);"svg"===r.g?n=!1:"foreignObject"===o.tagName&&(n=!0)}return o},L=(e,n,l,s,o,i)=>{let c,r=e;for(r.shadowRoot&&r.tagName===t&&(r=r.shadowRoot);o<=i;++o)s[o]&&(c=C(null,l,o),c&&(s[o].v=c,r.insertBefore(c,n)))},P=(e,t,n,l,s)=>{for(;t<=n;++t)(l=e[t])&&(s=l.v,T(l),s.remove())},E=(e,t)=>e.g===t.g&&e.m===t.m,R=(e,t)=>{const l=t.v=e.v,s=e.h,o=t.h,i=t.g,c=t.p;null===c?(n="svg"===i||"foreignObject"!==i&&n,"slot"===i||x(e,t,n),null!==s&&null!==o?((e,t,n,l)=>{let s,o,i=0,c=0,r=0,a=0,u=t.length-1,f=t[0],d=t[u],p=l.length-1,y=l[0],$=l[p];for(;i<=u&&c<=p;)if(null==f)f=t[++i];else if(null==d)d=t[--u];else if(null==y)y=l[++c];else if(null==$)$=l[--p];else if(E(f,y))R(f,y),f=t[++i],y=l[++c];else if(E(d,$))R(d,$),d=t[--u],$=l[--p];else if(E(f,$))R(f,$),e.insertBefore(f.v,d.v.nextSibling),f=t[++i],$=l[--p];else if(E(d,y))R(d,y),e.insertBefore(d.v,f.v),d=t[--u],y=l[++c];else{for(r=-1,a=i;a<=u;++a)if(t[a]&&null!==t[a].m&&t[a].m===y.m){r=a;break}r>=0?(o=t[r],o.g!==y.g?s=C(t&&t[c],n,r):(R(o,y),t[r]=void 0,s=o.v),y=l[++c]):(s=C(t&&t[c],n,c),y=l[++c]),s&&f.v.parentNode.insertBefore(s,f.v)}i>u?L(e,null==l[p+1]?null:l[p+1].v,n,l,c,p):c>p&&P(t,i,u)})(l,s,t,o):null!==o?(null!==e.p&&(l.textContent=""),L(l,null,t,o,0,o.length-1)):null!==s&&P(s,0,s.length-1),n&&"svg"===i&&(n=!1)):e.p!==c&&(l.data=c)},T=e=>{e.$&&e.$.ref&&e.$.ref(null),e.h&&e.h.map(T)},U=e=>ee(e).k,W=(e,t,n)=>{const l=U(e);return{emit:e=>A(l,t,{bubbles:!!(4&n),composed:!!(2&n),cancelable:!!(1&n),detail:e})}},A=(e,t,n)=>{const l=c.ce(t,n);return e.dispatchEvent(l),l},F=(e,t)=>{t&&!e.O&&t["s-p"]&&t["s-p"].push(new Promise(t=>e.O=t))},H=(e,t)=>{if(e.t|=16,!(4&e.t))return F(e,e.S),ye(()=>q(e,t));e.t|=512},q=(e,t)=>{const n=e.o;let l;return t&&(e.t|=256,e.i&&(e.i.map(([e,t])=>G(n,e,t)),e.i=null),l=G(n,"componentWillLoad")),I(l,()=>D(e,n,t))},D=async(n,l,s)=>{const o=n.k,c=o["s-rc"];s&&(e=>{const t=e.M,n=e.k,l=t.t,s=((e,t)=>{let n=$(t),l=ce.get(n);if(e=11===e.nodeType?e:i,l)if("string"==typeof l){let t,s=y.get(e=e.head||e);s||y.set(e,s=new Set),s.has(n)||(t=i.createElement("style"),t.innerHTML=l,e.insertBefore(t,e.querySelector("link")),s&&s.add(n))}else e.adoptedStyleSheets.includes(l)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,l]);return n})(n.shadowRoot?n.shadowRoot:n.getRootNode(),t);10&l&&(n["s-sc"]=s,n.classList.add(s+"-h"),2&l&&n.classList.add(s+"-s"))})(n);((n,l)=>{const s=n.k,o=n.M,i=n.C||b(null,null),c=(e=>e&&e.g===g)(l)?l:w(null,null,l);t=s.tagName,o.L&&(c.$=c.$||{},o.L.map(([e,t])=>c.$[t]=s[e])),c.g=null,c.t|=4,n.C=c,c.v=i.v=s.shadowRoot||s,e=s["s-sc"],R(i,c)})(n,N(n,l)),c&&(c.map(e=>e()),o["s-rc"]=void 0);{const e=o["s-p"],t=()=>_(n);0===e.length?t():(Promise.all(e).then(t),n.t|=4,e.length=0)}},N=(e,t)=>{try{l=t,t=t.render(),e.t&=-17,e.t|=2}catch(e){se(e)}return l=null,t},V=()=>l,_=e=>{const t=e.k,n=e.o,l=e.S;64&e.t||(e.t|=64,J(t),G(n,"componentDidLoad"),e.P(t),l||B()),e.R(t),e.O&&(e.O(),e.O=void 0),512&e.t&&pe(()=>H(e,!1)),e.t&=-517},z=e=>{{const t=ee(e),n=t.k.isConnected;return n&&2==(18&t.t)&&H(t,!1),n}},B=()=>{J(i.documentElement),pe(()=>A(o,"appload",{detail:{namespace:"noi-mobility-traffic"}}))},G=(e,t,n)=>{if(e&&e[t])try{return e[t](n)}catch(e){se(e)}},I=(e,t)=>e&&e.then?e.then(t):t(),J=e=>e.classList.add("hydrated"),K=(e,t,n)=>{if(t.T){e.watchers&&(t.U=e.watchers);const l=Object.entries(t.T),s=e.prototype;if(l.map(([e,[l]])=>{31&l||2&n&&32&l?Object.defineProperty(s,e,{get(){return((e,t)=>ee(this).W.get(t))(0,e)},set(n){((e,t,n,l)=>{const s=ee(e),o=s.W.get(t),i=s.t,c=s.o;if(n=((e,t)=>null==e||m(e)?e:4&t?"false"!==e&&(""===e||!!e):2&t?parseFloat(e):1&t?e+"":e)(n,l.T[t][0]),!(8&i&&void 0!==o||n===o)&&(s.W.set(t,n),c)){if(l.U&&128&i){const e=l.U[t];e&&e.map(e=>{try{c[e](n,o,t)}catch(e){se(e)}})}2==(18&i)&&H(s,!1)}})(this,e,n,t)},configurable:!0,enumerable:!0}):1&n&&64&l&&Object.defineProperty(s,e,{value(...t){const n=ee(this);return n.A.then(()=>n.o[e](...t))}})}),1&n){const n=new Map;s.attributeChangedCallback=function(e,t,l){c.jmp(()=>{const t=n.get(e);this[t]=(null!==l||"boolean"!=typeof this[t])&&l})},e.observedAttributes=l.filter(([e,t])=>15&t[0]).map(([e,l])=>{const s=l[1]||e;return n.set(s,e),512&l[0]&&t.L.push([e,s]),s})}}return e},Q=e=>{G(e,"connectedCallback")},X=(e,t={})=>{const n=[],l=t.exclude||[],s=o.customElements,r=i.head,f=r.querySelector("meta[charset]"),d=i.createElement("style"),p=[];let y,h=!0;Object.assign(c,t),c.l=new URL(t.resourcesUrl||"./",i.baseURI).href,e.map(e=>e[1].map(t=>{const o={t:t[0],u:t[1],T:t[2],F:t[3]};o.T=t[2],o.F=t[3],o.L=[],o.U={};const i=o.u,r=class extends HTMLElement{constructor(e){super(e),ne(e=this,o),1&o.t&&e.attachShadow({mode:"open"})}connectedCallback(){y&&(clearTimeout(y),y=null),h?p.push(this):c.jmp(()=>(e=>{if(0==(1&c.t)){const t=ee(e),n=t.M,l=()=>{};if(1&t.t)u(e,t,n.F),Q(t.o);else{t.t|=1;{let n=e;for(;n=n.parentNode||n.host;)if(n["s-p"]){F(t,t.S=n);break}}n.T&&Object.entries(n.T).map(([t,[n]])=>{if(31&n&&e.hasOwnProperty(t)){const n=e[t];delete e[t],e[t]=n}}),(async(e,t,n,l,s)=>{if(0==(32&t.t)){{if(t.t|=32,(s=ie(n)).then){const e=()=>{};s=await s,e()}s.isProxied||(n.U=s.watchers,K(s,n,2),s.isProxied=!0);const e=()=>{};t.t|=8;try{new s(t)}catch(e){se(e)}t.t&=-9,t.t|=128,e(),Q(t.o)}if(s.style){let e=s.style;const t=$(n);if(!ce.has(t)){const l=()=>{};((e,t,n)=>{let l=ce.get(e);a&&n?(l=l||new CSSStyleSheet,l.replace(t)):l=t,ce.set(e,l)})(t,e,!!(1&n.t)),l()}}}const o=t.S,i=()=>H(t,!0);o&&o["s-rc"]?o["s-rc"].push(i):i()})(0,t,n)}l()}})(this))}disconnectedCallback(){c.jmp(()=>(()=>{if(0==(1&c.t)){const e=ee(this),t=e.o;e.s&&(e.s.map(e=>e()),e.s=void 0),G(t,"disconnectedCallback")}})())}componentOnReady(){return ee(this).H}};o.q=e[0],l.includes(i)||s.get(i)||(n.push(i),s.define(i,K(r,o,1)))})),d.innerHTML=n+"{visibility:hidden}.hydrated{visibility:inherit}",d.setAttribute("data-styles",""),r.insertBefore(d,f?f.nextSibling:r.firstChild),h=!1,p.length?p.map(e=>e.connectedCallback()):c.jmp(()=>y=setTimeout(B,30))},Y=e=>{const t=new URL(e,c.l);return t.origin!==o.location.origin?t.href:t.pathname},Z=new WeakMap,ee=e=>Z.get(e),te=(e,t)=>Z.set(t.o=e,t),ne=(e,t)=>{const n={t:0,k:e,M:t,W:new Map};return n.A=new Promise(e=>n.R=e),n.H=new Promise(e=>n.P=e),e["s-p"]=[],e["s-rc"]=[],u(e,n,t.F),Z.set(e,n)},le=(e,t)=>t in e,se=e=>console.error(e),oe=new Map,ie=e=>{const t=e.u.replace(/-/g,"_"),n=e.q,l=oe.get(n);return l?l[t]:import(`./${n}.entry.js`).then(e=>(oe.set(n,e),e[t]),se)},ce=new Map,re=[],ae=[],ue=(e,t)=>n=>{e.push(n),s||(s=!0,t&&4&c.t?pe(de):c.raf(de))},fe=e=>{for(let t=0;t<e.length;t++)try{e[t](performance.now())}catch(e){se(e)}e.length=0},de=()=>{fe(re),fe(ae),(s=re.length>0)&&c.raf(de)},pe=e=>r().then(e),ye=ue(ae,!0);export{g as H,V as a,X as b,W as c,Y as d,z as f,U as g,w as h,r as p,te as r}