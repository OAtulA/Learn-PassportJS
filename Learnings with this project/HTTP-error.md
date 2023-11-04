# Node.js HTTP: ERR_HTTP_HEADERS_SENT

Now this error in my code was caused due to  

```Javascript
if (user !== null) {
    res.status(201).send(user);
    console.log("Newly added user: ", users[users.length - 1])
  }
  res.status(401).send('User name unavailable');
```

## What is wrong with this? You might ask

Well the thing is ```response``` is completely different from the return.  
So the correct code is  below added an else

```Javascript
if (user !== null) {
    res.status(201).send(user);
    console.log("Newly added user: ", users[users.length - 1])
  }
  else res.status(401).send('User name unavailable');
```

## Further from research  

[Blog on Node.js HTTP: ERR_HTTP_HEADERS_SENT](https://blog.airbrake.io/blog/nodejs-error-handling/node-js-err_http_headers_sent)  

I learnt that even this will give errors  

```JS
const http = require('http');

server = http.createServer(function (req, res) {
 res.write('Hello, World!');
 res.setHeader('X-Foo', 'bar');
 res.setHeader('Content-Type', 'text/plain');
 res.end();
})

```  

***ERROR MESSAGE***  

```JS
throw new ERR_HTTP_HEADERS_SENT('set');
```

***Now the valid code is***  

```JS
res.setHeader('X-Foo', 'bar');
res.setHeader('Content-Type', 'text/plain');
res.write('Hello, World!');
```

## For express  

### Invalid code  

```JS
app.get('/', (req, res) => {
 res.send('Hello World!')
 res.setHeader('X-Foo', 'bar')
})
```

### Valid code  

```JS
app.get('/', (req, res) => {
 res.setHeader('X-Foo', 'bar')
 res.send('Hello World!')
})
```
