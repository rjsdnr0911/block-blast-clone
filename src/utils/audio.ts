import { Howl } from 'howler';
import { ThemeType } from '../context/ThemeContext';

const MOCK_URL = 'data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

const getPath = (path: string) => {
  if (path.startsWith('data:')) return path;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const base = (import.meta as any).env.BASE_URL || '/';
  return `${base}${path.replace(/^\//, '')}`;
};

const SOUNDS: Record<string, Partial<Record<string, Howl>>> = {
  default: {
    drop: new Howl({ src: [getPath('/sounds/drop.m4a')], volume: 1.0 }), 
    clear_single: new Howl({ src: [getPath(MOCK_URL)], volume: 0.8 }),
  },
  nature: {
    drop: new Howl({ src: [getPath('/sounds/drop.m4a')], volume: 1.0 }),
    clear_single: new Howl({ src: [getPath(MOCK_URL)], volume: 0.8 }),
  },
  keyboard: {
    drop: new Howl({ src: [getPath('/sounds/drop.m4a')], volume: 1.0 }),
    clear_single: new Howl({ src: [getPath(MOCK_URL)], volume: 0.8 }),
  },
  minerals: {
    drop: new Howl({ src: [getPath('/sounds/pebble_drop.wav')], volume: 1.0 }),
    clear_single: new Howl({ src: [getPath('/sounds/pebble_clear_single.wav')], volume: 1.0 }),
    clear_all: new Howl({ src: [getPath('/sounds/pebble_clear_all.wav')], volume: 1.0 }),
  }
};

export const playSound = (theme: ThemeType, action: 'drop' | 'clear_single' | 'clear_all') => {
  console.log(`[Audio Engine] Playing ${action} sound for ${theme} theme`);
  const sound = SOUNDS[theme]?.[action];
  if (sound) {
    try {
      // 연속으로 블록을 놓을 때 소리가 씹히거나 끊기지 않고 즉각 반응하도록 stop() 후 재생
      sound.stop(); 
      sound.play();
    } catch (e) {
      console.warn("Sound play failed", e);
    }
  }
};
