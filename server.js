// Dependencies
const express = require('express');
const mongojs = require('mongojs');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database configuration
let databaseUrl;

if (process.env.MONGODB_URI) {
  databaseUrl = process.env.MONGODB_URI;
} else {
  databaseUrl = 'scraper';
}

const collections = ['dota'];

const db = mongojs(databaseUrl, collections);
console.log('This time, databaseURL is: ', databaseUrl);
db.on('error', function(error) {
  console.log('Database Error:', error);
});

db.on('connect', () => {
  console.log('database connected - with collection: ', collections);
});

// Routes
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// For to hold le'results
let results = [];

app.get('/all', (req, res) => {
  db.dota.find({}, (error, found) => {
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

        let date = $(element)
          .find('div .entry-meta')
          .text()
          .trim();

        let link = $(element)
          .find('h2')
          .find('a')
          .attr('href');

        let img = $(element)
          .find('div .entry-content')
          .find('p')
          .find('img')
          .attr('src');

        let summary = $(element)
          .find('div')
          .children()
          .eq(1)
          .text();

        let blog = {
          title: title,
          date: date,
          link: link,
          img: img,
          summary: summary
        };

        // blog.summary = blog.summary + ' (click to read more)';

        results.push(blog);

        console.log("I'm results: ", results);

        //   db.dota.insert(results, (err, results) => {
        //     if (err) {
        //       console.log(err);
        //     } else {
        //       console.log(results);
        //     }
        //   });
        // })
        // .then(() => {
        //   console.log('Scrape Complete');
        //   res.json(results);
        // })
        // .catch(err => console.log(err));
      });
    })
    .then(gathered => {
      console.log('Gathered: ', gathered);
      res.json(results);
    })
    .catch(err => console.log(err));
});

// Post route for comments
app.post('/comments', (req, res) => {
  console.log('hi there');
  console.log("I'm a req: ", req.body);

  let databaseEntry = {
    username: username,
    usercomment: usercomment
  };

  db.dotaComments.insert({ databaseEntry });

  res.send('Hi there');
});

app.listen(PORT, function() {
  console.log('App running on port: ' + PORT + '!');
});
