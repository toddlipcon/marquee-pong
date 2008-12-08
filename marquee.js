google.setOnLoadCallback(init);

PADDLE_SPEED=10;
R_PADDLE_SPEED = 10;

function init() {
    $('html').keydown(keydown);
    $('html').keyup(keyup);
    setTimeout(resetBall, 100);
    setTimeout(function() {
    $('#left-paddle').attr('scrollamount', 0);
    $('#left-paddle')[0].newPosition = Math.round($('#field').height() / 2 +
                                                  $('#left-paddle div').height() / 2);
               }, 100);
    setTimeout(function() {
                   setInterval(checkBounds, 100);
               }, 1000);
    setInterval(runAI, 100);
};

function keydown(e) {
    if (e.which == 40) {
        $('#left-paddle').attr({'direction': 'down',
                                       'scrollamount': PADDLE_SPEED});
    } else if (e.which == 38) {
        $('#left-paddle').attr({'direction': 'up',
                                       'scrollamount': PADDLE_SPEED});
    }
    e.stopPropagation();
    return false;
}

function resetBall() {
    $('#ball-h')[0].newPosition = $('#field').width() / 2;
    $('#ball-v')[0].newPosition = Math.round($('#field').height() * Math.random());
    $('#ball-h').attr('scrollamount', 0);
    $('#ball-v').attr('scrollamount', 0);
    $('#get-ready').show();
    setTimeout(function() {
                   $('#get-ready').hide();
                   $('#ball-h').attr('scrollamount', 10);
                   $('#ball-v').attr('scrollamount', 10 * Math.random());
               }, 1000);
}

function checkBounds(e) {
    if (checkIntersect($('#ball'), $('#left-paddle div'))) {
        var center = $('#left-paddle div').position().top +
            $('#left-paddle div').height() / 2;
        var bcenter = $('#ball').position().top + $('#ball').height() / 2;

        $('#ball-h').attr('direction', 'left');
        $('#ball-h').attr('direction', 'right');

        var dir = center - bcenter;
        $('#ball-v').attr('scrollamount', Math.abs(dir)/2);
        setBallDir(dir);
    }
    else if (checkIntersect($('#ball'), $('#right-paddle div'))) {
        var center = $('#right-paddle div').position().top +
            $('#right-paddle div').height() / 2;
        var bcenter = $('#ball').position().top + $('#ball').height() / 2;

        $('#ball-h').attr('direction', 'right');
        $('#ball-h').attr('direction', 'left');

        var dir = center - bcenter;
        setBallDir(dir);
    } else if ($('#ball').position().left < 30) {
        incrScore('#r-score');
        resetBall();
    } else if ($('#ball').position().left > $('#right-paddle div').position().left + $('#right-paddle div').width()) {
        incrScore('#l-score');
        resetBall();
    }
}

function incrScore(sel) {
    var el = $(sel);
    el.text(parseInt(el.text()) + 1);
}

function setBallDir(dir) {
    $('#ball-v').attr('scrollamount', Math.abs(dir)/4);
    if (dir < 0) {
        $('#ball-v').attr('direction', 'up');
        $('#ball-v').attr('direction', 'down');
    } else {
        $('#ball-v').attr('direction', 'down');
        $('#ball-v').attr('direction', 'up');
    }        
}
function runAI() {
    var rpos = $('#right-paddle div').position();
    var center = rpos.top + $('#right-paddle div').height() / 2;
    var bcenter = $('#ball').position().top + $('#ball').height() / 2;
    if (center < bcenter - 20) {
        $('#right-paddle').attr('scrollamount', R_PADDLE_SPEED);
        $('#right-paddle').attr('direction', 'down');
    } else if (center > bcenter + 20) {
        $('#right-paddle').attr('scrollamount', R_PADDLE_SPEED);
        $('#right-paddle').attr('direction', 'up');
    } else {
        $('#right-paddle').attr('scrollamount', '0');
    }
}

function checkIntersect(ball, paddle) {
    var brect = getRect(ball);
    var prect = getRect(paddle);
    return !(brect.l > prect.r ||
             brect.r < prect.l ||
             brect.b < prect.t ||
             brect.t > prect.b);
}

function getRect(el) {
    var rect = {};
    rect.l = el.position().left;
    rect.r = rect.l + el.width();
    rect.t = el.position().top;
    rect.b = rect.t + el.height();
    return rect;
}

function keyup(e) {
    $('#left-paddle').attr('scrollamount', 0);
}
