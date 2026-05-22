'use strict';

const THEME_PARTICLES = {
  tiger: [
    { emoji: '🐯', count: 4, minSize: 28, maxSize: 44, type: 'drift',   minDur: 9,  maxDur: 16 },
    { emoji: '🔥', count: 8, minSize: 14, maxSize: 22, type: 'float',   minDur: 5,  maxDur: 9  },
  ],
  lion: [
    { emoji: '🦁', count: 3, minSize: 30, maxSize: 46, type: 'drift',   minDur: 11, maxDur: 18 },
    { emoji: '🍃', count: 10, minSize: 12, maxSize: 20, type: 'fall',   minDur: 5,  maxDur: 10 },
    { emoji: '🌾', count: 4, minSize: 18, maxSize: 28,  type: 'sway',   minDur: 3,  maxDur: 5  },
  ],
  wolf: [
    { emoji: '⭐', count: 14, minSize: 10, maxSize: 18, type: 'twinkle', minDur: 2, maxDur: 5  },
    { emoji: '🌙', count: 2,  minSize: 30, maxSize: 42, type: 'drift',   minDur: 14, maxDur: 20 },
    { emoji: '🐺', count: 2,  minSize: 26, maxSize: 36, type: 'drift',   minDur: 13, maxDur: 18 },
  ],
  fox: [
    { emoji: '🍂', count: 10, minSize: 14, maxSize: 24, type: 'fall',   minDur: 4,  maxDur: 8  },
    { emoji: '🍁', count: 8,  minSize: 12, maxSize: 20, type: 'fall',   minDur: 5,  maxDur: 9  },
    { emoji: '🦊', count: 3,  minSize: 26, maxSize: 40, type: 'drift',  minDur: 10, maxDur: 16 },
  ],
  panda: [
    { emoji: '🎋', count: 5,  minSize: 22, maxSize: 34, type: 'sway',   minDur: 3,  maxDur: 5  },
    { emoji: '🐼', count: 4,  minSize: 28, maxSize: 44, type: 'drift',  minDur: 10, maxDur: 16 },
    { emoji: '🖤', count: 6,  minSize: 12, maxSize: 18, type: 'float',  minDur: 6,  maxDur: 10 },
  ],
  pig: [
    { emoji: '🩷', count: 10, minSize: 14, maxSize: 22, type: 'float',  minDur: 4,  maxDur: 8  },
    { emoji: '🫧', count: 7,  minSize: 16, maxSize: 26, type: 'float',  minDur: 5,  maxDur: 9  },
    { emoji: '🐷', count: 4,  minSize: 26, maxSize: 38, type: 'drift',  minDur: 9,  maxDur: 14 },
  ],
  butterfly: [
    { emoji: '🦋', count: 7,  minSize: 20, maxSize: 36, type: 'drift',   minDur: 7,  maxDur: 13 },
    { emoji: '🌸', count: 10, minSize: 12, maxSize: 20, type: 'fall',    minDur: 6,  maxDur: 11 },
    { emoji: '✨', count: 8,  minSize: 12, maxSize: 18, type: 'twinkle', minDur: 2,  maxDur: 4  },
  ],
  koala: [
    { emoji: '🌿', count: 10, minSize: 14, maxSize: 22, type: 'fall',   minDur: 6,  maxDur: 11 },
    { emoji: '🐨', count: 4,  minSize: 28, maxSize: 44, type: 'drift',  minDur: 12, maxDur: 18 },
    { emoji: '💧', count: 6,  minSize: 12, maxSize: 18, type: 'float',  minDur: 5,  maxDur: 9  },
  ],
};

function rnd(min, max) { return Math.random() * (max - min) + min; }

function createParticle({ emoji, type, minSize, maxSize, minDur, maxDur }) {
  const el = document.createElement('span');
  el.textContent = emoji;
  const size = rnd(minSize, maxSize);
  const dur  = rnd(minDur, maxDur);

  let css = `
    position: absolute;
    font-size: ${size}px;
    pointer-events: none;
    user-select: none;
    animation-name: bg-${type};
    animation-duration: ${dur}s;
    animation-iteration-count: infinite;
    animation-delay: ${-rnd(0, dur)}s;
    opacity: 0;
  `;

  if (type === 'float') {
    css += `left:${rnd(0, 93)}%; top: 100%; animation-timing-function: linear;`;
  } else if (type === 'fall') {
    css += `left:${rnd(0, 93)}%; top: -8%; animation-timing-function: linear;`;
  } else if (type === 'drift') {
    css += `left:${rnd(5, 80)}%; top:${rnd(5, 75)}%; animation-timing-function: ease-in-out;`;
  } else if (type === 'twinkle') {
    css += `left:${rnd(2, 93)}%; top:${rnd(2, 88)}%; animation-timing-function: ease-in-out;`;
  } else if (type === 'sway') {
    css += `left:${rnd(5, 85)}%; bottom:${rnd(0, 15)}%; transform-origin: bottom center; animation-timing-function: ease-in-out;`;
  }

  el.style.cssText = css;
  return el;
}

function setThemeBg(themeId) {
  const container = document.getElementById('themeBg');
  if (!container) return;
  container.innerHTML = '';

  const groups = THEME_PARTICLES[themeId];
  if (!groups) return;

  groups.forEach(group => {
    for (let i = 0; i < group.count; i++) {
      container.appendChild(createParticle(group));
    }
  });
}

function clearThemeBg() {
  const container = document.getElementById('themeBg');
  if (container) container.innerHTML = '';
}

window.setThemeBg  = setThemeBg;
window.clearThemeBg = clearThemeBg;
