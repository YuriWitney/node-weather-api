import { AxiosStatic } from 'axios';

export interface StormGlassSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  readonly time: string;
  readonly swellDirection: StormGlassSource;
  readonly swellHeight: StormGlassSource;
  readonly swellPeriod: StormGlassSource;
  readonly waveDirection: StormGlassSource;
  readonly wavelHeight: StormGlassSource;
  readonly windDirection: StormGlassSource;
  readonly windSpeed: StormGlassSource;
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
}

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  constructor(private request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<{}> {
    return this.request.get(
      `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${lng}`
    );
  }
}
