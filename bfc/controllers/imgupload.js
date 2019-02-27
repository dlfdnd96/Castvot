
// ajax upload

var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var readChunk = require('read-chunk');
var fileType = require('file-type');
var Upload = require('s3-uploader');

var s3client = new Upload(config.s3resizeimg.bucketname, config.s3resizeimg.options);


exports.UploadImages = function (req, res) {
    var form = new formidable.IncomingForm();

    // TODO: 인증체크
    // TODO: 사이즈체크

    // Tells formidable that there will be multiple files sent.
    form.multiples = false;
    // Upload directory for the images
    form.uploadDir = config.s3resizeimg.tmpdir;

    // Invoked when a file has finished uploading.
    form.on('file', function (name, file) {
        // multiple 업로드 일단 제외
        /*
        if (photos.length === 3) {
            fs.unlink(file.path);
            return true;
        }
*/
        var buffer = null,
            type = null;
            //filename = '';

        // Read a chunk of the file.
        buffer = readChunk.sync(file.path, 0, 262);
        // Get the file type using the buffer read using read-chunk
        type = fileType(buffer);
        console.log("uploadimg:" + file.path);
        // Check the file type, must be either png,jpg or jpeg
        if (type !== null && (type.ext === 'png' || type.ext === 'jpg' || type.ext === 'gif')) {

            // S3에 저장
            // WTF: tmp_uploads\upload_5df6a26b5c59933ff67a0777dc3f2a7e 식으로 저장되서 S3에 원본은 확장자가 안붙음.
            fs.rename(file.path, file.path + "." + type.ext, function() {
                    
                s3client.upload(file.path + "." + type.ext, {}, function(err, versions, meta) {
                    if (err) { // Access Denied 확인
                        console.error("s3upload",err);
                        res.status(200).json({
                            status: false,
                            message: '업로드시 오류가 발생하였습니다.'
                        });
                    } else {
                        // 썸네일은 첫번째꺼, 원본(파일명)은 마지막꺼
                        console.log(path.basename(versions.slice(-1)[0].url),config.cdn_host + "files/bfc/" + path.basename(versions[0].url));
            
                        versions.forEach(function(image) {
                            // TODO: 로그인 userid 추가
                            console.log("imgupload:", image.url, image.width, image.height);
                            // https://s3-ap-northeast-2.amazonaws.com/img1.castvot.com/public/files/bfc/3057e843-0266-436c-877a-9c781cc418cf-small.jpg
                            // https://s3-ap-northeast-2.amazonaws.com/img1.castvot.com/public/files/bfc/3057e843-0266-436c-877a-9c781cc418cf.png
                        });
                        res.status(200).json({
                            status: true,
                            //filename: path.basename(versions.slice(-1)[0].url),
                            //type: type.ext,
                            //publicPath: config.cdn_host + "files/bfc/" + path.basename(versions[0].url),
                            imgkey: path.basename(versions.slice(-1)[0].url).split(".")[0]
                        });
                        console.log('Image Upload OK !!!');
                    }
                }); // end s3client.upload
                    
            });

        } else {
            res.status(200).json({status: false,
                message: '파일형식은 png, jpg, jpeg만 지원합니다.'
            });
            fs.unlink(file.path);
            console.log('Not ext...');
        }
    });

    form.on('error', function(err) {
        res.status(200).json({status: false,
            message: '에러2'
        });
        console.log('Error occurred during processing - ' + err);
    });

    // Invoked when all the fields have been processed.
    form.on('end', function() {
        console.log('All the request fields have been processed.');
    });

    // Parse the incoming form fields.
    form.parse(req, function (err, fields, files) {
        //console.log('Parse the incoming form fields.');
        //res.status(200).json(photos);
    });

};