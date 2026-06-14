(function () {
  const intro = document.getElementById("assessment-intro");
  if (!intro) return;
  const test = document.getElementById("assessment-test");
  const startButton = document.getElementById("start-assessment");
  const nameInput = document.getElementById("participant-name");
  const saved = JSON.parse(localStorage.getItem("future6Progress") || "null");
  let answers = saved?.answers || Array(QUESTIONS.length).fill(null);
  let current = saved?.current || 0;

  if (new URLSearchParams(location.search).has("restart")) {
    localStorage.removeItem("future6Progress");
    localStorage.removeItem("future6Result");
    answers = Array(QUESTIONS.length).fill(null);
    current = 0;
  } else if (saved?.name) {
    nameInput.value = saved.name;
    startButton.textContent = "이어서 진단하기 →";
  }

  function saveProgress() {
    localStorage.setItem("future6Progress", JSON.stringify({ answers, current, name: nameInput.value.trim() }));
  }

  function begin() {
    intro.classList.add("hidden");
    test.classList.remove("hidden");
    document.body.classList.add("test-active");
    renderQuestion();
    scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderQuestion() {
    const q = QUESTIONS[current];
    const c = FUTURE6.find(item => item.id === q.competency);
    const answeredCount = answers.filter(v => v !== null).length;
    document.getElementById("progress-domain").textContent = `${c.name} · ${c.factors[q.factor]}`;
    document.getElementById("current-number").textContent = current + 1;
    document.getElementById("progress-bar").style.width = `${Math.max(((current + 1) / QUESTIONS.length) * 100, (answeredCount / QUESTIONS.length) * 100)}%`;
    document.getElementById("question-domain").innerHTML = `<span style="--domain:${c.color}">${c.code}</span>${c.name} / ${c.factors[q.factor]}`;
    document.getElementById("question-number").textContent = `QUESTION ${String(current + 1).padStart(2, "0")}`;
    document.getElementById("question-text").textContent = q.text;
    const options = document.getElementById("answer-options");
    options.innerHTML = SCALE_LABELS.map(item => `
      <label class="answer-option ${answers[current] === item.value ? "selected" : ""}">
        <input type="radio" name="answer" value="${item.value}" ${answers[current] === item.value ? "checked" : ""}>
        <span class="scale-number">${item.value}</span><span class="scale-label">${item.label}</span><i></i>
      </label>`).join("");
    options.querySelectorAll("input").forEach(input => input.addEventListener("change", e => {
      answers[current] = Number(e.target.value);
      saveProgress();
      options.querySelectorAll(".answer-option").forEach(label => label.classList.toggle("selected", label.contains(e.target)));
      document.getElementById("next-question").disabled = false;
    }));
    document.getElementById("prev-question").disabled = current === 0;
    const next = document.getElementById("next-question");
    next.disabled = answers[current] === null;
    next.textContent = current === QUESTIONS.length - 1 ? "결과 확인하기 →" : "다음 →";
  }

  function finish() {
    const scored = {};
    FUTURE6.forEach(c => {
      const domainQuestions = QUESTIONS.filter(q => q.competency === c.id);
      const factorScores = c.factors.map((_, factorIndex) => {
        const qs = domainQuestions.filter(q => q.factor === factorIndex);
        const sum = qs.reduce((total, q) => {
          const raw = answers[q.id - 1];
          return total + (q.reverse ? 6 - raw : raw);
        }, 0);
        return Math.round(((sum - qs.length) / (qs.length * 4)) * 100);
      });
      scored[c.id] = { score: Math.round(factorScores.reduce((a, b) => a + b, 0) / factorScores.length), factors: factorScores };
    });
    localStorage.setItem("future6Result", JSON.stringify({
      name: nameInput.value.trim() || "나",
      date: new Date().toISOString(),
      answers,
      scores: scored
    }));
    localStorage.removeItem("future6Progress");
    location.href = "result.html";
  }

  startButton.addEventListener("click", begin);
  document.getElementById("prev-question").addEventListener("click", () => { if (current > 0) { current--; saveProgress(); renderQuestion(); } });
  document.getElementById("next-question").addEventListener("click", () => {
    if (answers[current] === null) return;
    if (current < QUESTIONS.length - 1) { current++; saveProgress(); renderQuestion(); }
    else finish();
  });
  document.addEventListener("keydown", e => {
    if (test.classList.contains("hidden")) return;
    if (["1", "2", "3", "4", "5"].includes(e.key)) {
      const input = document.querySelector(`input[name="answer"][value="${e.key}"]`);
      if (input) { input.checked = true; input.dispatchEvent(new Event("change", { bubbles: true })); }
    }
  });
})();
