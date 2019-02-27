$(document).ready(function() {

        // 위로 가기
        $(window).scroll(function() {
            var windowT = $(window).scrollTop();
            if(windowT == 0) {
                $('.moveTop').stop().animate({'bottom':'-100px', 'opacity':'0'},300);
            }
            else {
                $('.moveTop').stop().animate({'bottom':'50px', 'opacity':'1'},300);
            }
        });
        $('.moveTop').click(function() {
            $('.moveTop').stop().animate({'bottom':'-100px', 'opacity':'0'},300);
            $('html').stop().animate({'scrollTop':'0'},500);
        });
        $('.moreBtn').mouseenter(function() {
            $(this).find('.bg').stop().animate({'width':'0'},180).animate({'width':'100%'},150);
        });

        // 반응형일 때 햄버거 메뉴
        $('.navbar').click(function() {
            $this = $(this);
            $this.toggleClass('after');
            $this.toggleClass('on');
            $this.css('position','fixed');

            if($(this).hasClass('after')) {
                $('header nav').show().stop().animate({'right':'0'},300);
                $('header .search').show().stop().animate({'right':'0'},300);

                $('#bg').delay(200).show();

                // 스크롤 막기
                $('html, body').on('scroll touchmove mousewheel', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });

                $('#bg').click(function() {
                    $this.removeClass('after','on');
                    $('header nav').fadeOut().stop().animate({'right':'-80%'},100);
                    $('header .search').fadeOut().stop().animate({'right':'-80%'},100);

                    $('#bg').delay(200).hide();

                    // 스크롤 다시 허용
                    $('html, body').off('scroll touchmove mousewheel');
                });
            }
            else {
                $('header nav').fadeOut().stop().animate({'right':'-80%'},100);
                $('header .search').fadeOut().stop().animate({'right':'-80%'},100);

                $('#bg').delay(200).hide();

                // 스크롤 다시 허용
                $('html, body').off('scroll touchmove mousewheel');
            }
        });

        
        // input type="file"
        var fileTarget = $('.filebox .upload-hidden'); fileTarget.on('change', function() { // 값이 변경되면
            if(window.FileReader) { // modern browser var
                filename = $(this)[0].files[0].name;
            }
            else { // old IE
                var filename = $(this).val().split('/').pop().split('\\').pop(); // 이미지 권장 사이즈는 250px * 250px (1:1 비율) 입니다.만 추출
            } // 추출한 이미지 권장 사이즈는 250px * 250px (1:1 비율) 입니다. 삽입
            $(this).siblings('.upload-name').val(filename);
        });

        // input 데이터값 받아오기
        var selectBJ = $('#selBjEmail option:selected').text();
        $('.bjEmail .noTxt').find('input').attr('placeholder',selectBJ);
        $('#selBjEmaill').click(function(){
            var selectBJ = $('#selBjEmail option:selected').text();
            $(this).parents('.inputBox').prev().find('input').val(selectBJ).attr('readonly');
            if(selectBJ == '직접입력') {
                $(this).parents('.inputBox').prev().find('input').removeAttr('readonly').val('').attr('placeholder','입력해주세요.').css('background','#fff');
            }
            else if(selectBJ != '직접입력') {
                $(this).parents('.inputBox').prev().find('input').css('background-color','#efefef').attr('readonly','readonly');
            }
        });

        var comEmail = $('#selComEmail option:selected').text();
        $('.comEmail .noTxt').find('input').attr('placeholder',comEmail);
        $('#selComEmail').click(function(){
            var comEmail = $('#selComEmail option:selected').text();
            $(this).parents('.inputBox').prev().find('input').val(comEmail).attr('readonly');
            if(comEmail == '직접입력') {
                $(this).parents('.inputBox').prev().find('input').removeAttr('readonly').val('').attr('placeholder','입력해주세요.').css('background','#fff');
            }
            else if(comEmail != '직접입력') {
                $(this).parents('.inputBox').prev().find('input').css('background-color','#efefef').attr('readonly','readonly');
            }
        });

        // 팝업
        // popupOn('.recommendC .pinkBtn', '.alertPop', '.popbg');
        popupOff('.alertPop .title>img');
        popupOff('.alertPop #btn_close');


    // 팝업띄우기 popupOn('클릭하는 버튼');
    function popupOn(classN, popupN, bg) {
        $(classN).click(function() {
            // 스크롤 막기
            $('#popbg').on('scroll touchmove mousewheel', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });

            $(this).parents('#wrap').find(bg).stop().fadeIn(100);
            $(this).parents('#wrap').find(popupN).stop().fadeIn(100).css('display','inline-table');
        });
    }

    // 팝업닫기 popupOff('팝업창의 X버튼'); > popupOff('#popup .title>img');
    function popupOff(classN) {
        $(classN + ', .popbg').click(function() {
            // 스크롤 다시 허용
            $('html, body').off('scroll touchmove mousewheel');

            $(this).parents('#wrap').find('.popbg').stop().fadeOut(100);
            $(this).parents('#wrap').find('.popbg').nextAll().stop().fadeOut(100);
        });
    }
    function popupOff2(classN) {
        $(classN + ', .popbg2').click(function() {
            // 스크롤 다시 허용
            $('html, body').off('scroll touchmove mousewheel');

            $(this).parents('#wrap').find('.popbg2').stop().fadeOut(100);
            $(this).parents('#wrap').find('.popbg2').nextAll().stop().fadeOut(100);
        });
    }



// new bj
            // input type="file"
            var fileTarget = $('.filebox .upload-hidden'); fileTarget.on('change', function() { // 값이 변경되면
                if(window.FileReader) { // modern browser var
                    filename = $(this)[0].files[0].name;
                }
                else { // old IE
                    var filename = $(this).val().split('/').pop().split('\\').pop(); // 이미지 권장 사이즈는 250px * 250px (1:1 비율) 입니다.만 추출
                } // 추출한 이미지 권장 사이즈는 250px * 250px (1:1 비율) 입니다. 삽입
                $(this).siblings('.upload-name').val(filename);
            });

            // input 데이터값 받아오기
            var selectBJ = $('#bjEmail option:selected').text();
            $('.bjEmail .noTxt').find('input').attr('placeholder',selectBJ);
            $('#bjEmail').click(function(){
                var selectBJ = $('#bjEmail option:selected').text();
                $(this).parents('.inputBox').prev().find('input').val(selectBJ).attr('readonly');
                if(selectBJ == '직접입력') {
                    $(this).parents('.inputBox').prev().find('input').removeAttr('readonly').val('').attr('placeholder','입력해주세요.').css('background','#fff');
                }
                else if(selectBJ != '직접입력') {
                    $(this).parents('.inputBox').prev().find('input').css('background-color','#efefef').attr('readonly','readonly');
                }
            });

            var comEmail = $('#comEmail option:selected').text();
            $('.comEmail .noTxt').find('input').attr('placeholder',comEmail);
            $('#comEmail').click(function(){
                var comEmail = $('#comEmail option:selected').text();
                $(this).parents('.inputBox').prev().find('input').val(comEmail).attr('readonly');
                if(comEmail == '직접입력') {
                    $(this).parents('.inputBox').prev().find('input').removeAttr('readonly').val('').attr('placeholder','입력해주세요.').css('background','#fff');
                }
                else if(comEmail != '직접입력') {
                    $(this).parents('.inputBox').prev().find('input').css('background-color','#efefef').attr('readonly','readonly');
                }
            });

            // 팝업
            // popupOn('.recommendC .pinkBtn', '.alertPop', '.popbg');
            popupOff('.alertPop .title>img');
            popupOff('.alertPop #btn_close');
            });

            // 팝업띄우기 popupOn('클릭하는 버튼');
            function popupOn(classN, popupN, bg) {
            $(classN).click(function() {
                // 스크롤 막기
                $('#popbg').on('scroll touchmove mousewheel', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });

                $(this).parents('#wrap').find(bg).stop().fadeIn(100);
                $(this).parents('#wrap').find(popupN).stop().fadeIn(100).css('display','inline-table');
            });
            }

            // 팝업닫기 popupOff('팝업창의 X버튼'); > popupOff('#popup .title>img');
            function popupOff(classN) {
            $(classN + ', .popbg').click(function() {
                // 스크롤 다시 허용
                $('html, body').off('scroll touchmove mousewheel');

                $(this).parents('#wrap').find('.popbg').stop().fadeOut(100);
                $(this).parents('#wrap').find('.popbg').nextAll().stop().fadeOut(100);
            });
            }
            function popupOff2(classN) {
            $(classN + ', .popbg2').click(function() {
                // 스크롤 다시 허용
                $('html, body').off('scroll touchmove mousewheel');

                $(this).parents('#wrap').find('.popbg2').stop().fadeOut(100);
                $(this).parents('#wrap').find('.popbg2').nextAll().stop().fadeOut(100);
            });
            }

        // ↘ 후보목록 검색 기능
        
        
        $(document).ready(function() {
            //search 
            var state  = false;
            var search = $('.search') 
            $('.search img').click(function(){
                if(!state) {
                    $(search).stop().animate({'width': '260px'},300);
                } else {
                    $(search).stop().animate({'width': '70px'},300);
                }
                state = !state //false 일 때 true, true 일 때 false
            }); //end search

            $("#inputName").keyup(function(e){if(e.keyCode == 13)  chkSearchData(); }); // .search 내용을 입력하고 엔터키 누르면 chkSearchData 실행

            function chkSearchData(){
                var inputVal = $("#inputName").val();
                if (inputVal.length < 1) {
                    alert("검색어는 1자 이상 입력해주세요.");
                    $("#inputName").focus();
                    return;
                } else {
                    searchData();
                }
            }

            function searchData() {
                var inputVal = $("#inputName").val();
                var inputData = {"name": inputVal};
                var inputData_json = JSON.stringify(inputData);
                $.ajax({
                    type: "POST",
                    url: "/ajax/search",
                    crossDomain: false,
                    contentType: "application/json; charset=utf-8",
                    processData: false,
                    dataType: "json",
                    data: inputData_json,
                    success: function (data) {
                        var jsonData = JSON.parse(JSON.stringify(data));
                        var jsonData_parse =JSON.parse(jsonData.data);
                        window.location.href='/bjs/' + jsonData_parse[0].bjid;
                    },
                    error: function (xhr, status, errorThrown) {
                        alert("검색결과가 없습니다.");
                        $("#inputName").focus();
                        return;
                    }
                }); // end ajax
            }
        }); // end of 후보목록 검색 기능