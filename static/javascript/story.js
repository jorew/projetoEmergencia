
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
      { text: "Mãe, por que eu nunca conheci a tia Ana?"},

    ],
    choices: [
      { text: "Resposta de Yohanna", next: "Yohanna_Responde"}

    ],

  },

  Yohanna_Responde: {
    speaker: "Mãe Yohanna",
    background: null,
    character: null,
    text: [
      { text: "Meu filho... ela foi cantar daqui até o céu (ela começava a chorar)."},
      { text: "(Enxugando as lágrimas) Meu filho, é melhor você focar nos estudos -"},
      { text: "Para ser tão vitorioso quanto a sua tia Ana foi... só não se esqueça de ser feliz!"},
      { text: ". . .  ~"}

    ],

    choices: [
      { text: "Prosseguir", next: "estudo"}
    ]

  },

  estudo: {
    speaker: "James",
    background: null,
    character: null,
    text: [
      { text: "Desde então, eu tenho focado muito nos estudos, sem esquecer de ser feliz."},
      { text: "Descobri um tempo depois que a tia Ana participava de uma banda -"},
      { text: "conhecida como Banda Amadeira, tinha ganhado muita popularidade ultimamente. Mas que estranho, fiquei sabendo que todos os membros faleceram em um acidente."},
      { text: "Tal ocorrido, não é muito bem explicado pela produtora da banda - aí tem coisa..."},

      
    ],
    choices: [
      { text: "Prosseguir", next: "noticia"}

    ],

  },


  noticia: {
    speaker: "James",
    background: null,
    character: null,
    text: [
      { text: "Os fãs da banda lamentam, alguns nem sabem que os membros faleceram, alguns pensam até que eles ainda estão vivos. E tem aqueles que só querem curtir, não estão nem vendo."},
      { text: "Vendo algumas notícias, percebi que a banda atuava numa cidade conhecida por desaparecimentos repentinos, Apókryphos Town."},
      { text: "Perguntei pra minha mãe sobre, mas ela nunca fala nada a respeito. Se eu falar com qualquer outro familiar? Dá na mesma."},
      { text: "Bem, estou de férias... tenho um bom dinheiro guardado... posso fazer uma viagem para descobrir mais sobre a Banda Amadeira. Como estou de férias acho que posso dar uma passada por lá."}

    ],
    choices: [
      { text: "Explore", next: "dev"}
    ]


  }












  }
