const d3JSONDataInterceptors = {};

export const registerDataInterceptor = (resourceName, interceptor) => {
    d3JSONDataInterceptors[resourceName] = interceptor;
}

export const interceptData = resourceName => data => {
    const interceptor = d3JSONDataInterceptors[resourceName];
    
    if(interceptor)
        return interceptor(data);

    return data;
}