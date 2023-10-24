import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { Entry } from '../definitions/entry.interface';

export class ScraperController {
	private static async fetchAndParseXML(url: string): Promise<any> {
		const response = await axios.get(url);
		const data = await parseStringPromise(response.data);
		return data;
	}

	private static formatData(item: any): Entry {
		return {
			title: item.title[0],
			description: item.description[0],
			thumbnail: item['media:thumbnail']?.[0]?.$?.url || '',
			link: item.link[0],
			publish_date: new Date(item.pubDate[0]).toISOString().slice(0, 19).replace('T', ' ')
		};
	}

	public static async scrapeNews(): Promise<void> {
		const feed = 'https://www.eurogamer.net/feed/news';

		const data = await this.fetchAndParseXML(feed);
		const items = data?.rss?.channel[0]?.item || [];
		const formattedItems = items.map(this.formatData);
		console.log(formattedItems);

		// You can further process/save formattedItems as required.
	}

	public static async scrapeVideos(): Promise<void> {
		const feed = 'https://www.eurogamer.net/feed/videos';

		const data = await this.fetchAndParseXML(feed);
		const items = data?.rss?.channel[0]?.item || [];
		const formattedItems = items.map(this.formatData);
		console.log(formattedItems);

		// You can further process/save formattedItems as required.
	}

	public static async scrapeAll(): Promise<void> {
		await this.scrapeNews();
		await this.scrapeVideos();
	}
}

// This script will run if the file is executed directly.
if (require.main === module) {
	// ScraperController.scrapeAll();
	ScraperController.scrapeNews();
}
