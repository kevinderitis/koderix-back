document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn1-wpp').addEventListener('click', function(event) {
        event.preventDefault(); 
        window.open('https://wa.me/5491170964243', '_blank'); 
    });

    document.getElementById('chat-circle').addEventListener('click', function() {
        window.open('https://wa.me/5491170964243', '_blank'); 
    });
});