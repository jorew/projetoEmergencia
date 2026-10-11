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
    speaker: "Eu",
    background: null,
    character: null,
    text: [
      { text: "Eu nunca entendi muito bem..."},
      { text: "Mas, desde... muito pequeno, sentia algo estranho na minha própria família."},
      { text: "Não sei como descrever, mas era como se meus pais... escondessem algo de mim."},
      { text: "Eu sou filho único da família e favorito consequentemente... hihi ~"},
      { text: "Por isso, eu sempre achei que era ilusão da minha cabeça e deixava esse detalhe de lado."}
    ],
    choices: [
      { text: "Prosseguir", next: "certa_vez"}
    ]
    
  },


  certa_vez: {
    speaker: "Eu",
    background: null,
    character: null,
    text: [
      { text: "Mas teve uma certa vez que eu desci da minha cama no meio da madrugada,"},
      { text: "Escutei vozes abafadas quando cheguei perto da cozinha, a casa era grande."},
      { text: "Minha vó, meu avô, minha mãe e o meu pai estava conversando sobre a minha tia Ana."},
      { text: "Eu escutei o choro baixo da minha mãe... e os outros familiares incluindo meu pai -"},
      { text: "estavam apoiando ela como podiam... pensei comigo mesmo: 'não é a primeira vez que isso acontece'."},
      { text: "Eu era pequeno, sempre que escutava mamãe chorar eu corria direto pro quarto e dormia ouvindo o seu pranto na mente."}

    ],

    choices: [
      { text: "Prosseguir", next: "pergunta" }
    ]

  },


  pergunta: {
    speaker: "James",
    background: null,
    character: null,
    text: [
      { text: "Algumas vezes eu criava coragem para perguntá-la:"},
      { text: "Mãe, por que eu nunca conheci a tia Ana?", next: "Yohanna_Responde"},

    ]

  },

  Yohanna_Responde: {
    speaker: "Mãe Yohanna",
    background: null,
    character: null,
    text: [
      { text: "Meu filho... ela foi cantar daqui até o céu (ela começava a chorar)."}

    ]


  }







  }
