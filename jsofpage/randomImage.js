var images = ['3-anhem-nhaphattrien2.jpeg', '3-anhem-nhaphattrien3.jpeg', '3-anhem-nhaphattrien4.jpeg', '3-anhem-nhaphattrien5.jpeg', '3-anhem-nhaphattrien6.jpeg', '3-anhem-nhaphattrien7.jpeg'];
document.addEventListener('DOMContentLoaded', function () {
    var imgPath = getRandomImage();
    document.getElementById('randomImage').src = imgPath;
});
function getRandomImage() {
    var randomIndex = Math.floor(Math.random() * images.length);
    return 'images/users/' + images[randomIndex];
}