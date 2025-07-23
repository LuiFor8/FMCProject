document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.querySelector("#tabellaCalciatori tbody");
  const searchInput = document.getElementById("searchInput");
  const filtroSquadra = document.getElementById("filtroSquadra");
  const filtroRuolo = document.getElementById("filtroRuolo");
  const filtroProprietario = document.getElementById("filtroProprietario");

  let calciatori = [];

  Papa.parse("calciatori.csv", {
    header: true,
    download: true,
    skipEmptyLines: true,
    complete: function (results) {
      calciatori = results.data;
      console.log("CSV caricato:", calciatori); // DEBUG
      popolaFiltri();
      mostraCalciatori(calciatori);
    },
    error: function (error) {
      console.error("Errore durante il parsing del CSV:", error);
    },
  });

  function popolaFiltri() {
    const squadre = new Set();
    const ruoli = new Set();
    const proprietari = new Set();

    calciatori.forEach(c => {
      if (c.Squadra) squadre.add(c.Squadra);
      if (c.Ruolo) ruoli.add(c.Ruolo);
      if (c.Proprietario) proprietari.add(c.Proprietario);
    });

    for (let s of [...squadre].sort()) {
      const option = new Option(s, s);
      filtroSquadra.add(option);
    }

    for (let r of [...ruoli].sort()) {
      const option = new Option(r, r);
      filtroRuolo.add(option);
    }

    for (let p of [...proprietari].sort()) {
      const option = new Option(p, p);
      filtroProprietario.add(option);
    }
  }

  function mostraCalciatori(dati) {
    tableBody.innerHTML = "";

    dati.forEach(c => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.Nome}</td>
        <td>${c.Ruolo}</td>
        <td>${c.Mantra}</td>
        <td>${c.Anno}</td>
        <td>${c.Primavera}</td>
        <td>${c.Squadra}</td>
        <td>${c.Proprietario}</td>
        <td>${c.ValoreIniziale}</td>
        <td>${c.AnniContratto}</td>
        <td>${c.ValoreContratto}</td>
        <td>${c.TrasferimentoFuturo}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  function filtraCalciatori() {
    const query = searchInput.value.toLowerCase();
    const squadra = filtroSquadra.value;
    const ruolo = filtroRuolo.value;
    const proprietario = filtroProprietario.value;

    const filtrati = calciatori.filter(c => {
      const matchTesto =
        c.Nome.toLowerCase().includes(query) ||
        c.Squadra.toLowerCase().includes(query) ||
        c.Proprietario.toLowerCase().includes(query);

      const matchSquadra = !squadra || c.Squadra === squadra;
      const matchRuolo = !ruolo || c.Ruolo === ruolo;
      const matchProprietario = !proprietario || c.Proprietario === proprietario;

      return matchTesto && matchSquadra && matchRuolo && matchProprietario;
    });

    mostraCalciatori(filtrati);
  }

  searchInput.addEventListener("input", filtraCalciatori);
  filtroSquadra.addEventListener("change", filtraCalciatori);
  filtroRuolo.addEventListener("change", filtraCalciatori);
  filtroProprietario.addEventListener("change", filtraCalciatori);

  // Ordinamento cliccando sulle intestazioni
  document.querySelectorAll("th.sortable").forEach(th => {
    th.style.cursor = "pointer";
    let asc = true;

    th.addEventListener("click", () => {
      const colonna = th.textContent.trim().replace(/\s+/g, "");
      calciatori.sort((a, b) => {
        let v1 = a[colonna] || "";
        let v2 = b[colonna] || "";

        // Prova a fare confronto numerico
        const n1 = parseFloat(v1);
        const n2 = parseFloat(v2);
        if (!isNaN(n1) && !isNaN(n2)) {
          return asc ? n1 - n2 : n2 - n1;
        }

        return asc
          ? v1.toString().localeCompare(v2)
          : v2.toString().localeCompare(v1);
      });

      asc = !asc;
      mostraCalciatori(calciatori);
    });
  });
});
