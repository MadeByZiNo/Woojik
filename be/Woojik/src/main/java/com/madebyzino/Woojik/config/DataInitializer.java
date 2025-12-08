package com.madebyzino.Woojik.config;

import com.madebyzino.Woojik.entity.*;
import com.madebyzino.Woojik.entity.enums.BreedingType;
import com.madebyzino.Woojik.entity.enums.Gender;
import com.madebyzino.Woojik.entity.enums.HealthType;
import com.madebyzino.Woojik.entity.enums.LivestockStatus;
import com.madebyzino.Woojik.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final BarnRepository barnRepository;
    private final PenRepository penRepository;
    private final LivestockRepository livestockRepository;
    private final HealthRepository healthRepository;
    private final BreedingRepository breedingRepository;
    private final PenLayoutRepository penLayoutRepository; // 💡 지도 Repository 주입

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (barnRepository.count() > 0) return;

        System.out.println("🚀 기초 데이터 세팅을 시작합니다...");

        // 1. 축사, 방 생성
        Barn barn1 = barnRepository.save(new Barn("제1축사"));
        Pen p101 = penRepository.save(new Pen("101호", 5, barn1));
        Pen p102 = penRepository.save(new Pen("102호", 5, barn1));
        Pen p103 = penRepository.save(new Pen("103호", 5, barn1));
        Pen isolation = penRepository.save(new Pen("격리실", 1, barn1));

        // 💡 1-1. 지도 배치(PenLayout) 생성
        createLayout(barn1, p101, 1, 1, 1, 1); // 101호: 1행 1열 (Left)
        // Column 2 (통로)는 비어있습니다.
        createLayout(barn1, p102, 1, 3, 1, 1); // 102호: 1행 3열 (Right)

        createLayout(barn1, p103, 2, 1, 1, 1); // 103호: 2행 1열 (Left)
        // Column 2 (통로)는 비어있습니다.
        createLayout(barn1, isolation, 2, 3, 1, 1); // 격리실: 2행 3열 (Right)

        // 2. 소 20마리 생성
        Livestock cow1 = createCow("00230001", "대박이", Gender.CASTRATED, LivestockStatus.FATTENING, LocalDate.of(2023, 1, 15), "한우", p101, null);
        Livestock cow2 = createCow("00230002", null, Gender.CASTRATED, LivestockStatus.FATTENING, LocalDate.of(2023, 2, 20), "한우", p101, null);
        Livestock cow3 = createCow("00230003", null, Gender.CASTRATED, LivestockStatus.FATTENING, LocalDate.of(2023, 3, 10), "한우", p101, null);
        Livestock cow4 = createCow("00230004", "먹보", Gender.CASTRATED, LivestockStatus.FATTENING, LocalDate.of(2022, 12, 5), "한우", p101, null);
        Livestock cow5 = createCow("00230005", null, Gender.CASTRATED, LivestockStatus.FATTENING, LocalDate.of(2023, 1, 30), "한우", p101, null);
        Livestock cow6 = createCow("00230006", "꼬맹이", Gender.FEMALE, LivestockStatus.CALF, LocalDate.of(2025, 10, 1), "한우", p102, null);
        Livestock cow7 = createCow("00230007", null, Gender.MALE, LivestockStatus.CALF, LocalDate.of(2025, 9, 15), "한우", p102, null);
        Livestock cow8 = createCow("00230008", null, Gender.FEMALE, LivestockStatus.FATTENING, LocalDate.of(2024, 5, 20), "한우", p102, null);
        Livestock cow9 = createCow("00230009", "얼룩이", Gender.MALE, LivestockStatus.FATTENING, LocalDate.of(2024, 6, 10), "한우", p102, null);
        Livestock cow10 = createCow("00230010", "순심이", Gender.FEMALE, LivestockStatus.FATTENING, LocalDate.of(2020, 5, 5), "한우", p103, null);
        Livestock cow11 = createCow("00230011", null, Gender.FEMALE, LivestockStatus.FATTENING, LocalDate.of(2021, 3, 1), "한우", p103, null);
        Livestock cow12 = createCow("00230012", "누렁이", Gender.FEMALE, LivestockStatus.FATTENING, LocalDate.of(2019, 11, 20), "한우", p103, null);
        Livestock cow13 = createCow("00230013", null, Gender.FEMALE, LivestockStatus.FATTENING, LocalDate.of(2022, 1, 15), "한우", p103, null);
        Livestock cow14 = createCow("00230014", null, Gender.FEMALE, LivestockStatus.FATTENING, LocalDate.of(2021, 8, 30), "한우", p103, null);
        Livestock cow15 = createCow("00230015", "아픔이", Gender.CASTRATED, LivestockStatus.FATTENING, LocalDate.of(2023, 4, 1), "한우", isolation, null);
        Livestock cow16 = createCow("00230016", "탈출한소", Gender.MALE, LivestockStatus.FATTENING, LocalDate.of(2023, 7, 7), "한우", null, null);
        Livestock cow17 = createCow("00230017", null, Gender.FEMALE, LivestockStatus.FATTENING, LocalDate.of(2024, 1, 1), "한우", p102, null);
        Livestock cow18 = createCow("00230018", null, Gender.CASTRATED, LivestockStatus.FATTENING, LocalDate.of(2022, 9, 9), "한우", p101, null);
        Livestock cow19 = createCow("00230019", "할매소", Gender.FEMALE, LivestockStatus.FATTENING, LocalDate.of(2015, 1, 1), "한우", p103, null);
        Livestock cow20 = createCow("00230020", null, Gender.MALE, LivestockStatus.CALF, LocalDate.of(2025, 11, 1), "한우", p102, null);

        // 3. 이력 데이터 추가 및 요약 정보 갱신 (유지)
        System.out.println("🚀 이력 데이터 세팅을 시작합니다...");

        // --- 건강 이력 (Health) ---
        createHealth(cow1, HealthType.VACCINE, LocalDate.now().minusMonths(6), "구제역 1차", "A형 백신", "정기 예방접종", 0);
        createHealth(cow1, HealthType.VACCINE, LocalDate.now().minusMonths(3), "구제역 2차", "A형 백신", "정기 예방접종 2차", 0);
        createHealth(cow15, HealthType.TREAT, LocalDate.now().minusDays(5), "설사 (Diarrhea)", "항생제 X-5", "집중 치료 시작", 15);
        createHealth(cow4, HealthType.TREAT, LocalDate.now().minusDays(10), "열감기", "해열제", "주사 처치", 5);

        // --- 번식 이력 (Breeding) ---
        createBreeding(cow10, BreedingType.ESTRUS, LocalDate.now().minusDays(100), null, false, null, "발정 강함");
        createBreeding(cow10, BreedingType.AI, LocalDate.now().minusDays(98), "KPN-1234", null, LocalDate.now().plusDays(285), "수정 시도");
        createBreeding(cow10, BreedingType.PREG_CHECK, LocalDate.now().minusDays(60), null, true, LocalDate.now().plusDays(285), "임신 확인 완료");
        createBreeding(cow11, BreedingType.AI, LocalDate.now().minusDays(20), "KPN-7890", null, LocalDate.now().plusDays(285 - 20), "최근 수정 기록");
        createBreeding(cow12, BreedingType.CALVING, LocalDate.now().minusMonths(2), null, null, null, "분만 순조로웠음. 암송아지 출산.");
        createBreeding(cow14, BreedingType.AI, LocalDate.now().minusDays(40), "KPN-5555", null, null, "수정");
        createBreeding(cow14, BreedingType.PREG_CHECK, LocalDate.now().minusDays(10), null, false, null, "최근 임신 감정: 실패");


        System.out.println("✅ 기초 데이터 세팅 완료: 축사, 방, 소 20마리, 이력 세팅 완료");
    }

    // --- 헬퍼 메서드 정의 ---

    // 💡 PenLayout 생성 헬퍼
    private void createLayout(Barn barn, Pen pen, int gridRow, int gridCol, int rowSpan, int colSpan) {
        penLayoutRepository.save(PenLayout.builder()
                .barn(barn).pen(pen)
                .gridRow(gridRow).gridCol(gridCol)
                .rowSpan(rowSpan).colSpan(colSpan)
                .build());
    }

    // 🐄 소 생성 헬퍼
    private Livestock createCow(String earTag, String name, Gender gender, LivestockStatus status, LocalDate birth, String breed, Pen pen, String notes) {
        Livestock newCow = livestockRepository.save(Livestock.builder()
                .earTag(earTag).name(name).birthDate(birth).gender(gender).status(status).breed(breed).pen(pen)
                .notes(notes)
                .build());

        newCow.setBreedingCount(0);
        return newCow;
    }

    // 💉 건강 이력 생성 및 Livestock 요약 갱신
    private void createHealth(Livestock livestock, HealthType type, LocalDate eventDate, String diseaseName, String medicine, String description, Integer withdrawalPeriod) {
        Health record = healthRepository.save(Health.builder()
                .livestock(livestock).type(type).eventDate(eventDate).diseaseName(diseaseName)
                .medicine(medicine).description(description).withdrawalPeriod(withdrawalPeriod)
                .build());

        livestock.updateHealthInfo(
                record.getDiseaseName(),
                record.getEventDate()
        );

        if (record.getWithdrawalPeriod() != null && record.getWithdrawalPeriod() > 0) {
            LocalDate newWithdrawalDate = record.getEventDate().plusDays(record.getWithdrawalPeriod());

            if (livestock.getWithdrawalDate() == null || newWithdrawalDate.isAfter(livestock.getWithdrawalDate())) {
                livestock.setWithdrawalDate(newWithdrawalDate);
            }
        }

        if (type == HealthType.TREAT) {
            livestock.changeStatus(LivestockStatus.SICK);
        }
    }

    // 🍼 번식 이력 생성 및 Livestock 요약 갱신
    private void createBreeding(Livestock livestock, BreedingType type, LocalDate eventDate, String sireCode, Boolean isPregnant, LocalDate expectedDate, String notes) {
        Breeding record = breedingRepository.save(Breeding.builder()
                .livestock(livestock).type(type).eventDate(eventDate).sireCode(sireCode)
                .isPregnant(isPregnant).expectedDate(expectedDate).notes(notes)
                .build());

        if (type == BreedingType.ESTRUS) {
            livestock.setLastEstrusDate(record.getEventDate());
        } else if (type == BreedingType.AI) {
            livestock.setLastAiDate(record.getEventDate());
            if (record.getExpectedDate() != null) livestock.setExpectedDate(record.getExpectedDate());
        } else if (type == BreedingType.PREG_CHECK && record.getIsPregnant() != null) {
            if (record.getIsPregnant()) {
                livestock.setExpectedDate(record.getExpectedDate());
                livestock.changeStatus(LivestockStatus.PREGNANT);
            } else {
                livestock.setExpectedDate(null);
                livestock.changeStatus(LivestockStatus.FATTENING);
            }
        } else if (type == BreedingType.CALVING) {
            livestock.setBreedingCount(livestock.getBreedingCount() != null ? livestock.getBreedingCount() + 1 : 1);
            livestock.changeStatus(LivestockStatus.FATTENING);
            livestock.setExpectedDate(null);
            livestock.setLastAiDate(null);
        }
    }
}