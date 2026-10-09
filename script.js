// ============================================
// 🌸 Jogo da Memória - Hello Kitty 🌸
// Coloque este script no final do <body>
// ============================================

(function () {
  "use strict";

  // --- CRIAR CONTAINER ---
  const container = document.createElement("div");
  container.id = "jogo-memoria-hk";
  container.innerHTML = `
    <style>
      #jogo-memoria-hk {
        font-family: 'Comic Sans MS', 'Chalkboard SE', cursive, sans-serif;
        background: linear-gradient(135deg, #fff5f5 0%, #fff9e6 50%, #fff0f5 100%);
        border: 4px dashed #ffb6c1;
        border-radius: 24px;
        padding: 24px;
        max-width: 520px;
        margin: 20px auto;
        box-shadow: 0 8px 32px rgba(255, 182, 193, 0.3);
        position: relative;
        overflow: hidden;
      }
      #jogo-memoria-hk::before {
        content: "🌸";
        position: absolute;
        top: 8px;
        left: 12px;
        font-size: 22px;
        opacity: 0.5;
      }
      #jogo-memoria-hk::after {
        content: "🌼";
        position: absolute;
        top: 8px;
        right: 12px;
        font-size: 22px;
        opacity: 0.5;
      }

      .hk-title {
        text-align: center;
        font-size: 1.6em;
        color: #e88ca5;
        margin-bottom: 4px;
        text-shadow: 1px 1px 0 #ffe4ec;
      }
      .hk-subtitle {
        text-align: center;
        font-size: 0.95em;
        color: #d4a574;
        margin-bottom: 16px;
      }
      .hk-stats {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 16px;
        font-size: 0.95em;
        color: #b07a8f;
      }
      .hk-stats span {
        background: #fff0f5;
        padding: 4px 14px;
        border-radius: 12px;
        border: 2px solid #ffd6e0;
      }

      .hk-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        max-width: 420px;
        margin: 0 auto;
      }

      .hk-card {
        aspect-ratio: 1;
        perspective: 600px;
        cursor: pointer;
      }
      .hk-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.5s ease;
        transform-style: preserve-3d;
      }
      .hk-card.flipped .hk-card-inner {
        transform: rotateY(180deg);
      }
      .hk-card.matched .hk-card-inner {
        transform: rotateY(180deg);
        animation: hk-pop 0.4s ease;
      }

      @keyframes hk-pop {
        0% { transform: rotateY(180deg) scale(1); }
        50% { transform: rotateY(180deg) scale(1.12); }
        100% { transform: rotateY(180deg) scale(1); }
      }

      .hk-card-face {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2em;
      }
      .hk-card-back {
        background: linear-gradient(145deg, #ffd6e0, #ffe4ec);
        border: 3px solid #ffb6c1;
        box-shadow: inset 0 0 12px rgba(255, 182, 193, 0.3);
      }
      .hk-card-back::after {
        content: "🎀";
        font-size: 1.4em;
        opacity: 0.7;
      }
      .hk-card-front {
        background: linear-gradient(145deg, #fff9e6, #fff5f5);
        border: 3px solid #ffe4a0;
        transform: rotateY(180deg);
        box-shadow: inset 0 0 12px rgba(255, 228, 160, 0.3);
      }

      .hk-btn {
        display: block;
        margin: 18px auto 0;
        padding: 10px 28px;
        font-family: inherit;
        font-size: 1em;
        color: #fff;
        background: linear-gradient(135deg, #ffb6c1, #ff8fab);
        border: none;
        border-radius: 20px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(255, 143, 171, 0.3);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .hk-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(255, 143, 171, 0.4);
      }
      .hk-btn:active {
        transform: translateY(0);
      }

      .hk-win-msg {
        text-align: center;
        font-size: 1.2em;
        color: #e88ca5;
        margin-top: 14px;
        display: none;
        animation: hk-bounce 0.6s ease;
      }
      @keyframes hk-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }

      /* Confete simples */
      .hk-confetti {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        pointer-events: none;
        animation: hk-fall 2s ease forwards;
      }
      @keyframes hk-fall {
        0% { opacity: 1; transform: translateY(0) rotate(0deg); }
        100% { opacity: 0; transform: translateY(300px) rotate(720deg); }
      }

      @media (max-width: 400px) {
        #jogo-memoria-hk { padding: 16px; }
        .hk-grid { gap: 7px; }
        .hk-card-face { font-size: 1.5em; }
      }
    </style>

    <div class="hk-title">🐱 Jogo da Memória 🌸</div>
    <div class="hk-subtitle">~ Hello Kitty Edition ~</div>
    <div class="hk-stats">
      <span>🎯 Jogadas: <b id="hk-moves">0</b></span>
      <span>🌼 Pares: <b id="hk-pairs">0</b>/6</span>
    </div>
    <div class="hk-grid" id="hk-grid"></div>
    <button class="hk-btn" id="hk-restart">🌷 Jogar de Novo</button>
    <div class="hk-win-msg" id="hk-win">🎀 Parabéns! Você encontrou tudo! 🎀</div>
  `;

  // Inserir na página
  document.body.appendChild(container);

  // --- LÓGICA DO JOGO ---
  const emojis = ["🌸", "🌼", "🌷", "🇧🇷", "🎀", "🐱"];
  const grid = container.querySelector("#hk-grid");
  const movesEl = container.querySelector("#hk-moves");
  const pairsEl = container.querySelector("#hk-pairs");
  const winMsg = container.querySelector("#hk-win");
  const restartBtn = container.querySelector("#hk-restart");

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let pairsFound = 0;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function createBoard() {
    grid.innerHTML = "";
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    pairsFound = 0;
    movesEl.textContent = "0";
    pairsEl.textContent = "0";
    winMsg.style.display = "none";

    const cards = shuffle([...emojis, ...emojis]);

    cards.forEach((emoji) => {
      const card = document.createElement("div");
      card.className = "hk-card";
      card.dataset.emoji = emoji;
      card.innerHTML = `
        <div class="hk-card-inner">
          <div class="hk-card-face hk-card-back"></div>
          <div class="hk-card-face hk-card-front">${emoji}</div>
        </div>
      `;
      card.addEventListener("click", onCardClick);
      grid.appendChild(card);
    });
  }

  function onCardClick(e) {
    const card = e.currentTarget;

    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains("matched")) return;

    card.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    moves++;
    movesEl.textContent = moves;
    lockBoard = true;

    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      firstCard = secondCard = null;
      lockBoard = false;
      pairsFound++;
      pairsEl.textContent = pairsFound;

      if (pairsFound === emojis.length) {
        setTimeout(showWin, 500);
      }
    } else {
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        firstCard = secondCard = null;
        lockBoard = false;
      }, 900);
    }
  }

  function showWin() {
    winMsg.style.display = "block";
    // Confete
    const colors = ["#ffb6c1", "#ffe4a0", "#fff0f5", "#ffd6e0", "#fff9e6", "#ff8fab"];
    for (let i = 0; i < 30; i++) {
      const c = document.createElement("div");
      c.className = "hk-confetti";
      c.style.left = Math.random() * 100 + "%";
      c.style.top = "-10px";
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDelay = Math.random() * 1 + "s";
      container.appendChild(c);
      setTimeout(() => c.remove(), 3000);
    }
  }

  restartBtn.addEventListener("click", createBoard);

  // Iniciar
  createBoard();
})();2