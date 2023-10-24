import { Router } from 'express';
import { getNewsEntries, getNewsEntry } from '../controllers/news.controller';

const newsRoutes = Router();

newsRoutes.route('/')
	.get(getNewsEntries)

newsRoutes.route('/:entryId')
	.get(getNewsEntry)

export default newsRoutes;
