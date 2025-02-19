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

	const cafes = [
        {
            name: "스터벅스 리저브 송도트리플 R점",
            phone_number: "1522-3232",
            address: "인천 연수구 송도과학로16번길 33-1 (송도동)",
            filters: ["10시이전오픈", "드립커피전문점", "스페셜티인증"],
            operating_hours: [
                { day: "MONDAY", open: "09:00", close: "22:00" },
                { day: "SUNDAY", open: "09:00", close: "22:00" }
            ]
        },
        {
            name: "빽다방 양재시민의숲역점",
            phone_number: "0507-1334-0421",
            address: "서울 서초구 마방로2길 94",
            filters: ["10시이전오픈", "프랜차이즈"],
            operating_hours: [
                { day: "MONDAY", open: "07:00", close: "21:00" },
                { day: "SUNDAY", open: "08:00", close: "21:00" }
            ]
        },
        {
            name: "볼라비카",
            phone_number: "02-6300-8808",
            address: "서울 서초구 강남대로 27",
            filters: ["주차장"],
            operating_hours: null
        },
        {
            name: "로쏘커피",
            phone_number: null,
            address: "서울 서초구 강남대로 27 aT센터 지하1층",
            filters: ["주차장"],
            operating_hours: [
                { day: "MONDAY", open: "08:00", close: "18:00" }
            ]
        },
        {
            name: "커피빈 매헌역점",
            phone_number: "02-2058-0921",
            address: "서울 서초구 동산로 1 1층",
            filters: ["10시이전오픈", "프랜차이즈"],
            operating_hours: [
                { day: "MONDAY", open: "07:00", close: "22:30" },
                { day: "FRIDAY", open: "07:00", close: "23:00" },
                { day: "SATURDAY", open: "07:30", close: "22:00" },
                { day: "SUNDAY", open: "07:30", close: "22:00" }
            ]
        },
        {
            name: "오와케이크 양재시민의숲점",
            phone_number: "0507-1353-2666",
            address: "서울 서초구 강남대로10길 8 1층",
            filters: [],
            operating_hours: [
                { day: "MONDAY", open: "10:00", close: "22:00" }
            ]
        },
        {
            name: "카페밸류",
            phone_number: "0507-1377-9002",
            address: "서울 서초구 마방로2길 89 1층",
            filters: ["10시이전오픈", "주차장"],
            operating_hours: [
                { day: "MONDAY", open: "08:00", close: "18:00" },
                { day: "SATURDAY", open: null, close: null },
                { day: "SUNDAY", open: null, close: null }
            ]
        },
        {
            name: "하잇커피",
            phone_number: "0507-0178-6397",
            address: "서울 서초구 마방로2길 57 1층",
            filters: ["10시이전오픈", "스페셜티인증", "주차장"],
            operating_hours: [
                { day: "MONDAY", open: "08:00", close: "18:00" },
                { day: "SATURDAY", open: null, close: null },
                { day: "SUNDAY", open: null, close: null }
            ]
        },
        {
            name: "투썸플레이스 양재매헌역점",
            phone_number: "02-573-2389",
            address: "서울 서초구 강남대로16길 3 1층",
            filters: ["10시이전오픈", "프랜차이즈"],
            operating_hours: [
                { day: "MONDAY", open: "07:00", close: "23:00" },
                { day: "SATURDAY", open: "08:00", close: "22:00" },
                { day: "SUNDAY", open: "08:00", close: "22:00" }
            ]
        }
    ];
	
	// 카페 데이터 삽입입
	for (const cafeData of cafes) {
        const cafe = await prisma.cafe.create({
            data: {
                name: cafeData.name,
                phone_number: cafeData.phone_number,
                address: cafeData.address,
                latitude: 0.0,
                longitude: 0.0
            }
        });

        if (cafeData.filters.length > 0) {
            for (const filterName of cafeData.filters) {
                const filter = await prisma.filterCriteria.findFirst({ where: { name: filterName } });
                if (filter) {
                    await prisma.cafeFilter.create({
                        data: { cafe_id: cafe.cafe_id, filter_criteria_id: filter.filter_criteria_id, is_applied: true }
                    });
                }
            }
        }

        if (cafeData.operating_hours) {
            for (const hour of cafeData.operating_hours) {
                await prisma.cafeOperatingHour.create({
                    data: {
                        cafe_id: cafe.cafe_id,
                        day_of_week: hour.day,
                        open_time: hour.open ? new Date(`2024-01-01T${hour.open}:00`) : null,
                        close_time: hour.close ? new Date(`2024-01-01T${hour.close}:00`) : null
                    }
                });
            }
        }
    }
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
