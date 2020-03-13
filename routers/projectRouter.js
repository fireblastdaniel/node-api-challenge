const express = require('express');

const Projects = require('../data/helpers/projectModel');
const Actions = require('../data/helpers/actionModel');
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

router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project);
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

router.post('/:id/posts', validateProjectId, validateAction, (req, res) => {
  const action = req.body;
  Actions.insert(action)
    .then(action => res.status(200).json(action))
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: 'There was an error adding the action.' });
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

function validateProjectId(req, res, next) {
  const { id } = req.params;
  Projects.get(id)
    .then(project => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(400).json({ message: 'invalid project id' });
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: 'There was an error retrieving the project.' });
    });
}

function validateAction(req, res, next) {
  const action = req.body;
  const { id } = req.params;
  console.log(action);
  !action ? res.status(400).json({ message: 'missing action data' }) : null;
  !action.project_id
    ? res.status(400).json({ message: 'missing required field: project_id' })
    : null;
  action.project_id !== id
    ? res
        .status(400)
        .json({ message: 'project_id does not match id in post request' })
    : null;
  !action.description
    ? res.status(400).json({ message: 'missing required field: description' })
    : null;
  action.description.length > 128
    ? res
        .status(400)
        .json({ message: 'description may not be longer than 128 characters' })
    : null;
  !action.notes
    ? res.status(400).json({ message: 'missing required field: notes' })
    : null;
  next();
}

module.exports = router;
