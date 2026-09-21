// ====================== ESTADO DO JOGO ======================
/* t state = {
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
  */

// ====================== ESTADO DO JOGO ======================
/* et state = {
  current: "start",
  flags: {},
  textIndex: 0 // Novo: controla a fala atual dentro do nó
};

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
    showScene(state.current, false); // Mantém o progresso da fala
    showStatus("Jogo carregado!");
  } else {
    showStatus("Nenhum save encontrado!");
  }
}

function restartGame() {
  switchScreen("title-screen");
}

// ====================== MOTOR DAS CENAS ======================
function showScene(id, resetIndex = true) {
  const scene = story[id];
  if (!scene) return;

  state.current = id;
  if (resetIndex) state.textIndex = 0;

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

  // Configura a caixa de texto
  document.getElementById("speaker").textContent = scene.speaker || "";
  renderDialogue();
}

// Renderiza a fala atual e gerencia a exibição das escolhas
 function renderDialogue() {
  const scene = story[state.current];
  const choicesDiv = document.getElementById("choices");
  const textDiv = document.getElementById("text");

  // Garante suporte tanto para array de textos quanto para texto único
  const dialogueList = Array.isArray(scene.text) ? scene.text : [scene.text];
  
  // Atualiza o texto exibido
  textDiv.textContent = dialogueList[state.textIndex];

  // Se for a última fala do nó, exibe os botões de escolha
  if (state.textIndex >= dialogueList.length - 1) {
    choicesDiv.innerHTML = "";
    scene.choices.forEach(choice => {
      if (choice.requires && !state.flags[choice.requires]) return;

      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;
      btn.onclick = (e) => {
        e.stopPropagation(); // Evita acionar o clique da caixa de texto
        if (choice.flag) state.flags[choice.flag] = true;
        showScene(choice.next);
      };
      choicesDiv.appendChild(btn);
    });
  } else {
    // Esconde escolhas enquanto ainda houver falas restantes
    choicesDiv.innerHTML = "<small style='color:#aaa; cursor:pointer;'>Clique no texto para continuar...</small>";
  }
}

// Avança para a próxima fala ao clicar na caixa de texto
function advanceDialogue() {
  const scene = story[state.current];
  const dialogueList = Array.isArray(scene.text) ? scene.text : [scene.text];

  if (state.textIndex < dialogueList.length - 1) {
    state.textIndex++;
    renderDialogue();
  }
}

// Vincula o evento de clique na caixa de texto
document.getElementById("textbox").addEventListener("click", advanceDialogue);
*/

/* unction renderDialogue() {
  const scene = story[state.current];
  const choicesDiv = document.getElementById("choices");
  const textDiv = document.getElementById("text");

  const dialogueList = Array.isArray(scene.text) ? scene.text : [scene.text];
  const currentItem = dialogueList[state.textIndex];

  // Extrai o texto e a emoção (suporta tanto string simples quanto objeto)
  const currentText = typeof currentItem === 'object' ? currentItem.text : currentItem;
  const currentEmotion = typeof currentItem === 'object' ? currentItem.emotion : (scene.emotion || 'neutral');

  // Reset de Animações / Classes de Sentimento
  textDiv.className = ""; // Limpa emoções anteriores
  if (currentEmotion && currentEmotion !== 'neutral') {
    textDiv.classList.add(`emotion-${currentEmotion}`);
  }

  // Prepara a digitação
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

*/

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
    showScene(state.current, false); // Mantém o progresso da fala atual
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

// ====================== MOTOR DAS CENAS ======================
function showScene(id, resetIndex = true) {
  const scene = story[id];
  if (!scene) return;

  state.current = id;
  if (resetIndex) state.textIndex = 0;

  // Atualiza Imagens (Cenário e Personagem)
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

  // Configura Nome do Falante e Renderiza Diálogo
  document.getElementById("speaker").textContent = scene.speaker || "";
  renderDialogue();
}

// Renderiza a fala com digitação e aplica sentimentos/classes CSS
function renderDialogue() {
  const scene = story[state.current];
  const choicesDiv = document.getElementById("choices");
  const textDiv = document.getElementById("text");

  // Garante suporte para array de falas ou fala única
  const dialogueList = Array.isArray(scene.text) ? scene.text : [scene.text];
  const currentItem = dialogueList[state.textIndex];

  // Extrai o texto e o sentimento (suporta string simples ou objeto { text, emotion })
  const currentText = typeof currentItem === 'object' ? currentItem.text : currentItem;
  const currentEmotion = typeof currentItem === 'object' ? currentItem.emotion : (scene.emotion || 'neutral');

  // Reseta classes de sentimentos anteriores e aplica a nova
  textDiv.className = "";
  if (currentEmotion) {
    textDiv.classList.add(`emotion-${currentEmotion}`);
  }

  // Limpa escolhas e interrompe digitação anterior
  choicesDiv.innerHTML = "";
  clearInterval(typeWriterTimer);

  textDiv.textContent = "";
  let charIndex = 0;
  isTyping = true;

  // Animação letra por letra
  typeWriterTimer = setInterval(() => {
    if (charIndex < currentText.length) {
      textDiv.textContent += currentText.charAt(charIndex);
      charIndex++;
    } else {
      finishTyping(dialogueList, scene, choicesDiv);
    }
  }, 30); // Velocidade da digitação em milissegundos
}

// Finaliza a frase e reativa as escolhas ou o aviso de continuar
function finishTyping(dialogueList, scene, choicesDiv) {
  clearInterval(typeWriterTimer);
  isTyping = false;

  const textDiv = document.getElementById("text");
  
  // Extrai o texto garantindo exibição completa ao pular digitação
  const currentItem = dialogueList[state.textIndex];
  const currentText = typeof currentItem === 'object' ? currentItem.text : currentItem;
  textDiv.textContent = currentText;

  // Se for a última fala da cena, cria os botões de escolha
  if (state.textIndex >= dialogueList.length - 1) {
    choicesDiv.innerHTML = "";
    scene.choices.forEach(choice => {
      if (choice.requires && !state.flags[choice.requires]) return;

      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;
      btn.onclick = (e) => {
        e.stopPropagation(); // Impede o clique de passar para o textbox
        if (choice.flag) state.flags[choice.flag] = true;
        showScene(choice.next);
      };
      choicesDiv.appendChild(btn);
    });
  } else {
    choicesDiv.innerHTML = "<small style='color:#aaa; cursor:pointer;'>Clique no texto para continuar...</small>";
  }
}

// Avança a fala ou exibe o texto completo imediatamente se estiver digitando
function advanceDialogue() {
  const scene = story[state.current];
  const dialogueList = Array.isArray(scene.text) ? scene.text : [scene.text];

  // Se clicar enquanto estiver digitando, exibe a frase completa na hora
  if (isTyping) {
    finishTyping(dialogueList, scene, document.getElementById("choices"));
    return;
  }

  // Se já terminou a digitação, avança para a próxima frase da sequência
  if (state.textIndex < dialogueList.length - 1) {
    state.textIndex++;
    renderDialogue();
  }
}

// Associa o evento de clique na caixa de texto
document.getElementById("textbox").addEventListener("click", advanceDialogue);

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

