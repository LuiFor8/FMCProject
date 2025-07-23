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

      const container = document.getElementById("squadre-container");
      if (!container) {
        console.error("Elemento #squadre-container non trovato nel DOM");
        return;
      }

      // Pulisce contenuto precedente
      container.innerHTML = "";

      Object.keys(giocatoriPerSquadra).forEach((nomeSquadra) => {
        const squadraBox = document.createElement("div");
        squadraBox.className = "squadra-box";

        const logoImg = document.createElement("img");
        logoImg.src = `loghi/logo${nomeSquadra.replace("Squadra", "")}.png`;
        logoImg.alt = `Logo ${nomeSquadra}`;
        logoImg.className = "logo-squadra";

        const nomeH3 = document.createElement("h3");
        nomeH3.textContent = nomeSquadra;

        const fondazione = document.createElement("p");
        fondazione.textContent = `Anno di fondazione: ${infoSquadre[nomeSquadra]?.fondazione || "N/D"}`;

        const allenatore = document.createElement("p");
        allenatore.textContent = `Allenatore: ${infoSquadre[nomeSquadra]?.allenatore || "N/D"}`;

        const lista = document.createElement("ul");
        if (giocatoriPerSquadra[nomeSquadra].length === 0) {
          const li = document.createElement("li");
          li.textContent = "Nessun giocatore assegnato.";
          lista.appendChild(li);
        } else {
          giocatoriPerSquadra[nomeSquadra].forEach((giocatore) => {
            const li = document.createElement("li");
            li.textContent = `${giocatore.nome} (${giocatore.ruolo}, ${giocatore.mantra}) - Anni contratto: ${giocatore.anniContratto} - Primavera: ${giocatore.primavera}`;
            lista.appendChild(li);
          });
        }

        squadraBox.appendChild(logoImg);
        squadraBox.appendChild(nomeH3);
        squadraBox.appendChild(fondazione);
        squadraBox.appendChild(allenatore);
        squadraBox.appendChild(lista);
        container.appendChild(squadraBox);
      });
    })
    .catch((error) => {
      console.error("Errore nel caricamento o parsing del file CSV:", error);
    });
});
