const http = require('http');
const fs = require('fs');

const port = 3000;

const renderHTML = (path, res) => {
    fs.readFile(path, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.write('Page Not Found');
        } else {
            res.write(data);
        }
        res.end();
    })
}

http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-type': 'text/html',
    })
    const url = req.url;

    try {
        if (url === '/about') {
            renderHTML('./about.html', res);
        } else if (url === '/contact') {
            renderHTML('./contact.html', res);
        } else {
            renderHTML('./index.html', res);
        }
    } catch (error) {
        res.write(error)
        console.error(error);
    }

}).listen(port, () => {
    console.log(`Server is listen on port ${port}`);
})