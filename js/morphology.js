const PERSONS = ["yo", "tú", "él/ella/usted", "nosotros", "vosotros", "ellos/ustedes"];
const PERSONS_PT = ["eu", "tu", "ele/ela/você", "nós", "vós", "eles/elas/vocês"];

export function parseMorphology(entry, lang = "es") {
  const head = entry.h || entry.es || entry.pt || "";
  const def = entry.d || "";
  const blob = `${head}\n${def}`;

  let gender = null;
  let number = "singular";
  let pos = [];

  if (lang === "pt") {
    if (/\bs\.?\s*m\b|\bsm\b/i.test(blob) || /\bm\.\b/.test(def)) gender = "m";
    if (/\bs\.?\s*f\b|\bsf\b/i.test(blob) || /\bf\.\b/.test(def)) {
      gender = gender === "m" ? "mf" : "f";
    }
    if (/\bpl\b|\bplural\b/i.test(def)) number = "plural";
    if (/\bv\.t\b|\bvt\b/i.test(def)) pos.push("及物动词");
    if (/\bv\.i\b|\bvi\b/i.test(def)) pos.push("不及物动词");
    if (/\bv\.?\b/.test(def) && !pos.length) pos.push("动词");
    if (/\badj\b/i.test(def)) pos.push("形容词");
    if (/\bs\.[mf]\b|\bsm\b|\bsf\b/i.test(def)) pos.push("名词");
  } else {
    if (/\bm\.?\s*y\s*f\.|\bm\.f\.|\bmf\./i.test(def)) gender = "mf";
    else if (/(^|[\s,;])m\.(?=\s|$|[^\w])/i.test(def) || /\bm\.\s/.test(def)) gender = "m";
    if (/(^|[\s,;])f\.(?=\s|$|[^\w])/i.test(def) || /\bf\.\s/.test(def)) {
      gender = gender === "m" ? "mf" : gender || "f";
    }
    if (/\bpl\b|\bplural\b/i.test(def) || /复数/.test(def)) number = "plural";
    if (/\bvt\b|\bv\.t\./i.test(def)) pos.push("及物动词");
    if (/\bvi\b|\bv\.i\./i.test(def)) pos.push("不及物动词");
    if (/\bvr\b|\bv\.r\./i.test(def)) pos.push("代词式动词");
    if (/\badj\b/i.test(def)) pos.push("形容词");
    if ((gender || /\bm\./.test(def) || /\bf\./.test(def)) && !pos.includes("形容词")) pos.push("名词");
  }

  // Heuristic plural by ending when definition lacks marker
  if (number === "singular" && looksPlural(head, lang)) number = "plural";

  return {
    head,
    gender,
    number,
    pos: [...new Set(pos)],
    genderLabel: genderLabel(gender),
    numberLabel: number === "plural" ? "复数" : "单数",
  };
}

function genderLabel(g) {
  if (g === "m") return "阳性";
  if (g === "f") return "阴性";
  if (g === "mf") return "阳/阴";
  return null;
}

export function looksPlural(word, lang = "es") {
  const w = String(word || "").toLowerCase();
  if (w.length < 3) return false;
  if (lang === "pt") {
    if (/(?:ções|ões|ães|ais|éis|óis)$/.test(w)) return true;
    if (/ns$/.test(w)) return true;
    if (/[aeiouáéíóú]s$/i.test(w)) return true;
    return false;
  }
  if (/(ciones|siones|dades|umbres)$/.test(w)) return true;
  if (/[^aeiouáéíóú]es$/i.test(w)) return true;
  if (/[aeiouáéíóú]s$/i.test(w) && !/(?:sis|tis|esis)$/.test(w)) return true;
  return false;
}

export function singularCandidates(word, lang = "es") {
  const w = String(word || "");
  const out = new Set();
  if (lang === "pt") {
    if (w.endsWith("ões")) out.add(w.slice(0, -3) + "ão");
    if (w.endsWith("ães")) out.add(w.slice(0, -3) + "ão");
    if (w.endsWith("ais")) out.add(w.slice(0, -2) + "l");
    if (w.endsWith("éis")) out.add(w.slice(0, -3) + "el");
    if (w.endsWith("óis")) out.add(w.slice(0, -3) + "ol");
    if (w.endsWith("ns")) out.add(w.slice(0, -2) + "m");
    if (w.endsWith("s")) out.add(w.slice(0, -1));
    return [...out];
  }
  if (w.endsWith("ces")) out.add(w.slice(0, -3) + "z");
  if (w.endsWith("es") && w.length > 3) out.add(w.slice(0, -2));
  if (w.endsWith("s") && w.length > 2) out.add(w.slice(0, -1));
  return [...out];
}

export function pluralCandidates(word, lang = "es") {
  const w = String(word || "");
  const out = new Set();
  if (!w) return [];
  if (lang === "pt") {
    if (w.endsWith("ão")) {
      out.add(w.slice(0, -2) + "ões");
      out.add(w.slice(0, -2) + "ães");
      out.add(w.slice(0, -2) + "ãos");
    } else if (w.endsWith("l")) out.add(w.slice(0, -1) + "is");
    else if (w.endsWith("m")) out.add(w.slice(0, -1) + "ns");
    else if (/[aeiouáéíóú]$/i.test(w)) out.add(w + "s");
    else out.add(w + "es");
    return [...out];
  }
  if (w.endsWith("z")) out.add(w.slice(0, -1) + "ces");
  else if (/[aeiouáéíóú]$/i.test(w)) out.add(w + "s");
  else out.add(w + "es");
  return [...out];
}

export function buildHeadIndex(entries) {
  const map = new Map();
  for (const e of entries) {
    const h = e.h || e.es || e.pt;
    if (!h) continue;
    const key = h.toLowerCase();
    if (!map.has(key)) map.set(key, e);
  }
  return map;
}

export function relatedNumberForms(entry, index, lang = "es") {
  const head = entry.h || entry.es || entry.pt || "";
  const morph = parseMorphology(entry, lang);
  const related = [];
  const candidates =
    morph.number === "plural" ? singularCandidates(head, lang) : pluralCandidates(head, lang);
  for (const c of candidates) {
    const hit = index.get(c.toLowerCase());
    if (hit) {
      related.push({
        head: hit.h || c,
        role: morph.number === "plural" ? "singular" : "plural",
        entry: hit,
      });
    }
  }
  return related;
}

export function genderBadge(morph) {
  if (!morph.genderLabel) return "";
  const cls = morph.gender === "f" ? "f" : morph.gender === "mf" ? "mf" : "m";
  return `<span class="morph-badge ${cls}">${morph.genderLabel} ${morph.gender === "mf" ? "m./f." : morph.gender + "."}</span>`;
}

export function numberBadge(morph) {
  return `<span class="morph-badge num">${morph.numberLabel}</span>`;
}

export { PERSONS, PERSONS_PT };
