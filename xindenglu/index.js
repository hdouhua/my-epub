import _superagent from 'superagent'
import cheerio from 'cheerio';
import install from 'superagent-charset'
import util from '../util.js'

import fs from 'fs'
import path from 'path'

const superagent = install(_superagent);

function main() {
    superagent
        .get('http://www.daode.org/rdbook/xdl/index.html')
        .charset('gb2312')
        .end(function (err, res) {

            if (err) {
                throw Error(err);
            }

            let $ = cheerio.load(res.text, {
                decodeEntities: false
            });

            let $a = $('table ~table a');
            let pages = [];
            $a.toArray().forEach(a => {
                pages.push([a.attribs.href.replace('.htm', ''), a.children[0].data]);
            });
            console.log(`total ${pages.length}`);
            // console.log(pages);

            // to debug:
            // pages = pages.slice(0, 10);

            let chunkSize = 20;
            let chunk = pages.chunk(chunkSize);
            chunk.map(async (slice) => {
                let x = await xx(slice);
                console.log(`----------- ${x} done.`)
            });

        });
}

function save(page, content) {
    let dir = path.join(__dirname, 'content');
    let filePath = path.join(dir, `${page}.md`);
    fs.writeFile(filePath, content, { encoding: 'utf8' }, function (err) {
        if (err) throw err;
        console.log(`${page} saved`);
    });
}

function parseContent(title, text) {
    let $ = cheerio.load(text, {
        decodeEntities: false
    });
    let
        $content = $('.style15'),
        textChild,
        content = [];

    content.push(`##  ${title}`);
    $content.each((idx, ele) => {
        content.push($(ele).text().trim());
    });

    return content.join('\n\n') + '\n';
}

function getContent([page, title]) {
    return new Promise((resolve, reject) => {
        superagent
            .get(`http://www.daode.org/rdbook/xdl/${page}.htm`)
            .charset('gb2312')
            .end(function (err, res) {
                if (err) {
                    reject(`${page}: ${err}`);
                }

                save(page, parseContent(title, res.text));

                resolve(page);
            });
    });
}

async function xx(pageSlice) {
    return Promise.all(pageSlice.map(getContent))
        .then((items) => {
            console.log(items);
            return items.length;
        }, (err) => {
            console.error('failed @', err);
            return 0;
        });
}

// getContent(['201', '无生无灭　乃为此我']);
// getContent(['101', '佛与人生同一心灯']);

main();
