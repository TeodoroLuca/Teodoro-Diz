const cores = ['verde', 'vermelho', 'amarelo', 'azul'];
let sequencia = [];
let sequenciaJogador = [];
let nivel = 0;
let esperandoJogada = false;

const statusMensagem = document.getElementById('status');
const botaoIniciar = document.getElementById('botaoIniciar');
const botaoSair = document.getElementById('botaoSair'); // Captura o botão Sair

const botoes = {
verde: document.getElementById('verde'),
vermelho: document.getElementById('vermelho'),
amarelo: document.getElementById('amarelo'),
azul: document.getElementById('azul')
};

// Sons por cor
const sons = {
verde: new Audio('sounds/green.mp3'),
vermelho: new Audio('sounds/red.mp3'),
amarelo: new Audio('sounds/yellow.mp3'),
azul: new Audio('sounds/blue.mp3'),
erro: new Audio('sounds/wrong.mp3')
};

// Reproduz o som correspondente
function tocarSom(cor) {
const som = sons[cor];
    if (som) {
        som.currentTime = 0;
        som.play();
    }
}

// Piscar botão com som
function piscarBotao(cor) {
    return new Promise(resolve => {
        botoes[cor].classList.add('ativo');
        tocarSom(cor);
        setTimeout(() => {
        botoes[cor].classList.remove('ativo');
        setTimeout(resolve, 250);
        }, 600);
    });
}

// Mostrar a sequência atual
async function mostrarSequencia() {
    esperandoJogada = false;
    statusMensagem.textContent = `Nível ${nivel}: Observe a sequência`;
    for (let cor of sequencia) {
        await piscarBotao(cor);
    }
esperandoJogada = true;
sequenciaJogador = [];
statusMensagem.textContent = `Nível ${nivel}: Sua vez!`;
}

// Adiciona uma cor aleatória à sequência
function adicionarCorSequencia() {
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
    sequencia.push(corAleatoria);
}

// Inicia o jogo
function iniciarJogo() {
    sequencia = [];
    nivel = 0;
    statusMensagem.textContent = '';
    Object.values(botoes).forEach(botao => botao.disabled = false); // Reativa os botões
    proximoNivel();
}

// Próximo nível
function proximoNivel() {
    nivel++;
    adicionarCorSequencia();
    mostrarSequencia();
}

// Verifica jogada do jogador
function verificarJogada(cor) {
    if (!esperandoJogada) return;

sequenciaJogador.push(cor);
const indiceAtual = sequenciaJogador.length - 1;

    if (sequenciaJogador[indiceAtual] !== sequencia[indiceAtual]) {
        fimDeJogo();
    return;
}

if (sequenciaJogador.length === sequencia.length) {
    esperandoJogada = false;
    statusMensagem.textContent = "Você acertou! Preparando próximo nível...";
    setTimeout(proximoNivel, 1000);
}
}

// Fim de jogo
function fimDeJogo() {
    tocarSom('erro');
    statusMensagem.textContent = `Fim de jogo! Você chegou ao nível ${nivel}. Clique em "Iniciar Jogo" para tentar novamente.`;
    esperandoJogada = false;
}

// Sair do jogo
function sairDoJogo() {
    esperandoJogada = false;
    statusMensagem.textContent = "Jogo encerrado. Obrigado por jogar!";
    Object.values(botoes).forEach(botao => {
        botao.disabled = true;
    });
}

// Clique dos botões coloridos
cores.forEach(cor => {
botoes[cor].addEventListener('click', () => {
    if (!esperandoJogada) return;
    tocarSom(cor);
    piscarBotao(cor);
    verificarJogada(cor);
});
});

botaoIniciar.addEventListener('click', iniciarJogo);
botaoSair.addEventListener('click', sairDoJogo);
