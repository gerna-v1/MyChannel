var content = document.querySelector('#content.player');
var videoPlayer = document.querySelector('#video-player');
var mainVideo = videoPlayer.querySelector('#main-video');
console.log(mainVideo); 
var progressTime = videoPlayer.querySelector('.progressAreaTime');
var controls = videoPlayer.querySelector('.controls');
var progressArea = videoPlayer.querySelector('.progress-area');
var progressBar = videoPlayer.querySelector(".progress-bar");
var skipPrevious = videoPlayer.querySelector(".skip-previous");
var play_pause = videoPlayer.querySelector(".play-pause");
var skipNext = videoPlayer.querySelector(".skip-next");
var volume = videoPlayer.querySelector(".volume");
var volumeRange = videoPlayer.querySelector("#volume-range");
var current = videoPlayer.querySelector(".current");
var totalDuration = videoPlayer.querySelector(".duration");
var auto_play = videoPlayer.querySelector(".auto-play");
var settings = videoPlayer.querySelector("#settings");
var settingsBtn = videoPlayer.querySelector(".settingsButton");
var playback = videoPlayer.querySelectorAll(".playback li");
var picture_in_picture = videoPlayer.querySelector(".picinpic");
var fullscreen = videoPlayer.querySelector(".fullscreen");

mainVideo.addEventListener("canplay", (e) => {
    console.log("Video cargado");
    mainVideo.volume = 0.5;
    setDuration();
});

if (mainVideo.readyState >= 3) {
    setDuration();
}

mainVideo.addEventListener("timeupdate", (e) => {
    let currentTime = mainVideo.currentTime;
    let currentHours = Math.floor(currentTime / 3600);
    let currentMin = Math.floor((currentTime % 3600) / 60);
    let currentSec = Math.floor(currentTime % 60);

    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    } else {
        currentSec = `${currentSec}`;
    }

    if (currentMin < 10) {
        currentMin = `0${currentMin}`;
    } else {
        currentMin = `${currentMin}`;
    }

    let currentTimeString = currentHours > 0 ? `${currentHours}:${currentMin}:${currentSec}` : `${currentMin}:${currentSec}`;
    current.innerHTML = currentTimeString;

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


skipPrevious.addEventListener("click", playPreviousVideo);

skipNext.addEventListener("click", playNextVideo);

progressArea.addEventListener("pointerdown", (e) => {
    setPosition(e);
    progressArea.addEventListener("pointermove", setPosition);
    progressArea.addEventListener("pointerup", () => {
        progressArea.removeEventListener("pointermove", setPosition);
    });
    progressArea.addEventListener("pointerleave", () => {
        progressArea.removeEventListener("pointermove", setPosition);
    });
});
 

progressArea.addEventListener("mousemove", (e) => {
    let progressValue = progressArea.clientWidth;
    let x = e.offsetX;
    progressTime.style.setProperty("--x", `${x}px`);
    progressTime.style.display = "block";

    let videoDuration = mainVideo.duration;
    let currentProgress = Math.floor((x / progressValue) * videoDuration);
    let currentHours = Math.floor(currentProgress / 3600);
    let currentMin = Math.floor((currentProgress % 3600) / 60);
    let currentSec = Math.floor(currentProgress % 60);

    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    } else {
        currentSec = `${currentSec}`;
    }

    if (currentMin < 10) {
        currentMin = `0${currentMin}`;
    } else {
        currentMin = `${currentMin}`;
    }

    let currentTimeString = currentHours > 0 ? `${currentHours}:${currentMin}:${currentSec}` : `${currentMin}:${currentSec}`;
    progressTime.innerHTML = currentTimeString;
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

mainVideo.addEventListener("ended", playNextVideo);

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

playback.forEach((event)=> {
    event.addEventListener('click', () => {
        remoteActiveClasses();
        event.classList.add("active");
        let speed = event.getAttribute('data-speed');
        mainVideo.playbackRate = speed;
    });
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

settingsBtn.addEventListener("click", changeSettings)

volumeRange.addEventListener("change", changeVolume);

volume.addEventListener("click", muteVolume);

