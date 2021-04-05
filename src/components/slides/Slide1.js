import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';

import { getDimension } from '../../providers/dimensionsProvider';
import { RESOURCE_NAME_VACCINATIONS } from '../../constants';

export const Slide1 = ({active}) => {
    const barchartRef = useRef();

    const [ peopleFullyVaccinatedDimension, setPeopleFullyVaccinatedDimension ] = useState();

    useEffect(async () => {
        const dimension = await getDimension(RESOURCE_NAME_VACCINATIONS, 'people_fully_vaccinated');
        setPeopleFullyVaccinatedDimension(dimension);
    }, []);

    useEffect(() => {
        
        if(peopleFullyVaccinatedDimension) {
            const chartDOM = barchartRef.current;
            const { width, height } = chartDOM.parentNode.getBoundingClientRect();

            const chart = dc.barChart(chartDOM, 'slide1');

            window.peopleFullyVaccinatedDimension = peopleFullyVaccinatedDimension;

            const scale = d3.scaleLinear()
                .domain([peopleFullyVaccinatedDimension.bottom(1)[0].people_fully_vaccinated, peopleFullyVaccinatedDimension.top(1)[0].people_fully_vaccinated])
    
            chart.width(width)
                .height(height)
                .margins({top: 10, right: 20, bottom: 20, left: 30})
                .x(scale)
                .dimension(peopleFullyVaccinatedDimension)
                .group(peopleFullyVaccinatedDimension.group())
                .centerBar(true)
                .elasticY(true)
                .renderHorizontalGridLines(true);

            dc.renderAll('slide1');
        }

    }, [peopleFullyVaccinatedDimension, barchartRef.current])

    return (
        <div style={{height: '32rem'}}>
            <h1>Some Bar chart</h1>
            <div ref={barchartRef}/>
        </div>
    );
}