let instance = 0;

export default function decorate(block) {
  instance += 1;
  const prefix = `tabs-${instance}`;

  const tablist = document.createElement("div");
  tablist.className = "tabs-list";
  tablist.setAttribute("role", "tablist");

  const tabs = [];
  const panels = [];

  [...block.children].forEach((row, i) => {
    const [label, content] = row.children;

    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "tabs-tab";
    tab.id = `${prefix}-tab-${i}`;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", `${prefix}-panel-${i}`);
    tab.textContent = label.textContent.trim();

    content.className = "tabs-panel";
    content.id = `${prefix}-panel-${i}`;
    content.setAttribute("role", "tabpanel");
    content.setAttribute("aria-labelledby", tab.id);

    tabs.push(tab);
    panels.push(content);
    tablist.append(tab);
  });

  function select(index, focus = false) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (focus) tabs[index].focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i));
  });

  tablist.addEventListener("keydown", (e) => {
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    let next = null;
    if (e.key === "ArrowRight") next = (current + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next !== null) {
      e.preventDefault();
      select(next, true);
    }
  });

  block.replaceChildren(tablist, ...panels);
  select(0);
}
