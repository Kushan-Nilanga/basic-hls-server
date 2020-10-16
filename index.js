const app = require('express')();
const fs = require('fs');
const hls = require('hls-server');

// handling cors requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

// frontend of the application
app.get('/', (req, res)=>{
    return res.status(200).sendFile(`${__dirname}/client.html`)
});

const server = app.listen(3000);

// HLS server. 
// HTTP middleware to serve HLS content
// 
new hls(server, {
    provider:{

        // checks for exictance of files and validity of requests
        exists: (req, cb) => {
            const ext = req.url.split('.').pop();

            // is the request looking for manifest or actual resource
            if(ext !== 'm3u8' || ext !== 'ts'){
                return cb(null, true);
            }

            // does the requested file exist
            fs.access(__dirname + req.url, fs.constants.F_OK, function(err){
                if(err){
                    console.log('file does not exist');
                    return cb(null, false);
                }
            });
        },

        // if manifest is requested return the manifest
        getManifestStream: (req, cb) =>{ 
            console.log('manifest requested')
            const stream =  fs.createReadStream(__dirname + req.url);
            // return error(null) and manifest stream
            return cb(null, stream);
        },

        // if a video segement is requested return the segement
        getSegmentStream: (req, cb) => {
            console.log('reading '+req.url);
            const stream = fs.createReadStream(__dirname + req.url);
            // return error(null) and segement stream
            return cb(null, stream);
        }
    }
});