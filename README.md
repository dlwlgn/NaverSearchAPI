# NaverSearchAPI
Vue.js와 Node.js를 이용해 사용자로부터 입력을 받고, 네이버 검색 OpenAPI로부터 받은 데이터를 도표화하여 보여주는 웹 페이지

### NAVER Developers 통합 검색어 트렌드
https://developers.naver.com/docs/serviceapi/datalab/search/search.md#%ED%86%B5%ED%95%A9-%EA%B2%80%EC%83%89%EC%96%B4-%ED%8A%B8%EB%A0%8C%EB%93%9C
### 웹페이지 DNS 주소
http://s3-front-naverapi.s3-website.ap-northeast-2.amazonaws.com

## 구현 기능
- Vue.js와 Node.js를 활용한 동적 웹페이지 구현
- 프론트엔드에서 vue-chartjs를 사용해 데이터를 시각적으로 표현
- 백엔드에서 HTTP 통신을 활용해 네이버 OpenAPI와 통신
- aws s3에 프론트엔드 배포, aws ec2로 백엔드 서버 구동

## 배포 계획 및 경과
### 4/19
프론트엔드와 백엔드 작업을 모두 마치고 호스팅을 할 계획을 세움

백엔드를 실행시킬 서버 2가지 방안
- 개인 노트북을 서버로 사용
- aws ec2를 사용

프론트엔드를 배포할 2가지 방안
- git pages를 통해 배포
- aws ec2를 사용

### 4/20
백엔드 서버 aws ec2로 결정

1번 문제 발생 => 일반적인 방식으로 서버를 실행시키면 ssh 접근 클라이언트 종료시, 서버 또한 종료

프론트엔드 git pages로 결정

2번 문제 발생 => 프로젝트의 용량이 너무 커서 제대로 올라가지 않음. 단순 html과 다른 프로젝트 구조.

### 4/21
1번 문제 해결 => 무중단 서버 운영을 위해 Node.js의 pm2를 사용하여 실행

2번 문제 해결 => npm run build를 사용해 빌드하여 배포용 정적 파일 생성. git pages로 배포.

3번 문제 발생 => https 사이트인 github 배포 사이트에서 http 주소(백엔드가 저장된 ec2 주소)로 request를 보내는 것을 block시킴.

### 4/22
3번 문제 해결 2가지 방안
- aws로 SSL 인증서 발급 및 ec2 주소를 https로 리디렉션
- nginx로 SSL 인증서 발급 및 ec2 주소를 https로 리디렉션
- 프론트엔드를 aws s3에서 배포

aws와 nginx를 활용하여 http인 ec2 주소를 https로 리디렉션하려고 했으나, aws는 계속해서 실패 메시지를 띄우고 nginx는 https 주소까지 받아냈지만, 통신 자체가 제대로 되지 않는 문제가 있었음.

### 4/26
프론트엔드 정적 파일을 aws s3에 업로드하고 배포하는 방식으로 해결.

aws s3 기반 배포 사이트는 http 주소를 사용했기 때문에 ec2(백엔드 서버)와의 통신도 원활.
