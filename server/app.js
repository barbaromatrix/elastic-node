const Koa = require('koa');
const Router = require('koa-router');
const joi = require('joi');;
const validate = require('koa-joi-validate');
const search = require('./search');

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000;


app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// Log percolated errors to the ocnsole
app.on('error', err => console.log(`Error: ${err}`));

// Set permissive CORS header
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  return next();
});

/**
 * GET /search
 * Search for a term in the library
 */
router.get('/search', async (ctx, next) => {
  const { term, offset } = ctx.request.query;

  ctx.body = await search.queryTerm(term, offset);
});

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port, err => {
    if (err) console.error(err);

    console.log(`App Listening on Port ${port}`);
  });