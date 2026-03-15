"use client"

/**
 * Gerenciador de Sons (UI Audio)
 * Utiliza a Web Audio API para gerar tons sintéticos para feedback de interface.
 */
class SoundManager {
  private ctx: AudioContext | null = null

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  private playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.1) {
    this.init()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

    gain.gain.setValueAtTime(volume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start()
    osc.stop(this.ctx.currentTime + duration)
  }

  // Clique sutil para elementos de interface
  playClick() {
    this.playTone(800, 0.1, "sine", 0.05)
  }

  // Som de sucesso (tom mais alto, levemente mais longo)
  playSuccess() {
    this.playTone(1200, 0.2, "sine", 0.05)
  }

  // Som de busca (tons ascendentes)
  playSearch() {
    this.playTone(400, 0.1, "sine", 0.03)
    setTimeout(() => this.playTone(600, 0.1, "sine", 0.03), 50)
    setTimeout(() => this.playTone(800, 0.1, "sine", 0.03), 100)
  }
}

export const sounds = new SoundManager()
