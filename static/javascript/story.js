/* t story = {
    start: {
      speaker: "Narrador",
      background: null,
      character: null,
      text: [
        {text: "Você acorda em um quarto escuro. Há duas portas à sua frente.", emotion: "neutral" },
        {text: "Você repara que aquelas portas não existiam ali antes", emotion: "neutral" },
        {text: "Talvez você esteja em um sonho", emotion: "neutral" },
        {text: "Ou talvez, um pesadelo", emotion:"neutral" },
        {text: "O que você faz?", emotion:"" } ],
      choices: [
        { text: "Abrir a porta da esquerda", next: "esquerda" },
        { text: "Abrir a porta da direita", next: "direita" },
        { text: "Quero testar", next: "teste" }
      ]
    },
  
    teste: {
      speaker: "Narrador",
      background: "../cenarios/sopaz.jpg",
      character: null,
      text: "Você acorda em um quarto escuro. Há duas portas à sua frente.O que fazer?",
      choices: [
        { text: "Abrir a volta", next: "esquerda" },
        { text: "Abrir a reviravolota", next: "direita" }
      ]
    },

    esquerda: {
      speaker: "Narrador",
      background: null,
      character: null,
      text: [
        {text: "Você encontra uma chave antiga e um bilhete: 'Confie em quem te observa'.", emotion: "scared" },
        {text: "A figura é apenas estranha . . .", emotion: "angry"},
        {text: "Porém o mistério é o que mais da medo.", emotion: "happy"},
        {text: "O que você faz?", emotion: "sad"}
    
    ],
      choices: [
        { text: "Pegar a chave", next: "pegou_chave", flag: "chave" },
        { text: "Correr pro quarto e voltar", next: "start" }
      ]
    },
  
    direita: {
      speaker: "Narrador",
      background: null,
      character: null,
      text: "Uma figura misteriosa te observa do canto da sala.",
      choices: [
        { text: "Falar com a figura", next: "figura" },
        { text: "Sair correndo", next: "start" }
      ]
    },
  
    pegou_chave: {
      speaker: "Narrador",
      background: null,
      character: null,
      text: "Você agora possui a chave. O que deseja fazer?",
      choices: [
        { text: "Voltar para o quarto", next: "start" },
        { text: "Tentar a porta trancada (final)", next: "final_chave", requires: "chave" }
      ]
    },
  
    figura: {
      speaker: "Figura",
      background: null,
      character: null,
      text: "Eu sabia que você viria... Você tem a chave?",
      choices: [
        { text: "Sim, eu tenho", next: "final_chave", requires: "chave" },
        { text: "Não tenho", next: "final_sem_chave" }
      ]
    },
  
    final_chave: {
      speaker: "Narrador",
      background: null,
      character: null,
      text: "Você usa a chave e abre o caminho. Final bom alcançado!",
      choices: [
        { text: "Jogar novamente", next: "start" }
      ]
    },
  
    final_sem_chave: {
      speaker: "Figura",
      background: null,
      character: null,
      text: "Então você ainda não está pronto... Final ruim.",
      choices: [
        { text: "Tentar de novo", next: "start" }
      ]
    }
  };*/


  const story = {
  // ================= 1. NARRATIVA DE ENTRADA =================
  start: {
    speaker: "Agente",
    emotion: "scared",
    background: "/images/lab_fechado.jpg",
    text: [
      "A porta de alta segurança trancou-se atrás de mim!",
      "O alarme de contaminação vai disparar em breve. Preciso de encontrar o código para desativar o terminal e sair daqui."
    ],
    choices: [
      { text: "Investigar o Laboratório", next: "lab_exploracao" }
    ]
  },

  // ================= 2. CENA DE EXPLORAÇÃO COM HOTSPOTS =================
  lab_exploracao: {
    type: "explore",
    background: "/images/lab_fechado.jpg",
    hotspots: [
      { 
        label: "🖥️ Terminal", 
        top: "45%", 
        left: "25%", 
        next: "checar_terminal" 
      },
      { 
        label: "🔬 Bancada", 
        top: "65%", 
        left: "70%", 
        next: "investigar_bancada" 
      },
      { 
        label: "🗄️ Arquivo", 
        top: "35%", 
        left: "85%", 
        next: "investigar_arquivo" 
      },
      { 
        label: "🚪 Saída de Emergência", 
        top: "40%", 
        left: "50%", 
        requires: "senha_correta", // Só aparece interativo quando desbloquear no minigame!
        next: "fuga_sucesso" 
      }
    ]
  },

  // ================= 3. NÓS DE INTERAÇÃO DOS HOTSPOTS =================

  // Hotspot: Arquivo
  investigar_arquivo: {
    speaker: "Agente",
    emotion: "neutral",
    text: "Gavetas trancadas com papéis confidenciais. Nada de útil sobre a porta.",
    choices: [
      { text: "Continuar a procurar", next: "lab_exploracao" }
    ]
  },

  // Hotspot: Bancada (Acha a senha e ganha a flag)
  investigar_bancada: {
    speaker: "Agente",
    emotion: "happy",
    text: [
      "Afasto alguns frascos de vidro e vejo um bloco de notas rabiscado.",
      "Há um código anotado em destaque: '1984'!"
    ],
    choices: [
      { text: "Guardar anotação e voltar", flag: "tem_anotacao", next: "lab_exploracao" }
    ]
  },

  // Hotspot: Terminal (Decide se acede ao minigame ou recua)
  checar_terminal: {
    speaker: "Agente",
    emotion: "neutral",
    text: "O ecrã do terminal pede um código de acesso de 4 dígitos.",
    choices: [
      { text: "Tentar introduzir o código", next: "minigame_terminal" },
      { text: "Voltar a examinar a sala", next: "lab_exploracao" }
    ]
  },

  // ================= 4. CENA DO MINIGAME =================
  minigame_terminal: {
    type: "minigame",
    gameId: "keypad_code",
    onSuccess: "terminal_desbloqueado",
    onFailure: "terminal_erro",
    onCancel: "lab_exploracao"
  },

  // Resultado: Falha no Minigame
  terminal_erro: {
    speaker: "Sistema",
    emotion: "angry",
    text: "CÓDIGO INCORRETO! Acesso negado. Tente novamente.",
    choices: [
      { text: "Tentar novamente", next: "minigame_terminal" },
      { text: "Procurar mais pistas pelo laboratório", next: "lab_exploracao" }
    ]
  },

  // Resultado: Sucesso no Minigame
  terminal_desbloqueado: {
    speaker: "Agente",
    emotion: "happy",
    text: "*BEEP! BEEP!* O painel acendeu a luz verde! A Saída de Emergência foi desbloqueada.",
    choices: [
      { text: "Ir até à porta", next: "lab_exploracao" }
    ]
  },

  // ================= 5. FINAL DA CENA =================
  fuga_sucesso: {
    speaker: "Agente",
    emotion: "happy",
    background: "/images/corredor.jpg",
    text: "Empurro a porta de emergência pesada e consigo sair antes do bloqueio total do complexo!",
    choices: [
      { text: "Voltar ao Menu Principal", next: "restart" }
    ]
  }
};
