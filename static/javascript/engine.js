// ====================== ESTADO DO JOGO ======================
let state = {
  current: "start",
  flags: {},
  textIndex: 0
};

let typeWriterTimer = null;
let isTyping = false;
let currentSaveMode = "save";

// ====================== CONTROLADOR DE TRANSIÇÃO (FADE IN/OUT) ======================
function changeSceneWithFade(nextSceneId, resetIndex = true) {
  const overlay = document.getElementById("fade-overlay");
  
  if (!overlay) {
    showScene(nextSceneId, resetIndex);
    return;
  }

  // 1. Escurece a tela
  overlay.classList.add("active");

  // 2. Espera a animação de escurecer (350ms) e troca os dados da cena
  setTimeout(() => {
    showScene(nextSceneId, resetIndex);

    // 3. Clareia a tela mostrando a nova cena
    setTimeout(() => {
      overlay.classList.remove("active");
    }, 50);

  }, 350);
}

// ====================== GERENCIAMENTO DE TELAS E INTERFACE ======================
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
  changeSceneWithFade("start");
}

function restartGame() {
  clearInterval(typeWriterTimer);
  isTyping = false;
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.remove("active");
  switchScreen("title-screen");
}

// ====================== INVENTÁRIO ======================
function renderInventoryModal() {
  const container = document.getElementById("inventory-items-container");
  if (!container) return;
  
  container.innerHTML = "";

  const itemNames = {
    tem_chave: "🔑 Chave de Ferro",
    tem_anotacao: "📝 Anotação com Código"
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

  const bg = document.getElementById("background");
  const char = document.getElementById("character");
  const textbox = document.getElementById("textbox");
  const hotspotsLayer = document.getElementById("hotspots-layer");
  const minigameContainer = document.getElementById("minigame-container");

  // Limpa elementos temporários
  if (hotspotsLayer) hotspotsLayer.innerHTML = "";
  if (minigameContainer) minigameContainer.style.display = "none";

  // Atualiza Imagens de Fundo e Personagem
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

  // ================= MODO 1: MINIGAME =================
  if (scene.type === "minigame") {
    textbox.style.display = "none";

    if (typeof startMinigame === "function") {
      startMinigame(scene.gameId, (resultado) => {
        if (resultado === "win") {
          state.flags[`${scene.gameId}_cleared`] = true;
          changeSceneWithFade(scene.onSuccess);
        } else if (resultado === "fail") {
          changeSceneWithFade(scene.onFailure);
        } else {
          changeSceneWithFade(scene.onCancel || state.current);
        }
      });
    } else {
      console.error("A função startMinigame não está disponível no minigames.js");
    }
    return;
  }

  // ================= MODO 2: CENA DE EXPLORAÇÃO (HOTSPOTS) =================
  if (scene.type === "explore") {
    textbox.style.display = "none";

    if (scene.hotspots && hotspotsLayer) {
      scene.hotspots.forEach(spot => {
        if (spot.requires && !state.flags[spot.requires]) return;

        const btn = document.createElement("button");
        btn.className = "hotspot";
        btn.style.top = spot.top;
        btn.style.left = spot.left;
        btn.textContent = spot.label;
        btn.onclick = (e) => {
          e.stopPropagation();
          if (spot.flag) state.flags[spot.flag] = true;
          changeSceneWithFade(spot.next);
        };
        hotspotsLayer.appendChild(btn);
      });
    }
  } 
  // ================= MODO 3: NARRATIVA NORMAL / DIÁLOGO =================
  else {
    textbox.style.display = "block";
    document.getElementById("speaker").textContent = scene.speaker || "";
    renderDialogue();
  }
}

function renderDialogue() {
  const scene = story[state.current];
  const choicesDiv = document.getElementById("choices");
  const textDiv = document.getElementById("text");

  const dialogueList = Array.isArray(scene.text) ? scene.text : [scene.text];
  const currentItem = dialogueList[state.textIndex];

  const currentText = typeof currentItem === 'object' ? currentItem.text : currentItem;
  const currentEmotion = typeof currentItem === 'object' ? currentItem.emotion : (scene.emotion || 'neutral');

  textDiv.className = "";
  if (currentEmotion) {
    textDiv.classList.add(`emotion-${currentEmotion}`);
  }

  choicesDiv.innerHTML = "";
  clearInterval(typeWriterTimer);

  textDiv.textContent = "";
  let charIndex = 0;
  isTyping = true;

  typeWriterTimer = setInterval(() => {
    if (charIndex < currentText.length) {
      textDiv.textContent += currentText.charAt(charIndex);
      charIndex++;
    } else {
      finishTyping(dialogueList, scene, choicesDiv);
    }
  }, 30);
}

function finishTyping(dialogueList, scene, choicesDiv) {
  clearInterval(typeWriterTimer);
  isTyping = false;

  const textDiv = document.getElementById("text");
  const currentItem = dialogueList[state.textIndex];
  const currentText = typeof currentItem === 'object' ? currentItem.text : currentItem;
  textDiv.textContent = currentText;

  if (state.textIndex >= dialogueList.length - 1) {
    choicesDiv.innerHTML = "";
    scene.choices.forEach(choice => {
      if (choice.requires && !state.flags[choice.requires]) return;

      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;
      btn.onclick = (e) => {
        e.stopPropagation();
        if (choice.flag) state.flags[choice.flag] = true;

        if (choice.next === "restart") {
          restartGame();
        } else {
          changeSceneWithFade(choice.next);
        }
      };
      choicesDiv.appendChild(btn);
    });
  } else {
    choicesDiv.innerHTML = "<small style='color:#aaa; cursor:pointer;'>Clique no texto para continuar...</small>";
  }
}

function advanceDialogue() {
  const scene = story[state.current];
  if (!scene || scene.type === "explore" || scene.type === "minigame") return;

  const dialogueList = Array.isArray(scene.text) ? scene.text : [scene.text];

  if (isTyping) {
    finishTyping(dialogueList, scene, document.getElementById("choices"));
    return;
  }

  if (state.textIndex < dialogueList.length - 1) {
    state.textIndex++;
    renderDialogue();
  }
}

document.getElementById("textbox").addEventListener("click", advanceDialogue);

function travelTo(sceneId) {
  closeModal("map-modal");
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.remove("active");
  changeSceneWithFade(sceneId);
}

// ====================== SAVE / LOAD POR SLOTS ======================
function openSaveLoadModal(mode) {
  currentSaveMode = mode;
  const titleEl = document.getElementById("saveload-title");
  if (titleEl) titleEl.textContent = mode === "save" ? "Salvar Jogo" : "Carregar Jogo";
  
  if (mode === "load") {
    switchScreen("game-screen");
  }

  renderSaveSlots();
  openModal("saveload-modal");
}

function closeSaveModal() {
  closeModal("saveload-modal");
  if (currentSaveMode === "load" && (!state.current || (state.current === "start" && document.getElementById("text").textContent === ""))) {
    switchScreen("title-screen");
  }
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
      changeSceneWithFade(state.current, false);
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
