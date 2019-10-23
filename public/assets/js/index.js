var buttons;
var nav;

window.onload = function(){
    buttons = document.getElementsByTagName("button");
    nav = document.getElementById("menu");
    team = document.getElementById("meet-the-team");
}

function folderOpen() {
    buttons[1].style.display = "block";
    buttons[0].style.display = "none";

    nav.style.display = "block";
}

function folderClose() {
    buttons[1].style.display = "none";
    buttons[0].style.display = "block";

    nav.style.display = "none";

}


