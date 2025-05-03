let tempoPomodoro = localStorage.getItem("tempoPomodoro") 
  ? parseInt(localStorage.getItem("tempoPomodoro"), 10) 
  : 25; // Valor padrão: 25 minutos

let tempoPausa = localStorage.getItem("tempoPausa") 
  ? parseInt(localStorage.getItem("tempoPausa"), 10) 
  : 5; // Valor padrão: 5 minutos

let quantidadePomodoros = 0; // Inicialmente vazio
let tempo = tempoPomodoro * 60; // Tempo inicial em segundos
let intervalo = null;
let emFoco = true; // Indica se está no período de foco ou pausa

const display = document.querySelector(".ponteiro");
const mensagemFoco = document.getElementById("mensagem-foco");
const mensagemIntervalo = document.getElementById("mensagem-intervalo");
const mensagemFinal = document.getElementById("mensagem-final");
const inputQuantidadePomodoros = document.getElementById("quantidade-pomodoros");

// Dados de produtividade semanal (em minutos)
const produtividadeSemanal = {
  Segunda: 0,
  Terça: 0,
  Quarta: 0,
  Quinta: 0,
  Sexta: 0,
  Sábado: 0,
  Domingo: 0,
};

// Atualiza o gráfico com base nos dados
function atualizarGrafico() {
  const barras = document.querySelectorAll(".barra");
  barras.forEach((barra) => {
    const dia = barra.getAttribute("data-dia");
    const preenchimento = barra.querySelector(".preenchimento");
    const altura = (produtividadeSemanal[dia] / 300) * 100; // 300 minutos = 5 horas
    preenchimento.style.height = `${altura}%`;
  });
}

// Incrementa a produtividade do dia atual
function incrementarProdutividade(minutos) {
  const diasSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  const hoje = new Date().getDay(); // Obtém o índice do dia atual (0 = Domingo, 6 = Sábado)
  const diaAtual = diasSemana[hoje];
  produtividadeSemanal[diaAtual] += minutos;
  atualizarGrafico();
}

// Exemplo: Incrementar 25 minutos após um ciclo de foco
function finalizarCicloFoco() {
  incrementarProdutividade(25); // Adiciona 25 minutos ao dia atual
}

function formatar(segundos) {
  const m = String(Math.floor(segundos / 60)).padStart(2, '0');
  const s = String(segundos % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function atualizarDisplay() {
  display.textContent = formatar(tempo);
}

function carregarValoresIniciais() {
  tempoPomodoro = localStorage.getItem("tempoPomodoro") 
    ? parseInt(localStorage.getItem("tempoPomodoro"), 10) 
    : 25;

  tempoPausa = localStorage.getItem("tempoPausa") 
    ? parseInt(localStorage.getItem("tempoPausa"), 10) 
    : 5;

  tempo = tempoPomodoro * 60;
  atualizarDisplay();
}

function iniciar() {
  if (intervalo !== null) return;

  // Atualizar os valores de tempoPomodoro e tempoPausa com os mais recentes
  tempoPomodoro = localStorage.getItem("tempoPomodoro") 
    ? parseInt(localStorage.getItem("tempoPomodoro"), 10) 
    : 25;

  tempoPausa = localStorage.getItem("tempoPausa") 
    ? parseInt(localStorage.getItem("tempoPausa"), 10) 
    : 5;

  // Obter a quantidade de Pomodoros do campo de entrada
  quantidadePomodoros = parseInt(inputQuantidadePomodoros.value, 10);
  if (isNaN(quantidadePomodoros) || quantidadePomodoros <= 0) {
    alert("Por favor, insira uma quantidade válida de Pomodoros.");
    return;
  }

  // Atualizar o tempo inicial com base no tempoPomodoro
  tempo = tempoPomodoro * 60;

  // Exibe a mensagem inicial de foco
  mensagemFoco.style.display = emFoco ? "block" : "none";
  mensagemIntervalo.style.display = emFoco ? "none" : "block";
  mensagemFinal.style.display = "none";

  // Iniciar o cronômetro
  intervalo = setInterval(() => {
    if (tempo > 0) {
      tempo--;
      atualizarDisplay();
    } else {
      clearInterval(intervalo);
      intervalo = null;
      alternarCiclo();
    }
  }, 1000);
}

function alternarCiclo() {
  if (emFoco) {
    // Finalizou um ciclo de foco
    quantidadePomodoros--;
    inputQuantidadePomodoros.value = quantidadePomodoros; // Atualiza o campo
    if (quantidadePomodoros === 0) {
      finalizarPomodoros();
      return;
    }
    tempo = tempoPausa * 60; // Inicia o tempo de pausa
  } else {
    // Finalizou um ciclo de pausa
    tempo = tempoPomodoro * 60; // Inicia o próximo ciclo de foco
  }

  emFoco = !emFoco; // Alterna entre foco e pausa
  iniciar(); // Inicia automaticamente o próximo ciclo
}

function finalizarPomodoros() {
  mensagemFoco.style.display = "none";
  mensagemIntervalo.style.display = "none";
  mensagemFinal.style.display = "block";
  display.textContent = "00:00";
}

function resetar() {
  clearInterval(intervalo);
  intervalo = null;
  carregarValoresIniciais();
  quantidadePomodoros = 0; // Resetar para o valor inicial
  inputQuantidadePomodoros.value = ""; // Limpa o campo
  emFoco = true;
  mensagemFoco.style.display = "none";
  mensagemIntervalo.style.display = "none";
  mensagemFinal.style.display = "none";
}

// Eventos
document.querySelector(".btn-iniciar").addEventListener("click", iniciar);
document.querySelector(".btn-resetar").addEventListener("click", resetar);

// Carregar os valores iniciais ao carregar a página
carregarValoresIniciais();

// Inicializa o gráfico ao carregar a página
document.addEventListener("DOMContentLoaded", atualizarGrafico);
