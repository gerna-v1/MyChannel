

const switchMode = () => {
    let logo = document.getElementById('logo');
    let button = document.querySelector('#darkbutton');
    let body = document.querySelector('body');
    let header = document.querySelector('#header');
    let search = document.querySelector('.search');
    let videos = document.querySelectorAll('.video');
    let buttons = document.querySelectorAll('a');

    const dark_background = 'repeating-linear-gradient(90deg, rgb(30, 30, 30) 0px, rgb(30, 30, 30) 42px,rgb(32, 32, 32) 42px, rgb(32, 32, 32) 84px,rgb(33, 33, 33) 84px, rgb(33, 33, 33) 126px,rgb(31, 31, 31) 126px, rgb(31, 31, 31) 168px,rgb(31, 31, 31) 168px, rgb(31, 31, 31) 210px,rgb(32, 32, 32) 210px, rgb(32, 32, 32) 252px,rgb(34, 34, 34) 252px, rgb(34, 34, 34) 294px,rgb(33, 33, 33) 294px, rgb(33, 33, 33) 336px)';
    const light_background = 'repeating-linear-gradient(90deg, rgba(30,30,30, 0) 0px, rgba(30,30,30, 0) 42px,rgba(32,32,32, 0.04) 42px, rgba(32,32,32, 0.04) 84px,rgba(33,33,33, 0.06) 84px, rgba(33,33,33, 0.06) 126px,rgba(31,31,31, 0.09) 126px, rgba(31,31,31, 0.09) 168px,rgba(31,31,31, 0.09) 168px, rgba(31,31,31, 0.09) 210px,rgba(32,32,32, 0.04) 210px, rgba(32,32,32, 0.04) 252px,rgba(34,34,34, 0.08) 252px, rgba(34,34,34, 0.08) 294px,rgba(33,33,33, 0.06) 294px, rgba(33,33,33, 0.06) 336px)';

    if (button.innerHTML === 'dark_mode') {
        button.innerHTML = 'light_mode';
        button.style.color = 'white';
        body.style.backgroundImage = dark_background;
        body.style.color = 'white';
        logo.src = '/img/mychannel_dark.png';
        header.style.backgroundColor = 'rgba(40, 40, 40, 1)';
        search.style.backgroundColor = 'rgba(50, 50, 50, 1)';
        videos.forEach(video => {
            video.style.backgroundColor = 'rgba(50, 50, 50, 0.8)';
            video.style.color = 'white';
        });
        buttons.forEach(button => {
            button.classList.replace("text-gray-700 hover:text-gray-900", "text-gray-50 hover:text-gray-100");
        });
    } else {
        button.innerHTML = 'dark_mode';
        body.style.backgroundImage = light_background;
        body.style.color = 'black';
        button.style.color = 'black';
        logo.src = '/img/mychannel_light.png';
        header.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        search.style.backgroundColor = 'var(--searchcolor)';
        videos.forEach(video => {
            video.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            video.style.color = 'black';
        });
        buttons.forEach(button => {
            button.classList.replace("text-gray-50 hover:text-gray-100", "text-gray-700 hover:text-gray-900");
        });
    }
}
