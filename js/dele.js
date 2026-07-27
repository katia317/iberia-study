function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("\n", "<br>");
}

export function createDeleController({ data, root, onExit }) {
  const state = {
    level: data.level,
    mode: "reading",
    index: 0,
    selected: null,
    checked: false,
    score: 0,
    answered: 0,
    finished: false,
    writingNote: "",
  };

  function items() {
    return data.modes[state.mode]?.items || [];
  }

  function current() {
    return items()[state.index];
  }

  function setMode(mode) {
    state.mode = mode;
    state.index = 0;
    state.selected = null;
    state.checked = false;
    state.score = 0;
    state.answered = 0;
    state.finished = false;
    state.writingNote = "";
    render();
  }

  function selectOption(i) {
    if (state.checked || state.finished) return;
    state.selected = i;
    render();
  }

  function checkAnswer() {
    const item = current();
    if (!item || item.type === "writing" || item.type === "oral") return;
    if (state.selected == null || state.checked) return;
    state.checked = true;
    state.answered += 1;
    if (state.selected === item.answer) state.score += 1;
    render();
  }

  function next() {
    if (state.index >= items().length - 1) {
      state.finished = true;
      render();
      return;
    }
    state.index += 1;
    state.selected = null;
    state.checked = false;
    state.writingNote = "";
    render();
  }

  function restart() {
    state.index = 0;
    state.selected = null;
    state.checked = false;
    state.score = 0;
    state.answered = 0;
    state.finished = false;
    state.writingNote = "";
    render();
  }

  function renderOptions(item) {
    return item.options
      .map((opt, i) => {
        let cls = "option";
        if (state.selected === i) cls += " selected";
        if (state.checked) {
          if (i === item.answer) cls += " correct";
          else if (state.selected === i) cls += " wrong";
        }
        return `<button class="${cls}" data-opt="${i}" ${state.checked ? "disabled" : ""}>${escapeHtml(opt)}</button>`;
      })
      .join("");
  }

  function renderQuestion() {
    if (state.finished) {
      const total = items().filter((i) => i.type !== "writing" && i.type !== "oral").length;
      const isPractice = total === 0;
      return `
        <section class="scoreboard">
          <p class="hint">${escapeHtml(data.title)} · ${escapeHtml(data.modes[state.mode].label)}</p>
          <p class="big">${isPractice ? "练习完成" : `${state.score} / ${total}`}</p>
          <p>${isPractice ? "写作/口语提示已浏览完毕，可返回继续练习其他题型。" : "继续保持，错题可结合词典查生词。"}</p>
          <div class="actions" style="justify-content:center;margin-top:1rem">
            <button class="btn btn-primary" data-action="restart">再做一遍</button>
            <button class="btn btn-secondary" data-action="exit">返回选级</button>
          </div>
        </section>
      `;
    }

    const item = current();
    const list = items();
    const pct = ((state.index + 1) / list.length) * 100;

    let body = "";
    if (item.type === "reading") {
      body = `
        <div class="passage">${escapeHtml(item.passage)}</div>
        <p><strong>${escapeHtml(item.prompt)}</strong></p>
        <div class="options">${renderOptions(item)}</div>
        ${
          state.checked
            ? `<div class="feedback ${state.selected === item.answer ? "ok" : "bad"}">${escapeHtml(item.explanation)}</div>`
            : ""
        }
        <div class="actions">
          ${
            state.checked
              ? `<button class="btn btn-primary" data-action="next">下一题</button>`
              : `<button class="btn btn-primary" data-action="check" ${state.selected == null ? "disabled" : ""}>核对答案</button>`
          }
        </div>
      `;
    } else if (item.type === "mcq") {
      body = `
        <p><strong>${escapeHtml(item.prompt)}</strong></p>
        <div class="options">${renderOptions(item)}</div>
        ${
          state.checked
            ? `<div class="feedback ${state.selected === item.answer ? "ok" : "bad"}">${escapeHtml(item.explanation)}</div>`
            : ""
        }
        <div class="actions">
          ${
            state.checked
              ? `<button class="btn btn-primary" data-action="next">下一题</button>`
              : `<button class="btn btn-primary" data-action="check" ${state.selected == null ? "disabled" : ""}>核对答案</button>`
          }
        </div>
      `;
    } else {
      const checklist = (item.checklist || [])
        .map((c) => `<li>${escapeHtml(c)}</li>`)
        .join("");
      body = `
        <p><strong>${escapeHtml(item.prompt)}</strong></p>
        <div class="writing-area">
          <textarea data-writing placeholder="在此打草稿或记下要点（仅保存在本页，刷新会清空）…">${state.writingNote
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")}</textarea>
        </div>
        <ul class="checklist">${checklist}</ul>
        ${item.model ? `<div class="feedback">${escapeHtml(item.model)}</div>` : ""}
        <div class="actions">
          <button class="btn btn-primary" data-action="next">下一题</button>
        </div>
      `;
    }

    return `
      <section class="quiz">
        <div class="quiz-meta">
          <span>${escapeHtml(item.title)}</span>
          <span>${state.index + 1} / ${list.length}</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="question-block">
          <h2>${escapeHtml(data.modes[state.mode].label)}</h2>
          ${body}
        </div>
      </section>
    `;
  }

  function render() {
    const modes = Object.entries(data.modes)
      .map(
        ([key, mode]) =>
          `<button class="${state.mode === key ? "active" : ""}" data-mode="${key}">${escapeHtml(mode.label)}</button>`
      )
      .join("");

    root.innerHTML = `
      <div class="page-head">
        <h1>${escapeHtml(data.title)}</h1>
        <p>做例题、看解析；写作/口语提供评分要点，便于对照练习。</p>
      </div>
      <div class="toolbar">
        <div class="segmented mode-row">${modes}</div>
        <button class="btn btn-secondary" data-action="exit">换难度</button>
      </div>
      ${renderQuestion()}
    `;
  }

  root.onclick = (e) => {
    const modeBtn = e.target.closest("[data-mode]");
    if (modeBtn) {
      setMode(modeBtn.dataset.mode);
      return;
    }
    const opt = e.target.closest("[data-opt]");
    if (opt) {
      selectOption(Number(opt.dataset.opt));
      return;
    }
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (action === "check") checkAnswer();
    if (action === "next") next();
    if (action === "restart") restart();
    if (action === "exit") onExit?.();
  };

  root.oninput = (e) => {
    if (e.target.matches("[data-writing]")) {
      state.writingNote = e.target.value;
    }
  };

  render();
  return { destroy: () => { root.onclick = null; root.oninput = null; } };
}
