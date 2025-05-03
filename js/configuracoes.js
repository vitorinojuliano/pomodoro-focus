document.getElementById("form-configuracoes").addEventListener("submit", (event) => {
  event.preventDefault();

  const tempoPomodoro = parseInt(document.getElementById("tempo-pomodoro").value, 10);
  const tempoPausa = parseInt(document.getElementById("tempo-pausa").value, 10);

  if (!isNaN(tempoPomodoro) && !isNaN(tempoPausa)) {
    // Salvar no localStorage
    localStorage.setItem("tempoPomodoro", tempoPomodoro);
    localStorage.setItem("tempoPausa", tempoPausa);

    alert("Configurações salvas com sucesso!");

    // Atualizar o cronômetro com os novos valores
    atualizarCronometro();
  } else {
    alert("Por favor, insira valores válidos.");
  }
});

// Função para atualizar os valores na seção de foco
function atualizarSessaoFoco() {
  const tempoPomodoro = localStorage.getItem("tempoPomodoro") || 25;
  const tempoPausa = localStorage.getItem("tempoPausa") || 5;

  // Atualizar o cronômetro com o novo tempo do Pomodoro
  const display = document.querySelector(".ponteiro");
  display.textContent = `${tempoPomodoro}:00`;

  // Atualizar outras partes da interface, se necessário
  console.log(`Tempo do Pomodoro: ${tempoPomodoro} minutos`);
  console.log(`Tempo da Pausa: ${tempoPausa} minutos`);
}

// Função para atualizar o cronômetro
function atualizarCronometro() {
  const tempoPomodoro = localStorage.getItem("tempoPomodoro") 
    ? parseInt(localStorage.getItem("tempoPomodoro"), 10) 
    : 25;

  const display = document.querySelector(".ponteiro");
  const tempo = tempoPomodoro * 60; // Tempo em segundos

  // Atualizar o display do cronômetro
  const minutos = String(Math.floor(tempo / 60)).padStart(2, "0");
  const segundos = String(tempo % 60).padStart(2, "0");
  display.textContent = `${minutos}:${segundos}`;
}