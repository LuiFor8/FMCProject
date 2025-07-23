async function caricaModuli() {
  const response = await fetch('moduli.csv');
  const testo = await response.text();

  const righe = testo.split('\n').map(r => r.trim()).filter(r => r);
  const intestazioni = righe[0].split(',');

  const squadre = {};
  let squadraCorrente = '';

  for (let i = 1; i < righe.length; i++) {
    const valori = righe[i].split(',');

    if (valori[0].startsWith('Squadra')) {
      squadraCorrente = valori[0];
      squadre[squadraCorrente] = [];
    } else {
      const modulo = {
        modulo: valori[0],
        valoreIniziale: parseFloat(valori[1]),
        valoreAttuale: parseFloat(valori[2])
      };
      squadre[squadraCorrente].push(modulo);
    }
  }

  const container = document.getElementById('moduli-container');

  Object.keys(squadre).forEach((squadra, index) => {
    const div = document.createElement('div');
    div.className = 'squadra-box';

    const logo = document.createElement('img');
    logo.src = `loghi/logo${index + 1}.png`;
    logo.alt = `Logo ${squadra}`;
    logo.className = 'logo-squadra';
    div.appendChild(logo);

    const titolo = document.createElement('h3');
    titolo.textContent = squadra;
    div.appendChild(titolo);

    const tabella = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = `<tr><th>Modulo</th><th>Valore Iniziale</th><th>Valore Attuale</th></tr>`;
    tabella.appendChild(thead);

    const tbody = document.createElement('tbody');

    const moduli = squadre[squadra];
    const maxValoreAttuale = Math.max(...moduli.map(m => m.valoreAttuale));

    moduli.forEach(m => {
      const riga = document.createElement('tr');

      const tdModulo = document.createElement('td');
      tdModulo.textContent = m.modulo;

      const tdIniziale = document.createElement('td');
      tdIniziale.textContent = m.valoreIniziale;

      const tdAttuale = document.createElement('td');
      tdAttuale.textContent = m.valoreAttuale;
      if (m.valoreAttuale === maxValoreAttuale) {
        tdAttuale.classList.add('highlight-cell');
      }

      riga.appendChild(tdModulo);
      riga.appendChild(tdIniziale);
      riga.appendChild(tdAttuale);
      tbody.appendChild(riga);
    });

    tabella.appendChild(tbody);
    div.appendChild(tabella);
    container.appendChild(div);
  });
}

caricaModuli();
