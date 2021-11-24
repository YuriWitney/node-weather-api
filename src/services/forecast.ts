import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import { internalError } from '@src/util/errors/internal-error';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  lat: number;
  lng: number;
  name: string;
  position: BeachPosition;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class ForecastProcessingInternalError extends internalError {
	constructor(message: string) {
	super(`Unexpected error during the forecast processing: ${message}`)
	}
}
export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    const pointsWithCorrectSource: BeachForecast[] = [];
		try {
			for (const beach of beaches) {
				const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
				const enrichedBeachData = this.enrichedBeacheData(points, beach)
				pointsWithCorrectSource.push(...enrichedBeachData);
			}
			return this.mapForecastByTime(pointsWithCorrectSource);
		} catch (error) {
			throw new ForecastProcessingInternalError((error as ForecastProcessingInternalError).message)
		}
    
  }

	private enrichedBeacheData(points: ForecastPoint[], beach: Beach): BeachForecast[] {
		return points.map((e) => ({
			...{
				lat: beach.lat,
				lng: beach.lng,
				name: beach.name,
				position: beach.position,
				rating: 1,
			},
			...e,
		}));
	}

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];
    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);
      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }
    return forecastByTime;
  }
}
