!function ($) {
    "use strict";

    //Setup
    var pass_reqs = "<b>Our system will not let you continue without a strong enough password.</b><li>Use a mixture of upper and lower case letters</li><li>Include at least one number</li><li>Adding special characters such as !, %, #, (, or } significantly helps.</li>",
        ID = 1;  //don't change this
    $("input:password").css('margin-bottom', '5px').attr('data-original-title', 'Password Suggestions').attr('data-content', pass_reqs);
    $("input:password").each(function () {
        var parent_div = $(this).parent('div'),
            progress_parent = $('<div/>', {
                id: 'progressparent_id_' + ID,
                class: 'progress progress-danger progress-striped active',
                width: '220px'
            }).appendTo(parent_div),
            progress_bar = $('<div/>', {
                id: 'progressbar_id_' + ID,
                class: 'bar',
                style: "width: 5%;"
            }).appendTo(progress_parent);
        $("input:submit").attr("disabled", "disabled");
        ID++;
    });


    $("input:password").on("input", function(e){
        var self = $(this).val(),
            result = zxcvbn(self),
            score = (result.score + 1) * 20,
            progressClosest = $(this).siblings('.progress'),
            barClosest = progressClosest.children('.bar');
        $(barClosest).attr('style', 'width: ' + score + '%');
        if (score >= 80) { // If the total score is good
            $(progressClosest).removeClass('progress-danger progress-warning').addClass('progress-success');
            $("input:submit").removeAttr("disabled");
        } else if (score > 50) { // If the total score is decent, but not great
            $(progressClosest).removeClass('progress-danger progress-success').addClass('progress-warning');
            $("input:submit").attr("disabled", "disabled");
        } else { // All the suck
            $(progressClosest).removeClass('progress-warning progress-success').addClass('progress-danger');
            $("input:submit").attr("disabled", "disabled");
        }
    });

    $("input:password").on("focus", function(e){
        $(this).popover('show');
    });

    $("input:password").on("blur", function(e){
        var enableSubmit = true;
        $("input:password").each(function () {
            var self = $(this).val(),
                result = zxcvbn(self);
            if (result.score < 3) {
                enableSubmit = false;
            }
        });
    });

}(window.jQuery, window.zxcvbn);