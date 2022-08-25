// let db = firebase.firestore(); // データベースに関する機能の取得

// // 保持されている全てのタスクデータを取得し、表示する
// function getAll() {
//   let collection = db.collection("tasks").orderBy('create_at', 'asc'); // 作成された順にデータを並べてタスクデータをデータベースから取得する
//   collection.get().then((querySnapshot) => { // 取得したデータを読み取る
//     document.getElementById("list").innerHTML = ""
//     num = 0;
//     querySnapshot.forEach((doc) => { // 取得したデータそれぞれ1つづつのデータに対して
//       // リスト表示するための箇所（ <div id="list"></div> ）にタスクを最下端に追加
//       document.getElementById("list").innerHTML += `
//       <div>${doc.data()['name']}<button onclick="del('${doc.id}')">削除</button></div>
//       `
//       num++;
//     });
//   });
// }
// getAll(); // 保持されている全てのタスクデータ取得の初期実行（これがないと、画面を開いたときに何も表示されない）

// // タスクを追加する
// function add() {
//   let taskNameForAdd = document.getElementById("taskNameForAdd").value; // inputbox に入力された値を取得する
//   if (taskNameForAdd == "") return; // もし、inputbox が空だった場合は関数を終了する

//   db.collection("tasks").add({ // データベースにタスクを追加する
//       name: taskNameForAdd, // 入力されたタスク名
//       create_at: new Date() // 現在時刻
//     }).then(function (docRef) { // 成功した場合に実行される箇所
//       getAll(); // 保持されている全てのタスクデータを取得し、表示する
//       document.getElementById("taskNameForAdd").value == ""; // inputbox に入力された値を空にする
//       console.log("Document written with ID: ", docRef.id);
//     })
//     .catch(function (error) { // 失敗した場合に実行される箇所
//       console.error("Error adding document: ", error);
//     });
// }

// // タスクを削除する
// function del(docId) {
//   console.log(docId)
//   db.collection("tasks").doc(docId).delete() // $('#docId').val() で削除する対象データのIDを取得し、そのデータに対して削除を行う
//     .then(function () { // 成功した場合に実行される箇所
//       console.log("Document successfully deleted!");
//       getAll(); // 保持されている全てのタスクデータを取得し、表示する
//     }).catch(function (error) { // 失敗した場合に実行される箇所
//       console.error("Error removing document: ", error);
//     });
// }


// function sayHello() {
//   alert("こんにちは！");
// }


/* function viewItem(){
  const item = document.getElementById("item1").value;
  const time = document.getElementById("time").value;
  const url = "https://www.youtube.com/results?search_query="+item+"+"+time+"分";
  var query = "?item=" + item + "&time=" + time; //クエリ文字列
  var url2 = "./after.html" + query;

  window.open(url);
  location.href = url2;
  // console.log(url);

} */

document.addEventListener('DOMContentLoaded', function(){
  firebase.auth().onAuthStateChanged(async(user) => {
    if (user) {
        //データベースのusers情報（ねこ）を取得
        const userRef = await firebase.firestore().collection('users').doc(user.uid);
        const userDocument = await userRef.get()
        var userCat = userDocument.get('cat');
        console.log(userCat);
        for(let i=0; i<userCat.length; i++){
          if (userCat[i]){
            const imgid = "neko" + i;
            const fileRef = await firebase.firestore().collection('cats').doc(String(i));
            const fileDocument = await fileRef.get();
            var filename = fileDocument.get('file_name');
            document.getElementById(imgid).src = "src/nekos/" + filename;
          }
        }
    } 
  });
});

function gacha(){
  //乱数を発生させる
  var max =19;
  var min =0 ;
  var rand=  Math.floor(Math.random() * (max - min + 1)) + min;
  console.log("乱数"+rand);

  //データベースに猫追加
  firebase.auth().onAuthStateChanged(async(user) => {
    if (user) {
        //獲得ねこデータを取得
        const userRef = await firebase.firestore().collection('users').doc(user.uid);
        const userDocument = await userRef.get()
        
        var userCat = userDocument.get('cat');
        var userMoney = userDocument.get('money');

        //20コイン以上ならガチャ実行
        if(userMoney >= 20){
           //獲得ねことお金更新
           userCat[rand] = true;
           console.log(userCat);

           await userRef.update({
             cat : userCat,  
             money : userMoney - 20,   
             updatedAt: firebase.firestore.FieldValue.serverTimestamp(),    
            });
            
            const catRef = await firebase.firestore().collection('cats').doc(String(rand));
            const catDoc = await catRef.get();
            
            var catName = catDoc.get('cat_type');
            console.log(catName);
            
            var fileName = catDoc.get('file_name');
            console.log(fileName);

             //猫データ取得
             document.getElementById('catName').innerHTML = catName + "獲得！！";
             document.getElementById('fileName').innerHTML = "<img src = 'src/nekos/"+ fileName+"'>";
          }

        else{
          // document.getElementBtId('catName').innerHTML = 20 - userMoney +"コインが足りません。";
          document.getElementById('fileName').innerHTML = 20 - userMoney + "コイン足りません。　";
        }
        document.getElementById('coin').innerHTML = userMoney;
    } 
});
}

//YouTubeに飛ばす
function viewItem(){
  const item = document.getElementById("item1").value;
  const time = document.getElementById("time").value;
  const url = "https://www.youtube.com/results?search_query="+item+"+"+time+"分";
  window.open(url);
  // console.log(url); 
}

//トレーニングを記録する
function record(){
  const item = document.getElementById("item1").value;
  const time = document.getElementById("time").value;
  var recMoney;
  const parsedInt = parseInt(time);
  if (parsedInt<=10){
    recMoney = 10;
  }
  else{
    recMoney = 20;
  }

  firebase.auth().onAuthStateChanged(async(user) => {
      if (user) {
        //trainingsのデータベースを取得
          var userDoc = await firebase.firestore().collection('trainings').doc();
          //if (!userDoc.exists) {
              // Firestore にドキュメントが作られていなければ作る
              await userDoc.set({
                  userid: user.uid,
                  item : item,
                  time : time,
                  money : recMoney,
                  created_at: firebase.firestore.FieldValue.serverTimestamp()
              },{merge: true });
          //}
          //console.log('データベースに書き込みました');
       
          //データベースのusers情報（所持金）を更新
          //所持金を取得
          const userRef = await firebase.firestore().collection('users').doc(user.uid);
          const userDocument = await userRef.get()
          
          var userMoney = userDocument.get('money');

          //更新(所持金=トレーニングで取得したお金+所持金)
          await userRef.update({
            money: recMoney + userMoney,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
      } 
  });
  document.getElementById("recordtr").insertAdjacentHTML("afterbegin", item + "を" + time + "分");
  document.getElementById("recordMoney").insertAdjacentHTML("afterbegin",recMoney);
}

function getUserInfo(){
  firebase.auth().onAuthStateChanged(async(user) => {
    if (user) {
      var userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
      var userMoney= userDoc.get('money')
      var userName=userDoc.get('display_name');
      
      document.getElementById('coin').innerHTML = userMoney+"コイン"
      console.log([userName,userMoney]);
    }
  })
};

//所持している猫をtraining.htmlにランダムに表示する
function loadCat(){
  firebase.auth().onAuthStateChanged(async(user) => {
    if (user) {
      var userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
      var userCat = userDoc.get('cat');
      //持っている猫の番号を取得
      var catNum = [];

      for(let i=0; i<userCat.length; i++){
        if (userCat[i] == true){
          catNum.push(i);
        }
      }
      //
      var max =catNum.length;
      var min =0 ;
      var rand=  Math.floor(Math.random() * (max - min)) + min;

      console.log(catNum);
      console.log(rand);
      console.log(catNum[rand]);

      //ねこデータベースを取得
      const catRef = await firebase.firestore().collection('cats').doc(String(rand));
      const catDoc = await catRef.get();
      
      var fileName = catDoc.get('file_name');
      console.log(fileName);

      //ファイルパスを生成
      document.getElementById('fileName').innerHTML = "<img id = 'cat1' src = 'src/nekos/"+ fileName+"'>";     
    }
  })
};



firebase.auth().onAuthStateChanged(async(user) => {
  if (user) {
    var userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
    var userMoney= userDoc.get('money')
    var userName=userDoc.get('display_name');
    
    document.getElementById('userName').innerHTML =userName;
    document.getElementById('coin').innerHTML = userMoney;
  }
});
//ログイン機能についての関数

/*
Firebase Authentcation を使った認証サンプル 01
Firebase Authentication UI を使い、サインイン用のUIを生成
ポップアップウィンドウで認証画面を表示、サインイン後元の画面に移動
サインアウト ボタンと、Googleの表示名をウェルカムメッセージとして表示
サインアウト 用の関数「signOut」を定義
*/

const ui = new firebaseui.auth.AuthUI(firebase.auth());
const uiConfig = {
callbacks: {
signInSuccessWithAuthResult: function(authResult, redirectUrl) {
  return true;
},
},
signInFlow: 'popup',
signInSuccessUrl: 'login.html',
signInOptions: [
firebase.auth.GoogleAuthProvider.PROVIDER_ID,
],
tosUrl: 'sample01.html',
privacyPolicyUrl: 'index.html'
};

ui.start('#auth', uiConfig);

firebase.auth().onAuthStateChanged(async(user) => {
if (user) {
     // ログイン済みのユーザー情報があるかをチェック
    var userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
    if (!userDoc.exists) {
       // Firestore にユーザー用のドキュメントが作られていなければ作る
        await userDoc.ref.set({
         money : 0,
         screen_name: user.uid,
         display_name: user.displayName,
         created_at: firebase.firestore.FieldValue.serverTimestamp(),
         cat : new Array(20).fill(false),
       });
     }

    const signOutMessage = `
    <p>${user.email}(${user.displayName})でログインしました!<\/p>
    <a href="./select.html" class="btn btn-secondary fw-bold border-black bg-white w-25 h-50">進む</a>
    <br>
    <button type="submit" class="btn btn-secondary fw-bold border-black bg-white w-25 h-50" onClick="signOut()">サインアウト<\/button>
    `;
    document.getElementById('auth').innerHTML =  signOutMessage;
    console.log('ログインしています');

} 
});

function signOut() {
firebase.auth().onAuthStateChanged(user => {
firebase
  .auth()
  .signOut()
  .then(() => {
    console.log('ログアウトしました');
    location.reload();
  })
  .catch((error) => {
    console.log(`ログアウト時にエラーが発生しました (${error})`);
  });
});
}
