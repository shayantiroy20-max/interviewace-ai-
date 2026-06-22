/**
 * Proprietary UI Synthesizer Sound Engine
 * Leverages the browser's Web Audio API to generate fluid, clean,
 * and high-fidelity sound notifications without external dependencies.
 */

class AudioSynthEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  public initAndResume() {
    try {
      this.init();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn("Could not resume AudioContext:", e);
    }
  }

  /**
   * Crisp, premium SaaS UI click feedback
   */
  public playClick() {
    try {
      this.init();
      if (!this.ctx) return;

      // Resume context if suspended (browser security blocks audio until first user interaction)
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      // Clean tech bell sound
      osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gainNode.gain.setValueAtTime(0.04, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn("Audio feedback omitted:", e);
    }
  }

  /**
   * Ascending warm chord signifying report completion / successful state
   */
  public playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;

      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // Tone 1: Base root note (E5)
      const osc1 = this.ctx.createOscillator();
      const gainNode1 = this.ctx.createGain();
      osc1.connect(gainNode1);
      gainNode1.connect(this.ctx.destination);

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, now); // E5
      gainNode1.gain.setValueAtTime(0.05, now);
      gainNode1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc1.start(now);
      osc1.stop(now + 0.3);

      // Tone 2: Ascending perfect fifth (B5) triggered 70ms later
      setTimeout(() => {
        try {
          if (!this.ctx) return;
          const osc2 = this.ctx.createOscillator();
          const gainNode2 = this.ctx.createGain();
          osc2.connect(gainNode2);
          gainNode2.connect(this.ctx.destination);

          osc2.type = "sine";
          osc2.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
          gainNode2.gain.setValueAtTime(0.04, this.ctx.currentTime);
          gainNode2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

          osc2.start(this.ctx.currentTime);
          osc2.stop(this.ctx.currentTime + 0.4);
        } catch {}
      }, 70);

    } catch (e) {
      console.warn("Audio feedback omitted:", e);
    }
  }
}

export const playSound = new AudioSynthEngine();

if (typeof window !== "undefined") {
  const resumeOnFirstInteraction = () => {
    playSound.initAndResume();
    window.removeEventListener("click", resumeOnFirstInteraction);
    window.removeEventListener("touchstart", resumeOnFirstInteraction);
  };
  window.addEventListener("click", resumeOnFirstInteraction, { capture: true, passive: true });
  window.addEventListener("touchstart", resumeOnFirstInteraction, { capture: true, passive: true });
}
