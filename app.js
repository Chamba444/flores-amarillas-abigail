(() => {
  const PHRASES = [
    {
      text: "Unas flores amarillas para la más cornuda pero también la más bella. Te mereces a alguien que sí te valore (y que sí te las regale).",
      att: "att. John Medina",
    },
    {
      text: "Me olvidé de q era ni sabía q ponerle.",
      att: "att. Joel Alvarez",
    },
    {
      text: "Unas flores amarillas para recordarte que siempre hay luz al final del túnel... aunque tú sigas entrando al mismo túnel. jsjsjsjs",
      att: "att. Dennys Chamba",
    },
    {
      text: "Flores amarillas para la más bella, porque la belleza no se pierde aunque el criterio para escoger pareja sí. jsjsjsjs",
      att: "att. Jim Jaramillo",
    },
    {
      text: "Flores amarillas para una mujer tan hermosa, que hasta sus malas decisiones combinan con el color. jsjsjsjs",
    },
    {
      text: "Para la mujer que ilumina cualquier lugar... aunque a veces se apague cuando le ponen los cachos. jsjsjsjs",
    },
    {
      text: "Unas flores amarillas para la más linda, aunque de decisiones cuestionables. Te mereces todo lo bonito... menos otro novio así. jsjsjsjs",
    },
    {
      text: "Unas flores amarillas para que nunca olvides lo mucho que vales. Porque claramente alguien tuvo que olvidarlo antes. jsjsjsjs",
    },
  ];

  const PETALS = 16;

  function makeBloom(el, extraClass = "") {
    el.classList.add("bloom");
    if (extraClass) el.classList.add(extraClass);
    for (let i = 0; i < PETALS; i++) {
      const p = document.createElement("span");
      p.className = "petal";
      p.style.transform = `rotate(${(360 / PETALS) * i}deg)`;
      el.appendChild(p);
    }
    const disk = document.createElement("span");
    disk.className = "disk";
    el.appendChild(disk);
    return el;
  }

  makeBloom(document.getElementById("hero-bloom"));

  const orbit = document.getElementById("orbit");
  const ORBIT_COUNT = 10;
  for (let i = 0; i < ORBIT_COUNT; i++) {
    const wrap = document.createElement("div");
    wrap.className = "bloom orbit-bloom";
    const ang = (i / ORBIT_COUNT) * Math.PI * 2 - Math.PI / 2;
    const r = 46;
    wrap.style.left = `${50 + Math.cos(ang) * r}%`;
    wrap.style.top = `${50 + Math.sin(ang) * r}%`;
    wrap.style.transform = "translate(-50%, -50%)";
    makeBloom(wrap);
    orbit.appendChild(wrap);
  }

  const board = document.getElementById("board");
  const rotates = [-3.5, 2.4, -1.6, 3.1, -2.8, 1.8, -3.2, 2.2];
  PHRASES.forEach((phrase, i) => {
    const note = document.createElement("article");
    note.className = "note";
    note.style.setProperty("--r", `${rotates[i % rotates.length]}deg`);
    note.style.setProperty("--d", `${0.15 + i * 0.12}s`);
    note.innerHTML = `<span class="tape"></span><p></p>${phrase.att ? "<cite></cite>" : ""}`;
    note.querySelector("p").textContent = phrase.text;
    if (phrase.att) note.querySelector("cite").textContent = phrase.att;
    const mini = document.createElement("span");
    mini.className = "bloom tiny mini";
    makeBloom(mini);
    note.appendChild(mini);
    board.appendChild(note);
  });

  const canvas = document.getElementById("sky");
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  const bits = [];
  let burst = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function spawn(n, explode = false) {
    for (let i = 0; i < n; i++) {
      bits.push({
        x: explode ? w / 2 : Math.random() * w,
        y: explode ? h / 2 : -20 - Math.random() * h,
        r: explode ? (Math.random() - 0.5) * 18 : (Math.random() - 0.5) * 1.4,
        vy: explode ? Math.random() * -7 - 2 : 0.6 + Math.random() * 1.4,
        vx: explode ? (Math.random() - 0.5) * 14 : (Math.random() - 0.5) * 0.8,
        s: 4 + Math.random() * 7,
        a: 0.45 + Math.random() * 0.5,
        rot: Math.random() * Math.PI * 2,
        kind: Math.random() > 0.35 ? "petal" : "dot",
      });
    }
  }
  spawn(70);

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.a;
    if (p.kind === "petal") {
      ctx.fillStyle = p.s > 8 ? "#f0c14b" : "#e8a318";
      ctx.beginPath();
      ctx.ellipse(0, 0, p.s * 0.38, p.s, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "#ffe08a";
      ctx.beginPath();
      ctx.arc(0, 0, p.s * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    if (document.body.classList.contains("day")) {
      g.addColorStop(0, "#5b3314");
      g.addColorStop(0.45, "#8a4d16");
      g.addColorStop(1, "#1b120b");
    } else {
      g.addColorStop(0, "#1a120c");
      g.addColorStop(0.55, "#140e09");
      g.addColorStop(1, "#0b0705");
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    if (Math.random() < 0.35) spawn(1);
    if (burst > 0) {
      spawn(18, true);
      burst -= 1;
    }

    for (let i = bits.length - 1; i >= 0; i--) {
      const p = bits[i];
      p.vy += 0.012;
      p.x += p.vx + Math.sin(p.y / 40) * 0.15;
      p.y += p.vy;
      p.rot += 0.02;
      drawPetal(p);
      if (p.y > h + 30 || p.x < -40 || p.x > w + 40) bits.splice(i, 1);
    }
    if (bits.length > 260) bits.splice(0, bits.length - 260);
    requestAnimationFrame(tick);
  }
  tick();

  const gate = document.getElementById("gate");
  const garden = document.getElementById("garden");
  const openBtn = document.getElementById("open-btn");
  const dock = document.getElementById("player-dock");
  const musicBtn = document.getElementById("music-btn");
  const help = document.getElementById("music-help");
  const song = document.getElementById("song");
  const letterBtn = document.getElementById("letter-btn");
  const letterModal = document.getElementById("letter-modal");
  const letterClose = document.getElementById("letter-close");
  let started = false;

  function showHelp() {
    help.hidden = false;
    musicBtn.classList.add("paused");
  }

  function playSong() {
    dock.hidden = false;
    letterBtn.hidden = false;
    song.volume = 0.85;
    const play = song.play();
    if (play && typeof play.then === "function") {
      play.then(() => {
        started = true;
        help.hidden = true;
        musicBtn.classList.remove("paused");
      }).catch(showHelp);
    }
  }

  song.addEventListener("error", showHelp);

  musicBtn.addEventListener("click", () => {
    if (!started || song.paused) {
      playSong();
      return;
    }
    song.pause();
    musicBtn.classList.add("paused");
  });

  function openGarden() {
    burst = 14;
    playSong();
    document.body.classList.add("day");
    gate.classList.add("away");
    setTimeout(() => {
      gate.hidden = true;
      garden.hidden = false;
      garden.classList.add("show");
      letterBtn.hidden = false;
      garden.scrollIntoView({ behavior: "instant", block: "start" });
    }, 720);
  }

  openBtn.addEventListener("click", openGarden);

  function openLetter() {
    letterModal.hidden = false;
    document.body.classList.add("letter-open");
    letterClose.focus();
  }

  function closeLetter() {
    letterModal.hidden = true;
    document.body.classList.remove("letter-open");
    letterBtn.focus();
  }

  letterBtn.addEventListener("click", openLetter);
  letterClose.addEventListener("click", closeLetter);
  letterModal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-letter]")) closeLetter();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !letterModal.hidden) closeLetter();
  });
})();
