const path = require("path");
const urls = require(path.resolve("src/data/urls-data"));
const uses = require(path.resolve("src/data/uses-data"));

function create(req, res) {
  const { data: { href } = {} } = req.body;
  const newUrl = {
    id: urls.length + 1,
    href,
  };
  urls.push(newUrl);
  res.status(201).json({ data: newUrl });
}

function hasUrl(req, res, next) {
  const { data: { href } = {} } = req.body;
  href
    ? next()
    : next({ status: 400, message: "A 'href' property is required." });
}

function list(req, res) {
  res.json({ data: urls });
}

function urlExists(req, res, next) {
  const { urlId } = req.params;
  const foundUrl = urls.find((url) => url.id === Number(urlId));
  if (foundUrl) {
    res.locals.url = foundUrl;
    next();
  } else {
    next({
      status: 404,
      message: `Url id not found ${urlId}`,
    });
  }
}

function read(req, res) {
  let lastUseId = uses.reduce((maxId, use) => Math.max(maxId, use.id), 0) + 1;
  uses.push({
    id: lastUseId,
    urlId: Number(req.params.urlId),
    time: Date.now(),
  });
  res.json({ data: res.locals.url });
}

function update(req, res) {
  const { data: { href } = {} } = req.body;
  const url = res.locals.url;
  if (url.href !== href) {
    url.href = href;
  }
  res.json({ data: url });
}

module.exports = {
  create: [hasUrl, create],
  list,
  read: [urlExists, read],
  update: [urlExists, hasUrl, update],
  urlExists,
};
