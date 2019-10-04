const express = require('express');
const bodyParser = require('body-parser');
const influent = require('influent');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

router.post('/influent', (req, res) => {
  console.log(req.body);
  console.log(req.body.data.length);

  influent
    .createHttpClient({
      server: [
        {
          protocol: "http",
          host:     "localhost",
          port:     8086
        }
      ],
      username: "gobwas",
      password: "xxxx",
      database: "training"
    })
    .then((client) => {
      for(let i=0; i < req.body.data.length; i++) {
        console.log(new Date(req.body.data[i].timestamp));
        client
          .write({
            key: 'motion',
            tags: {
              activity: req.body.data[i].activity,
              subject: req.body.data[i].subject
            },
            fields: {
              x: req.body.data[i].x,
              y: req.body.data[i].y,
              z: req.body.data[i].z,
              alpha: req.body.data[i].alpha,
              beta: req.body.data[i].beta,
              gamma: req.body.data[i].gamma,
              stamp: req.body.data[i].timestamp
            }
          })
          .then((res) => { console.log("ok")})
          .catch((error) => {
            console.log(error);
          });
      }
      res.status(200);
      res.json({ data: 'ok'});
      return res;
    });
});

router.get('/influent', (req, res) => {
  influent
    .createHttpClient({
      server: [
        {
          protocol: "http",
          host:     "localhost",
          port:     8086
        }
      ],
      username: "gobwas",
      password: "xxxx",

      database: "training"
    })
    .then((client) => {
      client
        .query('select * from "motion"')
        //.query('show SERIES from "motion"')
        .then((result) => {
          console.log(result);
          res.status(200);
          res.json(result);
          return res;
        })
        .catch((error) => {
          console.log(error);
        });
    });
});

app.use('/', router);

app.listen(3000);

