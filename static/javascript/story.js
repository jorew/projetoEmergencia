const story = {
    start: {
      speaker: "Narrador",
      background: null,
      character: null,
      text: "Você acorda em um quarto escuro. Há duas portas à sua frente.",
      choices: [
        { text: "Abrir a porta da esquerda", next: "esquerda" },
        { text: "Abrir a porta da direita", next: "direita" }
      ]
    },
  
    esquerda: {
      speaker: "Narrador",
      background: null,
      character: null,
      text: "Você encontra uma chave antiga e um bilhete: 'Confie em quem te observa'.",
      choices: [
        { text: "Pegar a chave", next: "pegou_chave", flag: "tem_chave" },
        { text: "Ignorar e voltar", next: "start" }
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
        { text: "Tentar a porta trancada (final)", next: "final_chave", requires: "tem_chave" }
      ]
    },
  
    figura: {
      speaker: "Figura",
      background: null,
      character: null,
      text: "Eu sabia que você viria... Você tem a chave?",
      choices: [
        { text: "Sim, eu tenho", next: "final_chave", requires: "tem_chave" },
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
  };