document.addEventListener("DOMContentLoaded", function () {
  const squadreInfo = {
    Squadra1: { nome: "Milan", logo: "loghi/logo1.png", annoFondazione: 1899, allenatore: "Stefano Pioli" },
    Squadra2: { nome: "Inter", logo: "loghi/logo2.png", annoFondazione: 1908, allenatore: "Simone Inzaghi" },
    Squadra3: { nome: "Juventus", logo: "loghi/logo3.png", annoFondazione: 1897, allenatore: "Massimiliano Allegri" },
    Squadra4: { nome: "Napoli", logo: "loghi/logo4.png", annoFondazione: 1926, allenatore: "Luciano Spalletti" },
    Squadra5: { nome: "Roma", logo: "loghi/logo5.png", annoFondazione: 1927, allenatore: "José Mourinho" },
    Squadra6: { nome: "Lazio", logo: "loghi/logo6.png", annoFondazione: 1900, allenatore: "Maurizio Sarri" },
    Squadra7: { nome: "Fiorentina", logo: "loghi/logo7.png", annoFondazione: 1926, allenatore: "Vincenzo Italiano" },
    Squadra8: { nome: "Atalanta", logo: "loghi/logo8.png", annoFondazione: 1907, allenatore: "Gian Piero Gasperini" },
    Squadra9: { nome: "Torino", logo: "loghi/logo9.png", annoFondazione: 1906, allenatore: "Ivan Juric" },
    Squadra10: { nome: "Sassuolo", logo: "loghi/logo10.png", annoFondazione: 1920, allenatore: "Alessio Dionisi" },
    Squadra11: { nome: "Bologna", logo: "loghi/logo11.png", annoFondazione: 1909, allenatore: "Sinisa Mihajlovic" },
    Squadra12: { nome: "Verona", logo: "loghi/logo12.png", annoFondazione: 1903, allenatore: "Marco Baroni" },
  };

  Papa.parse("calciatori.csv", {
    download: true,
    header: true,
    complete: function (results) {
      const data = results.data.filter(row => Object.values(row).some(cell => cell.trim() !== ""));
      
      const teamsContainer = document.getElementById("teamsContainer");
      const squadreDetailsContainer = document.getElementById("squadreDetailsContainer");

      // Genera box squadre (logo link, nome senza link)
      Object.entries(squadreInfo).forEach(([key, squadra]) => {
        const teamDiv = document.createElement("div");
        teamDiv.classList.add("team");

        // Link sul logo
        const logoLink = document.createElement("a");
        logoLink.href = `#${key}`;
        const logoImg = document.createElement("img");
        logoImg.src = squadra.logo;
        logoImg.alt = `Logo ${squadra.nome}`;
        logoImg.width = 50;
        logoImg.height = 50;
        logoLink.appendChild(logoImg);

        // Nome senza link
        const nomeSpan = document.createElement("span");
        nomeSpan.textContent = squadra.nome;
        nomeSpan.classList.add("team-name");

        // Descrizione placeholder
        const descrizione = document.createElement("p");
        descrizione.textContent = "Descrizione breve della squadra.";

        teamDiv.appendChild(logoLink);
        teamDiv.appendChild(nomeSpan);
        teamDiv.appendChild(descrizione);
        teamsContainer.appendChild(teamDiv);
      });

      // Sezioni dedicate alle squadre
      Object.entries(squadreInfo).forEach(([key, squadra]) => {
        const section = document.createElement("section");
        section.id = key;
        section.classList.add("team-detail");

        // Titolo e logo
        const title = document.createElement("h3");
        title.textContent = squadra.nome;

        const logoImg = document.createElement("img");
        logoImg.src = squadra.logo;
        logoImg.alt = `Logo ${squadra.nome}`;
        logoImg.width = 80;
        logoImg.height = 80;

        // Anno fondazione e allenatore
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("team-info");
        infoDiv.innerHTML = `
          <p><strong>Anno di fondazione:</strong> ${squadra.annoFondazione}</p>
          <p><strong>Allenatore:</strong> ${squadra.allenatore}</p>
        `;

        // Lista giocatori di questa squadra
        const giocatori = data.filter(g => g.Proprietario === key);

        const giocatoriList = document.createElement("ul");
        giocatoriList.classList.add("giocatori-list");
        if (giocatori.length === 0) {
          giocatoriList.innerHTML = "<li>Nessun giocatore attualmente in questa squadra.</li>";
        } else {
          giocatori.forEach(g => {
            const li = document.createElement("li");
            li.textContent = `${g.Nome} - ${g.Ruolo} (${g.Mantra}), Anno: ${g.Anno}`;
            giocatoriList.appendChild(li);
          });
        }

        section.appendChild(title);
        section.appendChild(logoImg);
        section.appendChild(infoDiv);
        section.appendChild(giocatoriList);
        squadreDetailsContainer.appendChild(section);
      });
    },
    error: function (err) {
      console.error("Errore caricamento CSV:", err);
    }
  });
});
