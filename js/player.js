class ElitePlayer {
  constructor(elementOrId) {
    this.container = (typeof elementOrId === 'string') 
      ? document.getElementById(elementOrId) 
      : elementOrId;
      
    if (!this.container) return;
    this.video = this.container.querySelector('video');
    if (!this.video) return; // Safety check

    this.progressContainer = this.container.querySelector('.p-progress-container');
    this.progressBar = this.container.querySelector('.p-progress-bar');
    this.playBtn = this.container.querySelector('.p-play-toggle');
    this.timeDisplay = this.container.querySelector('.p-time');
    this.volumeSlider = this.container.querySelector('.volume-slider');
    this.fullscreenBtn = this.container.querySelector('.p-fullscreen');
    this.interactionOverlay = this.container.querySelector('.interaction-mask');

    this.init();
    this.setupInstanceSecurity();
  }

  init() {
    // Play/Pause
    if (this.playBtn) this.playBtn.addEventListener('click', () => this.togglePlay());
    if (this.interactionOverlay) this.interactionOverlay.addEventListener('click', () => this.togglePlay());
    this.video.addEventListener('click', () => this.togglePlay());

    // Update Progress
    this.video.addEventListener('timeupdate', () => this.updateProgressBar());

    // Seeking
    if (this.progressContainer) {
      this.progressContainer.addEventListener('click', (e) => this.scrub(e));
    }

    // Volume
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => this.handleVolume(e));
    }

    // Fullscreen
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }

    // State Classes
    this.video.addEventListener('play', () => this.container.classList.remove('paused'));
    this.video.addEventListener('pause', () => this.container.classList.add('paused'));

    // Formatting Duration
    this.video.addEventListener('loadedmetadata', () => this.updateTimeDisplay());
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play();
      if (this.playBtn) this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      this.video.pause();
      if (this.playBtn) this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  }

  updateProgressBar() {
    if (!this.progressBar || !this.video.duration) return;
    const percent = (this.video.currentTime / this.video.duration) * 100;
    this.progressBar.style.width = `${percent}%`;
    this.updateTimeDisplay();
  }

  scrub(e) {
    if (!this.progressContainer || !this.video.duration) return;
    const scrubTime = (e.offsetX / this.progressContainer.offsetWidth) * this.video.duration;
    this.video.currentTime = scrubTime;
  }

  handleVolume(e) {
    this.video.volume = e.target.value;
    const icon = this.container.querySelector('.p-volume-btn i');
    if (icon) {
      if (this.video.volume === 0) icon.className = 'fas fa-volume-mute';
      else if (this.video.volume < 0.5) icon.className = 'fas fa-volume-down';
      else icon.className = 'fas fa-volume-up';
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }

  updateTimeDisplay() {
    if (!this.timeDisplay) return;
    const format = (time) => {
      const min = Math.floor(time / 60);
      const sec = Math.floor(time % 60);
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };
    this.timeDisplay.innerText = `${format(this.video.currentTime)} / ${format(this.video.duration || 0)}`;
  }

  setupInstanceSecurity() {
    this.video.setAttribute('controlsList', 'nodownload');
    this.video.setAttribute('disablePictureInPicture', 'true');
    this.video.setAttribute('oncontextmenu', 'return false;');
  }
}

/**
 * Global Security Layer
 * Blocks right-click and keyboard shortcuts project-wide once.
 */
function initGlobalSecurity() {
  // 1. Project-wide right-click block
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.video-container')) {
      e.preventDefault();
      return false;
    }
  }, true);

  // 2. Project-wide keyboard shortcut block
  window.addEventListener('keydown', (e) => {
    if (
      (e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'j')) ||
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && e.key === 'I')
    ) {
      if (document.activeElement.closest('.video-container')) {
        e.preventDefault();
      }
    }
  }, false);
}

// Global initialization helper
function initElitePlayer(elementOrId) {
  return new ElitePlayer(elementOrId);
}

// Auto-initialize all players on the page
function initAllElitePlayers() {
  initGlobalSecurity();
  document.querySelectorAll('.video-container').forEach(container => {
    new ElitePlayer(container);
  });
}

