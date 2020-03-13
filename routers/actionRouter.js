const express = require('express');

const Actions = require('../data/helpers/actionModel');
const router = express.Router();

router.get('/', (req, res) => {
  Actions.get()
    .then(actionsList => {
      res.status(200).json(actionsList);
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: 'There was an error retrieving the user data.' });
    });
});

router.get('/:id', validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

router.put('/:id', validateActionId, (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  Actions.update(id, changes)
    .then(updatedAction =>
      updatedAction
        ? res.status(200).json(updatedAction)
        : res.status(400).json({ message: 'Unable to update the action' })
    )
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: 'There was an error updating the action.' });
    });
});

function validateActionId(req, res, next) {
  const { id } = req.params;
  Actions.get(id)
    .then(action => {
      if (action) {
        req.action = action;
        next();
      } else {
        res.status(400).json({ message: 'invalid action id' });
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: 'There was an error retrieving the user' });
    });
}

module.exports = router;
