import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { RESOURCE_NAME_JHU_FULL_DATA } from '../../constants';
import { useDimension } from '../../hooks/useDimension';

export const Slide2 = ({active}) => {
    const barchartRef = useRef();

    const [ focused, setFocused ] = useState();
    const [ baseWidth, setBaseWidth ] = useState();
    const [ currentChart, setCurrentChart ] = useState();

    const casesTimeDimension = useDimension(RESOURCE_NAME_JHU_FULL_DATA, 'date');

    useEffect(() => {
        
        if(casesTimeDimension) {
            const chartDOM = barchartRef.current;
            const { width, height } = chartDOM.parentNode.getBoundingClientRect();

            const chart = dc.lineChart(chartDOM, 'slide2');

            const scale = d3.scaleTime()
                .domain([
                    d3.timeDay.offset(casesTimeDimension.bottom(1)[0].date, -1), 
                    d3.timeDay.offset(casesTimeDimension.top(1)[0].date, 1)
                ])
                
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
                .elasticY(true)
                .renderHorizontalGridLines(true);

            chart.valueAccessor(d => d.value.sum);

            dc.renderAll('slide2');
            
            setBaseWidth(chart.width());
            setCurrentChart(chart);
        }

    }, [casesTimeDimension, barchartRef.current]);

    useEffect(() => {
        if(!focused && active)
            setTimeout(() => setFocused(true), 200);

        if(focused && !active)
            setTimeout(() => setFocused(false), 200);
    }, [active, focused])

    useEffect(() => {
        if(currentChart && focused != null && baseWidth) {
            if(focused)
                currentChart.width(baseWidth * .85);
            else
                currentChart.width(baseWidth);

            currentChart.redraw()
        }
    }, [focused, currentChart, baseWidth])

    return (
        <div style={{height: '40rem', margin: '5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <h2>Média móvel do número de óbitos por Covid 19, no Brasil, por dia</h2>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '28rem', flex: 1, width: '100%'}}>
                <div ref={barchartRef} style={{flex: 3}} />
                <div style={{
                    flex: 1, transition: 'max-width .5s ease-in-out', 
                    maxWidth: focused ? '15%' : 0, overflow: 'hidden',
                    height: '80%', padding: focused ? '.5rem' : 0, backgroundColor: '#bdbdbd', 
                    borderRadius: '.5rem'
                }}>
                    <p style={{
                        width: '100%', height: '90%', color: 'white', fontSize: '.75em'
                    }}>
                        A média móvel ao lado representa a tendência de crescimento do número de óbitos por Covid 19 
                        ao longo do tempo, desde o início da pandemia. Seus valores absolutos não são o importante, mas 
                        sim perceber se existe aumento ou diminuição dos óbitos.
                        <br/>
                        Como é possível vermos no gráfico, desde o início da série, estes valores tendem apenas 
                        a continuar aumentando. Ao final do ano passado, provavelmente por conta dos isolamentos 
                        mais rigorosos nas festas de fim de ano, observamos queda dos casos. Contudo, recentemente 
                        os casos subiram de forma acentuada, coincidindo com o início do período de vacinação.
                    </p>
                </div>
            </div>
        </div>
    );
}