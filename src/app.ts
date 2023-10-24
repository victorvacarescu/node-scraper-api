import express, { Request, Response, Application } from 'express';
import ip from 'ip';
import cors from 'cors';
import { HttpResponse } from './domain/response'
import { Code } from './enum/code.enum';
import { Status } from './enum/status.enum';
import newsRoutes from './routes/news.routes';
import videosRoutes from './routes/videos.routes';

export class App {
	private readonly app: Application;
	private readonly APPLICATION_RUNNING = 'application is running on:';
	private readonly ROUTE_NOT_FOUND = 'Route does not exist on the server';

	public constructor(private readonly port: (string | number) = process.env.SERVER_PORT || 3000) {
		this.app = express();
		this.middleWare();
		this.routes();
	}

	public listen(): void {
		this.app.listen(this.port);
		console.info(`${this.APPLICATION_RUNNING} ${ip.address()}:${this.port}`);
	}

	private middleWare(): void {
		this.app.use(cors({ origin: "*" }));
		this.app.use(express.json());
	}

	private routes(): void {
		this.app.use('/news', newsRoutes);
		this.app.use('/videos', videosRoutes);
		this.app.get('/', (_: Request, res: Response)=> res.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, 'Server is up')));
		this.app.all('*', (_: Request, res: Response)=> res.status(Code.NOT_FOUND).send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, this.ROUTE_NOT_FOUND)));
	}
}