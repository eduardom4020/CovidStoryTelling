import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { RESOURCE_NAME_JHU_FULL_DATA } from '../../constants';
import { RESOURCE_NAME_VACCINATIONS } from '../../constants';
import { useDimension } from '../../hooks/useDimension';

export const Slide5 = ({active}) => {
    const barchartRef = useRef();

    const casesTimeDimension = useDimension(RESOURCE_NAME_JHU_FULL_DATA, 'date');

    const vaccitationTimeDimension = useDimension(RESOURCE_NAME_VACCINATIONS, 'date')

    useEffect(() => {
        
        if(vaccitationTimeDimension) {
            const chartDOM = barchartRef.current;
            const { width, height } = chartDOM.parentNode.getBoundingClientRect();

            const chart = dc.lineChart(chartDOM, 'Slide5');

            const scale = d3.scaleTime()
                .domain([
                    d3.timeDay.offset(vaccitationTimeDimension.bottom(1)[0].date, -1), 
                    d3.timeDay.offset(vaccitationTimeDimension.top(1)[0].date, 1)
                ])
                
                
            const reducer = reductio().max(d => +d.people_fully_vaccinated);

            const group = vaccitationTimeDimension.group()//.reduceSum(d => +d.people_fully_vaccinated);
            reducer(group);


            console.log(vaccitationTimeDimension.top(1000))
            
            chart.width(width)
                .height(height)
                .margins({top: 10, right: 50, bottom: 20, left: 70})
                .x(scale)
                .xUnits(d3.timeDays)
                .dimension(vaccitationTimeDimension)
                .group(group)
                // .centerBar(true)
                .elasticY(true)
                .renderHorizontalGridLines(true);

            chart.valueAccessor(d => d.value.max);

            dc.renderAll('Slide5');
        }

    }, [vaccitationTimeDimension, barchartRef.current])

    return (
        <div style={{height: '32rem'}}>
            <h1>Número acumulados de Vacinados no Brasil</h1>
            <div ref={barchartRef}/>
        </div>
    );
}