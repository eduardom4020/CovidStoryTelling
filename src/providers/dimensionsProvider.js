import crossfilter from 'crossfilter';

import { interceptData } from './dataTreatmentInterceptor';
import Assets from '../assets';

const crossfiltersCache = {};
const dimensionsCache = {};

export const getDimension = (resourceName, dimensionName) => {
    if(!crossfiltersCache.hasOwnProperty(resourceName)) {
        const rawData = Assets[resourceName];
        const data = interceptData(resourceName, rawData);
        crossfiltersCache[resourceName] = crossfilter(data);
    }

    if(!dimensionsCache.hasOwnProperty(dimensionName)) {
        dimensionsCache[dimensionName] = crossfiltersCache[resourceName].dimension(cx => cx[dimensionName]);
    }

    return dimensionsCache[dimensionName];
}