function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.cookie && document.cookie.length) {
        document.querySelector("#userName").innerHTML = getCookie("userName");

        var names = document.querySelectorAll("#loginLink span");
        names.forEach((item) => {
            if (item.innerHTML == "Login") {
                item.classList.add("hidden");
            }
            else {
                item.classList.remove("hidden");
            }
        })
    }
});

function goBack() {
    window.history.back();
}