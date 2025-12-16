export const ALL_CARS = [
  {
    id: 1,
    make: 'BMW',
    model: 'M3 (E46)',
    imageName: 'bmw_m3_e46.webp',
    year: 2001,
    country: 'Almanya',
    bodyType: 'Coupe',
    fuelType: 'Benzin',
    engineSizeL: 3.2,
    horsepower: 343,
    zeroToHundredSec: 5.1,
    weightKg: 1495,
  },
  {
    id: 2,
    make: 'Honda',
    model: 'Civic Type R (FK8)',
    imageName: 'honda_civic_fk8.webp',
    year: 2017,
    country: 'Japonya',
    bodyType: 'Hatchback',
    fuelType: 'Benzin',
    engineSizeL: 2.0,
    horsepower: 320,
    zeroToHundredSec: 5.8,
    weightKg: 1390,
  },
  {
    id: 3,
    make: 'Tesla',
    model: 'Model 3 Performance',
    imageName: 'tesla_m3_perf.webp',
    year: 2021,
    country: 'ABD',
    bodyType: 'Sedan',
    fuelType: 'Elektrik',
    engineSizeL: 0,
    horsepower: 480,
    zeroToHundredSec: 3.3,
    weightKg: 1847,
  },
];

// Provide a harmless default export so expo-router treats this file as a valid route
export default function CarsRoute() {
  return null;
}
