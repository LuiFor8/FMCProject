document.addEventListener("DOMContentLoaded", function () {
  Papa.parse("calciatori.csv", {
    download: true,
    header: true,
    complete: function (results) {
      // Filtra righe vuote
      let data = results.data.filter(row => Object.values(row).some(cell => cell.trim() !== ""));
      
      const tbody = document.querySelector("#tabellaCalciatori tbody");
      const filtroSquadra = document.getElementById("filtroSquadra");
      const filtroRuolo = document.getElementById("filtroRuolo");
      const filtroProprietario = document.getElementById("filtroProprietario");
      const searchInput = document.getElementById("searchInput");

      let currentSort = { column: null, asc: true };

      // Set per filtri dinamici
      const squadre = new Set();
      const ruoli = new Set();
      const proprietari = new Set();

      data.forEach(row => {
        if (row.Squadra) squadre.add(row.Squadra);
        if (row.Ruolo) ruoli.add(row.Ruolo);
        if (row.Proprietario) proprietari.add(row.Proprietario);
      });

      // Popola i filtri
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
      proprietari.forEach(p => {
        const opt = document.createElement("option");
        opt.value = opt.textContent = p;
        filtroProprietario.appendChild(opt);
      });

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
            (row.Proprietario && row.Proprietario.toLowerCase().includes(searchText)) ||
            (row.Mantra && row.Mantra.toLowerCase().includes(searchText))
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

          // Tratta i valori numerici
          const isNumeric = !isNaN(parseFloat(valA)) && !isNaN(parseFloat(valB));
          if (isNumeric) {
            valA = parseFloat(valA);
            valB = parseFloat(valB);
          } else {
            valA = valA.toString().toLowerCase();
            valB = valB.toString().toLowerCase();
          }

          if (valA > valB) return isAsc ? 1 : -1;
          if (valA < valB) return isAsc ? -1 : 1;
          return 0;
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

      filtroSquadra.addEventListener("change", filtraDati);
      filtroRuolo.addEventListener("change", filtraDati);
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
