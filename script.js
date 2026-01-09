// ==================== SCROLL SUAVE ====================
window.addEventListener("load", () => {
  const headerHeight = document.querySelector('.topbar').offsetHeight;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;

      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight;

      smoothScrollTo(offsetPosition, 700);

      target.classList.add("destello");
      setTimeout(() => target.classList.remove("destello"), 1000);

      // cerrar menú móvil al hacer click
      const menuToggleCheckbox = document.getElementById("menu-toggle");
      if (menuToggleCheckbox && menuToggleCheckbox.checked) {
        menuToggleCheckbox.checked = false;
      }
    });
  });

  function smoothScrollTo(targetY, duration) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * ease);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
  }
});


// ==================== FIX BUG MENÚ RESPONSIVE ====================
function resetMenusOnResize() {
  const mobileToggle = document.getElementById("menu-toggle");
  const pcToggle = document.getElementById("pc-menu-toggle");

  // Si pasamos a PC, cerrar menú móvil
  if (window.innerWidth >= 769 && mobileToggle) {
    mobileToggle.checked = false;
  }

  // Si pasamos a móvil, cerrar menú PC
  if (window.innerWidth < 769 && pcToggle) {
    pcToggle.checked = false;
  }
}

window.addEventListener("resize", resetMenusOnResize);
window.addEventListener("load", resetMenusOnResize);


// ==================== RADIO ====================
(() => {
  const openBtn = document.getElementById("radio-open");
  const panel = document.getElementById("radio-panel");
  const closeBtn = document.getElementById("radio-close");
  const menuBtn = document.getElementById("radio-menu-btn");
  const menuCloseBtn = document.getElementById("radio-menu-close");
  const menu = document.getElementById("radio-menu");
  const muteBtn = document.getElementById("radio-mute");

  const audio = document.getElementById("radio-audio");
  const playBtn = document.getElementById("radio-play");
  const backBtn = document.getElementById("radio-back");
  const forwardBtn = document.getElementById("radio-forward");
  const progress = document.getElementById("radio-progress");
  const currentEl = document.getElementById("radio-current");
  const durationEl = document.getElementById("radio-duration");
  const title = document.getElementById("radio-title");

  const songs = Array.from(document.querySelectorAll(".radio-song"));
  let currentIndex = 0;
  let isMuted = false;

  // BUSCADOR DE CANCIONES
  const searchInput = document.getElementById("radio-search");
  const songList = document.getElementById("radio-song-list");

  searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    songs.forEach(song => {
      const text = song.textContent.toLowerCase();
      song.style.display = text.includes(filter) ? "block" : "none";
    });
  });

  function loadSong(index, autoplay = false) {
    const song = songs[index];
    if (!song) return;

    audio.src = song.dataset.src;
    title.textContent = song.textContent;
    audio.load();

    if (autoplay) {
      audio.play().then(() => playBtn.textContent = "❚❚")
                  .catch(() => playBtn.textContent = "▶");
    }
  }

  // Reproduce primera canción automáticamente
  loadSong(0, true);

  // Desbloqueo de audio en primer click
  document.addEventListener("click", function firstClick() {
    if (audio.paused) audio.play().catch(()=>{});
    document.removeEventListener("click", firstClick);
  });

  // Abrir / Cerrar radio
  openBtn.onclick = () => {
    panel.classList.add("active");
    openBtn.style.display = "none";
  };

  closeBtn.onclick = () => {
    panel.classList.remove("active");
    openBtn.style.display = "block";
    menu.classList.remove("active");
  };

  // Play / Pause
  playBtn.onclick = () => {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = "❚❚";
    } else {
      audio.pause();
      playBtn.textContent = "▶";
    }
  };

  // +/-10 segundos
  backBtn.onclick = () => audio.currentTime -= 10;
  forwardBtn.onclick = () => audio.currentTime += 10;

  // Progreso
  audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration)) {
      progress.value = (audio.currentTime / audio.duration) * 100;
      currentEl.textContent = format(audio.currentTime);
      durationEl.textContent = format(audio.duration);
    }
  });

  progress.oninput = () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
  };

  // Menú canciones
  menuBtn.onclick = () => menu.classList.toggle("active");
  menuCloseBtn.onclick = () => menu.classList.remove("active");

  songs.forEach((song, i) => {
    song.onclick = () => {
      currentIndex = i;
      loadSong(currentIndex, true);
      menu.classList.remove("active");
    };
  });

  // Mute
  muteBtn.onclick = () => {
    isMuted = !isMuted;
    audio.muted = isMuted;
    muteBtn.textContent = isMuted ? "🔇" : "🔊";
  };

  // Auto siguiente canción
  audio.addEventListener("ended", () => {
    currentIndex++;
    if (currentIndex >= songs.length) currentIndex = 0;
    loadSong(currentIndex, true);
  });

  function format(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }
})();


// ==================== PROTEGER IMÁGENES ====================
document.addEventListener("contextmenu", e => {
  if (e.target.classList.contains("logo-box")) {
    e.preventDefault();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    document.getElementById("menu-toggle").checked = false;
  }
});


// Seleccionamos los toggles
const menuToggle = document.getElementById("menu-toggle");
const pcMenuToggle = document.getElementById("pc-menu-toggle");

// Función para bloquear o desbloquear scroll del body
function updateBodyScroll() {
  if (menuToggle.checked || pcMenuToggle.checked) {
    document.body.classList.add("menu-abierto");
  } else {
    document.body.classList.remove("menu-abierto");
  }
}

// ==================== BLOQUEO REAL DEL SCROLL (MÓVIL + PC) ====================

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const pcMenuToggle = document.getElementById("pc-menu-toggle");

  let scrollPosition = 0;

  function lockScroll() {
    scrollPosition = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
  }

  function unlockScroll() {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollPosition);
  }

  function updateScrollState() {
    const isOpen =
      (menuToggle && menuToggle.checked) ||
      (pcMenuToggle && pcMenuToggle.checked);

    if (isOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }

  if (menuToggle) menuToggle.addEventListener("change", updateScrollState);
  if (pcMenuToggle) pcMenuToggle.addEventListener("change", updateScrollState);

  window.addEventListener("resize", updateScrollState);
});
