'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import useStore from '../store/useStore';

export default function HeroSimulation() {
    const containerRef = useRef(null);
    const currentScene = useStore(state => state.currentScrollScene);
    const simulationRef = useRef(null);
    const nodesRef = useRef([]);

    useEffect(() => {
        if (!containerRef.current) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        d3.select(containerRef.current).select("svg").remove();

        const svg = d3.select(containerRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background", "#0a0a0a") // Neutral-950
            .style("display", "block");

        const numNodes = 150;
        // Pre-calculate which nodes fall into the 95% Failure bracket for Scene 2
        const nodes = Array.from({ length: numNodes }, (_, i) => ({
            id: i,
            r: Math.random() * 5 + 2,
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0,
            isFailure: i < numNodes * 0.95 // 95% marked for failure
        }));
        nodesRef.current = nodes;

        let mouseX = width / 2;
        let mouseY = height / 2;
        let isMouseIn = false;

        const handleMouseMove = (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
            isMouseIn = true;
            if (simulationRef.current) simulationRef.current.alpha(0.5).restart();
        };

        const handleMouseLeave = () => {
            isMouseIn = false;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        const simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-15))
            .force("collide", d3.forceCollide().radius(d => d.r + 2).iterations(2))
            .force("mouseRepel", () => {
                if (!isMouseIn) return;
                const repelRadius = 200;

                for (let i = 0; i < nodes.length; ++i) {
                    const node = nodes[i];
                    const dx = node.x - mouseX;
                    const dy = node.y - mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < repelRadius) {
                        const force = (repelRadius - distance) / repelRadius;
                        node.vx += (dx / distance) * force * 3;
                        node.vy += (dy / distance) * force * 3;
                    }
                }
            })
            .alpha(1)
            .alphaDecay(0.015);

        simulationRef.current = simulation;

        const nodeElements = svg.append("g")
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", d => d.r)
            .attr("fill", "#ffffff")
            .attr("opacity", d => Math.random() * 0.5 + 0.3);

        // Default bounded box simulation tick
        simulation.on("tick", () => {
            nodeElements
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });

        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            svg.attr("width", w).attr("height", h);
            simulation.alpha(0.3).restart();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("resize", handleResize);
            simulation.stop();
        };
    }, []); // Run once on mount

    // React to scroll scene changes
    useEffect(() => {
        const simulation = simulationRef.current;
        if (!simulation) return;

        const width = window.innerWidth;
        const height = window.innerHeight;
        const nodeElements = d3.select(containerRef.current).selectAll("circle");

        // Reset forces before applying scene-specific ones
        simulation.force("center", null);
        simulation.force("y", null);
        simulation.force("wall", null);

        // Reset visual styles
        nodeElements
            .transition().duration(1000)
            .attr("fill", "#ffffff")
            .attr("opacity", d => Math.random() * 0.5 + 0.3);

        if (currentScene === 0) {
            // Scene 0: Chaotic Floating
            simulation.force("center", d3.forceCenter(width / 2, height / 2).strength(0.02));

            simulation.on("tick", () => {
                nodeElements
                    .attr("cx", d => {
                        if (d.x < d.r) { d.x = d.r; d.vx *= -1; }
                        if (d.x > width - d.r) { d.x = width - d.r; d.vx *= -1; }
                        return d.x;
                    })
                    .attr("cy", d => {
                        if (d.y < d.r) { d.y = d.r; d.vy *= -1; }
                        if (d.y > height - d.r) { d.y = height - d.r; d.vy *= -1; }
                        return d.y;
                    });
            });

        } else if (currentScene === 1) {
            // Scene 1: The Bureaucratic Wall
            const wallY = height * 0.6; // Invisible wall slightly below center

            simulation.force("center", d3.forceCenter(width / 2, wallY - 100).strength(0.01));

            simulation.on("tick", () => {
                nodeElements
                    .attr("cx", d => {
                        if (d.x < d.r) { d.x = d.r; d.vx *= -1; }
                        if (d.x > width - d.r) { d.x = width - d.r; d.vx *= -1; }
                        return d.x;
                    })
                    .attr("cy", d => {
                        if (d.y < d.r) { d.y = d.r; d.vy *= -1; }
                        // CRASH into the wall
                        if (d.y > wallY - d.r) {
                            d.y = wallY - d.r;
                            d.vy *= -0.5; // lose energy on bounce
                        }
                        return d.y;
                    });
            });

        } else if (currentScene === 2) {
            // Scene 2: 95% Analfabetismo Drop

            // Update fills based on failure state
            nodeElements
                .transition().duration(1000)
                .attr("fill", d => d.isFailure ? "#ff0033" : "#00ff99") // Red for fail, green for survivor
                .attr("opacity", d => d.isFailure ? 0.8 : 1);

            // Heavy gravity for failures, light float for survivors
            simulation.force("y", d3.forceY(d => d.isFailure ? height + 100 : height * 0.2).strength(d => d.isFailure ? 0.1 : 0.05));
            simulation.force("center", null);

            simulation.on("tick", () => {
                nodeElements
                    .attr("cx", d => {
                        if (d.x < d.r) { d.x = d.r; d.vx *= -1; }
                        if (d.x > width - d.r) { d.x = width - d.r; d.vx *= -1; }
                        return d.x;
                    })
                    .attr("cy", d => {
                        // Let failures fall off screen, keep survivors at top
                        if (!d.isFailure && d.y < d.r) { d.y = d.r; d.vy *= -1; }
                        return d.y;
                    });
            });

        } else if (currentScene >= 3) {
            // Scene 3 & 4: Junior Enterprise Organized Attractor

            nodeElements
                .transition().duration(1000)
                .attr("fill", "#00ff99") // Organized Neon Green
                .attr("opacity", 0.9);

            // Violent pull to center
            simulation.force("center", d3.forceCenter(width / 2, height / 2).strength(0.2));
            simulation.force("charge", d3.forceManyBody().strength(-5)); // reduce repulsion, pack tighter

            simulation.on("tick", () => {
                nodeElements
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);
            });
        }

        simulation.alpha(0.8).restart();

    }, [currentScene]);

    return <div ref={containerRef} className="w-full h-full bg-neutral-950 pointer-events-auto" />;
}
