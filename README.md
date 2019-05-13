# news-scraper
A web app using express, mongo, cheerio and axios that lets users view and leave comments on a news feed. 

The app scrapes stories from NPR News and displays them for the user. Each scraped article is saved to the application database. The app will scrape and display the following information for each article:


 * Headline

 * Summary

 * URL 
 
 * Photo

Users can also leave comments on the articles displayed and revisit them later. The comments are saved to the database as well and associated with their articles. Users can also delete comments left on articles. All stored comments are visible to every user.
