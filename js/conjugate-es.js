import { PERSONS } from "./morphology.js";

const TENSES = [
  ["presente", "现在时"],
  ["preterito", "简单过去"],
  ["imperfecto", "过去未完成"],
  ["futuro", "将来时"],
  ["condicional", "条件式"],
  ["subjPresente", "虚拟式现在"],
  ["imperativo", "命令式"],
];

const IRREG = {
  ser: {
    presente: ["soy", "eres", "es", "somos", "sois", "son"],
    preterito: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"],
    imperfecto: ["era", "eras", "era", "éramos", "erais", "eran"],
    futuro: ["seré", "serás", "será", "seremos", "seréis", "serán"],
    condicional: ["sería", "serías", "sería", "seríamos", "seríais", "serían"],
    subjPresente: ["sea", "seas", "sea", "seamos", "seáis", "sean"],
    imperativo: ["—", "sé", "sea", "seamos", "sed", "sean"],
    gerundio: "siendo",
    participio: "sido",
  },
  estar: {
    presente: ["estoy", "estás", "está", "estamos", "estáis", "están"],
    preterito: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron"],
    imperfecto: ["estaba", "estabas", "estaba", "estábamos", "estabais", "estaban"],
    futuro: ["estaré", "estarás", "estará", "estaremos", "estaréis", "estarán"],
    condicional: ["estaría", "estarías", "estaría", "estaríamos", "estaríais", "estarían"],
    subjPresente: ["esté", "estés", "esté", "estemos", "estéis", "estén"],
    imperativo: ["—", "está", "esté", "estemos", "estad", "estén"],
    gerundio: "estando",
    participio: "estado",
  },
  ir: {
    presente: ["voy", "vas", "va", "vamos", "vais", "van"],
    preterito: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"],
    imperfecto: ["iba", "ibas", "iba", "íbamos", "ibais", "iban"],
    futuro: ["iré", "irás", "irá", "iremos", "iréis", "irán"],
    condicional: ["iría", "irías", "iría", "iríamos", "iríais", "irían"],
    subjPresente: ["vaya", "vayas", "vaya", "vayamos", "vayáis", "vayan"],
    imperativo: ["—", "ve", "vaya", "vamos", "id", "vayan"],
    gerundio: "yendo",
    participio: "ido",
  },
  tener: {
    presente: ["tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen"],
    preterito: ["tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron"],
    imperfecto: ["tenía", "tenías", "tenía", "teníamos", "teníais", "tenían"],
    futuro: ["tendré", "tendrás", "tendrá", "tendremos", "tendréis", "tendrán"],
    condicional: ["tendría", "tendrías", "tendría", "tendríamos", "tendríais", "tendrían"],
    subjPresente: ["tenga", "tengas", "tenga", "tengamos", "tengáis", "tengan"],
    imperativo: ["—", "ten", "tenga", "tengamos", "tened", "tengan"],
    gerundio: "teniendo",
    participio: "tenido",
  },
  hacer: {
    presente: ["hago", "haces", "hace", "hacemos", "hacéis", "hacen"],
    preterito: ["hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron"],
    imperfecto: ["hacía", "hacías", "hacía", "hacíamos", "hacíais", "hacían"],
    futuro: ["haré", "harás", "hará", "haremos", "haréis", "harán"],
    condicional: ["haría", "harías", "haría", "haríamos", "haríais", "harían"],
    subjPresente: ["haga", "hagas", "haga", "hagamos", "hagáis", "hagan"],
    imperativo: ["—", "haz", "haga", "hagamos", "haced", "hagan"],
    gerundio: "haciendo",
    participio: "hecho",
  },
  poder: {
    presente: ["puedo", "puedes", "puede", "podemos", "podéis", "pueden"],
    preterito: ["pude", "pudiste", "pudo", "pudimos", "pudisteis", "pudieron"],
    imperfecto: ["podía", "podías", "podía", "podíamos", "podíais", "podían"],
    futuro: ["podré", "podrás", "podrá", "podremos", "podréis", "podrán"],
    condicional: ["podría", "podrías", "podría", "podríamos", "podríais", "podrían"],
    subjPresente: ["pueda", "puedas", "pueda", "podamos", "podáis", "puedan"],
    imperativo: ["—", "puede", "pueda", "podamos", "poded", "puedan"],
    gerundio: "pudiendo",
    participio: "podido",
  },
  querer: {
    presente: ["quiero", "quieres", "quiere", "queremos", "queréis", "quieren"],
    preterito: ["quise", "quisiste", "quiso", "quisimos", "quisisteis", "quisieron"],
    imperfecto: ["quería", "querías", "quería", "queríamos", "queríais", "querían"],
    futuro: ["querré", "querrás", "querrá", "querremos", "querréis", "querrán"],
    condicional: ["querría", "querrías", "querría", "querríamos", "querríais", "querrían"],
    subjPresente: ["quiera", "quieras", "quiera", "queramos", "queráis", "quieran"],
    imperativo: ["—", "quiere", "quiera", "queramos", "quered", "quieran"],
    gerundio: "queriendo",
    participio: "querido",
  },
  decir: {
    presente: ["digo", "dices", "dice", "decimos", "decís", "dicen"],
    preterito: ["dije", "dijiste", "dijo", "dijimos", "dijisteis", "dijeron"],
    imperfecto: ["decía", "decías", "decía", "decíamos", "decíais", "decían"],
    futuro: ["diré", "dirás", "dirá", "diremos", "diréis", "dirán"],
    condicional: ["diría", "dirías", "diría", "diríamos", "diríais", "dirían"],
    subjPresente: ["diga", "digas", "diga", "digamos", "digáis", "digan"],
    imperativo: ["—", "di", "diga", "digamos", "decid", "digan"],
    gerundio: "diciendo",
    participio: "dicho",
  },
  ver: {
    presente: ["veo", "ves", "ve", "vemos", "veis", "ven"],
    preterito: ["vi", "viste", "vio", "vimos", "visteis", "vieron"],
    imperfecto: ["veía", "veías", "veía", "veíamos", "veíais", "veían"],
    futuro: ["veré", "verás", "verá", "veremos", "veréis", "verán"],
    condicional: ["vería", "verías", "vería", "veríamos", "veríais", "verían"],
    subjPresente: ["vea", "veas", "vea", "veamos", "veáis", "vean"],
    imperativo: ["—", "ve", "vea", "veamos", "ved", "vean"],
    gerundio: "viendo",
    participio: "visto",
  },
  dar: {
    presente: ["doy", "das", "da", "damos", "dais", "dan"],
    preterito: ["di", "diste", "dio", "dimos", "disteis", "dieron"],
    imperfecto: ["daba", "dabas", "daba", "dábamos", "dabais", "daban"],
    futuro: ["daré", "darás", "dará", "daremos", "daréis", "darán"],
    condicional: ["daría", "darías", "daría", "daríamos", "daríais", "darían"],
    subjPresente: ["dé", "des", "dé", "demos", "deis", "den"],
    imperativo: ["—", "da", "dé", "demos", "dad", "den"],
    gerundio: "dando",
    participio: "dado",
  },
  saber: {
    presente: ["sé", "sabes", "sabe", "sabemos", "sabéis", "saben"],
    preterito: ["supe", "supiste", "supo", "supimos", "supisteis", "supieron"],
    imperfecto: ["sabía", "sabías", "sabía", "sabíamos", "sabíais", "sabían"],
    futuro: ["sabré", "sabrás", "sabrá", "sabremos", "sabréis", "sabrán"],
    condicional: ["sabría", "sabrías", "sabría", "sabríamos", "sabríais", "sabrían"],
    subjPresente: ["sepa", "sepas", "sepa", "sepamos", "sepáis", "sepan"],
    imperativo: ["—", "sabe", "sepa", "sepamos", "sabed", "sepan"],
    gerundio: "sabiendo",
    participio: "sabido",
  },
  venir: {
    presente: ["vengo", "vienes", "viene", "venimos", "venís", "vienen"],
    preterito: ["vine", "viniste", "vino", "vinimos", "vinisteis", "vinieron"],
    imperfecto: ["venía", "venías", "venía", "veníamos", "veníais", "venían"],
    futuro: ["vendré", "vendrás", "vendrá", "vendremos", "vendréis", "vendrán"],
    condicional: ["vendría", "vendrías", "vendría", "vendríamos", "vendríais", "vendrían"],
    subjPresente: ["venga", "vengas", "venga", "vengamos", "vengáis", "vengan"],
    imperativo: ["—", "ven", "venga", "vengamos", "venid", "vengan"],
    gerundio: "viniendo",
    participio: "venido",
  },
  poner: {
    presente: ["pongo", "pones", "pone", "ponemos", "ponéis", "ponen"],
    preterito: ["puse", "pusiste", "puso", "pusimos", "pusisteis", "pusieron"],
    imperfecto: ["ponía", "ponías", "ponía", "poníamos", "poníais", "ponían"],
    futuro: ["pondré", "pondrás", "pondrá", "pondremos", "pondréis", "pondrán"],
    condicional: ["pondría", "pondrías", "pondría", "pondríamos", "pondríais", "pondrían"],
    subjPresente: ["ponga", "pongas", "ponga", "pongamos", "pongáis", "pongan"],
    imperativo: ["—", "pon", "ponga", "pongamos", "poned", "pongan"],
    gerundio: "poniendo",
    participio: "puesto",
  },
  salir: {
    presente: ["salgo", "sales", "sale", "salimos", "salís", "salen"],
    preterito: ["salí", "saliste", "salió", "salimos", "salisteis", "salieron"],
    imperfecto: ["salía", "salías", "salía", "salíamos", "salíais", "salían"],
    futuro: ["saldré", "saldrás", "saldrá", "saldremos", "saldréis", "saldrán"],
    condicional: ["saldría", "saldrías", "saldría", "saldríamos", "saldríais", "saldrían"],
    subjPresente: ["salga", "salgas", "salga", "salgamos", "salgáis", "salgan"],
    imperativo: ["—", "sal", "salga", "salgamos", "salid", "salgan"],
    gerundio: "saliendo",
    participio: "salido",
  },
  haber: {
    presente: ["he", "has", "ha", "hemos", "habéis", "han"],
    preterito: ["hube", "hubiste", "hubo", "hubimos", "hubisteis", "hubieron"],
    imperfecto: ["había", "habías", "había", "habíamos", "habíais", "habían"],
    futuro: ["habré", "habrás", "habrá", "habremos", "habréis", "habrán"],
    condicional: ["habría", "habrías", "habría", "habríamos", "habríais", "habrían"],
    subjPresente: ["haya", "hayas", "haya", "hayamos", "hayáis", "hayan"],
    imperativo: ["—", "hé", "haya", "hayamos", "habed", "hayan"],
    gerundio: "habiendo",
    participio: "habido",
  },
};

function stemOf(inf) {
  return inf.slice(0, -2);
}

function regular(inf) {
  const stem = stemOf(inf);
  const end = inf.slice(-2);
  if (end === "ar") {
    return {
      presente: ["o", "as", "a", "amos", "áis", "an"].map((x, i) => (i < 6 ? stem + x : "")),
      preterito: ["é", "aste", "ó", "amos", "asteis", "aron"].map((x) => stem + x),
      imperfecto: ["aba", "abas", "aba", "ábamos", "abais", "aban"].map((x) => stem + x),
      futuro: ["é", "ás", "á", "emos", "éis", "án"].map((x) => inf + x),
      condicional: ["ía", "ías", "ía", "íamos", "íais", "ían"].map((x) => inf + x),
      subjPresente: ["e", "es", "e", "emos", "éis", "en"].map((x) => stem + x),
      imperativo: ["—", stem + "a", stem + "e", stem + "emos", stem + "ad", stem + "en"],
      gerundio: stem + "ando",
      participio: stem + "ado",
    };
  }
  if (end === "er") {
    return {
      presente: ["o", "es", "e", "emos", "éis", "en"].map((x) => stem + x),
      preterito: ["í", "iste", "ió", "imos", "isteis", "ieron"].map((x) => stem + x),
      imperfecto: ["ía", "ías", "ía", "íamos", "íais", "ían"].map((x) => stem + x),
      futuro: ["é", "ás", "á", "emos", "éis", "án"].map((x) => inf + x),
      condicional: ["ía", "ías", "ía", "íamos", "íais", "ían"].map((x) => inf + x),
      subjPresente: ["a", "as", "a", "amos", "áis", "an"].map((x) => stem + x),
      imperativo: ["—", stem + "e", stem + "a", stem + "amos", stem + "ed", stem + "an"],
      gerundio: stem + "iendo",
      participio: stem + "ido",
    };
  }
  // ir
  return {
    presente: ["o", "es", "e", "imos", "ís", "en"].map((x) => stem + x),
    preterito: ["í", "iste", "ió", "imos", "isteis", "ieron"].map((x) => stem + x),
    imperfecto: ["ía", "ías", "ía", "íamos", "íais", "ían"].map((x) => stem + x),
    futuro: ["é", "ás", "á", "emos", "éis", "án"].map((x) => inf + x),
    condicional: ["ía", "ías", "ía", "íamos", "íais", "ían"].map((x) => inf + x),
    subjPresente: ["a", "as", "a", "amos", "áis", "an"].map((x) => stem + x),
    imperativo: ["—", stem + "e", stem + "a", stem + "amos", stem + "id", stem + "an"],
    gerundio: stem + "iendo",
    participio: stem + "ido",
  };
}

export function conjugateEs(infinitive) {
  const inf = String(infinitive || "").toLowerCase().trim();
  if (!/(ar|er|ir)$/.test(inf) && !IRREG[inf]) return null;
  const base = IRREG[inf] || regular(inf);
  return { infinitive: inf, ...base, tenses: TENSES, persons: PERSONS };
}

let reverseCache = null;

function ensureReverse() {
  if (reverseCache) return reverseCache;
  reverseCache = new Map();
  const seeds = new Set([
    ...Object.keys(IRREG),
    "hablar",
    "comer",
    "vivir",
    "estudiar",
    "trabajar",
    "aprender",
    "escribir",
    "leer",
    "abrir",
    "cerrar",
    "llegar",
    "llevar",
    "llamar",
    "pensar",
    "encontrar",
    "volver",
    "partir",
    "decidir",
    "necesitar",
    "usar",
    "mirar",
    "escuchar",
    "comprar",
    "vender",
    "correr",
    "beber",
    "dormir",
    "pedir",
    "servir",
    "sentir",
    "preferir",
    "empezar",
    "comenzar",
    "entender",
    "perder",
    "contar",
    "costar",
    "jugar",
    "recordar",
    "mostrar",
    "mover",
    "morir",
    "seguir",
    "conseguir",
    "sugerir",
    "repetir",
    "elegir",
    "conocer",
    "parecer",
    "ofrecer",
    "traducir",
    "conducir",
    "creer",
    "caer",
    "oír",
    "construir",
    "incluir",
  ]);
  for (const inf of seeds) {
    const c = conjugateEs(inf);
    if (!c) continue;
    for (const [tenseKey, label] of TENSES) {
      const forms = c[tenseKey];
      if (!forms) continue;
      forms.forEach((form, i) => {
        if (!form || form === "—") return;
        const k = form.toLowerCase();
        const arr = reverseCache.get(k) || [];
        arr.push({ infinitive: inf, tense: tenseKey, tenseLabel: label, person: PERSONS[i], personIndex: i });
        reverseCache.set(k, arr);
      });
    }
    for (const [form, kind] of [
      [c.gerundio, "副动词"],
      [c.participio, "过去分词"],
    ]) {
      if (!form) continue;
      const k = form.toLowerCase();
      const arr = reverseCache.get(k) || [];
      arr.push({ infinitive: inf, tense: kind, tenseLabel: kind, person: "—", personIndex: -1 });
      reverseCache.set(k, arr);
    }
    const arr = reverseCache.get(inf) || [];
    arr.push({ infinitive: inf, tense: "infinitivo", tenseLabel: "不定式", person: "—", personIndex: -1 });
    reverseCache.set(inf, arr);
  }
  return reverseCache;
}

const indexedEs = new WeakSet();

/** Expand reverse index with infinitives found in dictionary (once per array). */
export function indexDictionaryVerbsEs(entries) {
  const map = ensureReverse();
  if (!entries || indexedEs.has(entries)) return map;
  indexedEs.add(entries);
  let added = 0;
  for (const e of entries) {
    const h = (e.h || "").toLowerCase();
    const def = e.d || "";
    const looksVerb = /\b(vt|vi|vr|v\.t|v\.i|v\.r)\b/i.test(def) || /动词/.test(def);
    if (!/(ar|er|ir)$/.test(h) || !looksVerb || IRREG[h]) continue;
    const c = conjugateEs(h);
    if (!c) continue;
    for (const [tenseKey, label] of TENSES) {
      c[tenseKey].forEach((form, i) => {
        if (!form || form === "—") return;
        const k = form.toLowerCase();
        const arr = map.get(k) || [];
        if (arr.some((x) => x.infinitive === h && x.tense === tenseKey && x.personIndex === i)) return;
        arr.push({ infinitive: h, tense: tenseKey, tenseLabel: label, person: PERSONS[i], personIndex: i });
        map.set(k, arr);
      });
    }
    for (const [form, kind] of [
      [c.gerundio, "副动词"],
      [c.participio, "过去分词"],
      [h, "不定式"],
    ]) {
      const k = form.toLowerCase();
      const arr = map.get(k) || [];
      if (!arr.some((x) => x.infinitive === h && x.tenseLabel === kind)) {
        arr.push({ infinitive: h, tense: kind, tenseLabel: kind, person: "—", personIndex: -1 });
        map.set(k, arr);
      }
    }
    added += 1;
    if (added > 8000) break;
  }
  return map;
}

export function recognizeEs(form) {
  const k = String(form || "").toLowerCase().trim();
  if (!k) return [];
  const map = ensureReverse();
  return map.get(k) || [];
}

export function renderConjugationEs(conj, highlightForm = "") {
  if (!conj) return "";
  const hi = highlightForm.toLowerCase();
  const tables = TENSES.map(([key, label]) => {
    const rows = conj[key]
      .map((form, i) => {
        const active = form.toLowerCase() === hi ? " active-form" : "";
        return `<tr class="${active}"><th>${PERSONS[i]}</th><td>${form}</td></tr>`;
      })
      .join("");
    return `<div class="conj-block"><h4>${label}</h4><table>${rows}</table></div>`;
  }).join("");
  return `
    <div class="conj-panel" data-conj-root>
      <div class="conj-head">
        <strong>${conj.infinitive}</strong>
        <span class="hint">副动词 ${conj.gerundio} · 过分 ${conj.participio}</span>
      </div>
      <div class="conj-grid">${tables}</div>
    </div>
  `;
}
