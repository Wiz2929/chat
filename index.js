import { app, db, auth} from './firebase.js'; 
import { onSnapshot, doc, getDoc,where, query, setDoc, collection, getDocs} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js";
import newChat from './functions/newChat.js';

import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {

document.getElementById("userAvatarDisplay").src = user.photoURL
document.getElementById("userAvatarDisplay2").src = user.photoURL
document.getElementById("userNameDisplay").innerHTML = user.displayName
document.getElementById("userEmailDisplay").innerHTML = user.email

document.getElementById("logOutButton").addEventListener('click',function(){
  signOut(auth).then(() => {

}).catch((error) => {
console.log(error)
});
})

//let userId = "GHCYJBehYnPqOIRZK5pcDW02D7o2"
let userId = user.uid

const docRef = doc(db, "user", userId);
onSnapshot(docRef,(docSnap) => {

if (docSnap.exists()) {
  let data = docSnap.data()
  console.log(data)
  document.getElementById("newChatButton").removeAttribute("disabled")
  document.getElementById("loadingBlock").classList.remove("block-mode-loading")
  document.getElementById("newChatButton").addEventListener('click',function(){
    getDocs(collection(db,"user")).then((snap) => {
      let modalContent = document.getElementById("newChatModalContent");
      let listEl = document.createElement("ul")
      listEl.classList.add('list');
      modalContent.innerHTML = ""
      snap.forEach(snapData => {
        let dt = snapData.data()
        if(dt.email != undefined && data.uid != dt.uid){
        let listElJs = document.createElement('li');
        listElJs.classList.add('list-group-item');
        listElJs.innerHTML = `
        <img src="${dt.photoURL}" class="mr-2 img-avatar img-avatar32 img-avatar-thumb" alt="${dt.displayName}" height="32px" width="32px" > ${dt.displayName}
        `;
        console.log(data.groups)
        console.log(dt.groups)
        if(data.groups.length < 1 || dt.groups.length < 1){
        listEl.appendChild(listElJs)
        listElJs.addEventListener('click',function(){
          newChat(userId,dt.uid,snapData.id,app,dt.groups)
        })
      }else{
      data.groups.forEach( groupId => {
        if(dt.groups.includes(groupId)){
          
        }else{
          listEl.appendChild(listElJs)
          listElJs.addEventListener('click',function(){
          newChat(userId,dt.uid,snapData.id,app,dt.groups)
        })
        }
      })
    }
        

        }
      })
      
      modalContent.appendChild(listEl)
      
    })
  })
  if(data.groups.length < 1){
    document.getElementById("loadingBlockText").innerHTML = "<h1 class='mx-2' >No Chats Found</h1>";
     }else{
    document.getElementById("mainContent").innerHTML = "";
  let groupsRef = collection(db,"group");
  let q = query(groupsRef,where("members","array-contains",userId))
       getDocs(q).then((querySnap) => {
         querySnap.forEach( queryData => {
           let queryDataId = queryData.id
           queryData = queryData.data();
           console.log(userId)
           console.log(queryData.members)
          queryData.members.forEach(( mId,ind) => {
             if(mId == userId){
               queryData.members.splice(ind,1)
             }
           })
           console.log(queryData)
          if(queryData.IsGroup == false){
            getDoc(doc(db,"user",queryData.members[0])).then((us3rSnap) => {
              let userSnapData = us3rSnap.data();
              let chatEl = document.createElement('div');
              chatEl.classList.add("block")
              chatEl.classList.add("block-rounded")
              chatEl.classList.add("mb-1")
              let recentMessage = queryData.recentMessage.messageText
              recentMessage = recentMessage.slice(0,32)
              if(recentMessage.length >= 32){
                recentMessage += '...';
              }
              chatEl.innerHTML = `
              <a href="chat.html?id=${queryDataId}" >
              <div class="block-header" >
              <img src="${userSnapData.photoURL}" class="img-avatar img-avatar32 img-avatar-thumb mr-2" alt="">
              <h3 class="block-title" style="margin-left:14px;" >${userSnapData.displayName}
              <br />
              <small>${recentMessage}</small>
              </h3>
              </div>
              </a>
              `;
              
              document.getElementById("mainContent").appendChild(chatEl)
            })
          }else{
            
          }
          
         })
       })
     }
} else {
window.location.href = "login.html";
}
})
  } else {
window.location.href = "login.html";
  }
});
