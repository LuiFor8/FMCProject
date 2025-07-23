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

      let currentSort = { column: null, asc: true };

      // Set per valori unici di ogni filtro
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

      // Funzione helper per popolare select ordinando i valori
      function popolaFiltro(selectElem, valuesSet) {
        const values = Array.from(valuesSet).filter(v => v !== undefined && v !== null && v !== "").sort((a, b) => a.localeCompare(b));
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

      // Render tabella dati
      function renderTable(rows) {
        tbody.innerHTML = "";
        rows.forEach(row => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.Nome || ""}</td>
            <td>${row.Ruolo || ""}</td>
            <td>${row.Mantra || ""}</td>
            <td>${row.Anno || ""}</td>
            <td>${row.Primavera || ""}</td>
            <td>${row.Squadra || ""}</td>
            <td>${row.Proprietario || ""}</td>
            <td>${row.ValoreIniziale || ""}</td>
            <td>${row.AnniContratto || ""}</td>
            <td>${row.ValoreContratto || ""}</td>
            <td>${row.TrasferimentoFuturo || ""}</td>
          `;
          tbody.appendChild(tr);
        });
      }

      // Funzione filtro multiplo con ricerca testuale
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

      // Ordinamento tabella (cres./desc.)
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

      // Attiva ordinamento click intestazioni
      document.querySelectorAll("#tabellaCalciatori thead th").forEach((th, index) => {
        th.addEventListener("click", () => sortTable(columns[index]));
      });

      // Event listener filtri e ricerca
      filtroSquadra.addEventListener("change", filtraDati);
      filtroRuolo.addEventListener("change", filtraDati);
      filtroRuoloMantra.addEventListener("change", filtraDati);
      filtroAnniContratto.addEventListener("change", filtraDati);
      filtroTrasferimentoFuturo.addEventListener("change", filtraDati);
      filtroPrimavera.addEventListener("change", filtraDati);
      filtroProprietario.addEventListener("change", filtraDati);
      searchInput.addEventListener("input", filtraDati);

      // Render iniziale
      renderTable(data);
    },
    error: function (err) {
      console.error("Errore caricamento CSV:", err);
    }
  });
});
