/*

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

// ====================== MÓDULO DE ÁUDIO & SOM ======================
let audioState = {
  bgmEnabled: true,
  voiceEnabled: true,
  currentBgmSrc: null
};

const bgmPlayer = new Audio();
bgmPlayer.loop = true;
bgmPlayer.volume = 0.4;

const voicePlayer = new Audio();
voicePlayer.volume = 0.9;

function playBGM(src) {
  if (!src) return;
  if (audioState.currentBgmSrc === src && !bgmPlayer.paused) return;

  audioState.currentBgmSrc = src;
  bgmPlayer.src = src;

  if (audioState.bgmEnabled) {
    bgmPlayer.play().catch(e => console.log("Autoplay BGM bloqueado:", e));
  }
}

function stopBGM() {
  bgmPlayer.pause();
  audioState.currentBgmSrc = null;
}

function toggleBGM() {
  audioState.bgmEnabled = !audioState.bgmEnabled;
  const btn = document.getElementById("btn-toggle-bgm");

  if (audioState.bgmEnabled) {
    if (btn) {
      btn.textContent = "🎵 Música: LIGADA";
      btn.classList.remove("muted");
    }
    if (audioState.currentBgmSrc) {
      bgmPlayer.play().catch(e => console.log(e));
    }
  } else {
    if (btn) {
      btn.textContent = "🎵 Música: DESLIGADA";
      btn.classList.add("muted");
    }
    bgmPlayer.pause();
  }
}

function playVoice(src) {
  voicePlayer.pause();
  voicePlayer.currentTime = 0;

  if (!src || !audioState.voiceEnabled) return;

  voicePlayer.src = src;
  voicePlayer.play().catch(e => console.log("Erro ao reproduzir voz:", e));
}

function toggleVoice() {
  audioState.voiceEnabled = !audioState.voiceEnabled;
  const btn = document.getElementById("btn-toggle-voice");

  if (audioState.voiceEnabled) {
    if (btn) {
      btn.textContent = "🎙️ Vozes: LIGADAS";
      btn.classList.remove("muted");
    }
  } else {
    if (btn) {
      btn.textContent = "🎙️ Vozes: DESLIGADAS";
      btn.classList.add("muted");
    }
    voicePlayer.pause();
  }
}

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
  stopBGM();
  voicePlayer.pause();
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.remove("active");
  switchScreen("title-screen");
}

// ====================== OBJETIVOS (QUEST LOG ATIVAS/CONCLUÍDAS) ======================
function renderQuestsModal() {
  const container = document.getElementById("quests-container");
  if (!container) return;

  container.innerHTML = "";
  let questsCount = 0;

  if (typeof questLog === "undefined") {
    container.innerHTML = "<p style='color:#aaa;'>Nenhum objetivo registrado no story.js.</p>";
    return;
  }

  Object.keys(questLog).forEach(key => {
    const quest = questLog[key];

    // Exibe a missão se a flag de início estiver ativa no estado do jogador
    if (state.flags[quest.flag]) {
      questsCount++;
      const isCompleted = quest.completedFlag && state.flags[quest.completedFlag];

      const card = document.createElement("div");
      
      if (isCompleted) {
        // Estilo visual para missão Concluída (Verde)
        card.style.cssText = "background: #1b3b22; border-left: 4px solid #2ed573; padding: 12px; margin-bottom: 10px; border-radius: 4px; opacity: 0.85;";
        card.innerHTML = `
          <h4 style="color: #2ed573; margin-bottom: 4px; font-size: 14px; text-decoration: line-through;">✅ ${quest.title} (Concluído)</h4>
          <p style="font-size: 12px; color: #aaa; line-height: 1.4;">${quest.description}</p>
        `;
      } else {
        // Estilo visual para missão Em Andamento (Rosa/Destaque)
        card.style.cssText = "background: #0f3460; border-left: 4px solid #e94560; padding: 12px; margin-bottom: 10px; border-radius: 4px;";
        card.innerHTML = `
          <h4 style="color: #e94560; margin-bottom: 4px; font-size: 14px;">📌 ${quest.title}</h4>
          <p style="font-size: 12px; color: #ccc; line-height: 1.4;">${quest.description}</p>
        `;
      }
      
      container.appendChild(card);
    }
  });

  if (questsCount === 0) {
    container.innerHTML = "<p style='color:#aaa; text-align:center;'>Nenhum objetivo ativo no momento.</p>";
  }
}

// ====================== INVENTÁRIO ======================
function renderInventoryModal() {
  const container = document.getElementById("inventory-items-container");
  if (!container) return;
  
  container.innerHTML = "";

  const itemNames = {
    Mala_Aniston: "🧳 Mala (vazia)",
    Mala_cheia: "🧳 Mala (cheia)",
    tem_anotacao: "📝 Anotação com Código",
    passagem_bus: "🚌 Passagem de Ônibus"
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

  updateHUD();

  // GESTÃO DE ÁUDIO DE FUNDO (BGM)
  if (scene.bgm) {
    playBGM(scene.bgm);
  } else if (scene.bgm === null) {
    stopBGM();
  }

  const bgImg = document.getElementById("background");
  const bgVideo = document.getElementById("background-video");
  const textbox = document.getElementById("textbox");
  const hotspotsLayer = document.getElementById("hotspots-layer");
  const minigameContainer = document.getElementById("minigame-container");

  if (hotspotsLayer) hotspotsLayer.innerHTML = "";
  if (minigameContainer) minigameContainer.style.display = "none";

  // TRATAMENTO DUAL DE FUNDO (IMAGEM OU VÍDEO)
  if (scene.background) {
    const isVideo = scene.background.endsWith(".mp4") || 
                    scene.background.endsWith(".webm") || 
                    scene.background.endsWith(".ogv");

    if (isVideo) {
      if (bgImg) bgImg.style.display = "none";
      if (bgVideo) {
        bgVideo.src = scene.background;
        bgVideo.style.display = "block";
        bgVideo.play().catch(e => console.log("Autoplay vídeo bloqueado:", e));
      }
    } else {
      if (bgVideo) {
        bgVideo.pause();
        bgVideo.style.display = "none";
      }
      if (bgImg) {
        bgImg.src = scene.background;
        bgImg.style.display = "block";
      }
    }
  } else {
    if (bgImg) bgImg.style.display = "none";
    if (bgVideo) {
      bgVideo.pause();
      bgVideo.style.display = "none";
    }
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
  const currentVoice = typeof currentItem === 'object' ? currentItem.voice : null;

  // REPRODUÇÃO DE DUBLAGEM / VOZ
  if (currentVoice) {
    playVoice(currentVoice);
  } else {
    voicePlayer.pause();
  }

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
      
      let btnLabel = choice.text;
      if (choice.cost) {
        btnLabel += ` [💰 -$${choice.cost}]`;
      }
      btn.textContent = btnLabel;

      btn.onclick = (e) => {
        e.stopPropagation();

        if (choice.cost && state.money < choice.cost) {
          showStatus("Dinheiro insuficiente!");
          return;
        }

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
*/

// ====================== ESTADO DO JOGO ======================
let state = {
  current: "start",
  flags: {},
  money: 500, // Saldo inicial do jogador ($500)
  textIndex: 0,
  laptopWallpaper: "linear-gradient(135deg, #1e1e2f, #0f3460)"
};

let typeWriterTimer = null;
let isTyping = false;
let currentSaveMode = "save";

// ====================== MÓDULO DE ÁUDIO & SOM ======================
let audioState = {
  bgmEnabled: true,
  voiceEnabled: true,
  currentBgmSrc: null
};

const bgmPlayer = new Audio();
bgmPlayer.loop = true;
bgmPlayer.volume = 0.4;

const voicePlayer = new Audio();
voicePlayer.volume = 0.9;

function playBGM(src) {
  if (!src) return;
  if (audioState.currentBgmSrc === src && !bgmPlayer.paused) return;

  audioState.currentBgmSrc = src;
  bgmPlayer.src = src;

  if (audioState.bgmEnabled) {
    bgmPlayer.play().catch(e => console.log("Autoplay BGM bloqueado:", e));
  }
}

function stopBGM() {
  bgmPlayer.pause();
  audioState.currentBgmSrc = null;
}

function toggleBGM() {
  audioState.bgmEnabled = !audioState.bgmEnabled;
  const btn = document.getElementById("btn-toggle-bgm");

  if (audioState.bgmEnabled) {
    if (btn) {
      btn.textContent = "🎵 Música: LIGADA";
      btn.classList.remove("muted");
    }
    if (audioState.currentBgmSrc) {
      bgmPlayer.play().catch(e => console.log(e));
    }
  } else {
    if (btn) {
      btn.textContent = "🎵 Música: DESLIGADA";
      btn.classList.add("muted");
    }
    bgmPlayer.pause();
  }
}

function playVoice(src) {
  voicePlayer.pause();
  voicePlayer.currentTime = 0;

  if (!src || !audioState.voiceEnabled) return;

  voicePlayer.src = src;
  voicePlayer.play().catch(e => console.log("Erro ao reproduzir voz:", e));
}

function toggleVoice() {
  audioState.voiceEnabled = !audioState.voiceEnabled;
  const btn = document.getElementById("btn-toggle-voice");

  if (audioState.voiceEnabled) {
    if (btn) {
      btn.textContent = "🎙️ Vozes: LIGADAS";
      btn.classList.remove("muted");
    }
  } else {
    if (btn) {
      btn.textContent = "🎙️ Vozes: DESLIGADAS";
      btn.classList.add("muted");
    }
    voicePlayer.pause();
  }
}

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

  }, 200);
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
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
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
    if (modalId === "laptop-modal") applySavedWallpaper();
    modal.classList.add("active");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

function startGame() {
  state = { 
    current: "start", 
    flags: {}, 
    money: 500, 
    textIndex: 0,
    laptopWallpaper: "linear-gradient(135deg, #1e1e2f, #0f3460)"
  };
  
  const overlay = document.getElementById("fade-overlay");
  if (overlay) overlay.classList.remove("active");

  switchScreen("game-screen");
  showScene("start", true);
}

function restartGame() {
  clearInterval(typeWriterTimer);
  isTyping = false;
  stopBGM();
  voicePlayer.pause();
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.remove("active");
  switchScreen("title-screen");
}

// ====================== MÓDULO DO LAPTOP / OS SIMULADO ======================
function openLaptopApp(appId) {
  document.querySelectorAll('.os-desktop .window').forEach(win => win.classList.add('hidden'));
  const targetApp = document.getElementById(`app-${appId}`);
  if (targetApp) {
    targetApp.classList.remove('hidden');
  }
  if (appId === 'buyline') {
    updateBuylineButton();
  }
}

function closeLaptopApp(appId) {
  const targetApp = document.getElementById(`app-${appId}`);
  if (targetApp) {
    targetApp.classList.add('hidden');
  }
}

function changeWallpaper(styleValue) {
  const desktop = document.getElementById('os-desktop');
  if (desktop) {
    desktop.style.background = styleValue;
    desktop.style.backgroundSize = "cover";
    desktop.style.backgroundPosition = "center";
    state.laptopWallpaper = styleValue;
    showStatus("Wallpaper alterado!");
  }
}

function applySavedWallpaper() {
  if (state.laptopWallpaper) {
    changeWallpaper(state.laptopWallpaper);
  }
}

function updateBuylineButton() {
  const btn = document.getElementById('buyline-btn');
  if (!btn) return;

  if (state.flags["passagem_comprada"]) {
    btn.textContent = "✅ Passagem Comprada";
    btn.classList.add("disabled");
    btn.onclick = null;
  } else {
    btn.textContent = "Finalizar Compra ($150)";
    btn.classList.remove("disabled");
    btn.onclick = buyTicketViaBuyline;
  }
}

function buyTicketViaBuyline() {
  if (state.flags["passagem_comprada"]) return;

  if (state.money < 150) {
    showStatus("Dinheiro insuficiente!");
    return;
  }

  addMoney(-150);
  state.flags["passagem_comprada"] = true;
  state.flags["passagem_bus"] = true;

  updateBuylineButton();
  showStatus("Passagem adquirida com sucesso!");
}

// ====================== OBJETIVOS (QUEST LOG ATIVAS/CONCLUÍDAS) ======================
function renderQuestsModal() {
  const container = document.getElementById("quests-container");
  if (!container) return;

  container.innerHTML = "";
  let questsCount = 0;

  if (typeof questLog === "undefined") {
    container.innerHTML = "<p style='color:#aaa;'>Nenhum objetivo registrado no story.js.</p>";
    return;
  }

  Object.keys(questLog).forEach(key => {
    const quest = questLog[key];

    if (state.flags[quest.flag]) {
      questsCount++;
      const isCompleted = quest.completedFlag && state.flags[quest.completedFlag];

      const card = document.createElement("div");
      
      if (isCompleted) {
        card.style.cssText = "background: #1b3b22; border-left: 4px solid #2ed573; padding: 12px; margin-bottom: 10px; border-radius: 4px; opacity: 0.85;";
        card.innerHTML = `
          <h4 style="color: #2ed573; margin-bottom: 4px; font-size: 14px; text-decoration: line-through;">✅ ${quest.title} (Concluído)</h4>
          <p style="font-size: 12px; color: #aaa; line-height: 1.4;">${quest.description}</p>
        `;
      } else {
        card.style.cssText = "background: #0f3460; border-left: 4px solid #e94560; padding: 12px; margin-bottom: 10px; border-radius: 4px;";
        card.innerHTML = `
          <h4 style="color: #e94560; margin-bottom: 4px; font-size: 14px;">📌 ${quest.title}</h4>
          <p style="font-size: 12px; color: #ccc; line-height: 1.4;">${quest.description}</p>
        `;
      }
      
      container.appendChild(card);
    }
  });

  if (questsCount === 0) {
    container.innerHTML = "<p style='color:#aaa; text-align:center;'>Nenhum objetivo ativo no momento.</p>";
  }
}

// ====================== INVENTÁRIO ======================
function renderInventoryModal() {
  const container = document.getElementById("inventory-items-container");
  if (!container) return;
  
  container.innerHTML = "";

  const itemNames = {
    Mala_Aniston: "🧳 Mala (vazia)",
    Mala_cheia: "🧳 Mala (cheia)",
    tem_anotacao: "📝 Anotação com Código",
    passagem_bus: "🚌 Passagem de Ônibus"
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

  if (scene.character && typeof scene.character === 'string') {
    const img = document.createElement("img");
    img.src = scene.character;
    img.className = "character-sprite pos-center speaking";
    container.appendChild(img);
    return;
  }

  if (scene.character && typeof scene.character === 'object') {
    const img = document.createElement("img");
    img.src = scene.character.src || scene.character.url;
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
  if (!scene) {
    console.error(`Cena "${id}" não encontrada no story.js`);
    return;
  }

  state.current = id;
  if (resetIndex) state.textIndex = 0;

  updateHUD();

  if (scene.bgm) {
    playBGM(scene.bgm);
  } else if (scene.bgm === null) {
    stopBGM();
  }

  const bgImg = document.getElementById("background");
  const bgVideo = document.getElementById("background-video");
  const textbox = document.getElementById("textbox");
  const hotspotsLayer = document.getElementById("hotspots-layer");
  const minigameContainer = document.getElementById("minigame-container");

  if (hotspotsLayer) hotspotsLayer.innerHTML = "";
  if (minigameContainer) minigameContainer.style.display = "none";

  if (scene.background) {
    const bgSrc = scene.background;
    const isVideo = bgSrc.endsWith(".mp4") || bgSrc.endsWith(".webm") || bgSrc.endsWith(".ogv");

    if (isVideo) {
      if (bgImg) bgImg.style.display = "none";
      if (bgVideo) {
        bgVideo.src = bgSrc;
        bgVideo.style.display = "block";
        bgVideo.play().catch(e => console.log("Autoplay vídeo bloqueado:", e));
      }
    } else {
      if (bgVideo) {
        bgVideo.pause();
        bgVideo.style.display = "none";
      }
      if (bgImg) {
        bgImg.src = bgSrc;
        bgImg.style.display = "block";
      }
    }
  } else {
    if (bgImg) bgImg.style.display = "none";
    if (bgVideo) {
      bgVideo.pause();
      bgVideo.style.display = "none";
    }
  }

  if (scene.type === "minigame") {
    if (textbox) textbox.style.display = "none";

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

  if (scene.type === "explore") {
    if (textbox) textbox.style.display = "none";

    if (scene.hotspots && hotspotsLayer) {
      scene.hotspots.forEach(spot => {
        if (spot.requires && !state.flags[spot.requires]) return;
        if (spot.requiresNot && state.flags[spot.requiresNot]) return;

        const btn = document.createElement("button");
        btn.className = "hotspot";
        btn.style.top = spot.top;
        btn.style.left = spot.left;
        btn.textContent = spot.label;
        btn.onclick = (e) => {
          e.stopPropagation();
          if (spot.flag) state.flags[spot.flag] = true;
          if (spot.reward) addMoney(spot.reward);
          
          if (typeof spot.action === "function") {
            spot.action();
          }

          if (spot.next) {
            changeSceneWithFade(spot.next);
          }
        };
        hotspotsLayer.appendChild(btn);
      });
    }
  } 
  else {
    if (textbox) textbox.style.display = "block";
    renderDialogue();
  }
}

function renderDialogue() {
  const scene = story[state.current];
  if (!scene) return;

  const choicesDiv = document.getElementById("choices");
  const textDiv = document.getElementById("text");

  const dialogueList = Array.isArray(scene.text) ? scene.text : [scene.text];
  const currentItem = dialogueList[state.textIndex];

  if (!currentItem) return;

  const currentText = typeof currentItem === 'object' ? currentItem.text : currentItem;
  const currentSpeaker = typeof currentItem === 'object' && currentItem.speaker ? currentItem.speaker : (scene.speaker || "");
  const currentEmotion = typeof currentItem === 'object' && currentItem.emotion ? currentItem.emotion : (scene.emotion || 'neutral');
  const activeCharId = typeof currentItem === 'object' ? currentItem.activeChar : null;
  const currentVoice = typeof currentItem === 'object' ? currentItem.voice : null;

  if (currentVoice) {
    playVoice(currentVoice);
  } else {
    voicePlayer.pause();
  }

  const speakerEl = document.getElementById("speaker");
  if (speakerEl) speakerEl.textContent = currentSpeaker;

  renderCharacters(scene, activeCharId);

  if (textDiv) {
    textDiv.className = "";
    if (currentEmotion) {
      textDiv.classList.add(`emotion-${currentEmotion}`);
    }
  }

  if (choicesDiv) choicesDiv.innerHTML = "";
  clearInterval(typeWriterTimer);

  if (textDiv) textDiv.textContent = "";
  let charIndex = 0;
  isTyping = true;

  typeWriterTimer = setInterval(() => {
    if (charIndex < currentText.length) {
      if (textDiv) textDiv.textContent += currentText.charAt(charIndex);
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
  
  if (textDiv) textDiv.textContent = currentText;

  if (!choicesDiv) return;

  if (state.textIndex >= dialogueList.length - 1) {
    choicesDiv.innerHTML = "";
    
    if (scene.choices && Array.isArray(scene.choices)) {
      scene.choices.forEach(choice => {
        if (choice.requires && !state.flags[choice.requires]) return;
        if (choice.requiresNot && state.flags[choice.requiresNot]) return;

        const btn = document.createElement("button");
        btn.className = "choice-btn";
        
        let btnLabel = choice.text;
        if (choice.cost) {
          btnLabel += ` [💰 -$${choice.cost}]`;
        }
        btn.textContent = btnLabel;

        btn.onclick = (e) => {
          e.stopPropagation();

          if (choice.cost && state.money < choice.cost) {
            showStatus("Dinheiro insuficiente!");
            return;
          }

          if (choice.cost) addMoney(-choice.cost);
          if (choice.reward) addMoney(choice.reward);

          if (choice.flag) state.flags[choice.flag] = true;

          if (typeof choice.action === "function") {
            choice.action();
          }

          if (choice.next === "restart") {
            restartGame();
          } else if (choice.next) {
            changeSceneWithFade(choice.next);
          }
        };
        choicesDiv.appendChild(btn);
      });
    }
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

window.addEventListener('DOMContentLoaded', () => {
  const textbox = document.getElementById("textbox");
  if (textbox) {
    textbox.addEventListener("click", advanceDialogue);
  }
});

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
      if (typeof state.laptopWallpaper === "undefined") state.laptopWallpaper = "linear-gradient(135deg, #1e1e2f, #0f3460)";
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

