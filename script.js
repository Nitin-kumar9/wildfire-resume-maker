/* =========================================================
   WILDFIRE RESUME BUILDER V2
   COMPLETE JAVASCRIPT ENGINE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     HELPERS
  ======================================================= */

  const $ = (id) => document.getElementById(id);

  const escapeHTML = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const storageKey = "wildfireResumeBuilderV2";

  let zoom = 0.70;

  let data = {
    personal: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      linkedin: "",
      github: ""
    },

    summary: "",

    education: [],

    experience: [],

    projects: [],

    skills: [],

    certifications: [],

    achievements: [],

    por: [],

    languages: [],

    interests: [],

    template: "minimal"
  };


  /* =======================================================
     TOAST
  ======================================================= */

  function showToast(title, message, icon = "✓") {

    const toast = $("toast");

    $("toastIcon").textContent = icon;
    $("toastTitle").textContent = title;
    $("toastMessage").textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }


  /* =======================================================
     SAVE
  ======================================================= */

  function saveData() {

    collectData();

    localStorage.setItem(
      storageKey,
      JSON.stringify(data)
    );

    updateCompletion();
    updateATS();
  }


  /* =======================================================
     COLLECT BASIC DATA
  ======================================================= */

  function collectData() {

    data.personal.fullName =
      $("fullName")?.value.trim() || "";

    data.personal.jobTitle =
      $("jobTitle")?.value.trim() || "";

    data.personal.email =
      $("email")?.value.trim() || "";

    data.personal.phone =
      $("phone")?.value.trim() || "";

    data.personal.linkedin =
      $("linkedin")?.value.trim() || "";

    data.personal.github =
      $("github")?.value.trim() || "";

    data.summary =
      $("summary")?.value.trim() || "";

    data.template =
      $("templateSelect")?.value || "minimal";
  }


  /* =======================================================
     RESTORE
  ======================================================= */

  function restoreData() {

    const saved = localStorage.getItem(storageKey);

    if (!saved) {

      addEducation();
      addProject();

      renderAll();

      return;
    }

    try {

      const parsed = JSON.parse(saved);

      data = {
        ...data,
        ...parsed,

        personal: {
          ...data.personal,
          ...(parsed.personal || {})
        }
      };

      fillPersonalFields();

      renderDynamicLists();

      renderTags();

      $("templateSelect").value =
        data.template || "minimal";

      renderAll();

    } catch (error) {

      console.error(error);

      addEducation();
      addProject();

      renderAll();
    }
  }


  /* =======================================================
     FILL PERSONAL
  ======================================================= */

  function fillPersonalFields() {

    $("fullName").value =
      data.personal.fullName || "";

    $("jobTitle").value =
      data.personal.jobTitle || "";

    $("email").value =
      data.personal.email || "";

    $("phone").value =
      data.personal.phone || "";

    $("linkedin").value =
      data.personal.linkedin || "";

    $("github").value =
      data.personal.github || "";

    $("summary").value =
      data.summary || "";

    updateSummaryCount();
  }


  /* =======================================================
     COLLAPSIBLE CARDS
  ======================================================= */

  document.querySelectorAll("[data-toggle]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const targetID =
          button.dataset.toggle;

        const content = $(targetID);

        if (!content) return;

        const card =
          button.closest(".form-card");

        content.classList.toggle("open");

        card?.classList.toggle(
          "active",
          content.classList.contains("open")
        );
      });

    });


  /* =======================================================
     DYNAMIC EDUCATION
  ======================================================= */

  function addEducation(item = {}) {

    data.education.push({
      college: item.college || "",
      degree: item.degree || "",
      year: item.year || "",
      score: item.score || ""
    });

    renderEducation();
    saveData();
  }


  function renderEducation() {

    const container = $("educationList");

    container.innerHTML = "";

    data.education.forEach((item, index) => {

      const div =
        document.createElement("div");

      div.className = "dynamic-item";

      div.innerHTML = `

        <div class="item-top">

          <span class="item-number">
            EDUCATION ${index + 1}
          </span>

          <button
            class="remove-item"
            data-remove-education="${index}">
            Remove
          </button>

        </div>

        <div class="input-group">

          <label>College / School</label>

          <input
            data-field="college"
            data-index="${index}"
            value="${escapeHTML(item.college)}"
            placeholder="College / School name"
          />

        </div>

        <div class="input-group">

          <label>Degree</label>

          <input
            data-field="degree"
            data-index="${index}"
            value="${escapeHTML(item.degree)}"
            placeholder="B.Tech CSE (AI-ML)"
          />

        </div>

        <div class="two-column">

          <div class="input-group">

            <label>Batch / Year</label>

            <input
              data-field="year"
              data-index="${index}"
              value="${escapeHTML(item.year)}"
              placeholder="2026 - 2030"
            />

          </div>

          <div class="input-group">

            <label>CGPA / Percentage</label>

            <input
              data-field="score"
              data-index="${index}"
              value="${escapeHTML(item.score)}"
              placeholder="8.5 CGPA"
            />

          </div>

        </div>
      `;

      container.appendChild(div);
    });


    container.querySelectorAll("[data-field]")
      .forEach(input => {

        input.addEventListener("input", e => {

          const index =
            Number(e.target.dataset.index);

          const field =
            e.target.dataset.field;

          data.education[index][field] =
            e.target.value;

          saveData();

          renderEducationPreview();
        });

      });


    container.querySelectorAll(
      "[data-remove-education]"
    ).forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.removeEducation);

        data.education.splice(index, 1);

        renderEducation();

        saveData();

        renderEducationPreview();
      });

    });
  }


  $("addEducation").addEventListener(
    "click",
    () => addEducation()
  );


  /* =======================================================
     EXPERIENCE
  ======================================================= */

  function addExperience(item = {}) {

    data.experience.push({
      role: item.role || "",
      company: item.company || "",
      duration: item.duration || "",
      description: item.description || ""
    });

    renderExperience();
    saveData();
  }


  function renderExperience() {

    const container = $("experienceList");

    container.innerHTML = "";

    data.experience.forEach((item, index) => {

      const div =
        document.createElement("div");

      div.className = "dynamic-item";

      div.innerHTML = `

        <div class="item-top">

          <span class="item-number">
            EXPERIENCE ${index + 1}
          </span>

          <button
            class="remove-item"
            data-remove-experience="${index}">
            Remove
          </button>

        </div>

        <div class="input-group">

          <label>Role</label>

          <input
            data-field="role"
            data-index="${index}"
            value="${escapeHTML(item.role)}"
            placeholder="Software Developer Intern"
          />

        </div>

        <div class="input-group">

          <label>Company</label>

          <input
            data-field="company"
            data-index="${index}"
            value="${escapeHTML(item.company)}"
            placeholder="Company name"
          />

        </div>

        <div class="input-group">

          <label>Duration</label>

          <input
            data-field="duration"
            data-index="${index}"
            value="${escapeHTML(item.duration)}"
            placeholder="Jun 2026 - Aug 2026"
          />

        </div>

        <div class="input-group">

          <label>Description / Responsibilities</label>

          <textarea
            data-field="description"
            data-index="${index}"
            rows="4"
            placeholder="Describe your work...">${escapeHTML(item.description)}</textarea>

        </div>
      `;

      container.appendChild(div);
    });


    container.querySelectorAll("[data-field]")
      .forEach(input => {

        input.addEventListener("input", e => {

          const index =
            Number(e.target.dataset.index);

          const field =
            e.target.dataset.field;

          data.experience[index][field] =
            e.target.value;

          saveData();

          renderExperiencePreview();
        });

      });


    container.querySelectorAll(
      "[data-remove-experience]"
    ).forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.removeExperience);

        data.experience.splice(index, 1);

        renderExperience();

        saveData();

        renderExperiencePreview();
      });

    });
  }


  $("addExperience").addEventListener(
    "click",
    () => addExperience()
  );


  /* =======================================================
     PROJECTS
  ======================================================= */

  function addProject(item = {}) {

    data.projects.push({
      title: item.title || "",
      stack: item.stack || "",
      description: item.description || ""
    });

    renderProjects();
    saveData();
  }


  function renderProjects() {

    const container = $("projectList");

    container.innerHTML = "";

    data.projects.forEach((item, index) => {

      const div =
        document.createElement("div");

      div.className = "dynamic-item";

      div.innerHTML = `

        <div class="item-top">

          <span class="item-number">
            PROJECT ${index + 1}
          </span>

          <button
            class="remove-item"
            data-remove-project="${index}">
            Remove
          </button>

        </div>

        <div class="input-group">

          <label>Project Title</label>

          <input
            data-field="title"
            data-index="${index}"
            value="${escapeHTML(item.title)}"
            placeholder="Wildfire Resume Builder"
          />

        </div>

        <div class="input-group">

          <label>Tech Stack</label>

          <input
            data-field="stack"
            data-index="${index}"
            value="${escapeHTML(item.stack)}"
            placeholder="HTML, CSS, JavaScript"
          />

        </div>

        <div class="input-group">

          <label>Description</label>

          <textarea
            data-field="description"
            data-index="${index}"
            rows="4"
            placeholder="Explain what you built...">${escapeHTML(item.description)}</textarea>

        </div>
      `;

      container.appendChild(div);
    });


    container.querySelectorAll("[data-field]")
      .forEach(input => {

        input.addEventListener("input", e => {

          const index =
            Number(e.target.dataset.index);

          const field =
            e.target.dataset.field;

          data.projects[index][field] =
            e.target.value;

          saveData();

          renderProjectsPreview();
        });

      });


    container.querySelectorAll(
      "[data-remove-project]"
    ).forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.removeProject);

        data.projects.splice(index, 1);

        renderProjects();

        saveData();

        renderProjectsPreview();
      });

    });
  }


  $("addProject").addEventListener(
    "click",
    () => addProject()
  );


  /* =======================================================
     CERTIFICATIONS
  ======================================================= */

  function addCertification(item = {}) {

    data.certifications.push({
      name: item.name || "",
      issuer: item.issuer || "",
      year: item.year || ""
    });

    renderCertifications();
    saveData();
  }


  function renderCertifications() {

    const container =
      $("certificationList");

    container.innerHTML = "";

    data.certifications.forEach(
      (item, index) => {

        const div =
          document.createElement("div");

        div.className = "dynamic-item";

        div.innerHTML = `

          <div class="item-top">

            <span class="item-number">
              CERTIFICATION ${index + 1}
            </span>

            <button
              class="remove-item"
              data-remove-certification="${index}">
              Remove
            </button>

          </div>

          <div class="input-group">

            <label>Certification</label>

            <input
              data-field="name"
              data-index="${index}"
              value="${escapeHTML(item.name)}"
              placeholder="Certification name"
            />

          </div>

          <div class="two-column">

            <div class="input-group">

              <label>Issuer</label>

              <input
                data-field="issuer"
                data-index="${index}"
                value="${escapeHTML(item.issuer)}"
                placeholder="Google / Microsoft"
              />

            </div>

            <div class="input-group">

              <label>Year</label>

              <input
                data-field="year"
                data-index="${index}"
                value="${escapeHTML(item.year)}"
                placeholder="2026"
              />

            </div>

          </div>
        `;

        container.appendChild(div);
      }
    );


    container.querySelectorAll("[data-field]")
      .forEach(input => {

        input.addEventListener("input", e => {

          const index =
            Number(e.target.dataset.index);

          const field =
            e.target.dataset.field;

          data.certifications[index][field] =
            e.target.value;

          saveData();

          renderCertificationsPreview();
        });

      });


    container.querySelectorAll(
      "[data-remove-certification]"
    ).forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.removeCertification);

        data.certifications.splice(index, 1);

        renderCertifications();

        saveData();

        renderCertificationsPreview();
      });

    });
  }


  $("addCertification").addEventListener(
    "click",
    () => addCertification()
  );


  /* =======================================================
     ACHIEVEMENTS
  ======================================================= */

  function addAchievement(item = {}) {

    data.achievements.push({
      text: item.text || ""
    });

    renderAchievements();
    saveData();
  }


  function renderAchievements() {

    const container =
      $("achievementList");

    container.innerHTML = "";

    data.achievements.forEach(
      (item, index) => {

        const div =
          document.createElement("div");

        div.className = "dynamic-item";

        div.innerHTML = `

          <div class="item-top">

            <span class="item-number">
              ACHIEVEMENT ${index + 1}
            </span>

            <button
              class="remove-item"
              data-remove-achievement="${index}">
              Remove
            </button>

          </div>

          <div class="input-group">

            <label>Achievement</label>

            <textarea
              data-field="text"
              data-index="${index}"
              rows="3"
              placeholder="Example: Built a project used by 500+ users...">${escapeHTML(item.text)}</textarea>

          </div>

        `;

        container.appendChild(div);
      }
    );


    container.querySelectorAll("[data-field]")
      .forEach(input => {

        input.addEventListener("input", e => {

          const index =
            Number(e.target.dataset.index);

          data.achievements[index].text =
            e.target.value;

          saveData();

          renderAchievementsPreview();
        });

      });


    container.querySelectorAll(
      "[data-remove-achievement]"
    ).forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.removeAchievement);

        data.achievements.splice(index, 1);

        renderAchievements();

        saveData();

        renderAchievementsPreview();
      });

    });
  }


  $("addAchievement").addEventListener(
    "click",
    () => addAchievement()
  );


  /* =======================================================
     POSITIONS OF RESPONSIBILITY
  ======================================================= */

  function addPOR(item = {}) {

    data.por.push({
      role: item.role || "",
      organization: item.organization || "",
      description: item.description || ""
    });

    renderPOR();
    saveData();
  }


  function renderPOR() {

    const container =
      $("porList");

    container.innerHTML = "";

    data.por.forEach((item, index) => {

      const div =
        document.createElement("div");

      div.className = "dynamic-item";

      div.innerHTML = `

        <div class="item-top">

          <span class="item-number">
            POSITION ${index + 1}
          </span>

          <button
            class="remove-item"
            data-remove-por="${index}">
            Remove
          </button>

        </div>

        <div class="input-group">

          <label>Position</label>

          <input
            data-field="role"
            data-index="${index}"
            value="${escapeHTML(item.role)}"
            placeholder="Technical Club Coordinator"
          />

        </div>

        <div class="input-group">

          <label>Organization</label>

          <input
            data-field="organization"
            data-index="${index}"
            value="${escapeHTML(item.organization)}"
            placeholder="College / Club"
          />

        </div>

        <div class="input-group">

          <label>Description</label>

          <textarea
            data-field="description"
            data-index="${index}"
            rows="3"
            placeholder="Describe your responsibility...">${escapeHTML(item.description)}</textarea>

        </div>
      `;

      container.appendChild(div);
    });


    container.querySelectorAll("[data-field]")
      .forEach(input => {

        input.addEventListener("input", e => {

          const index =
            Number(e.target.dataset.index);

          const field =
            e.target.dataset.field;

          data.por[index][field] =
            e.target.value;

          saveData();

          renderPORPreview();
        });

      });


    container.querySelectorAll(
      "[data-remove-por]"
    ).forEach(button => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.removePor);

        data.por.splice(index, 1);

        renderPOR();

        saveData();

        renderPORPreview();
      });

    });
  }


  $("addPOR").addEventListener(
    "click",
    () => addPOR()
  );


  /* =======================================================
     TAG SYSTEM
  ======================================================= */

  function addTag(type, value) {

    const clean =
      value.trim();

    if (!clean) return;

    if (!data[type].includes(clean)) {

      data[type].push(clean);

      renderTags();

      saveData();

      renderTagPreview(type);
    }
  }


  function removeTag(type, index) {

    data[type].splice(index, 1);

    renderTags();

    saveData();

    renderTagPreview(type);
  }


  function renderTags() {

    renderTagGroup(
      "skills",
      "skillsContainer",
      "skill-chip"
    );

    renderTagGroup(
      "languages",
      "languageContainer",
      "language-chip"
    );

    renderTagGroup(
      "interests",
      "interestContainer",
      "interest-chip"
    );
  }


  function renderTagGroup(
    type,
    containerID,
    className
  ) {

    const container =
      $(containerID);

    container.innerHTML = "";

    data[type].forEach((item, index) => {

      const chip =
        document.createElement("div");

      chip.className = className;

      chip.innerHTML = `
        <span>${escapeHTML(item)}</span>

        <button
          data-remove-tag="${type}"
          data-index="${index}">
          ×
        </button>
      `;

      container.appendChild(chip);
    });


    container
      .querySelectorAll("[data-remove-tag]")
      .forEach(button => {

        button.addEventListener("click", () => {

          removeTag(
            button.dataset.removeTag,
            Number(button.dataset.index)
          );

        });

      });
  }


  $("skillInput").addEventListener(
    "keydown",
    e => {

      if (e.key === "Enter") {

        e.preventDefault();

        addTag(
          "skills",
          $("skillInput").value
        );

        $("skillInput").value = "";
      }

    }
  );


  $("languageInput").addEventListener(
    "keydown",
    e => {

      if (e.key === "Enter") {

        e.preventDefault();

        addTag(
          "languages",
          $("languageInput").value
        );

        $("languageInput").value = "";
      }

    }
  );


  $("interestInput").addEventListener(
    "keydown",
    e => {

      if (e.key === "Enter") {

        e.preventDefault();

        addTag(
          "interests",
          $("interestInput").value
        );

        $("interestInput").value = "";
      }

    }
  );


  /* =======================================================
     PERSONAL INPUTS
  ======================================================= */

  [
    "fullName",
    "jobTitle",
    "email",
    "phone",
    "linkedin",
    "github",
    "summary"
  ].forEach(id => {

    $(id).addEventListener("input", () => {

      collectData();

      saveData();

      renderPersonalPreview();

      if (id === "summary") {
        updateSummaryCount();
      }

    });

  });


  /* =======================================================
     PERSONAL PREVIEW
  ======================================================= */

  function renderPersonalPreview() {

    $("previewName").textContent =
      data.personal.fullName ||
      "Your Name";

    $("previewJobTitle").textContent =
      data.personal.jobTitle ||
      "Your Target Role";

    $("previewEmail").textContent =
      data.personal.email ||
      "email@example.com";

    $("previewPhone").textContent =
      data.personal.phone ||
      "+91 XXXXX XXXXX";

    $("previewLinkedin").textContent =
      data.personal.linkedin ||
      "LinkedIn";

    $("previewGithub").textContent =
      data.personal.github ||
      "GitHub";

    const summary =
      data.summary.trim();

    $("previewSummary").textContent =
      summary ||
      "Your professional summary will appear here.";

    updateSectionVisibility();
  }


  /* =======================================================
     SUMMARY COUNT
  ======================================================= */

  function updateSummaryCount() {

    const value =
      $("summary").value || "";

    $("summaryCount").textContent =
      value.length;
  }


  /* =======================================================
     EDUCATION PREVIEW
  ======================================================= */

  function renderEducationPreview() {

    const container =
      $("previewEducation");

    container.innerHTML = "";

    data.education.forEach(item => {

      if (
        !item.college &&
        !item.degree &&
        !item.year &&
        !item.score
      ) return;

      const div =
        document.createElement("div");

      div.className = "resume-item";

      div.innerHTML = `

        <div class="resume-item-title">
          ${escapeHTML(item.degree || "Degree")}
        </div>

        <div class="resume-item-subtitle">
          ${escapeHTML(item.college || "Institution")}
          ${item.year ? ` • ${escapeHTML(item.year)}` : ""}
          ${item.score ? ` • ${escapeHTML(item.score)}` : ""}
        </div>

      `;

      container.appendChild(div);
    });

    updateSectionVisibility();
  }


  /* =======================================================
     EXPERIENCE PREVIEW
  ======================================================= */

  function renderExperiencePreview() {

    const container =
      $("previewExperience");

    container.innerHTML = "";

    data.experience.forEach(item => {

      if (
        !item.role &&
        !item.company &&
        !item.duration &&
        !item.description
      ) return;

      const div =
        document.createElement("div");

      div.className = "resume-item";

      div.innerHTML = `

        <div class="resume-item-title">
          ${escapeHTML(item.role || "Role")}
        </div>

        <div class="resume-item-subtitle">
          ${escapeHTML(item.company || "Company")}
          ${item.duration ? ` • ${escapeHTML(item.duration)}` : ""}
        </div>

        ${
          item.description
            ? `
              <div class="resume-item-description">
                ${escapeHTML(item.description)}
              </div>
            `
            : ""
        }

      `;

      container.appendChild(div);
    });

    updateSectionVisibility();
  }


  /* =======================================================
     PROJECT PREVIEW
  ======================================================= */

  function renderProjectsPreview() {

    const container =
      $("previewProjects");

    container.innerHTML = "";

    data.projects.forEach(item => {

      if (
        !item.title &&
        !item.stack &&
        !item.description
      ) return;

      const div =
        document.createElement("div");

      div.className = "resume-item";

      div.innerHTML = `

        <div class="resume-item-title">
          ${escapeHTML(item.title || "Project")}
        </div>

        ${
          item.stack
            ? `
              <div class="resume-item-subtitle">
                ${escapeHTML(item.stack)}
              </div>
            `
            : ""
        }

        ${
          item.description
            ? `
              <div class="resume-item-description">
                ${escapeHTML(item.description)}
              </div>
            `
            : ""
        }

      `;

      container.appendChild(div);
    });

    updateSectionVisibility();
  }


  /* =======================================================
     SKILLS PREVIEW
  ======================================================= */

  function renderSkillsPreview() {

    const container =
      $("previewSkills");

    container.innerHTML = "";

    if (!data.skills.length) return;

    const wrapper =
      document.createElement("div");

    wrapper.className = "resume-skills";

    data.skills.forEach(skill => {

      const span =
        document.createElement("span");

      span.className = "resume-skill";

      span.textContent = skill;

      wrapper.appendChild(span);
    });

    container.appendChild(wrapper);

    updateSectionVisibility();
  }


  /* =======================================================
     CERTIFICATIONS PREVIEW
  ======================================================= */

  function renderCertificationsPreview() {

    const container =
      $("previewCertifications");

    container.innerHTML = "";

    data.certifications.forEach(item => {

      if (
        !item.name &&
        !item.issuer &&
        !item.year
      ) return;

      const div =
        document.createElement("div");

      div.className = "resume-item";

      div.innerHTML = `

        <div class="resume-item-title">
          ${escapeHTML(item.name || "Certification")}
        </div>

        <div class="resume-item-subtitle">

          ${escapeHTML(item.issuer || "")}

          ${
            item.year
              ? ` • ${escapeHTML(item.year)}`
              : ""
          }

        </div>

      `;

      container.appendChild(div);
    });

    updateSectionVisibility();
  }


  /* =======================================================
     ACHIEVEMENT PREVIEW
  ======================================================= */

  function renderAchievementsPreview() {

    const container =
      $("previewAchievements");

    container.innerHTML = "";

    data.achievements.forEach(item => {

      if (!item.text) return;

      const div =
        document.createElement("div");

      div.className =
        "resume-item-description";

      div.textContent =
        "• " + item.text;

      container.appendChild(div);
    });

    updateSectionVisibility();
  }


  /* =======================================================
     POR PREVIEW
  ======================================================= */

  function renderPORPreview() {

    const container =
      $("previewPOR");

    container.innerHTML = "";

    data.por.forEach(item => {

      if (
        !item.role &&
        !item.organization &&
        !item.description
      ) return;

      const div =
        document.createElement("div");

      div.className = "resume-item";

      div.innerHTML = `

        <div class="resume-item-title">
          ${escapeHTML(item.role || "Position")}
        </div>

        <div class="resume-item-subtitle">
          ${escapeHTML(item.organization || "")}
        </div>

        ${
          item.description
            ? `
              <div class="resume-item-description">
                ${escapeHTML(item.description)}
              </div>
            `
            : ""
        }

      `;

      container.appendChild(div);
    });

    updateSectionVisibility();
  }


  /* =======================================================
     TAG PREVIEW
  ======================================================= */

  function renderTagPreview(type) {

    const map = {
      languages: "previewLanguages",
      interests: "previewInterests"
    };

    const containerID =
      map[type];

    if (!containerID) {

      if (type === "skills") {
        renderSkillsPreview();
      }

      return;
    }

    const container =
      $(containerID);

    container.innerHTML = "";

    if (!data[type].length) return;

    const wrapper =
      document.createElement("div");

    wrapper.className =
      "resume-item-description";

    wrapper.textContent =
      data[type].join(" • ");

    container.appendChild(wrapper);

    updateSectionVisibility();
  }


  /* =======================================================
     SECTION VISIBILITY
  ======================================================= */

  function updateSectionVisibility() {

    const checks = [

      [
        "previewSummarySection",
        Boolean(data.summary.trim())
      ],

      [
        "previewEducationSection",
        data.education.some(x =>
          x.college ||
          x.degree ||
          x.year ||
          x.score
        )
      ],

      [
        "previewExperienceSection",
        data.experience.some(x =>
          x.role ||
          x.company ||
          x.duration ||
          x.description
        )
      ],

      [
        "previewProjectsSection",
        data.projects.some(x =>
          x.title ||
          x.stack ||
          x.description
        )
      ],

      [
        "previewSkillsSection",
        data.skills.length > 0
      ],

      [
        "previewCertificationsSection",
        data.certifications.some(x =>
          x.name ||
          x.issuer ||
          x.year
        )
      ],

      [
        "previewAchievementsSection",
        data.achievements.some(x =>
          x.text
        )
      ],

      [
        "previewPORSection",
        data.por.some(x =>
          x.role ||
          x.organization ||
          x.description
        )
      ],

      [
        "previewLanguagesSection",
        data.languages.length > 0
      ],

      [
        "previewInterestsSection",
        data.interests.length > 0
      ]

    ];


    checks.forEach(([id, visible]) => {

      $(id).style.display =
        visible ? "block" : "none";

    });
  }


  /* =======================================================
     TEMPLATE
  ======================================================= */

  $("templateSelect").addEventListener(
    "change",
    e => {

      data.template =
        e.target.value;

      applyTemplate();

      saveData();

      showToast(
        "Template Changed",
        `${e.target.value} template applied.`,
        "🎨"
      );

    }
  );


  function applyTemplate() {

    const paper =
      $("resumePaper");

    paper.classList.remove(
      "template-minimal",
      "template-corporate",
      "template-tech",
      "template-modern"
    );

    paper.classList.add(
      `template-${data.template}`
    );
  }


  /* =======================================================
     ZOOM
  ======================================================= */

  function applyZoom() {

    $("resumePaper").style.transform =
      `scale(${zoom})`;

    $("zoomLevel").textContent =
      `${Math.round(zoom * 100)}%`;
  }


  $("zoomIn").addEventListener(
    "click",
    () => {

      zoom =
        Math.min(1.15, zoom + 0.05);

      applyZoom();

    }
  );


  $("zoomOut").addEventListener(
    "click",
    () => {

      zoom =
        Math.max(0.50, zoom - 0.05);

      applyZoom();

    }
  );


  /* =======================================================
     DARK PREVIEW
  ======================================================= */

  $("previewThemeToggle")
    .addEventListener("click", () => {

      const paper =
        $("resumePaper");

      paper.classList.toggle(
        "preview-dark"
      );

      const dark =
        paper.classList.contains(
          "preview-dark"
        );

      $("previewThemeToggle").textContent =
        dark ? "☀️" : "🌙";

    });


  /* =======================================================
     PRINT
  ======================================================= */

  $("printResume")
    .addEventListener("click", () => {

      window.print();

    });


  /* =======================================================
     SMART SUMMARY
  ======================================================= */

  $("generateSummary")
    .addEventListener("click", () => {

      collectData();

      const name =
        data.personal.fullName || "student";

      const role =
        data.personal.jobTitle ||
        "technology professional";

      const skills =
        data.skills.slice(0, 5);

      const projects =
        data.projects.filter(
          x => x.title
        ).length;

      let summary =
        `${name} is an aspiring ${role} with a strong interest in building practical technology solutions.`;

      if (skills.length) {

        summary +=
          ` Skilled in ${skills.join(", ")}.`;

      }

      if (projects > 0) {

        summary +=
          ` Experienced in developing ${projects} practical project${projects > 1 ? "s" : ""}.`;

      }

      summary +=
        " Focused on continuous learning, problem solving and creating real-world impact.";

      $("summary").value =
        summary.slice(0, 500);

      collectData();

      saveData();

      renderPersonalPreview();

      updateSummaryCount();

      showToast(
        "Summary Generated",
        "Your professional summary has been created.",
        "✨"
      );

    });


  /* =======================================================
     ATS ENGINE
  ======================================================= */

  function calculateATS() {

    let score = 0;

    const checks = [];

    const contactComplete =
      Boolean(
        data.personal.fullName &&
        data.personal.email &&
        data.personal.phone
      );

    const educationComplete =
      data.education.some(
        x => x.college && x.degree
      );

    const skillsComplete =
      data.skills.length >= 3;

    const projectsComplete =
      data.projects.some(
        x => x.title && x.description
      );

    const summaryComplete =
      data.summary.length >= 50;

    const linksComplete =
      Boolean(
        data.personal.linkedin ||
        data.personal.github
      );

    const experienceComplete =
      data.experience.some(
        x => x.role && x.company
      );

    if (contactComplete) {
      score += 20;
      checks.push({
        good: true,
        text: "Contact information complete"
      });
    } else {
      checks.push({
        good: false,
        text: "Complete name, email and phone"
      });
    }

    if (educationComplete) {
      score += 15;
      checks.push({
        good: true,
        text: "Education section added"
      });
    } else {
      checks.push({
        good: false,
        text: "Add your education"
      });
    }

    if (skillsComplete) {
      score += 20;
      checks.push({
        good: true,
        text: "Technical skills detected"
      });
    } else {
      checks.push({
        good: false,
        text: "Add at least 3 technical skills"
      });
    }

    if (projectsComplete) {
      score += 20;
      checks.push({
        good: true,
        text: "Project experience detected"
      });
    } else {
      checks.push({
        good: false,
        text: "Add at least one detailed project"
      });
    }

    if (summaryComplete) {
      score += 10;
      checks.push({
        good: true,
        text: "Professional summary present"
      });
    } else {
      checks.push({
        good: false,
        text: "Write a 50+ character summary"
      });
    }

    if (linksComplete) {
      score += 5;
      checks.push({
        good: true,
        text: "Professional profile link added"
      });
    } else {
      checks.push({
        good: false,
        text: "Add LinkedIn or GitHub"
      });
    }

    if (experienceComplete) {
      score += 10;
      checks.push({
        good: true,
        text: "Experience section detected"
      });
    } else {
      checks.push({
        good: false,
        text: "Experience can be added if applicable"
      });
    }

    return {
      score,
      checks
    };
  }


  function updateATS() {

    const result =
      calculateATS();

    $("atsScore").textContent =
      result.score;

    $("atsProgressBar").style.width =
      `${result.score}%`;

    const container =
      $("atsChecks");

    container.innerHTML = "";

    result.checks
      .slice(0, 4)
      .forEach(check => {

        const div =
          document.createElement("div");

        div.className =
          "ats-check";

        div.innerHTML = `

          <span>
            ${check.good ? "✓" : "○"}
          </span>

          ${escapeHTML(check.text)}

        `;

        container.appendChild(div);
      });
  }


  /* =======================================================
     SMART ANALYZE MODAL
  ======================================================= */

  function openAnalyzer() {

    const result =
      calculateATS();

    $("modalATSScore").textContent =
      result.score;

    const container =
      $("analysisResults");

    container.innerHTML = "";

    result.checks.forEach(check => {

      const div =
        document.createElement("div");

      div.className =
        `analysis-result ${
          check.good
            ? "good"
            : "warning"
        }`;

      div.textContent =
        `${check.good ? "✓" : "!"} ${check.text}`;

      container.appendChild(div);
    });

    $("analyzerModal")
      .classList.add("show");
  }


  $("smartAnalyze")
    .addEventListener(
      "click",
      openAnalyzer
    );


  $("closeAnalyzer")
    .addEventListener(
      "click",
      () => {

        $("analyzerModal")
          .classList.remove("show");

      }
    );


  $("closeAnalyzerBottom")
    .addEventListener(
      "click",
      () => {

        $("analyzerModal")
          .classList.remove("show");

      }
    );


  $("analyzerModal")
    .addEventListener(
      "click",
      e => {

        if (
          e.target ===
          $("analyzerModal")
        ) {

          $("analyzerModal")
            .classList.remove("show");

        }

      }
    );


  /* =======================================================
     COMPLETION
  ======================================================= */

  function updateCompletion() {

    const fields = [

      data.personal.fullName,

      data.personal.jobTitle,

      data.personal.email,

      data.personal.phone,

      data.personal.linkedin ||
      data.personal.github,

      data.summary,

      data.education.some(
        x => x.college && x.degree
      ),

      data.projects.some(
        x => x.title && x.description
      ),

      data.skills.length >= 3,

      data.certifications.length > 0,

      data.achievements.length > 0

    ];

    const completed =
      fields.filter(Boolean).length;

    const percent =
      Math.round(
        (completed / fields.length) * 100
      );

    $("completionPercent").textContent =
      `${percent}%`;

    $("completionBar").style.width =
      `${percent}%`;


    let message =
      "Start building your professional resume.";

    if (percent >= 90) {
      message =
        "🔥 Your resume is almost complete.";
    } else if (percent >= 70) {
      message =
        "⚡ Looking strong. Add the final details.";
    } else if (percent >= 40) {
      message =
        "🚀 Good progress. Keep building.";
    }

    $("completionMessage").textContent =
      message;
  }


  /* =======================================================
     JSON EXPORT
  ======================================================= */

  $("exportJSON")
    .addEventListener("click", () => {

      collectData();

      const blob =
        new Blob(
          [JSON.stringify(data, null, 2)],
          {
            type: "application/json"
          }
        );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      const filename =
        (
          data.personal.fullName ||
          "wildfire-resume"
        )
          .replace(/[^a-z0-9]+/gi, "-")
          .toLowerCase();

      link.href = url;

      link.download =
        `${filename}-backup.json`;

      link.click();

      URL.revokeObjectURL(url);

      showToast(
        "Backup Created",
        "Your resume data was exported as JSON.",
        "💾"
      );

    });


  /* =======================================================
     JSON IMPORT
  ======================================================= */

  $("importJSON")
    .addEventListener(
      "click",
      () => {

        $("jsonFileInput").click();

      }
    );


  $("jsonFileInput")
    .addEventListener(
      "change",
      event => {

        const file =
          event.target.files[0];

        if (!file) return;

        const reader =
          new FileReader();

        reader.onload = e => {

          try {

            const imported =
              JSON.parse(e.target.result);

            data = {
              ...data,
              ...imported,

              personal: {
                ...data.personal,
                ...(imported.personal || {})
              }
            };

            localStorage.setItem(
              storageKey,
              JSON.stringify(data)
            );

            fillPersonalFields();

            renderDynamicLists();

            renderTags();

            renderAll();

            showToast(
              "Resume Imported",
              "Your JSON backup has been restored.",
              "📂"
            );

          } catch {

            showToast(
              "Import Failed",
              "The selected file is not valid JSON.",
              "⚠️"
            );

          }

        };

        reader.readAsText(file);

        event.target.value = "";

      }
    );


  /* =======================================================
     LOAD DEMO
  ======================================================= */

  $("loadDemo")
    .addEventListener("click", () => {

      data = {

        personal: {

          fullName: "Rahul Kumar",

          jobTitle:
            "Frontend Developer",

          email:
            "rahul@example.com",

          phone:
            "+91 98765 43210",

          linkedin:
            "linkedin.com/in/rahulkumar",

          github:
            "github.com/rahulkumar"

        },

        summary:
          "Frontend developer focused on building modern, responsive and user-friendly web applications using JavaScript and modern web technologies.",

        education: [

          {
            college:
              "ABC Institute of Technology",

            degree:
              "B.Tech Computer Science",

            year:
              "2026 - 2030",

            score:
              "8.7 CGPA"
          }

        ],

        experience: [

          {
            role:
              "Frontend Developer Intern",

            company:
              "Tech Startup",

            duration:
              "Jun 2026 - Aug 2026",

            description:
              "Built responsive interfaces and reusable components while improving page performance and user experience."
          }

        ],

        projects: [

          {
            title:
              "Wildfire Resume Builder",

            stack:
              "HTML, CSS, JavaScript",

            description:
              "Developed a client-side resume builder with live preview, autosave, templates, ATS heuristics and PDF export."
          },

          {
            title:
              "Expense Tracker",

            stack:
              "HTML, CSS, JavaScript",

            description:
              "Built a local-first finance tracker with transactions, budgeting and interactive dashboard functionality."
          }

        ],

        skills: [

          "C++",
          "JavaScript",
          "HTML",
          "CSS",
          "Git",
          "SQL"

        ],

        certifications: [

          {
            name:
              "JavaScript Fundamentals",

            issuer:
              "Online Certification",

            year:
              "2026"
          }

        ],

        achievements: [

          {
            text:
              "Built and published multiple frontend projects."
          }

        ],

        por: [

          {
            role:
              "Technical Club Member",

            organization:
              "College Tech Community",

            description:
              "Participated in technical events and collaborative development activities."
          }

        ],

        languages: [

          "English",
          "Hindi"

        ],

        interests: [

          "Technology",
          "Entrepreneurship",
          "AI/ML"

        ],

        template:
          "modern"

      };

      fillPersonalFields();

      renderDynamicLists();

      renderTags();

      renderAll();

      saveData();

      showToast(
        "Demo Loaded",
        "Sample resume data has been loaded.",
        "✨"
      );

    });


  /* =======================================================
     CLEAR
  ======================================================= */

  $("clearResume")
    .addEventListener("click", () => {

      const confirmClear =
        confirm(
          "Clear your entire resume? This cannot be undone."
        );

      if (!confirmClear) return;

      localStorage.removeItem(
        storageKey
      );

      location.reload();

    });


  /* =======================================================
     PDF EXPORT
  ======================================================= */

  $("exportPDF")
    .addEventListener("click", async () => {

      collectData();

      const paper =
        $("resumePaper");

      if (
        typeof html2pdf ===
        "undefined"
      ) {

        showToast(
          "Export Error",
          "PDF engine could not be loaded.",
          "⚠️"
        );

        return;
      }


      showToast(
        "Preparing PDF",
        "Generating your official resume...",
        "📄"
      );


      const clone =
        paper.cloneNode(true);

      clone.style.transform =
        "none";

      clone.style.boxShadow =
        "none";

      clone.classList.remove(
        "preview-dark"
      );


      const wrapper =
        document.createElement("div");

      wrapper.style.position =
        "fixed";

      wrapper.style.left =
        "-100000px";

      wrapper.style.top =
        "0";

      wrapper.style.background =
        "white";

      wrapper.appendChild(clone);

      document.body.appendChild(
        wrapper
      );


      const filename =
        (
          data.personal.fullName ||
          "wildfire-resume"
        )
          .replace(/[^a-z0-9]+/gi, "-")
          .toLowerCase();


      const options = {

        margin: 0,

        filename:
          `${filename}-resume.pdf`,

        image: {
          type: "jpeg",
          quality: 0.98
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff"
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait"
        },

        pagebreak: {
          mode: [
            "avoid-all",
            "css",
            "legacy"
          ]
        }

      };


      try {

        await html2pdf()
          .set(options)
          .from(clone)
          .save();

        showToast(
          "PDF Ready",
          "Your resume PDF has been generated.",
          "🔥"
        );

      } catch (error) {

        console.error(error);

        showToast(
          "Export Failed",
          "Something went wrong while creating the PDF.",
          "⚠️"
        );

      } finally {

        wrapper.remove();

      }

    });


  /* =======================================================
     RENDER DYNAMIC LISTS
  ======================================================= */

  function renderDynamicLists() {

    renderEducation();
    renderExperience();
    renderProjects();
    renderCertifications();
    renderAchievements();
    renderPOR();

  }


  /* =======================================================
     RENDER ALL
  ======================================================= */

  function renderAll() {

    renderPersonalPreview();

    renderEducationPreview();

    renderExperiencePreview();

    renderProjectsPreview();

    renderSkillsPreview();

    renderCertificationsPreview();

    renderAchievementsPreview();

    renderPORPreview();

    renderTagPreview("languages");

    renderTagPreview("interests");

    applyTemplate();

    updateCompletion();

    updateATS();

    updateSummaryCount();

    applyZoom();

  }


  /* =======================================================
     INITIALIZE
  ======================================================= */

  restoreData();

});