export default function responseMiddleware(req, res, next) {
	res.success = (data, status = 200) => {
		res.status(status).json({
			result: "Success",
			status,
			success: data,
			error: null,
		});
	};

	res.error = (error, status = 400) => {
		res.status(status).json({
			result: "Fail",
			status,
			success: null,
			error: {
				errorCode: error.name || "Error",
				message: error.message || "An error occurred",
			},
		});
	};

	next();
}