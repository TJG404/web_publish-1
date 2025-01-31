import { kobisBoxOffice as boxOffice, 
        searchMoviePoster,
        kmdbMovieDetail } from './kobisCommons.js';

initForm();

function initForm() {
    const output = `
        <h1>KOBIS 박스 오피스</h1>
        <div id="search">
            <select id="type">
                <option value="default">선택</option>
                <option value="Daily">일별</option>
                <option value="Weekly">주간/주말</option>
            </select>
            <input type="text" id="searchDt" placeholder="예) 20241122">
            <button type="button" id="searchBtn">Search</button>
        </div>
        <div id="result"></div>

        <div id="imageModal" class="modal">
            <div class="modal-content">
                <span id="closeModal" class="close">&times;</span>
                <!-- <img id="modalImage" src="" alt="Modal Image" style="width:500px;"/> -->
                <div id="movieDetail"></div>
            </div>
        </div>
        
    `;
    document.querySelector("body").innerHTML = output;

    // 기본 박스오피스 화면 출력 : 20240101
    searchBoxOffice('Daily','20240101');


    /** Search 버튼 이벤트 추가 */
    let searchButton = document.querySelector("#searchBtn");
    searchButton.addEventListener('click', ()=>{
        //searchDt 입력창, 박스오피스 타입의 유효성 체크
        let type = document.querySelector("#type");
        let searchDt = document.querySelector('#searchDt');
        
        if(type.value === 'default') {
            alert('박스오피스 타입을 선택해주세요');
            type.focus();
        } else if(searchDt.value === '') {
            alert('검색일자를 입력해주세요');
            searchDt.focus();
        } else {
            // 일별&주간/주말 박스오피스 정보 화면 출력
            searchBoxOffice(type.value, searchDt.value);
        }

    });

}//end of initForm


/**
 * 일별 박스오피스 정보 화면 출력
 */
function searchBoxOffice(ktype, searchDt) {
    boxOffice(ktype, searchDt) // Promise 객체로 리턴
        .then((result) => {
            // const rankType = ktype.toLowerCase();
            const type = result.boxOfficeResult.boxofficeType;
            const range = result.boxOfficeResult.showRange;            
            let rankList = null; //ktype을 체크하여 Daily, Weekly
            let posterList = [];

            if(ktype === 'Daily'){
                rankList = result.boxOfficeResult.dailyBoxOfficeList;
            } else if(ktype === 'Weekly'){
                rankList = result.boxOfficeResult.weeklyBoxOfficeList;
            }


            rankList.forEach((element) => console.log(element.movieNm));


            //영화 포스터 가져오기 - KMDB
            rankList.forEach((element) => {
                let movieNm = element.movieNm;
                let openDt = element.openDt.replaceAll('-','');

                posterList.push(getPoster(movieNm, openDt));                
            });


            Promise.all(posterList)  //비동기식 처리는 모두 종료가 되도록 실행
            .then((poster) => {

                    let output = `            
                        <h5>박스오피스 타입 : ${type}</h5>
                        <h5>박스오피스 일자 : ${range}</h5>
                        <table border=1>
                            <tr>
                                <th>순위</th>
                                <th>제목</th>
                                <th>개봉일</th>
                                <th>당일관객수</th>
                                <th>누적관객수</th>
                            </tr>`;
                    
                    rankList.forEach((element, i) => {
                                output += `
                                <tr>
                                    <td>${element.rank}</td>
                                    <td>
                                        <img src=${poster[i]} width="100px" class="poster"
                                            id="${element.movieNm},${element.openDt.replaceAll('-','')}" >
                                        ${element.movieNm}</td>
                                    <td>${element.openDt}</td>
                                    <td>${element.audiCnt}</td>
                                    <td>${element.audiAcc}</td>
                                </tr>                    
                            `;

                    });  
                                    
                    output += `</table>`;
                    
                    // 테이블 화면 출력            
                    document.querySelector("#result").innerHTML = output;


                    //이미지 클릭 이벤트
                    const images = document.querySelectorAll(".poster");
                    images.forEach((image) => image.addEventListener('click', onMovieDetail));


            }).catch(); //Promise.all()

        })
        .catch(); //
}

/** 이미지 이벤트 처리 함수 */
function onMovieDetail(event) {
    const modal = document.querySelector('#imageModal');
    const modalImage = document.querySelector('#modalImage');
    const closeModalBtn = document.querySelector('#closeModal');

    let [movieNm, openDt] = event.target.id.split(",");

    kmdbMovieDetail(movieNm, openDt)
        .then((result) => {
            // console.log(result.Data[0].Result[0].title);
            // const imageSrc = event.target.src; // 클릭한 이미지의 src를 가져옴
            // modalImage.src = imageSrc; // 모달 창에 이미지 넣기
            // modal.style.display = 'block'; // 모달 창을 표시

            let count = result.TotalCount;            
            let output = ``;
            let actorFive = [];
            let actorAll = [];

            if(count) {
                let info = result.Data[0].Result[0];
                let directors = result.Data[0].Result[0].directors.director;
                let actors = result.Data[0].Result[0].actors.actor;
                let posterArray = result.Data[0].Result[0].posters.split("|");
                let stillArray = result.Data[0].Result[0].stlls.split("|");
                let staffs = result.Data[0].Result[0].staffs.staff;
                
                let title = info.title.replaceAll('!HS','').replaceAll('!HE', '');
                
                actors.forEach((actor, i) => {
                    if(i<5) actorFive.push(actor.actorNm);
                });

                actors.forEach((actor) => {
                    actorAll.push(actor.actorNm);
                });

                // console.log(`actorFive--> ${actorFive}`);                
                
                output += `
                    <div class="container">
                    <div class="container-content">           
                        <h3>${title}</h3>
                        <h5>${info.titleEng} - ${info.prodYear}년</h5>
                        <hr>
                        <p>[${info.type}]  ${info.rating} ${info.nation} 
                            ${info.runtime}분 ${info.repRlsDate}(개봉)</p>
                        <p><span>제작사 :: </span><span>${info.company}</span></p>
                        <p><span>감독 :: </span><span>${staffs[0].staffNm}</span></p>
                        <p>
                            <span>출연 :: </span><span id="actors">${actorFive.join()}</span>
                            <button type="button" id="more_actors">더보기</button>
                            <button type="button" id="close_actors" style="display:none">접기</button>
                        </p>
                    </div>
                    <div class="container-img">
                        <img src="${posterArray[1]}">
                    </div>
                </div> 
                <div class="container-stills">               
                `;

                stillArray.forEach((still) => {
                    output += `<img src="${still}">`;
                });

                output += `</div>`;

            } else {
                output += `<h5>검색하신 데이터가 존재하지 않습니다.</h5>`;
            }            
            
            document.querySelector("#movieDetail").innerHTML = output;
            modal.style.display = 'block';

            /** more_actors 더보기 버튼 이벤트 */
            document.querySelector("#more_actors")
            .addEventListener('click', ()=>{
                document.querySelector("#actors").textContent = actorAll.join();
                document.querySelector("#more_actors").style.display = "none";
                document.querySelector("#close_actors").style.display = "inline-block";
            });


            /** close_actors 접기 버튼 이벤트 */
            document.querySelector("#close_actors")
            .addEventListener('click', ()=>{
                document.querySelector("#actors").textContent = actorFive.join();
                document.querySelector("#more_actors").style.display = "inline-block";
                document.querySelector("#close_actors").style.display = "none";
            });




            /******************************************************** */
            
        })
        .catch((error) => console.log(error) );

    
        // 모달 닫기 버튼 클릭 시 모달 닫기
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none'; // 모달 창 닫기
        });

        // 모달 바깥쪽 클릭 시 모달 닫기
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none'; // 모달 창 닫기
            }
        });
    
} //onMovieDetail





/** 순차적으로 비동기식 호출을 위해 getPoster 함수 생성  */
async function getPoster(movieNm, openDt) {
    return await searchMoviePoster(movieNm, openDt);
}//getPoster