import './style.css';
import { ParticleSystem } from './lib/ParticleSystem';
import { transitionTo } from './lib/Transition';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <canvas id="canvas"></canvas>
`;


const nav = document.createElement('div');
nav.className = 'selectors';

const links = [
    { text: 'Base', action: 'base' },
    { text: 'SAARM', action: 'saarm' },
    { text: 'ITASFW', action: 'itasfw' },
    { text: 'PHCO', action: 'phco' },
    { text: 'EDU', action: 'edu' }
]

links.forEach(link => {
  const anchor = document.createElement('a');
  anchor.href = '#';
  anchor.textContent = link.text;
  anchor.dataset.action = link.action;
  nav.appendChild(anchor);
});

app.appendChild(nav);

nav.addEventListener('click', (e) => {
  e.preventDefault();
  const target = e.target as HTMLElement;
  
  if (target.tagName === 'A') {
      const action = target.dataset.action;
      handleAction(action);
  }
});

function handleAction(target: string | undefined) {
  console.log(target)

  if(target !== undefined) {
    transitionTo(target)
  }
}

export const particleSystem = new ParticleSystem('canvas');
particleSystem.start();