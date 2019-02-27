# Castvot BFC Project

## TODO

- Google AdSense 적용함 (오른쪽 광고) 

- 구글 로그인 수정(passport의 profile.id 누가 숫자라고 알려줌? varchar(64)로 바꿨음)

- 지금 까지 구글로 로그인한 사람은 overflow되어 모두 user_pk 1번(조경원)으로 등록되어 일단 후보 등록한 2명만 한땀한땀 복구시킴

- 이미지 출처 적용 하였고 필수 입력 필드 입력 안했을때 focus() 적용

- 클릭 여러번 해서 등록되는건 반쯤 고침.

- main 업데이트 accounts값으로 계좌정보 날라감. 합계는 usd 환산 및 더하는 로직 결정하여 알려주시길. 순서와 랭킹 표시할려면 그 기준도...

- 후보상세보기에 소스보기하면 qtum_account, xrp_account 값 넣었음 QR은 모르겠음. 어디로 무슨값 넘겨야 하는지 알려주시길

- 수정요청은 POST폼 만들어야하며 미적용함

- UX는 castvot-front-publishing의 be63e299 부터 fd2a1974 까지 적용함. HTML보다는 ejs를 직접 수정해주시는것이 편한데...협의 필요

- 참고적으로 DB나 시스템이나 모두 UTC기준임. KST로 변환은 알아서들...(향후 글로벌 서비스를 대비하여 UTC로 갈꺼임)

