package com.castvot.admin.service.aws;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.castvot.admin.common.FileType;
import com.castvot.admin.common.ResultType;
import com.castvot.admin.vo.common.CommonFileParam;
import com.castvot.admin.vo.common.CommonFileResultVO;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.Instant;

import static com.castvot.admin.common.FileType.findFileType;

@Service( "amazonS3Service" )
public class AmazonS3Service {

    private static final Logger LOGGER = LoggerFactory.getLogger( AmazonS3Service.class );

    @Value( "${aws.s3.bucketName}" )
    private String s3BucketName;

    @Value( "${image.file.max.size}" )
    private long imageFileMaxSize;              // 이미지 파일 사이즈

    @Value( "${etc.file.max.size}" )
    private long ectFileMaxSize;                // 기타 파일 사이즈

    @Autowired
    private AmazonS3 amazonS3;

    /**
     * AWS S3 Bucket 반환
     *
     * @return
     * @author [개발] 한정기
     * @since 2018-02-20
     */
    public String getS3BucketName() {

        return s3BucketName;
    }

    /**
     * S3 file 을 InputStream 으로 반환.
     *
     * @param s3FilePath
     * @return
     * @author [개발] 한정기
     * @since 2018-03-16
     */
    public S3Object getObject( String s3FilePath ) {

        S3Object object = amazonS3.getObject( new GetObjectRequest( s3BucketName, s3FilePath ) );
        return object;
    }

    /**
     * S3 trenshow-dev bucket 내부의 파일 복사 메서드.
     *
     * @param sourceKey      경로를 포함하는 원본 파일 경로. 앞에 '/' 를 뺴고 시작하는 점에 유의 ex) "tmp/test/chanceTheRapper2.jpg"
     * @param destinationKey 파일 복사가 이루어질 경로. 앞에 '/' 를 뺴고 시작하는 점에 유의 ex) "tmp/test2/chanceTheRapper2.jpg"
     * @return
     * @throws Exception
     * @author [개발] 한정기
     * @since 2018-04-17
     */
    public CopyObjectResult copyObject( String sourceKey, String destinationKey ) {

        CopyObjectResult copyObjectResult = amazonS3.copyObject( s3BucketName, sourceKey, s3BucketName, destinationKey );
        return copyObjectResult;
    }

    /**
     * S3 trenshow-dev bucket 내부의 파일 삭제 메서드.
     *
     * @param key 삭제될 파일의 경로. 앞에 '/' 를 뺴고 시작하는 점에 유의 ex) "tmp/test/chanceTheRapper2.jpg"
     * @author [개발] 한정기
     * @since 2018-04-17
     */
    public void deleteObject( String key ) {

        amazonS3.deleteObject( s3BucketName, key );
    }

    /**
     * S3 trenshow-dev bucket 내부의 파일 이동 메서드.
     *
     * @param sourceKey      경로를 포함하는 원본 파일 경로. 앞에 '/' 를 뺴고 시작하는 점에 유의 ex) "tmp/test/chanceTheRapper2.jpg"
     * @param destinationKey 파일 이동 target 경로. 앞에 '/' 를 뺴고 시작하는 점에 유의 ex) "tmp/test2/chanceTheRapper2.jpg"
     * @author [개발] 한정기
     * @since 2018-04-17
     */
    public void moveObject( String sourceKey, String destinationKey ) {

        amazonS3.copyObject( s3BucketName, sourceKey, s3BucketName, destinationKey );
        amazonS3.deleteObject( s3BucketName, sourceKey );
    }

    /**
     * 파일 업로드 메서드
     *
     * @param commonFileParam
     * @return
     * @throws Exception
     * @author [개발] 한정기
     * @since 2018-02-20
     */
    public CommonFileResultVO putObject( CommonFileParam commonFileParam ) throws Exception {

        return putObject( commonFileParam, CommonFileResultVO.class );
    }

    /**
     * 파일 업로드 메서드
     *
     * @param commonFileParam
     * @param type
     * @return
     * @throws Exception
     * @author [개발] 한정기
     * @since 2018-03-19
     */
    public < T extends CommonFileResultVO > T putObject( CommonFileParam commonFileParam, Class < T > type ) throws Exception {

        T fileResultVO = type.newInstance();

        /**
         * 파라미터 검증
         */
        fileResultVO = this.evaluateFileParamVO( commonFileParam, type );
        if ( fileResultVO.getCode() != ResultType.SUCCESS.getCode() ) {
            return fileResultVO;
        }

        FileType uploadFileType = commonFileParam.getUploadFileType();

        MultipartFile file = commonFileParam.getFile();
        String contentType = file.getContentType();
        String originFileName = file.getOriginalFilename();
        String savePath = commonFileParam.getSavePath();
        String suffix = file.getContentType().split( "/" )[ 1 ].toUpperCase();

        /**
         * sha1 파일이름 생성
         */
        String sha1HexFilename = DigestUtils.sha1Hex( originFileName + Instant.now().toEpochMilli() );
        String origin = sha1HexFilename + ".jpg";


        // 원본 접미사 확장자 사용시 주석해제
        //String sha1HexFilename = DigestUtils.sha1Hex( originFileName + Instant.now().toEpochMilli() ) + "." + suffix.toLowerCase();

        String s3SavePath = savePath + "/" + origin;

        PutObjectResult putObjectResult = null;

        if ( uploadFileType.equals( FileType.IMAGE ) ) {

            /**
             * 이미지 저장 
             */
            try ( InputStream is = file.getInputStream() ) {
                byte[] bytes = null;
                bytes = IOUtils.toByteArray( is );
                putObjectResult = this.transferToS3Bucket( bytes, s3SavePath, contentType );
            }

            /**
             * 썸네일 생성을 원한다면, 
             */
            if ( commonFileParam.isThumbNail() ) {
                for ( int widthSize : commonFileParam.getThumbNailSize() ) {
                    try ( InputStream is = file.getInputStream() ) {

                        String thumbName = "";

                        // 아... 썸네일이름을 사이즈로 정의햐야하는거 아닌가......참내.. ㅡㅡ;
                        if ( widthSize == 220 ) {
                            thumbName += sha1HexFilename + "-small.jpg";
                        } else if ( widthSize == 280 ) {
                            thumbName += sha1HexFilename + "-large.jpg";
                        }

                        //String thumbName = "thumb_" + widthSize + "_" + sha1HexFilename;
                        //String bucketSavePath = savePath + "/" + thumbName;
                        String bucketSavePath = savePath + "/" + thumbName;

                        generateThumbnailFromImage( is, widthSize, bucketSavePath, file.getContentType(), suffix, commonFileParam.isImageCenterCroping() );
                    }
                }
            }

        } else if ( uploadFileType.equals( FileType.ETC ) ) {
            try ( InputStream is = file.getInputStream() ) {
                putObjectResult = this.transferToS3Bucket( IOUtils.toByteArray( is ), s3SavePath, contentType );
            }
        }

        if ( putObjectResult == null ) {
            /**
             * 파일 업로드 실패 처리
             */
        }

        /**
         * 사용자에게 전달할 info VO
         */
        fileResultVO.setFileName( sha1HexFilename );
        fileResultVO.setFilePath( savePath );
        fileResultVO.setContentType( contentType );
        fileResultVO.setFullPath( s3SavePath );
        fileResultVO.setOriginFileName( originFileName );

        return fileResultVO;
    }

    /**
     * 이미지(Image)로 부터 썸네일(Thumbnail) 생성
     *
     * @param inputStream
     * @param maxThumbSize
     * @param suffix
     * @param isImageCropping
     * @return
     * @throws Exception
     * @author [개발] 한정기
     * @since 2018-03-21
     */
    private void generateThumbnailFromImage( InputStream inputStream, int maxThumbSize, String bucketSavePath, String contentType, String suffix, boolean isImageCropping ) throws Exception {

        BufferedImage image = ImageIO.read( inputStream );
        byte[] bytes = null;

        int imageWidth = image.getWidth();
        int imageHeight = image.getHeight();

        int thumbWidth = 0;
        int thumbHeight = 0;

        /**
         * 가로 크기가 더 길거나 같은 경우,
         */
        if ( imageWidth >= imageHeight ) {
            thumbWidth = maxThumbSize;
            thumbHeight = ( ( maxThumbSize * 100 ) / imageWidth ) * imageHeight / 100;
        } else {
            thumbWidth = ( ( maxThumbSize * 100 ) / imageHeight ) * imageWidth / 100;
            thumbHeight = maxThumbSize;
        }

        ByteArrayOutputStream bytesOS = new ByteArrayOutputStream();
        Thumbnails.of( image ).forceSize( thumbWidth, thumbHeight ).outputFormat( suffix.toLowerCase() ).toOutputStream( bytesOS );
        bytes = bytesOS.toByteArray();

        this.transferToS3Bucket( bytes, bucketSavePath, contentType );
    }

    /**
     * 업로드 파라미터 유효성 검증
     *
     * @param commonFileParam
     * @param type
     * @return
     * @throws Exception
     * @author [개발] 한정기
     * @since 2018-03-19
     */
    private < T extends CommonFileResultVO > T evaluateFileParamVO( CommonFileParam commonFileParam, Class < T > type ) throws Exception {

        T fileResultVO = type.newInstance();

        if ( commonFileParam == null || commonFileParam.getFile().isEmpty() ) {
            fileResultVO.setCode( ResultType.FILE_IS_NULL );
            return fileResultVO;
        }

        MultipartFile file = commonFileParam.getFile();
        long fileSize = file.getSize();
        String suffix = file.getContentType().split( "/" )[ 1 ].toUpperCase();

        // 파일 타입 셋팅
        FileType fileType = ( commonFileParam.getUploadFileType() != null ) ? commonFileParam.getUploadFileType() : findFileType( suffix );
        commonFileParam.setUploadFileType( fileType );

        FileType excludeFileType = commonFileParam.getExcludeFileType();
        long maxFileSize = ( commonFileParam.getMaxFileSize() > 0 ) ? commonFileParam.getMaxFileSize() : 0;

        /**
         * 검증
         */
        if ( fileType.getTypeList().size() < 1 ) {
            fileResultVO.setCode( ResultType.FILE_TYPE_REJECT );
            return fileResultVO;
        }

        if ( excludeFileType != null && excludeFileType == fileType ) {
            fileResultVO.setCode( ResultType.FILE_TYPE_REJECT );
            return fileResultVO;

        } else if ( !( fileType.isFileType( suffix ) ) ) {
            // 파일 타입 체크
            fileResultVO.setCode( ResultType.FILE_TYPE_REJECT );
            return fileResultVO;

        }

        if ( maxFileSize < 1 ) {
            // 디폴트 값 셋팅
            switch ( fileType ) {
                case IMAGE: {
                    maxFileSize = imageFileMaxSize;
                    break;
                }
                case ETC: {
                    maxFileSize = ectFileMaxSize;
                    commonFileParam.setThumbNail( false );
                    break;
                }
                default:
                    break;
            }
        }

        if ( maxFileSize < fileSize ) {
            // 파일 사이즈 체크
            fileResultVO.setCode( ResultType.FILE_SIZE_OVER );
            return fileResultVO;
        }

        return fileResultVO;
    }

    /**
     * S3 파일 전송
     *
     * @param bytes
     * @param fileFullPathName
     * @param contentType
     * @return
     * @throws Exception
     * @author [개발] 한정기
     * @since 2018-02-20
     */
    private PutObjectResult transferToS3Bucket( byte[] bytes, String fileFullPathName, String contentType ) throws Exception {

        long contentLength = this.getContentLength( bytes, fileFullPathName );
        return this.transferToS3Bucket( bytes, fileFullPathName, contentType, contentLength );
    }

    /**
     * S3 파일 전송
     *
     * @param bytes
     * @param fileFullPathName
     * @param contentType
     * @param contentLength
     * @return
     * @throws Exception
     * @author [개발] 한정기
     * @since 2018-03-21
     */
    private PutObjectResult transferToS3Bucket( byte[] bytes, String fileFullPathName, String contentType, long contentLength ) throws Exception {

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType( contentType );
        metadata.setContentLength( contentLength );

        String bucketName = s3BucketName;
        PutObjectResult putObjectResult = null;

        try ( InputStream is = new ByteArrayInputStream( bytes ) ) {

            putObjectResult = amazonS3.putObject( new PutObjectRequest( bucketName, fileFullPathName, is, metadata ) );
            amazonS3.setObjectAcl( bucketName, fileFullPathName, CannedAccessControlList.PublicRead );

        } catch ( AmazonServiceException ase ) {
            LOGGER.debug( "Caught an AmazonServiceException, which " +
                    "means your request made it " +
                    "to Amazon S3, but was rejected with an error response" +
                    " for some reason." );
            LOGGER.debug( "Error Message:    " + ase.getMessage() );
            LOGGER.debug( "HTTP Status Code: " + ase.getStatusCode() );
            LOGGER.debug( "AWS Error Code:   " + ase.getErrorCode() );
            LOGGER.debug( "Error Type:       " + ase.getErrorType() );
            LOGGER.debug( "Request ID:       " + ase.getRequestId() );
        } catch ( AmazonClientException ace ) {
            LOGGER.debug( "Caught an AmazonClientException, which " +
                    "means the client encountered " +
                    "an internal error while trying to " +
                    "communicate with S3, " +
                    "such as not being able to access the network." );
            LOGGER.debug( "Error Message: " + ace.getMessage() );
        }

        return putObjectResult;
    }

    /**
     * bytes 를 이용해 임시 파일 생성 후 content length 구하기
     *
     * @param bytes
     * @param fileFullPathName
     * @return
     * @throws Exception
     * @author [개발] 한정기
     * @since 2018-03-21
     */
    private long getContentLength( byte[] bytes, String fileFullPathName ) throws Exception {

        long contentLength;
        String shaHex = DigestUtils.sha1Hex( fileFullPathName );
        File target = File.createTempFile( shaHex, "tmp" );

        try ( ByteArrayInputStream bais = new ByteArrayInputStream( bytes ) ) {

            System.out.println( "LOOK CHECKING ==> " + shaHex );
            System.out.println( "toPath ==> " + target.toPath() );

            Files.copy( bais, target.toPath(), StandardCopyOption.REPLACE_EXISTING );

            contentLength = target.length();
        } finally {
            target.delete();
        }

        return contentLength;
    }
}
