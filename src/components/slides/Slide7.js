import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST } from '../../constants';
import { useDimension } from '../../hooks/useDimension';

export const Slide7 = ({active}) => {
    const barchartRef = useRef();

    const casesTimeDimension = useDimension(RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST, 'date');

    useEffect(() => {
        
        if(casesTimeDimension) {
            const chartDOM = barchartRef.current;
            const { width, height } = chartDOM.parentNode.getBoundingClientRect();

            const chart = dc.lineChart(chartDOM, 'slide7');

            const scale = d3.scaleTime()
                .domain([
                    d3.timeDay.offset(casesTimeDimension.bottom(1)[0].date, -1), 
                    d3.timeDay.offset(casesTimeDimension.top(1)[0].date, 1)
                ])
                
            const reducer = reductio()
                .sum(d => +d.new_cases);

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

            dc.renderAll('slide7');
        }

    }, [casesTimeDimension, barchartRef.current])

    return (
        <div style={{height: '32rem', marginTop: '8rem'}}>
            <h1>Previsão dos casos de covid após o dia 10/04/2021</h1>
            <div ref={barchartRef}/>
        </div>
    );
}