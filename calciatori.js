document.addEventListener("DOMContentLoaded", function () {
  Papa.parse("calciatori.csv", {
    download: true,
    header: true,
    complete: function (results) {
      let data = results.data.filter(row => Object.values(row).some(cell => cell.trim() !== ""));
      const tbody = document.querySelector("#tabellaCalciatori tbody");
      const filtroSquadra = document.getElementById("filtroSquadra");
      const filtroRuolo = document.getElementById("filtroRuolo");
      const filtroAnniContratto = document.getElementById("filtroAnniContratto");
      const searchInput = document.getElementById("searchInput");

      let currentSort = { column: null, asc: true };

      const squadre = new Set(), ruoli = new Set(), annicontratto = new Set();

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

      function renderTable(rows) {
        tbody.innerHTML = "";
        rows.forEach(row => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.Nome}</td>
            <td>${row.Ruolo}</td>
            <td>${row.Squadra}</td>
            <td>${row.ValoreIniziale}</td>
            <td>${row.AnniContratto}</td>
            <td>${row.ValoreContratto}</td>
          `;
          tbody.appendChild(tr);
        });
      }

      function filtraDati() {
        let filtrati = [...data];
        const squadra = filtroSquadra.value.trim();
        const ruolo = filtroRuolo.value.trim();
        const anni = filtroAnniContratto.value.trim();
        const searchText = searchInput.value.toLowerCase();

        filtrati = filtrati.filter(row =>
          (squadra === "" || row.Squadra === squadra) &&
          (ruolo === "" || row.Ruolo === ruolo) &&
          (anni === "" || row.AnniContratto === anni) &&
          (row.Nome.toLowerCase().includes(searchText) || row.Squadra.toLowerCase().includes(searchText))
        );

        renderTable(filtrati);
      }

      function sortTable(col) {
        const isAsc = currentSort.column === col ? !currentSort.asc : true;
        currentSort = { column: col, asc: isAsc };

        data.sort((a, b) => {
          let valA = a[col];
          let valB = b[col];

          const isNumeric = !isNaN(parseFloat(valA)) && !isNaN(parseFloat(valB));
          if (isNumeric) {
            valA = parseFloat(valA);
            valB = parseFloat(valB);
          } else {
            valA = valA.toString().toLowerCase();
            valB = valB.toString().toLowerCase();
          }

          return isAsc ? valA > valB ? 1 : -1 : valA < valB ? 1 : -1;
        });

        filtraDati();
      }

      // Aggiungi ordinamento alle intestazioni
      document.querySelectorAll("#tabellaCalciatori thead th").forEach((th, index) => {
        th.addEventListener("click", () => {
          const columns = ["Nome", "Ruolo", "Squadra", "ValoreIniziale", "AnniContratto", "ValoreContratto"];
          sortTable(columns[index]);
        });
      });

      filtroSquadra.addEventListener("change", filtraDati);
      filtroRuolo.addEventListener("change", filtraDati);
      filtroAnniContratto.addEventListener("change", filtraDati);
      searchInput.addEventListener("input", filtraDati);

      renderTable(data);
    },
    error: function (err) {
      console.error("Errore caricamento CSV:", err);
    }
  });
});
