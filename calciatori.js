// Percorso del CSV
const CSV_PATH = 'calciatori.csv';

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#tabellaCalciatori tbody');
  const filtroSquadra = document.getElementById('filtroSquadra');
  const filtroRuolo = document.getElementById('filtroRuolo');
  const filtroProprietario = document.getElementById('filtroProprietario');
  const searchInput = document.getElementById('searchInput');
  let datiCalciatori = [];

  // Carica CSV e popola tabella
  Papa.parse(CSV_PATH, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      datiCalciatori = results.data;
      popolaSelects(datiCalciatori);
      aggiornaTabella();
    }
  });

  function aggiornaTabella() {
    const squadra = filtroSquadra.value.toLowerCase();
    const ruolo = filtroRuolo.value.toLowerCase();
    const proprietario = filtroProprietario.value.toLowerCase();
    const ricerca = searchInput.value.toLowerCase();

    const filtrati = datiCalciatori.filter(giocatore => {
      return (
        (squadra === '' || giocatore.Squadra?.toLowerCase() === squadra) &&
        (ruolo === '' || giocatore.Ruolo?.toLowerCase() === ruolo) &&
        (proprietario === '' || giocatore.Proprietario?.toLowerCase() === proprietario) &&
        Object.values(giocatore).some(val =>
          val?.toString().toLowerCase().includes(ricerca)
        )
      );
    });

    tableBody.innerHTML = '';
    filtrati.forEach(giocatore => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${giocatore.Nome}</td>
        <td>${giocatore.Ruolo}</td>
        <td>${giocatore.Mantra}</td>
        <td>${giocatore.Anno}</td>
        <td>${giocatore.Primavera}</td>
        <td>${giocatore.Squadra}</td>
        <td>${giocatore.Proprietario || '-'}</td>
        <td>${giocatore.ValoreIniziale}</td>
        <td>${giocatore.AnniContratto}</td>
        <td>${giocatore.ValoreContratto}</td>
        <td>${giocatore.TrasferimentoFuturo}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  function popolaSelects(dati) {
    popolaSelect(filtroSquadra, [...new Set(dati.map(g => g.Squadra).filter(Boolean))]);
    popolaSelect(filtroRuolo, [...new Set(dati.map(g => g.Ruolo).filter(Boolean))]);
    popolaSelect(filtroProprietario, [...new Set(dati.map(g => g.Proprietario).filter(Boolean))]);
  }

  function popolaSelect(selectElement, valoriUnici) {
    valoriUnici.sort().forEach(valore => {
      const option = document.createElement('option');
      option.value = valore;
      option.textContent = valore;
      selectElement.appendChild(option);
    });
  }

  filtroSquadra.addEventListener('change', aggiornaTabella);
  filtroRuolo.addEventListener('change', aggiornaTabella);
  filtroProprietario.addEventListener('change', aggiornaTabella);
  searchInput.addEventListener('input', aggiornaTabella);

  // Ordinamento base sulle intestazioni
  document.querySelectorAll('th.sortable').forEach((th, index) => {
    th.addEventListener('click', () => {
      const campo = th.textContent.trim().replace(/\s+/g, '');
      datiCalciatori.sort((a, b) => {
        const valA = a[campo] || '';
        const valB = b[campo] || '';
        return valA.toString().localeCompare(valB.toString(), 'it', { numeric: true });
      });
      aggiornaTabella();
    });
  });
});
