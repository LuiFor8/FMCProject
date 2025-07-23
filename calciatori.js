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

      const squadre = new Set(), ruoli = new Set(), proprietari = new Set(), annicontratto = new Set();

      data.forEach(row => {
        squadre.add(row.Squadra);
        ruoli.add(row.Ruolo);
        proprietari.add(row.Proprietario);
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

      proprietari.forEach(p => {
        const opt = document.createElement("option");
        opt.value = opt.textContent = p;
        filtroProprietario.appendChild(opt);
      });

      // Rendering della tabella
      function renderTable(rows) {
        tbody.innerHTML = "";
        rows.forEach(row => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.Nome}</td>
            <td>${row.Ruolo}</td>
            <td>${r
