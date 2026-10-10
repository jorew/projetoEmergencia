// =========================================================
// MÓDULO GERENCIADOR DE MINIGAMES
// =========================================================

// Função principal chamada pelo engine.js
function startMinigame(gameId, onComplete) {
  const container = document.getElementById("minigame-container");
  if (!container) return;

  // Garante que o container fique visível e limpo
  container.style.display = "flex";
  container.innerHTML = "";

  // Seleciona e carrega o minigame correto
  switch (gameId) {
    case "keypad_code":
      loadKeypadMinigame(container, onComplete);
      break;

    case "puzzle_pecas":
      // Futuro minigame de quebra-cabeça
      // loadPuzzleMinigame(container, onComplete);
      break;

    default:
      console.error("Minigame não encontrado:", gameId);
      container.style.display = "none";
      onComplete("fail");
  }
}

// ---------------------------------------------------------
// MINIGAME 1: Terminal de Código de Segurança
// ---------------------------------------------------------
function loadKeypadMinigame(container, onComplete) {
  // Estilização/Estrutura do Minigame
  container.innerHTML = `
    <div style="border: 2px solid #e94560; padding: 20px; background: #0f3460; border-radius: 6px; text-align: center; color: #fff;">
      <h3 style="color: #e94560; margin-bottom: 10px;">TERMINAL DE SEGURANÇA</h3>
      <p style="font-size: 12px; margin-bottom: 15px;">Insira a senha de 4 dígitos:</p>
      <input type="password" id="minigame-input" maxlength="4" style="padding: 8px; font-size: 18px; text-align: center; border: 1px solid #e94560; background: #1a1a2e; color: #fff; width: 120px; font-family: inherit;">
      <br><br>
      <button id="btn-submit-code" class="choice-btn" style="padding: 6px 16px;">CONFIRMAR</button>
      <button id="btn-cancel-code" class="choice-btn" style="padding: 6px 16px; background: #ff4757;">CANCELAR</button>
    </div>
  `;

  // Eventos de clique do minigame
  document.getElementById("btn-submit-code").onclick = () => {
    const val = document.getElementById("minigame-input").value;
    container.style.display = "none";
    
    if (val === "1984") {
      onComplete("win");
    } else {
      onComplete("fail");
    }
  };

  document.getElementById("btn-cancel-code").onclick = () => {
    container.style.display = "none";
    onComplete("cancel");
  };
}
