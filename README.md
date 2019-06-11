# news-scraper

View project: https://news-scraper-2019to.herokuapp.com/

This web app uses express, mongo, cheerio and axios to let you scrape articles from NPR News, save articles and leave comments on saved articles.

The app scrapes stories from the NPR News website and displays them for the user on the main page once the scrape button is pressed. Each scraped article is saved to the application database. The app scrapes and displays the headline, summary, URL and photo for each article:

You can also leave comments on the articles saved. The comments are saved to the database as well and associated with their articles. All stored comments are visible to every user.
