const signUpName= document.querySelector(".name");
const signUpEmail=document.querySelector(".email");
const signUpPassword1=document.querySelector(".password1");
const signUpPassword2=document.querySelector(".password2");
const signUpGenders=document.querySelectorAll(".gender");
const signUpPolicy =document.querySelector(".policyCheck");
const signUpBtn = document.querySelector(".signUpBtn");
const signUpDupCheckBtn=document.querySelector("#duplicationCheckBtn");
const signUpEmailChecked=document.querySelector("#emailChecked");
const signInBtn=document.querySelector(".loginBtn");
const signInEmail=document.querySelector(".email");
const signInPassword=document.querySelector(".password");
const signInRememberMe=document.querySelector("#rememberMe")
const logoutBtn = document.querySelector("#logoutBtn");
const editUserName = document.querySelector("#name");
const editUserPhoneNumber = document.querySelector("#phoneNumber");
const editUserEmail = document.querySelector("#email");
const editUserEmailChecked = document.querySelector("#emailChecked");
const editUserDupCheckBtn = document.querySelector("#editUserDuplicationCheckBtn");
const editUserOriPassword = document.querySelector("#originalPassword");
const editUserNewPassword = document.querySelector("#newPassword");
const editUserBtn = document.querySelector(".editUserBtn");
const editUserOriEmail=document.querySelector(".originalEmail");
let regPassword= /^[a-zA-Z0-9]{4,12}$/ // 아이디와 패스워드가 적합한지 검사할 정규식
let regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; // 이메일이 적합한지 검사할 정규식
let regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;



let indexUser={
    signUp:signUp(),
    signIn:signIn(),
    logout:logout(),
    editUser:editUser()
}
//정규표현식 체크
function regexCheck(reg, what, message) {
    if(reg.test(what.value)) {
        return true;
    }
    alert(message);
    what.value = "";
    what.focus();
    //return false;
}



//policy 동의 여부 가져오기
function getPolicyCheck(){
    if(signUpPolicy.checked){
        return true;
    }else{
        return false
    }
}
//성별값 가져오기
function getGender() {
    let gender="none";
    signUpGenders.forEach((node) => {
        if (node.checked) {
            gender=node.value //male / female
        }
    })
    return gender;//아무것도 체크가 안되어있는 경우
}
//회원가입 진행 함수
function handleSignUpBtnClick(){
    if(signUpName.value===""){
        //이름이 비어있는지 검사
        alert("이름을 입력해주세요.");
        signUpName.focus()
        return false;
    }
    if(signUpEmail.value===""){
        //이메일이 비어있는지 검사
        alert("이메일을 입력해주세요.");
        signUpEmail.focus()
        return false;
    }
    if(signUpPassword1.value===""){
        //비밀번호1 비어있는지 검사
        alert("비밀번호를 입력해주세요.");
        signUpPassword1.focus()
        return false;
    }

    if(signUpPassword2.value===""){
        //비밀번호2 비어있는지 검사
        alert("확인 비밀번호를 입력해주세요.");
        signUpPassword2.focus()
        return false;
        }

    if (signUpPassword1.value!==signUpPassword2.value){
        //패스워드 1,2 동일성 검사
        alert("비밀번호가 다릅니다. 다시 확인해주세요.");
        signUpPassword2.value="";
        signUpPassword2.focus();
        return false;
    }
    if(!regexCheck(regPassword,signUpPassword1,"비밀번호는 4~12자의 영문 대소문자와 숫자로만 입력 가능합니다.")){
        //패스워드1 유효성 검사
        return false;
    }
    let gender=getGender();
   if(gender==="none"){
        alert("성별에 체크해주세요.");
        return false;
    }
    if(!getPolicyCheck()){
        alert("회원 약관에 동의해주세요.");
        return false;
    }
    if(signUpEmailChecked.value!=="true"){
        alert("이메일 중복확인을 해주세요.");
        return false;
    }

    let data={
        name:signUpName.value,
        email:signUpEmail.value,
        password:signUpPassword1.value,
        gender:gender
    }
    let token = document.querySelector("#csrfToken")
    let tokenName=token.name
    let tokenVal=token.value
    $.ajax({
      type:"POST",
      url:"/auth/api/signUp",
      data:JSON.stringify(data),
      contentType: "application/json;charset=utf-8",
      dataType: "json",
        beforeSend:function(xhr){
            xhr.setRequestHeader(tokenName,tokenVal)
        }
    }).done(function(res){
        if(res.status===500){
            alert("회원가입에 실패하였습니다.")
        }else{
            alert("회원가입에 성공하였습니다. 반갑습니다.")
            location.href="/";
        }
    }).fail(function (e){
        alert(JSON.stringify(e));
    })
}
//이메일 유효성 검사, 중복 체크
function handleDupCheckBtnClick(){
    if(signUpEmail.value===""){
        //비어있으면
        alert("이메일을 입력해주세요.")
        signUpEmail.focus();
        return false;
    }
    if(!regexCheck(regEmail,signUpEmail,"적합하지 않는 이메일 형식입니다.")){
        return false;
    }

    let data={
      email:signUpEmail.value
    };
    let token = document.querySelector("#csrfToken")
    let tokenName=token.name
    let tokenVal=token.value

    $.ajax({
        type:"POST",
        url:"/auth/api/checkEmailUsed",
        data:JSON.stringify(data),
        contentType:"application/json;charset=utf-8",
        dataType:"json",
        beforeSend:function(xhr){
            xhr.setRequestHeader(tokenName,tokenVal)
        }
    }).done(function (res){
        let resData=res.data;
        if(resData===1){
            //존재하지 않는 회원 -> 사용가능한 이메일
            if(confirm("사용 가능한 이메일입니다. 사용하시겠습니까?")){
                $(".email").attr("readonly",true);
                signUpDupCheckBtn.removeEventListener("click",handleDupCheckBtnClick);
                signUpEmailChecked.value="true";
            }else{
                signUpEmail.value="";
                signUpEmail.focus();
            }
        }else{
            //존재하는 회원 -> 존재한다고 알리고 로그인 창으로 이동
            if(confirm("이미 존재하는 회원입니다. 로그인 창으로 이동하시겠습니까?")){
                location.href="/auth/login";
            }else{
                signUpEmail.value=""
                signUpEmail.focus()
            }
        }
    }).fail(function (e){
        console.log(e);
    })

}


//회원 가입버튼을 눌렀을 때 실행
function signUp(){
    if (signUpDupCheckBtn){
        signUpDupCheckBtn.addEventListener("click",handleDupCheckBtnClick)
    }
    if(signUpBtn){
        signUpBtn.addEventListener("click",handleSignUpBtnClick)
    }
}
//로그인 버튼 눌렀을 때
function handleSignInBtnClick(){
    if(signInEmail.value===""){
        alert("이메일이 비었습니다.")
        return false
    }
    if(signInPassword.value===""){
        alert("비밀번호가 비었습니다.")
        return false
    }
    let token = document.querySelector("#csrfToken")
    let tokenName=token.name
    let tokenVal=token.value
    let data={
        "email":signInEmail.value,
        "password":signInPassword.value,
        "remember-me":signInRememberMe.checked
    }
    $.ajax({
        type:"POST",
        url:"/auth/api/login",
        data:data,
        dataType:"json",
        beforeSend:function(xhr){
            xhr.setRequestHeader(tokenName,tokenVal)
        }
    }).done(function (res){
        if(res.status===200){
            location.href=res.data.url;
        }else{
            alert(res.data.message);
        }
    }).fail(function (e){
        console.log(e)
    })
}

function signIn(){
    if(signInBtn){
        signInBtn.addEventListener("click",handleSignInBtnClick)
    }
}
//로그아웃 버튼눌렀을 때
function handleLogoutBtnClick(){
    let token = document.querySelector("#csrfToken")
    let tokenName=token.name
    let tokenVal=token.value
    $.ajax({
        type:"POST",
        url:"/auth/logout",
        beforeSend:function(xhr){
            xhr.setRequestHeader(tokenName,tokenVal)
        }
    }).done(function (res){
        location.href="/"
    }).fail(function (e){
        console.log(e)
    })
}

function logout(){
    if(logoutBtn){
        logoutBtn.addEventListener("click",handleLogoutBtnClick)
    }
}



function handleEditUserBtnClick(){
    if(editUserPhoneNumber.value!=="" && !regexCheck(regPhone,editUserPhoneNumber,"정확한 휴대폰 번호를 입력해주세요.")){
        //패스워드1 유효성 검사
        return false;
    }

    if(editUserOriPassword.value===""){
        //비밀번호1 비어있는지 검사
        alert("기존 비밀번호를 입력해주세요.");
        editUserOriPassword.focus()
        return false;
    }

    if(editUserNewPassword.value===""){
        //비밀번호2 비어있는지 검사
        alert("새 비밀번호를 입력해주세요.");
        editUserNewPassword.focus()
        return false;
    }

    if (editUserOriPassword.value===editUserNewPassword.value){
        //패스워드 1,2 동일성 검사
        alert("비밀번호가 같습니다. 새로운 비밀번호로 변경해주세요..");
        editUserNewPassword.value="";
        editUserNewPassword.focus();
        return false;
    }
    if(!regexCheck(regPassword,editUserNewPassword,"비밀번호는 4~12자의 영문 대소문자와 숫자로만 입력 가능합니다.")){
        //패스워드1 유효성 검사
        return false;
    }
    let token = document.querySelector("#csrfToken")
    let tokenName=token.name
    let tokenVal=token.value

    let data={
        "name":editUserName.value,
        "email":editUserEmail.value,
        "phoneNumber":editUserPhoneNumber.value,
        "originalPassword":editUserOriPassword.value,
        "newPassword":editUserNewPassword.value,
    }

    $.ajax({
        type:"PUT",
        url:"/auth/api/editUser",
        data:JSON.stringify(data),
        contentType:"application/json;charset=utf-8",
        dataType:"json",
        beforeSend:function(xhr){
            xhr.setRequestHeader(tokenName,tokenVal)
        }
    }).done(function (res){
        console.log(res)
        if(res.data.message){
            alert(res.data.message);
            editUserOriPassword.value=""
        }else{
            location.reload();
        }
    }).fail(function (e){
        console.log(e)
    })


}

function editUser(){

    if(editUserBtn){
        editUserBtn.addEventListener("click",handleEditUserBtnClick)
    }
}


indexUser.signUp
indexUser.signIn
indexUser.logout
indexUser.editUser