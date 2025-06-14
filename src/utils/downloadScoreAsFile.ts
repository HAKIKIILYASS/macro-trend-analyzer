
export function downloadScoreAsFile(score: any, data: any, name: string, date: Date) {
  const out = {
    name,
    date: date.toISOString(),
    totalScore: score.total_score,
    bias: score.bias,
    biasColor: score.biasColor,
    data,
    scores: score.scores,
  };
  const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/[^\w\d\-_.]+/g, "_")}_macro_score.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
