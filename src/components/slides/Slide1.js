import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { getDimension } from '../../providers/dimensionsProvider';
import { registerDataInterceptor } from '../../providers/dataTreatmentInterceptor';
import { RESOURCE_NAME_VACCINATIONS } from '../../constants';

export const Slide1 = ({active}) => {
    const barchartRef = useRef();

    const [ vacciationTimeDimension, setVacciationTimeDimension ] = useState();

    useEffect(async () => {
        registerDataInterceptor(RESOURCE_NAME_VACCINATIONS, data => {
            const dateParser = d3.timeParse('%Y-%m-%d');
            let lastPeopleFullyVaccinated = 0;

            return data.map(d => {
                lastPeopleFullyVaccinated = d.people_fully_vaccinated || lastPeopleFullyVaccinated;

                return {
                    ...d, 
                    date: dateParser(d.date),
                    people_fully_vaccinated: lastPeopleFullyVaccinated
                } 
            });
        })

        const dimension = await getDimension(RESOURCE_NAME_VACCINATIONS, 'date');
        setVacciationTimeDimension(dimension);
    }, []);

    useEffect(() => {
        
        if(vacciationTimeDimension) {
            const chartDOM = barchartRef.current;
            const { width, height } = chartDOM.parentNode.getBoundingClientRect();

            const chart = dc.barChart(chartDOM, 'slide1');

            const scale = d3.scaleTime()
                .domain([
                    d3.timeDay.offset(vacciationTimeDimension.bottom(1)[0].date, -1), 
                    d3.timeDay.offset(vacciationTimeDimension.top(1)[0].date, 1)
                ])
            
            const reducer = reductio().max(d => +d.people_fully_vaccinated);

            const group = vacciationTimeDimension.group();
            reducer(group);
            console.log(group);
            chart.width(width)
                .height(height)
                .margins({top: 10, right: 50, bottom: 20, left: 70})
                .x(scale)
                .xUnits(d3.timeDays)
                .dimension(vacciationTimeDimension)
                .group(group)
                .centerBar(true)
                .elasticY(true)
                .renderHorizontalGridLines(true);

            chart.valueAccessor(d => d.value.max);

            dc.renderAll('slide1');
        }

    }, [vacciationTimeDimension, barchartRef.current])

    return (
        <div style={{height: '32rem'}}>
            <h1>Total de pessoas vacinadas ao passar dos dias, no Brasil</h1>
            <div ref={barchartRef}/>
        </div>
    );
}