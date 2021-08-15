const path = require("path");
const uses = require(path.resolve("src/data/uses-data"));

function list(req, res) {
  const { urlId } = req.params;
  const byResult = urlId ? (uses) => uses.urlId === Number(urlId) : () => true;
  res.json({ data: uses.filter(byResult) });
}

function destroy(req, res) {
  const { useId } = req.params;
  const index = uses.findIndex((use) => use.id === Number(useId));
  if (index > -1) {
    uses.splice(index, 1);
  }
  res.sendStatus(204);
}

function useExists(req, res, next) {
  const { useId } = req.params;
  const foundUse = uses.find((use) => use.id === Number(useId));
  if (foundUse) {
    res.locals.use = foundUse;
    next();
  } else {
    next({
      status: 404,
      message: `Use id not found ${useId}`,
    });
  }
}

function read(req, res) {
  res.json({ data: res.locals.use });
}

module.exports = {
  list,
  read: [useExists, read],
  delete: [useExists, destroy],
};
