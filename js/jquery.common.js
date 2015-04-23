/* 
 * Copyright 2014 Li Guofeng
 * Email: lgf811@gmail.com
 */


//create_video({ width: '320px', height: '320px', vmu: '../file/video.mp4', 'viu': '../images/video_view.jpg', iep: false, rei: 'video' });
setTimeout(function () {
    document.getElementById('video').style.backgroundColor = '';
}, 1000);

var home_banner = '.home-banner',
    curr_offset = 0,
    hb_list, hb_li, hb_li_len;

var isSupportTouch = !!('ontouchend' in document) || navigator.userAgent.indexOf('Windows Phone') > 0;


document.addEventListener('touchmove', function (e) { hideMenu(); e.preventDefault(); }, false);

var myScroll;


(function ($, document) {

    $(document).ready(function () {

        //setInterval(function () {
        //    $('.workflow-list-wrap .list .btn-left').fadeTo(1000, 0, function () {
        //        $(this).fadeTo(1000, 1);
        //    });
        //}, 2000);

        var b_l = $('.home-banner-list span').length,
            b_r = Math.floor(Math.random() * b_l),
            b_src = $('.home-banner-list span').eq(b_r).attr('src');
        $('.home-banner li:first').css('background-image', 'url("' + b_src + '")');


        //var form = $('form').Validform({
        //    btnSubmit: 'input:submit:first',
        //    beforeCheck: function (curform) { },
        //    tiptype: function (msg, o, cssctl) {
        //        //ȫ����֤ͨ���ύ��ʱo.objΪ�ñ�����;
        //        if (!o.obj.is("form")) {
        //            //ҳ���ϲ�������ʾ��Ϣ�ı�ǩʱ���Զ�����;
        //            if (o.obj.prev(".Validform_checktip").length == 0) {
        //                o.obj.before("<span class='Validform_checktip' />");
        //            }
        //            var objtip = o.obj.prev(".Validform_checktip");
        //            cssctl(objtip, o.type);
        //            objtip.text(msg);
        //        }
        //    },
        //    showAllError: true
        //});

        $('.submit-btn').click(function () {
            //document.getElementsByTagName('form')[0].submit();
            if (form.check()) {
                var $this = $(this);
                $this.prop('disabled', true);
                $.ajax({
                    type: 'post',
                    url: 'application/message.ashx',
                    data: $('form').serialize(),
                    dataType: 'json',
                    success: function (data, status) {
                        if (data.status == true) {
                            $('form')[0].reset();
                            alert($('.sub-success-message').text());
                            $this.prop('disabled', false);
                        } else {
                            alert(data.message);
                            $this.prop('disabled', false);
                        }
                    },
                    error: function (XMLHttpRequest, status, errorThorw) {
                        alert(errorThorw);
                        $this.prop('disabled', false);
                    }
                });
            }
        });


        $('.home-banner').height($('#main').height());

        if ($.fn.cycle) {
            $('.home-banner ul').cycle({
                pause: 0,
                timeout: 3000
            });
        }

        var this_offset_top;


        function updatePosition() {
            this_offset_top = this.y >> 0;

            $('#scroller .head').each(function (i) {
                if ($(this).offset().top <= $('#main').offset().top + 1 + (i + 1) * $(this).height()) {
                    $('.follow-head .head').eq(i).addClass('follow');
                } else {
                    $('.follow-head .head').eq(i).removeClass('follow');
                }
            });
        }


        $(window).load(function () {
            window.scrollTo(0, 1);
            myScroll = new IScroll('#main', {
                scrollbars: true,
                mouseWheel: true,
                interactiveScrollbars: true,
                shrinkScrollbars: 'scale',
                fadeScrollbars: true,
                probeType: 3,
                click: true
            });

            myScroll.on('scroll', updatePosition);




            var scroll_to = 0,
                main_offset = $('#main').offset(),
                dlw_offset = $('.designer-list-wrap').offset(),
                wlw_offset = $('.workflow-list-wrap').offset(),
                sw_offset = $('.submission-wrap').offset();


            $('.info-box').each(function (i) {
                var $this = $(this);
                window.myScrollCol = scrollCol($this, {
                    mobileColNum: $this.data('mobile-col')
                }, i);
            });

            $('.workflow-details-list > .box').bind('touchstart', function (event) {
                var touches = event.originalEvent.touches[0];
                start = {
                    x: touches.pageX,
                    y: touches.pageY,
                };
            }).bind('touchmove', function (event) {
                if (event.originalEvent.touches.length > 1 || event.scale && event.scale !== 1) return;
            console.log("a")
                var touches = event.originalEvent.touches[0];

                delta = {
                    x: touches.pageX - start.x,
                    y: touches.pageY - start.y
                }
                if (delta.x > 0) {
                    $('.side-box').css('left', delta.x);
                } else {
                    $(this).css('left', delta.x / 6);
                }
                return false;
            }).bind('touchend', function (event) {
                if (delta.x > 0 && Math.abs(delta.x) > ($(window).width() * .2)) {
                    $('.back-btn').trigger('click');
                } else {
                    $(this).animate({
                        left: 0
                    }, 400);
                }
            });

            $('.designer-list-wrap li').click(function () {
                var $this = $(this),
                    ti = $this.index();
                hideMenu();
                if (!$("#main").hasClass('disabled-scroll')) {
                    $("#main").addClass('disabled-scroll');
                    $('.side-box').animate({ left: 0 });
                    $('.designer-info-list .info-box').eq(ti).show().siblings(':visible:not(.header)').hide();

                    $('.workflow-details-list:visible').hide();

                    $('#main').addClass('open-designer-works');
                    $('.designer-info-list .info-box').eq(ti).addClass('open-designer-works');
                    $('.designer-info-list .info-box').eq(ti).find(".contents").animate({ left: 0 });
                }
            });


            $('.designer-info-list .info').click(function () {
                var $this = $(this);

                $('#main').addClass('open-designer-works');
                $this.parent().addClass('open-designer-works');
                $this.next().animate({ left: 0 });
            });

            $('.workflow-list-wrap li').click(function () {
                var $this = $(this),
                    ti = $this.index();
                hideMenu();
                if (!$("#main").hasClass('disabled-scroll')) {
                    $("#main").addClass('disabled-scroll');

                    //$('.side-box .box .inner[style]').animate({ left: 0 });
                    $('.side-box').animate({ left: 0 }, function () {
                        //workflowAnimate();
                    });
                    $('.workflow-details-list .box').eq(ti).show().siblings(':visible:not(.header)').hide();

                    $('.designer-info-list:visible').hide();

                }
            });


            $('.workflow-details-list .box .image').click(function () {
                var $this = $(this);
                if (!$this.next().is(':animated')) {
                    $this.next().fadeIn();
                }
            });


            $('.back-btn').click(function () {
                if ($("#main").hasClass('disabled-scroll')) {
                    if (!$('#main').hasClass('open-designer-works') || 1 == 1) {
                        $("#main").removeClass('disabled-scroll');
                        $('.side-box').animate({ left: '100%' }, function () {
                            //$('.workflow-details-list :not(.box-bg-image, .jwplayer)[style]').removeAttr('style');
                            $('.workflow-details-list > .box > .inner, .workflow-details-list > .box > .inner [style]').removeAttr('style');
                        });
                        $('.workflow-details-list:hidden').show();

                        $('.designer-info-list:hidden').show();
                    } else {
                        //$("#main").removeClass('open-designer-works');
                        $('.designer-info-list .open-designer-works .contents').stop().animate({ left: '100%' }, function () {
                            $("#main").removeClass('open-designer-works');
                            $('.designer-info-list .open-designer-works').removeClass('open-designer-works');
                        });
                    }

                }
            });

            $('.loading').remove();
        });






        var start = {},
            isScrolling,
            delta = {};

        hb_list = '.home-banner .list';
        hb_li = '.home-banner li';
        hb_li_len = $(hb_li).length;

        var about_show_i = 0,
            about_wrap = '.about-wrap',
            $about_panel = $('.panel', about_wrap),
            panel_len = $about_panel.length,
            about_start = {},
            about_isScrolling,
            about_delta = {},
            about_curr_offset = 0,
            main_h = $('#main').height();


        var nav = '#navigation';

        $('.menu-toggle-btn').bind('click', function (e) {
            //alert($(e.target).text());
            if (!$('#main').hasClass('disabled-scroll')) {
                var $this = $(this);
                if (!$this.hasClass('open')) {
                    $this.addClass('open');
                    $(nav).stop().animate({ height: $('.list', nav).height() }, 200);
                    setTimeout(function () {
                        //document.getElementById("htmlbody").addEventListener("click", bodyClick);
                        document.addEventListener("click", bodyClick);
                    }, 200);

                } else {
                    $this.removeClass('open');
                    $(nav).stop().animate({ height: 0 }, 200);
                }
            }
        });

        function bodyClick() {
            hideMenu();
            document.removeEventListener("click", bodyClick);
        }

    });

    function hideMenu() {
        var nav = '#navigation';
        if (!$('#main').hasClass('disabled-scroll')) {
            var $this = $(this);
            if ($('.menu-toggle-btn').hasClass('open')) {
                $('.menu-toggle-btn').removeClass('open');
                $(nav).stop().animate({ height: 0 }, 200);
            }
        }
    }

    $.fn.scrollCol = function (options) {
        return this.each(function () {
            $(this).data('scrollCol', new scrollCol($(this)[0], options));
        });
    }



})(jQuery, document);


var wb_inner = '.workflow-details-list .box:visible > .inner',
    wb_img = '.workflow-details-list .box:visible > .inner > .image',
    wb_speed = 1500;

function workflowAnimate() {
    var surplus_area = $(wb_img).first().width() - $(window).width(),
        surplus_len = $(wb_img).first().nextAll().length;

    //alert(surplus_len)
    for (var i = 0; i < surplus_len; i++) {
        $(wb_img).eq(i + 1).delay(i * wb_speed).fadeTo(wb_speed, 1)

    }

    $(wb_inner).animate({ left: -surplus_area }, surplus_len * wb_speed);

    windowResize();
}


function windowResize() {
    var surplus_area = $(wb_img).first().width() - $(window).width();

    $(window).resize(function () {
        $(wb_inner).css({ left: -surplus_area });
    });
}















function scrollCol(element, options, index) {
    var defaultOptions = {
        _this: element,
        $this: null,
        browserWidth: $('#container').width(),
        boxList: '.box-list',
        $BoxList: null,
        box: '.box',
        $Box: null,
        colNum: 0,
        currIndex: 0,
        effectiveWidth: 0,
        boxListOffset: 0,
        boxMovingDistance: 0,
        animateSpeed: 400,
        touchInitX: 0,
        touchInitY: 0,
        distanceSurplus: 0,
        boxSurplus: 0,
        prevBtn: '.prev-btn',
        nextBtn: '.next-btn',
        animatedFlag: false,
        imgWidth: 0,
        imgHeight: 0,
        imgRatio: 0 / 0,
        pcColNum: 6,
        mobileColNum: 2,
        movingDistanceTotal: 0,
        touchmovingDistance: 0,
        _self: 0,
        _selfFlag: true,
        _selfInterval: null,
        _break_touch: false
    },

    defaultEvent = {
        init: function () {
            if (opts.colNum < 2) {
                opts.$this.find(opts.prevBtn + ', ' + opts.nextBtn).addClass('disabled');
            }

            if (opts.boxListOffset == 0) {
                opts.$this.find(opts.prevBtn).addClass('disabled');
            }

            opts.$this.find(opts.prevBtn).click(function () {
                if (opts.colNum > 1 && opts.boxListOffset > 0 && !opts.animatedFlag) {
                    opts.boxListOffset--;
                    opts.prevEvent();

                    opts.$this.find(opts.nextBtn + '.disabled').removeClass('disabled');

                    if (opts.boxListOffset == 0) {
                        opts.$this.find(opts.prevBtn).addClass('disabled');
                    }
                } else {
                    $('.back-btn').trigger('click');
                }
            });

            opts.$this.find(opts.nextBtn).click(function () {
                if (opts.colNum > 1 && opts.boxListOffset < opts.colNum - 1 && !opts.animatedFlag) {
                    opts.boxListOffset++;
                    opts.nextEvent();

                    opts.$this.find(opts.prevBtn + '.disabled').removeClass('disabled');

                    if (opts.boxListOffset == opts.colNum - 1) {
                        opts.$this.find(opts.nextBtn).addClass('disabled');
                    }
                }
            });

            if (isSupportTouch) {
                opts.$this.find('.contents').bind('touchstart', opts.touchStartEvent);
                opts.$this.find('.contents').bind('touchmove', opts.touchMoveEvent);
                opts.$this.find('.contents').bind('touchend', opts.touchEndEvent);
            }

        },

        prevEvent: function () {
            var surplus = opts.boxListOffset == 0 ? 0 : opts.$BoxSurplus;

            opts.animatedFlag = true;

            opts.movingDistanceTotal = opts.boxListOffset * opts.boxMovingDistance + opts.boxListOffset * surplus;

            if (!$('.ie').length) {

                opts.$BoxList.css({
                    transition: opts.animateSpeed + 'ms ease-in-out',
                    transform: 'translate(' + -opts.movingDistanceTotal + 'px, 0px)'
                });

                setTimeout(function () {
                    opts.animatedFlag = false;
                    opts.$BoxList.css({ transition: '0ms ease-in-out' });
                }, opts.animateSpeed);
            } else {
                opts.$BoxList.animate({
                    left: -opts.movingDistanceTotal
                }, function () {
                    opts.animatedFlag = false;
                });
            }
        },

        nextEvent: function () {
            var surplus = opts.boxListOffset == 0 ? 0 : opts.$BoxSurplus;

            opts.animatedFlag = true;

            if (opts.distanceSurplus && opts.boxListOffset == opts.colNum - 1) {
                opts.movingDistanceTotal = (opts.boxListOffset - 1) * opts.boxMovingDistance + opts.boxListOffset * surplus + opts.distanceSurplus;
            } else {
                opts.movingDistanceTotal = opts.boxListOffset * opts.boxMovingDistance + opts.boxListOffset * surplus;
            }

            if (!$('.ie').length) {
                opts.$BoxList.css({
                    transition: opts.animateSpeed + 'ms ease-in-out',
                    transform: 'translate(' + -opts.movingDistanceTotal + 'px, 0px)'
                });

                setTimeout(function () {
                    opts.animatedFlag = false;
                    opts.$BoxList.css({ transition: '0ms ease-in-out' });
                }, opts.animateSpeed);
            } else {
                opts.$BoxList.animate({
                    left: -opts.movingDistanceTotal
                }, function () {
                    opts.animatedFlag = false;
                });
            }

        },

        touchStartEvent: function (event) {
            if (event.originalEvent.touches) {
                var touch = event.originalEvent.touches[0];
                opts.touchInitX = touch.clientX,
                opts.touchInitY = touch.clientY;
            }
        },

        touchMoveEvent: function (event) {
            if (event.originalEvent.touches) {
                var touch = event.originalEvent.touches[0];
                opts._break_touch = false;
                if (!opts.animatedFlag) {
                    if (Math.abs(touch.clientX - opts.touchInitX) > Math.abs(touch.clientY - opts.touchInitY)) {
                        opts.touchmovingDistance = touch.clientX - opts.touchInitX;

                        if (opts.touchmovingDistance < 0 && opts.boxListOffset == opts.colNum - 1 || opts.touchmovingDistance > 0 && opts.boxListOffset == 0) {
                            if (opts.touchmovingDistance > 0) {
                                opts._break_touch = true;
                                $('.side-box').css('left', opts.touchmovingDistance);
                            } else {
                                opts._break_touch = false;
                                opts.touchmovingDistance = opts.touchmovingDistance / 6;
                            }
                        }

                        if (!opts._break_touch) {
                            opts.$BoxList.css({
                                transition: '0ms ease-in-out',
                                transform: 'translate(' + (-opts.movingDistanceTotal + opts.touchmovingDistance) + 'px, 0px)'
                            });
                        }
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        },

        touchEndEvent: function (event) {
            opts.animatedFlag = false;
            if (Math.abs(opts.touchmovingDistance) > opts.browserWidth * 0.2 && !opts._break_touch) {
                if (opts.touchmovingDistance < 0 && opts.boxListOffset < opts.colNum - 1) {
                    opts.boxListOffset++;
                }

                if (opts.touchmovingDistance > 0 && opts.boxListOffset > 0) {
                    opts.boxListOffset--;
                }

                if (opts.boxListOffset == 0) {
                    opts.$this.find(opts.prevBtn).addClass('disabled');
                }

                if (opts.boxListOffset == opts.colNum - 1) {
                    opts.$this.find(opts.nextBtn).addClass('disabled');
                }

                if (opts.boxListOffset > 0) {
                    opts.$this.find(opts.prevBtn + '.disabled').removeClass('disabled');
                }

                if (opts.boxListOffset < opts.colNum - 1) {
                    opts.$this.find(opts.nextBtn + '.disabled').removeClass('disabled');
                }
            } else if (opts.touchmovingDistance > opts.browserWidth * 0.2) {
                $('.back-btn').trigger('click');
            } else if (opts.touchmovingDistance <= opts.browserWidth * 0.2 && opts.touchmovingDistance > 0) {
                $('.side-box').animate({ left: 0 });
            }

            if (opts.touchmovingDistance != 0) {

                opts.movingDistanceTotal = opts.browserWidth * opts.boxListOffset + opts.$BoxSurplus * opts.boxListOffset;
                opts.$BoxList.css({
                    transition: opts.animateSpeed + 'ms ease-in-out',
                    transform: 'translate(' + -opts.movingDistanceTotal + 'px, 0px)'
                });

                setTimeout(function () {
                    opts.animatedFlag = false;
                    opts.$BoxList.css({ transition: '0ms ease-in-out' });
                    opts.touchmovingDistance = 0;
                }, opts.animateSpeed);
            }
        },

        _resize: function () {

            var surplus = opts.boxListOffset == 0 ? 0 : opts.$BoxSurplus,
                browser_w = $(window).width();

            //opts.browserWidth = typeof opts.$this.data('browser') == $('#container').width();
            opts.browserWidth = $('#container').width();

            if (windowMatchMedia('min', 'width', 767)) {
                opts.$this.find('.contents, .box').removeAttr('style');
            } else {
                if (opts.mobileColNum == 1) {
                    opts.$this.find('.box').css({ width: opts.browserWidth / opts.mobileColNum });
                } else {
                    opts.$this.find('.box').css({ width: (opts.browserWidth - opts.$BoxSurplus) / opts.mobileColNum });
                }

                opts.$this.find('.contents').css({ width: opts.browserWidth });
            }

            opts.effectiveWidth = opts.$Box.length * opts.$Box.outerWidth(true);

            opts.colNum = opts.effectiveWidth / (opts.browserWidth + opts.$BoxSurplus);
            opts.colNum = new String(opts.colNum).indexOf('.0') > 0 ? Math.floor(opts.colNum) : Math.ceil(opts.colNum);

            if (windowMatchMedia('min', 'width', 767)) {
                opts.distanceSurplus = opts.$Box.length % opts.pcColNum == 0 ? 0 : (opts.$Box.length - ((opts.colNum - 1) * opts.pcColNum)) * opts.$Box.outerWidth();
            } else {
                opts.distanceSurplus = opts.$Box.length % opts.mobileColNum == 0 ? 0 : opts.$Box.first().outerWidth();
            }

            opts.boxMovingDistance = opts.browserWidth;

            //console.log(Math.ceil(opts.effectiveWidth / (opts.browserWidth + opts.$BoxSurplus)));
            if (opts.colNum < 2 && opts.boxListOffset == 0) {
                opts.$this.find(opts.prevBtn + ', ' + opts.nextBtn).addClass('disabled');
            } else {
                opts.$this.find(opts.prevBtn + ', ' + opts.nextBtn).removeClass('disabled');
            }

            if (opts.boxListOffset == 0) {
                opts.$this.find(opts.prevBtn).addClass('disabled');
            }

            if (opts.boxListOffset == opts.colNum - 1) {
                opts.$this.find(opts.nextBtn).addClass('disabled');
            }

            if (opts.distanceSurplus && opts.boxListOffset == opts.colNum - 1 && opts.colNum > 1) {
                opts.movingDistanceTotal = (opts.boxListOffset - 1) * opts.boxMovingDistance + opts.boxListOffset * surplus + opts.distanceSurplus;

            } else {
                opts.movingDistanceTotal = opts.boxListOffset * opts.boxMovingDistance + opts.boxListOffset * surplus;
            }

            if (!$('.ie').length) {
                opts.$BoxList.css({
                    transform: 'translate(' + -opts.movingDistanceTotal + 'px, 0px)'
                });
            } else {
                opts.$BoxList.css({
                    left: -(opts.boxListOffset * opts.boxMovingDistance + opts.boxListOffset * surplus)
                });

            }

            if (windowMatchMedia('max', 'width', 767)) {
                opts._selfInterval = setInterval(function () {
                    opts._self++;
                    if ((typeof opts.$this.data('browser') == 'undefined' ? $('#container').width() : opts.$this.children('.inner').width()) != opts.browserWidth) {
                        if (opts._selfFlag) {
                            opts._resize();
                            opts._selfFlag = false;
                        }
                    } else if (((typeof opts.$this.data('browser') == 'undefined' ? $('#container').width() : opts.$this.children('.inner').width()) == opts.browserWidth && !opts._selfFlag) || opts._self == 20) {
                        clearInterval(opts._selfInterval);
                        opts._selfFlag = true;
                    }
                }, 16.7);
            } else {
                clearInterval(opts._selfInterval);
            }
        }

    };

    var opts = $.extend({}, defaultOptions, defaultEvent, options);
    opts.$this = $(opts._this);
    opts.$BoxList = opts.$this.find(opts.boxList);
    opts.$Box = opts.$BoxList.find('.box');


    opts.$BoxSurplus = parseInt(opts.$Box.css('margin-left')) + parseInt(opts.$Box.css('margin-right'));

    $(window).resize(opts._resize).trigger('resize');

    opts.init();

}



function windowMatchMedia(operator, woh, num) {
    var _operator = operator,
        _woh = woh,
        _num = num,
        media = '';

    if (window.matchMedia) {
        media = '(' + _operator + '-' + _woh + ':' + _num + 'px)';
        return matchMedia(media).matches;
    } else {
        if (_operator == 'max') {
            if (_woh == 'width') {
                return $(window).width() < _num;
            } else {
                return $(window).height() < _num;
            }
        }
        if (_operator == 'min') {
            if (_woh == 'width') {
                return $(window).width() > _num;
            } else {
                return $(window).height() > _num;
            }
        }
    }
}


