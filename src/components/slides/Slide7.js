import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { 
    RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_NEW_ZEALAND, 
    RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_BRAZIL,
    RESOURCE_NAME_VACCINATIONS,
    RESOURCE_NAME_VACCINATIONS_UK,
    POPULATION_BRAZIL, 
    POPULATION_UK 
} from '../../constants';
import { useDimension } from '../../hooks/useDimension';

export const Slide7 = ({active}) => {
    const barchartRef = useRef();

    const brazilTimeDimension = useDimension(RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_BRAZIL, 'date');
    const unitedKingdomTimeDimension = useDimension(RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_NEW_ZEALAND, 'date');

    const brazilVaccitationTimeDimension = useDimension(RESOURCE_NAME_VACCINATIONS, 'date');
    const unitedKingdomVaccitationTimeDimension = useDimension(RESOURCE_NAME_VACCINATIONS_UK, 'date');
    
    useEffect(() => {
        
        if(barchartRef.current && brazilTimeDimension && unitedKingdomTimeDimension && brazilVaccitationTimeDimension && unitedKingdomVaccitationTimeDimension) {
            const chartDOM = barchartRef.current;
            const { width, height } = chartDOM.parentNode.getBoundingClientRect();

            const chart = dc.compositeChart(chartDOM, 'slide7');

            const scale = d3.scaleTime()
                .domain([
                    d3.timeDay.offset(Math.min(brazilTimeDimension.bottom(1)[0].date, unitedKingdomTimeDimension.bottom(1)[0].date), -1), 
                    d3.timeDay.offset(Math.max(brazilTimeDimension.top(1)[0].date, unitedKingdomTimeDimension.top(1)[0].date), -120)
                ])
                
            const groupBrazil = brazilTimeDimension.group().reduceSum(d => +d.new_deaths >= 0 ? +d.new_deaths * 100 / POPULATION_BRAZIL : null);
            const groupUnitedKingdom = unitedKingdomTimeDimension.group().reduceSum(d => +d.new_deaths >= 0 ? +d.new_deaths * 100 / POPULATION_UK : null);
            
            chart.width(width)
                .height(height)
                .margins({top: 10, right: 50, bottom: 20, left: 70})
                .x(scale)
                .xUnits(d3.timeDays)
                .elasticY(true)
                .renderHorizontalGridLines(true)
                .legend(dc.legend().x(width-200).y(5).itemHeight(13).gap(5))
                .compose([
                    dc.lineChart(chart)
                        .dimension(brazilTimeDimension)
                        .colors('red')
                        .group(groupBrazil, "Brasil"),
                    dc.lineChart(chart)
                        .dimension(unitedKingdomTimeDimension)
                        .colors('blue')
                        .group(groupUnitedKingdom, "Inglaterra")
                    ]);

            dc.renderAll('slide7');

            const selection = chartDOM.getElementsByTagName('svg')[0].getElementsByClassName('brush')[0];
            
            const reducerBr = reductio().min(d => d.people_vaccinated && +d.people_vaccinated >= 0);
            const vGroupBr = brazilVaccitationTimeDimension.group();
            reducerBr(vGroupBr);

            const vDateBr = vGroupBr.order(d => d.min).top(1)[0].key;

            const reducerUk = reductio().min(d => d.people_vaccinated && +d.people_vaccinated >= 0);
            const vGroupUk = unitedKingdomVaccitationTimeDimension.group();
            reducerUk(vGroupUk);

            const vDateUk = vGroupUk.order(d => d.min).top(1)[0].key;

            const minDate = [vDateBr, vDateUk].reduce((a, b) => a.valueOf < b.valueOf ? a : b, new Date());

            const vaccineBox = d3.select(selection)
                .append("rect")
                .attr("x", scale(minDate))
                .attr("y", 50)
                .attr("width", scale.domain()[1] - scale(minDate))
                .attr("height", height - 80)
                .attr("fill", "green")
                .attr("opacity", 0.4);
        }

    }, [brazilTimeDimension, unitedKingdomTimeDimension, brazilVaccitationTimeDimension, unitedKingdomVaccitationTimeDimension, barchartRef.current])

    return (
        <div style={{height: '100%', margin: '5rem', marginTop: '9rem', marginBottom: '18rem'}}>
            <h2>Comparativo das mortes entre Brazil e Reino Unido, com previsão para um mês a frente.</h2>
            
            <p>
                Fazendo uma previsão do próximo mês, podemos ver que a tendência do Brasil é
                aumentar os casos. Porém, isso provavelmente se deve a este momento de subida.
                <br/>
                Uma conclusão preeliminar que pode ser feita com esta análise, seguindo o exemplo 
                da Inglaterra que já zerou o número de mortes, podemos ver que quando a vacinação 
                foi iniciada (quadrado verde) a quantidade de casos aumentou. Isso provavelmente 
                se deve pela falsa impressão de que com a primeira dose, já estão protegidas da 
                doença, com isso algumas normas de isolamento podem ser desrespeitadas. Segundo 
                estudos, a Coronavac só garante sua proteção a partir de 15 dias após a segunda dose.
            </p>

            <div style={{height: '15rem'}} ref={barchartRef}/>
        </div>
    );
}