-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema dashboard_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema dashboard_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `dashboard_db` DEFAULT CHARACTER SET utf8mb4 ;
USE `dashboard_db` ;

-- -----------------------------------------------------
-- Table `dashboard_db`.`account`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dashboard_db`.`account` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `password` VARCHAR(45) NULL DEFAULT NULL,
  `dashboard_list` TEXT NULL DEFAULT NULL,
  `username` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `dashboard_db`.`dashboard`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dashboard_db`.`dashboard` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `block_list` TEXT NULL DEFAULT NULL,
  `account_id` INT(11) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_account_id` (`account_id` ASC) VISIBLE,
  CONSTRAINT `fk_account_id`
    FOREIGN KEY (`account_id`)
    REFERENCES `dashboard_db`.`account` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `dashboard_db`.`block`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dashboard_db`.`block` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `dashboard_id` INT(11) NULL DEFAULT NULL,
  `variable_list` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_dashboard_id` (`dashboard_id` ASC) VISIBLE,
  CONSTRAINT `fk_dashboard_id`
    FOREIGN KEY (`dashboard_id`)
    REFERENCES `dashboard_db`.`dashboard` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 53
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `dashboard_db`.`variable`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dashboard_db`.`variable` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `type` VARCHAR(45) NULL DEFAULT NULL,
  `value` VARCHAR(45) NULL DEFAULT NULL,
  `block_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_block_id` (`block_id` ASC) VISIBLE,
  CONSTRAINT `fk_block_id`
    FOREIGN KEY (`block_id`)
    REFERENCES `dashboard_db`.`block` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 49
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
