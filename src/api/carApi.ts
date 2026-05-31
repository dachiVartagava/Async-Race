export interface Car{
    id:number,
    name:string,
    color:string;
}
export const getCars = async(page:number,limit:number =7):Promise<{cars : Car[]; totalCount:number}>  =>{
    try{
        const response = await fetch(`http://127.0.0.1:3000/garage?_page=${page}&_limit=${limit}`);
    
    const data = await response.json();
    const totalCount = response.headers.get('X-Total-Count');
    return {
        cars: data as Car[],
        totalCount:totalCount ? parseInt(totalCount,10):0
    };
    }
    catch (error){
    console.log("Can't get cars:",error);
    return {cars: [],totalCount:0};
    }
}
export const createCar = async(car:{name:string;color:string}): Promise<Car> =>{
    const response = await fetch('http://127.0.0.1:3000/garage',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(car),
    });
    return response.json();
};
export const generateCarsApi = async(cars:{name:string,color:string}[])=>{
    await Promise.all(cars.map((car)=>createCar(car)));
};
