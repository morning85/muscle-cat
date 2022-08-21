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

  firebase.auth().onAuthStateChanged(async(user) => {
      if (user) {
          //console.log('ログインしています');
          //console.log(item);
          var userDoc = await firebase.firestore().collection('trainings').doc();
          //if (!userDoc.exists) {
              // Firestore にドキュメントが作られていなければ作る
              await userDoc.set({
                  userid: user.uid,
                  item : item,
                  time : time,
                  created_at: firebase.firestore.FieldValue.serverTimestamp()
              },{merge: true });
          //}
          //console.log('データベースに書き込みました');
      } 
  });
  // const user = firebase.auth().currentUser;
  // console.log(user);
  // //if (user) {
  //   var userDoc = await firebase.firestore().collection('users').doc(user.uid).collection("training").get();
  //       await userDoc.ref.set({
  //        item: item,
  //        time: time,
  //      });
  //} 

  document.getElementById("recordtr").insertAdjacentHTML("afterbegin", item + "を" + time + "分");
}

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
         screen_name: user.uid,
         display_name: user.displayName,
         created_at: firebase.firestore.FieldValue.serverTimestamp(),
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