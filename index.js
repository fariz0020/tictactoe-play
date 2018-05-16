
// Write Javascript code!\
$(document).ready(function () {
    var modal = $('#playerModal')
    var modalHallofFame = $('#hofModal')
    var x = "x"
    var o = "o"
    var count = 0;
    var o_win = 0;
    var x_win = 0;
    var rank = 0;

    startGame()

    $('#game li').click(function () {
        if ($("#one").hasClass('o') && $("#two").hasClass('o') && $("#three").hasClass('o') || $("#four").hasClass('o') && $("#five").hasClass('o') && $("#six").hasClass('o') || $("#seven").hasClass('o') && $("#eight").hasClass('o') && $("#nine").hasClass('o') || $("#one").hasClass('o') && $("#four").hasClass('o') && $("#seven").hasClass('o') || $("#two").hasClass('o') && $("#five").hasClass('o') && $("#eight").hasClass('o') || $("#three").hasClass('o') && $("#six").hasClass('o') && $("#nine").hasClass('o') || $("#one").hasClass('o') && $("#five").hasClass('o') && $("#nine").hasClass('o') || $("#three").hasClass('o') && $("#five").hasClass('o') && $("#seven").hasClass('o')) {
            alert('O has won the game. Start a new game')
            resetGame()
        }
        else if ($("#one").hasClass('x') && $("#two").hasClass('x') && $("#three").hasClass('x') || $("#four").hasClass('x') && $("#five").hasClass('x') && $("#six").hasClass('x') || $("#seven").hasClass('x') && $("#eight").hasClass('x') && $("#nine").hasClass('x') || $("#one").hasClass('x') && $("#four").hasClass('x') && $("#seven").hasClass('x') || $("#two").hasClass('x') && $("#five").hasClass('x') && $("#eight").hasClass('x') || $("#three").hasClass('x') && $("#six").hasClass('x') && $("#nine").hasClass('x') || $("#one").hasClass('x') && $("#five").hasClass('x') && $("#nine").hasClass('x') || $("#three").hasClass('x') && $("#five").hasClass('x') && $("#seven").hasClass('x')) {
            alert('X wins has won the game. Start a new game')
            resetGame()
        }
        else if (count == 9) {
            alert('Its a tie. It will restart.')
            resetGame()
        }
        else if ($(this).hasClass('disable')) {
            alert('Already selected')
        }
        else if (count % 2 == 0) {
            count++
            $(this).text(o)
            $(this).addClass('disable o btn-primary')
            if ($("#one").hasClass('o') && $("#two").hasClass('o') && $("#three").hasClass('o') || $("#four").hasClass('o') && $("#five").hasClass('o') && $("#six").hasClass('o') || $("#seven").hasClass('o') && $("#eight").hasClass('o') && $("#nine").hasClass('o') || $("#one").hasClass('o') && $("#four").hasClass('o') && $("#seven").hasClass('o') || $("#two").hasClass('o') && $("#five").hasClass('o') && $("#eight").hasClass('o') || $("#three").hasClass('o') && $("#six").hasClass('o') && $("#nine").hasClass('o') || $("#one").hasClass('o') && $("#five").hasClass('o') && $("#nine").hasClass('o') || $("#three").hasClass('o') && $("#five").hasClass('o') && $("#seven").hasClass('o')) {
                alert(sessionStorage.getItem('player_o') + ' wins')
                count = 0
                o_win++
                $('#o_win').text(o_win)
                updateHallOfFame(sessionStorage.getItem('player_o'))
                $("#reset").show()
            }
        }
        else {
            count++
            $(this).text(x)
            $(this).addClass('disable x btn-info')
            if ($("#one").hasClass('x') && $("#two").hasClass('x') && $("#three").hasClass('x') || $("#four").hasClass('x') && $("#five").hasClass('x') && $("#six").hasClass('x') || $("#seven").hasClass('x') && $("#eight").hasClass('x') && $("#nine").hasClass('x') || $("#one").hasClass('x') && $("#four").hasClass('x') && $("#seven").hasClass('x') || $("#two").hasClass('x') && $("#five").hasClass('x') && $("#eight").hasClass('x') || $("#three").hasClass('x') && $("#six").hasClass('x') && $("#nine").hasClass('x') || $("#one").hasClass('x') && $("#five").hasClass('x') && $("#nine").hasClass('x') || $("#three").hasClass('x') && $("#five").hasClass('x') && $("#seven").hasClass('x')) {
                alert(sessionStorage.getItem('player_x') + ' wins')
                count = 0
                x_win++
                $('#x_win').text(x_win)
                updateHallOfFame(sessionStorage.getItem('player_x'))
                $("#reset").show()
            }
        }

    });

    $("#reset").click(function () {
        resetGame()
        $("#reset").hide()
    });

    $('#btn_modal_o').click(function () {
        var username = modal.find('#username').val();
        sessionStorage.setItem('player_o', username)
        $('#user_as_circle').html(username + ' as O')
        showNewPlayerModal(x)
    });

    $('#btn_modal_x').click(function () {
        var username = modal.find('#username').val();
        sessionStorage.setItem('player_x', username)
        $('#user_as_cross').html(username + ' as X')
        modal.modal('hide');
    });

    $('#hall_of_fame').click(function () {
        $('#hall_of_fame').hide()
        $('.loader').show()
        modalHallofFame.find('ol').empty()
        var ref = firebase.database().ref('/hall_of_fame/').orderByValue().limitToFirst(10)
        ref.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                appendListHallOfFame(childSnapshot.key, childSnapshot.val())
            });
            modalHallofFame.modal()
            $('#hall_of_fame').show()
            $('.loader').hide()
        });
    });

    function resetGame() {
        $("#game li").text("+");
        $("#game li").removeClass('disable')
        $("#game li").removeClass('o')
        $("#game li").removeClass('x')
        $("#game li").removeClass('btn-primary')
        $("#game li").removeClass('btn-info')
        count = 0
    }

    function startGame() {
        sessionStorage.clear('player_x')
        sessionStorage.clear('player_o')
        validatePlayers();
    }

    function validatePlayers() {
        if (typeof (Storage) !== "undefined") {
            var player_o = sessionStorage.getItem('player_o')
            var player_x = sessionStorage.getItem('player_x')
            console.log(player_o + ' ' + player_x)

            if (player_x == null || player_o == null) 
                showNewPlayerModal(o)
            
        } else {
            alert('The web browser was deprecated, please use new version of web browser.')
        }
    }

    function showNewPlayerModal(player) {
        modal.find('#username').val('')
        if (player === o) {
            $('#btn_modal_o').show()
            $('#btn_modal_x').hide()
            modal.find('.modal-title').text('Are you ready player O ?')
        } else {
            $('#btn_modal_o').hide()
            $('#btn_modal_x').show()
            modal.find('.modal-title').text('Are you ready player X ?')
        }
        modal.modal()
    }

    function updateHallOfFame(username) {
        firebase.database().ref('/hall_of_fame/' + username).once('value').then(function (snapshot) {
            var score = snapshot.val() || 0
            var updates = {};
            updates['/hall_of_fame/' + username] = score-1
            firebase.database().ref().update(updates)
        });
    }

    function appendListHallOfFame(key, value) {
        modalHallofFame.find('ol').append('<li class="list-group-item">' + key + ', score ' + Math.abs(value) + '</li>')
    }

    $(window).bind('beforeunload', function () {
        return ;
    });
});
