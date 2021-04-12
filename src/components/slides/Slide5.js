import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { RESOURCE_NAME_JHU_FULL_DATA, RESOURCE_NAME_VACCINATIONS } from '../../constants';
import { useDimension } from '../../hooks/useDimension';

export const Slide5 = ({active}) => {
    const barchartRef = useRef();

    const casesTimeDimension = useDimension(RESOURCE_NAME_JHU_FULL_DATA, 'date');
    const vaccitationTimeDimension = useDimension(RESOURCE_NAME_VACCINATIONS, 'date')

    useEffect(() => {
        
        if(casesTimeDimension && vaccitationTimeDimension) {
            const chartDOM = barchartRef.current;
            const { width, height } = chartDOM.parentNode.getBoundingClientRect();

            const chart = dc.compositeChart(chartDOM, 'Slide5');

            const scale = d3.scaleTime()
                .domain([ 
                    d3.timeDay.offset(Math.min(casesTimeDimension.bottom(1)[0].date, vaccitationTimeDimension.bottom(1)[0].date), -1), 
                    d3.timeDay.offset(Math.max(casesTimeDimension.top(1)[0].date, vaccitationTimeDimension.top(1)[0].date), 1)
                ])
                
                
            console.log(scale.domain)    
            
           // const reducer = reductio().max(d => +d.people_fully_vaccinated);

            const groupVaccination = vaccitationTimeDimension.group().reduceSum(d => +d.daily_vaccinations);
            const groupCases = casesTimeDimension.group().reduceSum(d => +d.new_cases);
            
            
            //console.log(vaccitationTimeDimension.top(1000))
            
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
                        .dimension(vaccitationTimeDimension)
                        .colors('green')
                        .renderArea(true)
                        .group(groupVaccination, "Vacinados por dia"),
                        // .dashStyle([2,2]),
                    dc.lineChart(chart)
                        .dimension(casesTimeDimension)
                        .colors('red')
                        .renderArea(true)
                        .group(groupCases, "Casos diários")
                        // .dashStyle([5,5])
                    ]);

            chart.valueAccessor(d => d.value.max);

            dc.renderAll('Slide5');
        }

    }, [casesTimeDimension, vaccitationTimeDimension, barchartRef.current])

    return (
        <div style={{height: '15rem', marginTop: '3rem'}}>
            <h2>Vacinação diária x Quantidade de Casos</h2>
            <p style={{textAlign: 'center'}}>Brasil</p>
            <div style={{height: '10rem'}} ref={barchartRef}/>
        </div>
    );
}