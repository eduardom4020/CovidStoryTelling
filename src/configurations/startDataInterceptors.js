import * as d3 from 'd3';
import { registerDataInterceptor } from '../providers/dataTreatmentInterceptor';
import { 
    RESOURCE_NAME_JHU_FULL_DATA, 
    RESOURCE_NAME_VACCINATIONS, 
    MOVING_AVERAGE_WINDOW, 
    RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST,
    RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_BRAZIL,
    RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_NEW_ZEALAND,
    RESOURCE_NAME_VACCINATIONS_EUA,
    RESOURCE_NAME_JHU_FULL_DATA_EUA,
    RESOURCE_NAME_VACCINATIONS_UK,
    RESOURCE_NAME_JHU_FULL_DATA_UK
} from '../constants';

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

    registerDataInterceptor(RESOURCE_NAME_JHU_FULL_DATA_EUA, data => {
        const dateParser = d3.timeParse('%Y-%m-%d');
        let lastNewDeaths = 0;
        return data.map(d => {
            lastNewDeaths = d.new_deaths || lastNewDeaths;
             return {
                ...d, 
              date: dateParser(d.date),
              new_deaths: lastNewDeaths
            } 
        });
    });

    registerDataInterceptor(RESOURCE_NAME_JHU_FULL_DATA_UK, data => {
        const dateParser = d3.timeParse('%Y-%m-%d');
        let lastNewDeaths = 0;
        return data.map(d => {
            lastNewDeaths = d.new_deaths || lastNewDeaths;
             return {
                ...d, 
              date: dateParser(d.date),
              new_deaths: lastNewDeaths
            } 
        });
    });

    registerDataInterceptor(RESOURCE_NAME_VACCINATIONS, data => {
        const dateParser = d3.timeParse('%Y-%m-%d');
        let lastNewVaccination = 0;
        return data.map(d => {
            lastNewVaccination = d.people_fully_vaccinated || lastNewVaccination;
             return {
                ...d, 
              date: dateParser(d.date),
              people_fully_vaccinated: lastNewVaccination,
              week: d3.timeWeek(d.date)
            } 
        });
    });

    registerDataInterceptor(RESOURCE_NAME_VACCINATIONS_EUA, data => {
        const dateParser = d3.timeParse('%Y-%m-%d');
        let lastNewVaccination = 0;
        return data.map(d => {
            lastNewVaccination = d.people_fully_vaccinated || lastNewVaccination;
             return {
                ...d, 
              date: dateParser(d.date),
              people_fully_vaccinated: lastNewVaccination
            } 
        });
    });

    registerDataInterceptor(RESOURCE_NAME_VACCINATIONS_UK, data => {
        const dateParser = d3.timeParse('%Y-%m-%d');
        let lastNewVaccination = 0;
        return data.map(d => {
            lastNewVaccination = d.people_fully_vaccinated || lastNewVaccination;
             return {
                ...d, 
              date: dateParser(d.date),
              people_fully_vaccinated: lastNewVaccination
            } 
        });
    });

    registerDataInterceptor(RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST, data => {
        const dateParser = d3.timeParse('%Y-%m-%d');
        let lastNewDeaths = 0;
        let lastNewCases = 0;

        const adjustedData = data.map(d => {
            lastNewDeaths = d.new_deaths || lastNewDeaths;
            lastNewCases = d.new_cases || lastNewCases;

            return {
                ...d, 
                date: dateParser(d.date),
                new_deaths: lastNewDeaths,
                new_cases: lastNewCases
            } 
        });

        return adjustedData;
    });

    registerDataInterceptor(RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_BRAZIL, data => {
        const dateParser = d3.timeParse('%Y-%m-%d');
        let lastNewDeaths = 0;
        let lastNewCases = 0;

        const adjustedData = data.map(d => {
            lastNewDeaths = d.new_deaths || lastNewDeaths;
            lastNewCases = d.new_cases || lastNewCases;

            return {
                ...d, 
                date: dateParser(d.date),
                new_deaths: lastNewDeaths,
                new_cases: lastNewCases
            } 
        });

        return adjustedData;
    });

    registerDataInterceptor(RESOURCE_NAME_JHU_FULL_DATA_WITH_FORECAST_NEW_ZEALAND, data => {
        const dateParser = d3.timeParse('%Y-%m-%d');
        let lastNewDeaths = 0;
        let lastNewCases = 0;

        const adjustedData = data.map(d => {
            lastNewDeaths = d.new_deaths || lastNewDeaths;
            lastNewCases = d.new_cases || lastNewCases;

            return {
                ...d, 
                date: dateParser(d.date),
                new_deaths: lastNewDeaths,
                new_cases: lastNewCases
            } 
        });

        return adjustedData;
    });
}
