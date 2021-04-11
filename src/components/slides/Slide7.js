import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_NEW_ZEALAND, RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_BRAZIL } from '../../constants';
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
                
            // const reducer = reductio()
            //     .sum(d => +d.new_cases);
            console.log(scale.domain)
            const groupBrazil = brazilTimeDimension.group().reduceSum(d => +d.new_deaths / 211000000);
            const groupNewZealand = newZealandTimeDimension.group().reduceSum(d => +d.new_deaths / 66200000);
            // reducer(group);
            
            chart.width(width)
                .height(height)
                .margins({top: 10, right: 50, bottom: 20, left: 70})
                .x(scale)
                .xUnits(d3.timeDays)
                // .dimension(casesTimeDimension)
                // .group(group)
                // .centerBar(true)
                .elasticY(true)
                .renderHorizontalGridLines(true)
                .compose([
                    dc.lineChart(chart)
                        .dimension(brazilTimeDimension)
                        .colors('red')
                        .group(groupBrazil, "Brazil"),
                        // .dashStyle([2,2]),
                    dc.lineChart(chart)
                        .dimension(newZealandTimeDimension)
                        .colors('blue')
                        .group(groupNewZealand, "New Zealand")
                        // .dashStyle([5,5])
                    ]);

            // chart.valueAccessor(d => d.value.sum);

            dc.renderAll('slide7');
        }

    }, [brazilTimeDimension, newZealandTimeDimension, barchartRef.current])

    return (
        <div style={{height: '32rem', marginTop: '8rem'}}>
            <h1>Previsão dos casos de covid após o dia 10/04/2021</h1>
            <div ref={barchartRef}/>
        </div>
    );
}