// Keep Tone.js as backup but use native Audio API for better compatibility
import * as Tone from "tone";

const audioCache = new Map<string, HTMLAudioElement>();
const playerCache = new Map<string, Tone.Player>();

export async function play(url: string, gainDb: number = 0) {
  console.log('Audio engine play() called:', { url, gainDb });
  
  try {
    // Try native Audio API first for better browser compatibility
    if (!audioCache.has(url)) {
      console.log('Creating new Audio instance for:', url);
      const audio = new Audio(url);
      audio.preload = 'auto';
      audioCache.set(url, audio);
    }
    
    const audio = audioCache.get(url)!;
    
    // Apply gain (convert dB to linear volume)
    const volume = Math.pow(10, gainDb / 20);
    audio.volume = Math.max(0, Math.min(1, volume));
    console.log('Set audio volume:', volume);
    
    // Reset to start and play
    audio.currentTime = 0;
    console.log('Playing audio...');
    await audio.play();
    console.log('Audio play() completed successfully');
    
  } catch (error) {
    console.warn('Native audio failed, falling back to Tone.js:', error);
    
    // Fallback to Tone.js
    await Tone.start();
    
    if (!playerCache.has(url)) {
      const player = new Tone.Player(url).toDestination();
      playerCache.set(url, player);
    }
    
    const player = playerCache.get(url)!;
    player.volume.value = gainDb;
    
    if (player.loaded) {
      player.start();
    } else {
      player.load(url).then(() => player.start());
    }
  }
}