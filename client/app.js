/* jshint browser: true, jquery: true, camelcase: true, indent: 2, undef: true, quotmark: single, maxlen: 80, trailing: true, curly: true, eqeqeq: true, forin: true, immed: true, latedef: true, newcap: true, nonew: true, unused: true, strict: true */
'use strict';
var currentId;
var results = [];

var getScore = function() {

    $.get('score', function(res) {
        var correct = '<li class="list-group-item">' +
            'Correct Answers: ' +
            res.Correct + '</li>';

        var incorrect = '<li class="list-group-item">' + 'Incorrect Answers: ' + res.Incorrect + '</li>';

        $('#scores').empty();
        $('#scores').append(correct);
        $('#scores').append(incorrect);

    });
};

var main = function() {

    var socket = io.connect();

    $('#send').on('click', function(event) {

        var answer = $('#answer').val();
        var req = {
            'answerId': currentId,
            'answer': answer,
        };

        $.post('answer', req, function(res) {
            socket.emit('new answer', res.Correct);
        });

        $('#answer').val('');

    });

    $('#userNameBtn').on('click', function(event) {
        console.log($('#userName').val());
        socket.emit('new user', $('#userName').val(), function(data) {
            if (data) {
                $('#userArea').hide();
                $('#quizArea').show();
            }
        });
        $('#userName').val('');
    });


    socket.on('get new question', function(data) {
        $.get('question', function(res) {
            $('.question').text(res.Result);
            currentId = res.id;
        });
    });

    socket.on('get users', function(data) {

        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<li class="list-group-item">' + data[i] + '</li>';
        }

        $('#users').html(html);
    });

    socket.on('new answer', function(data) {
        console.log(data);
        var result;
        if (data.result === true) {
            result = ' answered correctly';
        } else {
            result = ' answered incorrectly';
        }
        var item = '<li class="list-group-item">' + data.name + result + '</li>';

        $('.answers').append(item);
    });

    socket.on('scores', function(data) {
        getScore();
    });

    socket.on('new round', function(data) {
        //clear all answers
        $('.answers').empty();
    });

};

$(document).ready(main);