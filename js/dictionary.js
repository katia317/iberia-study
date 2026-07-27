import {
  parseMorphology,
  relatedNumberForms,
  genderBadge,
  numberBadge,
  buildHeadIndex,
  pluralCandidates,
  singularCandidates,
} from "./morphology.js";
import { conjugateEs, recognizeEs, renderConjugationEs, indexDictionaryVerbsEs } from "./conjugate-es.js";
import { conjugatePt, recognizePt, renderConjugationPt, indexDictionaryVerbsPt } from "./conjugate-pt.js";

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("\n", "<br>");
}

export function searchDictionary(entries, query, lang, options = {}) {
  const q = normalize(query);
  if (!q) return entries.slice(0, 12);

  const { verbHits = [] } = options;
  const preferredInfinitives = new Set(verbHits.map((v) => v.infinitive));

  const scored = [];
  for (const entry of entries) {
    if (entry.zh != null) {
      const zh = normalize(entry.zh);
      const target = normalize(lang === "es" ? entry.es : entry.pt);
      const exampleZh = normalize(entry.example_zh);
      const exampleTarget = normalize(lang === "es" ? entry.example_es : entry.example_pt);
      const tags = (entry.tags || []).map(normalize).join(" ");
      let score = 0;
      if (zh === q || target === q) score = 100;
      else if (zh.startsWith(q) || target.startsWith(q)) score = 80;
      else if (zh.includes(q) || target.includes(q)) score = 60;
      else if (exampleZh.includes(q) || exampleTarget.includes(q) || tags.includes(q)) score = 30;
      if (preferredInfinitives.has(target)) score = Math.max(score, 95);
      if (score > 0) scored.push({ entry, score });
      continue;
    }

    const h = normalize(entry.h);
    const d = normalize(entry.d);
    let score = 0;
    if (h === q) score = 100;
    else if (preferredInfinitives.has(h)) score = 96;
    else if (h.startsWith(q)) score = 85;
    else if (h.includes(q)) score = 65;
    else if (q.length >= 2 && d.includes(q)) score = 35;
    if (score > 0) scored.push({ entry, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const ah = a.entry.h || a.entry.zh || "";
    const bh = b.entry.h || b.entry.zh || "";
    return String(ah).localeCompare(String(bh), "zh");
  });
  return scored.slice(0, 60).map((s) => s.entry);
}

export function analyzeQuery(query, lang, entries) {
  const q = String(query || "").trim();
  if (!q || /[\u4e00-\u9fff]/.test(q)) {
    return { verbHits: [], conjugationHtml: "", noticeHtml: "" };
  }

  if (lang === "es") {
    indexDictionaryVerbsEs(entries);
    const verbHits = recognizeEs(q);
    let conjugationHtml = "";
    let noticeHtml = "";
    if (verbHits.length) {
      const top = verbHits[0];
      const conj = conjugateEs(top.infinitive);
      noticeHtml = `
        <div class="analysis-banner">
          <strong>动词变位识别：</strong>
          <span class="mono">${escapeHtml(q)}</span>
          → 不定式 <strong>${escapeHtml(top.infinitive)}</strong>
          · ${escapeHtml(top.tenseLabel)}
          ${top.person !== "—" ? "· " + escapeHtml(top.person) : ""}
          ${verbHits.length > 1 ? `<span class="hint">（另有 ${verbHits.length - 1} 种可能）</span>` : ""}
        </div>`;
      conjugationHtml = renderConjugationEs(conj, q);
    } else if (/(ar|er|ir)$/i.test(q)) {
      const conj = conjugateEs(q.toLowerCase());
      if (conj) {
        noticeHtml = `<div class="analysis-banner"><strong>动词变位表：</strong>${escapeHtml(q)}</div>`;
        conjugationHtml = renderConjugationEs(conj, q);
      }
    }
    return { verbHits, conjugationHtml, noticeHtml };
  }

  indexDictionaryVerbsPt(entries);
  const verbHits = recognizePt(q);
  let conjugationHtml = "";
  let noticeHtml = "";
  if (verbHits.length) {
    const top = verbHits[0];
    const conj = conjugatePt(top.infinitive);
    noticeHtml = `
      <div class="analysis-banner">
        <strong>动词变位识别：</strong>
        <span class="mono">${escapeHtml(q)}</span>
        → 不定式 <strong>${escapeHtml(top.infinitive)}</strong>
        · ${escapeHtml(top.tenseLabel)}
        ${top.person !== "—" ? "· " + escapeHtml(top.person) : ""}
      </div>`;
    conjugationHtml = renderConjugationPt(conj, q);
  } else if (/(ar|er|ir)$/i.test(q)) {
    const conj = conjugatePt(q.toLowerCase());
    if (conj) {
      noticeHtml = `<div class="analysis-banner"><strong>动词变位表：</strong>${escapeHtml(q)}</div>`;
      conjugationHtml = renderConjugationPt(conj, q);
    }
  }
  return { verbHits, conjugationHtml, noticeHtml };
}

export function renderEntry(entry, lang, index = null) {
  if (entry.h != null) {
    const morph = parseMorphology(entry, lang);
    const related = index ? relatedNumberForms(entry, index, lang) : [];
    const posTags = morph.pos.map((p) => `<span class="tag">${escapeHtml(p)}</span>`).join("");
    let relatedHtml = related
      .map((r) => {
        const rm = parseMorphology(r.entry, lang);
        return `<button type="button" class="related-form" data-jump="${escapeHtml(r.head)}">
          ${r.role === "plural" ? "复数" : "单数"}：<strong>${escapeHtml(r.head)}</strong>
          ${genderBadge(rm)}${numberBadge(rm)}
        </button>`;
      })
      .join("");
    if (!relatedHtml && morph.genderLabel) {
      const guesses =
        morph.number === "plural"
          ? singularCandidates(entry.h, lang)
          : pluralCandidates(entry.h, lang);
      relatedHtml = guesses
        .slice(0, 2)
        .map(
          (g) =>
            `<span class="related-form guess">${morph.number === "plural" ? "单数" : "复数"}参考：<strong>${escapeHtml(
              g
            )}</strong></span>`
        )
        .join("");
    }

    const isVerb = morph.pos.some((p) => p.includes("动词")) || /\b(vt|vi|vr|v\.t|v\.i)\b/i.test(entry.d || "");
    const conjBtn =
      isVerb && /(ar|er|ir)$/i.test(entry.h)
        ? `<button type="button" class="btn btn-secondary conj-open" data-conj="${escapeHtml(entry.h)}" data-lang="${lang}">查看变位</button>`
        : "";

    return `
      <article class="entry" data-head="${escapeHtml(entry.h)}">
        <div class="entry-head">
          <span class="entry-word">${escapeHtml(entry.h)}</span>
          ${genderBadge(morph)}
          ${numberBadge(morph)}
          ${posTags}
        </div>
        <div class="morph-row">
          ${
            morph.genderLabel
              ? `<span>阴阳性：<strong>${morph.genderLabel}</strong>（${morph.gender === "mf" ? "m./f." : morph.gender + "."}）</span>`
              : ""
          }
          <span>数：<strong>${morph.numberLabel}</strong></span>
        </div>
        ${relatedHtml ? `<div class="related-row">${relatedHtml}</div>` : ""}
        <p class="entry-def">${escapeHtml(entry.d || "")}</p>
        ${conjBtn}
        <div class="conj-slot" hidden></div>
      </article>
    `;
  }

  const target = lang === "es" ? entry.es : entry.pt;
  const exampleTarget = lang === "es" ? entry.example_es : entry.example_pt;
  const tags = (entry.tags || [])
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join("");

  return `
    <article class="entry">
      <div class="entry-head">
        <span class="entry-word">${escapeHtml(entry.zh)}</span>
        <span class="entry-phonetic">${escapeHtml(target)}</span>
        <span class="entry-pos">${escapeHtml(entry.pos || "")}</span>
      </div>
      ${entry.phonetic ? `<p class="entry-def">读音：/${escapeHtml(entry.phonetic)}/</p>` : ""}
      <p class="entry-def">${escapeHtml(entry.example_zh || "")}</p>
      <p class="entry-example">${escapeHtml(exampleTarget || "")}</p>
      ${tags ? `<div class="tags">${tags}</div>` : ""}
    </article>
  `;
}

export { buildHeadIndex, conjugateEs, conjugatePt, renderConjugationEs, renderConjugationPt };
