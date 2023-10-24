import { Router } from 'express';
import { getVideoEntries, getVideoEntry } from '../controllers/videos.controller';

const newsRoutes = Router();

newsRoutes.route('/')
	.get(getVideoEntries)

newsRoutes.route('/:entryId')
	.get(getVideoEntry)

export default newsRoutes;
