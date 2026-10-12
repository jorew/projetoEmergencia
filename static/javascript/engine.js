// ====================== ESTADO DO JOGO ======================
let state = {
  current: "start",
  flags: {},
  money: 500, // Saldo inicial do jogador ($500)
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

  overlay.classList.add("active");

  setTimeout(() => {
    showScene(nextSceneId, resetIndex);

    setTimeout(() => {
      overlay.classList.remove("active");
    }, 50);

  }, 350);
}

// ====================== GERENCIAMENTO DE DINHEIRO ======================
function updateHUD() {
  const moneyEl = document.getElementById("money-display");
  if (moneyEl) {
    moneyEl.textContent = `💰 $${state.money}`;
  }
}

function addMoney(amount) {
  state.money += amount;
  if (state.money < 0) state.money = 0;
  
  updateHUD();
  const sign = amount >= 0 ? "+" : "";
  showStatus(`Dinheiro: ${sign}$${amount} (Total: $${state.money})`);
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
    if (modalId === "quests-modal") renderQuestsModal();
    modal.classList.add("active");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

function startGame() {
  state = { current: "start", flags: {}, money: 500, textIndex: 0 };
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

// ====================== OBJETIVOS (QUEST LOG) ======================
function renderQuestsModal() {
  const container = document.getElementById("quests-container");
  if (!container) return;

  container.innerHTML = "";
  let activeQuestsCount = 0;

  if (typeof questLog === "undefined") {
    container.innerHTML = "<p style='color:#aaa;'>Nenhum objetivo registrado no story.js.</p>";
    return;
  }

  Object.keys(questLog).forEach(key => {
    const quest = questLog[key];

    // O objetivo aparece se a flag correspondente estiver ativa no state
    if (state.flags[quest.flag]) {
      activeQuestsCount++;
      
      const card = document.createElement("div");
      card.style.cssText = "background: #0f3460; border-left: 4px solid #e94560; padding: 12px; margin-bottom: 10px; border-radius: 4px;";
      
      card.innerHTML = `
        <h4 style="color: #e94560; margin-bottom: 4px; font-size: 14px;">📌 ${quest.title}</h4>
        <p style="font-size: 12px; color: #ccc; line-height: 1.4;">${quest.description}</p>
      `;
      
      container.appendChild(card);
    }
  });

  if (activeQuestsCount === 0) {
    container.innerHTML = "<p style='color:#aaa; text-align:center;'>Nenhum objetivo ativo no momento.</p>";
  }
}

// ====================== INVENTÁRIO ======================
function renderInventoryModal() {
  const container = document.getElementById("inventory-items-container");
  if (!container) return;
  
  container.innerHTML = "";

  const itemNames = {
    tem_chave: "🔑 Chave de Ferro",
    tem_anotacao: "📝 Anotação com Código",
    passagem_bus: "🚌 Passagem de Ônibus para Apókryphos"
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

// ====================== RENDERIZAÇÃO DE PERSONAGENS ======================
function renderCharacters(scene, activeCharId) {
  const container = document.getElementById("characters-layer");
  if (!container) return;

  container.innerHTML = "";

  if (scene.character && !scene.characters) {
    const img = document.createElement("img");
    img.src = scene.character;
    img.className = "character-sprite pos-center speaking";
    container.appendChild(img);
    return;
  }

  if (scene.characters && Array.isArray(scene.characters)) {
    scene.characters.forEach(char => {
      const img = document.createElement("img");
      img.src = char.src;
      img.className = `character-sprite pos-${char.position || 'center'}`;

      if (char.id === activeCharId || scene.characters.length === 1) {
        img.classList.add("speaking");
      }

      container.appendChild(img);
    });
  }
}

// ====================== MOTOR DAS CENAS ======================
function showScene(id, resetIndex = true) {
  const scene = story[id];
  if (!scene) return;

  state.current = id;
  if (resetIndex) state.textIndex = 0;

  updateHUD(); // Atualiza o saldo financeiro na interface

  const bg = document.getElementById("background");
  const textbox = document.getElementById("textbox");
  const hotspotsLayer = document.getElementById("hotspots-layer");
  const minigameContainer = document.getElementById("minigame-container");

  if (hotspotsLayer) hotspotsLayer.innerHTML = "";
  if (minigameContainer) minigameContainer.style.display = "none";

  if (scene.background) {
    bg.src = scene.background;
    bg.style.display = "block";
  } else {
    bg.style.display = "none";
  }

  // MODO 1: MINIGAME
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

  // MODO 2: CENA DE EXPLORAÇÃO (HOTSPOTS)
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
          if (spot.reward) addMoney(spot.reward);
          changeSceneWithFade(spot.next);
        };
        hotspotsLayer.appendChild(btn);
      });
    }
  } 
  // MODO 3: NARRATIVA NORMAL / DIÁLOGO
  else {
    textbox.style.display = "block";
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
  const currentSpeaker = typeof currentItem === 'object' && currentItem.speaker ? currentItem.speaker : (scene.speaker || "");
  const currentEmotion = typeof currentItem === 'object' && currentItem.emotion ? currentItem.emotion : (scene.emotion || 'neutral');
  const activeCharId = typeof currentItem === 'object' ? currentItem.activeChar : null;

  document.getElementById("speaker").textContent = currentSpeaker;

  renderCharacters(scene, activeCharId);

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
      
      // Se a escolha tiver custo financeiro, inclui no texto do botão
      let btnLabel = choice.text;
      if (choice.cost) {
        btnLabel += ` [💰 -$${choice.cost}]`;
      }
      btn.textContent = btnLabel;

      btn.onclick = (e) => {
        e.stopPropagation();

        // Validação de dinheiro suficiente
        if (choice.cost && state.money < choice.cost) {
          showStatus("Dinheiro insuficiente!");
          return;
        }

        // Aplica dedução ou recompensa
        if (choice.cost) addMoney(-choice.cost);
        if (choice.reward) addMoney(choice.reward);

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
      if (typeof state.money === "undefined") state.money = 500;
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
