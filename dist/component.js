var videoPlayer = document.querySelector('#video-player');
var mainVideo = videoPlayer.querySelector('#main-video');
console.log(mainVideo); 
var progressTime = videoPlayer.querySelector('.progressAreaTime');
var controls = videoPlayer.querySelector('.controls');
var progressArea = videoPlayer.querySelector('.progress-area');
var progressBar = videoPlayer.querySelector(".progress-bar");
var fastRewind = videoPlayer.querySelector(".fast-rewind");
var play_pause = videoPlayer.querySelector(".play-pause");
var fastForward = videoPlayer.querySelector(".fast-forward");
var volume = videoPlayer.querySelector(".volume");
var volumeRange = videoPlayer.querySelector("#volume-range");
var current = videoPlayer.querySelector(".current");
var totalDuration = videoPlayer.querySelector(".duration");
var auto_play = videoPlayer.querySelector(".auto-play");
var settingsBtn = videoPlayer.querySelector(".settingsButton");
var picture_in_picture = videoPlayer.querySelector(".picinpic");
var fullscreen = videoPlayer.querySelector(".fullscreen");
var settings = videoPlayer.querySelector("#settings");
var layback = videoPlayer.querySelectorAll(".playback");

mainVideo.addEventListener("canplay", (e) => {
    console.log("Video cargado");
    setDuration();
});

if (mainVideo.readyState >= 3) {
    setDuration();
}

mainVideo.addEventListener("timeupdate", (e) => {
    let currentTime = mainVideo.currentTime;
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);

    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    } else {
        currentSec = `${currentSec}`;
    }

    current.innerHTML = `${currentMin}:${currentSec}`;

    console.log(`Time = ${currentTime}`);
    let videoDuration = e.target.duration;

    let progressWidth = (currentTime / videoDuration) * 100;

    progressBar.style.width = `${progressWidth}%`;
});

play_pause.addEventListener("click", () => {
    const pausedVideo = videoPlayer.classList.contains("pause");

    if (pausedVideo) {
        pauseVideo();
    } else {
        playVideo();
    }
});

fastRewind.addEventListener("click", () => {
    mainVideo.currentTime -= 10;
});

fastForward.addEventListener("click", () => {
    mainVideo.currentTime += 10;
});

progressArea.addEventListener("click", (e) => {
    let videoDuration = mainVideo.duration;
    let progressValue = progressArea.clientWidth;
    let clickOffsetX = e.offsetX;

    if (isFinite(videoDuration) && isFinite(progressValue) && isFinite(clickOffsetX)) {
        mainVideo.currentTime = (clickOffsetX / progressValue) * videoDuration;
    } else {
        console.error("Invalid value detected: ", { videoDuration, progressValue, clickOffsetX });
    }
});

progressArea.addEventListener("mousemove", (e) => {
    let progressValue = progressArea.clientWidth;
    let x = e.offsetX;
    progressTime.style.setProperty("--x", `${x}px`);
    progressTime.style.display = "block";

    let videoDuration = mainVideo.duration;
    let currentProgress = Math.floor((x / progressValue) * videoDuration);
    let currentMin = Math.floor(currentProgress / 60);
    let currentSec = Math.floor(currentProgress % 60);

    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    } else {
        currentSec = `${currentSec}`;
    }

    progressTime.innerHTML = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("mouseleave", () => {
    progressTime.style.display = "none";
});

auto_play.addEventListener("click", () => {
    auto_play.classList.toggle("active");

    if (auto_play.classList.contains("active")) {
        auto_play.title = "Autoreproducción encendida";
    } else {
        auto_play.title = "Autoreproducción apagada";
    }
});

if ('requestPictureInPicture' in HTMLVideoElement.prototype) {
    picture_in_picture.addEventListener("click", async () => {
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                await mainVideo.requestPictureInPicture();
            }
        } catch (error) {
            console.error("Failed to enter Picture-in-Picture mode:", error);
        }
    });
} else {
    picture_in_picture.title = "Picture-in-Picture no está disponible en tu dispositivo.";
    console.log("Picture-in-Picture API is not supported.");
}

fullscreen.addEventListener("click", () => {
    if (!videoPlayer.classList.contains("openFullScreen")) {
        videoPlayer.classList.add("openFullScreen");
        fullscreen.innerHTML = "fullscreen_exit";
        fullscreen.title = "Salir de pantalla completa";
        videoPlayer.requestFullscreen();
    } else {
        videoPlayer.classList.remove("openFullScreen");
        fullscreen.innerHTML = "fullscreen";
        document.exitFullscreen();
    }
});
//
//mainVideo.addEventListener("ended", () => {
//    if (auto_play.classList.contains("active")) {
//        playVideo(); // Make this play the next video, instead
//    } else {
//        play_pause.innerHTML = "replay";
//        play_pause.title = "Repetir";
//    }
//});
//
volumeRange.addEventListener("change", changeVolume);

volume.addEventListener("click", muteVolume);

