const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

const listImages = (folderPath) => {
    return new Promise((resolve, reject) => {
        //folderPath = 'Images/' + folderName
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                return reject('Unable to retrieve files');
            }

            const fileInfo = files.map(file => {
                return {
                    name: file,
                    //url: 'http://localhost:' + port + '/Images/' + folderPath + '/' + file
                    //url: 'Images/' + path.basename(folderPath) + '/' + file
                    url: 'http://localhost:' + port + '/' + folderPath + '\\' + file
                };
            });

            resolve(fileInfo);
        });
    });
};

app.get('/Images/:folder', async (req, res) => {
    const folderName = req.params.folder;
    const folderPath = path.join('Images', folderName);

    try {
        const images = await listImages(folderPath);
        res.status(200).send(images);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.use('/Images', express.static(path.join(__dirname, 'Images')))

app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port)
});