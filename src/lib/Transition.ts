import { animate } from "motion"
import { particleSystem } from "../main"
import { simplex2 } from "./Simplex";

export let transitionType: string = 'concentric in 5';
let currentGlobalShape: String = 'base';

let transitionTypes: string[] = [
    "concentric in",
    "concentric in 2",
    "concentric in 3",
    "concentric in 4",
    "concentric in 5",
    "concentric out",
    "concentric out 2",
    "concentric out 3",
    "concentric out 4",
    "concentric out 5",
    "noise",
    "noise 2",
    "noise 3",
    "noise 4",
    "noise 5",
]

export function transitionTo(next: string) {
    console.log(`transitioning to ${next}`);

    if(next == currentGlobalShape) 
        return
    
    transitionType = transitionTypes[Math.floor(Math.random()*transitionTypes.length)]

    particleSystem.particles.forEach((particle, index) => {
        const delay = computeDelay(index);
        
        animate(
            particle.scaleMultiplier,
            0,
            {
                duration: 0.2,
                delay: delay,
                onUpdate: (latest) => {
                    particle.scaleMultiplier = latest;
                },
                onComplete: () => {
                    currentGlobalShape = next;
                    particle.currentShape = next;
                    
                    animate(
                        particle.scaleMultiplier,
                        1,
                        {
                            duration: 0.2,
                            onUpdate: (latest) => {
                                particle.scaleMultiplier = latest;
                            }
                        }
                    );
                }
            }
        );
    });
}

export function fadeIn() {

    transitionType = transitionTypes[Math.floor(Math.random()*transitionTypes.length)]

    particleSystem.particles.forEach((particle, index) => {
        const delay = computeDelay(index);
        
        animate(
            particle.scaleMultiplier,
            1,
            {
                duration: 0.2,
                delay: delay,
                onUpdate: (latest) => {
                    particle.scaleMultiplier = latest;
                }
            }
        );
    });
}

function computeDelay(i: number): number {
    const count = particleSystem.particles.length;

    switch (transitionType) {
        case "concentric in":
            return i * 0.002;
            
        case "concentric in 2":
            return ((i * 10) % count) * 0.002;
    

        case "concentric in 3":
            return ((i * 5) % count) * 0.002;

            
        case "concentric in 4":
            return ((i * 2) % count) * 0.002;


        case "concentric in 5":
            return ((i * 1.618 * 100) % count) * 0.002;


        case "concentric out":
            return (particleSystem.particles.length - i) * 0.002;

            
        case "concentric out 2":
            return (particleSystem.particles.length - ((i * 10) % count)) * 0.002;

            
        case "concentric out 3":
            return (particleSystem.particles.length - ((i * 5) % count)) * 0.002;

            
        case "concentric out 4":
            return (particleSystem.particles.length - ((i * 2) % count)) * 0.002;

            
        case "concentric out 5":
            return (particleSystem.particles.length - ((i * 1.618 * 100) % count)) * 0.002;
            
            
        case "noise": {
            const ns = Math.random() * 0.025
            const n = simplex2(i * ns, i * ns) * 0.5 + 0.5;
            return n * 0.4;
        }
            

        case "noise 2": {
            const ns = Math.random() * 0.025
            const n = simplex2(i * ns, i * ns) * 0.5 + 0.5;
            return n * 0.4;
        }

        case "noise 3": {
            const ns = Math.random() * 0.25
            const n = simplex2(i * ns, i * ns) * 0.5 + 0.5;
            return n * 0.4;
        }

        case "noise 4": {
            const ns = Math.random() * 0.001
            const n = simplex2(i * ns, i * ns) * 0.8 + 0.8;
            return n * 0.4;
        }

        case "noise 5": {
            const ns = Math.random() * 0.0042
            const n = simplex2(i * ns, i * ns) * 0.5 + 0.5;
            return n * 0.4;
        }
            

        default:
            return 0.0
            break;
    }
}