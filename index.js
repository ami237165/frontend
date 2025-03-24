//decoding jwt
function parseJwt (token) {    
    var base64Url = token.access_token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

document.getElementById('submit').addEventListener('click', async () => {
    const mobileNumber = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/auth/login',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({mobileNumber,password})
    }).catch((err) =>{
       alert(err)
        
    }); 
    const data = await response.json();
    console.log(data);
    
    if(data.access_token){
     const token_decoded = parseJwt(data);
     if(token_decoded.mobileNumber == mobileNumber){
        localStorage.setItem('access_token',data.access_token);
        window.location.href = 'chatBoard.html';
     }else{
       alert("login failed");   
     }
    }else{
        alert(data.message || "login failed")
    }
    

});

