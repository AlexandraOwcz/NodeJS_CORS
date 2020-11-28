const express = require("express");
const cors = require("cors");
const app = express();

/* -------------------------------------------------------------------------- */

app.get("/no-cors", (req, res) => {
  console.info("GET /no-cors");
  res.json({
    text: "You should not see this via a CORS request."
  });
});

/* -------------------------------------------------------------------------- */
// Cors * - default config - enabled for all origins
/*
{
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false, // Pass the CORS preflight response to the next handler
  "optionsSuccessStatus": 204
}
*/

// HEAD
app.head("/simple-cors", cors(), (req, res) => {
  console.info("HEAD /simple-cors");
  res.sendStatus(204);
});

// GET
app.get("/simple-cors", cors(), (req, res) => {
  console.info("GET /simple-cors");
  res.json({
    text: "Simple CORS requests are working. [GET]"
  });
});

// POST
app.post("/simple-cors", cors(), (req, res) => {
  console.info("POST /simple-cors");
  res.json({
    text: "Simple CORS requests are working. [POST]"
  });
});

// DELETE
app.options("/complex-cors", cors()); // enable pre-flight request for DELETE request
app.delete("/complex-cors", cors(), (req, res) => {
  console.info("DELETE /complex-cors");
  res.json({
    text: "Complex CORS requests are working. [DELETE]"
  });
});

/* -------------------------------------------------------------------------- */
// Exposed headers + credentials
// Access-Control-Allow-Credentials: true
var headersAndCredentials = {
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  credentials: true,
};

app.get('/headers-credentials', cors(headersAndCredentials), function(req, res) {
  console.log(req.cookies);
  res.setHeader('X-Foo', 'bar');
  res.cookie('sessionID', '12345', {
    httpOnly: true,
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
  });
  res.json({ text: "Headers and credentials" });
});

/* -------------------------------------------------------------------------- */
// Whitelist
var whitelist = ['http://localhost:3000', 'http://abc.com']
var whitelistCorsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.get('/whitelist', cors(whitelistCorsOptions), function (req, res, next) {
  res.json({text: 'This is CORS-enabled for a whitelisted domain.'})
})

/* -------------------------------------------------------------------------- */
// Regex
// will accept any request from "http://example.com" or from a subdomain of "example.com"
var corsOptions = {
  origin: /example\.com$/,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
};

app.get('/regex', cors(corsOptions), function (req, res, next) {
  res.json({text: 'Success'});
});


/* -------------------------------------------------------------------------- */

if (!module.parent) {
  const port = process.env.PORT || 3001;

  app.listen(port, () => {
    console.log("Express server listening on port " + port + ".");
  });
}
