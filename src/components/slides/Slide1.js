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

import { RESOURCE_NAME_JHU_FULL_DATA_UK, RESOURCE_NAME_VACCINATIONS_UK, POPULATION_UK } from '../../constants';
import { RESOURCE_NAME_JHU_FULL_DATA_EUA, RESOURCE_NAME_VACCINATIONS_EUA, POPULATION_USA } from '../../constants';

import { useDimension } from '../../hooks/useDimension';
import { Indicator } from '../indicators/Indicator';

export const Slide1 = ({active}) => {
    const barchartRef = useRef();

    const [ immuneGroup, setImmuneGroup ] = useState();
    const [ vaccinatedGroup, setVaccinatedGroup ] = useState();
    const [ totalCasesGroup, setTotalCasesGroup ] = useState();
    const [ totalDeathsGroup, setTotalDeathsGroup ] = useState();
    const [ dailyCasesGroup, setDailyCasesGroup ] = useState();
    const [ dailyDeathsGroup, setDailyDeathsGroup ] = useState();

    // BRA
    const vaccinationTimeDimensionBRA = useDimension(RESOURCE_NAME_VACCINATIONS, 'date');
    const fullDataTimeDimensionBRA = useDimension(RESOURCE_NAME_JHU_FULL_DATA, 'date');

    useEffect(() => {
        if(vaccinationTimeDimensionBRA) {

            const reducer = reductio().max(d => +d.people_vaccinated / POPULATION_BRAZIL);
            const vGroup = vaccinationTimeDimensionBRA.group();
            reducer(vGroup);
            setVaccinatedGroup(vGroup);

            const reducerImmune = reductio().max(d => +d.people_fully_vaccinated / POPULATION_BRAZIL);
            const vGroupImmune = vaccinationTimeDimensionBRA.group();
            reducerImmune(vGroupImmune);
            setImmuneGroup(vGroupImmune);

        }
    }, [vaccinationTimeDimensionBRA]);

    useEffect(() => {
        if(fullDataTimeDimensionBRA) {
            const reducerTotalCases = reductio().max(d => +d.total_cases);
            const vGroupTotalCases = fullDataTimeDimensionBRA.group();
            reducerTotalCases(vGroupTotalCases);
            setTotalCasesGroup(vGroupTotalCases);

            const reducerTotalDeaths = reductio().max(d => +d.total_deaths);
            const vGroupTotalDeaths = fullDataTimeDimensionBRA.group();
            reducerTotalDeaths(vGroupTotalDeaths);
            setTotalDeathsGroup(vGroupTotalDeaths);

            const reducerDailyCases = reductio().max(d => +d.new_cases);
            const vGroupDailyCases = fullDataTimeDimensionBRA.group();
            reducerDailyCases(vGroupDailyCases);
            setDailyCasesGroup(vGroupDailyCases);

            const reducerDailyDeaths = reductio().max(d => +d.new_deaths);
            const vGroupDailyDeaths = fullDataTimeDimensionBRA.group();
            reducerDailyDeaths(vGroupDailyDeaths);
            setDailyDeathsGroup(vGroupDailyDeaths);
        }
    }, [fullDataTimeDimensionBRA]);

    let immuneVaccinatedBRA = immuneGroup && immuneGroup.order(d => d.max).top(1)[0].value.max * 100;
    let fullyVaccinatedBRA = vaccinatedGroup && vaccinatedGroup.order(d => d.max).top(1)[0].value.max * 100;
    let totalCasesBRA = totalCasesGroup && totalCasesGroup.order(d => d.max).top(1)[0].value.max.toLocaleString();
    let totalDeathsBRA = totalDeathsGroup && totalDeathsGroup.order(d => d.max).top(1)[0].value.max.toLocaleString();
    let maximumCasesDayBRA = dailyCasesGroup && dailyCasesGroup.order(d => d.max).top(1)[0];
    let maximumDeathsDayBRA = dailyDeathsGroup && dailyDeathsGroup.order(d => d.max).top(1)[0];


     // EUA
    const [ immuneGroupEUA, setImmuneGroupEUA ] = useState();
    const [ vaccinatedGroupEUA, setVaccinatedGroupEUA ] = useState();
    const [ totalCasesGroupEUA, setTotalCasesGroupEUA ] = useState();
    const [ totalDeathsGroupEUA, setTotalDeathsGroupEUA ] = useState();
    const [ dailyCasesGroupEUA, setDailyCasesGroupEUA ] = useState();
    const [ dailyDeathsGroupEUA, setDailyDeathsGroupEUA ] = useState();

    const vaccinationTimeDimensionEUA = useDimension(RESOURCE_NAME_VACCINATIONS_EUA, 'date');
    const fullDataTimeDimensionEUA = useDimension(RESOURCE_NAME_JHU_FULL_DATA_EUA, 'date');

    useEffect(() => {
        if(vaccinationTimeDimensionEUA) {
            const reducerEUA = reductio().max(d => +d.people_vaccinated / POPULATION_USA);
            const vGroupEUA = vaccinationTimeDimensionEUA.group();
            reducerEUA(vGroupEUA);
            setVaccinatedGroupEUA(vGroupEUA);
            const reducerImmuneEUA = reductio().max(d => +d.people_fully_vaccinated / POPULATION_USA)
            const vGroupImmuneEUA = vaccinationTimeDimensionEUA.group();
            reducerImmuneEUA(vGroupImmuneEUA);
            setImmuneGroupEUA(vGroupImmuneEUA);
        }
    }, [vaccinationTimeDimensionEUA]);

    useEffect(() => {
        if(fullDataTimeDimensionEUA) {
            const reducerTotalCases = reductio().max(d => +d.total_cases);
            const vGroupTotalCases = fullDataTimeDimensionEUA.group();
            reducerTotalCases(vGroupTotalCases);
            setTotalCasesGroupEUA(vGroupTotalCases);
            const reducerTotalDeaths = reductio().max(d => +d.total_deaths);
            const vGroupTotalDeaths = fullDataTimeDimensionEUA.group();
            reducerTotalDeaths(vGroupTotalDeaths);
            setTotalDeathsGroupEUA(vGroupTotalDeaths);
            const reducerDailyCases = reductio().max(d => +d.new_cases);
            const vGroupDailyCases = fullDataTimeDimensionEUA.group();
            reducerDailyCases(vGroupDailyCases);
            setDailyCasesGroupEUA(vGroupDailyCases);
            const reducerDailyDeaths = reductio().max(d => +d.new_deaths);
            const vGroupDailyDeaths = fullDataTimeDimensionEUA.group();
            reducerDailyDeaths(vGroupDailyDeaths);
            setDailyDeathsGroupEUA(vGroupDailyDeaths);
        }
    }, [fullDataTimeDimensionEUA]);

    let immuneVaccinatedEUA = immuneGroupEUA && immuneGroupEUA.order(d => d.max).top(1)[0].value.max * 100;
    let fullyVaccinatedEUA = vaccinatedGroupEUA && vaccinatedGroupEUA.order(d => d.max).top(1)[0].value.max * 100;
    let totalCasesEUA = totalCasesGroupEUA && totalCasesGroupEUA.order(d => d.max).top(1)[0].value.max.toLocaleString();
    let totalDeathsEUA = totalDeathsGroupEUA && totalDeathsGroupEUA.order(d => d.max).top(1)[0].value.max.toLocaleString();
    let maximumCasesDayEUA = dailyCasesGroupEUA && dailyCasesGroupEUA.order(d => d.max).top(1)[0];
    let maximumDeathsDayEUA = dailyDeathsGroupEUA && dailyDeathsGroupEUA.order(d => d.max).top(1)[0];


    // UK
    const [ immuneGroupUK, setImmuneGroupUK ] = useState();
    const [ vaccinatedGroupUK, setVaccinatedGroupUK ] = useState();
    const [ totalCasesGroupUK, setTotalCasesGroupUK ] = useState();
    const [ totalDeathsGroupUK, setTotalDeathsGroupUK ] = useState();
    const [ dailyCasesGroupUK, setDailyCasesGroupUK ] = useState();
    const [ dailyDeathsGroupUK, setDailyDeathsGroupUK ] = useState();

    const vaccinationTimeDimensionUK = useDimension(RESOURCE_NAME_VACCINATIONS_UK, 'date');
    const fullDataTimeDimensionUK = useDimension(RESOURCE_NAME_JHU_FULL_DATA_UK, 'date');

    useEffect(() => {
        if(vaccinationTimeDimensionUK) {
            const reducerUK = reductio().max(d => +d.people_vaccinated / POPULATION_UK);
            const vGroup = vaccinationTimeDimensionUK.group();
            reducerUK(vGroup);
            setVaccinatedGroupUK(vGroup);
            const reducerImmune = reductio().max(d => +d.people_fully_vaccinated / POPULATION_UK)
            const vGroupImmune = vaccinationTimeDimensionUK.group();
            reducerImmune(vGroupImmune);
            setImmuneGroupUK(vGroupImmune);
        }
    }, [vaccinationTimeDimensionUK]);
    useEffect(() => {
        if(fullDataTimeDimensionUK) {
            const reducerTotalCasesUK = reductio().max(d => +d.total_cases);
            const vGroupTotalCases = fullDataTimeDimensionUK.group();
            reducerTotalCasesUK(vGroupTotalCases);
            setTotalCasesGroupUK(vGroupTotalCases);
            const reducerTotalDeaths = reductio().max(d => +d.total_deaths);
            const vGroupTotalDeaths = fullDataTimeDimensionUK.group();
            reducerTotalDeaths(vGroupTotalDeaths);
            setTotalDeathsGroupUK(vGroupTotalDeaths);
            const reducerDailyCases = reductio().max(d => +d.new_cases);
            const vGroupDailyCases = fullDataTimeDimensionUK.group();
            reducerDailyCases(vGroupDailyCases);
            setDailyCasesGroupUK(vGroupDailyCases);
            const reducerDailyDeaths = reductio().max(d => +d.new_deaths);
            const vGroupDailyDeaths = fullDataTimeDimensionUK.group();
            reducerDailyDeaths(vGroupDailyDeaths);
            setDailyDeathsGroupUK(vGroupDailyDeaths);
        }
    }, [fullDataTimeDimensionUK]);

    let immuneVaccinatedUK = immuneGroupUK && immuneGroupUK.order(d => d.max).top(1)[0].value.max * 100;
    let fullyVaccinatedUK = vaccinatedGroupUK && vaccinatedGroupUK.order(d => d.max).top(1)[0].value.max * 100;
    let totalCasesUK = totalCasesGroupUK && totalCasesGroupUK.order(d => d.max).top(1)[0].value.max.toLocaleString();
    let totalDeathsUK = totalDeathsGroupUK && totalDeathsGroupUK.order(d => d.max).top(1)[0].value.max.toLocaleString();
    let maximumCasesDayUK = dailyCasesGroupUK && dailyCasesGroupUK.order(d => d.max).top(1)[0];
    let maximumDeathsDayUK = dailyDeathsGroupUK && dailyDeathsGroupUK.order(d => d.max).top(1)[0];
    

    return (
        <div style={{fontFamily: '"Palatino", sans-serif'}}>
            <div style={{margin: '5rem'}} >
                <h1>Como está o progresso das vacinações <br/> contra o Covid-19 hoje?</h1>
                <span>Em 10/04/2021</span>
                <br/>
                <p>
                    A pandemia de Covid-19 tem se alastrado pelo mundo por mais de um ano.
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
            </div>
            Brasil
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
                <Indicator
                    imgSrc={ICON_VACCINATION}
                    title='Imunizados'
                    valueText={`${String(immuneVaccinatedBRA).match(/\d*\.\d{2}/g)}%`}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_VACCINATION}
                    title='Vacinados'
                    valueText={`${String(fullyVaccinatedBRA).match(/\d*\.\d{2}/g)}%`}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_INFECTION}
                    title='Infectados'
                    valueText={totalCasesBRA}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_MOURNING}
                    title='Mortes'
                    valueText={totalDeathsBRA}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_INFECTION}
                    title={<>Dia com maior número de casos<br/><b>{maximumCasesDayBRA && maximumCasesDayBRA.key.toLocaleDateString()}</b></>}
                    valueText={maximumCasesDayBRA && maximumCasesDayBRA.value.max.toLocaleString()}
                    style={{backgroundColor: '#424242', color: '#bdbdbd', border: '1px solid #000000', margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_MOURNING}
                    title={<>Dia com maior número de mortes<br/><b>{maximumDeathsDayBRA && maximumDeathsDayBRA.key.toLocaleDateString()}</b></>}
                    valueText={maximumDeathsDayBRA && maximumDeathsDayBRA.value.max.toLocaleString()}
                    style={{backgroundColor: '#424242', color: '#bdbdbd', border: '1px solid #000000', margin: '.5rem'}}
                />
            </div>
            Estados Unidos
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
                <Indicator
                    imgSrc={ICON_VACCINATION}
                    title='Imunizados'
                    valueText={`${String(immuneVaccinatedEUA).match(/\d*\.\d{2}/g)}%`}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_VACCINATION}
                    title='Vacinados'
                    valueText={`${String(fullyVaccinatedEUA).match(/\d*\.\d{2}/g)}%`}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_INFECTION}
                    title='Infectados'
                    valueText={totalCasesEUA}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_MOURNING}
                    title='Mortes'
                    valueText={totalDeathsEUA}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_INFECTION}
                    title={<>Dia com maior número de casos<br/><b>{maximumCasesDayEUA && maximumCasesDayEUA.key.toLocaleDateString()}</b></>}
                    valueText={maximumCasesDayEUA && maximumCasesDayEUA.value.max.toLocaleString()}
                    style={{backgroundColor: '#424242', color: '#bdbdbd', border: '1px solid #000000', margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_MOURNING}
                    title={<>Dia com maior número de mortes<br/><b>{maximumDeathsDayEUA && maximumDeathsDayEUA.key.toLocaleDateString()}</b></>}
                    valueText={maximumDeathsDayEUA && maximumDeathsDayEUA.value.max.toLocaleString()}
                    style={{backgroundColor: '#424242', color: '#bdbdbd', border: '1px solid #000000', margin: '.5rem'}}
                />
            </div>
            Reino Unido
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
                <Indicator
                    imgSrc={ICON_VACCINATION}
                    title='Imunizados'
                    valueText={`${String(immuneVaccinatedUK).match(/\d*\.\d{2}/g)}%`}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_VACCINATION}
                    title='Vacinados'
                    valueText={`${String(fullyVaccinatedUK).match(/\d*\.\d{2}/g)}%`}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_INFECTION}
                    title='Infectados'
                    valueText={totalCasesUK}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_MOURNING}
                    title='Mortes'
                    valueText={totalDeathsUK}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_INFECTION}
                    title={<>Dia com maior número de casos<br/><b>{maximumCasesDayUK && maximumCasesDayUK.key.toLocaleDateString()}</b></>}
                    valueText={maximumCasesDayUK && maximumCasesDayUK.value.max.toLocaleString()}
                    style={{backgroundColor: '#424242', color: '#bdbdbd', border: '1px solid #000000', margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_MOURNING}
                    title={<>Dia com maior número de mortes<br/><b>{maximumDeathsDayUK && maximumDeathsDayUK.key.toLocaleDateString()}</b></>}
                    valueText={maximumDeathsDayUK && maximumDeathsDayUK.value.max.toLocaleString()}
                    style={{backgroundColor: '#424242', color: '#bdbdbd', border: '1px solid #000000', margin: '.5rem'}}
                />
            </div>
        </div>
    );
}