var express = require('express');
var router = express.Router();
const { getTask, getTasks, insertTask, updateTask, deleteTask } = require('../services/dataservice')

router.get('/', async function(req, res, next) {
  try{
    var items = await getTasks();
    res.json(items);
  }
  catch(err){
    next(err);
  }
});

router.post('/add', async function(req, res, next) {
  try{
    var response = await insertTask(req.body);
    var task = await getTask(response.insertedId);
    res.json(task[0]);
  }
  catch(err){
    next(err);
  }
});

router.post('/update', async function(req, res, next) {
  try{
    var response = await updateTask(req.body);
    res.json(response && response.modifiedCount == 1 ? req.body : null);
  }
  catch(err){
    next(err);
  }
});

router.post('/delete', async function(req, res, next) {
  try{
    var response = await deleteTask(req.body);
    console.log(response);
    res.json(response && response.deletedCount == 1 ? req.body : null);
  }
  catch(err){
    next(err);
  }
});


module.exports = router;