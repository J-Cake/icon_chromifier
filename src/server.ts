import fs from 'fs';
import path from 'path';
import request from 'request';
import express from 'express';

const app = express();

const root = path.join(process.cwd(), './public/app');

app.get('/', function (req: express.Request, res: express.Response) {
    res.header('content-type', 'text/html');
    res.end(fs.readFileSync(path.join(root, 'index.html'), 'utf8'));
});

app.get('/app/build/src.min.js', function (req: express.Request, res: express.Response) {
    res.header('content-type', 'text/javascript');
    res.end(fs.readFileSync(path.join(root, 'build/src.min.js'), 'utf8'));
});

app.get('/images', function (req: express.Request, res: express.Response) {
    if (req.query.url) {
        const url: string = decodeURIComponent(req.query.url as string);

        request(url).pipe(res);

        // request({url, resolveWithFullResponse: true}).then(function (_: http.IncomingMessage) {
        //     if (/image\/.+/.test((_.headers)["content-type"])) {
        //         res.header('content-type', _.headers['content-type']);
        //         res.header('content-length', _.headers['content-length']);
        //
        //         // @ts-ignore
        //         res.end(_.body, 'binary');
        //     } else {
        //         console.log('help')
        //     }
        // });
    } else {
        res.status(400);
        res.end('Required URL parameter was not provided or invalid');
    }
});

app.listen(1920);