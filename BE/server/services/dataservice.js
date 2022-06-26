const { MongoClient, ObjectId } = require('mongodb')
const connectionUrl = 'mongodb://localhost:27017'
const dbName = 'Fibernet';
let db;

const init = () =>
    MongoClient.connect(connectionUrl, { useNewUrlParser: true }).then((client) => {
        db = client.db(dbName);
        db.listCollections().toArray().then(collections => {
            if (!collections.some(c => c.name == "tasks")) {
                db.createCollection("tasks", function (err, res) {
                    if (err) throw err;
                });
            }
        });
    });

const getTasks = () => {
    const collection = db.collection('tasks')
    return collection.find({}).toArray()
}

const getTask = (id) => {
    const collection = db.collection('tasks')
    return collection.find({_id : id}).toArray()
}


const insertTask = (item) => {
    const collection = db.collection('tasks');
    delete item.isSelected;
    delete item.isEdit;
    delete item.locked;
    return collection.insertOne(item);
}


const updateTask = (item) => {
    const collection = db.collection('tasks')
    return collection.updateOne({ _id: item._id }, { $set: {
        task: item.task,
        owner: item.owner,
        priority: item.priority,
        dueDate: item.dueDate
    }})
}

const deleteTask = (item) => {
    const collection = db.collection('tasks')
    return collection.deleteOne({ _id: item._id });
}


module.exports = { init, getTask, getTasks, insertTask, updateTask, deleteTask }