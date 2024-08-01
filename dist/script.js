const videos = [ // Missing a function that will read all files inside a folder, then create appropiate objects for each video
    {
        "imageUrl": "/bucket/thumb/thumbnail.jpg",
        "videoUrl": "/bucket/videos/thumbnail.mp4",
        "title": "Video of a spinning earth",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Nullam nec purus nec nunc tincidunt ultricies. Nullam nec purus nec nunc tincidunt ultricies.",
        "commentbox": {
            "username": "user4",
            "comment": "This isn't not a comment",
            "likes": 0
        }
    }
]

var darkMode = false;
var openBox = false;
var lastButton;
var videoCount = 0;

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

    div.innerHTML = `
    <div id="player">
        <video src="${video.videoUrl}" type="video/mp4" id="video-player" style="justify-content: center; align-items: center;">           
            Your browser does not support the video tag.           
        </video>
    </div>

    <section class="flex rounded-lg border-solid border-10 border-indigo-600" id="metadata">
        <div class="w-1/2 h-3/4" id="infobar">
            <div class="video-title-container text-center content-center text-xl" style="max-width: 50%;">
                <h1> ${video.title} </h1>
                <p> ${video.description} </p>
            </div>
        </div>
        


    </section>
    `;

    div.querySelector('#video-player').style = 'justify-content: center; align-items: center;';

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
        div.innerHTML = ''; // Clear the content div before appending the new container
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



