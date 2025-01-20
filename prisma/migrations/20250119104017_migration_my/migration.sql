-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `owner_id` INTEGER NULL,
    `email` VARCHAR(191) NOT NULL,
    `email_type` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `profile_image_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cafe` (
    `cafe_id` INTEGER NOT NULL AUTO_INCREMENT,
    `owner_id` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NULL,
    `operating_hour` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`cafe_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CafeImage` (
    `cafe_image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cafe_id` INTEGER NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `is_thumbnail` BOOLEAN NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`cafe_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuItem` (
    `menu_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cafe_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NULL,
    `image_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`menu_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bean` (
    `bean_id` INTEGER NOT NULL AUTO_INCREMENT,
    `roasting_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `is_specialty` BOOLEAN NULL DEFAULT false,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `is_single_origin` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`bean_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `review_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `cafe_id` INTEGER NOT NULL,
    `content` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReviewImage` (
    `review_image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `review_id` INTEGER NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`review_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CafeLike` (
    `user_id` INTEGER NOT NULL,
    `cafe_id` INTEGER NOT NULL,
    `liked_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_id`, `cafe_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SearchTerm` (
    `search_term_id` INTEGER NOT NULL AUTO_INCREMENT,
    `term` VARCHAR(191) NOT NULL,
    `search_count` INTEGER NULL,
    `last_searched_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`search_term_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecentSearch` (
    `recent_search_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `search_term` VARCHAR(191) NOT NULL,
    `searched_at` DATETIME(3) NULL,

    PRIMARY KEY (`recent_search_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Owner` (
    `owner_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `cafe_id` INTEGER NOT NULL,
    `business_certification_number` INTEGER NOT NULL,

    UNIQUE INDEX `Owner_user_id_key`(`user_id`),
    UNIQUE INDEX `Owner_cafe_id_key`(`cafe_id`),
    PRIMARY KEY (`owner_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CafeBean` (
    `cafe_id` INTEGER NOT NULL,
    `bean_id` INTEGER NOT NULL,
    `added_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`cafe_id`, `bean_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CafeEvaluation` (
    `evaluation_criteria_id` INTEGER NOT NULL,
    `review_id` INTEGER NOT NULL,
    `rating` DOUBLE NOT NULL,

    PRIMARY KEY (`evaluation_criteria_id`, `review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EvaluationCriteria` (
    `evaluation_criteria_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`evaluation_criteria_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FilterCriteria` (
    `filter_criteria_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`filter_criteria_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CafeFilter` (
    `filter_criteria_id` INTEGER NOT NULL,
    `cafe_id` INTEGER NOT NULL,
    `is_applied` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`filter_criteria_id`, `cafe_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CafeOperatingHour` (
    `operating_hour_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cafe_id` INTEGER NOT NULL,
    `day_of_week` VARCHAR(191) NOT NULL,
    `open_time` DATETIME(3) NULL,
    `close_time` DATETIME(3) NULL,

    PRIMARY KEY (`operating_hour_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SingleOrigin` (
    `single_id` INTEGER NOT NULL AUTO_INCREMENT,
    `bean_id` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `aroma` INTEGER NOT NULL,
    `acidity` INTEGER NOT NULL,
    `sweetness` INTEGER NOT NULL,
    `balance` INTEGER NOT NULL,
    `body` INTEGER NOT NULL,

    PRIMARY KEY (`single_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PreferedUserBean` (
    `prefered_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `roasting_id` INTEGER NOT NULL,
    `aroma` INTEGER NULL,
    `acidity` INTEGER NULL,
    `body` INTEGER NULL,
    `country` VARCHAR(191) NULL,

    PRIMARY KEY (`prefered_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CuffingTag` (
    `cuffing_tag_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cuffing_tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CuffingTagBean` (
    `bean_id` INTEGER NOT NULL,
    `cuffing_tag_id` INTEGER NOT NULL,

    PRIMARY KEY (`bean_id`, `cuffing_tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roasting` (
    `roasting_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`roasting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(191) NOT NULL,
    `sid` VARCHAR(191) NOT NULL,
    `data` VARCHAR(512) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `session_sid_key`(`sid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cafe` ADD CONSTRAINT `Cafe_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `Owner`(`owner_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CafeImage` ADD CONSTRAINT `CafeImage_cafe_id_fkey` FOREIGN KEY (`cafe_id`) REFERENCES `Cafe`(`cafe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_cafe_id_fkey` FOREIGN KEY (`cafe_id`) REFERENCES `Cafe`(`cafe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bean` ADD CONSTRAINT `Bean_roasting_id_fkey` FOREIGN KEY (`roasting_id`) REFERENCES `Roasting`(`roasting_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_cafe_id_fkey` FOREIGN KEY (`cafe_id`) REFERENCES `Cafe`(`cafe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewImage` ADD CONSTRAINT `ReviewImage_review_id_fkey` FOREIGN KEY (`review_id`) REFERENCES `Review`(`review_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CafeLike` ADD CONSTRAINT `CafeLike_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CafeLike` ADD CONSTRAINT `CafeLike_cafe_id_fkey` FOREIGN KEY (`cafe_id`) REFERENCES `Cafe`(`cafe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecentSearch` ADD CONSTRAINT `RecentSearch_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Owner` ADD CONSTRAINT `Owner_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CafeBean` ADD CONSTRAINT `CafeBean_cafe_id_fkey` FOREIGN KEY (`cafe_id`) REFERENCES `Cafe`(`cafe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CafeBean` ADD CONSTRAINT `CafeBean_bean_id_fkey` FOREIGN KEY (`bean_id`) REFERENCES `Bean`(`bean_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CafeEvaluation` ADD CONSTRAINT `CafeEvaluation_evaluation_criteria_id_fkey` FOREIGN KEY (`evaluation_criteria_id`) REFERENCES `EvaluationCriteria`(`evaluation_criteria_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CafeEvaluation` ADD CONSTRAINT `CafeEvaluation_review_id_fkey` FOREIGN KEY (`review_id`) REFERENCES `Review`(`review_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CafeFilter` ADD CONSTRAINT `CafeFilter_filter_criteria_id_fkey` FOREIGN KEY (`filter_criteria_id`) REFERENCES `FilterCriteria`(`filter_criteria_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CafeFilter` ADD CONSTRAINT `CafeFilter_cafe_id_fkey` FOREIGN KEY (`cafe_id`) REFERENCES `Cafe`(`cafe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CafeOperatingHour` ADD CONSTRAINT `CafeOperatingHour_cafe_id_fkey` FOREIGN KEY (`cafe_id`) REFERENCES `Cafe`(`cafe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SingleOrigin` ADD CONSTRAINT `SingleOrigin_bean_id_fkey` FOREIGN KEY (`bean_id`) REFERENCES `Bean`(`bean_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PreferedUserBean` ADD CONSTRAINT `PreferedUserBean_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PreferedUserBean` ADD CONSTRAINT `PreferedUserBean_roasting_id_fkey` FOREIGN KEY (`roasting_id`) REFERENCES `Roasting`(`roasting_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CuffingTagBean` ADD CONSTRAINT `CuffingTagBean_bean_id_fkey` FOREIGN KEY (`bean_id`) REFERENCES `Bean`(`bean_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CuffingTagBean` ADD CONSTRAINT `CuffingTagBean_cuffing_tag_id_fkey` FOREIGN KEY (`cuffing_tag_id`) REFERENCES `CuffingTag`(`cuffing_tag_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
