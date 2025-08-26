// Polyphonic audio engine - creates new instances for concurrent playback
import * as Tone from "tone";

// Cache for preloaded audio URLs to avoid re-fetching
const preloadCache = new Set<string>();
const playerCache = new Map<string, Tone.Player>();

// Clean up finished audio instances to prevent memory leaks
const activeAudioInstances = new Set<HTMLAudioElement>();

export async function play(url: string, gainDb: number = 0) {
  try {
    // Create a new Audio instance for each playback (polyphonic behavior)
    const audio = new Audio(url);
    
    // Preload if not already cached
    if (!preloadCache.has(url)) {
      audio.preload = 'auto';
      preloadCache.add(url);
    }
    
    // Apply gain (convert dB to linear volume)
    const volume = Math.pow(10, gainDb / 20);
    audio.volume = Math.max(0, Math.min(1, volume));
    
    // Track active instances
    activeAudioInstances.add(audio);
    
    // Clean up when audio ends or fails
    const cleanup = () => {
      activeAudioInstances.delete(audio);
      audio.removeEventListener('ended', cleanup);
      audio.removeEventListener('error', cleanup);
    };
    
    audio.addEventListener('ended', cleanup);
    audio.addEventListener('error', cleanup);
    
    // Start playback
    await audio.play();
    
  } catch (error) {
    // Fallback to Tone.js for polyphonic playback
    await Tone.start();
    
    // Use Tone.js ToneAudioBuffer for polyphonic playback
    if (!playerCache.has(url)) {
      const buffer = new Tone.ToneAudioBuffer(url);
      playerCache.set(url, buffer as any);
    }
    
    // Create a new player instance for each trigger
    const player = new Tone.Player().toDestination();
    player.volume.value = gainDb;
    player.buffer = playerCache.get(url)!.buffer || url;
    
    if (player.loaded) {
      player.start();
      // Auto-dispose after playback to prevent memory leaks
      player.onstop = () => player.dispose();
    } else {
      await player.load(url);
      player.start();
      player.onstop = () => player.dispose();
    }
  }
}

// Utility function to clean up all active audio instances (useful for page unload)
export function stopAllAudio() {
  activeAudioInstances.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  activeAudioInstances.clear();
}