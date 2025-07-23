document.addEventListener("DOMContentLoaded", function () {
  Papa.parse("calciatori.csv", {
    download: true,
    header: true,
    complete: function (results) {
      // Filtra righe non vuote
      let data = results.data.filter(row => Object.values(row).some(cell => cell && cell.trim() !== ""));

      const tbody = document.querySelector("#tabellaCalciatori tbody");
      const filtroSquadra = document.getElementById("filtroSquadra");
      const filtroRuolo = document.getElementById("filtroRuolo");
      const filtroRuoloMantra = document.getElementById("filtroRuoloMantra");
      const filtroAnniContratto = document.getElementById("filtroAnniContratto");
      const filtroTrasferimentoFuturo = document.getElementById("filtroTrasferimentoFuturo");
      const filtroPrimavera = document.getElementById("filtroPrimavera");
      const filtroProprietario = document.getElementById("filtroProprietario");
      const searchInput = document.getElementById("searchInput");
      const resetButton = document.getElementById("resetFiltri"); // Bottone reset

      let currentSort = { column: null, asc: true };

      const squadre = new Set(), ruoli = new Set(), ruoliMantra = new Set(),
        anniContratto = new Set(), trasferimentiFuturi = new Set(),
        primavere = new Set(), proprietari = new Set();

      data.forEach(row => {
        if (row.Squadra) squadre.add(row.Squadra);
        if (row.Ruolo) ruoli.add(row.Ruolo);
        if (row.Mantra) ruoliMantra.add(row.Mantra);
        if (row.AnniContratto) anniContratto.add(row.AnniContratto);
        if (row.TrasferimentoFuturo) trasferimentiFuturi.add(row.TrasferimentoFuturo);
        if (row.Primavera) primavere.add(row.Primavera);
        if (row.Proprietario) proprietari.add(row.Proprietario);
      });

      function popolaFiltro(selectElem, valuesSet) {
        const values = Array.from(valuesSet).filter(v => v).sort((a, b) => a.localeCompare(b));
        values.forEach(v => {
          const option = document.createElement("option");
          option.value = option.textContent = v;
          selectElem.appendChild(option);
        });
      }

      popolaFiltro(filtroSquadra, squadre);
      popolaFiltro(filtroRuolo, ruoli);
      popolaFiltro(filtroRuoloMantra, ruoliMantra);
      popolaFiltro(filtroAnniContratto, anniContratto);
      popolaFiltro(filtroTrasferimentoFuturo, trasferimentiFuturi);
      popolaFiltro(filtroPrimavera, primavere);
      popolaFiltro(filtroProprietario, proprietari);

      function renderTable(rows) {
        tbody.innerHTML = "";
        rows.forEach(row => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td style="text-align:center;">${row.Nome || ""}</td>
            <td style="text-align:center;">${row.Ruolo || ""}</td>
            <td style="text-align:center;">${row.Mantra || ""}</td>
            <td style="text-align:center;">${row.Anno || ""}</td>
            <td style="text-align:center;">${row.Primavera || ""}</td>
            <td style="text-align:center;">${row.Squadra || ""}</td>
            <td style="text-align:center;">${row.Proprietario || ""}</td>
            <td style="text-align:center;">${row.ValoreIniziale || ""}</td>
            <td style="text-align:center;">${row.AnniContratto || ""}</td>
            <td style="text-align:center;">${row.ValoreContratto || ""}</td>
            <td style="text-align:center;">${row.TrasferimentoFuturo || ""}</td>
          `;
          tbody.appendChild(tr);
        });
      }

      function filtraDati() {
        const squadra = filtroSquadra.value.trim();
        const ruolo = filtroRuolo.value.trim();
        const ruoloMantra = filtroRuoloMantra.value.trim();
        const anni = filtroAnniContratto.value.trim();
        const trasferimento = filtroTrasferimentoFuturo.value.trim();
        const primavera = filtroPrimavera.value.trim();
        const proprietario = filtroProprietario.value.trim();
        const searchText = searchInput.value.toLowerCase();

        let filtrati = data.filter(row =>
          (squadra === "" || row.Squadra === squadra) &&
          (ruolo === "" || row.Ruolo === ruolo) &&
          (ruoloMantra === "" || row.Mantra === ruoloMantra) &&
          (anni === "" || row.AnniContratto === anni) &&
          (trasferimento === "" || row.TrasferimentoFuturo === trasferimento) &&
          (primavera === "" || row.Primavera === primavera) &&
          (proprietario === "" || row.Proprietario === proprietario) &&
          (
            (row.Nome && row.Nome.toLowerCase().includes(searchText)) ||
            (row.Squadra && row.Squadra.toLowerCase().includes(searchText)) ||
            (row.Mantra && row.Mantra.toLowerCase().includes(searchText)) ||
            (row.Proprietario && row.Proprietario.toLowerCase().includes(searchText))
          )
        );

        renderTable(filtrati);
      }

      function sortTable(col) {
        const isAsc = currentSort.column === col ? !currentSort.asc : true;
        currentSort = { column: col, asc: isAsc };

        data.sort((a, b) => {
          let valA = a[col] ?? "";
          let valB = b[col] ?? "";

          const isNumeric = !isNaN(parseFloat(valA)) && !isNaN(parseFloat(valB));
          if (isNumeric) {
            valA = parseFloat(valA);
            valB = parseFloat(valB);
          } else {
            valA = valA.toString().toLowerCase();
            valB = valB.toString().toLowerCase();
          }

          return isAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });

        filtraDati();
      }

      const columns = [
        "Nome", "Ruolo", "Mantra", "Anno", "Primavera", "Squadra",
        "Proprietario", "ValoreIniziale", "AnniContratto", "ValoreContratto", "TrasferimentoFuturo"
      ];

      document.querySelectorAll("#tabellaCalciatori thead th").forEach((th, index) => {
        th.addEventListener("click", () => sortTable(columns[index]));
      });

      // Eventi filtri e ricerca
      [filtroSquadra, filtroRuolo, filtroRuoloMantra, filtroAnniContratto,
       filtroTrasferimentoFuturo, filtroPrimavera, filtroProprietario].forEach(filtro =>
        filtro.addEventListener("change", filtraDati)
      );

      searchInput.addEventListener("input", filtraDati);

      // Bottone reset filtri
      if (resetButton) {
        resetButton.addEventListener("click", () => {
          [
            filtroSquadra, filtroRuolo, filtroRuoloMantra, filtroAnniContratto,
            filtroTrasferimentoFuturo, filtroPrimavera, filtroProprietario
          ].forEach(filtro => filtro.value = "");

          searchInput.value = "";
          renderTable(data);
        });
      }

      renderTable(data);
    },
    error: function (err) {
      console.error("Errore caricamento CSV:", err);
    }
  });
});
