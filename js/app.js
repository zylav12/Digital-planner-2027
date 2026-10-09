
document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  if (!main) return;

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const weekdays = [
    "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday"
  ];

  const existingIds = [
    "vision", "goals", "year", "month", "week",
    "day", "money", "wellness"
  ];

  const el = (tag, className, content = "") => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.innerHTML = content;
    return node;
  };

  function getSection(id, title, description) {
    let section = document.getElementById(id);

    if (!section) {
      section = document.createElement("section");
      section.id = id;
      section.className = "planner-page";
      main.appendChild(section);
    }

    section.classList.add("planner-page");
    section.innerHTML = "";

    const header = el(
      "div",
      "page-top",
      `
        <div>
          <span class="eyebrow">${title}</span>
          <h2>${description}</h2>
        </div>
        <span class="page-number"></span>
      `
    );

    section.appendChild(header);
    return section;
  }

  let pageNumber = 3;

  function addFooter(section, label) {
    const footer = el(
      "footer",
      "page-footer",
      `
        <span>2027 INTENTIONAL LIFE PLANNER</span>
        <span>${label}</span>
        <span>${String(pageNumber).padStart(3, "0")}</span>
      `
    );

    section.appendChild(footer);
    pageNumber++;
  }

  function createCard(label, title, description = "", type = "normal") {
    const card = el("article", "card" + (type === "sage" ? " sage" : ""));

    card.appendChild(el("span", "card-label", label));
    card.appendChild(el("h3", "", title));

    if (description) {
      card.appendChild(el("p", "", description));
    }

    const lines = el("div", "lines");
    card.appendChild(lines);

    return card;
  }

  function createChecklist(items) {
    const list = el("div", "checklist");

    items.forEach(item => {
      const row = el("label", "check");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.style.accentColor = "#405047";

      row.appendChild(checkbox);
      row.appendChild(el("span", "", item));
      list.appendChild(row);
    });

    return list;
  }

  function addGrid(section, cards, columns = 2) {
    const grid = el(
      "div",
      columns === 3 ? "content-grid three" : "content-grid"
    );

    cards.forEach(card => grid.appendChild(card));
    section.appendChild(grid);
  }

  function addWritingCard(section, label, title, description = "") {
    const card = createCard(label, title, description);
    section.appendChild(card);
    return card;
  }

  // Save text entries in this browser.
  // This helps preserve entries when the page is refreshed.
  function makeWritingArea(placeholder = "Write here...") {
    const area = document.createElement("textarea");
    area.placeholder = placeholder;
    area.rows = 4;
    area.style.cssText = `
      width:100%;
      min-height:110px;
      margin-top:15px;
      padding:12px;
      resize:vertical;
      border:1px solid #E7E1D7;
      border-radius:10px;
      background:#FFFFFF;
      color:#292B29;
      font:12px/1.7 'Plus Jakarta Sans',sans-serif;
    `;

    return area;
  }

  function makePage(section, label, title, description, fields) {
    const page = el("article", "planner-page");
    page.style.cssText = `
      min-height:650px;
      margin-top:24px;
      padding:28px;
      border:1px solid #E7E1D7;
      border-radius:18px;
      background:#F8F6F0;
      scroll-margin-top:20px;
    `;

    const top = el(
      "div",
      "page-top",
      `
        <div>
          <span class="eyebrow">${label}</span>
          <h2>${title}</h2>
          <p>${description}</p>
        </div>
        <span class="page-number">${String(pageNumber).padStart(3, "0")}</span>
      `
    );

    page.appendChild(top);

    const grid = el("div", "content-grid");

    fields.forEach(field => {
      const card = createCard(field.label, field.title, field.description || "");
      const area = makeWritingArea(field.placeholder || "Write your thoughts here...");
      const key = `planner-2027-${section.id}-${pageNumber}-${field.label}`;

      area.value = localStorage.getItem(key) || "";

      area.addEventListener("input", () => {
        localStorage.setItem(key, area.value);
      });

      card.appendChild(area);

      if (field.checklist) {
        card.appendChild(createChecklist(field.checklist));
      }

      grid.appendChild(card);
    });

    page.appendChild(grid);

    const footer = el(
      "footer",
      "page-footer",
      `
        <span>2027 INTENTIONAL LIFE PLANNER</span>
        <span>${label}</span>
        <span>${String(pageNumber).padStart(3, "0")}</span>
      `
    );

    page.appendChild(footer);
    pageNumber++;
    section.appendChild(page);

    return page;
  }

  // VISION
  const vision = document.getElementById("vision");

  if (vision) {
    const originalVision = vision.querySelector(".vision-grid");

    if (originalVision) {
      originalVision.style.cssText = `
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:18px;
        margin-top:28px;
      `;

      originalVision.querySelectorAll(".vision-card").forEach(card => {
        card.style.cssText = `
          min-height:200px;
          padding:24px;
          background:#FFFFFF;
          border:1px solid #E7E1D7;
          border-radius:18px;
        `;

        const lines = card.querySelector(".writing-lines");

        if (lines) {
          lines.style.cssText = `
            min-height:120px;
            margin-top:18px;
            background:repeating-linear-gradient(
              to bottom,
              transparent 0,
              transparent 27px,
              #E7E1D7 28px
            );
          `;
        }
      });
    }
  }

  // GOALS
  const goals = getSection(
    "goals",
    "02 · GOALS",
    "Turn intention into action."
  );

  addGrid(goals, [
    createCard("01 · BIG PICTURE", "My goals for 2027",
      "Choose what matters most.", "sage"),
    createCard("02 · WHY", "Why these goals matter",
      "Connect every goal to your values."),
    createCard("03 · MILESTONES", "Milestones",
      "Break large goals into smaller steps."),
    createCard("04 · ACTION", "My first next steps",
      "Start with one achievable action.")
  ]);

  goals.appendChild(createChecklist([
    "Personal growth",
    "Career and business",
    "Health and wellness",
    "Money and savings",
    "Relationships",
    "Learning and creativity"
  ]));

  addFooter(goals, "GOALS");

  // YEARLY PLANNING
  const year = getSection(
    "year",
    "03 · YEARLY PLANNING",
    "A year with intention."
  );

  addGrid(year, [
    createCard("YEAR OVERVIEW", "My 2027 at a glance",
      "What do I want this year to stand for?", "sage"),
    createCard("PRIORITIES", "My top priorities",
      "Keep your attention on what matters."),
    createCard("IMPORTANT DATES", "Dates to remember",
      "Birthdays, deadlines and milestones."),
    createCard("YEAR-END VISION", "December 2027",
      "What would make me proud?")
  ]);

  addFooter(year, "YEARLY PLANNING");

  // QUARTERLY PLANNING
  const quarterly = getSection(
    "quarterly",
    "04 · QUARTERLY PLANNING",
    "Make progress in seasons."
  );

  ["Q1 · JAN–MAR", "Q2 · APR–JUN", "Q3 · JUL–SEP", "Q4 · OCT–DEC"]
    .forEach((quarter, index) => {
      makePage(
        quarterly,
        `QUARTER ${index + 1}`,
        quarter,
        "Reflect, plan and choose your next priorities.",
        [
          { label: "VISION", title: "My focus this quarter" },
          { label: "GOALS", title: "Three key outcomes" },
          { label: "ACTION", title: "Steps I will take" },
          { label: "REFLECTION", title: "What I learned" }
        ]
      );
    });

  // MONTHLY PLANNING
  const month = getSection(
    "month",
    "05 · MONTHLY PLANNING",
    "A fresh page, every month."
  );

  months.forEach((name, index) => {
    makePage(
      month,
      `MONTH ${String(index + 1).padStart(2, "0")} · 2027`,
      name,
      "Plan your priorities, protect your time and reflect on your progress.",
      [
        {
          label: "01 · INTENTION",
          title: "My intention",
          placeholder: "This month, I want to..."
        },
        {
          label: "02 · PRIORITIES",
          title: "Top three priorities",
          checklist: ["Priority one", "Priority two", "Priority three"]
        },
        {
          label: "03 · GOALS",
          title: "Monthly goals",
          placeholder: "What would meaningful progress look like?"
        },
        {
          label: "04 · IMPORTANT DATES",
          title: "Dates and events",
          placeholder: "Add appointments, events and deadlines."
        },
        {
          label: "05 · HABITS",
          title: "Habits to nurture",
          checklist: ["Movement", "Reading", "Rest", "Reflection"]
        },
        {
          label: "06 · REFLECTION",
          title: "End-of-month review",
          placeholder: "What worked? What will I change?"
        }
      ]
    );
  });

  // WEEKLY PLANNING
  const week = getSection(
    "week",
    "06 · WEEKLY PLANNING",
    "Make room for the week ahead."
  );

  for (let index = 1; index <= 52; index++) {
    makePage(
      week,
      `WEEK ${String(index).padStart(2, "0")}`,
      `Week ${String(index).padStart(2, "0")}`,
      "A balanced week starts with clear priorities.",
      [
        {
          label: "WEEKLY FOCUS",
          title: "My top three",
          checklist: ["Most important task", "Second priority", "Third priority"]
        },
        {
          label: "MONDAY · TUESDAY",
          title: "Early week",
          placeholder: "Appointments, tasks and notes..."
        },
        {
          label: "WEDNESDAY · THURSDAY",
          title: "Midweek",
          placeholder: "Tasks, deadlines and follow-ups..."
        },
        {
          label: "FRIDAY · WEEKEND",
          title: "Finish and recharge",
          placeholder: "Wrap up, rest and personal plans..."
        },
        {
          label: "HABITS",
          title: "Weekly habit check",
          checklist: ["Movement", "Water", "Reading", "Sleep", "Self-care"]
        },
        {
          label: "REFLECTION",
          title: "What went well?",
          placeholder: "Celebrate progress and note lessons learned."
        }
      ]
    );
  }

  // DAILY PLANNING
  const day = getSection(
    "day",
    "07 · DAILY PLANNING",
    "One day at a time."
  );

  for (let index = 1; index <= 30; index++) {
    makePage(
      day,
      `DAILY PAGE ${String(index).padStart(2, "0")}`,
      `Today's plan · ${String(index).padStart(2, "0")}`,
      "Focus on what matters today, while leaving space to breathe.",
      [
        {
          label: "DAILY INTENTION",
          title: "Today's focus",
          placeholder: "Today, I want to feel..."
        },
        {
          label: "TOP THREE",
          title: "My priorities",
          checklist: ["Priority one", "Priority two", "Priority three"]
        },
        {
          label: "SCHEDULE",
          title: "Plan my time",
          placeholder: "Morning:\nAfternoon:\nEvening:"
        },
        {
          label: "WELLNESS",
          title: "Care for myself",
          checklist: ["Drink water", "Move my body", "Take a break", "Rest"]
        },
        {
          label: "GRATITUDE",
          title: "Something good",
          placeholder: "One thing I appreciate today..."
        },
        {
          label: "EVENING REFLECTION",
          title: "Close the day",
          placeholder: "What went well? What can wait until tomorrow?"
        }
      ]
    );
  }

  // FINANCE
  const money = getSection(
    "money",
    "08 · FINANCE",
    "Give your money direction."
  );

  addGrid(money, [
    createCard("MONTHLY BUDGET", "Income and expenses",
      "Record expected income and spending."),
    createCard("SAVINGS", "Savings goals",
      "Choose a target and track your progress.", "sage"),
    createCard("BILLS", "Bills and due dates",
      "Keep recurring payments in one place."),
    createCard("SPENDING", "Spending reflection",
      "Notice patterns without judgement."),
    createCard("DEBT TRACKER", "Debt repayment plan",
      "Record balances, payments and milestones."),
    createCard("YEAR-END", "My financial review",
      "Celebrate progress and plan the next step.")
  ]);

  addFooter(money, "FINANCE");

  // WELLNESS
  const wellness = getSection(
    "wellness",
    "09 · WELLNESS",
    "Care for the person behind the plans."
  );

  addGrid(wellness, [
    createCard("MOOD", "How am I feeling?",
      "Check in with yourself without judgement.", "sage"),
    createCard("ENERGY", "My energy levels",
      "Notice what restores and drains your energy."),
    createCard("SLEEP", "Sleep reflection",
      "Build a gentle, sustainable rest routine."),
    createCard("MOVEMENT", "Movement tracker",
      "Choose movement that feels good."),
    createCard("WATER", "Hydration",
      "Create a simple daily water routine."),
    createCard("REFLECTION", "My wellness review",
      "What does my body and mind need?")
  ]);

  addFooter(wellness, "WELLNESS");

  // MEAL PLANNING
  const meals = getSection(
    "meals",
    "10 · MEAL PLANNING",
    "Make everyday meals easier."
  );

  addGrid(meals, [
    createCard("WEEKLY MENU", "Plan my meals",
      "Breakfast, lunch, dinner and snacks."),
    createCard("GROCERY LIST", "Shopping essentials",
      "Group ingredients by category."),
    createCard("FAVOURITES", "Meals I love",
      "Save easy, reliable meal ideas."),
    createCard("KITCHEN NOTES", "Use what I have",
      "Plan around ingredients already available.")
  ]);

  addFooter(meals, "MEAL PLANNING");

  // LIFE ADMIN
  const admin = getSection(
    "life-admin",
    "11 · LIFE ADMIN",
    "Keep life's details in order."
  );

  addGrid(admin, [
    createCard("HOME", "Home management",
      "Maintenance, cleaning and household tasks."),
    createCard("APPOINTMENTS", "Important appointments",
      "Keep upcoming dates and follow-ups visible."),
    createCard("DOCUMENTS", "Document checklist",
      "Track documents that need attention."),
    createCard("TO-DO", "Life admin tasks",
      "Small tasks that make life run smoothly.")
  ]);

  addFooter(admin, "LIFE ADMIN");

  // SELF-CARE
  const selfcare = getSection(
    "self-care",
    "12 · SELF-CARE",
    "Make care part of your routine."
  );

  addGrid(selfcare, [
    createCard("MY RESET", "When I need a reset",
      "Choose small steps that help you feel grounded.", "sage"),
    createCard("JOY LIST", "Things that make me happy",
      "Collect simple sources of joy."),
    createCard("BOUNDARIES", "Protect my energy",
      "What do I need more or less of?"),
    createCard("REST", "My gentle reset plan",
      "Make space for rest without guilt.")
  ]);

  addFooter(selfcare, "SELF-CARE");

  // LEARNING AND PROJECTS
  const learning = getSection(
    "learning",
    "13 · LEARNING & PROJECTS",
    "Keep growing, one step at a time."
  );

  addGrid(learning, [
    createCard("PROJECT PLANNER", "Project overview",
      "Define the outcome, milestones and next action."),
    createCard("LEARNING", "Skills I want to build",
      "Choose what you want to learn this year."),
    createCard("READING", "Reading list",
      "Track books, articles and useful ideas."),
    createCard("IDEAS", "Ideas worth exploring",
      "Capture ideas before they disappear.")
  ]);

  addFooter(learning, "LEARNING & PROJECTS");

  // NOTES
  const notes = getSection(
    "notes",
    "14 · NOTES",
    "A little space to think."
  );

  ["Lined Notes", "Free Thoughts", "Meeting Notes", "Ideas & Inspiration",
   "Cornell Notes", "Project Notes"].forEach((title, index) => {
    makePage(
      notes,
      `NOTES ${String(index + 1).padStart(2, "0")}`,
      title,
      "Use this page to capture thoughts, questions and ideas.",
      [
        {
          label: "NOTES",
          title: "Write freely",
          placeholder: "Start writing here..."
        },
        {
          label: "KEY TAKEAWAYS",
          title: "What matters most?",
          placeholder: "Summarise the most useful points."
        }
      ]
    );
  });

  addFooter(notes, "NOTES");

  // BONUS
  const bonus = getSection(
    "bonus",
    "15 · BONUS",
    "Extra space for your life."
  );

  addGrid(bonus, [
    createCard("WISH LIST", "Things I want to experience",
      "Collect meaningful experiences and dreams."),
    createCard("MEMORIES", "Moments worth remembering",
      "Save the little things that matter."),
    createCard("2027 HIGHLIGHTS", "My year in moments",
      "Record your favourite memories."),
    createCard("FUTURE ME", "A letter to myself",
      "Write a note to the person you are becoming.")
  ]);

  addFooter(bonus, "BONUS");

  // STICKY NAVIGATION
  if (!document.querySelector(".sticky-nav")) {
    const nav = el("nav", "sticky-nav");

    const links = [
      ["HOME", "#"],
      ["VISION", "#vision"],
      ["GOALS", "#goals"],
      ["YEAR", "#year"],
      ["MONTH", "#month"],
      ["WEEK", "#week"],
      ["DAY", "#day"],
      ["MONEY", "#money"],
      ["WELLNESS", "#wellness"],
      ["NOTES", "#notes"]
    ];

    links.forEach(([label, href]) => {
      const a = el("a", "", label);
      a.href = href;
      nav.appendChild(a);
    });

    document.body.appendChild(nav);
  }

  // COMPLETE THE DASHBOARD LINKS
  const plannerNav = document.querySelector(".planner-nav");

  if (plannerNav) {
    const links = [
      ["Meals", "#meals"],
      ["Life Admin", "#life-admin"],
      ["Self-Care", "#self-care"],
      ["Learning", "#learning"],
      ["Notes", "#notes"],
      ["Bonus", "#bonus"]
    ];

    links.forEach(([label, href]) => {
      if (!plannerNav.querySelector(`a[href="${href}"]`)) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = label;
        plannerNav.appendChild(a);
      }
    });
  }

  // Keep the new pages visually consistent.
  const style = document.createElement("style");

  style.textContent = `
    textarea:focus {
      outline: 1px solid #A8B5A0;
      border-color: #A8B5A0 !important;
    }

    .planner-page textarea {
      box-sizing: border-box;
    }

    .planner-page input[type="checkbox"] {
      cursor: pointer;
    }

    @media(max-width:700px) {
      .vision-grid,
      .content-grid,
      .content-grid.three {
        grid-template-columns:1fr !important;
      }
    }

    @media print {
      .sticky-nav {
        display:none !important;
      }

      .planner-page {
        break-after:page;
      }

      textarea {
        border-color:#E7E1D7 !important;
      }
    }
  `;

  document.head.appendChild(style);

  console.log("2027 Intentional Life Planner loaded successfully.");
});
