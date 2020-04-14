/*global require */
/*global Audio: false */
requirejs(['QueenLizGamePlay', 'Tools'], function (QueenLizGamePlay, Tools) {

    'use strict';

    var NUMBER_OF_CARDS_IN_STACK = 30;

    var GameBox = function () {

        var MAX_NUMBER_OF_SLOTS = 3;
        var CARD_WIDTH = 68;

        this.slotNumber;
        this.players = [];
        this.maxNumberOfSlots = MAX_NUMBER_OF_SLOTS;
        this.cardWidth = CARD_WIDTH;

        this.dictionaries = null;

    };

        /**
     * makes the initial master view
     */
    GameBox.makeMasterView = function () {

        var oMasterView = document.createElement('div');
        Tools.setClass(oMasterView, 'master');
        oMasterView.setAttribute('id', 'master');

        document.body.insertBefore(oMasterView, null);

        var oMenuView = document.createElement('div');
        Tools.setClass(oMenuView, 'menu');
        oMenuView.setAttribute('id', 'menu');

        Tools.makeButton({
            id: 'menuButton',
            parentView: oMasterView,
            handler: menuButtonPressed.bind(this)
        });

        var oAddWordModeButton = Tools.makeButton({
            id: 'addWordMode',
            label: 'Add Words to Dictionary',
            parentView: oMenuView,
            handler: addWordModeButtonPressed.bind(this)
        });
        Tools.addClass(oAddWordModeButton, 'visible');

        var oPlayModeButton = Tools.makeButton({
            id: 'playMode',
            label: 'Play',
            parentView: oMenuView,
            handler: playModeButtonPressed.bind(this)
        });
        Tools.addClass(oPlayModeButton, 'visible');

        var oHandleAddWordTextInputChanged = function (oEvent) {
            var sValue = '';
            if (oEvent && oEvent.target) {
                sValue = oEvent.target.value;
            }
            this.wordToAdd = sValue;
        }.bind(this);

        Tools.makeTextInput({
            id: 'addWord',
            parentView: oMenuView,
            handler: oHandleAddWordTextInputChanged.bind(this)
        });

        Tools.makeButton({
            id: 'addToDictionary',
            label: 'Add to Dictionary',
            parentView: oMenuView,
            handler: addToDictionaryButtonPressed.bind(this)
        });

        var oAddedDictionaryWordStatusView = document.createElement('div');
        Tools.setClass(oAddedDictionaryWordStatusView, 'addedDictionaryWordStatus');
        oAddedDictionaryWordStatusView.setAttribute('id', 'addedDictionaryWordStatus');
        oMenuView.insertBefore(oAddedDictionaryWordStatusView, null);

        Tools.makeButton({
            id: 'exitAddWordMode',
            label: 'Done',
            parentView: oMenuView,
            handler: exitAddWordModeButtonPressed.bind(this)
        });

        Tools.makeButton({
            id: 'replay',
            label: 'Play Again',
            parentView: oMenuView,
            handler: replayButtonPressed.bind(this)
        });

        oMasterView.insertBefore(oMenuView, null);

    };

    /**
     * makes the initial game view
     */
    GameBox.makeGameView = function () {

        var oGameView = document.createElement('div');
        Tools.setClass(oGameView, 'game');
        oGameView.setAttribute('id', 'game');

        document.body.insertBefore(oGameView, null);

        var oPlayAreaView = document.createElement('div');
        Tools.setClass(oPlayAreaView, 'playArea');
        oPlayAreaView.setAttribute('id', 'playArea');

        oGameView.insertBefore(oPlayAreaView, null);

        var oCountdownView = document.createElement('div');
        Tools.setClass(oCountdownView, 'countdown');
        oCountdownView.setAttribute('id', 'countdown');

        oGameView.insertBefore(oCountdownView, null);

        var oResultView = document.createElement('div');
        Tools.setClass(oResultView, 'result');
        oResultView.setAttribute('id', 'result');

        document.body.insertBefore(oResultView, null);
    };

    var menuButtonPressed = function () {
        var oMenuView = document.getElementById('menu');
        Tools.toggleClass(oMenuView, 'visible');
    };

    var addWordModeButtonPressed = function () {
        _enterAddWordMode.call(this);
    };

    var exitAddWordModeButtonPressed = function () {
        _exitAddWordMode.call(this);
    };

    var playModeButtonPressed = function () {
        _startPlayMode.call(this);
    };
    
    var addToDictionaryButtonPressed = function () {

        var oNewWord = this.wordToAdd;
        this.wordToAdd = '';
        var oNewWordValue = oNewWord.trim();
        if (oNewWordValue && oNewWordValue.length > 0 ) {
            var oMatchSpaces = / /g;
            var oNewWordKey = oNewWordValue.toLowerCase().replace(oMatchSpaces, '_');
            var oDatabase = firebase.database();
            var oEnglishDictionaryReference = oDatabase.ref('dictionaries/english-family/' + oNewWordKey);
            
            oEnglishDictionaryReference.set(oNewWordValue);
        }
    };

    var replayButtonPressed = function () {
        _replay.call(this);
    };

    GameBox.getRandomName = function (nName, aNames, sNotThisName) {

        var i, aCopyOfNames = [];
        for (i = 0; i < aNames.length; i++) {
            if (aNames[i] !== sNotThisName) {
                aCopyOfNames.push(aNames[i]);
            }
        }

        var aShuffledNames = Tools.shuffle(aCopyOfNames);

        if (aShuffledNames.length > 0) {
            return aShuffledNames[0];
        }

        return 'Name' + nName;
    };

    GameBox.prototype.startGetDictionary = function (fnSuccessfullyGotDictionaries) {

        var oGameBox = this;
        var oDatabase = firebase.database();
        var oDictionariesReference = oDatabase.ref('dictionaries');
        var oEnglishFamilyDictionaryReference = oDatabase.ref('dictionaries/english-family');
    
        oEnglishFamilyDictionaryReference.on('child_added', function (snapshot) {
            var sAddedWord = snapshot ? snapshot.val() : null;
            this.updateDictionaryWordStatusView.call(oGameBox, sAddedWord);
        }.bind(this));
    
        oDictionariesReference.once('value', function (snapshot) {
            oGameBox.dictionaries = snapshot.val();

            fnSuccessfullyGotDictionaries.call(oGameBox);
        });
    
    };

    GameBox.prototype.updateDictionaryWordStatusView = function (sAddedWord) {
        var oAddedDictionaryWordStatusView = document.getElementById('addedDictionaryWordStatus');
        if (sAddedWord) {
            oAddedDictionaryWordStatusView.innerHTML = sAddedWord;
            _clearAddWordTextInput();
            Tools.addClass(oAddedDictionaryWordStatusView, 'visible');
        } else {
            oAddedDictionaryWordStatusView.innerHTML = '';
        }

        var timeoutID;

        timeoutID = window.setTimeout(clearStatusView, 2 * 1000);
        function clearStatusView() {
            window.clearTimeout(timeoutID);
            Tools.removeClass(oAddedDictionaryWordStatusView, 'visible');
        }
    };

    GameBox.prototype.afterGetDictionarySuccessThenStartGame = function () {

        var nNumPlayers = 2;

        var oDictionary = oGameBox.dictionaries['english-family'];
        var aQueenLizCardValues = _convertDictionaryObjectsToElements(oDictionary);

        var aCards = GameBox.makeCards(aQueenLizCardValues, NUMBER_OF_CARDS_IN_STACK);
        
        var oQueenLizGamePlay = new QueenLizGamePlay(
            nNumPlayers,
            aCards,
            aHomebaseNames,
            oGameBox.maxNumberOfSlots,
            oGameBox.cardWidth,
            {
                renderResult: GameBox.renderResult,
                getRandomName: GameBox.getRandomName
            }
        );
    
        var bShuffleCards = true;
    
        oQueenLizGamePlay.start(bShuffleCards);

    };

    GameBox.renderResult = function (sResult) {
        var oResultView = document.getElementById('result');

        var oContent = document.createTextNode(sResult ? sResult : '');
        if (oResultView.firstChild) {
            oResultView.removeChild(oResultView.firstChild);
        }
        oResultView.appendChild(oContent);
    };

    GameBox.makeCards = function (aCardValues, nNumberOfCards) {
        var aCards = [];

        var i;
        var nNumberOfCardsInStack = Math.min(aCardValues.length, nNumberOfCards);

        // distributes the cards into suits
        for (i = 0; i < nNumberOfCardsInStack; i++) {
            aCards.push({
                value: aCardValues[i],
            });
        }

        return aCards;
    };

    var _convertDictionaryObjectsToElements = function (oDictionaryObjects) {
        var aDictionaryElements = [];
        var aKeys = Object.keys(oDictionaryObjects);
        var i;
        for (i = 0; i < aKeys.length; i++) {
            var sKey = aKeys[i];
            var sValue = oDictionaryObjects[sKey];
            aDictionaryElements.push(sValue);
        }
        return aDictionaryElements;
    }

    var _clearAddWordTextInput = function () {
        var oAddWordTextInput = document.getElementById('addWord');
        oAddWordTextInput.value = '';
    }

    var _enterAddWordMode = function () {

        _makeViewsVisible([ 'addWord','addToDictionary', 'exitAddWordMode' ]);
        _makeViewsInvisible([ 'playMode', 'addWordMode', 'replay' ]);

    };
    
    var _exitAddWordMode = function () {
    
        _makeViewsInvisible([ 'addWord','addToDictionary', 'exitAddWordMode', 'replay' ]);
        _makeViewsVisible([ 'playMode', 'addWordMode' ]);

    };
 
    var _startPlayMode = function () {

        _makeViewsInvisible([ 'menu', 'playMode', 'addWordMode', 'addWord','addToDictionary', 'exitAddWordMode' ]);
        _makeViewsVisible([ 'replay' ]);

    };
    
    var _replay = function () {
        
        _makeViewsInvisible([ 'addWord','addToDictionary', 'exitAddWordMode', 'replay' ]);
        _makeViewsVisible([ 'playMode', 'addWordMode' ]);

    };

    var _makeViewsVisible = function (aViews) {
        var i;
        for (i = 0; i < aViews.length; i++) {
            var sViewId = aViews[i];
            var oView = document.getElementById(sViewId);
            if (oView) {
                Tools.addClass(oView, 'visible');
            }
        }
    };

    var _makeViewsInvisible = function (aViews) {
        var i;
        for (i = 0; i < aViews.length; i++) {
            var sViewId = aViews[i];
            var oView = document.getElementById(sViewId);
            if (oView) {
                Tools.removeClass(oView, 'visible');
            }
        }
    };

    // starts set up of the game
    GameBox.makeMasterView();
    GameBox.makeGameView();

    var aHomebaseNames = [ 'andrew', 'diana', 'george', 'catherine', 'henry', 'margaret', 'edward', 'mary', 'charles' ];

    var oGameBox = new GameBox();

    oGameBox.startGetDictionary.call(oGameBox, oGameBox.afterGetDictionarySuccessThenStartGame.bind(oGameBox));

});
