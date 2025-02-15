import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	// Cafe 데이터 생성
	const unhipCafe = await prisma.cafe.create({
		data: {
			name: "언힙커피로스터스",
			latitude: 37.4507, // 실제 위도 값으로 수정 필요
			longitude: 126.6571, // 실제 경도 값으로 수정 필요
			address: "인천 미추홀구 인하로67번길 6 2층",
			phone_number: "0507-1348-9149",
		},
	});

	// 운영시간 데이터 생성
	await prisma.cafeOperatingHour.createMany({
		data: [
			{
				cafe_id: unhipCafe.cafe_id,
				day_of_week: "MONDAY",
				open_time: new Date("2024-01-01T11:00:00"),
				close_time: new Date("2024-01-01T22:00:00"),
			},
			{
				cafe_id: unhipCafe.cafe_id,
				day_of_week: "TUESDAY",
				open_time: new Date("2024-01-01T11:00:00"),
				close_time: new Date("2024-01-01T22:00:00"),
			},
			{
				cafe_id: unhipCafe.cafe_id,
				day_of_week: "WEDNESDAY",
				open_time: new Date("2024-01-01T11:00:00"),
				close_time: new Date("2024-01-01T22:00:00"),
			},
			{
				cafe_id: unhipCafe.cafe_id,
				day_of_week: "THURSDAY",
				open_time: new Date("2024-01-01T11:00:00"),
				close_time: new Date("2024-01-01T22:00:00"),
			},
			{
				cafe_id: unhipCafe.cafe_id,
				day_of_week: "FRIDAY",
				open_time: new Date("2024-01-01T11:00:00"),
				close_time: new Date("2024-01-01T22:00:00"),
			},
			{
				cafe_id: unhipCafe.cafe_id,
				day_of_week: "SATURDAY",
				open_time: null,
				close_time: null,
			},
			{
				cafe_id: unhipCafe.cafe_id,
				day_of_week: "SUNDAY",
				open_time: new Date("2024-01-01T12:00:00"),
				close_time: new Date("2024-01-01T22:00:00"),
			},
		],
	});

	// FilterCriteria 생성
	await prisma.filterCriteria.createMany({
		data: [
			{ name: "무인" },
			{ name: "주차장" },
			{ name: "프랜차이즈" },
			{ name: "대형카페" },
			{ name: "24시간" },
			{ name: "10시 이전 오픈" },
			{ name: "23시 이후 마감" },
			{ name: "스페셜티 인증" },
			{ name: "드립커피 전문점" },
		],
	});

	// EvaluationCriteria 생성
	await prisma.evaluationCriteria.createMany({
		data: [
			{ name: "맛" },
			{ name: "인테리어" },
			{ name: "청결도" },
			{ name: "가성비" },
		],
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
