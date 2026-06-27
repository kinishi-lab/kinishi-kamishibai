/* =========================================================
   きにしぃ。とスピうさ。の紙芝居図書館 — script.js

   ▼ あとから編集する場所は、おもにこの上半分です。
     1) LINKS …… Threads / note などのURL
     2) episodes …… 紙芝居のデータ（話を増やすときはここに追加）
   下半分の「表示のしくみ」は、ふだん触らなくて大丈夫です。
   ========================================================= */


/* ---------------------------------------------------------
   1) 外部リンク（URLはここを書き換えるだけ）
   --------------------------------------------------------- */
const LINKS = {
  threads: "#",   // 例: "https://www.threads.net/@your_account"
  note:    "#",   // 例: "https://note.com/your_account"
  guide:   "#"    // AIジャーナリング案内（公開したらURLを入れる）
};


/* ---------------------------------------------------------
   2) 紙芝居のデータ
      ・話を増やすときは、この配列に { ... } を追加します。
      ・画像は episodes/ep2/ のように「話ごとのフォルダ」を作って入れ、
        パスを episodes/ep2/slide-1.png のように書きます。
      ・サムネイルは episodes/ep2/thumb.png のように同じフォルダに。
      ・slides の image がまだ無くても、自動で「準備中」表示になります。
   --------------------------------------------------------- */
const episodes = [
  {
    id: 1,
    number: "第1話",
    title: "楽しめないんじゃない。順番が逆だった。",
    description: "好きで始めたことが苦しくなったとき、努力を増やす前に、自分が安心できる順番を見直した話。",
    thumbnail: "episodes/ep1/thumb.png",
    upcoming: false,
    slides: [
      {
        number: "1/7",
        image: "episodes/ep1/slide-1.png",
        text: "好きで始めたはずなのに…。\nなんでだろう…？\n\nいつの間にか\n苦しくなってきちゃったかも…。"
      },
      {
        number: "2/7",
        image: "episodes/ep1/slide-2.png",
        text: "きにしぃ\n「ちゃんとやらな」\n「結果を出さな」\n「続けな」\n\nそんな言葉ばかりが\n前に並んでた。\n\n気づいたら、\n「楽しむ」はいちばん後ろ。"
      },
      {
        number: "3/7",
        image: "episodes/ep1/slide-3.png",
        text: "スピうさ。\n「順番、逆になってへん？」\n\n結果を求める\n↓\nちゃんとやる\n↓\n楽しめたら楽しむ\n\nじゃなくて……"
      },
      {
        number: "4/7",
        image: "episodes/ep1/slide-4.png",
        text: "楽しむ\n↓\n自然と続く\n↓\n誰かに伝わる\n↓\n一緒に楽しむ人が増える\n↓\n結果がついてくる"
      },
      {
        number: "5/7",
        image: "episodes/ep1/slide-5.png",
        text: "きにしぃ\n「楽しめないんやなくて、\nちゃんとやらなの奥にある\n自分の気持ちを…\n見ないまま\n気持ち、おいてけぼりにして\n進んでたんかも」\n\n最優先は、\n自分の心の安心。\n\nそして、\n自分が楽しんじゃうこと。\n\nここだけは、\n置き去りにしないようにしたい。"
      },
      {
        number: "6/7",
        image: "episodes/ep1/slide-6.png",
        text: "そのことに気づけたのは、\nAIジャーナリングを始めたからかも…\n\n自分の中にあるモヤモヤを\n言葉にしていたから。\n\nAIジャーナリングは、\n正解を求めるものじゃない。\n自分自身の安心を、\n一緒に探す相棒。"
      },
      {
        number: "7/7",
        image: "episodes/ep1/slide-7.png",
        text: "あなたが今、\n「ちゃんとやらなきゃ」って\n思っていること。\n\nそこに少しだけ、\n「楽しんでみる」を\n先頭に置いてみませんか？\n\n正解よりも、\nあなたが安心できる順番を。"
      }
    ]
  }

  /* ── 第2話を追加するときの例（コメントを外して使えます）──
  ,{
    id: 2,
    number: "第2話",
    title: "ここにタイトルを書く",
    description: "短い説明をここに書く。",
    thumbnail: "ep2-thumb.png",
    upcoming: false,
    slides: [
      { number: "1/5", image: "episodes/ep1/slide-1.png", text: "..." },
      { number: "2/5", image: "episodes/ep1/slide-2.png", text: "..." }
    ]
  }
  */
];


/* =========================================================
   ここから下は「表示のしくみ」です（ふだんは編集不要）
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  applyExternalLinks();
  renderEpisodeList();
  setupReader();
});


/* ---------- 外部リンクのURLを反映 ---------- */
function applyExternalLinks() {
  document.querySelectorAll("[data-link]").forEach((el) => {
    const key = el.dataset.link;
    const url = LINKS[key];
    if (url && url !== "#") {
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
  });
}


/* ---------- 紙芝居一覧（カード）を生成 ---------- */
function renderEpisodeList() {
  const grid = document.getElementById("episode-grid");
  if (!grid) return;
  grid.innerHTML = "";

  episodes.forEach((ep) => {
    const sceneCount = ep.slides ? ep.slides.length : 0;

    const card = document.createElement("article");
    card.className = "episode-card stack" + (ep.upcoming ? " episode-card--upcoming" : "");

    const thumb = ep.upcoming
      ? `<div class="episode-card__thumb-placeholder">準備中</div>`
      : `<div class="episode-card__thumb">
           <img src="${ep.thumbnail}" alt="${escapeHtml(ep.number)}「${escapeHtml(ep.title)}」のサムネイル"
                onerror="this.closest('.episode-card__thumb').classList.add('is-empty'); this.style.display='none';" />
         </div>`;

    const action = ep.upcoming
      ? `<span class="episode-card__count">もうすぐ公開</span>`
      : `<span class="episode-card__count">全${sceneCount}場面</span>
         <button class="btn btn--primary" type="button" data-open="${ep.id}">紙芝居を読む</button>`;

    card.innerHTML = `
      ${thumb}
      <div class="episode-card__body">
        <span class="episode-card__no">${escapeHtml(ep.number)}</span>
        <h3 class="episode-card__title">${escapeHtml(ep.title)}</h3>
        <p class="episode-card__desc">${escapeHtml(ep.description)}</p>
        <div class="episode-card__meta">${action}</div>
      </div>
    `;
    grid.appendChild(card);
  });

  // 「紙芝居を読む」ボタン
  grid.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.open);
      openReader(id);
    });
  });
}


/* ---------- 紙芝居ビューア ---------- */
const reader = {
  section:  null,
  episode:  null,
  index:    0,
  el: {}
};

function setupReader() {
  reader.section = document.getElementById("reader");
  reader.el = {
    episode: document.getElementById("reader-episode"),
    title:   document.getElementById("reader-title"),
    scene:   document.getElementById("reader-scene"),
    imageWrap: document.querySelector(".reader__image-wrap"),
    image:   document.getElementById("reader-image"),
    text:    document.getElementById("reader-text"),
    counter: document.getElementById("reader-counter"),
    prev:    document.getElementById("reader-prev"),
    next:    document.getElementById("reader-next"),
    dots:    document.getElementById("reader-dots")
  };

  reader.el.prev.addEventListener("click", () => goTo(reader.index - 1));
  reader.el.next.addEventListener("click", () => goTo(reader.index + 1));

  // キーボード操作（← →）— ビューアが開いているときだけ
  document.addEventListener("keydown", (e) => {
    if (reader.section.hidden) return;
    if (e.key === "ArrowLeft")  { goTo(reader.index - 1); }
    if (e.key === "ArrowRight") { goTo(reader.index + 1); }
  });
}

function openReader(id) {
  const ep = episodes.find((e) => e.id === id);
  if (!ep || !ep.slides || ep.slides.length === 0) return;

  reader.episode = ep;
  reader.index = 0;

  reader.el.episode.textContent = ep.number;
  reader.el.title.textContent = ep.title;
  buildDots(ep.slides.length);

  reader.section.hidden = false;
  showScene(0, true);

  // ビューアの位置までやさしく移動
  reader.section.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

function buildDots(count) {
  reader.el.dots.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "reader__dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `${i + 1}場面目へ`);
    dot.addEventListener("click", () => goTo(i));
    reader.el.dots.appendChild(dot);
  }
}

function goTo(i) {
  const slides = reader.episode.slides;
  if (i < 0 || i >= slides.length) return;
  showScene(i, false);
}

/* 場面を表示（紙芝居をめくるような控えめなフェード） */
function showScene(i, immediate) {
  const slides = reader.episode.slides;
  reader.index = i;

  const render = () => {
    const slide = slides[i];

    // 画像（無い場合はプレースホルダー）
    const wrap = reader.el.imageWrap;
    const img = reader.el.image;
    wrap.classList.remove("is-placeholder");
    wrap.querySelector(".reader__placeholder")?.remove();
    img.style.display = "";
    img.alt = `${reader.episode.number} ${slide.number} の挿絵`;
    img.onerror = () => showImagePlaceholder(slide.number);
    img.src = slide.image;

    // 本文
    reader.el.text.textContent = slide.text;

    // カウンタ・ボタン・ドット
    reader.el.counter.textContent = `${i + 1} / ${slides.length}`;
    reader.el.prev.disabled = (i === 0);
    reader.el.next.disabled = (i === slides.length - 1);
    updateDots(i);

    // フェードイン
    reader.el.scene.classList.remove("is-fading");
  };

  if (immediate || prefersReducedMotion()) {
    render();
  } else {
    reader.el.scene.classList.add("is-fading"); // フェードアウト
    window.setTimeout(render, 260);
  }
}

function showImagePlaceholder(number) {
  const wrap = reader.el.imageWrap;
  reader.el.image.style.display = "none";
  reader.el.image.onerror = null;
  if (!wrap.querySelector(".reader__placeholder")) {
    const ph = document.createElement("div");
    ph.className = "reader__placeholder";
    ph.innerHTML = `<span class="reader__placeholder-no">${escapeHtml(number)}</span>イラスト準備中`;
    wrap.appendChild(ph);
  }
  wrap.classList.add("is-placeholder");
}

function updateDots(i) {
  const dots = reader.el.dots.querySelectorAll(".reader__dot");
  dots.forEach((d, idx) => d.setAttribute("aria-selected", idx === i ? "true" : "false"));
}


/* ---------- 小さな道具 ---------- */
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
