export const VIDEOS_QUERY = {
    SELECT_ENTRIES: 'SELECT * FROM videos ORDER BY publish_date DESC LIMIT ?, ?',
    SELECT_ENTRY: 'SELECT * FROM videos WHERE id = ?',
    CREATE_ENTRY: 'INSERT INTO videos(title, description, thumbnail, link, publish_date) VALUES (?, ?, ?, ?, ?);',
    UPDATE_ENTRY: 'UPDATE videos SET title = ?, description = ?, thumbnail = ?, link = ?, publish_date = ? WHERE id = ?',
    DELETE_ENTRY: 'DELETE FROM videos WHERE id = ?',
	INSERT_BATCH: 'INSERT INTO videos(title, description, thumbnail, link, publish_date) VALUES ?',
	TRUNCATE_TABLE: 'TRUNCATE TABLE videos'
};
