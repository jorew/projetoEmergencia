// ====================== ESTADO DO JOGO ======================
let state = {
  current: "start",
  flags: {},
  textIndex: 0 // Controla a fala atual dentro da cena
};

// Controle da animação de digitação (Typewriter)
let typeWriterTimer = null;
let isTyping = false;
let currentSaveMode = "save"; // Define se o modal do slot está em modo "save" ou "load"

// ====================== GERENCIAMENTO DE TELAS E SIDEBAR ======================
function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("active");
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    if (modalId === "inventory-modal") renderInventoryModal();
    modal.classList.add("active");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

function startGame() {
  state = { current: "start", flags: {}, textIndex: 0 };
  switchScreen("game-screen");
  showScene("start");
}

function restartGame() {
  clearInterval(typeWriterTimer);
  isTyping = false;
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.remove("active");
  switchScreen("title-screen");
}

// ====================== INTERFACE DO INVENTÁRIO ======================
function updateInventoryUI() {
  const container = document.getElementById("inventory-items");
  if (!container) return;
  
  container.innerHTML = "";

  // Mapeamento das flags ativas para nomes exibidos
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

function renderInventoryModal() {
  const container = document.getElementById("inventory-items-container");
  if (!container) return;
  
  container.innerHTML = "";

  const itemNames = {
    tem_chave: "🔑 Chave de Ferro"
  };

  let hasItems = false;
  Object.keys(state.flags).forEach(flag => {
    if (state.flags[flag] && itemNames[flag]) {
      hasItems = true;
      const card = document.createElement("div");
      card.style.cssText = "background:#0f3460; border:1px solid #e94560; padding:8px 12px; border-radius:4px; margin:4px; display:inline-block;";
      card.textContent = itemNames[flag];
      container.appendChild(card);
    }
  });

  if (!hasItems) {
    container.innerHTML = "<p style='color:#aaa;'>Seu inventário está vazio.</p>";
  }
}

// ====================== MOTOR DAS CENAS ======================
function showScene(id, resetIndex = true) {
  const scene = story[id];
  if (!scene) return;

  state.current = id;
  if (resetIndex) state.textIndex = 0;

  // Atualiza a barra de inventário visual (caso esteja usando a barra rápida)
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

// Viajar para a cena escolhida pelo mapa
function travelTo(sceneId) {
  closeModal("map-modal");
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.remove("active");
  showScene(sceneId);
}

// ====================== SAVE / LOAD POR SLOTS ======================
function openSaveLoadModal(mode) {
  currentSaveMode = mode;
  const titleEl = document.getElementById("saveload-title");
  if (titleEl) titleEl.textContent = mode === "save" ? "Salvar Jogo" : "Carregar Jogo";
  
  renderSaveSlots();
  openModal("saveload-modal");
}

function getSavedSlots() {
  const data = localStorage.getItem("vn_slots_save");
  return data ? JSON.parse(data) : {};
}

function renderSaveSlots() {
  const container = document.getElementById("slots-grid");
  if (!container) return;
  
  container.innerHTML = "";
  const slots = getSavedSlots();

  for (let i = 1; i <= 8; i++) {
    const slotData = slots[i];
    const slotDiv = document.createElement("div");
    slotDiv.className = "save-slot";

    if (slotData) {
      slotDiv.innerHTML = `
        <div class="slot-number">${i}</div>
        <div class="slot-info">
          <div class="slot-scene">${slotData.sceneName || 'Cena ' + slotData.current}</div>
          <div class="slot-date">${slotData.date}</div>
        </div>
        <span class="slot-delete" onclick="deleteSlot(event, ${i})">✖</span>
      `;
      slotDiv.onclick = () => handleSlotClick(i, slotData);
    } else {
      slotDiv.innerHTML = `
        <div class="slot-number">${i}</div>
        <div class="slot-info">
          <div class="slot-scene" style="color:#666;">-- VAZIO --</div>
        </div>
      `;
      slotDiv.onclick = () => handleSlotClick(i, null);
    }

    container.appendChild(slotDiv);
  }
}

function handleSlotClick(slotIndex, slotData) {
  if (currentSaveMode === "save") {
    const now = new Date();
    const dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const slots = getSavedSlots();
    slots[slotIndex] = {
      ...state,
      date: dateStr,
      sceneName: "Cena: " + state.current
    };

    localStorage.setItem("vn_slots_save", JSON.stringify(slots));
    renderSaveSlots();
    closeModal("saveload-modal");
    showStatus("Jogo Salvo no Slot " + slotIndex);
  } else {
    if (slotData) {
      state = { ...slotData };
      closeModal("saveload-modal");
      
      const sidebar = document.getElementById("sidebar");
      if (sidebar) sidebar.classList.remove("active");
      
      switchScreen("game-screen");
      showScene(state.current, false); // Restaura mantendo o índice da fala
      showStatus("Jogo Carregado do Slot " + slotIndex);
    } else {
      showStatus("Slot vazio!");
    }
  }
}

function deleteSlot(event, slotIndex) {
  event.stopPropagation();
  const slots = getSavedSlots();
  delete slots[slotIndex];
  localStorage.setItem("vn_slots_save", JSON.stringify(slots));
  renderSaveSlots();
}

function showStatus(msg) {
  const el = document.getElementById("status");
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => el.style.display = "none", 1800);
}