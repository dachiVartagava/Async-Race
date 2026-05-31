const CAR_BRANDS = ['Tesla', 'BMW', 'Mercedes', 'Ford', 'Audi', 'Toyota', 'Porsche', 'Nissan', 'Hyundai', 'Honda'];
const CAR_MODELS = ['Model S', 'M5', 'S-Class', 'Mustang', 'R8', 'Camry', '911 Turbo', 'GT-R', 'Elantra', 'Civic'];
const getRandomColor = (): string =>{
    const letters = '0123456789ABCDEF';
    let color = '#';
    for(let i=0;i<6;i++){
        color+=letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
export const generateRandomCars = () =>{
    const cars = [];
    for(let i=0;i<100;i++){
        const brand = CAR_BRANDS[Math.floor(Math.random() * CAR_BRANDS.length)];
        const model = CAR_MODELS[Math.floor(Math.random() * CAR_MODELS.length)];
        cars.push({
            name:`${brand} ${model}`,
            color: getRandomColor(),
        });
    }
    return cars;
}