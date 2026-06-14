(function () {
  const raw = localStorage.getItem("future6Result");
  const main = document.getElementById("result-main");
  const empty = document.getElementById("empty-result");
  if (!raw) {
    main.classList.add("hidden");
    empty.classList.remove("hidden");
    return;
  }
  const result = JSON.parse(raw);
  const rows = FUTURE6.map(c => ({ ...c, ...result.scores[c.id] })).sort((a, b) => b.score - a.score);
  const total = Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length);
  const level = getLevel(total);
  const strongest = rows[0];
  const growth = rows[rows.length - 1];

  document.getElementById("result-name").textContent = result.name;
  document.getElementById("result-date").textContent = `${new Date(result.date).toLocaleDateString("ko-KR")} 진단 완료`;
  document.getElementById("total-score").textContent = total;
  document.getElementById("total-level").textContent = level.name;
  document.getElementById("total-level").className = `big-level ${level.key}`;
  document.getElementById("total-comment").textContent = level.comment;
  document.getElementById("strength-title").textContent = strongest.name;
  document.getElementById("strength-copy").textContent = strongest.high;
  document.getElementById("growth-title").textContent = growth.name;
  document.getElementById("growth-copy").textContent = growth.low;

  document.getElementById("score-bars").innerHTML = FUTURE6.map(c => {
    const data = result.scores[c.id];
    const l = getLevel(data.score);
    return `<article class="score-bar-row" style="--accent:${c.color}"><div class="score-label"><span>${c.code}</span><div><b>${c.name}</b><small>${c.en}</small></div></div><div class="bar-area"><div class="bar-track"><i style="width:${data.score}%"></i></div><span class="bar-level ${l.key}">${l.name}</span></div><strong>${data.score}</strong></article>`;
  }).join("");

  document.getElementById("subfactor-grid").innerHTML = FUTURE6.map(c => {
    const data = result.scores[c.id];
    return `<article class="subfactor-card" style="--accent:${c.color}"><div class="subfactor-head"><span>${c.code}</span><h3>${c.name}</h3><b>${data.score}</b></div>${c.factors.map((f, i) => `<div class="mini-bar"><label><span>${f}</span><b>${data.factors[i]}</b></label><div><i style="width:${data.factors[i]}%"></i></div></div>`).join("")}</article>`;
  }).join("");

  document.getElementById("action-grid").innerHTML = growth.actions.map((action, i) => `<article><span>${String(i + 1).padStart(2, "0")}</span><p>${action}</p><small>${growth.name} 성장 행동</small></article>`).join("");

  drawRadar(document.getElementById("radar-chart"), FUTURE6.map(c => result.scores[c.id].score));

  function drawRadar(canvas, values) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const cx = w / 2, cy = h / 2 + 4, radius = 165;
    const points = (scale = 1) => FUTURE6.map((_, i) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * i) / 6;
      return [cx + Math.cos(angle) * radius * scale, cy + Math.sin(angle) * radius * scale];
    });
    ctx.clearRect(0, 0, w, h);
    [0.25, 0.5, 0.75, 1].forEach(scale => {
      const p = points(scale);
      ctx.beginPath(); p.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
      ctx.strokeStyle = "rgba(255,255,255,.16)"; ctx.lineWidth = 1; ctx.stroke();
    });
    points(1).forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.stroke(); });
    const valuePoints = FUTURE6.map((_, i) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * i) / 6;
      return [cx + Math.cos(angle) * radius * values[i] / 100, cy + Math.sin(angle) * radius * values[i] / 100];
    });
    ctx.beginPath(); valuePoints.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
    const gradient = ctx.createLinearGradient(100, 80, 450, 390); gradient.addColorStop(0, "rgba(255,107,74,.65)"); gradient.addColorStop(1, "rgba(54,102,245,.55)");
    ctx.fillStyle = gradient; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.stroke();
    valuePoints.forEach(([x, y], i) => { ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fillStyle = FUTURE6[i].color; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke(); });
    ctx.font = "700 17px 'Noto Sans KR'"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    FUTURE6.forEach((c, i) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * i) / 6;
      const x = cx + Math.cos(angle) * (radius + 42), y = cy + Math.sin(angle) * (radius + 35);
      ctx.fillStyle = "#fff"; ctx.fillText(c.name, x, y);
      ctx.font = "700 14px Manrope"; ctx.fillStyle = c.color; ctx.fillText(String(values[i]), x, y + 22);
      ctx.font = "700 17px 'Noto Sans KR'";
    });
  }
})();
