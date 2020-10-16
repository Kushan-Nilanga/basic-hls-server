const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

// fluent ffmpeg is used to generate the ts files easily. 
// thin layer on top of ffmpeg
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

ffmpeg('src/videos/shaker.mp4').addOption([
    '-profile:v baseline',
    '-level 3.0',
    '-start_number 0',
    '-hls_time 10',
    '-hls_list_size 0',
    '-f hls'
]).output('src/videos/output.m3u8').on('end', ()=> console.log("end")).run();