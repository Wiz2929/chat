import { getFirestore,onSnapshot, doc, getDoc, addDoc,updateDoc, collection, getDocs} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js";

function newChat(userId,user2,id,app,groups){
  const db = getFirestore(app);
  const docRef = doc(db, "user", userId);
  const docRef2 = doc(db,"user",user2)
    
      
      addDoc(collection(db,"group"),{
        createAt: Date.now(),
        createdBy: userId,
        members:[userId,id],
        modifiedAt: Date.now(),
        name:"",
        recentMessage:{
          readBy:new Array(), 
          sentBy: "",
          sentAt:"", 
          messageText: ""
          
        }, 
        IsGroup:false
      }).then((docSnap) => {
        
        updateDoc(docRef,{
        groups: [...groups,docSnap.id]
           })
    
          updateDoc(docRef2,{
          groups: [...groups,docSnap.id]
           })
       
        window.location.href = "chat.html?id="+docSnap.id
      })
  
}
export default newChat;
