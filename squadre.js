document.addEventListener("DOMContentLoaded", function () {
  fetch("calciatori.csv")
    .then((response) => {
      if (!response.ok) throw new Error("Errore nel caricamento del CSV");
      return response.text();
    })
    .then((csvText) => {
      // Usa PapaParse per un parsing robusto
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
        console.error("Elementi #teams-container o #team-details-container non trovati nel DOM");
        return;
      }

      // Pulisce contenuto precedente
      container.innerHTML = "";
      detailsContainer.innerHTML = "";

      // Funzione per mostrare i dettagli squadra
      function showTeamDetails(nomeSquadra) {
        const squadraInfo = infoSquadre[nomeSquadra];
        const giocatori = giocatoriPerSquadra[nomeSquadra];

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

        // Separazione in Prima squadra (primavera != "Si") e Primavera (primavera == "Si")
        const primaSquadra = giocatori.filter(g => g.primavera.trim().toLowerCase() !== "si");
        const primavera = giocatori.filter(g => g.primavera.trim().toLowerCase() === "si");

        function creaTabella(giocatoriArray) {
          const table = document.createElement("table");
          table.className = "dettagli-giocatori-table";

          const thead = document.createElement("thead");
          const headerRow = document.createElement("tr");
          [
            "Nome",
            "Ruolo",
            "Mantra",
            "Anno",
            "Primavera",
            "Squadra Reale",
            "Valore Iniziale",
            "Anni Contratto",
            "Valore Contratto",
            "Trasferimento Futuro",
          ].forEach((headerText) => {
            const th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);
          table.appendChild(thead);

          const tbody = document.createElement("tbody");

          if (giocatoriArray.length === 0) {
            const emptyRow = document.createElement("tr");
            const emptyCell = document.createElement("td");
            emptyCell.colSpan = 10;
            emptyCell.textContent = "Nessun giocatore assegnato.";
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
          } else {
            giocatoriArray.forEach((g) => {
              const tr = document.createElement("tr");
              [
                g.nome,
                g.ruolo,
                g.mantra,
                g.anno,
                g.primavera,
                g.squadraReale,
                g.valoreIniziale,
                g.anniContratto,
                g.valoreContratto,
                g.trasferimentoFuturo,
              ].forEach((val) => {
                const td = document.createElement("td");
                td.textContent = val || "-";
                tr.appendChild(td);
              });
              tbody.appendChild(tr);
            });
          }
          table.appendChild(tbody);
          return table;
        }

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "Chiudi";
        closeBtn.id = "close-details";
        closeBtn.addEventListener("click", () => {
          detailsContainer.innerHTML = "";
        });

        const primaSquadraTitle = document.createElement("h4");
        primaSquadraTitle.textContent = "Prima Squadra";

        const primaveraTitle = document.createElement("h4");
        primaveraTitle.textContent = "Squadra Primavera";

        const primaSquadraTable = creaTabella(primaSquadra);
        const primaveraTable = creaTabella(primavera);

        detailsContainer.appendChild(closeBtn);
        detailsContainer.appendChild(logoLarge);
        detailsContainer.appendChild(titolo);
        detailsContainer.appendChild(infoDiv);
        detailsContainer.appendChild(primaSquadraTitle);
        detailsContainer.appendChild(primaSquadraTable);
        detailsContainer.appendChild(primaveraTitle);
        detailsContainer.appendChild(primaveraTable);

        detailsContainer.scrollIntoView({ behavior: "smooth" });
      }

      // Genera box squadre con logo cliccabile che mostra i dettagli
      Object.keys(giocatoriPerSquadra).forEach((nomeSquadra) => {
        const squadraBox = document.createElement("div");
        squadraBox.className = "squadra-box";

        const logoImg = document.createElement("img");
        logoImg.src = `loghi/logo${nomeSquadra.replace("Squadra", "")}.png`;
        logoImg.alt = `Logo ${nomeSquadra}`;
        logoImg.className = "logo-squadra";
        logoImg.style.cursor = "pointer";
        logoImg.addEventListener("click", () => showTeamDetails(nomeSquadra));

        const nomeH3 = document.createElement("h3");
        nomeH3.textContent = nomeSquadra;

        const fondazione = document.createElement("p");
        fondazione.textContent = `Anno di fondazione: ${infoSquadre[nomeSquadra]?.fondazione || "N/D"}`;

        const allenatore = document.createElement("p");
        allenatore.textContent = `Allenatore: ${infoSquadre[nomeSquadra]?.allenatore || "N/D"}`;

        squadraBox.appendChild(logoImg);
        squadraBox.appendChild(nomeH3);
        squadraBox.appendChild(fondazione);
        squadraBox.appendChild(allenatore);

        container.appendChild(squadraBox);
      });
    })
    .catch((error) => {
      console.error("Errore nel caricamento o parsing del file CSV:", error);
    });
});
