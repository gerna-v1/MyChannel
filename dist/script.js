const getRandomDate = () => {
    const start = new Date(2022, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toLocaleString('en-GB');
}

const videos = [
    {
        "imageUrl": "../bucket/thumb/thumbnail.jpg",
        "videoUrl": "../bucket/videos/thumbnail.mp4",
        "title": "Video of a spinning earth",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Nullam nec purus nec nunc tincidunt ultricies. Nullam nec purus nec nunc tincidunt ultricies.",
        "commentbox": [
            {
                "username": "user1",
                "comment": "This is a comment",
                "likes": 0,
                "date": getRandomDate()
            },
            {
                "username": "user2",
                "comment": "This is not a comment",
                "likes": 0,
                "date": getRandomDate()
            },
            {
                "username": "user3",
                "comment": "This may be a comment",
                "likes": 0,
                "date": getRandomDate()
            },
            {
                "username": "user4",
                "comment": "This could be a comment",
                "likes": 0,
                "date": getRandomDate()
            },
            {
                "username": "user5",
                "comment": "This mayn't be a comment",
                "likes": 0,
                "date": getRandomDate()
            },
            {
                "username": "user6",
                "comment": "This isn't not a comment",
                "likes": 0,
                "date": getRandomDate()
            }
        ]
    }
];

const database = new Map();

var secondPlaylist = JSON.parse(JSON.stringify(videos));

var darkMode = false;
var openBox = false;
var lastButton;
var lastVolume = 0;
var videoCount = 0;
var isKeyboardDownAdded = false;
var currentUser;
var currentVideo = 0;
var lastCommentIndex = 0;


document.addEventListener("DOMContentLoaded", () => {
    generateVideoGrid(videos);
});

const search = () => {
    let input = document.querySelector('#searchbar').value;
    secondPlaylist = [];
    videos.forEach(video => {
        if (video.title.trim().toLowerCase().includes(input.trim().toLowerCase())) {
            secondPlaylist.push(video);
        }
    });
    generateVideoGrid(secondPlaylist);
    document.querySelector('#searchbar').value = '';
}

document.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
        search();
    }
});

const toggleBox = (button) => {

    if (openBox && lastButton !== button) {
        lastButton.nextElementSibling.classList.toggle('show');
    }
    
    let box = button.nextElementSibling;
    box.classList.toggle('show');  

    lastButton = button;

    openBox = box.classList.contains('show');

    document.querySelector("#error").innerHTML = '';

    // console.log(`La caja esta ${openBox ? 'abierta' : 'cerrada'}`);
}

const playerComponent = (video) => {
    let div = document.querySelector('#content');

    if (div.classList.contains("menu")) {
        div.classList.remove("menu");
        div.classList.add("player");
    } else {
        div.classList.add("player");
    }

    // Not my proudest code tbh
    let dataColor;
    let commentColor;
    let videoBgColor;
    let thumbnBgColor;
    let titleColor;
    let descriptionColor;
    let commentContainerBgColor;
    let commentBgColor;
    let commentButtonBgColor;

    if (darkMode) {
        dataColor = "bg-neutral-800";
        commentColor = "text-gray-50";
        videoBgColor = "rgba(50, 50, 50, 0.8)";
        thumbnBgColor = "bg-neutral-800";
        titleColor = "text-gray-50";
        descriptionColor = "text-gray-50";
        commentContainerBgColor = "bg-neutral-700";
        commentBgColor = "bg-neutral-500";
        commentButtonBgColor = "bg-gray-600";
    } else {
        dataColor = "bg-gray-200";
        commentColor = "text-gray-700";
        videoBgColor = "rgba(255, 255, 255, 0.8)";
        thumbnBgColor = "bg-gray-100";
        titleColor = "text-gray-950";
        descriptionColor = "text-gray-700";
        commentContainerBgColor = "bg-gray-50";
        commentBgColor = "bg-gray-200";
        commentButtonBgColor = "bg-gray-400";
    }

    div.innerHTML = `
    <div class="player-container z-10">
        <div id="video-player">
            <video src="${video.videoUrl}" type="video/mp4" id="main-video" style="justify-content: center; align-items: center;">           
                Your browser does not support the video tag.           
            </video>

            <div class="progressAreaTime non-selectable">0:00</div>
            
            <div class="controls">
                <div class="progress-area">
                    <div class="progress-bar"></div>
                    <span></span>
                </div>                

                <div class="controls-list non-draggable">
                    <div class="controls-left">
                        <span class="icon">
                            <i class="material-symbols-outlined skip-previous">skip_previous</i>
                        </span>
                        <span class="icon">
                            <i class="material-symbols-outlined play-pause">play_arrow</i>
                        </span>
                        <span class="icon">
                            <i class="material-symbols-outlined skip-next">skip_next</i>
                        </span>
                        <span class="icon">
                            <i class="material-symbols-outlined volume">volume_up</i>
                            <input type="range" min="0" max="100" id="volume-range">
                        </span>
                        <div class="timer non-selectable">
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

    // Comment Box part

    let metadata;

    if(!document.querySelector('.metadata')) {
        metadata = document.createElement('div');
        metadata.classList.add('metadata');
    }
    else {
        metadata = document.querySelector('.metadata');
        metadata.innerHTML = '';
    }

    metadata.innerHTML += `
        <div class="flex flex-wrap min-h-96 ${commentContainerBgColor} second-content">
            <section class="w-[100%] md:w-[70%] h-full p-4 flex grow overflow-visible flex-wrap">
                <div class="flex flex-col w-full h-1/6 p-4 ${dataColor} data rounded"> <!-- Titulo y descripcion -->
                    <p class="${titleColor} title text-3xl mt-2 mb-2"> ${video.title}</p>
                    <p class="${descriptionColor} description text-xl"> ${video.description}</p>
                </div>

                <div class="flex flex-col w-full h-5/6 p-4 ${dataColor} data rounded mt-4"> <!-- Caja de comentarios -->
                    <div class="flex flex-col p-6 w-full md:w-full rounded self-center h-1/6 ${commentButtonBgColor} commentbutton">
                        <p class="${titleColor} title text-2xl">Comentarios</p>
                    </div>

                    <div class="flex flex-col w-full h-1/6 p-4 ${dataColor} data rounded"> <!-- Ingresar comentarios -->
                        <p class="${titleColor} title text-xl" id="commentuser">Usuario: ${getUser()}</p>
                        <textarea class="w-full h-1/6 p-2 rounded mt-4 outline-none search" placeholder="Escribe un comentario..." id="entercomment"></textarea>
                        <button class="w-full h-1/6 p-2 rounded ${commentButtonBgColor} commentbutton ${titleColor} title mt-4" onclick="addComment()">Comentar</button>
                    </div>

                    <div class="flex flex-col w-full rounded-lg ${commentContainerBgColor} commentcontainer p-4 h-5/6 mt-1 mb-3 comments">
                        
                    </div>

                </div>
            </section>

            <section class="w-[100%] mt-4 md:mt-0 md:w-[30%] h-full p-2 text-2xl">

                <div class="flex flex-row w-full h-12 p-2 ${dataColor} data rounded playlist-select"> <!-- Playlist -->

                    <p class="${titleColor} flex w-[70%] justify-center self-center title text-[1.65rem] font-medium">Lista de reproducción</p>

                    <div class="flex flex-row w-[30%] "> 
                        <button class="rounded title mx-auto material-symbols-outlined" title="Playlist aleatoria" onclick="shufflePlayList()">shuffle</button>
                        <button class="rounded title mx-auto material-symbols-outlined" title="Reiniciar playlist" onclick="resetPlaylist(videos)">playlist_play</button>
                    </div>

                </div>

                <div class="grid grid-cols-1 gap-4 mt-2 justify-items-center playlist">
                    
                </div>
                
            </section>
        </div>`;

    document.querySelector('#main').appendChild(metadata);
    let playlist = document.querySelector('.playlist');
    let comments = document.querySelector('.comments');

    video.commentbox.forEach((comment, index) => {
        comments.innerHTML += `
            <div class="flex flex-col w-full p-2 h-1/6 comment mt-4 rounded-md ${commentBgColor}">
                <p class="${titleColor} title text-2xl pl-2">Usuario: ${comment.username}</p>
                <p class="${descriptionColor} description text-lg bg-gray-5 p-2">${comment.comment}</p>
                <div class="flex flex-row items-center w-full p-1">
                    <p class="${descriptionColor} description text-xl bold ml-1 mr-2 like-${index+1}">Likes: ${comment.likes}</p>
                    <button class="like-button text-xl bold material-symbols-outlined pt-1" onclick="like(${index + 1})" >thumb_up</button>
                    <p class="${descriptionColor} ml-auto description text-xl bold mr-1 date">${comment.date}</p>
                </div>
            </div>
        `;
    });

    lastCommentIndex = video.commentbox.length - 1;

    secondPlaylist.forEach((video, index) => {

        if (video.title.length > 40) {
            title = video.title.substring(0, 20) + '...';
        }
        else {
            title = video.title;
        };

        if (video.description.length > 50) {
            description = video.description.substring(0, 69) + '...';
        }
        else {
            description = video.description;
        };

        playlist.innerHTML +=
        `<div class="video flex flex-col items-center w-full rounded" style="background-color: ${videoBgColor}"   >
            <button class="flex justify-center items-center w-full h-56" onClick="openVideo(${index})">
                <img src="${video.imageUrl}" alt="Image" class="thumbn w-full h-full object-contain data ${thumbnBgColor}">
            </button>
            <div class="p-4 h-1/6 w-full text-left">
                <h2 class="font-bold text-xl">${title}</h2>
                <p class="${commentColor} text-base description">${description}</p>
            </div>
        </div>`;
    });

    let commentInput = document.querySelector('#entercomment')
    darkMode ? commentInput.style.backgroundColor = 'var(--searchcolor_dark)' : commentInput.style.backgroundColor = 'white' // I don't like the searc color for the comment box

    // Event listeners and dynamic loading

    if(!isKeyboardDownAdded) {
        document.addEventListener('keydown', keyboardEvents);
    }
    else {
        document.removeEventListener('keydown', keyboardEvents);
        document.addEventListener('keydown', keyboardEvents);
    }

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

const getCurrentVideo = () => {
    return currentVideo;
}

const resetPlaylist = () => {
    secondPlaylist = JSON.parse(JSON.stringify(videos));

    if (darkMode) {
        videoBgColor = "rgba(50, 50, 50, 0.8)";
        thumbnBgColor = "bg-neutral-800";
        titleColor = "text-gray-50";
        commentColor = "text-gray-50";
    } else {
        videoBgColor = "rgba(255, 255, 255, 0.8)";
        thumbnBgColor = "bg-gray-100";
        titleColor = "text-gray-950";
        commentColor = "text-gray-700";
    }

    if (document.querySelector('.playlist')) {

        playlist = document.querySelector('.playlist');

        playlist.innerHTML = '';

        secondPlaylist.forEach((video, index) => {

            if (video.title.length > 40) {
                title = video.title.substring(0, 20) + '...';
            }
            else {
                title = video.title;
            };
    
            if (video.description.length > 50) {
                description = video.description.substring(0, 69) + '...';
            }
            else {
                description = video.description;
            };
    
            playlist.innerHTML +=
            `<div class="video flex flex-col items-center w-full rounded" style="background-color: ${videoBgColor}"   >
                <button class="flex justify-center items-center w-full h-56" onClick="openVideo(${index})">
                    <img src="${video.imageUrl}" alt="Image" class="thumbn w-full h-full object-contain data ${thumbnBgColor}">
                </button>
                <div class="p-4 h-1/6 w-full text-left">
                    <h2 class="font-bold text-xl">${title}</h2>
                    <p class="${commentColor} text-base description">${description}</p>
                </div>
            </div>`;
        });
    }
}

const shufflePlayList = () => {
    let shuffled = JSON.parse(JSON.stringify(secondPlaylist));
    let currentIndex = shuffled.length;
    let temp;

    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temp = shuffled[currentIndex];
        shuffled[currentIndex] = shuffled[randomIndex];
        shuffled[randomIndex] = temp;
    }

    secondPlaylist = JSON.parse(JSON.stringify(shuffled));

    let videoBgColor;
    let thumbnBgColor;
    let titleColor;
    let commentColor;


    if (darkMode) {
        videoBgColor = "rgba(50, 50, 50, 0.8)";
        thumbnBgColor = "bg-neutral-800";
        titleColor = "text-gray-50";
        commentColor = "text-gray-50";
    } else {
        videoBgColor = "rgba(255, 255, 255, 0.8)";
        thumbnBgColor = "bg-gray-100";
        titleColor = "text-gray-950";
        commentColor = "text-gray-700";
    }

    if (document.querySelector('.playlist')) {

        playlist = document.querySelector('.playlist');

        playlist.innerHTML = '';

        secondPlaylist.forEach((video, index) => {

            if (video.title.length > 40) {
                title = video.title.substring(0, 20) + '...';
            }
            else {
                title = video.title;
            };
    
            if (video.description.length > 50) {
                description = video.description.substring(0, 69) + '...';
            }
            else {
                description = video.description;
            };
    
            playlist.innerHTML +=
            `<div class="video flex flex-col items-center w-full rounded" style="background-color: ${videoBgColor}"   >
                <button class="flex justify-center items-center w-full h-56" onClick="openVideo(${index})">
                    <img src="${video.imageUrl}" alt="Image" class="thumbn w-full h-full object-contain data ${thumbnBgColor}">
                </button>
                <div class="p-4 h-1/6 w-full text-left">
                    <h2 class="font-bold text-xl">${title}</h2>
                    <p class="${commentColor} text-base description">${description}</p>
                </div>
            </div>`;
        });
    }
}

const switchMode = () => {
    let logo = document.getElementById('logo');
    let button = document.querySelector('#darkbutton');
    let body = document.querySelector('body');
    let header = document.querySelector('#header');
    let searches = document.querySelectorAll('.search');
    let videos = document.querySelectorAll('.video');
    let buttons = document.querySelectorAll('button');
    let boxes = document.querySelectorAll('.box');
    let secondcontent = document.querySelector('.second-content');
    let descriptions = document.querySelectorAll('.description');
    let titles = document.querySelectorAll('.title');
    let commentbox = document.querySelectorAll('.commentcontainer');
    let comments = document.querySelectorAll('.comment');
    let data = document.querySelectorAll('.data');
    let commentbutton = document.querySelectorAll('.commentbutton');

    const dark_background = 'var(--dark_bg)';
    const light_background = 'var(--light_bg)';

    if (button.innerHTML.trim() == 'dark_mode') {
        darkMode = true;
        button.innerHTML = 'light_mode';
        body.style.backgroundImage = dark_background;
        body.style.color = 'white';
        logo.src = '../img/mychannel_dark.png';
        header.classList.replace("bg-gray-100", "bg-neutral-800"); 
        searches.forEach( search => {
            search.style.backgroundColor = 'var(--searchcolor_dark)'
        });
        videos.forEach(video => {
            video.style.backgroundColor = 'rgba(50, 50, 50, 0.8)';
            video.querySelector('.thumbn').classList.replace("bg-gray-100", "bg-neutral-800");
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

        if (secondcontent) {
            secondcontent.classList.replace("bg-gray-50", "bg-neutral-700");
        }

        data.forEach(dat => {
            dat.classList.replace("bg-gray-200", "bg-neutral-800");
        });

        titles.forEach(title => {
            title.classList.replace("text-gray-950", "text-gray-50");
        });

        descriptions.forEach(description => {
            description.classList.replace("text-gray-700", "text-gray-50");
        });

        commentbox.forEach(box => {
            box.classList.replace("bg-gray-50", "bg-neutral-700");
        });

        comments.forEach(comment => {
            comment.classList.replace("bg-gray-200", "bg-neutral-500");
        });

        commentbutton.forEach(button => {
            button.classList.replace("bg-gray-400", "bg-gray-600");
        });

        
        // document.querySelector('#metadata').style.backgroundColor = 'rgba(50, 50, 50, 0.8)'; BUENISIMO PARA DEBUGEAR EL BORDE, CHEQUEAR LUEGO
    } else {
        button.innerHTML = 'dark_mode';
        darkMode = false;
        body.style.backgroundImage = light_background;
        body.style.color = 'black';
        logo.src = '../img/mychannel_light.png';
        header.classList.replace("bg-neutral-800", "bg-gray-100");
        searches.forEach( search => {
            search.style.backgroundColor = 'var(--searchcolor)'
        });
        videos.forEach(video => {
            video.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            video.querySelector('.thumbn').classList.replace("bg-neutral-800", "bg-gray-100");;
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

        if(secondcontent){
            secondcontent.classList.replace("bg-neutral-700", "bg-gray-50");
        }

        let commentInput = document.querySelector('#entercomment')

        if (commentInput) {
            commentInput.style.backgroundColor = 'white'
        }

        data.forEach(dat => {
            dat.classList.replace("bg-neutral-800", "bg-gray-200");
        });

        titles.forEach(title => {
            title.classList.replace("text-gray-50", "text-gray-950");
        });

        descriptions.forEach(description => {
            description.classList.replace("text-gray-50", "text-gray-700");
        });

        commentbox.forEach(box => {
            box.classList.replace("bg-neutral-700", "bg-gray-50");
        });

        comments.forEach(comment => {
            comment.classList.replace("bg-neutral-500", "bg-gray-200");
        });

        commentbutton.forEach(button => {
            button.classList.replace("bg-gray-600", "bg-gray-400");
        });
    }
}

const openVideo = (index) => {
    playerComponent(secondPlaylist[index]);
    currentVideo = index;
}

const generateVideoGrid = (videos) => {
    let div = document.querySelector('#content');

    let comments = document.querySelector('.second-content  ');

    secondPlaylist = JSON.parse(JSON.stringify(videos));

    if (comments) {
        comments.remove();
    }

    // Clean the grid of videos
    div.innerHTML = '';

    if (div.classList.contains("player")) {
        div.classList.remove("player");
        div.classList.add("menu");
    } else {
        div.classList.add("menu");
    }

    let containerDiv = div.querySelector('.container.mx-auto');

    if (!containerDiv) {
        containerDiv = document.createElement('div');
        containerDiv.className = 'container mx-auto w-auto';
        div.appendChild(containerDiv);
    }

    let gridHtml = '';

    if (containerDiv.innerHTML.trim() === '') {
        gridHtml = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 justify-items-center ">';
    }

    darkMode ? bgColor = 'rgba(50, 50, 50, 0.8)' : bgColor = 'rgba(255, 255, 255, 0.8)'; 
    darkMode ? colorClass = "bg-neutral-700" : colorClass = "bg-gray-100";
    darkMode ? commentColor = "text-gray-50" : commentColor = "text-gray-700";

    if (videos.length === 0) {
        gridHtml += `
            <h1 class="text-4xl text-center mt-20">No hay videos relacionados a esta busqueda :(</h1>
        `;
    } else {
        videos.forEach((video, index) => {

            if (video.description.length > 69){
                description = video.description.substring(0, 69) + '...';
            }
            else {
                description = video.description;
            }

            if (video.title.length > 30){
                title = video.title.substring(0, 20) + '...';
            }
            else {
                title = video.title;
            }

            gridHtml += `
                <div class="video flex flex-col items-center w-full" style="background-color: ${bgColor}"   >
                    <button class="flex justify-center items-center w-full h-48" onClick="openVideo(${index})">
                        <img src="${video.imageUrl}" alt="Image" class="thumbn w-full h-full object-fill ${colorClass}">
                    </button>
                    <div class="p-4 h-1/6 w-full text-left">
                        <h2 class="font-bold text-xl">${title}</h2>
                        <p class="${commentColor} description">${description}</p>
                    </div>
                </div>
            `;

            videoCount++;
        });
    }

    gridHtml += '</div>';

    if (containerDiv.innerHTML.trim() === '') {
        containerDiv.innerHTML = gridHtml;
    }
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

    header.innerText= `Usuario actual: ${currentUser}`

    let commentUser = document.querySelector('#commentuser');
    
    if (commentUser) {
        commentUser.innerText = `Usuario: ${user}`;
    }
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
        errorBox.innerHTML = '';

        errorBox.innerHTML = 
        `<div class="text-green-400 hover:text-green-500 text-xl text-center">
            <span class="material-symbols-outlined"> check_circle </span>
            <p> El inicio de sesión se realizó con éxito </p>
        </div>`;

        changeLogin(user);

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
    else {
        errorBox.innerHTML = '';
        errorBox.innerHTML = 
        `<div class="text-green-400 hover:text-green-500 text-xl text-center">
            <span class="material-symbols-outlined"> check_circle </span>
            <p> La sesión fué cerrada con éxito </p>
        </div>`;
    }
    
    currentUser = null;
    document.getElementById('login_header').innerHTML = getUser();

    if (document.querySelector("#commentuser")) {
        document.querySelector("#commentuser").innerText = `Usuario: ${getUser()}`
    }
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
    else if (user.trim() == '' || password.trim() == '') {
        errorMessage = 'Por favor rellene todos los campos';
        fail = true;
    }

    if (!fail) {
        database.set(user, password);

        errorBox.innerHTML = '';

        errorBox.innerHTML = `<div class="text-green-400 hover:text-green-500 text-xl text-center">
            <span class="material-symbols-outlined"> check_circle </span>
            <p> El usuario fue registrado exitosamente </p>
        </div>`;
    } else {
        errorBox.innerHTML = '';

        errorBox.innerHTML =
        `<div class="text-red-600 hover:text-red-700 text-xl text-center">
            <span class="material-symbols-outlined"> warning </span>
            <p> ERROR: ${errorMessage} </p>
        </div>`;
    }
}


const like = (index) => {

    if(currentUser == null || currentUser == undefined)
    {
        console.log("El usuario es", currentUser);
        
        alert("Debe iniciar sesión para poder dar like a un comentario");
    }
    else {
        videos[currentVideo].commentbox[index - 1].likes++;
        document.querySelector(`.like-${index}`).innerHTML = `Likes: ${videos[currentVideo].commentbox[index - 1].likes}`;
        console.log(videos[currentVideo].commentbox[index - 1].likes);
    }
}

const addComment = () => {
    let comment = document.querySelector('#entercomment').value;
    let comments = document.querySelector('.comments');

    if(currentUser == null || currentUser == undefined)
    {
        console.log("El usuario es", currentUser);
        
        alert("Debe iniciar sesión para poder comentar");
    } 
    else {

        let titleColor;
        let descriptionColor;
        let commentBgColor;
        
        if (darkMode) {
            titleColor = "text-gray-50";
            descriptionColor = "text-gray-50";
            commentBgColor = "bg-neutral-500";
        } else {
            titleColor = "text-gray-950";
            descriptionColor = "text-gray-700";
            commentBgColor = "bg-gray-200";
        }
        
        lastCommentIndex++;

        let options = { timeZone: 'America/Caracas', hour12: true };
        let currentDate = new Date().toLocaleString('en-GB', options);

        videos[getCurrentVideo()].commentbox.push({
            "username": getUser(),
            "comment": comment,
            "likes": 0,
            "date": currentDate
        });

        comments.innerHTML += `
            <div class="flex flex-col w-full p-2 h-1/6 comment mt-4 rounded-md ${commentBgColor}">
                <p class="${titleColor} title text-2xl pl-2">Usuario: ${getUser()}</p>
                <p class="${descriptionColor} description text-lg bg-gray-5 p-2">${comment}</p>
                <div class="flex flex-row items-center p-1">
                    <p class="${descriptionColor} description text-xl bold ml-1 mr-2 like-${lastCommentIndex + 1}">Likes: ${videos[getCurrentVideo()].commentbox[lastCommentIndex].likes}</p>
                    <button class="like-button text-xl bold material-symbols-outlined" onclick="like(${lastCommentIndex + 1})" >thumb_up</button>
                    <p class="${descriptionColor} ml-auto description text-xl bold mr-1 date">${currentDate}</p>                    
                </div>
            </div>
        `;

        document.querySelector('#entercomment').value = '';
    }
};

// Video player functions

const keyboardEvents = (e) => {
    const activeElement = document.activeElement;
    const isInputField = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';

    switch (e.key) {
        case "ArrowLeft":
            mainVideo.currentTime -= 10;
        break;

        case "ArrowRight":
            mainVideo.currentTime += 10;
        break;

        case " ":
            if (!isInputField) {
                e.preventDefault();
                mainVideo.paused ? playVideo() : pauseVideo();
            }
            break;

        default:
            console.log(e.key);
        break;
    }
}

const playVideo = () => {
    play_pause.innerHTML = "pause";
    play_pause.title = "Reproducir";
    videoPlayer.classList.add("pause");
    mainVideo.play();
};

const playNextVideo = () => {
    if (!auto_play.classList.contains("active")) {
        if (getCurrentVideo() < secondPlaylist.length - 1) {
            openVideo(getCurrentVideo() + 1);
        } else {
            openVideo(0);
        }
    } else {
        playVideo();
    }
}

const playPreviousVideo = () => {
    if (!auto_play.classList.contains("active")) {
        if (getCurrentVideo() > 0) {
            openVideo(getCurrentVideo() - 1);
        } else {
            openVideo(secondPlaylist.length - 1);
        }
    } else {
        playVideo();
    }
}

const pauseVideo = () => {
    play_pause.innerHTML = "play_arrow";
    play_pause.title = "Pausa";
    videoPlayer.classList.remove("pause");
    mainVideo.pause();
};

const toggleRepeat = () => {
    if (videoPlayer.classList.contains("replay")) {
        videoPlayer.classList.remove("replay");
        play_pause.innerHTML = "play_arrow";
        play_pause.title = "Pausa";
    } else {
        videoPlayer.classList.add("replay");
        play_pause.innerHTML = "repeat";
        play_pause.title = "Repetir";
    }
};

const setDuration = () => {
    let videoDuration = mainVideo.duration;
    let totalHours = Math.floor(videoDuration / 3600);
    let totalMinutes = Math.floor((videoDuration % 3600) / 60);
    let totalSeconds = Math.floor(videoDuration % 60);

    if (totalSeconds < 10) {
        totalSeconds = `0${totalSeconds}`;
    } else {
        totalSeconds = `${totalSeconds}`;
    }

    if (totalMinutes < 10) {
        totalMinutes = `0${totalMinutes}`;
    } else {
        totalMinutes = `${totalMinutes}`;
    }

    let totalDurationString = totalHours > 0 ? `${totalHours}:${totalMinutes}:${totalSeconds}` : `${totalMinutes}:${totalSeconds}`;
    totalDuration.innerHTML = totalDurationString;
};

const changeSettings = () => {
    settings.classList.toggle('active');
    settingsBtn.classList.toggle('active');
}

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

const setPosition = (e) => {
    let videoDuration = mainVideo.duration;
    let progressValue = progressArea.clientWidth;
    let clickOffsetX = e.offsetX;

    if (isFinite(videoDuration) && isFinite(progressValue) && isFinite(clickOffsetX)) {
        mainVideo.currentTime = (clickOffsetX / progressValue) * videoDuration;
    } else {
        console.error("Invalid value detected: ", { videoDuration, progressValue, clickOffsetX });
    }
};

const remoteActiveClasses = () => {
    playback.forEach(event => {
        event.classList.remove("active");
    })
}

const muteVolume = () => {
    let volumeValue = volumeRange.value;

    if (volumeValue == 0) {
        volumeRange.value = lastVolume;
        mainVideo.volume = (lastVolume / 100);
        volume.innerHTML = "volume_up";
        console.log("Unmuted");
    } else {
        lastVolume = volumeValue
        volumeRange.value = 0;
        mainVideo.volume = 0;
        volume.innerHTML = "volume_off";
        console.log("Muted");
    }
};



