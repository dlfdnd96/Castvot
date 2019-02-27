/**
 *
 * 공통 castvot namespace
 *
 * @return : object
 * @author : [개발] 한정기
 * @since : 2018-02-01
 */


if ( !window.$ ) {
    window.$ = jQuery;
}

var castvot;


castvot = ( function ( $ ) {




    // ============================================================
    // 일반 유틸
    // ============================================================
    var Util = function () {

        // 생성자가 없을시 강제 생성
        if ( !( this instanceof Util ) ) {
            return new Util();
        }

        this.browser   = this.myBrowser();
        this.userAgent = navigator.userAgent;
        this.appScheme = 'castvot://';
    };

    Util.prototype = {
        extendClass: function ( childClass, parentClass ) {
            //이미 require를 통해 상속처리가 되어져 있는 경우는 리턴
            if ( childClass.prototype.superClass ) return;

            //상속 받을 부모의 프로토 타입 객체를 생성한다.
            var superProto = new parentClass(); //파라미터 없이 호출한다.
            for ( var p in superProto )
                if ( superProto.hasOwnProperty( p ) ) delete superProto[ p ];

            childClass.prototype             = superProto;
            childClass.prototype.constructor = childClass;
            childClass.prototype.superClass  = parentClass;
        },

        /**
         * 치환
         * @param {string} val 값
         * @param {string} before 치환대상
         * @param {string} after 치환문자
         * @returns string
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        replaceAll: function ( val, before, after ) {
            return val.split( before ).join( after );
        },

        /**u
         * 크롬 브라우저 여부
         * @returns boolean
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        isChrome: function () {
            return /Chrome/g.test( navigator.userAgent );
        },

        /**
         * ie 브라우저 여부
         * @returns boolean
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        isIE: function () {
            return /(MSIE|Trident)/g.test( navigator.userAgent );
        },

        /**
         * 파이어폭스 브라우저 여부
         * @returns boolean
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        isFirefox: function () {
            return /Firefox/g.test( navigator.userAgent );
        },

        /**
         * 사파리 브라우저 여부
         * @returns boolean
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        isSafari: function () {
            return /(?=.*Apple)(?=.*Version)/g.test( navigator.userAgent );
        },

        myBrowser: function () {
            if ( this.isChrome() ) {
                return "Chrome";
            } else if ( this.isIE() ) {
                return "Internet Explorer";
            } else if ( this.isFirefox() ) {
                return "Firefox";
            } else if ( this.isSafari() ) {
                return "Safari";
            } else {
                return "other browser";
            }
        },

        /**
         * mobile 여부 체크
         * @returns boolean
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        isMobile: function () {
            return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test( navigator.userAgent.toLowerCase() );
        },

        /**
         * document.getElements~ 가져온 오브젝트 -> 배열 변환
         * @param {DomObject} elements 요소들
         * @returns Array.<T>
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        elementToArray: function ( elements ) {
            return Array.prototype.slice.call( elements );
        },

        /**
         * 추출 argument -> array 뱐환
         * @param {arguments} args arguments형태의인자
         * @returns Array.<T>
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        argumentsToArray: function ( args ) {
            return Array.prototype.slice.call( args );
        },

        /**
         * 콤마찍기
         * @param {number|string} str
         * @returns string
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        comma: function ( str ) {
            str = String( str );
            return str.replace( /(\d)(?=(?:\d{3})+(?!\d))/g, "$1," );
        },

        /**
         * 콤마풀기
         * @param {string} str
         * @returns string
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        uncomma: function ( str ) {
            str = String( str );
            return str.replace( /[^\d]+/g, "" );
        },

        /**
         * url 체크
         * @param {string} url 체크url
         * @returns boolean
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        validateUrl: function ( url ) {
            return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test( url );
        },

        /**
         * 객체 복사 ( 별도 객체 생성 )
         * @param {object} obj 복사할객체
         * @returns object
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        objectCopy: function ( obj ) {
            var copy      = Object.create( Object.getPrototypeOf( obj ) ); // 카피할 빈객체 생성
            var propNames = Object.getOwnPropertyNames( obj ); // 오브젝트 네임 추출

            propNames.forEach( function ( name ) {
                var desc = Object.getOwnPropertyDescriptor( obj, name ); // 오브젝트값 추출
                Object.defineProperty( copy, name, desc ); // 새로운 오브젝트에 할당
            } );

            return copy;
        },

        /**
         * 콜백함수 실행
         * @param {function} callback 백함수비필수
         * @param {object} callback_obj 콜백함수기준객체
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        instCallback: function ( params, callback, callback_obj ) {
            if ( typeof callback === "function" ) {
                ( typeof callback_obj === "undefined" ) ? callback( params ) : callback.call( callback_obj, params );
            }
        },

        /**
         * file to convert base64 URI SCHEMA , promise and callback
         * @returns Promise
         * @param {DomObject} fileElement 파일요소
         * @param {function} callback 백함수비필수
         * @param {function} callback_obj 콜백함수기준객체
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        fileBase64Convert: function ( fileElement, callback, callback_obj ) {
            if ( !fileElement || typeof fileElement !== "object" ) { throw { name: "Error", message: "fileElement is not object !" }}
            ;
            return new Promise( function ( resolve, reject ) {
                var reader = new FileReader();
                reader.readAsDataURL( fileElement );
                reader.onload  = function () {
                    Util().instCallback( reader.result, callback, callback_obj );
                    resolve( reader.result );
                };
                reader.onerror = function ( err ) {
                    Util().instCallback( reader.result, callback, callback_obj );
                    reject( err );
                };
            } );
        },

        /**
         * base64 encoding
         * @returns {string} encoding string
         * @param {string} str
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        encodeBase64: function ( str ) {
            return btoa( encodeURIComponent( str ) );
        },

        /**
         * base64 decoding
         * @returns {string} decoding string
         * @param {string} str
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        decodeBase64: function ( str ) {
            return decodeURIComponent( atob( str ) );
        },

        /**
         * 공통 api call
         * @param {string} url API URL
         * @param {object} params 파라미터
         * @param {object} extendOptions 추가 ajax 옵션
         * @param {boolean} isExternalAPI 외부 API 호출여부 false 시 코드값 분별 하지 않음
         * @returns Promise
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        apiCall: function ( url, params, extendOptions, isExternalAPI ) {

            var instence = this,
                promise  = $.Deferred(),
                options  = {
                    url   : url,
                    data  : params,
                    method: "POST"
                },
                _default = {

                    beforeSend: function () {

                        $('.wrap-loading').removeClass('display-none');

                    },

                    complete: function () {

                        $('.wrap-loading').addClass('display-none');

                    }

                };


            //extendOptions = ( extendOptions && extendOptions.isDim ) ? $.extend( {}, _default, extendOptions ) : extendOptions;
            // 딤처리 강제
            extendOptions = $.extend( {}, _default, extendOptions );

            if ( extendOptions ) options = $.extend( {}, options, extendOptions );

            $.ajax( options )
                .done( function ( result ) {

                    if ( options.dataType == 'html' ) {
                        result = Util().parseHtml( result );

                        new Util().settingLazyLoad( $( result ).find( 'img[data-src]' ) )

                        promise.resolve( result );
                    } else if ( typeof result !== "object" ) {
                        result = JSON.parse( result );
                    }

                    if ( typeof isExternalAPI === "boolean" && isExternalAPI ) promise.resolve( result );
                    else if ( result.code === 200 ) promise.resolve( result.data );
                    else promise.reject( result );

                } )
                .fail( function ( xhr ) {
                    try {
                        var json = JSON.parse( xhr.responseText );

                        promise.reject( json );

                        if ( xhr.status === 302 && json.code === 18 ) {
                            location.href = json.data;
                        }
                    } catch ( e ) {
                        promise.reject( xhr );
                    }

                } );

            return promise;
        },

        /**
         * flagment dom parser
         * @param {string} string dom
         * @author : [개발] 한정기
         * @since : 2018-02-01
         */
        parseHtml: function ( html ) {
            var t       = document.createElement( 'template' );
            t.innerHTML = html;
            return ( t.content || t ).cloneNode( true );
            ;
        },

        /**
         * 공통 api call
         * @param {string} 앱에 호출할 메서드 네임
         * @param {object} params 파라미터
         */
        appCall: function ( callMethodName, params ) {

            console.log( this.createUri( callMethodName, params ) );
            if ( castvot.global.isApp ) {
                location.href = this.createUri( callMethodName, params );
            }

        },

        /**
         * 공통 url 생성
         * @param {string} 앱에 호출할 메서드 네임
         * @param {object} params 파라미터
         * @param {string} 프로토콜 없을시 기본
         */
        createUri: function ( callMethodName, params, isProtocol ) {
            var protocal = ( isProtocol ) ? '' : this.appScheme,
                callUrl  = protocal + callMethodName;
            if ( params ) {
                callUrl += '?';
                Object.keys( params ).forEach( function ( item ) {
                    callUrl += item + '=' + params[ item ] + '&';
                } )
            }

            return callUrl;
        },

        /**
         * 동적 script 추가
         * @param {string} src 파일url
         * @param {string} tagElementName
         */
        addScript: function ( src, tagElementName ) {
            var scriptElement  = document.createElement( "script" );
            scriptElement.type = "text/javascript";
            scriptElement.src  = src;
            document.getElementsByTagName( tagElementName )[ 0 ].appendChild( scriptElement );
        },

        /**
         * location search string -> obj 변환 파라미터 추출
         * @return {object}
         */
        qureyToObj: function () {
            var qurey  = decodeURIComponent( window.location.search ).substring( 1 ),
                result = {};

            if ( qurey != '' ) {
                qurey.split( '&' ).forEach( function ( item, i ) {

                    var qureyArr  = item.split( '=' ),
                        paramsArr = qureyArr[ 1 ].split( ',' );

                    if ( paramsArr.length > 1 ) {

                        result[ qureyArr[ 0 ] ] = paramsArr;

                    } else {
                        result[ qureyArr[ 0 ] ] = paramsArr[ 0 ];
                    }

                } )
            }
            return result;
        },

        /**
         *
         * date formatting
         *
         * @param format
         * @param date
         * @author [개발] 한정기
         * @since 2018-02-20
         */
        dateFormat: function ( date, format ) {

            /**
             *
             * 2018-02-22 PM 14:53:25
             *
             * YY   : 18    | 년 앞에 2자리
             * YYYY : 2018  | 년
             * MM   : 02    | 월
             * DD   : 22    | 일
             * A    : PM    | 오전오후 대문자
             * a    : pm    | 오전오후 소문자
             * HH   : 14    | 시간
             * hh   : 02    | 시간 12시간기준
             * mm   : 53    | 분
             * ss   : 25    | 초
             * dd   : Th    | 요일 영어 앞 2자리
             * ddd  : Thu   | 요일 영어 앞 3자리
             * dddd : ....  | 요일 영어 전체
             *
             * */

            var dateFormat = ( format ) ? format : 'YYYY.MM.DD  A HH:mm';
            return moment( date ).format( dateFormat );

        },

        /**
         * 세션 스토리지 쿼리스트링 넣기
         *
         */
        setQureyString: function () {
            var url = location.pathname.split( '/' ),
                key = url[ url.length - 1 ];

            sessionStorage.clear();
            sessionStorage[ key ] = location.search.substring( 1 );
        },

        /**
         * 세션 스토리지 쿼리스트링 가져오기
         * @returns string
         *
         */
        getQureyString: function ( key ) {
            return ( sessionStorage[ key ] ) ? sessionStorage[ key ] : "";
        },

        /**
         * 오늘 부터 경과된 날짜
         * @param firstMillisecond
         * @return {number}
         */
        nowDateBetween: function ( firstMillisecond ) {
            return parseInt( ( new Date().getTime() - firstMillisecond ) / ( 1000 * 60 * 60 * 24 ) );
        },

        /**
         * 하위 프로퍼티 반환
         *
         * @param {object} obj  객체
         * @param {string} path 경로
         * @return {object} 하위 프로퍼티
         * @author [개발] 한정기
         * @since 2018-03-19
         */
        getNestedProperty: function ( obj, path ) {
            var result = obj;

            if ( obj && path ) {
                $( path.split( /\./ ) ).each( function ( i, v ) {
                    result = result[ v ];

                    if ( result === undefined ) {
                        return null;
                    }
                } );

                return result;
            } else {
                return null;
            }
        },

        /**
         * 가격 자동 콤마 소수점 2자리까지
         * @param {string} str
         * @returns string
         * @author : [개발] 한정기
         * @since : 2018-03-30
         */
        chkPrice: function ( str ) {
            str = String( str );
            str = str.replace( /[^\d|.]+/g, "" )

            if ( str.indexOf( '.' ) > 0 ) {
                var parts = str.split( '.' );
                str       = this.comma( parts[ 0 ] ) + '.' + parts[ 1 ].substr( 0, 2 );

            } else {
                str = this.comma( str );
            }

            return str;
        },

        /**
         *
         * 클립보드 카피
         *
         * @param text
         * @author : [개발] 한정기
         * @since : 2018-03-30
         */
        clipBoardCopy: function ( text ) {
            var temp = document.createElement( "input" );

            document.body.appendChild( temp );
            temp.value = text;

            if ( castvot.global.isApp && castvot.global.isIos ) {

                var editable = temp.contentEditable;
                var readOnly = temp.readOnly;

                temp.contentEditable = true;
                temp.readOnly        = false;

                var range = document.createRange();
                range.selectNodeContents( temp );

                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange( range );

                temp.setSelectionRange( 0, 999999 );
                temp.contentEditable = editable;
                temp.readOnly        = readOnly;

            } else {
                temp.select();
            }

            document.execCommand( "Copy" );
            document.body.removeChild( temp );

        },

        moveWebLayer: function ( encodeingUrl ) {

            var url = decodeURIComponent( encodeingUrl );
            //location.href = url;

            console.log( url )
            castvot.app.common.callOpenLayer( url );

        },

        moveWeb: function ( encodeingUrl ) {

            var url       = decodeURIComponent( encodeingUrl );
            location.href = url;

        },

        settingLazyLoad: function ( $target ) {

            if ( !$.fn.lazy ) return;

            var _lazyDefualtOption = {
                effect    : "fadeIn",
                effectTime: 500,
                threshold : 0
            }

            if ( $target && $target.length > 0 ) {

                $target.lazy( _lazyDefualtOption );
                setTimeout( function () {
                    $( document ).trigger( 'scroll' )
                }, 100 )
            } else {
                $( 'img[data-src]' ).lazy( _lazyDefualtOption );
            }
        },

        // 엘리먼트 뷰 여부
        elementInViewport: function ( el ) {
            var top    = el.offsetTop,
                left   = el.offsetLeft,
                width  = el.offsetWidth,
                height = el.offsetHeight;

            while ( el.offsetParent ) {
                el = el.offsetParent;
                top += el.offsetTop;
                left += el.offsetLeft;
            }

            return (
                top >= window.pageYOffset &&
                left >= window.pageXOffset &&
                ( top + height ) <= ( window.pageYOffset + window.innerHeight ) &&
                ( left + width ) <= ( window.pageXOffset + window.innerWidth )
            );
        }
    };


    // ============================================================
    // 팝업 관련 유틸
    // ============================================================
    var PopUpUtil = function () {

        if ( !( this instanceof PopUpUtil ) ) {

            // singleton
            if ( !popUpUtilInstence ) {
                popUpUtilInstence = new PopUpUtil();
            }
            return popUpUtilInstence;
        }

        this.openWindows   = {};
        this.defaultOption = "width=" + window.outerWidth / 2 + ", height=" + window.outerHeight / 2
            + ", top=" + window.outerHeight / 4 + ", left=" + window.outerHeight / 4 +
            ", resizable=no, scrollbars=no, status=no;";
        /*
         toolbar = 상단 도구창 출력 여부
         menubar = 상단 메뉴 출력 여부
         location = 메뉴아이콘 출력 여부
         directories = 제목 표시줄 출력 여부
         status = 하단의 상태바 출력 여부
         scrollbars = 스크롤바 사용 여부
         resizable = 팝업창의 사이즈 변경 가능 여부
         width = 팝업창의 가로 길이 설정
         height = 팝업창의 세로 길이 설정
         top = 팝업창이 뜨는 위치(화면 위에서부터의 거리 지정)
         left = 팝업창이 뜨는 위치(화면 왼쪽에서부터의 거리 지정)
         */

    };

    PopUpUtil.prototype = {

        /**
         * 팝업 열기
         * @param {string} url 팝업경로
         * @param {string} title 팝업고유네임
         * @param {object} option 옵션미지정시디폴트
         * @param {boolean} requestIsPost 포스트 전송여부
         * @param {object} postParams 포스트 전송 파람
         * @returns string 원도우명(객체관리 기준값)
         */
        openPopup: function ( url, title, option, requestIsPost, postParams ) {
            var openUrl    = ( requestIsPost ) ? "" : url,
                option     = option || this.defaultOption,
                windowName = title || String( parseInt( Math.random() * 1000000 ) ),
                tempForm   = document.createElement( 'form' ),
                postParams = ( typeof postParams !== 'object' ) ? {} : postParams,
                input      = {};

            this.openWindows[ windowName ] = window.open( openUrl, windowName, option );

            // 포스트 팝업 이동및 데이터 전송
            if ( requestIsPost ) {
                document.body.appendChild( tempForm );
                for ( var key in postParams ) {
                    input = document.createElement( 'input' );
                    input.setAttribute( 'name', key );
                    input.setAttribute( 'value', postParams[ key ] );
                    input.setAttribute( 'type', 'hidden' );
                    tempForm.appendChild( input );
                }
                tempForm.target = windowName;
                tempForm.action = url;
                tempForm.submit();
                tempForm.remove();
            }

            return windowName;
        },

        /**
         * 팝업 닫기
         * @param {string} windowName
         * @returns string
         */
        closePopup: function ( windowName ) {
            if ( Object.keys( this.openWindows ).length > 0 ) {
                this.openWindows[ windowName ].close();
            }
            return windowName;
        },

        /**
         * 모든 팝업 닫기
         * @returns number
         *
         */
        closeAllPopup: function () {
            var closeCnt = 0;
            for ( var idx in this.openWindows ) {
                this.openWindows[ idx ].close();
                closeCnt++;
            }
            return closeCnt;
        }

    };

    // ============================================================
    // jquery 확장함수
    // ============================================================
    $.fn.test = function () {
        console.log( "test function" );
        console.log( this );
    };

    /**
     * 이미지 미리보기
     * @param fileTargetId : 파일태그아이디
     * @param viewTargetId : 뷰이미지태그아이디
     */
    $.fn.preViewImage = function ( viewTargetId ) {
        var file = this[ 0 ].files[ 0 ];

        if ( file ) {
            if ( castvot.global.imageFileType.indexOf( file.type.split( "/" )[ 1 ] ) < 0 ) {
                return;
            } else {
                Util().fileBase64Convert( file, function ( dataSchema ) {
                    document.getElementById( viewTargetId ).src = dataSchema;
                } )
            }
        }
    };

    return $.extend( {}, castvot, {
        util : new Util(),
        popup: new PopUpUtil(),
        global: {
            imageFileType		: [ "jpg", "png", "jpeg" ]
        }
    } )

} )( $ );

