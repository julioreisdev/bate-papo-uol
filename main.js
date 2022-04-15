function condicoesRenderizarConteudo(mensagens, mensagem) {
  if (mensagem.type === "status") {
    mensagens.innerHTML += `
          <div class="mensagem aviso">
              <p class="mensagem-corpo"><span class="horario">(${mensagem.time})</span><strong class="nome">${mensagem.from}</strong>${mensagem.text}</p>
          </div>`;
  } else if (mensagem.type === "message") {
    mensagens.innerHTML += `
          <div class="mensagem">
              <p class="mensagem-corpo"><span class="horario">(${mensagem.time})</span><strong class="nome">${mensagem.from}</strong> para <strong class="destinatario">${mensagem.to}: </strong><span class="texto">${mensagem.text}</span></p>
          </div>`;
  } else if (mensagem.type === "private_message") {
    mensagens.innerHTML += `
          <div class="mensagem privado">
              <p class="mensagem-corpo"><span class="horario">(${mensagem.time})</span><strong class="nome">${mensagem.from}</strong> para <strong class="destinatario">${mensagem.to}: </strong><span class="texto">${mensagem.text}</span></p>
          </div>`;
  }
}

function scrollBottom() {
  let mensagens = document.querySelectorAll('.mensagem');
  mensagens[mensagens.length - 1].scrollIntoView();
}

function renderizaMensagens(response) {
  let mensagens = document.querySelector(".mensagens");
  for (let i = 0; i < response.data.length; i++) {
    let mensagem = response.data[i];
    condicoesRenderizarConteudo(mensagens, mensagem)
  }
  scrollBottom();
}

function renderizaUltimaMensagem(response) {
  let mensagens = document.querySelector(".mensagens");
  let mensagem = response.data[99]
  condicoesRenderizarConteudo(mensagens, mensagem);
  scrollBottom();
}

function pegarMensagens() {
  let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  promise.then(renderizaMensagens);

  setInterval(function() {
    promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(renderizaUltimaMensagem);
  }, 3000);
}

pegarMensagens();