import { animate } from "motion"
import { particleSystem } from "../main"
import type { Particle } from "./Particle";
import { simplex2 } from "./Simplex";

export let transitionType: string = 'concentric in';
let currentGlobalShape: String = 'base';

let transitionTypes: string[] = [
    "concentric in",
    "concentric out",
    "noise"
]

export function transitionTo(next: string) {
    console.log(`transitioning to ${next}`);

    if(next == currentGlobalShape) 
        return
    
    transitionType = transitionTypes[Math.floor(Math.random()*transitionTypes.length)]

    particleSystem.particles.forEach((particle, index) => {
        const delay = computeDelay(particle, index);
        
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

function computeDelay(p: Particle, i: number): number {
    switch (transitionType) {
        case "concentric in":
            return i * 0.002;
    
        case "concentric out":
            return (particleSystem.particles.length - i) * 0.002;
            
        case "noise":
            const ns = Math.random() * 0.025
            const n = simplex2(i * ns, i * ns) * 0.5 + 0.5;
            return n * 0.4;

        default:
            return 0.0
            break;
    }
}