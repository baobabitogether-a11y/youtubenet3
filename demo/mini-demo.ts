import { DEMO_HEBREW_CUES, DemoCue } from './hebrewCues';

const DEFAULT_VIDEO_ID = 'FcRzAdI8R9U';

// Format seconds to HH:MM:SS.mmm or MM:SS.mmm
function formatTimestamp(sec: number): string {
  if (isNaN(sec) || sec < 0) return '00:00.000';
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = Math.floor(sec % 60);
  const millis = Math.floor((sec % 1) * 1000);

  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');
  const msStr = String(millis).padStart(3, '0');

  if (hours > 0) {
    const hStr = String(hours).padStart(2, '0');
    return `${hStr}:${mStr}:${sStr}.${msStr}`;
  }
  return `${mStr}:${sStr}.${msStr}`;
}

export class MiniDemoApp {
  private cues: DemoCue[] = DEMO_HEBREW_CUES;
  private activeCue: DemoCue | null = null;
  private player: any = null;
  private isPlaying = false;
  private currentTime = 0;
  private timer: number | null = null;
  private autoScroll = true;
  private searchQuery = '';

  // DOM Elements
  private overlayEl!: HTMLElement;
  private overlayTimeEl!: HTMLElement;
  private overlayTextEl!: HTMLElement;
  private currentTimeEl!: HTMLElement;
  private activeCueIdEl!: HTMLElement;
  private cuesTableBodyEl!: HTMLElement;
  private cuesContainerEl!: HTMLElement;
  private playPauseBtn!: HTMLButtonElement;
  private autoScrollToggle!: HTMLInputElement;
  private searchInput!: HTMLInputElement;
  private cueCountEl!: HTMLElement;

  constructor() {
    this.initDOM();
    this.initYouTubePlayer();
    this.renderCuesList();
    this.setupEventListeners();
  }

  private initDOM() {
    this.overlayEl = document.getElementById('subtitle-overlay')!;
    this.overlayTimeEl = document.getElementById('overlay-time')!;
    this.overlayTextEl = document.getElementById('overlay-text')!;
    this.currentTimeEl = document.getElementById('current-time-display')!;
    this.activeCueIdEl = document.getElementById('active-cue-id')!;
    this.cuesTableBodyEl = document.getElementById('cues-tbody')!;
    this.cuesContainerEl = document.getElementById('cues-container')!;
    this.playPauseBtn = document.getElementById('play-pause-btn') as HTMLButtonElement;
    this.autoScrollToggle = document.getElementById('autoscroll-toggle') as HTMLInputElement;
    this.searchInput = document.getElementById('cue-search-input') as HTMLInputElement;
    this.cueCountEl = document.getElementById('cues-count')!;

    this.cueCountEl.textContent = `${this.cues.length} Cues`;
  }

  private initYouTubePlayer() {
    const loadAPI = () => {
      if (window.YT && window.YT.Player) {
        this.createPlayer();
      } else {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          this.createPlayer();
        };
      }
    };

    loadAPI();
  }

  private createPlayer() {
    this.player = new window.YT.Player('yt-player-frame', {
      videoId: DEFAULT_VIDEO_ID,
      playerVars: {
        autoplay: 0,
        controls: 1,
        rel: 0,
        modestbranding: 1,
        enablejsapi: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          console.log('[MiniDemo] YouTube player ready');
          this.startSyncTimer();
        },
        onStateChange: (event: any) => {
          // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
          this.isPlaying = event.data === 1;
          this.updatePlayPauseButton();
        },
      },
    });
  }

  private startSyncTimer() {
    if (this.timer) clearInterval(this.timer);
    // Poll player playback time with 200ms precision
    this.timer = window.setInterval(() => {
      if (this.player && typeof this.player.getCurrentTime === 'function') {
        try {
          const t = this.player.getCurrentTime();
          if (typeof t === 'number' && !isNaN(t) && t >= 0) {
            this.handleTimeUpdate(t);
          }
        } catch {}
      }
    }, 200);
  }

  private handleTimeUpdate(time: number) {
    this.currentTime = time;
    this.currentTimeEl.textContent = formatTimestamp(time);

    // Locate active cue based on start and end time boundaries
    const found = this.cues.find((c) => time >= c.start && time <= c.end + 0.15);

    if (found && found.id !== this.activeCue?.id) {
      this.setActiveCue(found);
    } else if (!found && this.activeCue) {
      // Small gap between cues: retain current or clear if past by > 1.5s
      if (time > this.activeCue.end + 1.5 || time < this.activeCue.start - 0.5) {
        this.setActiveCue(null);
      }
    }
  }

  private setActiveCue(cue: DemoCue | null) {
    this.activeCue = cue;

    if (cue) {
      this.overlayEl.classList.remove('hidden');
      this.overlayTimeEl.textContent = `${formatTimestamp(cue.start)} ➔ ${formatTimestamp(cue.end)} (${cue.duration.toFixed(2)}s)`;
      this.overlayTextEl.textContent = cue.text;
      this.activeCueIdEl.textContent = `#${cue.index}`;

      // Update highlighted row in table
      this.highlightTableRow(cue.id);
    } else {
      this.overlayTimeEl.textContent = '--:--.--- ➔ --:--.---';
      this.overlayTextEl.textContent = '...';
      this.activeCueIdEl.textContent = 'None';
      this.removeTableHighlight();
    }
  }

  private highlightTableRow(cueId: string) {
    const prevActive = document.querySelector('.cue-row.active-row');
    if (prevActive) {
      prevActive.classList.remove('active-row');
    }

    const row = document.getElementById(`row-${cueId}`);
    if (row) {
      row.classList.add('active-row');
      if (this.autoScroll && this.cuesContainerEl) {
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  private removeTableHighlight() {
    const prevActive = document.querySelector('.cue-row.active-row');
    if (prevActive) {
      prevActive.classList.remove('active-row');
    }
  }

  public seekToCue(cue: DemoCue) {
    if (this.player && typeof this.player.seekTo === 'function') {
      this.player.seekTo(cue.start, true);
      this.handleTimeUpdate(cue.start);
      if (!this.isPlaying && typeof this.player.playVideo === 'function') {
        this.player.playVideo();
      }
    }
  }

  private renderCuesList() {
    const filter = this.searchQuery.toLowerCase().trim();
    const filtered = filter
      ? this.cues.filter(
          (c) =>
            c.text.toLowerCase().includes(filter) ||
            String(c.index).includes(filter) ||
            formatTimestamp(c.start).includes(filter)
        )
      : this.cues;

    this.cueCountEl.textContent = `${filtered.length} / ${this.cues.length} Cues`;

    this.cuesTableBodyEl.innerHTML = '';
    const fragment = document.createDocumentFragment();

    filtered.forEach((cue) => {
      const tr = document.createElement('tr');
      tr.id = `row-${cue.id}`;
      tr.className = `cue-row cursor-pointer transition-colors duration-150 border-b border-neutral-800/60 hover:bg-neutral-800/50 ${
        this.activeCue?.id === cue.id ? 'active-row' : ''
      }`;

      tr.innerHTML = `
        <td class="py-2.5 px-3 text-neutral-500 font-mono text-xs w-16 text-center select-none">
          #${cue.index}
        </td>
        <td class="py-2.5 px-3 font-mono text-xs text-sky-400 whitespace-nowrap select-none w-44">
          ${formatTimestamp(cue.start)} ➔ ${formatTimestamp(cue.end)}
        </td>
        <td class="py-2.5 px-4 text-sm font-medium text-neutral-100 text-right dir-rtl leading-relaxed" dir="rtl">
          ${cue.text}
        </td>
        <td class="py-2.5 px-3 w-16 text-center">
          <button type="button" class="seek-cue-btn text-xs bg-neutral-800 hover:bg-sky-600 text-neutral-300 hover:text-white px-2 py-1 rounded transition-colors" title="Seek to ${formatTimestamp(cue.start)}">
            ▶
          </button>
        </td>
      `;

      tr.addEventListener('click', () => {
        this.seekToCue(cue);
      });

      fragment.appendChild(tr);
    });

    this.cuesTableBodyEl.appendChild(fragment);
  }

  private updatePlayPauseButton() {
    if (this.isPlaying) {
      this.playPauseBtn.textContent = '⏸ Pause';
      this.playPauseBtn.classList.replace('bg-sky-600', 'bg-amber-600');
    } else {
      this.playPauseBtn.textContent = '▶ Play';
      this.playPauseBtn.classList.replace('bg-amber-600', 'bg-sky-600');
    }
  }

  private setupEventListeners() {
    this.playPauseBtn.addEventListener('click', () => {
      if (!this.player) return;
      if (this.isPlaying) {
        this.player.pauseVideo?.();
      } else {
        this.player.playVideo?.();
      }
    });

    document.getElementById('rewind-5s-btn')?.addEventListener('click', () => {
      if (!this.player) return;
      const target = Math.max(0, this.currentTime - 5);
      this.player.seekTo?.(target, true);
    });

    document.getElementById('forward-5s-btn')?.addEventListener('click', () => {
      if (!this.player) return;
      const target = this.currentTime + 5;
      this.player.seekTo?.(target, true);
    });

    document.getElementById('replay-cue-btn')?.addEventListener('click', () => {
      if (this.activeCue) {
        this.seekToCue(this.activeCue);
      } else if (this.cues.length > 0) {
        this.seekToCue(this.cues[0]);
      }
    });

    document.getElementById('next-cue-btn')?.addEventListener('click', () => {
      if (!this.activeCue) {
        if (this.cues.length > 0) this.seekToCue(this.cues[0]);
        return;
      }
      const curIdx = this.cues.findIndex((c) => c.id === this.activeCue!.id);
      if (curIdx !== -1 && curIdx + 1 < this.cues.length) {
        this.seekToCue(this.cues[curIdx + 1]);
      }
    });

    document.getElementById('prev-cue-btn')?.addEventListener('click', () => {
      if (!this.activeCue) return;
      const curIdx = this.cues.findIndex((c) => c.id === this.activeCue!.id);
      if (curIdx > 0) {
        this.seekToCue(this.cues[curIdx - 1]);
      }
    });

    this.autoScrollToggle.addEventListener('change', (e) => {
      this.autoScroll = (e.target as HTMLInputElement).checked;
      if (this.autoScroll && this.activeCue) {
        this.highlightTableRow(this.activeCue.id);
      }
    });

    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = (e.target as HTMLInputElement).value;
      this.renderCuesList();
    });
  }
}

// Bootstrap mini demo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MiniDemoApp();
});
