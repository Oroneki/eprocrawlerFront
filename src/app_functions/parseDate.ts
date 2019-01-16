export const parseSidaDate = (dateStr: string) => {
    const args = dateStr.split('/').reverse().map(x => parseInt(x, 10)).slice(0, 3);
    args[1] = args[1] - 1;
            
    const dataParsed: Date = new Date(...args as [number, number, number]);

    // console.log(' parseSidaDate > ', dateStr, ' - ', args, ' - ', dataParsed.toISOString(), ' : ', dataParsed);

    return dataParsed;
};