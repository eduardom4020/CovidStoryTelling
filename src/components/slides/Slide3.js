import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { RESOURCE_NAME_JHU_FULL_DATA } from '../../constants';
import { useDimension } from '../../hooks/useDimension';

export const Slide3 = ({active}) => {
    const barchartRef = useRef();

    const casesTimeDimension = useDimension(RESOURCE_NAME_JHU_FULL_DATA, 'date');

    useEffect(() => {
        
        if(casesTimeDimension) {
            const chartDOM = barchartRef.current;
            const { width, height } = chartDOM.parentNode.getBoundingClientRect();

            const chart = dc.lineChart(chartDOM, 'slide3');

            const scale = d3.scaleTime()
                .domain([
                    d3.timeDay.offset(casesTimeDimension.bottom(1)[0].date, -1), 
                    d3.timeDay.offset(casesTimeDimension.top(1)[0].date, 1)
                ])
            window.reductio = reductio;
            window.casesTimeDimension = casesTimeDimension;
            const reducer = reductio()
                .sum(d => +d.new_deaths_mov_avg);

            const group = casesTimeDimension.group();
            reducer(group);
            
            chart.width(width)
                .height(height)
                .margins({top: 10, right: 50, bottom: 20, left: 70})
                .x(scale)
                .xUnits(d3.timeDays)
                .dimension(casesTimeDimension)
                .group(group)
                // .centerBar(true)
                .elasticY(true)
                .renderHorizontalGridLines(true);

            chart.valueAccessor(d => d.value.sum);

            dc.renderAll('slide3');
        }

    }, [casesTimeDimension, barchartRef.current])

    return (
        <div style={{height: '32rem'}}>
            <h1>Média móvel do número de óbitos por Covid 19 no Brasil, por dia</h1>
            <div ref={barchartRef}/>
        </div>
    );
}