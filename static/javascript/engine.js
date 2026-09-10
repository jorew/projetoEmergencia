// ====================== ESTADO DO JOGO ======================
let state = {
    current: "start",
    flags: {}
  };
  
  // ====================== GERENCIAMENTO DE TELAS ======================
  function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
  }
  
  function startGame() {
    state = { current: "start", flags: {} };
    switchScreen("game-screen");
    showScene("start");
  }
  
  function loadGameFromTitle() {
    const data = localStorage.getItem("meu_jogo_save");
    if (data) {
      state = JSON.parse(data);
      switchScreen("game-screen");
      showScene(state.current);
      showStatus("Jogo carregado!");
    } else {
      showStatus("Nenhum save encontrado!");
    }
  }
  
  function restartGame() {
    switchScreen("title-screen");
  }
  
  // ====================== MOTOR DAS CENAS ======================
  function showScene(id) {
    const scene = story[id];
    if (!scene) return;
  
    state.current = id;
  
    // Atualiza Textos
    document.getElementById("speaker").textContent = scene.speaker || "";
    document.getElementById("text").textContent = scene.text;
  
    // Atualiza Imagens
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
  
    // Gera as Escolhas
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";
  
    scene.choices.forEach(choice => {
      if (choice.requires && !state.flags[choice.requires]) return;
  
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;
      btn.onclick = () => {
        if (choice.flag) {
          state.flags[choice.flag] = true;
        }
        showScene(choice.next);
      };
      choicesDiv.appendChild(btn);
    });
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
      showScene(state.current);
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