const express = require('express');
const app = express();
const port = 80;

const _data = require('./lib/data');

app.use(express.json());

// Get All item
app.get('/api/items', (req, res) => {
    res.send('List of all items')
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
            res.send(`Item ${req.params.itemId} IS NOT EXISTS`);
        }
    })
})

app.listen(port)
