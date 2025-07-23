document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const filtroSquadra = document.getElementById("filtroSquadra");
  const filtroRuolo = document.getElementById("filtroRuolo");
  const filtroProprietario = document.getElementById("filtroProprietario");
  const tabella = document.getElementById("tabellaCalciatori").querySelector("tbody");
  const header = document.getElementById("tabellaCalciatori").querySelector("thead");
  let datiCalciatori = [];

  // Stato ordinamento per ogni colonna
  let ordineCorrente = {};

  Papa.parse("calciatori.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      datiCalciatori = results.data;
      popolaFiltri(datiCalciatori);
      mostraDati(datiCalciatori);
    }
  });

  function popolaFiltri(dati) {
    const squadre = new Set();
    const ruoli = new Set();
    const proprietari = new Set();

    dati.forEach(giocatore => {
      squadre.add(giocatore.Squadra);
      ruoli.add(giocatore.Ruolo);
      proprietari.add(giocatore.Proprietario);
    });

    [filtroSquadra, filtroRuolo, filtroProprietario].forEach(select => {
      while (select.options.length > 1) select.remove(1);
    });

    [...squadre].sort().forEach(s => {
      filtroSquadra.add(new Option(s, s));
    });
    [...ruoli].sort().forEach(r => {
      filtroRuolo.add(new Option(r, r));
    });
    [...proprietari].sort().forEach(p => {
      filtroProprietario.add(new Option(p, p));
    });
  }

  function mostraDati(dati) {
    tabella.innerHTML = "";
    dati.forEach(giocatore => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${giocatore.Nome}</td>
        <td>${giocatore.Ruolo}</td>
        <td>${giocatore.Mantra}</td>
        <td>${giocatore.Anno}</td>
        <td>${giocatore.Primavera}</td>
        <td>${giocatore.Squadra}</td>
        <td>${giocatore.Proprietario}</td>
        <td>${giocatore.ValoreIniziale}</td>
        <td>${giocatore.AnniContratto}</td>
        <td>${giocatore.ValoreContratto}</td>
        <td>${giocatore.TrasferimentoFuturo}</td>
      `;
      tabella.appendChild(row);
    });
  }

  function filtraDati() {
    const testo = searchInput.value.toLowerCase();
    const squadra = filtroSquadra.value;
    const ruolo = filtroRuolo.value;
    const proprietario = filtroProprietario.value;

    const filtrati = datiCalciatori.filter(giocatore => {
      return (
        (!squadra || giocatore.Squadra === squadra) &&
        (!ruolo || giocatore.Ruolo === ruolo) &&
        (!proprietario || giocatore.Proprietario === proprietario) &&
        Object.values(giocatore).some(val =>
          String(val).toLowerCase().includes(testo)
        )
      );
    });

    mostraDati(filtrati);
  }

  searchInput.addEventListener("input", filtraDati);
  filtroSquadra.addEventListener("change", filtraDati);
  filtroRuolo.addEventListener("change", filtraDati);
  filtroProprietario.addEventListener("change", filtraDati);

  header.addEventListener("click", function (e) {
    if (!e.target.classList.contains("sortable")) return;

    const colIndex = Array.from(e.target.parentNode.children).indexOf(e.target);
    const tipo = e.target.textContent.trim();

    ordineCorrente[tipo] = ordineCorrente[tipo] === "asc" ? "desc" : "asc";

    datiCalciatori.sort((a, b) => {
      const valA = a[tipo] || "";
      const valB = b[tipo] || "";

      const isNumber = !isNaN(parseFloat(valA)) && !isNaN(parseFloat(valB));
      const A = isNumber ? parseFloat(valA) : valA.toLowerCase();
      const B = isNumber ? parseFloat(valB) : valB.toLowerCase();

      if (A < B) return ordineCorrente[tipo] === "asc" ? -1 : 1;
      if (A > B) return ordineCorrente[tipo] === "asc" ? 1 : -1;
      return 0;
    });

    filtraDati(); // ricarica dopo ordinamento
  });
});
