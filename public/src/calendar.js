//html読み込み時に実行
document.addEventListener('DOMContentLoaded', function(){
    let table = document.getElementById('trainingTable'); //htmlから表を取得
    firebase.auth().onAuthStateChanged(async(user) => {
      if (user) {
          //データベースの該当ユーザのrainings情報を時刻降順で取得
          const userDocument = await firebase.firestore().collection('trainings').where("userid", "==", user.uid).orderBy("created_at", "desc").get()
          userDocument.forEach((postDoc) => {
            //Timestampを時刻に変換し読みやすい形に直す
            var date = postDoc.data().created_at.toDate();
            var datestr = date.getFullYear()
            + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
            + '/' + ('0' + date.getDate()).slice(-2)
            + ' ' + ('0' + date.getHours()).slice(-2)
            + ':' + ('0' + date.getMinutes()).slice(-2)
            + '(JST)';
            var timestr = postDoc.data().time + "分";
            //console.log(postDoc.id, ' => ', JSON.stringify(postDoc.data()))
            //時刻を表に追加
            let newRow = table.insertRow();
            let newCell = newRow.insertCell();
            let newText = document.createTextNode(datestr);
            newCell.appendChild(newText);
            //部位を表に追加
            newCell = newRow.insertCell();
            newText = document.createTextNode(postDoc.data().item);
            newCell.appendChild(newText);
            //時間を表に追加
            newCell = newRow.insertCell();
            newText = document.createTextNode(timestr);
            newCell.appendChild(newText);
          })
      } 
    });
  });
  
  firebase.auth().onAuthStateChanged(async(user) => {
    if (user) {
      var userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
      var userMoney= userDoc.get('money')
      var userName=userDoc.get('display_name');
      
      document.getElementById('userName').innerHTML =userName;
      document.getElementById('coin').innerHTML = userMoney;
    }
  });
  
  