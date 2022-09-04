import { app ,db, auth} from './firebase.js';
import { onSnapshot,addDoc, arrayUnion, doc, getDoc,where, query,orderBy, setDoc, collection, getDocs, updateDoc} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js";
import {  onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js";


onAuthStateChanged(auth, (user) => {
  if (user) {

   // const uid = user.uid;
  //  console.log(uid)


let searchQuery = new URLSearchParams(window.location.search)
 let chatId = searchQuery.get('id')
if(chatId == null || chatId == undefined || chatId.length < 5){
  window.location.href = "index.html";
}else{
  let groupMessageRef = collection(db,"message/"+chatId+"/messages");
  let q = query(groupMessageRef,orderBy("sentAt"))
  let mainContent = document.getElementById("mainContent")
 // let userId = "GHCYJBehYnPqOIRZK5pcDW02D7o2"
  let userId = user.uid
  console.log(auth.currenUser)
  onSnapshot(q, (snaoshot) => {
    mainContent.innerHTML = "";
    snaoshot.forEach(message => {
      let mData = message.data()
      console.log(mData)
      let mEl = document.createElement('div');
      mEl.classList.add('mb-2')
      mEl.classList.add('col-12');
      let chatBubbleAlign = "left";
      let chatBubbleColor = "rgb(75,85,99)"
      if(mData.sentBy == userId){
        chatBubbleAlign = "right";
        chatBubbleColor = "rgb(76,120,221)"
      }
      mEl.innerHTML = `
      <div style="padding:6px; padding-left:12px;padding-right:12px; width:content;border-radius:6px;background-color:${chatBubbleColor};color:white; float:${chatBubbleAlign};">
      ${mData.text}
      </div>
      `
      
      mainContent.appendChild(mEl)
      tippy(mEl, {
  content: `<div >
  Seen At : ${mData.sentAt}
  </div>`,
  allowHTML: true,
});
if(mData.sentBy != userId && mData.isReaded == false){
  updateDoc(doc(db,"message/"+chatId+"/messages/"+message.id),{
        isReaded:true,
        readAt:Date.now()
           })
           
          /* 
          updateDoc(doc(db,"group",chatId),{
        recentMessage: {
          readBy:arrayUnion(userId)
          }
           })
           */
}
    })
    window.scrollTo(0, document.body.scrollHeight);
  })
  
  getDoc(doc(db,"group",chatId)).then((groupSnap) => {
    let groupData = groupSnap.data();
    groupData.members.forEach((mId, ind) => {
  if (mId == userId) {
    groupData.members.splice(ind, 1)
  }
})
getDoc(doc(db,"user",groupData.members[0])).then((userSnap) => {
      console.log(userSnap.data())
      document.getElementById("chatUserName").innerHTML = userSnap.data().displayName
    })
  })


function newMessage(by,text,ref){
  addDoc(ref,{
    text:text, 
    sentBy:by,
    sentAt:Date.now(),
    isReaded:false, 
    readAt:""
  })
  const updateDocRef = doc(db, "group", chatId);
  updateDoc(updateDocRef,{
        recentMessage: {
          messageText:text,
          sentAt:Date.now(), 
          sentBy:userId, 
          readBy:[userId]
          }
           })
}

document.getElementById("chatInputButton").addEventListener('click',function(){
  let chatInput = document.getElementById("chatInput");
  
  newMessage(userId,chatInput.value,groupMessageRef);
  chatInput.value = ""
})

}
  } else {
window.location.href = "login.html";
  }
});
