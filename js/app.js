// Agrega aquí nuevos años cuando crees data/2027.js, data/2028.js, etc.
const TEMPORADAS_DISPONIBLES = [
  { id: "2026", label: "2026" }
];

let currentSeason = TEMPORADAS_DISPONIBLES[0].id;
let currentTab = "goleadores";
let searchQuery = "";

const formatCLP = (num) => "$" + num.toLocaleString("es-CL");

function getActiveData() {
  return window.SEASON_DATA?.[currentSeason] || {
    anio: currentSeason,
    tituloFecha: `Temporada ${currentSeason} • Sin datos cargados`,
    playlistId: "",
    goleadores: [],
    arqueros: [],
    viejosCrack: [],
    finanzas: []
  };
}

function populateSeasonSelector() {
  const select = document.getElementById("season-select");
  select.innerHTML = TEMPORADAS_DISPONIBLES
    .map(t => `<option value="${t.id}">${t.label}</option>`)
    .join("");
  select.value = currentSeason;
}

function updateLeaders(data) {
  const sortedScorers = [...data.goleadores].sort((a, b) => b.goles - a.goles || a.pj - b.pj);
  const sortedGKs = [...data.arqueros].sort((a, b) => b.puntaje - a.puntaje);
  const sortedVC = [...data.viejosCrack]
    .map(p => ({ ...p, puntaje: p.pj * 5 + p.goles * 0.5 }))
    .sort((a, b) => b.puntaje - a.puntaje);

  document.getElementById("leader-scorer-name").textContent = sortedScorers[0]?.nombre || "—";
  document.getElementById("leader-scorer-stat").textContent = sortedScorers[0]
    ? `${sortedScorers[0].goles} Goles Totales`
    : "Sin datos";

  document.getElementById("leader-gk-name").textContent = sortedGKs[0]?.nombre || "—";
  document.getElementById("leader-gk-stat").textContent = sortedGKs[0]
    ? `${sortedGKs[0].puntaje} Puntos Anuales`
    : "Sin datos";

  document.getElementById("leader-vc-name").textContent = sortedVC[0]?.nombre || "—";
  document.getElementById("leader-vc-stat").textContent = sortedVC[0]
    ? `${sortedVC[0].puntaje.toFixed(1)} Puntos`
    : "Sin datos";
}

function getRankBadge(index) {
  if (index === 0) return `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/40">1</span>`;
  if (index === 1) return `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-400/20 text-zinc-300 font-bold text-xs border border-zinc-400/40">2</span>`;
  if (index === 2) return `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-700/30 text-orange-400 font-bold text-xs border border-orange-600/40">3</span>`;
  return `<span class="text-zinc-500 font-mono text-xs pl-2">${index + 1}</span>`;
}

function renderTable() {
  const data = getActiveData();
  const thead = document.getElementById("table-head");
  const tbody = document.getElementById("table-body");
  const formulaEl = document.getElementById("table-formula");
  const countEl = document.getElementById("table-count");

  const filterFn = (item) => item.nombre.toLowerCase().includes(searchQuery.toLowerCase());

  if (currentTab === "goleadores") {
    const list = [...data.goleadores]
      .sort((a, b) => b.goles - a.goles || a.pj - b.pj)
      .map((item, idx) => ({ ...item, rank: idx }))
      .filter(filterFn);

    formulaEl.textContent = `Temporada ${data.anio} • Ordenado por Goles Totales • Promedio = Goles / PJ`;
    countEl.textContent = `${list.length} jugadores`;

    thead.innerHTML = `
      <tr>
        <th class="py-3 px-4 w-14">#</th>
        <th class="py-3 px-4">Jugador</th>
        <th class="py-3 px-4 text-right">PJ</th>
        <th class="py-3 px-4 text-right">Goles</th>
        <th class="py-3 px-4 text-right">Promedio</th>
      </tr>`;

    tbody.innerHTML = list.map(p => {
      const prom = p.pj > 0 ? (p.goles / p.pj).toFixed(2) : "0.00";
      return `
        <tr class="hover:bg-zinc-800/40 transition">
          <td class="py-3 px-4">${getRankBadge(p.rank)}</td>
          <td class="py-3 px-4 font-medium text-zinc-100">${p.nombre}</td>
          <td class="py-3 px-4 text-right text-zinc-400">${p.pj}</td>
          <td class="py-3 px-4 text-right font-bold text-emerald-400">${p.goles}</td>
          <td class="py-3 px-4 text-right text-zinc-300 font-mono text-xs">${prom}</td>
        </tr>`;
    }).join("");

  } else if (currentTab === "arqueros") {
    const list = [...data.arqueros]
      .sort((a, b) => b.puntaje - a.puntaje)
      .map((item, idx) => ({ ...item, rank: idx }))
      .filter(filterFn);

    formulaEl.textContent = `Temporada ${data.anio} • Fórmula: 15 pts base menos goles recibidos en la fecha`;
    countEl.textContent = `${list.length} arqueros`;

    thead.innerHTML = `
      <tr>
        <th class="py-3 px-4 w-14">#</th>
        <th class="py-3 px-4">Arquero</th>
        <th class="py-3 px-4 text-right">PJ</th>
        <th class="py-3 px-4 text-right">Goles Contra</th>
        <th class="py-3 px-4 text-right">Prom. GC</th>
        <th class="py-3 px-4 text-right">Puntaje Anual</th>
      </tr>`;

    tbody.innerHTML = list.map(p => {
      const prom = p.pj > 0 ? (p.golesContra / p.pj).toFixed(2) : "0.00";
      const ptsColor = p.puntaje >= 0 ? "text-sky-400" : "text-rose-400";
      return `
        <tr class="hover:bg-zinc-800/40 transition">
          <td class="py-3 px-4">${getRankBadge(p.rank)}</td>
          <td class="py-3 px-4 font-medium text-zinc-100">${p.nombre}</td>
          <td class="py-3 px-4 text-right text-zinc-400">${p.pj}</td>
          <td class="py-3 px-4 text-right text-zinc-300">${p.golesContra}</td>
          <td class="py-3 px-4 text-right text-zinc-400 font-mono text-xs">${prom}</td>
          <td class="py-3 px-4 text-right font-bold ${ptsColor}">${p.puntaje}</td>
        </tr>`;
    }).join("");

  } else if (currentTab === "viejosCrack") {
    const list = [...data.viejosCrack]
      .map(p => ({ ...p, puntaje: p.pj * 5 + p.goles * 0.5 }))
      .sort((a, b) => b.puntaje - a.puntaje)
      .map((item, idx) => ({ ...item, rank: idx }))
      .filter(filterFn);

    formulaEl.textContent = `Temporada ${data.anio} • Fórmula: (PJ × 5 pts) + (Goles × 0.5 pts)`;
    countEl.textContent = `${list.length} jugadores`;

    thead.innerHTML = `
      <tr>
        <th class="py-3 px-4 w-14">#</th>
        <th class="py-3 px-4">Jugador</th>
        <th class="py-3 px-4 text-right">PJ (×5)</th>
        <th class="py-3 px-4 text-right">Goles (×0.5)</th>
        <th class="py-3 px-4 text-right">Puntaje Total</th>
      </tr>`;

    tbody.innerHTML = list.map(p => `
      <tr class="hover:bg-zinc-800/40 transition">
        <td class="py-3 px-4">${getRankBadge(p.rank)}</td>
        <td class="py-3 px-4 font-medium text-zinc-100">${p.nombre}</td>
        <td class="py-3 px-4 text-right text-zinc-400">${p.pj}</td>
        <td class="py-3 px-4 text-right text-zinc-300">${p.goles}</td>
        <td class="py-3 px-4 text-right font-bold text-amber-400">${p.puntaje.toFixed(1)}</td>
      </tr>`
    ).join("");

  } else if (currentTab === "finanzas") {
    const list = data.finanzas.filter(filterFn);
    const totalAbonos = list.reduce((acc, item) => acc + item.abono, 0);

    formulaEl.textContent = `Temporada ${data.anio} • Total abonos visibles: ${formatCLP(totalAbonos)}`;
    countEl.textContent = `${list.length} registros`;

    thead.innerHTML = `
      <tr>
        <th class="py-3 px-4">Jugador</th>
        <th class="py-3 px-4 text-right">Partidos $2.500</th>
        <th class="py-3 px-4 text-right">Partidos $3.000</th>
        <th class="py-3 px-4 text-right">Abono Aportado</th>
      </tr>`;

    tbody.innerHTML = list.map(p => {
      const abonoClass = p.abono > 0 ? "text-emerald-400 font-semibold" : "text-zinc-500";
      return `
        <tr class="hover:bg-zinc-800/40 transition">
          <td class="py-3 px-4 font-medium text-zinc-100">${p.nombre}</td>
          <td class="py-3 px-4 text-right ${p.p2500 > 0 ? 'text-amber-300 font-medium' : 'text-zinc-600'}">${p.p2500}</td>
          <td class="py-3 px-4 text-right ${p.p3000 > 0 ? 'text-rose-300 font-medium' : 'text-zinc-600'}">${p.p3000}</td>
          <td class="py-3 px-4 text-right ${abonoClass}">${formatCLP(p.abono)}</td>
        </tr>`;
    }).join("");
  }

  if (!tbody.innerHTML.trim()) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-zinc-500">No hay resultados para mostrar.</td></tr>`;
  }
}

function renderVideos(data) {
  const iframe = document.getElementById("youtube-iframe");
  const wrapper = document.getElementById("video-player-wrapper");
  const emptyMsg = document.getElementById("video-empty-msg");
  const extLink = document.getElementById("youtube-external-link");
  const seasonLabel = document.getElementById("video-season-label");

  seasonLabel.textContent = `Temporada ${data.anio} • Usa el menú superior derecho del reproductor para elegir partido`;

  const cleanId = (data.playlistId || "").trim();
  if (!cleanId) {
    iframe.src = "";
    wrapper.classList.add("hidden");
    emptyMsg.classList.remove("hidden");
    extLink.href = "https://www.youtube.com";
    return;
  }

  wrapper.classList.remove("hidden");
  emptyMsg.classList.add("hidden");
  iframe.src = `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(cleanId)}`;
  extLink.href = `https://www.youtube.com/playlist?list=${encodeURIComponent(cleanId)}`;
}

function updateActiveView() {
  const data = getActiveData();
  const tableSection = document.getElementById("table-section");
  const videosSection = document.getElementById("videos-section");

  if (currentTab === "videos") {
    tableSection.classList.add("hidden");
    videosSection.classList.remove("hidden");
    renderVideos(data);
  } else {
    videosSection.classList.add("hidden");
    tableSection.classList.remove("hidden");
    renderTable();
  }
}

function renderSeason() {
  const data = getActiveData();
  document.getElementById("header-subtitle").textContent = data.tituloFecha;
  updateLeaders(data);
  updateActiveView();
}

document.getElementById("season-select").addEventListener("change", (e) => {
  currentSeason = e.target.value;
  renderSeason();
});

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentTab = btn.dataset.tab;
    document.querySelectorAll(".tab-btn").forEach(b => {
      b.className = "tab-btn shrink-0 px-4 py-2 rounded-lg text-sm font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 transition";
    });
    btn.className = "tab-btn shrink-0 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 transition";
    updateActiveView();
  });
});

document.getElementById("search-input").addEventListener("input", (e) => {
  searchQuery = e.target.value;
  if (currentTab === "videos" && searchQuery.trim()) {
    currentTab = "goleadores";
    document.querySelectorAll(".tab-btn").forEach(b => {
      b.className = b.dataset.tab === "goleadores"
        ? "tab-btn shrink-0 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 transition"
        : "tab-btn shrink-0 px-4 py-2 rounded-lg text-sm font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 transition";
    });
  }
  updateActiveView();
});

populateSeasonSelector();
renderSeason();
