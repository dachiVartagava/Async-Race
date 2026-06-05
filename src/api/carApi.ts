export interface Car {
  id: number;
  name: string;
  color: string;
}

// Fetch cars from garage with pagination
export const getCars = async (page: number, limit: number = 7): Promise<{ cars: Car[]; totalCount: number }> => {
  try {
    const response = await fetch(`http://127.0.0.1:3000/garage?_page=${page}&_limit=${limit}`);
    const data = await response.json();
    const totalCount = response.headers.get('X-Total-Count');
    
    return {
      cars: data as Car[],
      totalCount: totalCount ? parseInt(totalCount, 10) : 0
    };
  } catch (error) {
    console.log("Can't get cars:", error);
    return { cars: [], totalCount: 0 };
  }
};

// Create a single new car
export const createCar = async (car: { name: string; color: string }): Promise<Car> => {
  const response = await fetch('http://127.0.0.1:3000/garage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  return response.json();
};

// Generate multiple random cars simultaneously
export const generateCarsApi = async (cars: { name: string; color: string }[]) => {
  await Promise.all(cars.map((car) => createCar(car)));
};

// Update existing car attributes
export const updateCarApi = async (id: number, car: { name: string; color: string }): Promise<Car> => {
  const response = await fetch(`http://127.0.0.1:3000/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  return response.json();
};

// Delete car from garage by ID
export const deleteCarApi = async (id: number): Promise<boolean> => {
  const response = await fetch(`http://127.0.0.1:3000/garage/${id}`, {
    method: 'Delete',
  });
  return response.ok;
};

// Start engine to fetch velocity and distance
export const startEngineApi = async (id: number): Promise<{ velocity: number; distance: number }> => {
  const response = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=started`, { method: 'PATCH' });
  return response.ok ? response.json() : { velocity: 0, distance: 0 };
};

//  Switch engine to drive mode and handle potential 500 server errors (engine breakdown)
export const driveEngineApi = async (id: number): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=drive`, { method: 'PATCH' });
    if (response.status === 500) return { success: false }; //  Engine is broken
    return { success: true };
  } catch {
    return { success: false };
  }
};

// Save new winner or update existing stats in the database
export const saveWinnerApi = async (id: number, wins: number, time: number) => {
  // Check if the winner record already exists
  const res = await fetch(`http://127.0.0.1:3000/winners/${id}`);
  
  if (res.ok) {
    // If record exists, update wins count and compare best time (PUT)
    const existing = await res.json();
    await fetch(`http://127.0.0.1:3000/winners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wins: existing.wins + 1, time: time < existing.time ? time : existing.time }),
    });
  } else {
    // If it's a new winner, create a record (POST)
    await fetch(`http://127.0.0.1:3000/winners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, wins: 1, time }),
    });
  }
};

// Fetch winners with server-side sorting and pagination options
export const getWinnersApi = async (
  page: number, 
  limit: number = 10, 
  sort: string = 'id', 
  order: 'ASC' | 'DESC' = 'ASC'
): Promise<{ winners: any[]; totalCount: number }> => {
  const response = await fetch(
    `http://127.0.0.1:3000/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`
  );
  const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
  const winners = await response.json();
  
  // Since the winners table only stores IDs, fetch corresponding car details manually
  const fullWinners = await Promise.all(winners.map(async (winner: any) => {
    const carRes = await fetch(`http://127.0.0.1:3000/garage/${winner.id}`);
    const carData = carRes.ok ? await carRes.json() : { name: 'Unknown', color: '#fff' };
    return { ...winner, name: carData.name, color: carData.color };
  }));

  return { winners: fullWinners, totalCount };
};