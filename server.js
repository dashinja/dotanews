// Dependencies
let express = require('express');
let mongojs = require('mongojs');
let axios = require('axios');
let cheerio = require('cheerio');

let app = express();

// Database configuration
let databaseUrl = process.env.MONGODB_URI || 'scraper';
let collections = ['dota'];

let db = mongojs(databaseUrl, collections);
db.on('error', function(error) {
  console.log('Database Error:', error);
});

// Routes
app.get('/', function(req, res) {
  res.send('Hello world');
});

// For to hold le'results
let results = [];

app.get('/all', (req, res) => {
  db.dota.find({}, (error, found) => {
    //callback things
    if (error) {
      console.log('Danger will Robinson');
    } else {
      console.log('Complete');
      res.json(found);
    }
  });
});

app.get('/dota', (req, res) => {
  axios
    .get('http://blog.dota2.com/')
    .then(res => {
      let $ = cheerio.load(res.data);

      $('.type-post').each((i, element) => {
        let title = $(element)
          .find('h2')
          .find('a')
          .text();
        console.log(title);

        let link = $(element)
          .find('h2')
          .find('a')
          .attr('href');
        console.log(link);

        let blog = {
          title: title,
          link: link
        };
        results.push(blog);
      });

      console.log("I'm Blog: ", results);
      db.dota.insert(results, (err, results) => {
        if (err) {
          console.log(err);
        } else {
          console.log(results);
        }
      });
    })
    .then(() => {
      console.log('Scrape Complete');
    })
    .catch(err => console.log(err));
  res.json(results);
});

app.listen(3000, function() {
  console.log('App running on port 3000!');
});
