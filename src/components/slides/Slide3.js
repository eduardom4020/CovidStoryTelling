import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';
import { v4 as uuid } from 'uuid';

import Assets from '../../assets';

export const Slide3 = ({active}) => {
    const chartRef = useRef();
    
    const [ transformedData, setTransformedData ] = useState();
    const [ focused, setFocused ] = useState();
    const [ mode, setMode ] = useState('default');

    useEffect(() => {
        const totalPopulation = Assets.susCovidLatest.map(s => s.population).reduce((acc, curr) => acc + curr, 0);
        const totalInfected = Assets.susCovidLatest.map(s => s.cases).reduce((acc, curr) => acc + curr, 0);
        const totalDeaths = Assets.susCovidLatest.map(s => s.deaths).reduce((acc, curr) => acc + curr, 0);
        
        let data = {nodes: [], links: []};

        switch(mode) {
            case 'deaths':
                // data.links.filter(d => d.source.match(/population\w\w/g) && d.value * .9 <= totalDeaths);

                data = { 
                    nodes: [
                        ...Assets.susCovidLatest.sort((a, b) => b.deaths / b.cases - a.deaths / a.cases)
                            .map(s => ({ node: `population${s.state}`, name: s.state, group: 'state' })),
                        { node: 'death', name: 'Óbitos %' }
                    ],
                    links: [
                        ...Assets.susCovidLatest.map(s => ({ source: `population${s.state}`, target: 'death', value: s.deaths * 100 / s.cases })),
                    ]
                };

                break;

            default:
                data = { 
                    nodes: [
                        // { node: 'totalPopulation', name: 'Brasil' },
                        ...Assets.susCovidLatest.sort((a, b) => b.cases - a.cases)
                            .map(s => ({ node: `population${s.state}`, name: s.state, group: 'state' })),
                        // { node: 'notInfected', name: 'Não Infectados / Não Comprovados' },
                        { node: 'infected', name: 'Infectados' },
                        { node: 'death', name: 'Óbitos' },
                        { node: 'recovered', name: 'Recuperados' }
                    ],
                    links: [
                        // ...Assets.susCovidLatest.map(s => ({ source: 'totalPopulation', target: `population${s.state}`, value: s.population })),
                        ...Assets.susCovidLatest.map(s => ({ source: `population${s.state}`, target: 'infected', value: s.cases })),
                        // ...Assets.susCovidLatest.map(s => ({ source: `population${s.state}`, target: 'notInfected', value: s.population - s.cases })),
                        // ...Assets.susCovidLatest.map(s => ({ source: `population${s.state}`, target: 'death', value: s.deaths })),
                        // ...Assets.susCovidLatest.map(s => ({ source: 'infected', target: 'death', value: s.deaths })),
                        // ...Assets.susCovidLatest.map(s => ({ source: 'infected', target: 'recovered', value: s.cases - s.deaths }))
        
                        // { source: 'totalPopulation', target: 'infected', value: totalInfected },
                        // // { source: 'totalPopulation', target: 'notInfected', value: totalPopulation - totalInfected },
                        { source: 'infected', target: 'recovered', value: totalInfected - totalDeaths },
                        { source: 'infected', target: 'death', value: totalDeaths },
                        // // ...Assets.susCovidLatest.map(s => ({ source: 'infected', target: 'death', value: s.deaths })),
                        // // ...Assets.susCovidLatest.map(s => ({ source: 'infected', target: 'recovered', value: s.cases - s.deaths }))
                        // ...Assets.susCovidLatest.map(s => ({ source: 'infected', target: `population${s.state}`, value: s.cases })),
                        // // ...Assets.susCovidLatest.map(s => ({ source: 'notInfected', target: `population${s.state}`, value: s.population - s.cases })),
                        // ...Assets.susCovidLatest.map(s => ({ source: 'death', target: `population${s.state}`, value: s.deaths })),
                    ]
                };

                break;
        }

        setTransformedData(data);
    }, [mode]);

    useEffect(() => {
        if(!focused && active)
            setTimeout(() => setFocused(true), 200);

        if(focused && !active)
            setTimeout(() => setFocused(false), 200);
    }, [active, focused]);

    window.totalDeaths = Assets.susCovidLatest.map(s => s.deaths).reduce((acc, curr) => acc + curr, 0);;
    window.transformedData = transformedData;
    window.setTransformedData = setTransformedData;

    useEffect(() => {
        
        if(chartRef.current && transformedData) {
            const chartDOM = chartRef.current;
            const { width, height } = chartDOM.parentNode.getBoundingClientRect();

            // set the dimensions and margins of the graph
            const margin = {top: 10, right: 10, bottom: 10, left: 10};
            const baseWidth = width - margin.left - margin.right;
            const baseHeight = height - margin.top - margin.bottom;

            // append the svg object to the body of the page
            d3.select(chartDOM).select('svg').remove();
            const svg = d3.select(chartDOM).append("svg")
                .attr("width", baseWidth + margin.left + margin.right)
                .attr("height", baseHeight + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            const defs = svg.append('defs');

            const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
            const getColor = d => colorScale(d.group === undefined ? d.node : d.group);

            // Set the sankey diagram properties
            const sankeyConfig = sankey()
                .nodeId(d => d.node)
                .nodeWidth(15)
                .nodePadding(5)
                .nodeAlign(sankeyLeft)
                .extent([[1, 1], [baseWidth - 1, baseHeight - 5]]);

            const {nodes, links} = sankeyConfig({
                nodes: transformedData.nodes.map(d => Object.assign({}, d)),
                links: transformedData.links.map(d => Object.assign({}, d))
            });

            const link = svg.append("g")
                    .attr("fill", "none")
                    .attr("stroke-opacity", 0.5)
                .selectAll("g")
                .data(links.map(l => ({uid: uuid(), ...l})))
                .join("g")
                    .style("mix-blend-mode", "multiply")
                .sort((a, b) => b.dy - a.dy)
                .on('mouseover', function () {
                    d3.select(this).style('stroke-opacity', 0.6);
                })
                .on('mouseout', function () {
                    d3.select(this).style('stroke-opacity', 0.4);
                });
            
            link.append("path")
                .attr("d", sankeyLinkHorizontal())
                .attr("stroke", d => d.uid)
                .attr("stroke-width", d => Math.max(1, d.width));

            link.style('stroke', (d, i) => {

                const startColor = getColor(d.source);
                const stopColor = getColor(d.target);
            
                const linearGradient = defs.append('linearGradient')
                    .attr('id', d.uid);
            
                linearGradient.selectAll('stop') 
                  .data([                             
                      {offset: '10%', color: startColor },      
                      {offset: '90%', color: stopColor }    
                    ])                  
                  .enter().append('stop')
                  .attr('offset', d => {
                    console.log('d.offset', d.offset);
                    return d.offset; 
                  })   
                  .attr('stop-color', d => {
                    console.log('d.color', d.color);
                    return d.color;
                  });
            
                return `url(#${d.uid})`;
            });
              
            link.append("title")
                .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);

            svg.append("g")
                    .attr("stroke", "#000")
                .selectAll("rect")
                .data(nodes)
                .join("rect")
                    .attr("x", d => d.x0)
                    .attr("y", d => d.y0)
                    .attr("height", d => d.y1 - d.y0)
                    .attr("width", d => d.x1 - d.x0)
                    .attr("fill", getColor)
                .append("title")
                    .text(d => `${d.name}\n${d.value}`);

            svg.append("g")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 10)
                .selectAll("text")
                .data(nodes)
                .join("text")
                    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
                    .attr("y", d => (d.y1 + d.y0) / 2)
                    .attr("dy", "0.35em")
                    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
                    .text(d => d.name);
        }

    }, [chartRef.current, transformedData])

    return (
        <div style={{height: '100%', position: 'relative'}}>
            <h2>Fluxo dos casos de covid no Brasil, por estado</h2>
            <div 
                style={{
                    height: '25rem', transition: 'transform .7s ease-in-out',
                    transform: mode !== 'default' ? 'rotateX(360deg)' : 'rotateX(-360deg)'
                }} 
                ref={chartRef}
            />
            <div style={{
                position: 'absolute', bottom: '-4rem', right: '5rem',
                width: '30rem', height: '12rem', backgroundColor: '#dbdbdb50',
                borderRadius: '8rem', transform: !focused && 'translateX(-100rem)',
                transition: 'transform .3s ease-in-out', border: '1px solid black'
            }}>
                <p style={{margin: '2.5rem'}}>
                    {
                        mode === 'default' ?
                            <span>
                                Neste fluxo observa-se o quantitativo de infectados para cada estado do País.
                                E também, de todos os infectados, quantos casos evoluíram para óbitos e quantos 
                                progrediram para recuperação.
                            </span>
                        :
                            <span>
                                Neste fluxo observa-se o percentual de óbitos em relação aos casos confirmados, 
                                para cada estado.
                            </span>
                    }
                </p>
                <a 
                    href=''
                    onClick={e => {
                        e.preventDefault(); 
                        mode === 'default' ? setMode('deaths')
                        : setMode('default')
                    }} 
                    style={{textAlign: 'center'}}
                >
                    {
                        mode === 'default' ? 'Óbitos por Estado'
                        : 'Infectados por Estado / Evolução dos Casos'
                    }
                </a>
            </div>
        </div>
    );
}