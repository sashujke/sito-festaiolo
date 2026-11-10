// Stato condiviso: viene riempito quando i file JSON vengono caricati.
const state = {
  config: null,
  items: [],
  content: null,
  house: null,
  reviews: [],
  contacts: null,
  category: "Tutti",
  sort: "default",
};
// Piccoli helper usati in tutto il file.
const $ = (s, r = document) => r.querySelector(s),
  esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    ),
  waNumber = (n) => String(n || "").replace(/\D/g, "");
const zone = () =>
  location.pathname.endsWith("casa.html") ? "casa" : "rental";

// Gestione dei movimenti touch nelle gallerie.
function closeOnGallery(el) {
  el.addEventListener("toggle", () =>
    document.body.classList.toggle("gallery-open", el.open),
  );
}
function swipe(el, onSwipe) {
  let start = 0;
  el.addEventListener(
    "touchstart",
    (e) => {
      start = e.changedTouches[0].clientX;
    },
    { passive: true },
  );
  el.addEventListener(
    "touchend",
    (e) => {
      const delta = e.changedTouches[0].clientX - start;
      if (Math.abs(delta) > 45) onSwipe(delta < 0 ? 1 : -1);
    },
    { passive: true },
  );
}
function header() {
  return `<header class="site-header"><a class="brand" href="index.html"><img src="img/logo.png" alt="" width="88" height="88"><span>${esc(state.config.brand)}</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-navigation">Menu</button><nav id="main-navigation" aria-label="Navigazione principale"><a href="catalogo.html">Gonfiabili</a><a href="casa.html">Casa del Festaiolo</a><a href="contatti.html">Contatti</a><a class="button small" href="contatti.html#prenota">WhatsApp preventivo</a></nav></header>`;
}

// Elementi comuni presenti in fondo a tutte le pagine.
function footer() {
  const c = state.contacts?.rental?.[0],
    h = state.house;
  return `<footer><div><strong>${esc(state.config.brand)}</strong><p>${esc(state.config.claim)}</p>${zone() === "casa" ? `<p><strong>Casa del Festaiolo</strong><br>${esc(h.indirizzo)}<br><span class="footer-hours">${hoursSummary(h.orari)}</span></p>` : ""}</div><div><a href="catalogo.html">Catalogo</a><a href="casa.html">Casa</a><a href="contatti.html">Contatti</a>${c ? `<a target="_blank" rel="noopener" href="https://wa.me/${waNumber(c.numero)}">WhatsApp</a>` : ""}</div><small>© ${new Date().getFullYear()} Il Festaiolo · Sito statico</small></footer>`;
}
function fixedWhatsApp() {
  const c = state.contacts?.[zone()]?.[0];
  if (!c) return;
  const msg =
    zone() === "casa"
      ? "Ciao, vorrei informazioni sulla Casa del Festaiolo."
      : "Ciao, vorrei informazioni sui gonfiabili.";
  document.body.insertAdjacentHTML(
    "beforeend",
    `<a class="whatsapp-float" target="_blank" rel="noopener" aria-label="Scrivi su WhatsApp" title="Scrivi su WhatsApp" href="https://wa.me/${waNumber(c.numero)}?text=${encodeURIComponent(msg)}"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7a10.7 10.7 0 0 1-5.4-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.3-.6.1a8.7 8.7 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.2-.7l.5-.6.2-.5-.1-.5-1-2.4c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5 1 2.9 1.2 3.1a11.5 11.5 0 0 0 4.4 4c2.7 1.1 2.7.7 3.2.7s1.8-.7 2-1.3.3-1.1.2-1.2Z"/></svg></a>`,
  );
}
function shell() {
  document.body.insertAdjacentHTML("afterbegin", header());
  document.body.insertAdjacentHTML("beforeend", footer());
  const menu = $(".menu-toggle"),
    nav = $("nav");
  menu.onclick = () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  };
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("open") && !e.target.closest(".site-header")) {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    }
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    }
  });
  fixedWhatsApp();
}

// Trasforma gli orari del JSON in una riga leggibile nel footer.
function hoursSummary(list) {
  return (list || [])
    .map((x) =>
      x.aperto
        ? `${x.giorno} ${x.apertura}–${x.chiusura}`
        : `${x.giorno} chiuso`,
    )
    .join(" · ");
}
function renderHomeContent() {
  const c = state.content || {};
  const home = c.home || {};
  const why = $("#why-copy"),
    steps = $("#process-steps"),
    safety = $("#safety-note");
  if (why) why.textContent = home.percheSceglierci || "";
  if (steps)
    steps.innerHTML = (home.comeFunziona || [])
      .map((step) => `<li>${esc(step)}</li>`)
      .join("");
  if (safety) safety.textContent = c.sicurezza?.testo || "";
}

// Crea una singola scheda riutilizzabile nella home e nel catalogo.
function card(x) {
  const unavailable = x.disponibile === false;
  return `<article class="card${unavailable ? " unavailable" : ""}"><a class="card-link" data-detail="${x.id}" href="catalogo.html#${x.id}" aria-label="Vedi dettagli di ${esc(x.nome)}"><div class="card-image"><img src="${esc(x.foto[0])}" alt="${esc(x.nome)}" width="1200" height="900" loading="lazy" decoding="async">${unavailable ? '<span class="unavailable-label">Non disponibile</span>' : ""}</div><div class="card-body"><span class="tag">${esc(x.categorie.join(" · "))}</span><h3>${esc(x.nome)}</h3><p>${esc(x.dimensioni)}</p><span class="text-link">Vedi dettagli →</span></div></a></article>`;
}
function filtered() {
  let a = state.items.filter(
    (x) => state.category === "Tutti" || x.categorie.includes(state.category),
  );
  if (state.sort === "name") a.sort((x, y) => x.nome.localeCompare(y.nome));
  return a;
}

// Aggiorna filtri, contatore e griglia del catalogo.
function renderCatalog() {
  const w = $("#catalog-grid");
  if (!w) return;
  $("#category-filter").innerHTML = state.config.categorie
    .filter((x) => x !== "Tutti")
    .map(
      (x) =>
        `<option value="${esc(x)}" ${x === state.category ? "selected" : ""}>${esc(x)}</option>`,
    )
    .join("");
  $("#category-filter").insertAdjacentHTML(
    "afterbegin",
    '<option value="Tutti">Tutti</option>',
  );
  $("#category-filter").value = state.category;
  w.innerHTML = filtered().map(card).join("");
  $("#results-count").textContent = `${filtered().length} proposte`;
  [
    ["category-filter", "category"],
    ["sort-filter", "sort"],
  ].forEach(([id, key]) => {
    $("#" + id).onchange = (e) => {
      state[key] = e.target.value;
      renderCatalog();
    };
  });
  $("#reset-filters").onclick = () => {
    state.category = "Tutti";
    state.sort = "default";
    renderCatalog();
  };
}

function isVideo(src) {
  return /\.mp4(?:$|[?#])/i.test(src);
}
function mediaMarkup(src, className, alt, controls = false) {
  return isVideo(src)
    ? `<video class="${className}" aria-label="${esc(alt)}" ${controls ? "controls " : ""}preload="metadata"><source src="${esc(src)}" type="video/mp4">Il browser non supporta i video.</video>`
    : `<img class="${className}" src="${esc(src)}" alt="${esc(alt)}">`;
}

// Galleria a schermo intero per ingrandire le foto.
function lightbox(photos, start, alt) {
  const d = document.createElement("dialog");
  d.className = "lightbox";
  d.innerHTML = `<button class="lightbox-close" aria-label="Chiudi">×</button><button class="lightbox-prev" aria-label="Foto precedente">‹</button><div class="lightbox-media"></div><button class="lightbox-next" aria-label="Foto successiva">›</button><p class="gallery-counter"></p>`;
  document.body.append(d);
  let i = start,
    touchX = 0;
  const show = (n) => {
    i = (n + photos.length) % photos.length;
    $(".lightbox-media", d).innerHTML = mediaMarkup(
      photos[i],
      "lightbox-image",
      alt,
      true,
    );
    $(".gallery-counter", d).textContent = `${i + 1} / ${photos.length}`;
  };
  show(i);
  d.showModal();
  document.body.classList.add("gallery-open");
  const close = () => {
    d.close();
    d.remove();
    if (!document.querySelector("dialog[open]"))
      document.body.classList.remove("gallery-open");
  };
  d.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
  $(".lightbox-close", d).onclick = close;
  $(".lightbox-prev", d).onclick = () => show(i - 1);
  $(".lightbox-next", d).onclick = () => show(i + 1);
  d.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].clientX;
    },
    { passive: true },
  );
  d.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 45) show(dx < 0 ? i + 1 : i - 1);
    },
    { passive: true },
  );
  d.onkeydown = (e) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(i - 1);
    if (e.key === "ArrowRight") show(i + 1);
  };
}
function renderGallery(item) {
  if (!item) return;
  const box = $("#detail-modal");
  let index = 0;
  const unavailable = item.disponibile === false;
  box.innerHTML = `<div class="modal-inner"><button class="modal-close" aria-label="Chiudi">×</button><div class="gallery"><div class="gallery-stage${unavailable ? " unavailable" : ""}"><button class="gallery-prev" type="button" aria-label="Foto precedente">‹</button>${mediaMarkup(item.foto[0], "gallery-main", item.nome, true)}${unavailable ? '<span class="unavailable-label">Non disponibile</span>' : ""}<button class="gallery-next" type="button" aria-label="Foto successiva">›</button></div><p class="gallery-counter">1 / ${item.foto.length}</p><div class="thumbs">${item.foto.map((f, i) => `<button class="thumb ${i ? "" : "active"}" type="button">${mediaMarkup(f, "", `Foto ${i + 1}`)}</button>`).join("")}</div></div><div class="detail-copy"><span class="tag">${esc(item.categorie.join(" · "))}</span><h2>${esc(item.nome)}</h2><p>${esc(item.descrizione)}</p><dl><div><dt>Dimensioni</dt><dd>${esc(item.dimensioni)}</dd></div></dl><button class="button" data-book>Prenota questo gonfiabile</button></div></div>`;
  box.showModal();
  box.addEventListener(
    "close",
    () => document.body.classList.remove("gallery-open"),
    { once: true },
  );
  document.body.classList.add("gallery-open");
  const show = (n) => {
    index = (n + item.foto.length) % item.foto.length;
    const main = $(".gallery-main", box);
    main.outerHTML = mediaMarkup(
      item.foto[index],
      "gallery-main",
      item.nome,
      true,
    );
    $(".gallery-counter", box).textContent =
      `${index + 1} / ${item.foto.length}`;
    box
      .querySelectorAll(".thumb")
      .forEach((b, j) => b.classList.toggle("active", j === index));
  };
  $(".modal-close", box).onclick = () => {
    box.close();
    document.body.classList.remove("gallery-open");
  };
  $(".gallery-prev", box).onclick = () => show(index - 1);
  $(".gallery-next", box).onclick = () => show(index + 1);
  box.querySelectorAll(".thumb").forEach((b, i) => (b.onclick = () => show(i)));
  box.addEventListener("click", (event) => {
    if (event.target.matches("img.gallery-main")) {
      lightbox(item.foto, index, item.nome);
    }
  });
  $("[data-book]", box).onclick = () =>
    (location.href = `contatti.html?prodotto=${encodeURIComponent(item.nome)}#prenota`);
}

// Sezione Casa del Festaiolo: galleria, orari, indirizzo e WhatsApp.
function renderHours(list) {
  const days = [
      "Domenica",
      "Lunedì",
      "Martedì",
      "Mercoledì",
      "Giovedì",
      "Venerdì",
      "Sabato",
    ],
    today = new Intl.DateTimeFormat("it-IT", {
      timeZone: "Europe/Rome",
      weekday: "long",
    }).format(new Date()),
    rows = list
      .map(
        (x) =>
          `<tr class="${x.giorno.toLowerCase() === today ? "today" : ""}"><th scope="row">${x.giorno}</th><td>${x.aperto ? `${x.apertura}–${x.chiusura}` : "Chiuso"}${x.giorno.toLowerCase() === today ? ` <strong>(${x.aperto ? "aperto" : "chiuso"} oggi)</strong>` : ""}</td></tr>`,
      )
      .join("");
  return `<table class="hours-table"><caption>Orari di apertura</caption><tbody>${rows}</tbody></table>`;
}
function renderHouse() {
  if (!$("#casa-title")) return;
  const h = state.house,
    photos = h.galleria || [],
    g = $("#casa-gallery");
  const fixed = $(".whatsapp-float");
  if (fixed && "IntersectionObserver" in window)
    new IntersectionObserver(
      ([entry]) =>
        document.body.classList.toggle("gallery-visible", entry.isIntersecting),
      { threshold: 0.15 },
    ).observe(g);
  $("#casa-title").textContent = h.nome;
  $("#casa-description").textContent = h.descrizione;
  $("#casa-hours").innerHTML = renderHours(h.orari);
  $("#casa-address").innerHTML =
    `<a href="${esc(h.mappa)}" target="_blank" rel="noopener">${esc(h.indirizzo)}</a>`;
  const directions = $("#casa-directions");
  if (directions) directions.href = h.mappa;
  $("#casa-map").innerHTML =
    `<iframe title="Mappa Casa del Festaiolo" loading="lazy" src="https://www.google.com/maps?q=${encodeURIComponent(h.indirizzo)}&output=embed"></iframe>`;
  g.innerHTML = photos.length
    ? `<div class="house-gallery-stage"><button class="gallery-prev" type="button">‹</button><img class="house-gallery-main" src="${esc(photos[0])}" alt="Casa del Festaiolo"><button class="gallery-next" type="button">›</button><p class="gallery-counter">1 / ${photos.length}</p></div><div class="thumbs">${photos.map((f, i) => `<button class="thumb ${i ? "" : "active"}" type="button"><img src="${esc(f)}" alt="Foto ${i + 1}"></button>`).join("")}</div>`
    : "Nessuna foto disponibile";
  let i = 0;
  const show = (n) => {
    i = (n + photos.length) % photos.length;
    $(".house-gallery-main", g).src = photos[i];
    $(".gallery-counter", g).textContent = `${i + 1} / ${photos.length}`;
    g.querySelectorAll(".thumb").forEach((b, j) =>
      b.classList.toggle("active", j === i),
    );
  };
  if (photos.length) {
    $(".gallery-prev", g).onclick = () => show(i - 1);
    $(".gallery-next", g).onclick = () => show(i + 1);
    swipe($(".house-gallery-stage", g), (n) => show(i + n));
    $(".house-gallery-main", g).onclick = () => lightbox(photos, i, h.nome);
    g.querySelectorAll(".thumb").forEach((b, j) => (b.onclick = () => show(j)));
  }
  const contacts = state.contacts?.casa || [],
    buttons = contacts
      .map((c) => {
        const isPhone = c.tipo === "telefono";
        const label = isPhone
          ? "Casa del Festaiolo (fisso)"
          : "WhatsApp Alessia";
        const phone = String(c.numero || "").replace(/[^+0-9]/g, "");
        return isPhone
          ? `<a class="button whatsapp-choice" href="tel:${phone}">${label}</a>`
          : `<a class="button whatsapp-choice" target="_blank" rel="noopener" href="https://wa.me/${waNumber(c.numero)}?text=${encodeURIComponent("Ciao Alessia, vorrei informazioni sulla Casa del Festaiolo.")}">${label}</a>`;
      })
      .join("");
  ["#casa-whatsapp", "#casa-intro-whatsapp"].forEach((selector) => {
    const links = $(selector);
    if (links) links.innerHTML = buttons;
  });
  renderReviews($("#casa-reviews"));
}

// Mostra solo le recensioni approvate e associate alla pagina corrente.
function renderReviews(t) {
  if (t)
    t.innerHTML = state.reviews.length
      ? state.reviews
          .map(
            (r) =>
              `<article class="review"><strong>${esc(r.nome)}</strong><div class="review-stars" aria-label="${esc(r.stelle)} stelle">${"★".repeat(Number(r.stelle) || 0)}${"☆".repeat(5 - (Number(r.stelle) || 0))}</div><p>${esc(r.testo)}</p>${r.data ? `<small>${esc(r.data)}</small>` : ""}</article>`,
          )
          .join("")
      : "<p>Presto le recensioni dei nostri clienti</p>";
}
function setupReviewForms() {
  document.querySelectorAll("[data-review-form]").forEach((f) => {
    f.onsubmit = async (e) => {
      e.preventDefault();
      const result = $("[data-review-result]", f);
      if (!f.reportValidity()) return;
      result.textContent = "Invio in corso…";
      try {
        const response = await fetch("reviews.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(f))),
        });
        if (response.status === 404)
          throw new Error(
            "Servizio recensioni non disponibile: carica reviews.php sul server Aruba.",
          );
        const raw = await response.text();
        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          throw new Error("Risposta non valida dal server");
        }
        if (!response.ok) throw new Error(data.error || "Invio non riuscito");
        f.reset();
        result.textContent =
          "Grazie! La recensione verrà pubblicata dopo una verifica.";
      } catch (error) {
        result.textContent = error.message;
      }
    };
  });
}

// Prepara il modulo preventivo e apre WhatsApp con i dati inseriti.
function setupForm() {
  const f = $("#booking-form");
  if (!f) return;
  const p = new URLSearchParams(location.search).get("prodotto");
  $("#product-options").innerHTML = state.items
    .map(
      (x) =>
        `<label class="check"><input type="checkbox" name="products" value="${esc(x.nome)}" ${p === x.nome ? "checked" : ""}> ${esc(x.nome)}</label>`,
    )
    .join("");
  const cs = state.contacts.rental;
  $("#whatsapp-contact").innerHTML = cs
    .map(
      (x, i) =>
        `<option value="${i}">${esc(x.nome)} (${esc(x.numero)})</option>`,
    )
    .join("");
  f.onsubmit = (e) => {
    e.preventDefault();
    if (!f.reportValidity()) return;
    const d = new FormData(f),
      c = cs[Number(d.get("whatsapp"))] || cs[0],
      msg = `Ciao, sono ${d.get("name")}.\nTelefono: ${d.get("phone")}.\nVorrei un preventivo per: ${d.getAll("products").join(", ") || "un gonfiabile"}.\nData: ${d.get("date") || "da definire"}.\nLuogo: ${d.get("location") || "da definire"}.\nNote: ${d.get("notes") || "nessuna"}`,
      wa = `https://wa.me/${waNumber(c.numero)}?text=${encodeURIComponent(msg)}`;
    $("#form-result").innerHTML =
      `<p class="success">Messaggio pronto: <a target="_blank" rel="noopener" href="${wa}">Apri WhatsApp con ${esc(c.nome)}</a></p>`;
  };
}

// Carica tutti i dati statici prima di inizializzare la pagina.
async function loadData() {
  const names = [
      "config.json",
      "gonfiabili.json",
      "content.json",
      "casa-del-festaiolo.json",
      "recensioni.json",
      "contatti.json",
    ],
    data = await Promise.all(
      names.map((x) =>
        fetch("data/" + x + "?v=51").then((response) => {
          if (!response.ok) throw new Error(`Impossibile caricare data/${x}`);
          return response.json();
        }),
      ),
    );
  Object.assign(state, {
    config: data[0],
    items: data[1],
    content: data[2],
    house: data[3],
    reviews: data[4],
    contacts: data[5],
  });
  const params = new URLSearchParams(location.search),
    initialCategory = params.get("categoria");
  state.category = initialCategory || "Tutti";
  if (initialCategory && location.pathname.endsWith("catalogo.html"))
    history.replaceState(null, "", `${location.pathname}${location.hash}`);
  shell();
  renderHomeContent();
  renderCatalog();
  const ft = $("#filter-toggle"),
    tb = $(".toolbar");
  if (ft && tb)
    ft.onclick = () => {
      const open = tb.classList.toggle("filters-open");
      ft.setAttribute("aria-expanded", String(open));
    };
  const fa = $("#filter-apply");
  if (fa && ft && tb)
    fa.onclick = () => {
      tb.classList.remove("filters-open");
      ft.setAttribute("aria-expanded", "false");
    };
  setupForm();
  setupReviewForms();
  renderHouse();
  renderReviews($("#home-reviews"));
  renderReviews($("#casa-reviews"));
  const cats = $("#category-list");
  if (cats)
    cats.innerHTML = state.config.categorie
      .filter((x) => x !== "Tutti")
      .slice(0, 6)
      .map(
        (x) =>
          `<a href="catalogo.html?categoria=${encodeURIComponent(x)}">${esc(x)} <span>↗</span></a>`,
      )
      .join("");
  const featured = $("#featured-grid");
  if (featured) featured.innerHTML = state.items.slice(0, 3).map(card).join("");
  const phone = $('[data-contact="telefono"]'),
    email = $('[data-contact="email"]');
  if (phone) {
    phone.textContent = state.contacts.telefono;
    phone.href = `tel:${state.contacts.telefono.replace(/[^+0-9]/g, "")}`;
  }
  if (email) {
    email.textContent = state.contacts.email;
    email.href = `mailto:${state.contacts.email}`;
  }
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-detail]");
    if (!link) return;
    e.preventDefault();
    history.replaceState(null, "", `#${link.dataset.detail}`);
    renderGallery(state.items.find((x) => x.id === link.dataset.detail));
  });
  if (location.hash) {
    const item = state.items.find((x) => `#${x.id}` === location.hash);
    if (item) renderGallery(item);
  }
}
loadData();
