import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { 
    RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_NEW_ZEALAND, 
    RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_BRAZIL,
    POPULATION_BRAZIL, 
    POPULATION_UK 
} from '../../constants';
import { useDimension } from '../../hooks/useDimension';

export const Slide7 = ({active}) => {
    const barchartRef = useRef();

    const brazilTimeDimension = useDimension(RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_BRAZIL, 'date');
    const unitedKingdomTimeDimension = useDimension(RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_NEW_ZEALAND, 'date');

    useEffect(() => {
        
        if(barchartRef.current && brazilTimeDimension && unitedKingdomTimeDimension) {
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
                        .group(groupBrazil, "Brazil"),
                    dc.lineChart(chart)
                        .dimension(unitedKingdomTimeDimension)
                        .colors('blue')
                        .group(groupUnitedKingdom, "United Kingdom")
                    ]);

            dc.renderAll('slide7');

            window.chartDOM = chartDOM;

            const redBox = d3.select(chartDOM.getElementsByTagName('svg')[0])
                .append("rect")
                .attr("x", scale(new Date('2021-01-01')))
                .attr("y", 0)
                .attr("width", scale.domain()[1] - scale(new Date('2021-01-01')))
                // .attr("width", 20)
                .attr("height", height - 20)
                .attr("fill", "red")
                .attr("opacity", 0.4);
        }

    }, [brazilTimeDimension, unitedKingdomTimeDimension, barchartRef.current])

    return (
        <div style={{height: '100%', margin: '5rem', marginTop: '9rem'}}>
            <h2>Comparativo de casos entre Brazil e Reino Unido, com previsão para um mês a frente.</h2>
            <div style={{height: '25rem'}} ref={barchartRef}/>
        </div>
    );
}