export interface DayForecast {
  date: string;
  condition: {
    text: string;
  };
  daily_chance_of_rain: number;
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
}
export interface HourlyForecast {
  time: string;
  temp_c: number;
  temp_f: number;
  condition: string;
}