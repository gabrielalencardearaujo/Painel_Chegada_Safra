const http = require('http')
const path = require('path')
const fs = require('fs')
const indexPage = path.resolve(__dirname, 'index.html')

const server = http.createServer(function (req, res) {
  if (req.url === '/') {
    const filePath = '/home/gabriel/Documentos/TRABALHO/Painel_de_Chegada/public/index.html';
    const cssPath = '/home/gabriel/Documentos/TRABALHO/Painel_de_Chegada/src/assets/css/style.css';

    fs.readFile(filePath, 'utf-8', function (err, html) {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading ${filePath}`);
      } else {
        fs.readFile(cssPath, 'utf-8', function (err, css) {
          if (err) {
            res.writeHead(500);
            res.end(`Error loading ${cssPath}`);
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(`<style>${css}</style>`);
            res.write(html);
            res.end();
          }
        });
      }
    });
  } else if (req.url === '/cadastro.html') {
    const filePath = '/home/gabriel/Documentos/TRABALHO/Painel_de_Chegada/public/cadastro.html';
    const cssPath = '/home/gabriel/Documentos/TRABALHO/Painel_de_Chegada/src/assets/css/style.css';

    fs.readFile(filePath, 'utf-8', function (err, html) {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading ${filePath}`);
      } else {
        fs.readFile(cssPath, 'utf-8', function (err, css) {
          if (err) {
            res.writeHead(500);
            res.end(`Error loading ${cssPath}`);
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(`<style>${css}</style>`);
            res.write(html);
            res.end();
          }
        });
      }
    });
  } else {
    res.writeHead(404);
    res.end('Page not found');
  }
})

server.listen(3000, 'localhost', () => {
  console.log('Servidor de pe em: http://localhost:3000')
  console.log(('Derrubar o servidor: CTRL + C'))
})