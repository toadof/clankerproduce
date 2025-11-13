export function humanReport({ score, label, reasons }) {
  const lines = [
    `Detection Result: ${label}`,
    `Anomaly Score: ${score}/100`,
    `Top Indicators:`,
    ...reasons.slice(0, 5).map(r => ` - [${r.code}] ${r.why}`)
  ];
  return lines.join('\n');
}
