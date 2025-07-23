document.addEventListener("DOMContentLoaded", () => {
  const teamsContainer = document.getElementById("teams-container");
  const detailsContainer = document.getElementById("team-details-container");

  // Definisci le 12 squadre con nome, logo e descrizione
  const squadreInfo = {
    Squadra1: {
      nome: "Squadra 1",
      logo: "loghi/logo1.png",
      descrizione: "Descrizione breve della Squadra 1."
    },
    Squadra2: {
      nome: "Squadra 2",
      logo: "loghi/logo2.png",
      descrizione: "Descrizione breve della Squadra 2."
    },
    Squadra3: {
      nome: "Squadra 3",
      logo: "loghi/logo3.png",
      descrizione: "Descrizione breve della Squadra 3."
    },
    Squadra4: {
      nome: "Squadra 4",
      logo: "loghi/logo4.png",
      descrizione: "Descrizione breve della Squadra 4."
    },
    Squadra5: {
      nome: "Squadra 5",
      logo: "loghi/logo5.png",
      descrizione: "Descrizione breve della Squadra 5."
    },
    Squadra6: {
      nome: "Squadra 6",
      logo: "loghi/logo6.png",
      descrizione: "Descrizione breve della Squadra 6."
    },
    Squadra7: {
      nome: "Squadra 7",
      logo: "loghi/logo7.png",
      descrizione: "Descrizione breve della Squadra 7."
    },
    Squadra8: {
      nome: "Squadra 8",
      logo: "loghi/logo8.png",
      descrizione: "Descrizione breve della Squadra 8."
    },
    Squadra9: {
      nome: "Squadra 9",
      logo: "loghi/logo9.png",
      descrizione: "Descrizione breve della Squadra 9."
    },
    Squadra10: {
      nome: "Squadra 10",
      logo: "loghi/logo10.png",
      descrizione: "Descrizione breve della Squadra 10."
    },
    Squadra11: {
      nome: "Squadra 11",
      logo: "loghi/logo11.png",
      descrizione: "Descrizione breve della Squadra 11."
    },
    Squadra12: {
      nome: "Squadra 12",
      logo: "loghi/logo12.png",
      descrizione: "Descrizione breve della Squadra 12."
    }
  };

  // Memorizza dati calciatori (caricati da CSV)
  let calciatoriData = [];

  // Carica il CSV calciatori
  Papa.parse("calciatori.csv", {
    download: true,
    header: true,
    complete: function(results) {
      calciatoriData = results.data.filter(r => Object.values(r).some(c => c.trim() !== ""));
      creaTeamBoxes();
    },
    error: function(err) {
      console.error("Errore caricamento CSV calciatori:", err);
      teamsContainer.textContent = "Errore nel caricamento dati calciatori.";
    }
  });

  // Crea le card delle squadre dinamicamente
  function creaTeamBoxes() {
    teamsContainer.innerHTML = "";
    for (const [key, info] of Object.entries(squadreInfo)) {
      const div = document.createElement("div");
      div.className = "team";

      const logoLink = document.createElement("a");
      logoLink.href = "#";
      logoLink.dataset.teamKey = key;
      logoLink.className = "team-link";
      logoLink.title = `Vai a ${info.nome}`;

      const img = document.createElement("img");
      img.src = info.logo;
      img.alt = `Logo ${info.nome}`;
      img.width = 80;
      img.height = 80;

      logoLink.appendChild(img);

      const nameLink = document.createElement("a");
      nameLink.href = "#";
      nameLink.dataset.teamKey = key;
      nameLink.className = "team-link";
      nameLink.textContent = info.nome;
      nameLink.title = `Vai a ${info.nome}`;

      const descr = document.createElement("p");
      descr.textContent = info.descrizione;

      div.appendChild(logoLink);
      div.appendChild(nameLink);
      div.appendChild(descr);

      teamsContainer.appendChild(div);
    }

    // Event listener click per logo e nome
    teamsContainer.querySelectorAll(".team-link").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const teamKey = e.currentTarget.dataset.teamKey;
        mostraDettagliSquadra(teamKey);
        // Scroll alla sezione dettagli
        detailsContainer.scrollIntoView({behavior: "smooth"});
      });
    });
  }

  // Mostra dettagli e giocatori della squadra selezionata
  function mostraDettagliSquadra(teamKey) {
    const info = squadreInfo[teamKey];
    if (!info) return;

    const giocatoriSquadra = calciatoriData.filter(c => c.Proprietario === teamKey);

    let html = `
      <section id="team-details" class="team-details">
        <h2>${info.nome}</h2>
        <img src="${info.logo}" alt="Logo ${info.nome}" width="120" height="120" />
        <p>${info.descrizione}</p>

        <h3>Giocatori di ${info.nome}</h3>
    `;

    if (giocatoriSquadra.length === 0) {
      html += `<p><em>Nessun giocatore assegnato a questa squadra.</em></p>`;
    } else {
      html += `<table class="players-table" aria-label="Giocatori di ${info.nome}">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Ruolo</th>
            <th>Mantra</th>
            <th>Anno</th>
            <th>Primavera</th>
            <th>Squadra Reale</th>
            <th>Valore Iniziale</th>
            <th>Anni Contratto</th>
            <th>Valore Contratto</th>
            <th>Trasferimento Futuro</th>
          </tr>
        </thead>
        <tbody>
      `;

      giocatoriSquadra.forEach(g => {
        html += `
          <tr>
            <td>${g.Nome}</td>
            <td>${g.Ruolo}</td>
            <td>${g.Mantra}</td>
            <td>${g.Anno}</td>
            <td>${g.Primavera}</td>
            <td>${g.Squadra}</td>
            <td>${g.ValoreIniziale}</td>
            <td>${g.AnniContratto}</td>
            <td>${g.ValoreContratto}</td>
            <td>${g.TrasferimentoFuturo}</td>
          </tr>
        `;
      });

      html += "</tbody></table>";
    }

    html += "</section>";

    detailsContainer.innerHTML = html;
  }
});
