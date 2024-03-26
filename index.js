const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'GET' && parsedUrl.pathname === '/api/data') {
        fs.readFile('data.json', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } else if (req.method === 'POST' && parsedUrl.pathname === '/api/data') {
        let body = '';
        let i=0;
        req.on('data', (chunk) => {
            body += chunk;
            console.log(`${i++}th iteration:`+body);
        });
        req.on('end', () => {
            const newData = JSON.parse(body);
            console.log(newData);
            fs.readFile('data.json', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                    return;
                }
                const jsonData = JSON.parse(data);
                console.log(jsonData);
                jsonData.users.push(newData);
                fs.writeFile('data.json', JSON.stringify(jsonData), (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        return;
                    }
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(jsonData));
                });
            });
        });
    } else if (req.method === 'DELETE' && parsedUrl.pathname === '/api/data') {
        fs.unlink('data.json', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }
            res.writeHead(204);
            res.end();
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
