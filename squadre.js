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
      // Inizializza 12 squadre vuote
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
      const dettagliSection = document.getElementById("dettagli-squadra");
      const dettagliContent = document.getElementById("dettagli-content");
      const closeBtn = document.getElementById("close-details");

      // Genera i box delle squadre
      for (let i = 1; i <= 12; i++) {
        const nomeSquadra = "Squadra" + i;
        const box = document.createElement("div");
        box.className = "team-box";

        const logo = document.createElement("img");
        logo.src = `loghi/logo${i}.png`;
        logo.alt = `Logo ${nomeSquadra}`;
        logo.className = "team-logo";
        logo.style.cursor = "pointer";

        // Al click sul logo mostra dettagli squadra
        logo.addEventListener("click", () => {
          dettagliContent.innerHTML = "";
          const info = infoSquadre[nomeSquadra] || {};
          const giocatori = giocatoriPerSquadra[nomeSquadra] || [];

          const h2 = document.createElement("h2");
          h2.textContent = nomeSquadra;

          const img = document.createElement("img");
          img.src = logo.src;
          img.alt = logo.alt;
          img.className = "team-logo-large";

          const pFond = document.createElement("p");
          pFond.textContent = `Anno di fondazione: ${info.fondazione || "N/D"}`;

          const pAll = document.createElement("p");
          pAll.textContent = `Allenatore: ${info.allenatore || "N/D"}`;

          const pTitolo = document.createElement("p");
          pTitolo.textContent = "Giocatori:";

          const ul = document.createElement("ul");
          if (giocatori.length === 0) {
            const li = document.createElement("li");
            li.textContent = "Nessun giocatore assegnato.";
            ul.appendChild(li);
          } else {
            giocatori.forEach((g) => {
              const li = document.createElement("li");
              li.textContent = `${g.nome} (${g.ruolo}, ${g.mantra}) - Anni contratto: ${g.anniContratto} - Primavera: ${g.primavera}`;
              ul.appendChild(li);
            });
          }

          dettagliContent.appendChild(h2);
          dettagliContent.appendChild(img);
          dettagliContent.appendChild(pFond);
          dettagliContent.appendChild(pAll);
          dettagliContent.appendChild(pTitolo);
          dettagliContent.appendChild(ul);

          dettagliSection.style.display = "block";
          window.scrollTo({ top: dettagliSection.offsetTop, behavior: "smooth" });
        });

        const nome = document.createElement("p");
        nome.textContent = nomeSquadra;

        box.appendChild(logo);
        box.appendChild(nome);

        container.appendChild(box);
      }

      closeBtn.addEventListener("click", () => {
        dettagliSection.style.display = "none";
      });
    })
    .catch((error) => {
      console.error("Errore nel caricamento o parsing del file CSV:", error);
    });
});
