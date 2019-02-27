/*
 * 공용 사용 펑션 정의
 * 
 * Author: Mason Ryu
 * 
 * TODO: sharp에서 지원하지 않는 파일일 경우 exception 처리.
 *
 */

// 사진 resize 하는 모듈
/*
exports.uploadFileResize = function(originalPath, newPath) {
    var sharp = require('sharp');
    sharp(originalPath).resize(300, 300, {
        kernel: sharp.kernel.nearest
    }).toFile(newPath).jpg();
}
*/

/*
// 랜덤 문자 생성 모듈
exports.createRandomString = function() {
    var crypto = require('crypto');
    var all_strings = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";
    for(var i=0; i<24; i++) {
        result += all_strings.charAt(Math.floor(Math.random() * all_strings.length));
    }
    return result;
}
*/

// 임시 IP 확인 로직
const allowIP = ["localhost","::1","222.106.180.132","222.121.96.67","127.0.0.1","180.228.18.13","::ffff:127.0.0.1"];
exports.checkDevIP = function(ip) {
    if (config.is_product) return true;
    if (allowIP.includes(ip)) return true;
    return false
}