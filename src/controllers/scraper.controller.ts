import axios from 'axios';
import xml2js from 'xml2js';
import { Entry } from '../definitions/entry.interface';
import { insertNewsBatchEntries, removeAllNewsEntries } from './news.controller';
import { insertVideoBatchEntries, removeAllVideoEntries } from './videos.controller';

const TIMEOUT = 10 * 60 * 1000;

class ScraperController {

	public static readonly instance = new ScraperController();

	public async scrapeAll(): Promise<void> {
		await this.removeAllEntries();

		await Promise.all([
			this.scrapeNews(), 
			this.scrapeVideos()
		]);
    }

	private async removeAllEntries(): Promise<void> {
		await Promise.all([
			removeAllNewsEntries(),
			removeAllVideoEntries()
		]);
	}

    private async scrapeNews(): Promise<void> {
        const response = await axios.get('https://www.eurogamer.net/feed/news', { timeout: TIMEOUT });
        const jsonData = await xml2js.parseStringPromise(response.data);

        const newsArray = this.constructFromJsonData(jsonData);

		try {
			await insertNewsBatchEntries(newsArray);
			console.log(`Inserted ${newsArray.length} news entries.`);
		} catch (error: any) {
			console.error(`Error inserting news batch entries: ${error.message}`);
		}
    }

    private async scrapeVideos(): Promise<void> {
        const response = await axios.get('https://www.eurogamer.net/feed/videos', { timeout: TIMEOUT });
        const jsonData = await xml2js.parseStringPromise(response.data);

        const videosArray = this.constructFromJsonData(jsonData);

		try {
			await insertVideoBatchEntries(videosArray);
			console.log(`Inserted ${videosArray.length} video entries.`);
		} catch (error: any) {
			console.error(`Error inserting video batch entries: ${error.message}`);
		}
    }

	private constructFromJsonData(jsonData: any): Entry[] {
		return jsonData.rss.channel[0].item.map((item: any) => ({
            title: item.title[0],
            description: item.description[0],
            thumbnail: this.extractThumbnail(item.description[0]),
            link: item.link[0],
            publish_date: this.formatDate(item.pubDate[0])
        }));
	}

	private extractThumbnail(description: string): string | null {
        const regex = /<img src="([^"]+)"/;
        const match = description.match(regex);
        return match ? match[1] : null;
    }

	private formatDate(date: string): string {
		return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
	}
}

if (require.main === module) {
	ScraperController.instance.scrapeAll();
}

export default ScraperController;
