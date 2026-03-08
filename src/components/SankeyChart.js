'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyCenter } from 'd3-sankey';

const SankeyChart = ({ budget }) => {
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        // Measure the container width/height
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setDimensions({ width, height: height || 400 });
        }

        const handleResize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height: height || 400 });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!dimensions.width || !dimensions.height) return;

        // Defines the nodes and links based on budget comparison
        // We split the budget in 2 paths internally just for visualization:
        // This isn't technically splitting 1 budget into two halves
        // But rather showing two completely separate flows starting from the same amount.
        // For Sankey to not look broken with varying sources, we'll create two source nodes.

        // Real-world Fiscal Math:
        // Path A: Freelance (Autónomo)
        const baseA = budget;
        const ivaRate = 0.21;
        const irpfRate = 0.15;
        const cuotaAutonomo = 294; // Flat average monthly quota in Spain

        const ivaLeak = baseA * ivaRate;
        const irpfLeak = baseA * irpfRate;

        let profitA = baseA - ivaLeak - irpfLeak - cuotaAutonomo;
        if (profitA < 0) profitA = 0; // Prevent negative Sankey flows

        // Path B: Junior Enterprise
        const baseB = budget;
        // 0% immediate tax leak (handled via university/association exemptions)
        // 100% goes to the student "Bolsa de Horas" or material purchases
        const profitB = baseB;

        const data = {
            nodes: [
                { id: "Ingreso Base (Autónomo)", group: "A" },
                { id: "Ingreso Base (Junior Empresa)", group: "B" },

                { id: "Cuota Autónomo", group: "LeakA" },
                { id: "IRPF (15%)", group: "LeakA" },
                { id: "IVA (21%)", group: "LeakA" },
                { id: "Beneficio Neto Real", group: "MarginA" },

                { id: "Bolsa Horas / Material", group: "MarginB" },
            ],
            links: [
                // Path A (Freelance) flow
                { source: "Ingreso Base (Autónomo)", target: "Cuota Autónomo", value: cuotaAutonomo > baseA ? baseA : cuotaAutonomo },
                { source: "Ingreso Base (Autónomo)", target: "IRPF (15%)", value: irpfLeak },
                { source: "Ingreso Base (Autónomo)", target: "IVA (21%)", value: ivaLeak },
                { source: "Ingreso Base (Autónomo)", target: "Beneficio Neto Real", value: profitA || 0.001 },

                // Path B (Junior Enterprise) flow
                { source: "Ingreso Base (Junior Empresa)", target: "Bolsa Horas / Material", value: profitB },
            ]
        };

        const { width, height } = dimensions;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const sankeyLayout = sankey()
            .nodeId(d => d.id)
            .nodeWidth(20)
            .nodePadding(30)
            .nodeAlign(sankeyCenter)
            .extent([[10, 10], [width - 10, height - 10]]);

        const { nodes, links } = sankeyLayout({
            nodes: data.nodes.map(d => Object.assign({}, d)),
            links: data.links.map(d => Object.assign({}, d))
        });

        const format = d3.format(",.0f");

        const colorScheme = {
            A: "#404040", // neutral dark start
            B: "#404040",
            LeakA: "#dc2626", // Warning red
            MarginA: "#4ade80", // Warning red (usually margin is green but here we show it's small)
            LeakB: "#dc2626",
            MarginB: "#4ade80" // Neon Green
        };

        // Draw links
        svg.append("g")
            .attr("fill", "none")
            .attr("stroke-opacity", 0.3)
            .selectAll("path")
            .data(links)
            .join("path")
            .attr("d", sankeyLinkHorizontal())
            .attr("stroke", d => d.target.group.startsWith("Leak") ? "#dc2626" : "#4ade80")
            .attr("stroke-width", d => Math.max(1, d.width))
            .style("mix-blend-mode", "screen")
            .append("title")
            .text(d => `${d.source.id} → ${d.target.id}\n${format(d.value)} €`);

        // Draw nodes
        svg.append("g")
            .selectAll("rect")
            .data(nodes)
            .join("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", d => colorScheme[d.group] || "#525252")
            .append("title")
            .text(d => `${d.id}\n${format(d.value)} €`);

        // Add labels
        svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("fill", "#e5e5e5")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr("y", d => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
            .text(d => d.id)
            // Append value text specifically
            .append("tspan")
            .attr("fill-opacity", 0.7)
            .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr("dy", "1.2em")
            .text(d => `${format(d.value)} €`);

    }, [budget, dimensions]);

    return (
        <div ref={containerRef} className="w-full h-full min-h-[400px]">
            <svg ref={svgRef} width="100%" height="100%"></svg>
        </div>
    );
};

export default SankeyChart;
