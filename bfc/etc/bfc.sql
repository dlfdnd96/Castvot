/*

TODO: view에서 sub query 인덱스 안타는듯..

실환경 www에서 붙을땐 아래꺼만 적용

CREATE USER 'aaaaaaaaaaa'@'172.%' IDENTIFIED BY 'xxxxxx';
GRANT select, update, insert ON projbfc.bfc_passport_user TO XXXX;
GRANT select, insert ON projbfc.bfc_boys TO XXXX;
GRANT select ON projbfc.bfc_v_main TO XXXX;
GRANT select ON projbfc.bfc_v_detail TO XXXX;

admin에서 붙을땐 아래 권한만 적용

CREATE USER 'bbbbbbbb'@'172.31.20.162' IDENTIFIED BY 'xxxxxxxx';
GRANT select, insert, update, delete ON projbfc.bfc_admin_user TO XXXX;
GRANT select, insert, update ON projbfc.bfc_boys TO XXXX;
GRANT SELECT (pk,boy_pk,coin_type,account), INSERT , UPDATE ON projbfc.bfc_coin TO XXXX;
GRANT select, update, insert ON projbfc.bfc_coin_val TO XXXX;
GRANT select ON projbfc.bfc_passport_user TO XXXX;
GRANT select ON projbfc.bfc_user_history TO XXXX;
GRANT select ON projbfc.bfc_v_detail TO XXXX;
GRANT select ON projbfc.bfc_v_history TO XXXX;
GRANT select ON projbfc.bfc_v_main TO XXXX;
GRANT select ON projbfc.bfc_v_summary TO XXXX;
*/

DROP TABLE IF EXISTS bfc_admin_user;
DROP TABLE IF EXISTS bfc_passport_user;
DROP TABLE IF EXISTS bfc_user_history;
DROP TABLE IF EXISTS bfc_boys;
DROP TABLE IF EXISTS bfc_coin_val;

/* admin 에서 사용되는 테이블 */
CREATE TABLE IF NOT EXISTS `bfc_admin_user` (
   pk int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id` varchar(20) NOT NULL UNIQUE,
  `password` varchar(100) NOT NULL,
  `name` varchar(10) NOT NULL,
  `cdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* sns oauth2 로그인 테이블 */
/* user_identify_id를 varchar(64)로 변경...스펙좀 봅시다요들....
INSERT INTO bfc_passport_user2 (pk,cdate,mdate,user_name,user_sns,user_identify_id)
    SELECT pk,cdate,mdate,user_name,user_sns,CAST(user_identify_id AS CHAR)
    FROM bfc_passport_user;
bfc_passport_user2 랑 bfc_passport_user 바꿔치기 후 누락된거 추가 및 수정
INSERT INTO bfc_passport_user (user_name,user_sns,user_identify_id) VALUES ('방울토마토','google','102670838548413719837');
INSERT INTO bfc_passport_user (user_name,user_sns,user_identify_id) VALUES ('hyekyung shin','google','114549901205660429704');
UPDATE bfc_boys SET user_pk=334 WHERE pk=17;
UPDATE bfc_boys SET user_pk=335 WHERE pk IN (25,26,29);

*/
CREATE TABLE IF NOT EXISTS `bfc_passport_user` (
   pk int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `cdate`	TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `mdate`	TIMESTAMP DEFAULT 0 NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_sns` VARCHAR(16) NOT NULL,
  `user_identify_id` VARCHAR(64) NOT NULL,
  UNIQUE KEY `unique_sns` (`user_sns`,`user_identify_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* 유저히스토리. admin쪽에서는 사용 안함. 별도로 테이블 필요. 나중에 증적용으로 냄기는 놈임 */
CREATE TABLE IF NOT EXISTS `bfc_user_history` (
   pk int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `actiontime`	TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `user_pk`  INT NOT NULL,
  `action`  VARCHAR(255) NOT NULL,
  INDEX idx_user(`user_pk`),
  INDEX idx_action(`actiontime`,`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE VIEW bfc_v_history AS
SELECT u.pk AS upk, h.pk AS hpk, h.actiontime,u.user_name,u.user_sns,action FROM bfc_user_history AS h JOIN bfc_passport_user AS u ON h.user_pk=u.pk;

/*
 트리거 사용시 log_bin_trust_function_creators = 1 설정 필요 
 로그인시 기록
 첫번째 로그인은 기록 안함
*/
DELIMITER $$
CREATE TRIGGER trigger_update_login
AFTER UPDATE ON bfc_passport_user FOR EACH ROW
BEGIN
  INSERT INTO bfc_user_history ( actiontime, user_pk, action)
    VALUES ( NEW.mdate, NEW.pk, "LOGIN" );
END$$
DELIMITER ;

/* 후보자 목록  */
CREATE TABLE IF NOT EXISTS `bfc_boys` (
   pk int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `cdate`	TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `mdate`	TIMESTAMP DEFAULT 0 NOT NULL,
  `status`	ENUM('DRAFT', 'ACTIVE', 'REJECT') DEFAULT 'DRAFT',
  `user_pk`  INT NOT NULL,
  `boy_name` varchar(32) NOT NULL,
  `boy_sns` varchar(64) DEFAULT NULL,
  `public_agree` boolean NOT NULL DEFAULT 0,
  `reason` TEXT NOT NULL,
  `photo1` char(60) NOT NULL,
  `photo1_src` varchar(255),
  `photo2` char(60) DEFAULT NULL,
  `photo2_src` varchar(255),
  `photo3` char(60) DEFAULT NULL,
  `photo3_src` varchar(255),
  `del_yn` tinyint(4) DEFAULT '0',
  INDEX idx_st1(status,del_yn,cdate),
  INDEX idx_bname(boy_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* bfc_boys 인서트시 로깅 */
DELIMITER $$
CREATE TRIGGER trigger_newboy_insert
AFTER INSERT ON bfc_boys FOR EACH ROW
BEGIN
  INSERT INTO bfc_user_history ( actiontime, user_pk, action)
    VALUES ( NEW.cdate, NEW.user_pk, CONCAT("INSERT:bfc_boys:",NEW.pk) );
END$$
DELIMITER ;

/* 지갑 정보 */
CREATE TABLE IF NOT EXISTS `bfc_coin` (
  `pk` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `boy_pk` int NOT NULL,
  `coin_type` varchar(16) NOT NULL,
  `account` varchar(64) DEFAULT NULL,
  `secret` varchar(1024) DEFAULT NULL,
  INDEX idx_boys_coin(boy_pk,coin_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* 잔고 잔액용
 * TODO: 잔고 가져왔을때 해당시간 환율 계산하여 usd에 넣어주세요.
 */
CREATE TABLE IF NOT EXISTS `bfc_coin_val` (
  `pk` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `seq` varchar(32),
  `coin_pk` int NOT NULL,
  `cdate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `value` DECIMAL(16,8) NOT NULL,
  `usd` DECIMAL(16,2) NOT NULL,
  INDEX idx_coin(`coin_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* 메인 ajax에서 사용할 view 합산만 필요하므로 보정갑 적용함 */
/* 임시로 QTUM은 (IFNULL(value,0.01)-0.01) 였으나 빼버림 */
CREATE OR REPLACE VIEW bfc_v_main AS
SELECT b.pk AS boyid, boy_name AS name, photo1 AS photo, 
  SUM(
    CASE coin_type
    WHEN 'XRP' THEN (IFNULL(value,20)-20) * usd
    WHEN 'QTUM' THEN 0.0 * usd
    ELSE IFNULL(value,0.0) * usd END
    ) AS total
FROM bfc_boys AS b
LEFT JOIN bfc_coin AS c ON c.boy_pk=b.pk 
LEFT JOIN(
  SELECT coin_pk,value,usd FROM bfc_coin_val
  WHERE pk IN (
    SELECT MAX(pk) FROM bfc_coin_val GROUP BY coin_pk
  )
) AS v ON v.coin_pk=c.pk
WHERE b.status='ACTIVE'
GROUP BY b.pk ORDER BY total DESC ,b.pk;

/* 상세보기에서 사용할 view , 상세값이 필요하므로 보정값은 jquery에서 수행함 */
CREATE OR REPLACE VIEW bfc_v_detail AS
SELECT b.pk AS boyid, boy_name AS name, boy_sns AS sns, reason, photo1, photo1_src, photo2, photo2_src, photo3, photo3_src, public_agree, user_sns, user_name AS author,
CONCAT("[",GROUP_CONCAT(CONCAT(
	'{"coinname":"', coin_type,
	'","account":"',account,
	'","coins":',IFNULL(value,0),
	',"usd":',IFNULL(usd,0),
	',"updated":"',IFNULL(v.cdate,'null'),
	'"}')),"]"
) AS accounts
FROM bfc_boys AS b
JOIN bfc_passport_user AS u ON b.user_pk=u.pk
LEFT JOIN bfc_coin AS c ON c.boy_pk=b.pk 
LEFT JOIN(
  SELECT coin_pk,value,cdate,usd FROM bfc_coin_val
  WHERE pk IN (
    SELECT MAX(pk) FROM bfc_coin_val GROUP BY coin_pk
  )
) AS v ON v.coin_pk=c.pk
WHERE b.status='ACTIVE'
GROUP BY b.pk;

/* 임시 총액 확인용 view */
CREATE OR REPLACE VIEW bfc_v_summary AS
SELECT b.pk AS boyid, boy_name AS name, 
  SUM(value * usd) AS total,
CONCAT("[",GROUP_CONCAT(CONCAT(
	'{"coinname":"', coin_type,
	'","coins":',IFNULL(value,0),
	',"usd":',IFNULL(usd,0),
	',"updated":"',IFNULL(v.cdate,'null'),
	'"}')),"]"
) AS accounts
FROM bfc_boys AS b
LEFT JOIN bfc_coin AS c ON c.boy_pk=b.pk 
LEFT JOIN(
  SELECT coin_pk,value,usd,cdate FROM bfc_coin_val
  WHERE pk IN (
    SELECT MAX(pk) FROM bfc_coin_val GROUP BY coin_pk
  )
) AS v ON v.coin_pk=c.pk
WHERE b.status='ACTIVE'
GROUP BY b.pk ORDER BY total DESC ,b.pk;
