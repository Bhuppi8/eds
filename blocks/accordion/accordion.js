export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [label, body] = row.children;

    const summary = document.createElement("summary");
    summary.className = "accordion-item-label";
    summary.textContent = label.textContent.trim();

    body.className = "accordion-item-body";

    const details = document.createElement("details");
    details.className = "accordion-item";
    details.append(summary, body);

    row.replaceWith(details);
  });
}
