const express = require('express');

const Projects = require('../data/helpers/projectModel');
const router = express.Router();

router.get('/', (req, res) => {
  Projects.get()
    .then(projectsList => {
      res.status(200).json(projectsList);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: 'There was an error retrieving the projects.' });
    });
});

router.post('/', validateProject, (req, res) => {
  const project = req.body;
  Projects.insert(project)
    .then(newProject => res.status(200).json(newProject))
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: 'There was an error adding the project.' });
    });
});

// middleware

function validateProject(req, res, next) {
  const project = req.body;
  !project ? res.status(400).json({ message: 'missing project data' }) : null;
  !project.name
    ? res.status(400).json({ message: 'project missing required field: name' })
    : null;
  !project.description
    ? res
        .status(400)
        .json({ message: 'project missing required field: description' })
    : null;
  next();
}

module.exports = router;
