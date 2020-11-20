const express = require('express');
const exphbs = require('express-handlebars');
const axios = require('axios').default;

const {
  BACK_URL,
} = process.env;

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const PORT = process.env.PORT || 2000;

app.get('/favicon.ico', (req, res) => {
  res.writeHead(404, { 'content-type': 'text/plain' });
  res.end('No favicon to show');
});

app.get('/', async (req, res) => {
  const heading = 'Movie Catalog';

  const { data: movies } = await axios.get(`${BACK_URL}/peliculas`);

  res.render('panel', { heading, movies });
});


app.get('/agregar', async (req, res) => {
  res.render('agregar');
});

app.post('/agregar', async (req, res) => {
  const { data } = await axios({
    method: 'post',
    url: `${BACK_URL}/peliculas`,
    data: req.body,
  });
  res.redirect('/');
});

app.get('/contacto', (req, res) => {
  res.render('contacto');
});

app.get('/:idModificar', async (req, res) => {
  const { idModificar } = req.params;
  const { data } = await axios.get(`${BACK_URL}/peliculas/${idModificar}`);
  res.render('modificar', data);
});

app.post('/:idModificar', async (req, res) => {
  const { data } = await axios({
    method: 'put',
    url: `${BACK_URL}/peliculas/${req.params.idModificar}`,
    data: req.body,
  });
  res.redirect('/');
});

app.get('/:name?', (req, res) => {
  const name = req.params.name || 'home';

  const title = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  res.render('home', { title });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
