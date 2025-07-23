async function caricaFinanze() {
  const response = await fetch('finanze.csv');
  const testo = await response.text();

  const righe = testo.trim().split('\n');
  // const intestazioni = righe[0].split(','); // non serve creare gli <th> perché ci sono già

  const corpoTabella = document.querySelector('#finanze-tabella tbody');
  corpoTabella.innerHTML = ''; // pulisco eventuali dati precedenti

  for (let i = 1; i < righe.length; i++) {
    const valori = righe[i].split(',');
    const riga = document.createElement('tr');
    valori.forEach(val => {
      const td = document.createElement('td');
      td.textContent = val;
      riga.appendChild(td);
    });
    corpoTabella.appendChild(riga);
  }
}

function ordinaTabella(colIndex) {
  const tabella = document.querySelector('#finanze-tabella');
  const tbody = tabella.tBodies[0];
  const righe = Array.from(tbody.querySelectorAll('tr'));
  const ascending = !tabella.dataset.sortAsc || tabella.dataset.sortColumn != colIndex;

  righe.sort((a, b) => {
    const aVal = a.children[colIndex].textContent.trim();
    const bVal = b.children[colIndex].textContent.trim();

    const aNum = parseFloat(aVal);
    const bNum = parseFloat(bVal);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return ascending ? aNum - bNum : bNum - aNum;
    }

    return ascending
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  tbody.innerHTML = '';
  righe.forEach(r => tbody.appendChild(r));
  tabella.dataset.sortAsc = ascending;
  tabella.dataset.sortColumn = colIndex;
}

caricaFinanze();
