import React, { useState, useRef } from "react";
import "../styles/signup.css";
import { validateSignup } from "../utils/funcValidate.js";

export default function Signup() {
  const names = [
    "id",
    "pwd",
    "cpwd",
    "name",
    "phone",
    "emailname",
    // "emaildomain",
  ];
  const namesLabel = {
    id: "아이디",
    pwd: "비밀번호",
    cpwd: "비밀번호 확인",
    name: "이름",
    phone: "휴대폰번호",
    emailname: "이메일 주소",
    // emaildomain: "이메일 도메인",
  };
  //   초기 폼 데이터와 refs를 설정
  const initFormData = names.reduce((acc, name) => {
    acc[name] = "";
    return acc;
  }, {});

  // useRef를 안전하게 생성
  const refs = useRef(
    names.reduce((acc, name) => {
      acc[name.concat("Ref")] = React.createRef(); // 각 필드에 대해 createRef 생성
      return acc;
    }, {})
  );
  console.log("refs--->>", refs);

  // useRef를 안전하게 생성
  const msgRefs = useRef(
    names.reduce((acc, name) => {
      acc[name.concat("MsgRef")] = React.createRef(); // 각 필드에 대해 createRef 생성
      return acc;
    }, {})
  );
  console.log("msgRefs--->>", msgRefs);

  //   const msgRefs = {
  //     msgIdRef: useRef(null),
  //     msgPwdRef: useRef(null),
  //     msgCpwdRef: useRef(null),
  //     msgNameRef: useRef(null),
  //     msgPhoneRef: useRef(null),
  //     msgEmailnameRef: useRef(null),
  // 'msgEmaildomainRef' : useRef(null),
  //   };
  //   const refs = {
  //     idRef: useRef(null),
  //     pwdRef: useRef(null),
  //     cpwdRef: useRef(null),
  //     nameRef: useRef(null),
  //     phoneRef: useRef(null),
  //     emailnameRef: useRef(null),
  //     emaildomainRef: useRef(null),
  //   };
  //   const initFormData = {
  //     id: "",
  //     pwd: "",
  //     cpwd: "",
  //     name: "",
  //     phone: "",
  //     emailname: "",
  //     emaildomain: "",
  //   };
  const [formData, setFormData] = useState(initFormData);

  //change
  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setFormData({ ...formData, [name]: value });
  };

  //submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateSignup(refs, msgRefs)) {
      console.log("submit ---->> ", formData);
    }
  };

  return (
    <div className="content">
      <h1 className="center-title">SIGINUP</h1>

      <form className="signup-form" onSubmit={handleSubmit}>
        <ul>
          {names.map((name) => (
            <li key={name}>
              <label htmlFor={name}>
                <b>{namesLabel[name]}</b>
              </label>
              <span ref={msgRefs.current[name.concat("MsgRef")]}>
                {namesLabel[name]}를 입력해주세요
              </span>
              <div>
                {name === "emailname" ? (
                  <>
                    <input
                      type="text"
                      name="emailname"
                      //   ref={refs.current["emailnameRef"]}
                      ref={refs.current[name.concat("Ref")]}
                      onChange={handleChangeForm}
                      placeholder="이메일 주소"
                    />
                    <span>@</span>
                    <select
                      name={name}
                      ref={refs.current["emaildomainRef"]}
                      onChange={handleChangeForm}
                    >
                      <option value="default">선택</option>
                      <option value="naver.com">naver.com</option>
                      <option value="gmail.com">gmail.com</option>
                      <option value="daum.net">daum.net</option>
                    </select>
                  </>
                ) : (
                  <input
                    type="text"
                    name={name}
                    ref={refs.current[name.concat("Ref")]}
                    onChange={handleChangeForm}
                    placeholder={`${namesLabel[name]} 입력`}
                  />
                )}

                {name === "id" && (
                  <>
                    <button type="button">중복확인</button>
                    <input type="hidden" id="idCheckResult" value="default" />
                  </>
                )}
              </div>
            </li>
          ))}
          <li>
            <button type="submit">가입하기</button>
            <button type="reset">가입취소</button>
          </li>
        </ul>
      </form>

      {/* <form className="signup-form" onSubmit={handleSubmit}>
        <ul>
          {names.map((name) => (
            <li>
              <label for={name}>
                <b>{namesLabel[name]}</b>
              </label>
              <span ref={msgRefs.current[name.concat("MsgRef")]}>
                {namesLabel[name]}를 입력해주세요
              </span>
              <div>
                <input
                  type="text"
                  name={name}
                  //   id="id"
                  ref={refs.current[name.concat("Ref")]}
                  onChange={handleChangeForm}
                  placeholder={`${name} 입력`}
                />
                {name === "id" && (
                  <>
                    <button type="button">중복확인</button>
                    <input type="hidden" id="idCheckResult" value="default" />
                  </>
                )}

                {name === "emaildomain" && (
                  <>
                    <span>@</span>
                    <select
                      name="emaildomain"
                      id="emaildomain"
                      ref={refs.current[name.concat("Ref")]}
                      onChange={handleChangeForm}
                    >
                      <option value="default">선택</option>
                      <option value="naver.com">naver.com</option>
                      <option value="gmail.com">gmail.com</option>
                      <option value="daum.net">daum.net</option>
                    </select>
                  </>
                )}
              </div>
            </li>
          ))} */}

      {/* <li>
            <label for="">
              <b>아이디</b>
            </label>
            <span ref={msgRefs.msgIdRef}>아이디를 입력해주세요</span>
            <div>
              <input
                type="text"
                name="id"
                id="id"
                ref={refs.idRef}
                onChange={handleChangeForm}
                placeholder="아이디 입력(6~20자)"
              />
              <button type="button">중복확인</button>
              <input type="hidden" id="idCheckResult" value="default" />
            </div>
          </li> */}
      {/* <li>
            <label for="">
              <b>비밀번호</b>
            </label>
            <span ref={msgRefs.msgPwdRef}>
              12자 이내의 비밀번호를 입력해주세요
            </span>
            <div>
              <input
                type="password"
                name="pwd"
                id="pwd"
                ref={refs.pwdRef}
                onChange={handleChangeForm}
                placeholder="비밀번호 입력(문자,숫자,특수문자 포함 6~12자)"
              />
            </div>
          </li>
          <li>
            <label for="">
              <b>비밀번호 확인</b>
            </label>
            <span ref={msgRefs.msgCpwdRef}>비밀번호 확인을 입력해주세요</span>
            <div>
              <input
                type="password"
                name="cpwd"
                id="cpwd"
                ref={refs.cpwdRef}
                onChange={handleChangeForm}
                placeholder="비밀번호 재입력"
              />
            </div>
          </li>
          <li>
            <label for="">
              <b>이름</b>
            </label>
            <span ref={msgRefs.msgNameRef}>이름을 입력해주세요</span>
            <div>
              <input
                type="text"
                name="name"
                id="name"
                ref={refs.nameRef}
                onChange={handleChangeForm}
                placeholder="이름을 입력해주세요"
              />
            </div>
          </li>
          <li>
            <label for="">
              <b>휴대폰번호</b>
            </label>
            <span ref={msgRefs.msgPhoneRef}>
              휴대폰번호를 입력해주세요('-' 포함)
            </span>
            <div>
              <input
                type="text"
                name="phone"
                id="phone"
                ref={refs.phoneRef}
                onChange={handleChangeForm}
                placeholder="휴대폰 번호 입력('-' 포함)"
              />
            </div>
          </li>
          <li>
            <label for="">
              <b>이메일 주소</b>
            </label>
            <span ref={msgRefs.msgEmailnameRef}>
              이메일 주소를 입력해주세요
            </span>
            <div>
              <input
                type="text"
                name="emailname"
                id="emailname"
                ref={refs.emailnameRef}
                onChange={handleChangeForm}
                placeholder="이메일 주소"
              />
              <span>@</span>
              <select
                name="emaildomain"
                id="emaildomain"
                ref={refs.emaildomainRef}
                onChange={handleChangeForm}
              >
                <option value="default">선택</option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
              </select>
            </div>
          </li> */}
      {/* <li>
            <button type="submit">가입하기</button>
            <button type="reset">가입취소</button>
          </li>
        </ul>
      </form> */}
    </div>
  );
}
