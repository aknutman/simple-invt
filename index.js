const { application } = require('express');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const _data = require('./lib/data');

app.use(express.json());

// Get on root
app.get('/', (req, res) => {
    res.send('Nothing is here. Use from frontend instead');
})

// Get All item
app.get('/api/items', (req, res) => {
    _data.readAll('items', (err, filenames) => {
        if (!err) {
            let result = [];
            let counter = 0;

            filenames.forEach((filename, index, array) => {

                _data.read('items', filename.replace('.json', ''), (err, parsedData) => {
                    counter++;

                    if (!err) {
                        result.push({
                            filename: filename,
                            data: parsedData
                        });
                    }

                    if (counter === array.length) {
                        res.send(result);
                    }
                });
            });

        } else {
            res.status(500);
            res.send(`Cannot get the items!`);
        }
    })
})

// Get per item
app.get('/api/item/:itemName', (req, res) => {
    _data.read('items', req.params.itemName, (err, parsedData) => {
        if (!err) {
            res.send(parsedData);
        } else {
            res.status(400);
            res.send(`File ${req.params.itemName} is not exist!`);
        }
    })
})

// Create a new one
app.post('/api/item/:itemName', (req, res) => {
    _data.read('items', req.params.itemName, (err) => {
        if (!err) {
            res.status(400);
            res.send(`File ${req.params.itemName} is already exist!`);
        } else {
            _data.create('items', req.params.itemName, req.body, function (err) {
                if (!err) {
                    res.send(`New created item ID: ${req.params.itemName}`);
                } else {
                    res.status(500);
                    res.send(`Cannot create new item`);
                }
            });
        }
    })
})

// Update one item
app.put('/api/item/:itemName', (req, res) => {
    _data.read('items', req.params.itemName, (err) => {
        if (!err) {
            _data.update('items', req.params.itemName, req.body, (err) => {
                if (!err) {
                    res.send(`Item ${req.params.itemName} has been updated`);
                }
                else {
                    res.status(500)
                    res.send(`Cannot update item with id: ${req.params.itemName}`);
                }
            })
        }
        else {
            res.status(400);
            res.send(`Item ${req.params.itemName} IS NOT EXISTS`);
        }
    })
})

// Delete one item
app.delete('/api/item/:itemName', (req, res) => {
    _data.read('items', req.params.itemName, (err) => {
        if (!err) {
            _data.delete('items', req.params.itemName, (err) => {
                if (!err) {
                    res.send(`Item ${req.params.itemName} has been deleted`);
                }
                else {
                    res.status(500)
                    res.send(`Cannot delete item with id: ${req.params.itemName}`);
                }
            })
        }
        else {
            res.status(400);
            res.send(`Item ${req.params.itemName} IS NOT EXISTS`);
        }
    })
})

app.listen(port)
