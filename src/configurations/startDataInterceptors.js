import * as d3 from 'd3';
import { registerDataInterceptor } from '../providers/dataTreatmentInterceptor';
import { RESOURCE_NAME_JHU_FULL_DATA, MOVING_AVERAGE_WINDOW } from '../constants';

export const startDataInterceptors = () => {

    registerDataInterceptor(RESOURCE_NAME_JHU_FULL_DATA, data => {
        const dateParser = d3.timeParse('%Y-%m-%d');
        let lastNewDeaths = 0;

        const adjustedData = data.map(d => {
            lastNewDeaths = d.new_deaths || lastNewDeaths;

            return {
                ...d, 
                date: dateParser(d.date),
                new_deaths: lastNewDeaths
            } 
        });

        const movingAverageAddedData = adjustedData.map((d, index, array) => {
            if(index >= MOVING_AVERAGE_WINDOW) {
                const newDeathsChunk = array.slice(index - MOVING_AVERAGE_WINDOW, index + 1)
                    .map(d => d.new_deaths);
        
                const new_deaths_mov_avg = newDeathsChunk
                    .reduce((acc, curr) => acc + curr, 0) / (MOVING_AVERAGE_WINDOW + 1);
        
                return { ...d, new_deaths_mov_avg }
            }
        
            return { ...d, new_deaths_mov_avg: d.new_deaths };
        });

        return movingAverageAddedData;
    });

}