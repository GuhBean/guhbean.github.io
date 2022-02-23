var password = "tinah_the_tiger";

function passcheck() {

    if (document.getElementById('pass1').value != password) {
        alert("wrong password (not that there is one)");
        return false;
    }

    if (document.getElementById('pass1').value == password) {
        alert("happy birthday! hope u enjoy ur tiger friend!");
    }
}