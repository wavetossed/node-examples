// webs - web server example node.js app

// tell node.js about a few modules that we need
// In order to use external modules use require to locate the module and 
// return a reference to the module. The variable can, of course, be any
// name. Call external methods with name.method()

// var isn't strictly needed but it's a good habit to not create global
// variables unless they need to be global 
var http = require('http'); // contains methods for http client and server
var os = require('os'); // some os specific info that we want
var fs = require('fs');  // files and filestreams

// this is fullblown Javascript so lets add a useful method to
// all string objects. This method was borrowed from Prototype
String.prototype.startsWith = function (astring) {
    return this.indexOf(astring, 0) === 0;
  }

// which port and IP address will we listen on. Only requests to this
// address and port will go to our web server
var lport = 8124;
var laddress = "127.0.0.1";

// bad example of how to do things. Should use an HTML template system
// we just build up a string containing a chunk of HTML to insert into
// the web page later. There are 4 method calls to get the inf.
// Note that we never required process above. It is a builtin object
// similar to the way window is builtin when running in the browser
var serverinfo = '<DL><DT>Host:</DT><DD>' + os.hostname() + '</DD>\n' + 
             '<DT>O/S:</DT><DD>' + os.type() + '</DD>\n' + 
             '<DT>O/S Release:</DT><DD>' + os.release() +  '</DD>\n' +
             '<DT>node.js version:</DT><DD>' + process.version + '</DD></DL>\n';

// Again, we just use string concatenation to begin building the HTML page`
var thepage = '<HTML><HEAD><TITLE>node.js Hello World</TITLE>' +
'<STYLE TYPE="text/css">' + 
'dt{font-weight:bolder;float:left;}dd(display:inline;}' +
'</STYLE></HEAD><BODY><H1>' +
'Hello World; node.js running on ';

// Now we make use of our new method defined above on all strings
if (os.type().startsWith("CYGWIN")) {
    thepage += 'Windows</H1>\n\n';
    }
else {
    thepage += os.type() + '</H1>\n\n';
    }
thepage += serverinfo + '\n\n<PRE>\n%TIMESTAMP%\n\n';

// inside the PRE tag we are ging to insert the contents of a text fiile
// We do this by creating a readstream attached to the file. Then we 
// define a funmction to attach to the data event which fires when data is
// available.  And finally we define a function and attach it to the
// end event which is fired at EOF
inp = fs.createReadStream('sample.txt');
inp.setEncoding('utf8');  // good idea to specify encoding for text files
inp.on('data', function (data) {
    thepage += data;
    });
inp.on('end', function (close) {
  thepage += '</PRE></BODY></HTML>\n';

// Note that this is inside the function triggered by the end event on
// the readstream. This is necessary to ensure that the server is not
// started until after the file is read in.
// We create an http server and define a function to be called for
// every incoming request. There are two arguments, one giving us
// all the details of the request, and the second to return the 
// response.
// There is a lot happening here. The defined function is attached
// to the request event of this object and therefore receives all
// requests. The request event creates both a request object and a 
// response object which are passed to the defined function to fill
// in. This response object has a writeHead method that wants an
// http response code and an object containing any headers to return.
// and it has an end method used to signal that the response is complete
// and ready to send back to the server, The end method can also
// specify the data to send back as we did here
// This server will run until killed (with Ctrl-C) and ignores
// the request. It serves the same page every time except
// for the time which is shown in place of %TIMESTAMP%. This is
// just there so that you can reload the page and see that the 
// server really is responding to every request.
http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/html',
                      'Access-Control-Allow-Origin' : '*'
                     });
  response.end(thepage.replace("%TIMESTAMP%",Date().toString()));

// now we close off the web server object that we have just created and call
// its listen method to specify which port and address to listen on.
}).listen(lport,laddress);});

// note the );}); at the end of the line. If this reminds you of the
// parentheses in Scheme or LISP programs, it's because Javascript is
// closely related to these languages and programming in mode.js
// often leverages these features. 

// We report this on the console to show that we have a server running and
// to inform the user what URL to use. Note that this appears as soon
// as the server starts up, and NOT after the server responds with a page.
// console is also a builtin object.
console.log('Server running at http://' + laddress + ':' + lport + '/');


