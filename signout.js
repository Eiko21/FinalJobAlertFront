async function signout(){
    if(localStorage.getItem("login")){
        localStorage.clear();
        window.location.href = "/popup.html";
    }
}
$("#signout").on("click", function(){
    signout();
})