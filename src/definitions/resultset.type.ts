import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';

export type ResultSet = [
	RowDataPacket[] | 
	RowDataPacket[][] | 
	OkPacket | 
	OkPacket[] | 
	ResultSetHeader, 
	FieldPacket[]
];