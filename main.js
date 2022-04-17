let usuario = {
  name: "",
};

let ultimaMensagem;

function entrarNaSala() {
  usuario.name = document.querySelector(".tela-entrar form input").value;

  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    usuario
  );

  promise.then(function (response) {
    let login = document.querySelector(".tela-entrar");
    let form = document.querySelector(".tela-entrar form");
    let loading = document.querySelector(".loading");

    loading.classList.remove("none");
    form.classList.add("none");

    setTimeout(function () {
      login.classList.add("none");
      manterConexao();
      pegarMensagens();
    }, 2000);
  });

  promise.catch(function (error) {
    if (error.response.status === 400) {
      let input = document.querySelector(".tela-entrar form input");
      input.value = "";
      input.focus();
      input.setAttribute('placeholder', `${usuario.name} já está em uso`)
    }
  });
}

function manterConexao() {
  setInterval(function () {
    let promise = axios.post(
      "https://mock-api.driven.com.br/api/v6/uol/status",
      usuario
    );
  }, 5000);
}

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
  } else if (
    mensagem.type === "private_message" &&
    mensagem.to === usuario.name
  ) {
    mensagens.innerHTML += `
          <div class="mensagem privado">
              <p class="mensagem-corpo"><span class="horario">(${mensagem.time})</span><strong class="nome">${mensagem.from}</strong> para <strong class="destinatario">${mensagem.to}: </strong><span class="texto">${mensagem.text}</span></p>
          </div>`;
  }
}

function scrollBottom() {
  let mensagens = document.querySelectorAll(".mensagem");
  mensagens[mensagens.length - 1].scrollIntoView();
}

function renderizaMensagens(response) {
  let mensagens = document.querySelector(".mensagens");
  for (let i = 0; i < response.data.length; i++) {
    let mensagem = response.data[i];
    condicoesRenderizarConteudo(mensagens, mensagem);
  }
  scrollBottom();
  ultimaMensagem = response.data[99];
}

function comparaMensagens(m1, m2) {
  if (
    m1.from === m2.from &&
    m1.to === m2.to &&
    m1.text === m2.text &&
    m1.type === m2.type &&
    m1.time === m2.time
  ) {
    return true;
  }
  return false;
}

function renderizaUltimaMensagem(response) {
  if (!comparaMensagens(response.data[99], ultimaMensagem)) {
    let mensagens = document.querySelector(".mensagens");
    let mensagem = response.data[99];
    condicoesRenderizarConteudo(mensagens, mensagem);
  }
  ultimaMensagem = response.data[99];
  scrollBottom();
}

function pegarMensagens() {
  let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  promise.then(renderizaMensagens);

  setInterval(function () {
    promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(renderizaUltimaMensagem);
  }, 3000);
  /* Achei que com 3s o chat fica desatualizado*/
}

function enviarMensagem() {
  let texto = document.querySelector(".enviar-mensagem input");

  let mensagem = {
    from: usuario.name,
    to: "Todos",
    text: texto.value,
    type: "message",
  };

  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    mensagem
  );

  promise.then(function (response) {
    pegarMensagens();
  });

  promise.catch(function (error) {
    window.location.reload();
  });

  texto.value = "";
  texto.focus();
}
