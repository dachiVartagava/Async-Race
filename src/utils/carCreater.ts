 export const carTypelabel = (nameFromInput:string,colorFromInput:string)=>{
    const cars = []
    const model = nameFromInput;
    const color = colorFromInput;
    cars.push({
        name:`${model}`,
        color:`${color}`,
    });
    return cars;
}
