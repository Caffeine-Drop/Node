# Node
Caffeine Drop Node 리포지토리 입니다.

## 0. 최신 변경사항 불러오기

```
git stash // 현재 변경사항 임시 저장하기
git fetch origin // 최신 변경사항 가져오기
git branch // 현재 어떤 브랜치에 있는지 확인하세요!!
git merge origin/develop // develop 브랜치 최신 변경사항을 머지합니다.
```
이렇게 하면 프로젝트의 최신 변경사항을 유지할 수 있습니다.
만약 충돌이 나는 경우 적절히 처리하세요. (혹은 팀장 부르기)

## 1. 폴더 구조

```
src/
├── app.js                  # Express 앱 설정 및 미들웨어 초기화
├── controllers/            # 요청 처리 로직 (컨트롤러)
│   └── text                # 예시 컨트롤러 파일
├── dtos/                   # 데이터 전송 객체 (DTO)
│   └── text                # 예시 DTO 파일
├── error/                  # 사용자 정의 에러 클래스
│   └── error.js            # 에러 정의 파일
├── middlewares/            # 미들웨어 (공통 기능 처리)
│   └── responseMiddleware.js  # 표준 응답 미들웨어
├── repositories/           # 데이터베이스와의 상호작용 (저장소)
│   └── text                # 예시 저장소 파일
├── routes/                 # 라우트 정의
├── server.js               # 서버 실행 파일
├── services/               # 비즈니스 로직 (서비스)
│   └── text                # 예시 서비스 파일
└── utils/                  # 유틸리티 함수 (공통 함수)
    └── text                # 예시 유틸리티 파일
```

### 각 폴더의 역할
- **`app.js`**  
  애플리케이션의 진입점으로, Express 앱을 초기화하고 미들웨어와 라우트를 설정합니다.

- **`controllers/`**  
  요청(Request)을 처리하고 적절한 응답(Response)을 반환하는 로직이 들어갑니다.  
  예: 사용자 요청을 받아 데이터를 가져오거나 저장하는 역할.

- **`dtos/`**  
  데이터 전송 객체(Data Transfer Object)로, 요청이나 응답 데이터의 구조를 정의합니다.  
  예: 클라이언트로 보내거나 클라이언트로부터 받은 데이터를 검증 및 정리.

- **`error/`**  
  사용자 정의 에러 클래스가 포함되어 있습니다.  
  예: `ValidationError`, `NotFoundError` 등.

- **`middlewares/`**  
  요청과 응답 사이에서 실행되는 공통 작업을 처리합니다.  
  예: 표준 응답 형식을 보장하는 `responseMiddleware.js`.

- **`repositories/`**  
  데이터베이스와의 상호작용을 담당합니다.  
  예: 데이터를 조회, 삽입, 삭제, 업데이트하는 로직.

- **`routes/`**  
  URL 경로와 컨트롤러를 연결하는 라우터가 포함됩니다.  
  예: `/users` 경로에 대한 요청을 `UserController`로 전달.

- **`server.js`**  
  서버 실행 파일로, `app.js`를 불러와 서버를 실행합니다.

- **`services/`**  
  비즈니스 로직을 처리합니다.  
  예: 여러 저장소에서 데이터를 가져와 처리 후 반환.

- **`utils/`**  
  프로젝트 전반에서 재사용할 수 있는 유틸리티 함수가 포함됩니다.  
  예: 날짜 포맷팅, 문자열 변환 등.

---

## 2. 표준 응답

우리 프로젝트에서는 모든 API 응답이 **일관된 JSON 형식**으로 반환됩니다. 이를 통해 클라이언트와 서버 간의 통신을 명확하고 예측 가능하게 유지합니다.

### 응답 형식

#### 성공 응답
- **형식**:
  ```json
  {
    "result": "Success",
    "status": 200,
    "success": { "key": "value" },
    "error": null
  }
  ```
- **설명**:
  - `result`: 요청이 성공했음을 나타냅니다.
  - `status`: HTTP 상태 코드를 나타냅니다.
  - `success`: 요청 처리 결과 데이터를 포함합니다.
  - `error`: 항상 `null`입니다.

- **예시**:
  ```json
  {
    "result": "Success",
    "status": 200,
    "success": { "message": "User created successfully" },
    "error": null
  }
  ```

#### 실패 응답
- **형식**:
  ```json
  {
    "result": "Fail",
    "status": 400,
    "success": null,
    "error": {
      "errorCode": "CustomErrorName",
      "message": "Error message"
    }
  }
  ```
- **설명**:
  - `result`: 요청이 실패했음을 나타냅니다.
  - `status`: HTTP 상태 코드를 나타냅니다.
  - `success`: 항상 `null`입니다.
  - `error`: 에러 정보를 포함합니다.
    - `errorCode`: 에러 이름.
    - `message`: 에러 메시지.

- **예시**:
  ```json
  {
    "result": "Fail",
    "status": 404,
    "success": null,
    "error": {
      "errorCode": "NotFoundError",
      "message": "User not found"
    }
  }
  ```

---

## 3. 주의사항
- 모든 컨트롤러에서 응답을 반환할 때는 반드시 **`res.success`** 또는 **`res.error`**를 사용하세요.
- 에러를 발생시킬 때는 `throw`를 사용하고, 적절한 사용자 정의 에러 클래스를 활용하세요.
  - 예: `throw new ValidationError("Invalid input")`.
