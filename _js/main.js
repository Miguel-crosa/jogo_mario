// CONSTANTES PARA PUXAR DO HTML
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const sol = document.querySelector('.sol');
const cloud = document.querySelector('.clouds');
const coin = document.querySelector('.coin');
const gameBoard = document.querySelector('.game-board');
const titulo = document.querySelector(".menu-title");
const marioPlacar = document.querySelector('.marioS');
const texto = document.querySelector('.texto');
const textoVida = document.querySelector(".textoVida");
const audioPulo = document.getElementById('audioPulo');
const placar = document.getElementById('placar');
const audioFundo = document.getElementById('musicaFundo');
const audioPersonagem = document.getElementById('audioPersonagem');
const audioMoeda = document.getElementById("audioMoeda");
const audioVida = document.getElementById("audioVida");
const menuInicial = document.querySelector('.telaInicial');
const botaoPersonagem = document.getElementById('personagem');
const botaoIniciar = document.getElementById('iniciar');

// VARIAVEIS CRIADAS PARA VIDA, PLACAR, ETC.
let vidas = 3;
let moedasPegas = 0;
let segredo = 0;
let numeroPlacar = 0;
let loop;
let jogoRodando = false;


// SISTEMA DE VIDAS FEITO SOMENTE POR JAVASCRIPT.

const vidasDisplay = document.createElement('div');
vidasDisplay.id = 'vidasDisplay';
vidasDisplay.style.position = 'fixed';
vidasDisplay.style.top = '10px';
vidasDisplay.style.left = '10px';
vidasDisplay.style.fontSize = '18px';
vidasDisplay.style.fontFamily = 'monospace';
vidasDisplay.style.color = 'red';
vidasDisplay.style.zIndex = '999';
vidasDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
vidasDisplay.style.padding = '6px 12px';
vidasDisplay.style.borderRadius = '8px';
document.body.appendChild(vidasDisplay);

// FUNÇÕES

function atualizarVidas() {
    // REPEAT SERVE PARA REPETIR O CORAÇÃO COM BASE NA QUANTIDADE DE VIDAS, COMEÇO = 3;
    vidasDisplay.innerHTML = 'Vidas: ' + '❤️'.repeat(vidas);
}

function trocaPersonagem() {
    mario.src = './_media/luigi.webp';
    mario.style.width = '150px';
    botaoPersonagem.style.color = 'gray';
    botaoPersonagem.style.cursor = 'not-allowed';

    segredo += 1;

    if (segredo == 5) {
        mario.src = './_imagens/marioSegredo.png';
        mario.style.width = '150px';
        audioPersonagem.src = './_media/mudarPersonagem.mp3';
        audioPersonagem.volume = 0.2;
        audioPersonagem.play();
        botaoPersonagem.disabled = true;
        botaoPersonagem.style.cursor = 'not-allowed';
        botaoPersonagem.removeEventListener('click', trocaPersonagem);
    }
}

// REMOVER TODAS AS ANIMAÇÕES ANTES DE COMEÇAR O JOGO DURANTE O MENU INICIAL.
pipe.style.animation = 'none';
pipe.style.right = '300px';
mario.style.width = '150px';
cloud.style.animation = 'none';
coin.style.animation = 'none';
coin.style.right = '100px';
sol.style.animation = 'none';
placar.style.visibility = 'hidden';
marioPlacar.style.visibility = 'hidden';

function jump() {

    // FEITO PARA NÃO CONSEGUIR PULAR DURANTE O 'MENU INICIAL'
    if (!jogoRodando) return;

    mario.classList.add('jump');

    if (segredo >= 5) {
        //som do pou kkkkkk
        audioPulo.src = './_media/pou.mp3';
        audioPulo.volume = 1;
        audioPulo.play();
    } else {
        //som normal do jogo
        audioPulo.src = './_media/jump.mp3';
        audioPulo.volume = 0.1;
        audioPulo.play();
    }

    setTimeout(() => mario.classList.remove('jump'), 500);
}

function jogo() {

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    const coinPosition = coin.offsetLeft;

    numeroPlacar++;

    if (numeroPlacar >= 100 && sol.style.backgroundColor !== 'white') {

        // SISTEMA DE 'DIFICULDADE'
        clearInterval(loop);
        jogoRodando = false;

        sol.style.backgroundColor = 'white';
        sol.style.borderColor = 'black';
        gameBoard.style.background = '#1a1746ff';
        placar.style.color = 'White';
        cloud.src = './_media/estrela.gif';
        cloud.style.width = '75px';
        texto.style.color = 'white';
        textoVida.style.color = 'white';

        pipe.style.animation = 'none';
        setTimeout(() => {
            pipe.style.animation = 'pipe-animation 1.5s infinite linear';
            jogoRodando = true;
            loop = setInterval(jogo, 50);
        }, 50);

    }

    placar.innerHTML = `${numeroPlacar}`;

    if (coinPosition <= 120 && coinPosition > 0 && marioPosition < 24) {
        // SISTEMA DE PONTOS EXTRAS
        audioMoeda.src = './_media/somMoeda.mp3';
        audioMoeda.volume = 0.25;
        audioMoeda.play();

        clearInterval(loop);
        moedasPegas += 1;
        numeroPlacar += 20;
        texto.style.visibility = 'visible';

        setTimeout(() => {
            loop = setInterval(jogo, 50);
            texto.style.visibility = 'hidden';
        }, 500);

        if (moedasPegas >= 10) {
            vidas += 1;
            textoVida.style.visibility = 'visible';

            setTimeout(() => {
                textoVida.style.visibility = 'hidden';
            }, 1000);

            moedasPegas = 0;
            audioVida.src = './_media/somVida.mp3';
            audioVida.volume = 0.2;
            audioVida.play();
            atualizarVidas();
        }
    }

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 24) {

        // SISTEMA DE REMOVER VIDAS / ENCERRAR O JOGO 

        vidas--;
        atualizarVidas();

        if (vidas > 0) {
            clearInterval(loop);
            jogoRodando = false;

            pipe.style.animation = 'none';
            setTimeout(() => {


                if (numeroPlacar >= 100) {
                    pipe.style.animation = 'pipe-animation 1.5s infinite linear';
                    jogoRodando = true;
                    loop = setInterval(jogo, 50);
                }

                else {
                    pipe.style.animation = 'pipe-animation 3s infinite linear';
                    jogoRodando = true;
                    loop = setInterval(jogo, 50);
                }

            }, 800);
        } else {
            jogoRodando = false;
            clearInterval(loop);
            document.removeEventListener('keydown', jump);

            pipe.style.animation = 'none';
            pipe.style.left = `${pipePosition}px`;
            mario.style.animation = 'none';
            mario.style.bottom = `${marioPosition}px`;
            coin.style.animation = 'none';

            mario.src = './_imagens/game-over.png';
            mario.style.width = '75px';
            mario.style.marginLeft = '50px';

            audioFundo.src = '';

            setTimeout(() => {

                menuInicial.style.visibility = 'visible';
                vidasDisplay.style.visibility = 'hidden';
                titulo.innerText = "Você Perdeu."
                botaoPersonagem.style.visibility = 'hidden';
                botaoIniciar.innerText = "Reiniciar jogo";
                botaoIniciar.style.height = '45px';
                botaoIniciar.style.scale = '1.4';
                botaoIniciar.addEventListener('click', () => {
                    window.location.reload();
                });

            }, 1000);
        }
    }
}

function iniciar() {
    // RESETANDO ESTADO DO JOGO
    vidas = 3;
    numeroPlacar = 0;
    moedasPegas = 0;
    segredo = 0;
    atualizarVidas();
    placar.innerHTML = `0`;
    placar.style.visibility = 'visible';
    marioPlacar.style.visibility = 'visible';
    vidasDisplay.style.visibility = 'visible';

    pipe.style.animation = 'pipe-animation 3s infinite linear';
    coin.style.animation = 'coin-animation 5s infinite linear';
    cloud.style.animation = 'clouds-animation 20s infinite linear';
    sol.style.animation = 'sol-animation 30s infinite linear';

    pipe.style.right = '300px';
    mario.style.width = '150px';
    cloud.src = './_imagens/clouds.png';

    // REATIVA O EVENTO DE PULO
    document.removeEventListener('keydown', jump);
    document.addEventListener('keydown', jump);

    jogoRodando = true;
    loop = setInterval(jogo, 50);
}

botaoIniciar.addEventListener('click', () => {
    audioFundo.src = './_media/musicaFundo.mp3';
    audioFundo.volume = 0.5;
    audioFundo.play();

    menuInicial.style.visibility = 'hidden';

    setTimeout(() => {
        iniciar();
    }, 1000);
});

botaoPersonagem.addEventListener('click', trocaPersonagem);


/* 

--- CREDITOS ---

AUDIO: VITOR E RUAN.
LOGOS: PIETRA.
SPRITES: JOAO PEDRO PEREIRA.
MENU: VITOR E BIA.
BOTAO: VITOR E BIA.
CSS: MIGUEL.
JAVASCRIPT: MIGUEL.

--- ------   ---

*/
