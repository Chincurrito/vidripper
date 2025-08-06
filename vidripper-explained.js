var target = document.querySelector('video') // Find the target video
if (!target) {
    alert('No video detected.')
}
var chunks = []
var controlpanel = document.createElement('div')
var recorder = ''
var amountRecorded = 0
document.body.appendChild(controlpanel)
target.style.border = '5px solid red' // highlight targeted video in red
// css attributes for control panel
controlpanel.style.height = '150px'
controlpanel.style.border = '3px solid black'
controlpanel.style.width = '400px'
controlpanel.style.backgroundColor = 'white'
controlpanel.style.position = 'fixed'
controlpanel.style.bottom = '0%'
controlpanel.style.left = '0%'
controlpanel.style.zIndex = 30
controlpanel.style.paddingLeft = '10px'
controlpanel.style.paddingTop = '10px'
controlpanel.innerHTML = '<span style = "font-size:8px;line-height:6px;display:block">██╗░░░██╗██╗██████╗░██████╗░██╗██████╗░██████╗░███████╗██████╗░\n██║░░░██║██║██╔══██╗██╔══██╗██║██╔══██╗██╔══██╗██╔════╝██╔══██╗\n╚██╗░██╔╝██║██║░░██║██████╔╝██║██████╔╝██████╔╝█████╗░░██████╔╝\n░╚████╔╝░██║██║░░██║██╔══██╗██║██╔═══╝░██╔═══╝░██╔══╝░░██╔══██╗\n░░╚██╔╝░░██║██████╔╝██║░░██║██║██║░░░░░██║░░░░░███████╗██║░░██║\n░░░╚═╝░░░╚═╝╚═════╝░╚═╝░░╚═╝╚═╝╚═╝░░░░░╚═╝░░░░░╚══════╝╚═╝░░╚═╝\n</span>' // fancy title
controlpanel.innerHTML += '<br><p><button id = "startBtn1234">start recording</button><button id = "downloadBtn1234">stop / download</button></p><p><span id ="duration"></span><span id = "sizeDisp"></span></p> '// other html bits
document.getElementById("startBtn1234").addEventListener('click',function () {getStream()}) // listeners
document.getElementById("downloadBtn1234").addEventListener('click',function () {download()})
update()
function getStream() {
    // This function grabs the data output from the video using the built-in mediarecorder API. 
    var stream = ''
    if (navigator.userAgent.includes('Firefox')){
        stream = target.mozCaptureStream(60) // Firefox browser uses mozCaptureStream instead of captureStream(). Need to account for this!
    }
    else {
        stream = target.captureStream(60)
    }
    recorder = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp9', bitsPerSecond: 1000000}) // create the media recorder
    recorder.addEventListener('dataavailable',function (e) {
        chunks.push(e.data) // when we get new data, push it into this list.
        amountRecorded++;
        update()
    })
    recorder.start(100) // 100 means that it will output new recorded data 10 times a second (every 100 ms)
}
function update () {
    document.getElementById("duration").innerHTML = amountRecorded/10 + ' seconds recorded. ' // show time recorded
    let totalsize = 0; // Calculate recording size. Blobs are stored in RAM, so the upper limit for how much you can record is somewhere around the amount of RAM you have. 
    for (i=0;i<chunks.length;i++){
        totalsize += chunks[i].size
    }
    document.getElementById("sizeDisp").innerHTML = ' File size: '+totalsize / 1000000 + 'MB.' 
}
function download () {
    recorder.pause() // stop recording
    var dataPackage = new Blob(chunks,{type:'video/webm'}) // zip everything stored in chunks into one file
    if (chunks.length = 0){
        alert('No data to download.')
        return;
    }
    setTimeout(function () {
        recorder = '' // delete the mediaRecorder. For some reason, media recorders are not tolerant of pause / unpausing, so we need to delete it and make a new one. 
        var url = window.URL.createObjectURL(dataPackage) // make a download link
        var a = document.createElement('a')
        console.log(chunks)
        a.href = url
        a.setAttribute('download',document.title) // sets the filename to the webpage title.
        a.click() // download the file
        chunks = [] // reset
        amountRecorded = 0
        update()
    },200) // this setTimeout is to give the JS a little time to process the video data. 
}
