import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import pool from '../config/mysql.config';
import { HttpResponse } from '../domain/response';
import { Code } from '../enum/code.enum';
import { Status } from '../enum/status.enum';
import { Entry } from '../definitions/entry.interface';
import { ResultSet } from '../definitions/resultset.type';
import { NEWS_QUERY } from '../query/news.query';

export const getNewsEntries = async (request: Request, response: Response): Promise<Response<Entry[]>> => {
	const poolConnection = await pool.getConnection();
	const page: number = parseInt(request.query.page as string) || 1;
	const limit: number = parseInt(request.query.limit as string) || 10;
	const offset: number = (page - 1) * limit;

	try {
		const result: ResultSet = await poolConnection.query(NEWS_QUERY.SELECT_ENTRIES, [limit, offset]);
		return response.status(Code.OK)
			.send(new HttpResponse(Code.OK, Status.OK, 'Entries retrieved', result[0]));
	}
	catch (error: unknown) {
		console.error(error);

		return response.status(Code.INTERNAL_SERVER_ERROR)
			.send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred'));
	}
};

export const getNewsEntry = async (request: Request, response: Response): Promise<Response<Entry>> => {
	const poolConnection = await pool.getConnection();
	try {
		const result: ResultSet = await poolConnection.query(NEWS_QUERY.SELECT_ENTRY, [request.params.entryId]);

		if (((result[0]) as Array<any>).length > 0) {
			return response.status(Code.OK)
				.send(new HttpResponse(Code.OK, Status.OK, 'Entry retrieved', result[0]));
		}

		return response.status(Code.NOT_FOUND)
			.send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Entry not found'));
	}
	catch (error: unknown) {
	  console.error(error);

	  return response.status(Code.INTERNAL_SERVER_ERROR)
		.send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error occurred'));
	}
};

export const removeAllNewsEntries = async (): Promise<void> => {
	const poolConnection = await pool.getConnection();
    try {
        await poolConnection.query(NEWS_QUERY.TRUNCATE_TABLE);
        console.log("All news entries have been removed.");
    }
    catch (error: unknown) {
        console.error(error);
        throw error;
    }
}

export const insertNewsBatchEntries = async (entries: Entry[]): Promise<void> => {
	const poolConnection = await pool.getConnection();
    try {
        const promises = [];

        const chunkSize = 10;
        for (let i = 0; i < entries.length; i += chunkSize) {
            const chunk = entries.slice(i, i + chunkSize);
            const values = chunk.map(entry => Object.values(entry));
            promises.push(poolConnection.query(NEWS_QUERY.INSERT_BATCH, [values]));
        }

        await Promise.all(promises);
    } catch (error: unknown) {
        console.error(error);
        throw error;
    }
};
