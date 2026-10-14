const story = {
  start: {
    speaker: "Eu",
    background: "../cenarios/Cena1.png",
    character: null,
    text: [
      { text: "Eu nunca entendi muito bem..." },
      { text: "Mas, desde... muito pequeno, sentia algo estranho na minha própria família." },
      { text: "Não sei como descrever, mas era como se meus pais... escondessem algo de mim." },
      { text: "Eu sou filho único da família e favorito consequentemente... hihi ~" },
      { text: "Por isso, eu sempre achei que era ilusão da minha cabeça e deixava esse detalhe de lado." }
    ],
    choices: [
      { text: "Prosseguir", next: "certa_vez" }
    ]
  },

  certa_vez: {
    speaker: "Eu",
    background: "../cenarios/Cena2.png",
    character: null,
    text: [
      { text: "Mas teve uma certa vez que eu desci da minha cama no meio da madrugada," },
      { text: "Escutei vozes abafadas quando cheguei perto da cozinha, a casa era grande." },
      { text: "Minha vó, meu avô, minha mãe e o meu pai estava conversando sobre a minha tia Ana." },
      { text: "Eu escutei o choro baixo da minha mãe... e os outros familiares incluindo meu pai -" },
      { text: "estavam apoiando ela como podiam... pensei comigo mesmo: 'não é a primeira vez que isso acontece'." },
      { text: "Eu era pequeno, sempre que escutava mamãe chorar eu corria direto pro quarto e dormia ouvindo o seu pranto na mente." }
    ],
    choices: [
      { text: "Prosseguir", next: "pergunta" }
    ]
  },

  pergunta: {
    background: "../cenarios/Cozinha.png",
    characters: [
      { id: "james", src: "../personagens/JamesAnistonC.png", position: "left" },
      { id: "yohanna", src: "../personagens/YohannaVirada.png", position: "right" }
    ],
    text: [
      {
        speaker: "James",
        text: "(Uma vez tive coragem pra perguntar pra ela)",
        emotion: "neutral",
        activeChar: "james"
      },
      {
        speaker: "James",
        text: "Mãe, por que eu nunca vi a tia Ana? O que houve com ela?",
        emotion: "neutral",
        activeChar: "james"
      },
      {
        speaker: "Mãe Yohanna",
        text: "Meu filho... ela foi cantar daqui até o céu (ela começava a chorar).",
        emotion: "sad",
        activeChar: "yohanna"
      },
      {
        speaker: "Mãe Yohanna",
        text: "(Enxugando as lágrimas) Meu filho, é melhor você focar nos estudos -",
        emotion: "sad",
        activeChar: "yohanna"
      },
      {
        speaker: "Mãe Yohanna",
        text: "Para ser tão vitorioso quanto a sua tia Ana foi... só não se esqueça de ser feliz!",
        emotion: "sad",
        activeChar: "yohanna"
      }
    ],
    choices: [
      { text: "Prosseguir", next: "estudo" }
    ]
  },

  estudo: {
    speaker: "James",
    background: "../cenarios/CenaEstudo.png",
    character: { id: "james", src: "../personagens/JamesAniston.png" },
    text: [
      { text: "Desde então, eu tenho focado muito nos estudos, sem esquecer de ser feliz.", activeChar: "james" },
      { text: "Descobri um tempo depois que a tia Ana participava de uma banda -", activeChar: "james" },
      { text: "conhecida como Banda Amadeira, tinha ganhado muita popularidade ultimamente. Mas que estranho, fiquei sabendo que todos os membros faleceram em um acidente.", activeChar: "james" },
      { text: "Tal ocorrido, não é muito bem explicado pela produtora da banda - aí tem coisa...", activeChar: "james" }
    ],
    choices: [
      { text: "Prosseguir", next: "noticia" }
    ]
  },

  noticia: {
    speaker: "James",
    background: "../cenarios/Cena3.jpg",
    character: null,
    text: [
      { text: "Os fãs da banda lamentam, alguns nem sabem que os membros faleceram, alguns pensam até que eles ainda estão vivos. E tem aqueles que só querem curtir, não estão nem vendo." },
      { text: "Vendo algumas notícias, percebi que a banda atuava numa cidade conhecida por desaparecimentos repentinos, Apókryphos Town." },
      { text: "Perguntei pra minha mãe sobre, mas ela nunca fala nada a respeito. Se eu falar com qualquer outro familiar? Dá na mesma." },
      { text: "Bem, estou de férias... tenho um bom dinheiro guardado... posso fazer uma viagem para descobrir mais sobre a Banda Amadeira. Como estou de férias acho que posso dar uma passada para entender tudo isso." },
      { text: "Vou fazer rumo para Apókryphos Town" }
    ],
    choices: [
      { text: "Explore", next: "Exp_quarto" }
    ]
  },

  Exp_quarto: {
    type: "explore",
    background: "../cenarios/Quarto.png",
    hotspots: [
      {
        label: "🚪 Ir à sala",
        top: "60%",
        left: "70%",
        next: "Exp_sala"
      },
      {
        label: "💻 Pc",
        top: "48%",
        left: "50%",
        action: () => {
          if (typeof applySavedWallpaper === "function") applySavedWallpaper();
          if (typeof openModal === "function") openModal("laptop-modal");
        }
      },
      {
        label: "🗄️ Closet",
        top: "50%",
        left: "80%",
        requires: "Mala_Aniston",
        next: "Fazer_mala"
      },
      {
        label: "🛏️ Cama",
        top: "70%",
        left: "10%",
        next: "Pegar_mala"
      }
    ]
  },

  Pegar_mala: {
    speaker: "James",
    background: "../cenarios/Quarto.png",
    text: [
      { text: "Ia me esquecendo da minha mala, preciso dela pra organizar minhas coisas." }
    ],
    choices: [
      {
        text: "Pegar mala",
        flag: "Mala_Aniston",
        requiresNot: "Mala_Aniston",
        next: "mala_adquirida"
      },
      {
        text: "Não pegar agora",
        next: "Exp_quarto"
      }
    ]
  },

  mala_adquirida: {
    speaker: "James",
    background: "../cenarios/Quarto.png",
    text: [
      { text: "Perfeito, agora eu tenho uma mala." }
    ],
    choices: [
      { text: "Voltar", next: "Exp_quarto" }
    ]
  },

  Fazer_mala: {
    speaker: "James",
    background: "../cenarios/Quarto.png",
    text: [
      { text: "Preciso fazer a minha mala, com certeza preciso levar roupas." }
    ],
    choices: [
      {
        text: "Encher a mala com produtos e roupas",
        flag: "Mala_cheia",
        requiresNot: "Mala_cheia",
        next: "mala_esta_cheia"
      },
      {
        text: "Não fazer isso agora",
        next: "Exp_quarto"
      }
    ]
  },

  mala_esta_cheia: {
    speaker: "James",
    background: "../cenarios/Quarto.png",
    text: [
      { text: "Perfeito, a mala também está cheia, agora posso ir." }
    ],
    choices: [
      { text: "Voltar", next: "Exp_quarto" }
    ]
  },

  Exp_sala: {
    type: "explore",
    background: "../cenarios/Sala.png",
    hotspots: [
      {
        label: "🚪 Ir à cozinha",
        top: "70%",
        left: "70%",
        next: "Exp_cozinha"
      },
      {
        label: "🚪 Sair de casa",
        top: "50%",
        left: "50%",
        requires: "Mala_cheia",
        next: "Pegar_onibus"
      },
      {
        label: "🚪 Voltar pro quarto",
        top: "90%",
        left: "40%",
        next: "Exp_quarto"
      }
    ]
  }
};
