import React, { useEffect, useState, useRef } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import reductio from 'reductio';

import { 
    RESOURCE_NAME_JHU_FULL_DATA, 
    RESOURCE_NAME_VACCINATIONS,
    ICON_VACCINATION,
    ICON_INFECTION,
    ICON_MOURNING,
    POPULATION_BRAZIL
} from '../../constants';
import { useDimension } from '../../hooks/useDimension';
import { Indicator } from '../indicators/Indicator';

export const Slide1 = ({active}) => {
    const barchartRef = useRef();

    const [ vaccinatedGroup, setVaccinatedGroup ] = useState();
    const [ totalCasesGroup, setTotalCasesGroup ] = useState();
    const [ totalDeathsGroup, setTotalDeathsGroup ] = useState();
    const [ dailyCasesGroup, setDailyCasesGroup ] = useState();
    const [ dailyDeathsGroup, setDailyDeathsGroup ] = useState();

    const vaccinationTimeDimension = useDimension(RESOURCE_NAME_VACCINATIONS, 'date');
    const fullDataTimeDimension = useDimension(RESOURCE_NAME_JHU_FULL_DATA, 'date');

    useEffect(() => {
        if(vaccinationTimeDimension) {
            const reducer = reductio().max(d => +d.people_fully_vaccinated / POPULATION_BRAZIL);
            const vGroup = vaccinationTimeDimension.group();
            reducer(vGroup);
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

    let fullyVaccinated = vaccinatedGroup && vaccinatedGroup.order(d => d.max).top(1)[0].value.max * 100;
    let totalCases = totalCasesGroup && totalCasesGroup.order(d => d.max).top(1)[0].value.max.toLocaleString();
    let totalDeaths = totalDeathsGroup && totalDeathsGroup.order(d => d.max).top(1)[0].value.max.toLocaleString();
    let maximumCasesDay = dailyCasesGroup && dailyCasesGroup.order(d => d.max).top(1)[0];
    let maximumDeathsDay = dailyDeathsGroup && dailyDeathsGroup.order(d => d.max).top(1)[0];

    return (
        <div style={{fontFamily: '"Palatino", sans-serif', margin: '5rem'}}>
            <h1>Como está o progresso das vacinações contra o Covid 19 hoje?</h1>
            <span>em 10/07/2021</span>
            <br/>
            <p>
                A pandemia de Covid 19 tem se alastrado pelo mundo por mais de um ano.
                Árduo foi o caminho dos cientistas até aqui, para criar e disponibilizar 
                vacinas e curar a humanidade o mais rapidamente possível.
                <br/>
                Após períodos de conturbação, o surgimento da variante brasileira do Covid 
                e de tantas outras surpresas e incertezas, as vacinações finalmente começaram 
                a ser realizadas em nosso pais.
                <br/>
                Este estudo visa analisar se a vacinação realmente é eficiente, se já está apresentando 
                resultados positivos e, se não, o que deve ser feito para que o País possa 
                voltar, em breve, a sua rotina do novo normal, sem a presença do vírus.
            </p>
            <h2>Indicadores</h2>
            <p>
                Estes são alguns indicadores importantes, que resumem as análises feitas neste estudo.
            </p>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
                <Indicator
                    imgSrc={ICON_VACCINATION}
                    title='Imunizados'
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