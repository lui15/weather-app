export type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type OneCall = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    clouds: number;
    visibility: number;
    weather: Weather[];
  };
  hourly: Array<{
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    clouds: number;
    pop: number;
    weather: Weather[];
  }>;
  daily: Array<{
    dt: number;
    sunrise: number;
    sunset: number;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feels_like: { day: number; night: number; eve: number; morn: number };
    pressure: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    clouds: number;
    pop: number;
    weather: Weather[];
  }>;
};
