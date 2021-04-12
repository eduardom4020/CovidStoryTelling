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

export const SlideKPIsCompacto = ({active}) => {
    const barchartRef = useRef();

    const [ immuneGroup, setImmuneGroup ] = useState();
    const [ vaccinatedGroup, setVaccinatedGroup ] = useState();

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

    let immuneVaccinatedBRA = immuneGroup && immuneGroup.order(d => d.max).top(1)[0].value.max * 100;
    let fullyVaccinatedBRA = vaccinatedGroup && vaccinatedGroup.order(d => d.max).top(1)[0].value.max * 100;
   
    
     // EUA
    const [ immuneGroupEUA, setImmuneGroupEUA ] = useState();
    const [ vaccinatedGroupEUA, setVaccinatedGroupEUA ] = useState();

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

    let immuneVaccinatedEUA = immuneGroupEUA && immuneGroupEUA.order(d => d.max).top(1)[0].value.max * 100;
    let fullyVaccinatedEUA = vaccinatedGroupEUA && vaccinatedGroupEUA.order(d => d.max).top(1)[0].value.max * 100;


    // UK
    const [ immuneGroupUK, setImmuneGroupUK ] = useState();
    const [ vaccinatedGroupUK, setVaccinatedGroupUK ] = useState();

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

    let immuneVaccinatedUK = immuneGroupUK && immuneGroupUK.order(d => d.max).top(1)[0].value.max * 100;
    let fullyVaccinatedUK = vaccinatedGroupUK && vaccinatedGroupUK.order(d => d.max).top(1)[0].value.max * 100;
    

    return (
        <div style={{fontFamily: '"Palatino", sans-serif'}}>
            <div style={{margin: '5rem'}} >
                <h2>Indicadores de Vacinação</h2>
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
                <Indicator
                    imgSrc={ICON_VACCINATION}
                    title='Imunizados (BR)'
                    valueText={`${String(immuneVaccinatedBRA).match(/\d*\.\d{2}/g)}%`}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_VACCINATION}
                    title='Vacinados (BR)'
                    valueText={`${String(fullyVaccinatedBRA).match(/\d*\.\d{2}/g)}%`}
                    style={{margin: '.5rem'}}
                />

                <Indicator
                    imgSrc={ICON_VACCINATION}
                    title='Imunizados (EUA)'
                    valueText={`${String(immuneVaccinatedEUA).match(/\d*\.\d{2}/g)}%`}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_VACCINATION}
                    title='Vacinados (EUA)'
                    valueText={`${String(fullyVaccinatedEUA).match(/\d*\.\d{2}/g)}%`}
                    style={{margin: '.5rem'}}
                />

                <Indicator
                    imgSrc={ICON_VACCINATION}
                    title='Imunizados (UK)'
                    valueText={`${String(immuneVaccinatedUK).match(/\d*\.\d{2}/g)}%`}
                    style={{margin: '.5rem'}}
                />
                <Indicator
                    imgSrc={ICON_VACCINATION}
                    title='Vacinados (UK)'
                    valueText={`${String(fullyVaccinatedUK).match(/\d*\.\d{2}/g)}%`}
                    style={{margin: '.5rem'}}
                />
            </div>
        </div>
    );
}