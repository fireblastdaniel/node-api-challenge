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

router.get('/:id/posts', validateProjectId, (req, res) => {
  const { id } = req.params;
  Projects.getProjectActions(id)
    .then(actionList => res.status(200).json(actionList))
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: 'There was an error retrieving the actions.' });
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

router.delete('/:id', validateProjectId, (req, res) => {
  const { id } = req.params;
  Projects.remove(id)
    .then(deleted =>
      deleted
        ? res.status(200).json(req.project)
        : res.status(400).json({ message: 'No project was deleted' })
    )
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: 'There was an error deleting the project' });
    });
});

router.put('/:id', validateProjectId, (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  Projects.update(id, changes)
    .then(updatedProject =>
      updatedProject
        ? res.status(200).json(updatedProject)
        : res.status(400).json({ message: 'The project was not updated' })
    )
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: 'There was an error updating the project.' });
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
  console.log(res.status);
  next();
}

module.exports = router;
