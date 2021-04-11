import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { 
    RESOURCE_NAME_JHU_FULL_DATA_EUA, 
    RESOURCE_NAME_VACCINATIONS_EUA,
    ICON_VACCINATION,
    ICON_INFECTION,
    ICON_MOURNING,
    POPULATION_USA
} from '../../constants';
import { useDimension } from '../../hooks/useDimension';
import { Indicator } from '../indicators/Indicator';

export const Slide1KPIUSA = ({active}) => {
    const barchartRef = useRef();

    const [ vaccinatedGroup, setVaccinatedGroup ] = useState();
    const [ immuneGroup, setImmuneGroup ] = useState();
    const [ totalCasesGroup, setTotalCasesGroup ] = useState();
    const [ totalDeathsGroup, setTotalDeathsGroup ] = useState();
    const [ dailyCasesGroup, setDailyCasesGroup ] = useState();
    const [ dailyDeathsGroup, setDailyDeathsGroup ] = useState();

    const vaccinationTimeDimension = useDimension(RESOURCE_NAME_VACCINATIONS_EUA, 'date');
    const fullDataTimeDimension = useDimension(RESOURCE_NAME_JHU_FULL_DATA_EUA, 'date');

    useEffect(() => {
        if(vaccinationTimeDimension) {

            const reducerImmune = reductio().max(d => +d.people_fully_vaccinated / POPULATION_USA);
            const vGroupImunne = vaccinationTimeDimension.group();
            reducerImmune(vGroupImunne);
            setImmuneGroup(vGroupImunne);

            const reducerVaccinated = reductio().max(d => +d.people_vaccinated / POPULATION_USA);
            const vGroup = vaccinationTimeDimension.group();
            reducerVaccinated(vGroup);
            setVaccinatedGroup(vGroup);
        }
    }, [vaccinationTimeDimension]);

    useEffect(() => {
        if(fullDataTimeDimension) {
            const reducerTotalCases = reductio().max(d => +d.total_cases);
            const vGroupTotalCases = fullDataTimeDimension.group();
            reducerTotalCases(vGroupTotalCases);
            setTotalCasesGroup(vGroupTotalCases);

            const reducerTotalDeaths = reductio().max(d => +d.total_deaths);
            const vGroupTotalDeaths = fullDataTimeDimension.group();
            reducerTotalDeaths(vGroupTotalDeaths);
            setTotalDeathsGroup(vGroupTotalDeaths);

            const reducerDailyCases = reductio().max(d => +d.new_cases);
            const vGroupDailyCases = fullDataTimeDimension.group();
            reducerDailyCases(vGroupDailyCases);
            setDailyCasesGroup(vGroupDailyCases);

            const reducerDailyDeaths = reductio().max(d => +d.new_deaths);
            const vGroupDailyDeaths = fullDataTimeDimension.group();
            reducerDailyDeaths(vGroupDailyDeaths);
            setDailyDeathsGroup(vGroupDailyDeaths);
        }
    }, [fullDataTimeDimension]);

    let fullyImmune = immuneGroup && immuneGroup.order(d => d.max).top(1)[0].value.max * 100;
    let fullyVaccinated = vaccinatedGroup && vaccinatedGroup.order(d => d.max).top(1)[0].value.max * 100;
    let totalCases = totalCasesGroup && totalCasesGroup.order(d => d.max).top(1)[0].value.max.toLocaleString();
    let totalDeaths = totalDeathsGroup && totalDeathsGroup.order(d => d.max).top(1)[0].value.max.toLocaleString();
    let maximumCasesDay = dailyCasesGroup && dailyCasesGroup.order(d => d.max).top(1)[0];
    let maximumDeathsDay = dailyDeathsGroup && dailyDeathsGroup.order(d => d.max).top(1)[0];
  

    window.totalDeathsGroup = totalDeathsGroup;

    return (    
        <div style={{fontFamily: '"Palatino", sans-serif', margin: '5rem', marginTop: '8rem'}}>
        <h2>Indicadores do Covid-19 nos EUA</h2>
        <p>
            Estes são alguns indicadores importantes, que resumem as análises feitas neste estudo.
        </p>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
            <Indicator
                imgSrc={ICON_VACCINATION}
                title='Imunizados'
                valueText={`${String(fullyImmune).match(/\d*\.\d{2}/g)}%`}
                style={{margin: '.5rem'}}
            />
            <Indicator
                imgSrc={ICON_VACCINATION}
                title='Vacinados'
                valueText={`${String(fullyVaccinated).match(/\d*\.\d{2}/g)}%`}
                style={{margin: '.5rem'}}
            />
            <Indicator
                imgSrc={ICON_INFECTION}
                title='Infectados'
                valueText={totalCases}
                style={{margin: '.5rem'}}
            />
            <Indicator
                imgSrc={ICON_MOURNING}
                title='Mortes'
                valueText={totalDeaths}
                style={{margin: '.5rem'}}
            />
            <Indicator
                imgSrc={ICON_INFECTION}
                title={<>Dia com maior número de casos<br/><b>{maximumCasesDay && maximumCasesDay.key.toLocaleDateString()}</b></>}
                valueText={maximumCasesDay && maximumCasesDay.value.max.toLocaleString()}
                style={{backgroundColor: '#424242', color: '#bdbdbd', border: '1px solid #000000', margin: '.5rem'}}
            />
            <Indicator
                imgSrc={ICON_MOURNING}
                title={<>Dia com maior número de mortes<br/><b>{maximumDeathsDay && maximumDeathsDay.key.toLocaleDateString()}</b></>}
                valueText={maximumDeathsDay && maximumDeathsDay.value.max.toLocaleString()}
                style={{backgroundColor: '#424242', color: '#bdbdbd', border: '1px solid #000000', margin: '.5rem'}}
            />
        </div>
    </div>
    );
}