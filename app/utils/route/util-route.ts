export const getValueOfDynamicRoute = (context: {params: any}) => {
    const keys = Object.keys(context.params);
    const key = keys[0];

    return context.params[key];
}