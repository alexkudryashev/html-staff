//--------------------------------
//VoiceInput plugin
//Author: Alex Kudryashev
//usage: $(selector).voiceInput(options);
//
//--------------------------------
(function ($) {
    'use strict';
    $.fn.voiceInput = function (options) {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            var sheet = document.styleSheets[0];
            sheet.insertRule('.mic {width:1.3em;height:1.3em;display:inline-block;cursor:pointer;}', 0);
            sheet.insertRule('.mic-msg { position: fixed;z-index:120; top: 3em; padding: 1em; left: 3em;  border-radius: 6px; font-weight: bold;cursor:pointer; }', 0);
            sheet.insertRule('.mic-msg-err {background: #F00; color: #FFA;border: solid 1px #FF0;}', 0);
            sheet.insertRule('.mic-msg-ok {background: #0F0; color: #552;border: solid 1px #080;}', 0);
            sheet.insertRule('.mic svg{fill: #33cc33;transition: all 1s;}', 0);
            sheet.insertRule('.mic.mic-work svg{fill: #f00;}', 0);
            sheet.insertRule('.mic svg:hover{animation: flashme 1s infinite;}', 0);
            sheet.insertRule('@keyframes flashme{0%{fill: #f00;}40%{fill: #33cc33;}60%{fill: #33cc33;}100%{fill: #f00;}}', 0);
            var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
            var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
            var settings = $.extend({
                micReady: "mic-ready",
                micBusy: "mic-work",
                tooltip: "Use your microphone to input"
            }, options);
            var recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            var output = null;
            var btn = null;
            var final_transcript = '';
            $('.mic').remove();
            var showMsg = function (msg, cn) {
                $('.mic-msg').remove();
                var errMsg = $('<div />').addClass(function () { return 'mic-msg mic-msg-' + cn; })
                    .attr('title', 'Click to close this message')
                    .html(msg)
                    .click(function () { errMsg.remove(); })
                    .appendTo($(document.body));
                setTimeout(function () { errMsg.remove(); }, 5000);
            }
            $('<div />', { "title": settings.tooltip, "class": "mic " + settings.micReady })
                .click(function () {
                    //console.log(recognition);
                    btn = $(this);
                    output = btn.prev('input,textarea,select');
                    if (!output.is('[readonly]')) {
                        try {
                            recognition.start();
                            btn.addClass(settings.micBusy).removeClass(settings.micReady);
                            showMsg('Please speak', 'ok');
                        }
                        catch (e) {
                            showMsg(e.message, 'err');
                            //console.log(e.message);
                        }
                    }
                }).append('<svg enable-background="new -0.7 -0.6 20 29" height="100%" version="1.1" viewBox="-0.7 -0.6 20 29" width="100%" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path clip-rule="evenodd" d="M10.8,22.8V26h5v2h-5h-3h-5v-2h5v-3.2C3.4,22.2,0,18.7,0,14.4v-3  c0-0.1,0-0.3,0-0.4h2.8c0,0.3-0.1,0.6-0.1,0.9V14c0,3.3,2.9,6,6.5,6c3.6,0,6.5-2.7,6.5-6v-2.1c0-0.3,0-0.6-0.1-0.9h2.8  c0,0.1,0,0.3,0,0.4v3C18.6,18.7,15.2,22.2,10.8,22.8z M9.3,18c-2.5,0-4.5-2-4.5-4.5v-9C4.8,2,6.8,0,9.3,0s4.5,2,4.5,4.5v9  C13.8,16,11.8,18,9.3,18z" fill-rule="evenodd"></path></svg>')
                .insertAfter($(this).not('[readonly]'));
            recognition.onresult = function (event) {

                for (var i = event.resultIndex, n = event.results.length; i < n; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    }
                }
                //console.log(interim_transcript);
                if (output.is('select')) {
                    output.val($('option', output)
                        .filter(function (i, e) { return $(e).text().toLowerCase() == final_transcript.toLowerCase() || $(e).val().toLowerCase() == final_transcript.toLowerCase() })
                        .attr('value'));
                } else {
                    if (output.attr('maxlength')) {
                        final_transcript = final_transcript.substr(0, output.attr('maxlength'));
                    }
                    output.val(final_transcript);
                }
                final_transcript = '';
                try { dataLayer.push({ 'event': 'cart', 'action': 'voice', 'label': output.attr('id') }); } catch (e) { }
                if (output.val() && output.hasClass('auto-run'))
                    output.change();
            }
            recognition.onspeechend = function () {
                recognition.stop();
                btn.addClass(settings.micReady).removeClass(settings.micBusy);

            }
            recognition.onnomatch = function (event) {
                showMsg('I didn\'t recognise a single word.', 'err');
                //console.log('I didn\'t recognise that text.');
            }
            recognition.onerror = function (event) {
                console.log('Error: ' + event.error);
                recognition.stop();
                btn.addClass(settings.micReady).removeClass(settings.micBusy);//'mic-ready mic-work'
                final_transcript = '';
                try { dataLayer.push({ 'event': 'cart', 'action': 'voice', 'label': event.error }); } catch (e) { }
                showMsg('Error: ' + event.error, 'err');
            }
        }//if (typeof SpeechRecognition
        return this;
    };//$.fn.voiceInpu
}(jQuery));
