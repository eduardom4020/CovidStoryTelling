import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { getDimension } from '../../providers/dimensionsProvider';
import { registerDataInterceptor } from '../../providers/dataTreatmentInterceptor';
import { RESOURCE_NAME_JHU_FULL_DATA } from '../../constants';

export const Slide3 = ({active}) => {
    const MOVING_AVERAGE_WINDOW = 7;
    const barchartRef = useRef();

    const [ casesTimeDimension, setCasesTimeDimension ] = useState();

    useEffect(async () => {
        registerDataInterceptor(RESOURCE_NAME_JHU_FULL_DATA, data => {
            const dateParser = d3.timeParse('%Y-%m-%d');
            let lastNewDeaths = 0;

            return data.map((d, index, array) => {
                lastNewDeaths = d.new_deaths || lastNewDeaths;

                return {
                    ...d, 
                    date: dateParser(d.date),
                    new_deaths: lastNewDeaths,
                    new_deaths_mov_avg: index >= MOVING_AVERAGE_WINDOW - 1 
                    ? (array.slice(MOVING_AVERAGE_WINDOW - 1, index).map(d => +d.new_deaths).reduce((acc, curr) => acc + curr, 0) + lastNewDeaths) / MOVING_AVERAGE_WINDOW
                    : lastNewDeaths
                } 
            });
        })

        const dimension = await getDimension(RESOURCE_NAME_JHU_FULL_DATA, 'date');
        setCasesTimeDimension(dimension);
    }, []);

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
            <h1>Média móvel do número de óbitos por Covid 19 no Brasil</h1>
            <div ref={barchartRef}/>
        </div>
    );
}