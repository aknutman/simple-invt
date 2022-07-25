const { application } = require('express');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
var path = require('path');

const formidable = require('formidable');

const _data = require('./lib/data');

// Base directory of the data folder
app.baseDir = path.join(__dirname, '/.data/images');
app.maxFileSize = 200 * 1024;
app.mimeType = ['image/png', 'image/jpg'];

app.use(express.json());

// Get on root
app.get('/', (req, res) => {
    res.send('Nothing\'s here. Use from frontend instead');
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

                    if (!err && filename !== 'sample.json') {
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
    if (req.params.itemName !== 'sample') {
        _data.read('items', req.params.itemName, (err, parsedData) => {
            if (!err) {
                res.send(parsedData);
            } else {
                res.status(400);
                res.send(`File ${req.params.itemName} is not exist!`);
            }
        })
    } else {
        res.status(400);
        res.send({});
    }
})

// Create a new one
app.post('/api/item/:itemName', (req, res) => {
    if (req.params.itemName !== 'sample') {
        _data.read('items', req.params.itemName, (err) => {
            if (!err) {
                res.status(400);
                res.send(`File ${req.params.itemName} is already exist!`);
            } else {
                _data.create('items', req.params.itemName, req.body, function (err) {
                    if (!err) {
                        res.send(`New created item Name: ${req.params.itemName}`);
                    } else {
                        res.status(500);
                        res.send(`Cannot create new item`);
                    }
                });
            }
        })
    } else {
        res.status(400);
        res.send('Bad name');
    }
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

// Upload file
app.post('/api/upload', (req, res, next) => {
    const form = formidable({ multiples: false, uploadDir: app.baseDir, maxFileSize: app.maxFileSize, });

    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(err.httpCode);
            res.send('File to large');
        }
        else if (app.mimeType.filter(x => x === files.title.mimetype).length === 0) {
            res.status(400);
            res.send('Extension is not allowed');
        }

        res.json({ filename: files.title.newFilename, title: files.title });
    });
});

app.listen(port)
