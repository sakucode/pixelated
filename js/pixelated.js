var pixelated = function (canvasId) {
    _self = this;
    _self.colors = ['#008B8B', '#8B008B', '#FF8C00', '#8B0000', '#DEB887'];

    var rectSize = 48;
    var fields = new Array();
    var clicks = 0;
    var gameOver = false;
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext('2d');

    var init = function () {
        canvas.width = canvas.parentElement.offsetWidth - canvas.parentElement.offsetWidth % rectSize;
        if (document.documentElement.clientWidth > document.documentElement.clientHeight)
            canvas.height = canvas.width / 3 - (canvas.width / 3) % rectSize;
        else
            canvas.height = canvas.width;

        if (isTouchSupported()) {
            canvas.addEventListener("touchend", doTouch, false);
        }
        if (isMouseSupported()) {
            canvas.addEventListener("mousedown", doClick, false);
        }
    };

    _self.playGame = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        clicks = 0;
        gameOver = false;
        newBoard();
        drawBoard();
        refreshGUI();
    };

    var isTouchSupported = function () {
        var msTouchEnabled = window.navigator.msMaxTouchPoints;
        var generalTouchEnabled = "ontouchstart" in document.createElement("div");

        if (msTouchEnabled || generalTouchEnabled) {
            return true;
        }
        return false;
    };

    var isMouseSupported = function () {
        var generalTouchEnabled = "onmousedown" in document.createElement("div");
        return generalTouchEnabled;
    };

    var newBoard = function () {
        for (var row = 0; row < Math.floor(canvas.height / rectSize); row++) {
            fields[row] = new Array();
            for (var col = 0; col < Math.floor(canvas.width / rectSize); col++) {
                fields[row][col] = _self.colors[Math.floor(Math.random() * 1000) % _self.colors.length];
            }
        }
    };

    var drawBoard = function () {
        for (var row = 0; row < fields.length; row++) {
            for (var col = 0; col < fields[row].length; col++) {
                context.beginPath();
                context.rect(col * rectSize, row * rectSize, rectSize, rectSize);
                context.fillStyle = fields[row][col];
                context.fill();
            }
        }
    };

    var doClick = function (evt) {
        doTapOnField(evt);
    };

    var doTouch = function (evt) {
        if (isTouchSupported())
            evt = evt.changedTouches[0];

        doTapOnField(evt);
    };

    var doTapOnField = function (evt) {
        var rect = canvas.getBoundingClientRect();
        var pos = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };

        var row = Math.floor(pos.y / rectSize);
        var col = Math.floor(pos.x / rectSize);
        var selectedColor = fields[row][col];
        var orgColor = fields[0][0];

        if (orgColor !== selectedColor) {
            clicks++;
            changeFieldsColors(0, 0, orgColor, selectedColor);
            drawBoard();
            gameOver = checkGameOver();
            refreshGUI();
        }
    };

    var changeFieldsColors = function (row, col, orgColor, newColor) {
        if (row >= fields.length || row < 0)
            return;
        if (col >= fields[0].length || col < 0)
            return;

        if (fields[row][col] === orgColor) {
            fields[row][col] = newColor;

            changeFieldsColors(row, col + 1, orgColor, newColor); // rechts
            changeFieldsColors(row + 1, col, orgColor, newColor); // unten
            changeFieldsColors(row, col - 1, orgColor, newColor); // links
            changeFieldsColors(row - 1, col, orgColor, newColor); // oben
        }
    };

    var checkGameOver = function () {
        var firstElem = fields[0][0];
        for (var row = 0; row < fields.length; row++) {
            for (var col = 0; col < fields[row].length; col++) {
                var finished = firstElem === fields[row][col]
                if (!finished)
                    return false;
            }
        }
        return true;
    };

    var refreshGUI = function () {
        if (gameOver) {
            var rect = canvas.getBoundingClientRect();
            context.rect(0, 0, rect.width, rect.height);
            context.fillStyle = 'black';
            context.globalAlpha = 0.5;
            context.fill();
            context.globalAlpha = 1;
            context.font = 'italic 40pt Segoe UI';
            context.fillStyle = 'white';

            var finalText = "Geschafft!";
            placeText("Geschafft!", canvas.height / 3)
            context.font = '20pt Segoe UI';
            placeText("Züge: " + clicks, canvas.height / 3 + 40)
        }
    };

    var placeText = function (text, topPos) {
        var textPos = (canvas.width / 2) - (context.measureText(text).width / 2);
        context.fillText(text, textPos, topPos);
    };

    init();
};
