document.addEventListener("DOMContentLoaded", () => {
  const csvUrl = "calciatori.csv";
  const teamsContainer = document.getElementById("teams-container");
  const squadreDedicateContainer = document.getElementById("squadre-dedicate-container");
  const squadraSelect = document.getElementById("squadra-select");

  // Mappa per tenere i giocatori raggruppati per Proprietario (Squadra1, Squadra2, ecc.)
  const squadreMap = new Map();

  // Informazioni sulle 12 squadre "proprietarie"
  const squadreInfo = {
    "Squadra1": { logo: "loghi/logo1.png", descrizione: "La prima squadra con storia leggendaria." },
    "Squadra2": { logo: "loghi/logo2.png", descrizione: "Una squadra giovane e ambiziosa." },
    "Squadra3": { logo: "loghi/logo3.png", descrizione: "Squadra solida e con ottimi giocatori." },
    "Squadra4": { logo: "loghi/logo4.png", descrizione: "Il team delle grandi strategie." },
    "Squadra5": { logo: "loghi/logo5.png", descrizione: "Una squadra con un forte spirito di squadra." },
    "Squadra6": { logo: "loghi/logo6.png", descrizione: "Squadra dal grande potenziale." },
    "Squadra7": { logo: "loghi/logo7.png", descrizione: "Una squadra con una storia ricca." },
    "Squadra8": { logo: "loghi/logo8.png", descrizione: "La squadra più tecnica del campionato." },
    "Squadra9": { logo: "loghi/logo9.png", descrizione: "Una squadra con giocatori di talento." },
    "Squadra10": { logo: "loghi/logo10.png", descrizione: "Squadra che punta all'eccellenza." },
    "Squadra11": { logo: "loghi/logo11.png", descrizione: "Una squadra con grande passione." },
    "Squadra12": { logo: "loghi/logo12.png", descrizione: "La squadra con una storia affascinante." }
  };

  // Stato ordinamento giocatori per sezione
  const ordinamentoGiocatori = {};

  function creaBoxSquadra(nome) {
    const info = squadreInfo[nome] || { logo: "", descrizione: "" };
    const box = document.createElement("div");
    box.classList.add("team");
    box.setAttribute("tabindex", "0");
    box.dataset.squadra = nome;
    const numGiocatori = (squadreMap.get(nome) || []).length;
    box.innerHTML = `
      <a href="#${nome}" tabindex="-1">
        <img src="${info.logo}" alt="Logo ${nome}" />
      </a>
      <a href="#${nome}" class="name-link" tabindex="-1">${nome} (${numGiocatori})</a>
      <p>${info.descrizione}</p>
    `;
    box.addEventListener("click", () => {
      squadraSelect.value = nome;
      squadraSelect.dispatchEvent(new Event("change"));
      const section = document.getElementById(nome);
      if (section) section.focus();
    });
    return box;
  }

  function creaSezioneSquadra(nome, giocatori) {
    const info = squadreInfo[nome] || { logo: "", descrizione: "" };
    const section = document.createElement("section");
    section.classList.add("squadra-dedicata");
    section.id = nome;
    section.setAttribute("tabindex", "0");

    section.innerHTML = `
      <h3><img src="${info.logo}" alt="Logo ${nome}" /> ${nome} (${giocatori.length})</h3>
      <div class="details">${info.descrizione}</div>
      <div class="search-giocatori">
        <input type="text" placeholder="Cerca giocatori..." aria-label="Cerca giocatori della squadra ${nome}" />
      </div>
      <h4 class="sortable-giocatori" tabindex="0">Giocatori attuali</h4>
      <ul class="giocatori">
        ${giocatori.length > 0 ? giocatori.map(g => `<li>${g.Nome} (${g.Squadra})</li>`).join("") : "<li>Nessun giocatore trovato</li>"}
      </ul>
    `;

    const inputRicerca = section.querySelector(".search-giocatori input");
    const listaGiocatori = section.querySelector("ul.giocatori");
    inputRicerca.addEventListener("input", () => {
      const val = inputRicerca.value.toLowerCase();
      const items = listaGiocatori.querySelectorAll("li");
      items.forEach(li => {
        li.style.display = li.textContent.toLowerCase().includes(val) ? "" : "none";
      });
    });

    const h4Ordinamento = section.querySelector("h4.sortable-giocatori");
    ordinamentoGiocatori[section.id] = 1;

    h4Ordinamento.addEventListener("click", () => {
      const currentOrd = ordinamentoGiocatori[section.id];
      ordinamentoGiocatori[section.id] = currentOrd * -1;

      h4Ordinamento.classList.toggle("sort-asc", ordinamentoGiocatori[section.id] === 1);
      h4Ordinamento.classList.toggle("sort-desc", ordinamentoGiocatori[section.id] === -1);

      const giocatoriArray = Array.from(listaGiocatori.querySelectorAll("li"));
      giocatoriArray.sort((a, b) => {
        if (a.textContent < b.textContent) return -1 * ordinamentoGiocatori[section.id];
        if (a.textContent > b.textContent) return 1 * ordinamentoGiocatori[section.id];
        return 0;
      });
      listaGiocatori.innerHTML = "";
      giocatoriArray.forEach(li => listaGiocatori.appendChild(li));
    });
    h4Ordinamento.classList.add("sort-asc");

    return section;
  }

  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data.filter(row => Object.values(row).some(cell => cell.trim() !== ""));

      // Raggruppa i giocatori per "Proprietario"
      data.forEach(giocatore => {
        const proprietario = giocatore.Proprietario.trim();
        if (!squadreMap.has(proprietario)) {
          squadreMap.set(proprietario, []);
        }
        squadreMap.get(proprietario).push(giocatore);
      });

      // Popola dropdown filtro con le 12 squadre
      Object.keys(squadreInfo).forEach(nomeSquadra => {
        const opt = document.createElement("option");
        opt.value = nomeSquadra;
        opt.textContent = nomeSquadra;
        squadraSelect.appendChild(opt);
      });

      // Crea box riepilogativi
      Object.keys(squadreInfo).forEach(nomeSquadra => {
        const box = creaBoxSquadra(nomeSquadra);
        teamsContainer.appendChild(box);
      });

      // Crea sezioni dedicate (tutte visibili)
      Object.keys(squadreInfo).forEach(nomeSquadra => {
        const giocatori = squadreMap.get(nomeSquadra) || [];
        const section = creaSezioneSquadra(nomeSquadra, giocatori);
        squadreDedicateContainer.appendChild(section);
      });

      // Filtro dropdown squadra
      squadraSelect.addEventListener("change", () => {
        const scelta = squadraSelect.value;

        document.querySelectorAll(".squadra-dedicata").forEach(sec => {
          if (!scelta) {
            sec.classList.remove("hidden");
          } else {
            if (sec.id === scelta) {
              sec.classList.remove("hidden");
              sec.focus();
            } else {
              sec.classList.add("hidden");
            }
          }
        });

        document.querySelectorAll(".team").forEach(box => {
          box.classList.toggle("active", box.dataset.squadra === scelta);
        });

        if (scelta) {
          const el = document.getElementById(scelta);
          if (el) el.scrollIntoView({behavior: "smooth"});
        }
      });
    },
    error: function(err) {
      console.error("Errore caricamento CSV:", err);
    }
  });
});

