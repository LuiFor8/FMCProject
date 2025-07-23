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

      // Mappa giocatori per squadra proprietario
      const giocatoriPerSquadra = {};
      // Inizializza tutte le 12 squadre (anche se non hanno giocatori)
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
      if (!container || !detailsContainer) {
        console.error("Elemento #teams-container o #team-details-container non trovato nel DOM");
        return;
      }

      // Pulisce contenuto precedente
      container.innerHTML = "";
      detailsContainer.innerHTML = "";

      // Funzione per mostrare dettagli di una squadra
      function mostraDettagliSquadra(nomeSquadra) {
        const squadraInfo = infoSquadre[nomeSquadra] || {};
        const giocatori = giocatoriPerSquadra[nomeSquadra] || [];

        detailsContainer.innerHTML = ""; // reset dettagli

        const titolo = document.createElement("h2");
        titolo.textContent = nomeSquadra;

        const logo = document.createElement("img");
        logo.src = `loghi/logo${nomeSquadra.replace("Squadra", "")}.png`;
        logo.alt = `Logo ${nomeSquadra}`;
        logo.className = "logo-squadra-large";

        const fondazione = document.createElement("p");
        fondazione.textContent = `Anno di fondazione: ${squadraInfo.fondazione || "N/D"}`;

        const allenatore = document.createElement("p");
        allenatore.textContent = `Allenatore: ${squadraInfo.allenatore || "N/D"}`;

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

        detailsContainer.appendChild(titolo);
        detailsContainer.appendChild(logo);
        detailsContainer.appendChild(fondazione);
        detailsContainer.appendChild(allenatore);
        detailsContainer.appendChild(lista);

        // Scrolla la pagina fino ai dettagli (opzionale)
        detailsContainer.scrollIntoView({ behavior: "smooth" });
      }

      // Crea i box squadre nel container principale
      for (let i = 1; i <= 12; i++) {
        const nomeSquadra = "Squadra" + i;

        const squadraBox = document.createElement("div");
        squadraBox.className = "team-card";

        const logo = document.createElement("img");
        logo.src = `loghi/logo${i}.png`;
        logo.alt = `Logo ${nomeSquadra}`;
        logo.className = "logo-squadra";
        logo.style.cursor = "pointer";

        logo.addEventListener("click", () => {
          mostraDettagliSquadra(nomeSquadra);
        });

        const nomeSpan = document.createElement("span");
        nomeSpan.textContent = nomeSquadra;
        nomeSpan.className = "team-name";

        squadraBox.appendChild(logo);
        squadraBox.appendChild(nomeSpan);

        container.appendChild(squadraBox);
      }

      // Mostra di default la prima squadra
      mostraDettagliSquadra("Squadra1");
    })
    .catch((error) => {
      console.error("Errore nel caricamento o parsing del file CSV:", error);
    });
});
