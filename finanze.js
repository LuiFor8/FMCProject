document.addEventListener("DOMContentLoaded", () => {
  fetch("finanze.csv")
    .then((response) => response.text())
    .then((data) => {
      const lines = data.trim().split("\n");
      const headers = lines[0].split(",");

      const tbody = document.querySelector(".finanze-table tbody");
      tbody.innerHTML = ""; // Pulisce contenuto preesistente

      for (let i = 1; i < lines.length; i++) {
        const rowValues = lines[i].split(",");
        const tr = document.createElement("tr");

        rowValues.forEach((val) => {
          const td = document.createElement("td");
          td.textContent = val.trim();
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      }
    })
    .catch((err) => {
      console.error("Errore nel caricamento del CSV:", err);
      const tbody = document.querySelector(".finanze-table tbody");
      tbody.innerHTML = "<tr><td colspan='9'>Impossibile caricare i dati.</td></tr>";
    });
});
