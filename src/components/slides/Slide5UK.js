import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { RESOURCE_NAME_JHU_FULL_DATA_UK, RESOURCE_NAME_VACCINATIONS_UK } from '../../constants';
import { useDimension } from '../../hooks/useDimension';

export const Slide5UK = ({active}) => {
    const barchartRef = useRef();

    const casesTimeDimensionUK = useDimension(RESOURCE_NAME_JHU_FULL_DATA_UK, 'date');
    const vaccitationTimeDimensionUK = useDimension(RESOURCE_NAME_VACCINATIONS_UK, 'date')

    useEffect(() => {
        
        if(casesTimeDimensionUK && vaccitationTimeDimensionUK) {
            const chartDOM = barchartRef.current;
            const { width, height } = chartDOM.parentNode.getBoundingClientRect();

            const chart = dc.compositeChart(chartDOM, 'Slide5USA');

            const scale = d3.scaleTime()
                .domain([ 
                    d3.timeDay.offset(Math.min(casesTimeDimensionUK.bottom(1)[0].date, vaccitationTimeDimensionUK.bottom(1)[0].date), -1), 
                    d3.timeDay.offset(Math.max(casesTimeDimensionUK.top(1)[0].date, vaccitationTimeDimensionUK.top(1)[0].date), 1)
                ])

            const groupVaccinationUK = vaccitationTimeDimensionUK.group().reduceSum(d => +d.daily_vaccinations);
            const groupCasesUK = casesTimeDimensionUK.group().reduceSum(d => +d.new_cases);
            
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
                        .dimension(vaccitationTimeDimensionUK)
                        .colors('green')
                        .renderArea(true)
                        .group(groupVaccinationUK, "Vacinados por dia"),
                        // .dashStyle([2,2]),
                    dc.lineChart(chart)
                        .dimension(casesTimeDimensionUK)
                        .colors('red')
                        .renderArea(true)
                        .group(groupCasesUK, "Casos diários")
                        // .dashStyle([5,5])
                    ]);

            chart.valueAccessor(d => d.value.max);

            dc.renderAll('Slide5UK');
        }

    }, [casesTimeDimensionUK, vaccitationTimeDimensionUK, barchartRef.current])

    return (
        <div style={{height: '32rem', marginTop: '8rem'}}>
            <h1>Vacinação diária no Reino Unido x Quantidade de Casos</h1>
            <div ref={barchartRef}/>
        </div>
    );
}