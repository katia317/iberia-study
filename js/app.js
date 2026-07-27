import {
  searchDictionary,
  renderEntry,
  analyzeQuery,
  buildHeadIndex,
  conjugateEs,
  conjugatePt,
  renderConjugationEs,
  renderConjugationPt,
} from "./dictionary.js";
import { createDeleController } from "./dele.js";
import { createFlashcards } from "./flashcards.js";

const app = document.getElementById("app");
const navLinks = document.querySelectorAll(".nav a");

const cache = {
  zhEs: null,
  zhPt: null,
  mdxEs: null,
  mdxPt: null,
  deleB2: null,
  deleC1: null,
  vocabB2: null,
  vocabC1: null,
  vocabC2: null,
};

let deleController = null;
let flashController = null;

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`无法加载 ${path}`);
  return res.json();
}

async function getDict(lang, source) {
  if (source === "full") {
    if (lang === "es") {
      cache.mdxEs ??= await loadJson("data/mdx-zh-es.json");
      return cache.mdxEs;
    }
    cache.mdxPt ??= await loadJson("data/mdx-pt-zh.json");
    return cache.mdxPt;
  }
  if (lang === "es") {
    cache.zhEs ??= await loadJson("data/dictionary-zh-es.json");
    return cache.zhEs;
  }
  cache.zhPt ??= await loadJson("data/dictionary-zh-pt.json");
  return cache.zhPt;
}

async function getDele(level) {
  if (level === "B2") {
    cache.deleB2 ??= await loadJson("data/dele-b2.json");
    return cache.deleB2;
  }
  cache.deleC1 ??= await loadJson("data/dele-c1.json");
  return cache.deleC1;
}

async function getVocab(level) {
  if (level === "B2") {
    cache.vocabB2 ??= await loadJson("data/vocab-b2.json");
    return cache.vocabB2;
  }
  if (level === "C1") {
    cache.vocabC1 ??= await loadJson("data/vocab-c1.json");
    return cache.vocabC1;
  }
  cache.vocabC2 ??= await loadJson("data/vocab-c2.json");
  return cache.vocabC2;
}

function setActiveNav(path) {
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const active =
      href === `#${path}` ||
      (path === "/" && href === "#/") ||
      (path.startsWith("/dict") && href === "#/dict") ||
      (path.startsWith("/vocab") && href === "#/vocab") ||
      (path.startsWith("/dele") && href === "#/dele");
    link.classList.toggle("active", active);
  });
}

function destroyControllers() {
  if (deleController) {
    deleController.destroy();
    deleController = null;
  }
  if (flashController) {
    flashController.destroy();
    flashController = null;
  }
}

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <p class="hero-brand">Iberia</p>
      <h2>查词、背单词、练 DELE</h2>
      <p>完整中西 / 葡汉词典可检索；按 B2 / C1 / C2 背单词；配套 DELE 例题。</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="#/dict" data-link>搜索生词</a>
        <a class="btn btn-secondary" href="#/vocab" data-link>背单词</a>
        <a class="btn btn-secondary" href="#/dele" data-link>DELE 例题</a>
      </div>
    </section>
    <section class="panel">
      <div class="feature-grid">
        <article class="feature">
          <h3>完整词典</h3>
          <p>已导入简明西汉汉西词典与红葡汉词典，支持本地全文检索。</p>
        </article>
        <article class="feature">
          <h3>分级背单词</h3>
          <p>DELE B2 / C1 / C2 词库 + 间隔复习，记住难易反馈。</p>
        </article>
        <article class="feature">
          <h3>DELE 例题</h3>
          <p>阅读、语法、写作与口语提示，适合考前刷题。</p>
        </article>
      </div>
    </section>
  `;
}

function renderDictShell() {
  app.innerHTML = `
    <div class="page-head">
      <h1>词典</h1>
      <p>自动识别阴阳性与单复数；输入变位形式（如 habló / falou）可回到不定式并显示变位表。</p>
    </div>
    <div class="toolbar">
      <div class="segmented" id="dict-lang">
        <button type="button" data-lang="es" class="active">中西</button>
        <button type="button" data-lang="pt">葡汉</button>
      </div>
      <div class="segmented" id="dict-source">
        <button type="button" data-source="full" class="active">完整词典</button>
        <button type="button" data-source="lite">精简词表</button>
      </div>
      <label class="search-box">
        <span aria-hidden="true">⌕</span>
        <input id="dict-q" type="search" placeholder="试：casas / habló / falou / 虽然…" autocomplete="off" />
      </label>
    </div>
    <div class="toolbar upload-row">
      <label class="btn btn-secondary upload-btn">
        导入 JSON 词典
        <input id="dict-upload" type="file" accept="application/json,.json" hidden />
      </label>
      <p class="hint" id="dict-hint">正在加载词库…</p>
    </div>
    <div id="dict-analysis"></div>
    <div class="results" id="dict-results"></div>
  `;
}

async function mountDictionary() {
  renderDictShell();
  let lang = "es";
  let source = "full";
  let query = "";
  let customEntries = null;
  let headIndex = null;

  const input = document.getElementById("dict-q");
  const results = document.getElementById("dict-results");
  const analysis = document.getElementById("dict-analysis");
  const hint = document.getElementById("dict-hint");
  const langBar = document.getElementById("dict-lang");
  const sourceBar = document.getElementById("dict-source");
  const upload = document.getElementById("dict-upload");

  let timer = null;

  async function refresh() {
    try {
      hint.textContent = source === "full" && !customEntries ? "完整词典较大，首次加载可能需几秒…" : "检索中…";
      const entries = customEntries || (await getDict(lang, source));
      headIndex = buildHeadIndex(entries);
      const analysisResult = analyzeQuery(query, lang, entries);
      analysis.innerHTML = `${analysisResult.noticeHtml || ""}${analysisResult.conjugationHtml || ""}`;
      const matched = searchDictionary(entries, query, lang, { verbHits: analysisResult.verbHits });
      const label = customEntries
        ? "已导入"
        : source === "full"
          ? lang === "es"
            ? "简明西汉汉西"
            : "红葡汉"
          : "精简词表";
      hint.textContent = query
        ? `${label} · 找到 ${matched.length} 条（最多显示 60）`
        : `${label} · 共 ${entries.length.toLocaleString()} 条 · 支持变位识别与阴阳性/单复数`;
      results.innerHTML = matched.length
        ? matched.map((e) => renderEntry(e, lang, headIndex)).join("")
        : `<div class="empty">没有匹配结果，试试更短的关键词或不带变位的词形。</div>`;
    } catch (err) {
      hint.textContent = err.message + "（可改用精简词表，或重新运行 scripts/convert_mdx.py）";
      results.innerHTML = "";
      analysis.innerHTML = "";
    }
  }

  function scheduleRefresh() {
    clearTimeout(timer);
    timer = setTimeout(refresh, 140);
  }

  langBar.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (!btn) return;
    lang = btn.dataset.lang;
    customEntries = null;
    langBar.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
    scheduleRefresh();
  });

  sourceBar.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-source]");
    if (!btn) return;
    source = btn.dataset.source;
    customEntries = null;
    sourceBar.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
    scheduleRefresh();
  });

  upload.addEventListener("change", async () => {
    const file = upload.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error("JSON 需为词条数组");
      customEntries = data.map((item) => {
        if (item.h && item.d) return { h: item.h, d: item.d };
        if (item.zh) return item;
        throw new Error("词条格式需为 {h,d} 或含 zh 字段");
      });
      hint.textContent = `已导入 ${customEntries.length} 条：${file.name}`;
      refresh();
    } catch (err) {
      hint.textContent = `导入失败：${err.message}`;
    } finally {
      upload.value = "";
    }
  });

  input.addEventListener("input", () => {
    query = input.value;
    scheduleRefresh();
  });

  results.addEventListener("click", (e) => {
    const jump = e.target.closest("[data-jump]");
    if (jump) {
      input.value = jump.dataset.jump;
      query = jump.dataset.jump;
      refresh();
      input.focus();
      return;
    }
    const conjBtn = e.target.closest("[data-conj]");
    if (!conjBtn) return;
    const article = conjBtn.closest(".entry");
    const slot = article?.querySelector(".conj-slot");
    if (!slot) return;
    if (!slot.hidden && slot.dataset.open === conjBtn.dataset.conj) {
      slot.hidden = true;
      return;
    }
    const inf = conjBtn.dataset.conj;
    const conjLang = conjBtn.dataset.lang || lang;
    const conj = conjLang === "pt" ? conjugatePt(inf) : conjugateEs(inf);
    const html = conjLang === "pt" ? renderConjugationPt(conj, inf) : renderConjugationEs(conj, inf);
    slot.innerHTML = html || `<p class="hint">暂无变位表</p>`;
    slot.hidden = false;
    slot.dataset.open = inf;
  });

  await refresh();
  input.focus();
}

function renderVocabPicker() {
  app.innerHTML = `
    <div class="page-head">
      <h1>背单词</h1>
      <p>按 DELE 等级选择词库，点击卡片回想释义，再按掌握程度打分，系统会安排复习。</p>
    </div>
    <div class="level-grid level-grid-3">
      <button class="level-pick" data-level="B2">
        <strong>B2</strong>
        <span>独立运用核心连接词、话题词与考试表达</span>
      </button>
      <button class="level-pick" data-level="C1">
        <strong>C1</strong>
        <span>论证、语域与书面高频进阶词汇</span>
      </button>
      <button class="level-pick" data-level="C2">
        <strong>C2</strong>
        <span>典雅表达、习语与精密书面词</span>
      </button>
    </div>
  `;
  app.querySelectorAll("[data-level]").forEach((btn) => {
    btn.addEventListener("click", () => {
      location.hash = `#/vocab/${btn.dataset.level}`;
    });
  });
}

async function mountVocab(level) {
  destroyControllers();
  app.innerHTML = `<p class="hint">正在加载 ${level} 词库…</p>`;
  try {
    const data = await getVocab(level);
    app.innerHTML = "";
    flashController = createFlashcards({
      data,
      root: app,
      onExit: () => {
        location.hash = "#/vocab";
      },
    });
  } catch (err) {
    app.innerHTML = `<div class="empty">${err.message}</div>`;
  }
}

function renderDelePicker() {
  app.innerHTML = `
    <div class="page-head">
      <h1>DELE 备考</h1>
      <p>选择难度后开始例题：阅读与语法可即时核对；写作/口语提供清单式评分要点。</p>
    </div>
    <div class="level-grid">
      <button class="level-pick" data-level="B2">
        <strong>DELE B2</strong>
        <span>独立运用：阅读、语法词汇、写作与口语提示</span>
      </button>
      <button class="level-pick" data-level="C1">
        <strong>DELE C1</strong>
        <span>熟练运用：论证、语域、精确词汇与深度阅读</span>
      </button>
    </div>
  `;

  app.querySelectorAll("[data-level]").forEach((btn) => {
    btn.addEventListener("click", () => {
      location.hash = `#/dele/${btn.dataset.level}`;
    });
  });
}

async function mountDele(level) {
  destroyControllers();
  app.innerHTML = `<p class="hint">正在加载 ${level} 题库…</p>`;
  try {
    const data = await getDele(level);
    app.innerHTML = "";
    deleController = createDeleController({
      data,
      root: app,
      onExit: () => {
        location.hash = "#/dele";
      },
    });
  } catch (err) {
    app.innerHTML = `<div class="empty">${err.message}</div>`;
  }
}

async function router() {
  destroyControllers();

  const raw = location.hash.replace(/^#/, "") || "/";
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  setActiveNav(path);

  if (path === "/" || path === "") {
    renderHome();
    return;
  }
  if (path === "/dict") {
    await mountDictionary();
    return;
  }
  if (path === "/vocab") {
    renderVocabPicker();
    return;
  }
  const vocabMatch = path.match(/^\/vocab\/(B2|C1|C2)$/i);
  if (vocabMatch) {
    await mountVocab(vocabMatch[1].toUpperCase());
    return;
  }
  if (path === "/dele") {
    renderDelePicker();
    return;
  }
  const deleMatch = path.match(/^\/dele\/(B2|C1)$/i);
  if (deleMatch) {
    await mountDele(deleMatch[1].toUpperCase());
    return;
  }
  renderHome();
}

window.addEventListener("hashchange", () => {
  router();
});

router();
