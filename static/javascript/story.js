const story = {
  start: {
    speaker: "Eu",
    background: "../cenarios/Cena1.png",
    character: null,
    text: [
      { text: "Eu nunca entendi muito bem...", audio:"../assets/audio/audio1.mp3" }, //1
      { text: "Mas, desde... muito pequeno, sentia algo estranho na minha própria família.", audio:"../assets/audio/audio2.mp3"}, //2
      { text: "Não sei como descrever, mas era como se meus pais... escondessem algo de mim." , audio:"../assets/audio/audio3.mp3"}, //3
      { text: "Eu sou filho único da família e favorito consequentemente... hihi " , audio:"../assets/audio/audio4.mp3"}, //4
      { text: "Por isso, eu sempre achei que era ilusão da minha cabeça e deixava esse detalhe de lado.",audio:"../assets/audio/audio5.mp3"} //5
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
      { text: "Mas teve uma certa vez que eu desci da minha cama no meio da madrugada,", audio:"../assets/audio/audio6.mp3"},
      { text: "Escutei vozes abafadas quando cheguei perto da cozinha, a casa era grande.", audio:"../assets/audio/audio7.mp3"},
      { text: "Minha vó, meu avô, minha mãe e o meu pai estava conversando sobre a minha tia Ana." , audio:"../assets/audio/audio8.mp3"},
      { text: "Eu escutei o choro baixo da minha mãe... e os outros familiares incluindo meu pai -" , audio:"../assets/audio/audio9.mp3" },
      { text: "estavam apoiando ela como podiam... pensei comigo mesmo: 'não é a primeira vez que isso acontece'.", audio:"../assets/audio/audio10.mp3"},
      { text: "Eu era pequeno, sempre que escutava mamãe chorar eu corria direto pro quarto e dormia ouvindo o seu pranto na mente." , audio:"../assets/audio/audio11.mp3"},
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
      },
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
      { text: "Tal ocorrido, não é muito bem explicado pela produtora da banda - aí tem coisa...", activeChar: "james" },
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
      { text: "Vou fazer rumo para Apókryphos Town" },
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
        next: "Int_sala"
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

  Int_sala: {
    speaker: "James",
    background: "../cenarios/Sala.png",
    text: [
      { text: "Nossa, eu preciso me despedir de mamãe, nunca saí sem avisar pra ela."}
    ],
    choices: [
      { text: "Explorar",
        next: "Exp_sala"
    
    }
    ]

  },

  Pegar_mala: {
    speaker: "James",
    background: "../cenarios/Quarto.png",
    text: [
      { text: "Já ia me esquecendo da mala, preciso dela pra organizar minhas coisas." }
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
      { text: "Perfeito, a mala já está pronta, agora posso ir." }
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
        next: "Conversa_cozinha"
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
  },

  termino_conv: {
    speaker: "James",
    background: "../cenarios/Sala.png",
    text: [
      { text: "Perfeito (...)" }
    ],
    choices: [
      { text: "Voltar", next: "Exp_sala" }
    ]

  },

  Conversa_cozinha: {
    background: "../cenarios/Cozinha.png",
    characters: [
      { id: "james", src: "../personagens/JamesAniston.png", position: "left" },
      { id: "yohanna", src: "../personagens/YohannaVirada.png", position: "right" }
    ],
    text: [
      {
        speaker: "James",
        text: "Mãe, vou fazer uma viajem. Benção?",
        emotion: "neutral",
        activeChar: "james"
      },
      {
        speaker: "Mãe Yohanna",
        text: "Filho, aonde você vai? ",
        emotion: "neutral",
        activeChar: "yohanna"
      },
      {
        speaker: "James",
        text: "Vou descansar a cabeça. Estou de férias e sinto necessidade. Não se preocupe ficartei bem.",
        emotion: "neutral",
        activeChar: "yohanna"
      },
      {
        speaker: "Mãe Yohanna",
        text: "Pois eu te abençoo. Vá em paz, e tome cuidado.",
        emotion: "neutral",
        activeChar: "yohanna"
      },
      {
        speaker: "James",
        text: "Certo mãe tomarei. Tchau!",
        emotion: "neutral",
        activeChar: "james"
      }
    ],
    choices: [
      { text: "Prosseguir", next: "termino_conv" }
    ]
  },

 

  Pegar_onibus:{
   type: "explore", 
   background: "../cenarios/paradaonibus.jpg",
    hotspots: [
      {
        label: "Julio",
        top: "70%",
        left: "70%",
        next: "Conversar_Julio"
      },
      {
        label: "Vanessa",
        top: "50%",
        left: "50%",
        next: "Conversar_Vanessa"
      },
      {
        label: "Raimundo",
        top: "90%",
        left: "40%",
        next: "Conversar_Raimundo"
      }
    ]
  },

  Conversar_Raimundo:{
    background: "../cenarios/",
          
  },

  Conversar_Vanessa:{
    background: "../cenarios/",

  }, 
  
  Conversar_Julio:{
    background: "../cenarios/paradaonibus.jpg",
    characters: [
      { id: "James", src: "../personagens/JamesAniston.png", position: "left" },
      { id: "Julio", src:"../personagens/Julio.png", position: "right"},
    ],
    text: [
      {
        speaker: "Julio",
        text: "Oi. Gosta de manicraft?",
        emotion: "neutral",
        activeChar: "Julio"
      },
      {
        speaker: "James",
        text: "Conheço. Ei sua roupa é bonita!",
        emotion: "neutral",
        activeChar: "James"
      },
      {
        speaker: "Julio",
        text: "Obrigado. Sabia que a espada de diamante significa evolução?",
        emotion: "neutral",
        activeChar: "Julio"
      },
      {
        speaker: "Julio",
        text: "É uma grande marca da disciplina de um jogador, conseguir uma sem usar trapaça é bem difícil, diamantes são raros hehe.",
        emotion: "happy",
        activeChar: "Julio"


      },
      {
        speaker: "James",
        text: "Nossa que legal... mas você já conseguiu?",
        emotion: "happy",
        activeChar: "James"
      },
      {
        speaker: "Julio",
        text: "Não vou negar, o meu sonho sempre foi ter uma de verdade. Mas só ter por ter, não faz muito sentido...",
        activeChar: "Julio",
        emotion: "happy",
      },
      {
        speaker: "Julio",
        text: "Essa espada é muito usada pra zerar o jogo, mas eu ainda não me sinto realizado pra zerar o jogo.",
        activeChar: "Julio",
      },
      {
        speaker: "Julio",
        text: "Eu prefiro construir o meu mundo primeiro, me realizar com ele antes de ir pro fim!",
        activeChar: "Julio",
        emotion: "happy",

      }, ],
      choices:[
        { text: "Prosseguir", next: "Pegar_onibus" }
       ]
    
  }




}
