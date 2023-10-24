export const NEWS_QUERY = {
    SELECT_ENTRIES: 'SELECT * FROM news ORDER BY publish_date LIMIT ? OFFSET ?',
    SELECT_ENTRY: 'SELECT * FROM news WHERE id = ?',
    CREATE_ENTRY: 'INSERT INTO news(title, description, thumbnail, link, publish_date) VALUES (?, ?, ?, ?, ?);',
    UPDATE_ENTRY: 'UPDATE news SET title = ?, description = ?, thumbnail = ?, link = ?, publish_date = ? WHERE id = ?',
    DELETE_ENTRY: 'DELETE FROM news WHERE id = ?',
	INSERT_BATCH: 'INSERT INTO news(title, description, thumbnail, link, publish_date) VALUES ?',
    TRUNCATE_TABLE: 'TRUNCATE TABLE news'
};
