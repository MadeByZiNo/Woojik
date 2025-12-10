# Woojik 간단한 가축(소) 관리 시스템

**프로젝트 기간: 2025-12-08~**

**기술 : Java/Spring/React/TypeScript/MySQL/influxDB**

가축 관리 시스템의 핵심 데이터(개체 정보, 번식/건강 이력)를 통합하고, 실시간 위치 및 상태를 시각화하는 사용자 친화적인 농장 관리 솔루션



<br/><br/>
# 기능

## 개체관리
<img width="2879" height="1320" alt="image" src="https://github.com/user-attachments/assets/b310108c-1ebf-4bfe-bec1-7c505428254f" />
내 축사의 소 리스트들을 볼 수 있습니다.  귀표번호로 검색하거나 비육, 임신, 치료, 송아지 중 선택해서 필터링이 가능합니다.
<br/><br/>

## 개체 상세정보
<img width="2879" height="1318" alt="image" src="https://github.com/user-attachments/assets/5974c3bf-1eff-4603-b06d-97cb1ebc90b4" />
<br/>
한 개체에 대한 상세한 정보를 볼 수 있습니다. 축사 어디에 위치하는지, 생년월일, 품종, 성별 및 건강 번식 등 많은 정보를 가집니다.
<br/><br/>
<img width="2879" height="1315" alt="스크린샷 2025-12-10 090849" src="https://github.com/user-attachments/assets/0a3ff7c0-6773-4e82-9162-d4029c8eac5c" />
<img width="1166" height="593" alt="스크린샷 2025-12-10 090901" src="https://github.com/user-attachments/assets/61ce51e1-f41b-494b-8dee-dbe7172a7ccc" />
<img width="2879" height="1314" alt="image" src="https://github.com/user-attachments/assets/0017a733-2eab-4229-873f-d33cff10030c" />
<br/>
역대 건강 이력 및 번식 관련 이력 확인이 가능합니다.
인공수정의 경우 인공수정일로부터 285일 후로 예상 분만예정일이 정해지고 건강이력의 경우 약 복용시에는 휴약기간으로 도축이 불가능하므로 알려줍니다.
<br/><br/>
<img width="2877" height="1317" alt="image" src="https://github.com/user-attachments/assets/3e2ffc30-3321-498b-abde-6d52de5d95bd" />
<img width="2879" height="1305" alt="image" src="https://github.com/user-attachments/assets/36f07de7-805e-40c1-8b2d-22f788b9ba88" />
<img width="2879" height="1318" alt="image" src="https://github.com/user-attachments/assets/c7b61d74-9a17-4a5c-888d-72f4207d8103" />
<img width="2879" height="1317" alt="image" src="https://github.com/user-attachments/assets/089fd55e-43ef-476d-a31c-b63089a7e27a" />
<br/>
상세 정보창에서 건강 이력 등록, 번식 관련 이력 등록, 축사 이동, 판매 등록이 가능합니다.
<br/><br/>
<br/><br/>

## 판매이력
<img width="2879" height="1313" alt="image" src="https://github.com/user-attachments/assets/dc2e1281-dc48-44ae-8db2-81c50cdff0bb" />
<img width="2879" height="1327" alt="image" src="https://github.com/user-attachments/assets/ff255e52-df45-473f-b677-e7db35f22f0d" />
<br/>
역대 판매한 개체들의 이력 확인이 가능합니다.
<br/><br/>

## 축사지도
<img width="2879" height="1317" alt="image" src="https://github.com/user-attachments/assets/5189a9e2-f391-4d00-a416-607291fd206d" />
현재 나의 축사에 맡게 조절하고 관리 할 수 있으며 해당 축사 안의 구별된 호의 가축 확인이 가능하고 과밀 기준을 넘을 시 과밀되어있는지 표시를 해줍니다.
<br/><br/>
![제목 없는 비디오 - Clipchamp로 제작 (1)](https://github.com/user-attachments/assets/324ca8f5-d738-48ab-ac52-d537f2e32f7b)
화면에서 직접 방을 추가하거나 삭제하고 크기조절을 해서 나의 축사처럼 모양을 비슷하게 만들어서 확인이 가능합니다.
<br/><br/>

## 대시보드
<img width="2860" height="1312" alt="image" src="https://github.com/user-attachments/assets/274793cb-0128-4939-b508-b2f0173fc83e" />
<br/>
기본적으로 현재 두수와 상태별로 분포를 보여줍니다. 우측에는 공공데이터포털 API를 통한 소고기 등급별 오늘의 가격을 알 수 있습니다.
<br/>
<img width="2876" height="1323" alt="image" src="https://github.com/user-attachments/assets/b0aea8c1-4afd-458e-8c6b-ce5fd86e250d" />
<br/>
하단에는 약물로 인해 휴약기간이거나 분만 예정인 소들의 숫자와 리스트를 보여줍니다.
<br/>
<img width="2879" height="1315" alt="image" src="https://github.com/user-attachments/assets/f2ab6569-7798-4705-9790-2f70a5729312" />
<br/>
또 실시간 소 건강 모니터링을 통해 체온이 높거나 낮은 소들의 상태를 보여줍니다.<br/>
실제 소에게 칩을 달아 데이터베이스와 연동이 가능하다면 건강 관리에 유용한 기능입니다.
<br/>
<img width="1051" height="581" alt="image" src="https://github.com/user-attachments/assets/a30208b7-1d81-49f4-ad0a-951c03c041d2" />
<br/>
10분 간격으로 축사의 온도와 습도를 그래프로 보여주면서 현재 환경이 적절한지 확인이 가능합니다.<br/>
이 또한 데이터베이스와 연동이 가능하다면 축사가 소들에게 적절한 온도상태인지 확인이 가능하며 부적절할시에 조치가 가능합니다.
