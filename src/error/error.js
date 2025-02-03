class AppError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}

class ValidationError extends AppError {
	constructor(message = "인증 실패") {
		super(message);
	}
}

class NotFoundError extends AppError {
	constructor(message = "내용을 찾을 수 없습니다.") {
		super(message);
	}
}

class UnauthorizedError extends AppError {
	constructor(message = "권한 없음") {
		super(message);
	}
}

class ForbiddenError extends AppError {
	constructor(message = "접근 금지됨") {
		super(message);
	}
}

class InternalServerError extends AppError {
	constructor(message = "서버 에러") {
		super(message);
	}
}

export {
	AppError,
	ValidationError,
	NotFoundError,
	UnauthorizedError,
	ForbiddenError,
	InternalServerError,
};