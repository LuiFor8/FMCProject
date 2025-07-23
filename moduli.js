document.addEventListener("DOMContentLoaded", () => {
  const moduli = [
    "3-4-3", "3-4-1-2", "3-4-2-1", "3-5-2", "3-5-1-1",
    "4-3-3", "4-3-1-2", "4-4-2", "4-1-4-1", "4-4-1-1", "4-2-3-1"
  ];

  // Assumiamo 12 squadre come nel resto del progetto
  const squadre = [];
  for (let i = 1; i <= 12; i++) {
    squadre.push("Squadra" + i);
  }

  const container = document.getElementById("moduli-container");
  container.innerHTML = "";

  squadre.forEach((squadra) => {
    // Crea box per ogni squadra
    const teamBox = document.createElement("div");
    teamBox.className = "team-box";

    // Logo squadra
    const logoImg = document.createElement("img");
    logoImg.src = `loghi/logo${squadra.replace("Squadra", "")}.png`;
    logoImg.alt = `Logo ${squadra}`;
    logoImg.className = "logo-squadra";
    teamBox.appendChild(logoImg);

    // Nome squadra
    const nomeH3 = document.createElement("h3");
    nomeH3.textContent = squadra;
    teamBox.appendChild(nomeH3);

    // Lista moduli con esperienza (tutti 4.0)
    moduli.forEach(modulo => {
      const moduloDiv = document.createElement("div");
      moduloDiv.style.margin = "6px 0";
      moduloDiv.innerHTML = `<strong>${modulo}</strong>: 4.0`;
      teamBox.appendChild(moduloDiv);
    });

    container.appendChild(teamBox);
  });
});
