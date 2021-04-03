import React, { useEffect, useState } from 'react';
import { BarChart } from 'react-dc-js';

import { getDimension } from '../../providers/dimensionsProvider';
import { RESOURCE_NAME_VACCINATIONS } from '../../constants';

export const Slide1 = ({active}) => {
    const [ peopleFullyVaccinatedDimension, setPeopleFullyVaccinatedDimension ] = useState();

    useEffect(async () => {
        const dimension = await getDimension(RESOURCE_NAME_VACCINATIONS, 'people_fully_vaccinated');
        console.log({dimension})
        setPeopleFullyVaccinatedDimension(dimension);
    }, []);

    console.log({peopleFullyVaccinatedDimension})

    return (
        <div style={{height: '30rem'}}>
            <h1>Some Bar chart</h1>
            {
                peopleFullyVaccinatedDimension &&
                    <BarChart dimension={peopleFullyVaccinatedDimension} group={peopleFullyVaccinatedDimension.group()} />
            }
        </div>
    );
}