// ====================== ESTADO DO JOGO ======================
let state = {
  current: "start",
  flags: {},
  textIndex: 0 // Controla a fala atual dentro da cena
};

// Controle da animação de digitação (Typewriter)
let typeWriterTimer = null;
let isTyping = false;

// ====================== GERENCIAMENTO DE TELAS ======================
function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function startGame() {
  state = { current: "start", flags: {}, textIndex: 0 };
  switchScreen("game-screen");
  showScene("start");
}

function loadGameFromTitle() {
  const data = localStorage.getItem("meu_jogo_save");
  if (data) {
    state = JSON.parse(data);
    switchScreen("game-screen");
    showScene(state.current, false); // Mantém a frase exata em que parou
    showStatus("Jogo carregado!");
  } else {
    showStatus("Nenhum save encontrado!");
  }
}

function restartGame() {
  clearInterval(typeWriterTimer);
  isTyping = false;
  switchScreen("title-screen");
}

// ====================== INTERFACE DO INVENTÁRIO ======================
function updateInventoryUI() {
  const container = document.getElementById("inventory-items");
  if (!container) return;
  
  container.innerHTML = "";

  // Mapeamento das flags ativas para nomes exibidos no painel
  const itemNames = {
    tem_chave: "🔑 Chave de Ferro"
  };

  Object.keys(state.flags).forEach(flag => {
    if (state.flags[flag] && itemNames[flag]) {
      const badge = document.createElement("span");
      badge.className = "item-badge";
      badge.textContent = itemNames[flag];
      container.appendChild(badge);
    }
  });
}

// ====================== MOTOR DAS CENAS ======================
function showScene(id, resetIndex = true) {
  const scene = story[id];
  if (!scene) return;

  state.current = id;
  if (resetIndex) state.textIndex = 0;

  // Atualiza a barra de inventário visual
  updateInventoryUI();

  // Imagens de Cenário e Personagem
  const bg = document.getElementById("background");
  const char = document.getElementById("character");

  if (scene.background) {
    bg.src = scene.background;
    bg.style.display = "block";
  } else {
    bg.style.display = "none";
  }

  if (scene.character) {
    char.src = scene.character;
    char.style.display = "block";
  } else {
    char.style.display = "none";
  }

  // Nome do personagem
  document.getElementById("speaker").textContent = scene.speaker || "";
  renderDialogue();
}

// Renderiza a fala com efeito letra por letra e aplica classes de emoção
function renderDialogue() {
  const scene = story[state.current];
  const choicesDiv = document.getElementById("choices");
  const textDiv = document.getElementById("text");

  // Garante suporte para array de falas ou fala única
  const dialogueList = Array.isArray(scene.text) ? scene.text : [scene.text];
  const currentItem = dialogueList[state.textIndex];

  // Extrai texto e emoção (funciona com string ou objeto { text, emotion })
  const currentText = typeof currentItem === 'object' ? currentItem.text : currentItem;
  const currentEmotion = typeof currentItem === 'object' ? currentItem.emotion : (scene.emotion || 'neutral');

  // Reseta e aplica a classe de emoção no container
  textDiv.className = "";
  if (currentEmotion) {
    textDiv.classList.add(`emotion-${currentEmotion}`);
  }

  // Reseta escolhas e cancela digitação em andamento
  choicesDiv.innerHTML = "";
  clearInterval(typeWriterTimer);

  textDiv.textContent = "";
  let charIndex = 0;
  isTyping = true;

  // Animação letra por letra (30ms por caractere)
  typeWriterTimer = setInterval(() => {
    if (charIndex < currentText.length) {
      textDiv.textContent += currentText.charAt(charIndex);
      charIndex++;
    } else {
      finishTyping(dialogueList, scene, choicesDiv);
    }
  }, 30);
}

// Finaliza a animação de digitação e exibe escolhas ou instrução de clique
function finishTyping(dialogueList, scene, choicesDiv) {
  clearInterval(typeWriterTimer);
  isTyping = false;

  const textDiv = document.getElementById("text");
  
  // Exibe a frase completa na tela
  const currentItem = dialogueList[state.textIndex];
  const currentText = typeof currentItem === 'object' ? currentItem.text : currentItem;
  textDiv.textContent = currentText;

  // Se for a última fala do nó, renderiza as escolhas válidas
  if (state.textIndex >= dialogueList.length - 1) {
    choicesDiv.innerHTML = "";
    scene.choices.forEach(choice => {
      // Oculta opções que exijam itens/flags que o jogador não possui
      if (choice.requires && !state.flags[choice.requires]) return;

      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;
      btn.onclick = (e) => {
        e.stopPropagation(); // Impede o clique de ativar a caixa de texto
        if (choice.flag) state.flags[choice.flag] = true;

        if (choice.next === "restart") {
          restartGame();
        } else {
          showScene(choice.next);
        }
      };
      choicesDiv.appendChild(btn);
    });
  } else {
    choicesDiv.innerHTML = "<small style='color:#aaa; cursor:pointer;'>Clique no texto para continuar...</small>";
  }
}

// Avança o diálogo ao clicar ou completa a digitação instantaneamente
function advanceDialogue() {
  const scene = story[state.current];
  const dialogueList = Array.isArray(scene.text) ? scene.text : [scene.text];

  // Se o texto ainda estiver digitando, revela a frase completa imediatamente
  if (isTyping) {
    finishTyping(dialogueList, scene, document.getElementById("choices"));
    return;
  }

  // Se já terminou de digitar, avança para a próxima frase
  if (state.textIndex < dialogueList.length - 1) {
    state.textIndex++;
    renderDialogue();
  }
}

// Evento de clique na caixa de texto
document.getElementById("textbox").addEventListener("click", advanceDialogue);

// Abrir e Fechar Modal do Mapa
function openMap() {
  document.getElementById("map-modal").style.display = "flex";
}

function closeMap() {
  document.getElementById("map-modal").style.display = "none";
}

// Viajar para a cena escolhida pelo mapa
function travelTo(sceneId) {
  closeMap();
  showScene(sceneId);
}











// ====================== SAVE / LOAD ======================
function saveGame() {
  localStorage.setItem("meu_jogo_save", JSON.stringify(state));
  showStatus("Jogo salvo!");
}

function loadGame() {
  const data = localStorage.getItem("meu_jogo_save");
  if (data) {
    state = JSON.parse(data);
    showScene(state.current, false);
    showStatus("Jogo carregado!");
  } else {
    showStatus("Nenhum save encontrado!");
  }
}

function showStatus(msg) {
  const el = document.getElementById("status");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => el.style.display = "none", 1800);
}