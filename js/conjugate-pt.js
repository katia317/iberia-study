import { PERSONS_PT } from "./morphology.js";

const TENSES = [
  ["presente", "现在时"],
  ["preterito", "简单过去"],
  ["imperfeito", "过去未完成"],
  ["futuro", "将来时"],
  ["condicional", "条件式"],
  ["conjuntivo", "虚拟式现在"],
];

const IRREG = {
  ser: {
    presente: ["sou", "és", "é", "somos", "sois", "são"],
    preterito: ["fui", "foste", "foi", "fomos", "fostes", "foram"],
    imperfeito: ["era", "eras", "era", "éramos", "éreis", "eram"],
    futuro: ["serei", "serás", "será", "seremos", "sereis", "serão"],
    condicional: ["seria", "serias", "seria", "seríamos", "seríeis", "seriam"],
    conjuntivo: ["seja", "sejas", "seja", "sejamos", "sejais", "sejam"],
    gerundio: "sendo",
    participio: "sido",
  },
  estar: {
    presente: ["estou", "estás", "está", "estamos", "estais", "estão"],
    preterito: ["estive", "estiveste", "esteve", "estivemos", "estivestes", "estiveram"],
    imperfeito: ["estava", "estavas", "estava", "estávamos", "estáveis", "estavam"],
    futuro: ["estarei", "estarás", "estará", "estaremos", "estareis", "estarão"],
    condicional: ["estaria", "estarias", "estaria", "estaríamos", "estaríeis", "estariam"],
    conjuntivo: ["esteja", "estejas", "esteja", "estejamos", "estejais", "estejam"],
    gerundio: "estando",
    participio: "estado",
  },
  ter: {
    presente: ["tenho", "tens", "tem", "temos", "tendes", "têm"],
    preterito: ["tive", "tiveste", "teve", "tivemos", "tivestes", "tiveram"],
    imperfeito: ["tinha", "tinhas", "tinha", "tínhamos", "tínheis", "tinham"],
    futuro: ["terei", "terás", "terá", "teremos", "tereis", "terão"],
    condicional: ["teria", "terias", "teria", "teríamos", "teríeis", "teriam"],
    conjuntivo: ["tenha", "tenhas", "tenha", "tenhamos", "tenhais", "tenham"],
    gerundio: "tendo",
    participio: "tido",
  },
  ir: {
    presente: ["vou", "vais", "vai", "vamos", "ides", "vão"],
    preterito: ["fui", "foste", "foi", "fomos", "fostes", "foram"],
    imperfeito: ["ia", "ias", "ia", "íamos", "íeis", "iam"],
    futuro: ["irei", "irás", "irá", "iremos", "ireis", "irão"],
    condicional: ["iria", "irias", "iria", "iríamos", "iríeis", "iriam"],
    conjuntivo: ["vá", "vás", "vá", "vamos", "vades", "vão"],
    gerundio: "indo",
    participio: "ido",
  },
  fazer: {
    presente: ["faço", "fazes", "faz", "fazemos", "fazeis", "fazem"],
    preterito: ["fiz", "fizeste", "fez", "fizemos", "fizestes", "fizeram"],
    imperfeito: ["fazia", "fazias", "fazia", "fazíamos", "fazíeis", "faziam"],
    futuro: ["farei", "farás", "fará", "faremos", "fareis", "farão"],
    condicional: ["faria", "farias", "faria", "faríamos", "faríeis", "fariam"],
    conjuntivo: ["faça", "faças", "faça", "façamos", "façais", "façam"],
    gerundio: "fazendo",
    participio: "feito",
  },
  poder: {
    presente: ["posso", "podes", "pode", "podemos", "podeis", "podem"],
    preterito: ["pude", "pudeste", "pôde", "pudemos", "pudestes", "puderam"],
    imperfeito: ["podia", "podias", "podia", "podíamos", "podíeis", "podiam"],
    futuro: ["poderei", "poderás", "poderá", "poderemos", "podereis", "poderão"],
    condicional: ["poderia", "poderias", "poderia", "poderíamos", "poderíeis", "poderiam"],
    conjuntivo: ["possa", "possas", "possa", "possamos", "possais", "possam"],
    gerundio: "podendo",
    participio: "podido",
  },
  querer: {
    presente: ["quero", "queres", "quer", "queremos", "quereis", "querem"],
    preterito: ["quis", "quiseste", "quis", "quisemos", "quisestes", "quiseram"],
    imperfeito: ["queria", "querias", "queria", "queríamos", "queríeis", "queriam"],
    futuro: ["quererei", "quererás", "quererá", "quereremos", "querereis", "quererão"],
    condicional: ["quereria", "quererias", "quereria", "quereríamos", "quereríeis", "quereriam"],
    conjuntivo: ["queira", "queiras", "queira", "queiramos", "queirais", "queiram"],
    gerundio: "querendo",
    participio: "querido",
  },
  dizer: {
    presente: ["digo", "dizes", "diz", "dizemos", "dizeis", "dizem"],
    preterito: ["disse", "disseste", "disse", "dissemos", "dissestes", "disseram"],
    imperfeito: ["dizia", "dizias", "dizia", "dizíamos", "dizíeis", "diziam"],
    futuro: ["direi", "dirás", "dirá", "diremos", "direis", "dirão"],
    condicional: ["diria", "dirias", "diria", "diríamos", "diríeis", "diriam"],
    conjuntivo: ["diga", "digas", "diga", "digamos", "digais", "digam"],
    gerundio: "dizendo",
    participio: "dito",
  },
  ver: {
    presente: ["vejo", "vês", "vê", "vemos", "vedes", "veem"],
    preterito: ["vi", "viste", "viu", "vimos", "vistes", "viram"],
    imperfeito: ["via", "vias", "via", "víamos", "víeis", "viam"],
    futuro: ["verei", "verás", "verá", "veremos", "vereis", "verão"],
    condicional: ["veria", "verias", "veria", "veríamos", "veríeis", "veriam"],
    conjuntivo: ["veja", "vejas", "veja", "vejamos", "vejais", "vejam"],
    gerundio: "vendo",
    participio: "visto",
  },
  haver: {
    presente: ["hei", "hás", "há", "havemos", "haveis", "hão"],
    preterito: ["houve", "houveste", "houve", "houvemos", "houvestes", "houveram"],
    imperfeito: ["havia", "havias", "havia", "havíamos", "havíeis", "haviam"],
    futuro: ["haverei", "haverás", "haverá", "haveremos", "havereis", "haverão"],
    condicional: ["haveria", "haverias", "haveria", "haveríamos", "haveríeis", "haveriam"],
    conjuntivo: ["haja", "hajas", "haja", "hajamos", "hajais", "hajam"],
    gerundio: "havendo",
    participio: "havido",
  },
};

function regular(inf) {
  const stem = inf.slice(0, -2);
  const end = inf.slice(-2);
  if (end === "ar") {
    return {
      presente: ["o", "as", "a", "amos", "ais", "am"].map((x) => stem + x),
      preterito: ["ei", "aste", "ou", "ámos", "astes", "aram"].map((x) => stem + x),
      imperfeito: ["ava", "avas", "ava", "ávamos", "áveis", "avam"].map((x) => stem + x),
      futuro: ["ei", "ás", "á", "emos", "eis", "ão"].map((x) => inf + x),
      condicional: ["ia", "ias", "ia", "íamos", "íeis", "iam"].map((x) => inf + x),
      conjuntivo: ["e", "es", "e", "emos", "eis", "em"].map((x) => stem + x),
      gerundio: stem + "ando",
      participio: stem + "ado",
    };
  }
  if (end === "er") {
    return {
      presente: ["o", "es", "e", "emos", "eis", "em"].map((x) => stem + x),
      preterito: ["i", "este", "eu", "emos", "estes", "eram"].map((x) => stem + x),
      imperfeito: ["ia", "ias", "ia", "íamos", "íeis", "iam"].map((x) => stem + x),
      futuro: ["ei", "ás", "á", "emos", "eis", "ão"].map((x) => inf + x),
      condicional: ["ia", "ias", "ia", "íamos", "íeis", "iam"].map((x) => inf + x),
      conjuntivo: ["a", "as", "a", "amos", "ais", "am"].map((x) => stem + x),
      gerundio: stem + "endo",
      participio: stem + "ido",
    };
  }
  return {
    presente: ["o", "es", "e", "imos", "is", "em"].map((x) => stem + x),
    preterito: ["i", "iste", "iu", "imos", "istes", "iram"].map((x) => stem + x),
    imperfeito: ["ia", "ias", "ia", "íamos", "íeis", "iam"].map((x) => stem + x),
    futuro: ["ei", "ás", "á", "emos", "eis", "ão"].map((x) => inf + x),
    condicional: ["ia", "ias", "ia", "íamos", "íeis", "iam"].map((x) => inf + x),
    conjuntivo: ["a", "as", "a", "amos", "ais", "am"].map((x) => stem + x),
    gerundio: stem + "indo",
    participio: stem + "ido",
  };
}

export function conjugatePt(infinitive) {
  const inf = String(infinitive || "").toLowerCase().trim();
  if (!/(ar|er|ir)$/.test(inf) && !IRREG[inf]) return null;
  const base = IRREG[inf] || regular(inf);
  return { infinitive: inf, ...base, tenses: TENSES, persons: PERSONS_PT };
}

let reverseCache = null;

function ensureReverse() {
  if (reverseCache) return reverseCache;
  reverseCache = new Map();
  const seeds = new Set([
    ...Object.keys(IRREG),
    "falar",
    "comer",
    "viver",
    "estudar",
    "trabalhar",
    "aprender",
    "escrever",
    "ler",
    "abrir",
    "fechar",
    "chegar",
    "levar",
    "chamar",
    "pensar",
    "encontrar",
    "voltar",
    "partir",
    "decidir",
    "precisar",
    "usar",
    "olhar",
    "ouvir",
    "comprar",
    "vender",
    "correr",
    "beber",
    "dormir",
    "pedir",
    "servir",
    "sentir",
    "preferir",
    "começar",
    "entender",
    "perder",
    "contar",
    "jogar",
    "mostrar",
    "morrer",
    "seguir",
    "conseguir",
    "sugerir",
    "repetir",
    "escolher",
    "conhecer",
    "parecer",
    "oferecer",
    "traduzir",
    "acreditar",
    "cair",
    "construir",
    "incluir",
  ]);
  for (const inf of seeds) {
    const c = conjugatePt(inf);
    if (!c) continue;
    for (const [tenseKey, label] of TENSES) {
      c[tenseKey].forEach((form, i) => {
        if (!form) return;
        const k = form.toLowerCase();
        const arr = reverseCache.get(k) || [];
        arr.push({
          infinitive: inf,
          tense: tenseKey,
          tenseLabel: label,
          person: PERSONS_PT[i],
          personIndex: i,
        });
        reverseCache.set(k, arr);
      });
    }
    for (const [form, kind] of [
      [c.gerundio, "副动词"],
      [c.participio, "过去分词"],
      [inf, "不定式"],
    ]) {
      const k = form.toLowerCase();
      const arr = reverseCache.get(k) || [];
      arr.push({ infinitive: inf, tense: kind, tenseLabel: kind, person: "—", personIndex: -1 });
      reverseCache.set(k, arr);
    }
  }
  return reverseCache;
}

const indexedPt = new WeakSet();

export function indexDictionaryVerbsPt(entries) {
  const map = ensureReverse();
  if (!entries || indexedPt.has(entries)) return map;
  indexedPt.add(entries);
  let added = 0;
  for (const e of entries) {
    const h = (e.h || "").toLowerCase();
    const def = e.d || "";
    const looksVerb = /\bv\.(t|i)\b|\bvt\b|\bvi\b|动词/.test(def);
    if (!/(ar|er|ir)$/.test(h) || !looksVerb || IRREG[h]) continue;
    const c = conjugatePt(h);
    if (!c) continue;
    for (const [tenseKey, label] of TENSES) {
      c[tenseKey].forEach((form, i) => {
        if (!form) return;
        const k = form.toLowerCase();
        const arr = map.get(k) || [];
        if (arr.some((x) => x.infinitive === h && x.tense === tenseKey && x.personIndex === i)) return;
        arr.push({
          infinitive: h,
          tense: tenseKey,
          tenseLabel: label,
          person: PERSONS_PT[i],
          personIndex: i,
        });
        map.set(k, arr);
      });
    }
    added += 1;
    if (added > 8000) break;
  }
  return map;
}

export function recognizePt(form) {
  const k = String(form || "").toLowerCase().trim();
  if (!k) return [];
  return ensureReverse().get(k) || [];
}

export function renderConjugationPt(conj, highlightForm = "") {
  if (!conj) return "";
  const hi = highlightForm.toLowerCase();
  const tables = TENSES.map(([key, label]) => {
    const rows = conj[key]
      .map((form, i) => {
        const active = form.toLowerCase() === hi ? " active-form" : "";
        return `<tr class="${active}"><th>${PERSONS_PT[i]}</th><td>${form}</td></tr>`;
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
