// webs - web server example node.js app

var http = require('http'); 
var os = require('os'); 
var fs = require('fs');  

String.prototype.startsWith = function (astring) {
    return this.indexOf(astring, 0) === 0;
  }

var lport = 8124;
var laddress = "127.0.0.1";

var serverinfo = '<DL><DT>Host:</DT><DD>' + os.hostname() + '</DD>\n' + 
             '<DT>O/S:</DT><DD>' + os.type() + '</DD>\n' + 
             '<DT>O/S Release:</DT><DD>' + os.release() +  '</DD>\n' +
             '<DT>node.js version:</DT><DD>' + process.version + '</DD></DL>\n';

var thepage = '<HTML><HEAD><TITLE>node.js Hello World</TITLE>' +
'<STYLE TYPE="text/css">' + 
'dt{font-weight:bolder;float:left;}dd(display:inline;}' +
'</STYLE></HEAD><BODY><H1>' +
'Hello World; node.js running on ';

if (os.type().startsWith("CYGWIN")) {
    thepage += 'Windows</H1>\n\n';
    }
else {
    thepage += os.type() + '</H1>\n\n';
    }
thepage += serverinfo + '\n\n<PRE>\n%TIMESTAMP%\n\n';

inp = fs.createReadStream('sample.txt');
inp.setEncoding('utf8');  
inp.on('data', function (data) {
    thepage += data;
    });
inp.on('end', function (close) {
  thepage += '</PRE></BODY></HTML>\n';

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/html',
                      'Access-Control-Allow-Origin' : '*'
                     });
  response.end(thepage.replace("%TIMESTAMP%",Date().toString()));
}).listen(lport,laddress);});

console.log('Server running at http://' + laddress + ':' + lport + '/');


