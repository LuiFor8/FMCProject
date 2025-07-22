document.addEventListener("DOMContentLoaded", function () {
  Papa.parse("calciatori.csv", {
    download: true,
    header: true,
    complete: function (results) {
      const data = results.data;
      const tbody = document.querySelector("#tabellaCalciatori tbody");
      const filtroSquadra = document.getElementById("filtroSquadra");
      const filtroRuolo = document.getElementById("filtroRuolo");
      const filtroAnniContratto = document.getElementById("filtroAnniContratto");

      let squadre = new Set();
      let ruoli = new Set();
      let annicontratto = new Set();

      function renderTable(filtrati) {
        tbody.innerHTML = "";
        filtrati.forEach(row => {
          if (Object.values(row).every(cell => cell !== "")) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td style="padding: 10px;">${row.Nome}</td>
              <td style="padding: 10px;">${row.Ruolo}</td>
              <td style="padding: 10px;">${row.Squadra}</td>
              <td style="padding: 10px;">${row.ValoreIniziale}</td>
              <td style="padding: 10px;">${row.AnniContratto}</td>
              <td style="padding: 10px;">${row.ValoreContratto}</td>
            `;
            tbody.appendChild(tr);
            if (Object.values(row).some(cell => cell === null || cell.trim() === "")) return;
          }
        });
      }

      function filtraDati() {
        const squadra = filtroSquadra.value;
        const ruolo = filtroRuolo.value;
        const annicontratto = filtroAnniContratto.value;
        
        const filtrati = data.filter(row =>
          (squadra === "" || row.Squadra === squadra) &&
          (ruolo === "" || row.Ruolo === ruolo) &&
          (annicontratto === "" || row.AnniContratto === annicontratto)
        );
        renderTable(filtrati);
      }

      data.forEach(row => {
        squadre.add(row.Squadra);
        ruoli.add(row.Ruolo);
        annicontratto.add(row.AnniContratto);
      });

      squadre.forEach(s => {
        const opt = document.createElement("option");
        opt.value = opt.textContent = s;
        filtroSquadra.appendChild(opt);
      });

      ruoli.forEach(r => {
        const opt = document.createElement("option");
        opt.value = opt.textContent = r;
        filtroRuolo.appendChild(opt);
      });

      annicontratto.forEach(a => {
  const opt = document.createElement("option");
  opt.value = opt.textContent = a;
  filtroAnniContratto.appendChild(opt);
});

filtroAnniContratto.addEventListener("change", filtraDati);
      filtroSquadra.addEventListener("change", filtraDati);
      filtroRuolo.addEventListener("change", filtraDati);

      renderTable(data);
    },
    error: function(err) {
  console.error("Errore caricamento CSV:", err);
}
  });
});


