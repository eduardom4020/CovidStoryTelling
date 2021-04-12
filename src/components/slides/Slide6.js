import React, { useEffect, useState, useRef } from 'react';
import { MapBrazil } from 'react-brazil-map'
import susCovidLatestDataWithVaccinations from '../../assets/sus_covid_latest_data_with_vaccinations.json'

let data = [];
let population = 0;
let cases = 0;
let deaths = 0;
let total_vaccines_received = 0;
let vaccine_first_dosage = 0;
let vaccine_second_dosage = 0;
let percentage_vaccinated_first_dose = 0;
let percentage_vaccinated_second_dose = 0;
let percentage_vaccines_recives_first_dose = 0;
let percentage_vaccines_recives_second_dose = 0;

susCovidLatestDataWithVaccinations.forEach(element => {
    data.push(element)
});

export const Slide6 = ({active}) => {

    let dataState = [];

    const barchartRef = useRef();

    const [distritc, setDistrict] = useState('')

    if(distritc!=''){

        dataState = parseDataState(distritc);

        population = dataState.population;
        cases = dataState.cases;
        deaths = dataState.deaths;
        total_vaccines_received = dataState.total_vaccines_received;
        vaccine_first_dosage = dataState.vaccine_first_dosage;
        vaccine_second_dosage = dataState.vaccine_second_dosage;
        percentage_vaccinated_first_dose = ((vaccine_first_dosage/population)*100).toFixed(2)
        percentage_vaccinated_second_dose = ((vaccine_second_dosage/population)*100).toFixed(2)
        percentage_vaccines_recives_first_dose = ((vaccine_first_dosage/total_vaccines_received)*100).toFixed(2)
        percentage_vaccines_recives_second_dose = ((vaccine_second_dosage/total_vaccines_received)*100).toFixed(2)

    }

    function parseDataState(state){
        let dataState = []
        data.forEach(element => {
            if(element.state==state){
                dataState = element;
            }
        })
        return dataState;
    }

    function setDisplay() { document.getElementById('outer').style.display = 'flex'; }

    useEffect(() => {
        
        if(barchartRef.current) {
            const chartDOM = barchartRef.current;
            const { width, height } = chartDOM.parentNode.getBoundingClientRect();           
        }

    }, [barchartRef.current])

    return (
        <div style={{height: '32rem', marginTop: '8rem'}}>
            <h1>Mapa da Vacinação por Estado</h1>
            <section class="container row">
                <div class="item" onClick={setDisplay}>
                    <MapBrazil onChange={setDistrict} width={500} height={500} fill='#EC674B' />
                </div>
                <div id="outer" class="item">
                    <div class="inner">
                        <p><h2>Estado: {distritc}</h2></p>
                        <p>População Total: {population}</p>
                        <p>Total de Vacinas Recebidas: {total_vaccines_received}</p>
                        <p>Total de Vacinados (Primeira Dose): {vaccine_first_dosage}</p>
                        <p><b>Vacinas destinadas para a Primeira Dose: {percentage_vaccines_recives_first_dose}%</b></p>
                        <p><b>População Vacinada (Primeira Dose): {percentage_vaccinated_first_dose}%</b></p>
                        <p>Total de Vacinados (Segunda Dose): {vaccine_second_dosage}</p>
                        <p><b>População Vacinada (Segunda Dose): {percentage_vaccinated_second_dose}%</b></p>
                        <p><b>Vacinas destinadas para a Segunda Dose: {percentage_vaccines_recives_second_dose}%</b></p>
                    </div>
                </div>
            </section>
            
        </div>
    );
}