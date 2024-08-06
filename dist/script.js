const videos = [ // Missing a function that will read all files inside a folder, then create appropiate objects for each video
    {
        "imageUrl": "/bucket/thumb/OMORI-Trailer4.jpg",
        "videoUrl": "/bucket/videos/OMORI-Trailer4.mp4",
        "title": "Video of a spinning earth",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Nullam nec purus nec nunc tincidunt ultricies. Nullam nec purus nec nunc tincidunt ultricies.",
        "commentbox": {
            "username": "user4",
            "comment": "This isn't not a comment",
            "likes": 0
        }
    }
]

const database = new Map();

var darkMode = false;
var openBox = false;
var lastButton;
var videoCount = 0;

var currentUser;


document.addEventListener("DOMContentLoaded", () => {
    generateVideoGrid(videos);
});

const toggleBox = (button) => {

    if (openBox && lastButton !== button) {
        lastButton.nextElementSibling.classList.toggle('show');
    }
    
    let box = button.nextElementSibling;
    box.classList.toggle('show');  

    lastButton = button;

    openBox = box.classList.contains('show');

    // console.log(`La caja esta ${openBox ? 'abierta' : 'cerrada'}`);
}

const playerComponent = (video) => {
    let div = document.querySelector('#content');
    div.classList.toggle('player');

    div.innerHTML = `
    <div class="player-container">
        <div id="video-player">
            <video src="${video.videoUrl}" type="video/mp4" id="main-video" style="justify-content: center; align-items: center;">           
                Your browser does not support the video tag.           
            </video>

            <div class="progressAreaTime">0:00</div>
            
            <div class="controls">
                <div class="progress-area">
                    <div class="progress-bar"></div>
                    <span></span>
                </div>                

                <div class="controls-list">
                    <div class="controls-left">
                        <span class="icon">
                            <i class="material-symbols-outlined fast-rewind">replay_10</i>
                        </span>
                        <span class="icon">
                            <i class="material-symbols-outlined play-pause">play_arrow</i>
                        </span>
                        <span class="icon">
                            <i class="material-symbols-outlined fast-forward">forward_10</i>
                        </span>
                        <span class="icon">
                            <i class="material-symbols-outlined volume">volume_up</i>
                            <input type="range" min="0" max="100" id="volume-range">
                        </span>
                        <div class="timer">
                            <span class="current">00:00</span> / <span class="duration">00:00</span>
                        </div>
                    </div>
                    <div class="controls-right">
                        <span class="icon">
                            <i class="material-symbols-outlined auto-play"></i>
                        </span>
                        <span class="icon">
                            <i class="material-symbols-outlined settingsButton">settings</i>
                        </span>
                        <span class="icon">
                            <i class="material-symbols-outlined picinpic">picture_in_picture_alt</i>
                        </span>
                        <span class="icon">
                            <i class="material-symbols-outlined fullscreen">fullscreen</i>
                        </span>
                    </div>
                </div>

                <div id="settings">
                    <div class="playback">
                        <span>Velocidad de reproduccion</span>
                        <ul>
                            <li data-speed="0.25">0.25</li>
                            <li data-speed="0.5">0.5</li>
                            <li data-speed="0.75">0.75</li>
                            <li data-speed="1" class="active">Normal</li>
                            <li data-speed="1.25">1.25</li>
                            <li data-speed="1.5">1.5</li>
                            <li data-speed="1.75">1.75</li>
                            <li data-speed="2">2x</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <script src="component.js"></script>
`;

    let existingLink = document.querySelector('link[href="component.css"]');
    if (existingLink) {
        let newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = 'component.css';
        document.head.replaceChild(newLink, existingLink);
    } else {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'component.css';
        document.head.appendChild(link);
    }

    let existingScript = document.querySelector('#content').querySelector('script[src="component.js"]');
    if (existingScript) {
        let newScript = document.createElement('script');
        newScript.src = 'component.js';
        document.querySelector('#content').replaceChild(newScript, existingScript);
    } else {
        let script = document.createElement('script');
        script.src = 'component.js';
        document.querySelector('#content').appendChild(script);
    }

    videoCount = 0;
}

const switchMode = () => {
    let logo = document.getElementById('logo');
    let button = document.querySelector('#darkbutton');
    let body = document.querySelector('body');
    let header = document.querySelector('#header');
    let search = document.querySelector('.search');
    let videos = document.querySelectorAll('.video');
    let buttons = document.querySelectorAll('button');
    let boxes = document.querySelectorAll('.box');

    const dark_background = 'var(--dark_bg)';
    const light_background = 'var(--light_bg)';

    if (button.innerHTML == 'dark_mode') {
        darkMode = true;
        button.innerHTML = 'light_mode';
        body.style.backgroundImage = dark_background;
        body.style.color = 'white';
        logo.src = '/img/mychannel_dark.png';
        header.classList.replace("bg-gray-100", "bg-neutral-800"); 
        search.style.backgroundColor = 'var(--searchcolor_dark)';
        videos.forEach(video => {
            video.style.backgroundColor = 'rgba(50, 50, 50, 0.8)';
            video.querySelector('.thumbn').classList.replace("bg-gray-100", "bg-neutral-700");
            video.style.color = 'white';
        });
        buttons.forEach(button => {
            button.classList.replace("text-gray-700", "text-gray-50");
            button.classList.replace("hover:text-gray-950", "hover:text-gray-400")
        });

        boxes.forEach(box => {
            box.classList.replace("bg-gray-50", "bg-neutral-700");
            box.classList.replace("border-gray-300", "border-neutral-950");
        });

        // document.querySelector('#metadata').style.backgroundColor = 'rgba(50, 50, 50, 0.8)'; BUENISIMO PARA DEBUGEAR EL BORDE, CHEQUEAR LUEGO
    } else {
        button.innerHTML = 'dark_mode';
        darkMode = false;
        body.style.backgroundImage = light_background;
        body.style.color = 'black';
        logo.src = '/img/mychannel_light.png';
        header.classList.replace("bg-neutral-800", "bg-gray-100");
        search.style.backgroundColor = 'var(--searchcolor)';
        videos.forEach(video => {
            video.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            video.querySelector('.thumbn').classList.replace("bg-neutral-700", "bg-gray-100");;
            video.style.color = 'black';
        });
        buttons.forEach(button => {
            button.classList.replace("text-gray-50", "text-gray-700");         
            button.classList.replace("hover:text-gray-400", "hover:text-gray-950")
        });

        boxes.forEach(box => {
            box.classList.replace("bg-neutral-700", "bg-gray-50");
            box.classList.replace("border-neutral-950", "border-gray-300");
        });
    }
}

const openVideo = (index) => {
    playerComponent(videos[index]);
}

const generateVideoGrid = (videos) => {
    let div = document.querySelector('#content');
    let containerDiv = div.querySelector('.container.mx-auto');

    if (!containerDiv) {
        containerDiv = document.createElement('div');
        containerDiv.className = 'container mx-auto w-auto';
        div.innerHTML = ''; 
        div.appendChild(containerDiv);
    }

    let gridHtml = '';

    if (containerDiv.innerHTML.trim() === '') {
        gridHtml = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 justify-items-center">';
    }

    darkMode ? bgColor = 'rgba(50, 50, 50, 0.8)' : bgColor = 'rgba(255, 255, 255, 0.8)'; 
    darkMode ? colorClass = "bg-neutral-700" : colorClass = "bg-gray-100";

    videos.forEach((video, index) => {

        if (video.description.length > 69){
            description = video.description.substring(0, 69) + '...';
        }
        else {
            description = video.description;
        }

        gridHtml += `
            <div class="video flex flex-col items-center" style="background-color: ${bgColor}"   >
                <button class="flex justify-center items-center w-full h-48" onClick="openVideo(${index})">
                    <img src="${video.imageUrl}" alt="Image" class="thumbn w-full h-full object-contain ${colorClass}">
                </button>
                <div class="p-4 h-1/6 w-full text-left">
                    <h2 class="font-bold text-xl">VIDEO ${videoCount + 1}</h2>
                    <p class="text-gray-700">${description}</p>
                </div>
            </div>
        `;

        videoCount++;
    });

    gridHtml += '</div>';

    if (containerDiv.innerHTML.trim() === '') {
        containerDiv.innerHTML = gridHtml;
    } else {
        containerDiv.querySelector('.grid').innerHTML += gridHtml;
    };
}

const getUser = () => {
    
    if(currentUser == null || currentUser == undefined)
    {
        console.log(currentUser);
        
        return "No has iniciado sesión";
    }
    else {
        return currentUser;
    }

}

const changeLogin = (user) => {
    currentUser = String(user);

    let header = document.getElementById('login_header');

    header.innerHTML = `Usuario actual: ${currentUser}`
}

const login = () => {
    let user = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let errorBox = document.querySelector("#error");
    let errorMessage = '';
    let fail = false;

    if(currentUser == user) {
        errorMessage = 'Ya ha iniciado sesión con esta cuenta';
        fail = true;
    }
    else if (user.trim() == "" || password.trim() == "") {       

        errorMessage = 'Por favor rellene todos los campos'
        fail = true;
    }
    else if (!database.has(user)) {

        errorMessage = 'El usuario no existe';
        fail = true;
    }

    if (database.has(user) && database.get(user) !== password.trim())
    {
        errorMessage = "Contraseña incorrecta";
        fail = true;
    }

    // Esto es para la funcion de registrar
    if (!fail) {
        errorBox.innerHTML = errorMessage;
        changeLogin(user)

        document.querySelector("#username").value = '';
        document.querySelector("#password").value = '';
    }
    else
    {
        errorBox.innerHTML = '';

        errorBox.innerHTML =
        `<div class="text-red-600 hover:text-red-700 text-xl text-center">
            <span class="material-symbols-outlined"> warning </span>
            <p> ERROR: ${errorMessage} </p>
        </div>`;
    }
}

const logOff = () => {
    let user = currentUser;
    let errorBox = document.querySelector("#error");

    if (user == undefined || user == null) {
        errorBox.innerHTML = `<div class="text-red-600 hover:text-red-700 text-xl text-center">
            <span class="material-symbols-outlined"> warning </span>
            <p> ERROR: No tiene ninguna sesión iniciada </p>
        </div>`;

        return;
    }

    currentUser = null;
    document.getElementById('login_header').innerHTML = getUser();
}

const register = () => {
    let user = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let errorBox = document.querySelector("#error");
    let errorMessage = '';
    let fail = false; 

    if (database.has(user)) {
        errorMessage = 'El usuario ya existe';
        fail = true;
    }

    if (!fail) {
        database.set(user, password);

        errorBox.innerHTML = errorMessage;
    } else {
        errorBox.innerHTML = '';

        errorBox.innerHTML =
        `<div class="text-red-600 hover:text-red-700 text-xl text-center">
            <span class="material-symbols-outlined"> warning </span>
            <p> ERROR: ${errorMessage} </p>
        </div>`;
    }
}

// Video player functions

const playVideo = () => {
    play_pause.innerHTML = "pause";
    play_pause.title = "Reproducir";
    videoPlayer.classList.add("pause");
    videoPlayer.classList.remove("replay");
    mainVideo.play();
};

const pauseVideo = () => {
    play_pause.innerHTML = "play_arrow";
    play_pause.title = "Pausa";
    videoPlayer.classList.remove("pause");
    videoPlayer.classList.add("replay");
    mainVideo.pause();
};

const toggleRepeat = () => {
    if (videoPlayer.classList.contains("replay")) {
        videoPlayer.classList.remove("replay");
        play_pause.innerHTML = "repeat";
        play_pause.title = "Repetir";
    } else {
        videoPlayer.classList.add("replay");
        play_pause.innerHTML = "play_arrow";
        play_pause.title = "Pausa";
    }
};

const setDuration = () => {
    let videoDuration = mainVideo.duration;
    let totalMinutes = Math.floor(videoDuration / 60);
    let totalSeconds = Math.floor(videoDuration % 60);

    if (totalSeconds < 10) {
        totalSeconds = `0${totalSeconds}`;
    } else {
        totalSeconds = `${totalSeconds}`;
    }

    totalDuration.innerHTML = `${totalMinutes}:${totalSeconds}`;
};

const changeVolume = () => {
    let volumeValue = volumeRange.value;
    mainVideo.volume = volumeValue / 100;
    console.log(`Volume = ${volumeValue}`);

    if (volumeValue == 0) {
        volume.innerHTML = "volume_off";
    } else if (volumeValue > 0 && volumeValue <= 50) {
        volume.innerHTML = "volume_down";
    } else {
        volume.innerHTML = "volume_up";
    }
};

const muteVolume = () => {
    let volumeValue = volumeRange.value;

    if (volumeValue == 0) {
        volumeRange.value = 50;
        mainVideo.volume = 0.8;
        volume.innerHTML = "volume_up";
        console.log("Unmuted");
    } else {
        volumeRange.value = 0;
        mainVideo.volume = 0;
        volume.innerHTML = "volume_off";
        console.log("Muted");
    }
};



