import { useEffect, useState } from 'react';
import { getDimension } from '../providers/dimensionsProvider';

export const useDimension = (resourceName, field) => {
    const [ Dimension, setDimension ] = useState();

    useEffect(async () => {
        const dimension = await getDimension(resourceName, field);
        setDimension(dimension);
    }, [resourceName, field]);

    return Dimension;
}