import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { RESOURCE_NAME_JHU_FULL_DATA_EUA, RESOURCE_NAME_VACCINATIONS_EUA } from '../../constants';
import { useDimension } from '../../hooks/useDimension';

export const Slide5USA = ({active}) => {
    const barchartRef = useRef();

    const casesTimeDimensionUSA = useDimension(RESOURCE_NAME_JHU_FULL_DATA_EUA, 'date');
    const vaccitationTimeDimensionUSA = useDimension(RESOURCE_NAME_VACCINATIONS_EUA, 'date')

    useEffect(() => {
        
        if(casesTimeDimensionUSA && vaccitationTimeDimensionUSA) {
            const chartDOM = barchartRef.current;
            const { width, height } = chartDOM.parentNode.getBoundingClientRect();

            const chart = dc.compositeChart(chartDOM, 'Slide5USA');

            const scale = d3.scaleTime()
                .domain([ 
                    d3.timeDay.offset(Math.min(casesTimeDimensionUSA.bottom(1)[0].date, vaccitationTimeDimensionUSA.bottom(1)[0].date), -1), 
                    d3.timeDay.offset(Math.max(casesTimeDimensionUSA.top(1)[0].date, vaccitationTimeDimensionUSA.top(1)[0].date), 1)
                ])
                              
           // const reducer = reductio().max(d => +d.people_fully_vaccinated);

            const groupVaccinationUSA = vaccitationTimeDimensionUSA.group().reduceSum(d => +d.daily_vaccinations);
            const groupCasesUSA = casesTimeDimensionUSA.group().reduceSum(d => +d.new_cases);
            
            chart.width(width)
                .height(height)
                .margins({top: 10, right: 50, bottom: 20, left: 70})
                .x(scale)
                .xUnits(d3.timeDays)
                //.dimension(vaccitationTimeDimension)
                //.group(group)
                // .centerBar(true)
                .elasticY(true)
                .renderHorizontalGridLines(true)
                .legend(dc.legend().x(width-200).y(5).itemHeight(13).gap(5))
                .compose([
                    dc.lineChart(chart)
                        .dimension(vaccitationTimeDimensionUSA)
                        .colors('green')
                        .renderArea(true)
                        .group(groupVaccinationUSA, "Vacinados por dia"),
                        // .dashStyle([2,2]),
                    dc.lineChart(chart)
                        .dimension(casesTimeDimensionUSA)
                        .colors('red')
                        .renderArea(true)
                        .group(groupCasesUSA, "Casos diários")
                        // .dashStyle([5,5])
                    ]);

            chart.valueAccessor(d => d.value.max);

            dc.renderAll('Slide5USA');
        }

    }, [casesTimeDimensionUSA, vaccitationTimeDimensionUSA, barchartRef.current])

    return (
        <div style={{height: '32rem', marginTop: '8rem'}}>
            <h2>Vacinação diária nos EUA x Quantidade de Casos</h2>
            <div ref={barchartRef}/>
        </div>
    );
}