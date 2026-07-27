const STORAGE_KEY = "iberia-srs-v1";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function ensureCard(progress, id) {
  if (!progress[id]) {
    progress[id] = { ease: 2.3, interval: 0, due: todayKey(), reps: 0, lapses: 0 };
  }
  return progress[id];
}

function schedule(card, grade) {
  // grade: 0 again, 1 hard, 2 good, 3 easy
  const today = todayKey();
  if (grade === 0) {
    card.reps = 0;
    card.lapses += 1;
    card.interval = 0;
    card.due = today;
    card.ease = Math.max(1.3, card.ease - 0.2);
    return;
  }
  if (card.reps === 0) card.interval = grade === 1 ? 0 : 1;
  else if (card.reps === 1) card.interval = grade === 1 ? 1 : 3;
  else {
    const mult = grade === 1 ? 1.2 : grade === 2 ? card.ease : card.ease + 0.15;
    card.interval = Math.max(1, Math.round(card.interval * mult));
  }
  if (grade === 3) card.ease += 0.05;
  if (grade === 1) card.ease = Math.max(1.3, card.ease - 0.05);
  card.reps += 1;
  const due = new Date();
  due.setDate(due.getDate() + (card.interval === 0 ? 0 : card.interval));
  card.due = due.toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function createFlashcards({ data, root, onExit }) {
  const progress = loadProgress();
  const state = {
    queue: [],
    index: 0,
    flipped: false,
    direction: "es-zh", // es-zh | zh-es
    done: 0,
    sessionTotal: 0,
  };

  function buildQueue(limit = 20) {
    const today = todayKey();
    const due = [];
    const later = [];
    for (const word of data.words) {
      const card = ensureCard(progress, word.id);
      if (card.due <= today) due.push(word);
      else later.push(word);
    }
    const pool = [...due, ...later].slice(0, limit);
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    state.queue = pool;
    state.index = 0;
    state.flipped = false;
    state.done = 0;
    state.sessionTotal = pool.length;
  }

  function current() {
    return state.queue[state.index];
  }

  function stats() {
    const today = todayKey();
    let due = 0;
    let learned = 0;
    for (const word of data.words) {
      const card = ensureCard(progress, word.id);
      if (card.due <= today) due += 1;
      if (card.reps >= 2) learned += 1;
    }
    return { due, learned, total: data.words.length };
  }

  function grade(g) {
    const word = current();
    if (!word) return;
    const card = ensureCard(progress, word.id);
    schedule(card, g);
    saveProgress(progress);
    state.done += 1;
    if (state.index >= state.queue.length - 1) {
      state.index = state.queue.length;
      render();
      return;
    }
    state.index += 1;
    state.flipped = false;
    render();
  }

  function renderCard() {
    if (state.index >= state.queue.length) {
      const s = stats();
      return `
        <section class="scoreboard">
          <p class="hint">${escapeHtml(data.title)}</p>
          <p class="big">本轮完成</p>
          <p>已学约 ${s.learned}/${s.total} · 今日待复习 ${s.due}</p>
          <div class="actions" style="justify-content:center;margin-top:1rem">
            <button class="btn btn-primary" data-action="again">再来一组</button>
            <button class="btn btn-secondary" data-action="exit">返回选级</button>
          </div>
        </section>
      `;
    }

    const word = current();
    const front = state.direction === "es-zh" ? word.es : word.zh;
    const backMain = state.direction === "es-zh" ? word.zh : word.es;
    const pct = (state.done / Math.max(1, state.sessionTotal)) * 100;

    return `
      <section class="quiz">
        <div class="quiz-meta">
          <span>${state.done + 1} / ${state.sessionTotal}</span>
          <span>${state.direction === "es-zh" ? "西 → 中" : "中 → 西"}</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <button class="flash-card ${state.flipped ? "flipped" : ""}" data-action="flip" type="button">
          <div class="flash-face front">
            <p class="flash-label">${state.flipped ? "释义" : "请回忆"}</p>
            <p class="flash-word">${escapeHtml(state.flipped ? backMain : front)}</p>
            ${state.flipped ? `<p class="flash-pos">${escapeHtml(word.pos || "")}</p>` : ""}
          </div>
          ${
            state.flipped
              ? `<div class="flash-extra">
                  <p><strong>${escapeHtml(word.es)}</strong> · ${escapeHtml(word.zh)}</p>
                  <p class="entry-example">${escapeHtml(word.example_es || "")}</p>
                  <p class="entry-example">${escapeHtml(word.example_zh || "")}</p>
                </div>`
              : `<p class="hint">点击卡片显示答案</p>`
          }
        </button>
        ${
          state.flipped
            ? `<div class="grade-row">
                <button class="btn grade again" data-grade="0">忘记</button>
                <button class="btn grade hard" data-grade="1">困难</button>
                <button class="btn grade good" data-grade="2">认识</button>
                <button class="btn grade easy" data-grade="3">简单</button>
              </div>`
            : ""
        }
      </section>
    `;
  }

  function render() {
    const s = stats();
    root.innerHTML = `
      <div class="page-head">
        <h1>${escapeHtml(data.title)}</h1>
        <p>间隔复习：根据你的反馈安排下次出现时间。词库 ${s.total} 词 · 今日待复习 ${s.due} · 已较熟 ${s.learned}</p>
      </div>
      <div class="toolbar">
        <div class="segmented">
          <button type="button" data-dir="es-zh" class="${state.direction === "es-zh" ? "active" : ""}">西→中</button>
          <button type="button" data-dir="zh-es" class="${state.direction === "zh-es" ? "active" : ""}">中→西</button>
        </div>
        <button class="btn btn-secondary" data-action="exit">换词库</button>
      </div>
      ${renderCard()}
    `;
  }

  root.onclick = (e) => {
    const dir = e.target.closest("[data-dir]")?.dataset.dir;
    if (dir) {
      state.direction = dir;
      state.flipped = false;
      render();
      return;
    }
    const gradeBtn = e.target.closest("[data-grade]");
    if (gradeBtn) {
      grade(Number(gradeBtn.dataset.grade));
      return;
    }
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (action === "flip") {
      state.flipped = !state.flipped;
      render();
    }
    if (action === "again") {
      buildQueue();
      render();
    }
    if (action === "exit") onExit?.();
  };

  buildQueue();
  render();
  return {
    destroy() {
      root.onclick = null;
    },
  };
}
