document.addEventListener("DOMContentLoaded", function () {
  fetch("calciatori.csv")
    .then((response) => {
      if (!response.ok) throw new Error("Errore nel caricamento del CSV");
      return response.text();
    })
    .then((csvText) => {
      const results = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      if (results.errors.length) {
        console.error("Errori nel parsing CSV:", results.errors);
        return;
      }
      const data = results.data;

      const giocatoriPerSquadra = {};
      for (let i = 1; i <= 12; i++) {
        giocatoriPerSquadra["Squadra" + i] = [];
      }

      data.forEach((row) => {
        const proprietario = row.Proprietario?.trim();
        if (proprietario && giocatoriPerSquadra.hasOwnProperty(proprietario)) {
          giocatoriPerSquadra[proprietario].push({
            nome: row.Nome || "",
            ruolo: row.Ruolo || "",
            mantra: row.Mantra || "",
            anno: row.Anno || "",
            primavera: row.Primavera || "",
            squadraReale: row.Squadra || "",
            valoreIniziale: row.ValoreIniziale || "",
            anniContratto: row.AnniContratto || "",
            valoreContratto: row.ValoreContratto || "",
            trasferimentoFuturo: row.TrasferimentoFuturo || "",
          });
        }
      });

      const infoSquadre = {
        Squadra1: { fondazione: 2010, allenatore: "Mister A" },
        Squadra2: { fondazione: 2011, allenatore: "Mister B" },
        Squadra3: { fondazione: 2012, allenatore: "Mister C" },
        Squadra4: { fondazione: 2013, allenatore: "Mister D" },
        Squadra5: { fondazione: 2014, allenatore: "Mister E" },
        Squadra6: { fondazione: 2015, allenatore: "Mister F" },
        Squadra7: { fondazione: 2016, allenatore: "Mister G" },
        Squadra8: { fondazione: 2017, allenatore: "Mister H" },
        Squadra9: { fondazione: 2018, allenatore: "Mister I" },
        Squadra10: { fondazione: 2019, allenatore: "Mister J" },
        Squadra11: { fondazione: 2020, allenatore: "Mister K" },
        Squadra12: { fondazione: 2021, allenatore: "Mister L" },
      };

      const container = document.getElementById("teams-container");
      const detailsContainer = document.getElementById("team-details-container");

      // Pulizia contenuto
      container.innerHTML = "";
      detailsContainer.innerHTML = "";

      // Funzione per creare la scheda dettagliata
      function showTeamDetails(nomeSquadra) {
        const squadraInfo = infoSquadre[nomeSquadra];
        const giocatori = giocatoriPerSquadra[nomeSquadra];

        // Reset contenuto dettagli
        detailsContainer.innerHTML = "";

        const logoLarge = document.createElement("img");
        logoLarge.src = `loghi/logo${nomeSquadra.replace("Squadra", "")}.png`;
        logoLarge.alt = `Logo ${nomeSquadra}`;
        logoLarge.className = "team-logo-large";

        const titolo = document.createElement("h3");
        titolo.textContent = nomeSquadra;

        const infoDiv = document.createElement("div");
        infoDiv.className = "team-info";

        const fondazione = document.createElement("p");
        fondazione.textContent = `Anno di fondazione: ${squadraInfo?.fondazione || "N/D"}`;

        const allenatore = document.createElement("p");
        allenatore.textContent = `Allenatore: ${squadraInfo?.allenatore || "N/D"}`;

        infoDiv.appendChild(fondazione);
        infoDiv.appendChild(allenatore);

        const lista = document.createElement("ul");
        if (giocatori.length === 0) {
          const li = document.createElement("li");
          li.textContent = "Nessun giocatore assegnato.";
          lista.appendChild(li);
        } else {
          giocatori.forEach((g) => {
            const li = document.createElement("li");
            li.textContent = `${g.nome} (${g.ruolo}, ${g.mantra}) - Anni contratto: ${g.anniContratto} - Primavera: ${g.primavera}`;
            lista.appendChild(li);
          });
        }

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "Chiudi";
        closeBtn.id = "close-details";
        closeBtn.addEventListener("click", () => {
          detailsContainer.innerHTML = "";
        });

        detailsContainer.appendChild(closeBtn);
        detailsContainer.appendChild(logoLarge);
        detailsContainer.appendChild(titolo);
        detailsContainer.appendChild(infoDiv);
        detailsContainer.appendChild(lista);

        // Scrolla la pagina fino alla sezione dettagli
        detailsContainer.scrollIntoView({ behavior: "smooth" });
      }

      // Creo le card delle squadre con logo cliccabile
      Object.keys(giocatoriPerSquadra).forEach((nomeSquadra) => {
        const card = document.createElement("div");
        card.className = "team-box";

        const logo = document.createElement("img");
        logo.src = `loghi/logo${nomeSquadra.replace("Squadra", "")}.png`;
        logo.alt = `Logo ${nomeSquadra}`;
        logo.className = "team-logo";
        logo.style.cursor = "pointer";

        // click sul logo apre i dettagli
        logo.addEventListener("click", () => showTeamDetails(nomeSquadra));

        const nome = document.createElement("h3");
        nome.textContent = nomeSquadra;

        card.appendChild(logo);
        card.appendChild(nome);

        container.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Errore nel caricamento o parsing del file CSV:", error);
    });
});
