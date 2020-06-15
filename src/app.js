const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepo);

  return response.json(newRepo);
});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository Not Found" });
  }

  const repo = {
    ...repositories[repoIndex],
    title,
    url,
    techs,
  };

  repositories[repoIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository Not Found" });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository Not Found" });
  }

  repositories[repoIndex].likes = repositories[repoIndex].likes + 1;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
