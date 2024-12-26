const cluster = require('cluster')
const os = require('os')
const express = require('express')
const fs = require('fs')
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// check if the process is the master process
if (cluster.isMaster) {
  // get the number of available cpu cores
  const nCPUs = os.cpus().length;
  // fork worker processes for each available CPU core
  for (let i = 0; i < Math.min(nCPUs, 4); i++) {
    var worker = cluster.fork();
  }
} else {
  // if the process is a worker process listen for requests
  const app = express();
  app.get("/getTimeStamp", (_req, res) => {
    console.log("getTimeStamp");
    return res.send(Date.now().toString());
  })
  app.listen(3000, () => {
    console.log(`worker process ${process.pid} is listening on port 3000`);
  });
}
