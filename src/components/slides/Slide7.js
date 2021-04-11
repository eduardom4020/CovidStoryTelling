import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { 
    RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_NEW_ZEALAND, 
    RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_BRAZIL,
    POPULATION_BRAZIL, 
    POPULATION_UNITED_KINGDOM 
} from '../../constants';
import { useDimension } from '../../hooks/useDimension';

export const Slide7 = ({active}) => {
    const barchartRef = useRef();

    const brazilTimeDimension = useDimension(RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_BRAZIL, 'date');
    const newZealandTimeDimension = useDimension(RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_NEW_ZEALAND, 'date');

    useEffect(() => {
        
        if(brazilTimeDimension && newZealandTimeDimension) {
            const chartDOM = barchartRef.current;
            const { width, height } = chartDOM.parentNode.getBoundingClientRect();

            const chart = dc.compositeChart(chartDOM, 'slide7');

            const scale = d3.scaleTime()
                .domain([
                    d3.timeDay.offset(Math.min(brazilTimeDimension.bottom(1)[0].date, newZealandTimeDimension.bottom(1)[0].date), -1), 
                    d3.timeDay.offset(Math.max(brazilTimeDimension.top(1)[0].date, newZealandTimeDimension.top(1)[0].date), 1)
                ])
                
            const groupBrazil = brazilTimeDimension.group().reduceSum(d => +d.new_deaths >= 0 ? +d.new_deaths / POPULATION_BRAZIL : 0);
            const groupNewZealand = newZealandTimeDimension.group().reduceSum(d => +d.new_deaths >= 0 ? +d.new_deaths / POPULATION_UNITED_KINGDOM : 0);
            
            chart.width(width)
                .height(height)
                .margins({top: 10, right: 50, bottom: 20, left: 70})
                .x(scale)
                .xUnits(d3.timeDays)
                .elasticY(true)
                .renderHorizontalGridLines(true)
                .compose([
                    dc.lineChart(chart)
                        .dimension(brazilTimeDimension)
                        .colors('red')
                        .group(groupBrazil, "Brazil"),
                    dc.lineChart(chart)
                        .dimension(newZealandTimeDimension)
                        .colors('blue')
                        .group(groupNewZealand, "New Zealand")
                    ]);

            dc.renderAll('slide7');
        }

    }, [brazilTimeDimension, newZealandTimeDimension, barchartRef.current])

    return (
        <div style={{height: '32rem', marginTop: '8rem'}}>
            <h1>Comparativo de casos entre Brazil e Reino Unido, com previsão para um mês a frente.</h1>
            <div ref={barchartRef}/>
        </div>
    );
}