import './style.css';
import { ParticleSystem } from './lib/ParticleSystem';
import { fadeIn, transitionTo } from './lib/Transition';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <canvas id="canvas"></canvas>
`;

const nav = document.createElement('div');
nav.className = 'selectors';

// Create properties group
const propertiesGroup = document.createElement('div');
propertiesGroup.className = 'nav-group';

const propertiesLabel = document.createElement('div');
propertiesLabel.className = 'nav-label';
propertiesLabel.textContent = 'properties';
propertiesGroup.appendChild(propertiesLabel);

const propertiesLinks = [
    { text: 'INTERACTIVE', action: 'interactive' },
    { text: 'HALO', action: 'halo' }
];

// Create types group
const typesGroup = document.createElement('div');
typesGroup.className = 'nav-group';

const typesLabel = document.createElement('div');
typesLabel.className = 'nav-label';
typesLabel.textContent = 'types';
typesGroup.appendChild(typesLabel);

const typesLinks = [
    { text: 'Base', action: 'base' },
    { text: 'SAARM', action: 'saarm' },
    { text: 'ITASFW', action: 'itasfw' },
    { text: 'PHCO', action: 'phco' },
    { text: 'EDU', action: 'edu' }
];

// Add properties links
propertiesLinks.forEach(link => {
    const anchor = document.createElement('a');
    anchor.id = link.text.toLowerCase();
    anchor.href = '#';
    anchor.textContent = link.text;
    anchor.dataset.action = link.action;

    if(link.action === 'interactive' || link.action === 'halo') {
        anchor.style.background = 'white';
        anchor.style.color = 'black';
    }

    propertiesGroup.appendChild(anchor);
});

// Add types links
typesLinks.forEach(link => {
    const anchor = document.createElement('a');
    anchor.id = link.text.toLowerCase();
    anchor.href = '#';
    anchor.textContent = link.text;
    anchor.dataset.action = link.action;

    typesGroup.appendChild(anchor);
});

// Add both groups to nav
nav.appendChild(propertiesGroup);
nav.appendChild(typesGroup);
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
    if(target !== undefined) {
        if (target === 'interactive') {
            particleSystem.toggleInteractive();

            const interactiveAnchor = document.getElementById("interactive")!;
            if (particleSystem.interactive) {
                interactiveAnchor.style.background = 'white';
                interactiveAnchor.style.color = 'black';
            } else {
                interactiveAnchor.style.background = 'transparent';
                interactiveAnchor.style.color = 'white';
            }
            return;
        }

        if (target === 'halo') {
            particleSystem.toggleHalo();

            const haloAnchor = document.getElementById("halo")!;
            if (particleSystem.halo) { // Assuming halo property exists
                haloAnchor.style.background = 'white';
                haloAnchor.style.color = 'black';
            } else {
                haloAnchor.style.background = 'transparent';
                haloAnchor.style.color = 'white';
            }
            return;
        }

        transitionTo(target);
    }
}

export const particleSystem = new ParticleSystem('canvas');

particleSystem.start();