import './style.css';
import { ParticleSystem } from './lib/ParticleSystem';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <canvas id="canvas"></canvas>
`;


const particleSystem = new ParticleSystem('canvas');
particleSystem.start();