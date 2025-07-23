document.addEventListener("DOMContentLoaded", function () {
  Papa.parse("calciatori.csv", {
    download: true,
    header: true,
    complete: function (results) {
      let data = results.data.filter(row => Object.values(row).some(cell => cell.trim() !== ""));
      const tbody = document.querySelector("#tabellaCalciatori tbody");
      const filtroSquadra = document.getElementById("filtroSquadra");
      const filtroRuolo = document.getElementById("filtroRuolo");
      const filtroProprietario = document.getElementById("filtroProprietario");
      const searchInput = document.getElementById("searchInput");

      let currentSort = { column: null, asc: true };

      // Popola i filtri con valori unici
      const squadre = new Set(), ruoli = new Set(), proprietari = new Set();

      data.forEach(row => {
        if (row.Squadra) squadre.add(row.Squadra);
        if (row.Ruolo) ruoli.add(row.Ruolo);
        if (row.Proprietario) proprietari.add(row.Proprietario);
      });

      // Funzione per aggiungere opzioni ai select
      function popolaFiltro(select, values) {
        values.forEach(v => {
          const opt = document.createElement("option");
          opt.value = v;
          opt.textContent = v;
          select.appendChild(opt);
        });
      }

      popolaFiltro(filtroSquadra, squadre);
      popolaFiltro(filtroRuolo, ruoli);
      popolaFiltro(filtroProprietario, proprietari);

      // Render tabella
      function renderTable(rows) {
        tbody.innerHTML = "";
        rows.forEach(row => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.Nome}</td>
            <td>${row.Ruolo}</td>
            <td>${row.Mantra}</td>
            <td>${row.Anno}</td>
            <td>${row.Primavera}</td>
            <td>${row.Squadra}</td>
            <td>${row.Proprietario}</td>
            <td>${row.ValoreIniziale}</td>
            <td>${row.AnniContratto}</td>
            <td>${row.ValoreContratto}</td>
            <td>${row.TrasferimentoFuturo}</td>
          `;
          tbody.appendChild(tr);
        });
      }

      // Filtra dati in base a filtri e ricerca
      function filtraDati() {
        let filtrati = [...data];
        const squadra = filtroSquadra.value.trim();
        const ruolo = filtroRuolo.value.trim();
        const proprietario = filtroProprietario.value.trim();
        const searchText = searchInput.value.toLowerCase();

        filtrati = filtrati.filter(row =>
          (squadra === "" || row.Squadra === squadra) &&
          (ruolo === "" || row.Ruolo === ruolo) &&
          (proprietario === "" || row.Proprietario === proprietario) &&
          (
            row.Nome.toLowerCase().includes(searchText) ||
            row.Squadra.toLowerCase().includes(searchText) ||
            row.Mantra?.toLowerCase().includes(searchText) ||
            row.Proprietario?.toLowerCase().includes(searchText)
          )
        );

        renderTable(filtrati);
      }

      // Ordinamento con toggle asc/desc
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
        th.style.cursor = "pointer";
        th.addEventListener("click", () => sortTable(columns[index]));
      });

      filtroSquadra.addEventListener("change", filtraDati);
      filtroRuolo.addEventListener("change", filtraDati);
      filtroProprietario.addEventListener("change", filtraDati);
      searchInput.addEventListener("input", filtraDati);

      renderTable(data);
    },
    error: function (err) {
      console.error("Errore caricamento CSV:", err);
    }
  });
});
