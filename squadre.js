document.addEventListener("DOMContentLoaded", function () {
  fetch("calciatori.csv")
    .then((response) => response.text())
    .then((data) => {
      const lines = data.trim().split("\n");
      const headers = lines[0].split(",");

      const squadraIndex = headers.indexOf("Proprietario");
      const nomeIndex = headers.indexOf("Nome");
      const ruoloIndex = headers.indexOf("Ruolo");
      const mantraIndex = headers.indexOf("Mantra");
      const annoIndex = headers.indexOf("Anno");
      const primaveraIndex = headers.indexOf("Primavera");
      const squadraRealeIndex = headers.indexOf("Squadra");
      const valoreInizialeIndex = headers.indexOf("ValoreIniziale");
      const anniContrattoIndex = headers.indexOf("AnniContratto");
      const valoreContrattoIndex = headers.indexOf("ValoreContratto");
      const trasferimentoFuturoIndex = headers.indexOf("TrasferimentoFuturo");

      const giocatoriPerSquadra = {};

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        const proprietario = values[squadraIndex].trim();

        if (!giocatoriPerSquadra[proprietario]) {
          giocatoriPerSquadra[proprietario] = [];
        }

        giocatoriPerSquadra[proprietario].push({
          nome: values[nomeIndex],
          ruolo: values[ruoloIndex],
          mantra: values[mantraIndex],
          anno: values[annoIndex],
          primavera: values[primaveraIndex],
          squadra: values[squadraRealeIndex],
          valoreIniziale: values[valoreInizialeIndex],
          anniContratto: values[anniContrattoIndex],
          valoreContratto: values[valoreContrattoIndex],
          trasferimentoFuturo: values[trasferimentoFuturoIndex],
        });
      }

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

      Object.keys(giocatoriPerSquadra).forEach((nomeSquadra) => {
        const squadraBox = document.createElement("div");
        squadraBox.className = "squadra-box";

        const logoImg = document.createElement("img");
        logoImg.src = `loghi/logo${nomeSquadra.replace("Squadra", "")}.png`;
        logoImg.alt = `Logo ${nomeSquadra}`;
        logoImg.className = "logo-squadra";

        const nome = document.createElement("h3");
        nome.textContent = nomeSquadra;

        const fondazione = document.createElement("p");
        fondazione.textContent = `Anno di fondazione: ${
          infoSquadre[nomeSquadra]?.fondazione || "N/D"
        }`;

        const allenatore = document.createElement("p");
        allenatore.textContent = `Allenatore: ${
          infoSquadre[nomeSquadra]?.allenatore || "N/D"
        }`;

        const lista = document.createElement("ul");

        giocatoriPerSquadra[nomeSquadra].forEach((giocatore) => {
          const li = document.createElement("li");
          li.textContent = `${giocatore.nome} (${giocatore.ruolo}, ${giocatore.mantra}) - ${giocatore.anniContratto} anni - Primavera: ${giocatore.primavera}`;
          lista.appendChild(li);
        });

        squadraBox.appendChild(logoImg);
        squadraBox.appendChild(nome);
        squadraBox.appendChild(fondazione);
        squadraBox.appendChild(allenatore);
        squadraBox.appendChild(lista);
        container.appendChild(squadraBox);
      });
    });
});
