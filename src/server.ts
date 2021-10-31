import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { forecastController } from './controllers/forecast';
import { Application } from 'express';

export class SetupServer extends Server {
	constructor(private port = 3000) {
		super();
	}

	public init(): void {
		this.setupExpress();
		this.setupControllers();
	}

	public getApp(): Application {
		return this.app
	}

	private setupExpress(): void {
		this.app.use(bodyParser.json());
	}

	private setupControllers(): void {
		const forecastControllers = new forecastController();
		this.addControllers([forecastControllers])
	}
}
