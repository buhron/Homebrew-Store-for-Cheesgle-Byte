function to(page){
  for(let i=0;i<document.body.children.length;i++){
    if(document.body.children[i].id==page){
      document.body.children[i].hidden = false
    }else{
      document.body.children[i].hidden = true
    }
  }
}
window.addEventListener('message', async function(e) {
  let data = e.data // Get the data from the message event

  switch (data.type) {
    case 'info':
      // Replit info
      if (data.phone.isLoggedIn) {
        parent.postMessage({ type: "requestReplit" }, "*");
      }
      break;
    case 'replitInfo':
      if (data.data.loggedIn) {
        replitStatus.innerText = `Logged in to Replit as ${data.data.name}. ${data.data.bio ? `"${data.data.bio}"` : "No bio."}`
      }
      break;
  }
})


// Replit
let replitStatus = document.getElementById("replitStatus")

function replit(){
  parent.postMessage({ type: "requestReplit" }, "*");
}

// System info
function reset(){ // FULL SYSTEM RESET
  localStorage.clear();
  parent.location.reload()
}