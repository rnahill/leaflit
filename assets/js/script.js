var sGoogleAPIKey = "AIzaSyCbu_8RcyObinDL7LccNRfmOL48r1GqpiQ";

//AE added 
var sLocalStorageName = "obj_history_book_teas";
var aStorageBook = {};
var aStorageTea = {};
var arrSearchCollections = [];

var ReleventTea = ("")
var AvailableGenres = document.getElementsByClassName("button")

const buttonPressed = e => {
    genre = (e.target.id);
    console.log(genre);
    return genre; 
  }

  for (genre of AvailableGenres) {
    genre.addEventListener("click", buttonPressed);
  }

//---------------------------------------------------------------GetTea
async function GetTea(){

    // get the tea from https://boonakitea.cyclic.app/ 
    var TeaResponse = await fetch("https://boonakitea.cyclic.app/api/teas/" + ReleventTea);
    
//  turn the tea to json and give it a variable, this can be used as the "currently displayed" Tea and we can re-use the variable later in search history. 
    var activeTea = TeaResponse.json();
// logging both temporarily. 
    console.log(TeaResponse);
    console.log(activeTea);

    var  teaID = "012";
    var teaName = "Earl Gray";
    var teaFlavor = "Yummy";
    aStorageTea = {id: teaID, teaName: teaName, teaFlavor: teaFlavor};
    collectInfoForLS();
}

//----------------------------------------------------------------- decideTea
function decideTea(){
switch (genre){
case genre = ("fantasy"): 
    ReleventTea = ("Earl Grey");
    break;
 case genre = ("science-fiction"):
    ReleventTea = ("Wulong");
    break;
case genre = ("mystery"):
    ReleventTea = ("White");
    break;
case genre = ("romance"):
    ReleventTea = ("Matcha");
    break;
case genre = ("contemporary"):
    ReleventTea = ("Green");
    break;
case genre = ("non-fiction"):
    ReleventTea = ("Russian Caravan");
    break;
default:
    ReleventTea = ("English Breakfast");
}}

//-----------------------------------------------------------------START  
loadPage();


GetTea();

// converts the relevent Tea to a request to TEA API. This can then be used to write the data on the page. 
//-----------------------------------------------------------------loadpage()
function loadPage() {
    var search_btn = document.querySelector("#search-btn");
    search_btn.addEventListener("click", doSearchBook);
    search_btn.type="button";

    var arrButtonsIDs = ["#fantasy","#science-fiction","#mystery","#romance","#contemporary","#non-fiction"];
    for (i in arrButtonsIDs) {
        var btn = document.querySelector(arrButtonsIDs[i]);
        btn .addEventListener("click", doSearchGanre);
    }

    createLocalStorageButtons();
}

//----------------------------------------------------------------------------------- doSearchBook
function doSearchBook() {
    aStorageBook = {};
    aStorageTea = {};
    searchByTypedText();
    GetTea();
}

//----------------------------------------------------------------------------------- doSearchGanre
function doSearchGanre() {
    aStorageBook = {};
    aStorageTea = {};
    searchByGenre();
    GetTea();   
}

//-----------------------------------------------------------------------------------doSearchHistory
function doSearchHistory() {
    var sISBN = $(this).attr('id');

    aStorageBook = {};
    aStorageTea = {};
    
    var author = "";
    var title = "";
    var teaName = "";

    for (var i in arrSearchCollections) {
        var aLocalStorageBook = arrSearchCollections[i].book;
        if (aLocalStorageBook.isbn == sISBN) {
            // Info for Book:
            author = aLocalStorageBook.author;
            title = aLocalStorageBook.title;

            // Info for Tea:
            var aLocalStorageTea = arrSearchCollections[i].tea;
            teaName = aLocalStorageTea.teaName;

            break;
        }
    }

    searchBookByISBN(sISBN, author, title);
    GetTea();   
}

//-------------------------------------------------------------------------------------searchBookByISBN

function searchBookByISBN(sISBN, author, title) {

    var sGoogleURL = "https://www.googleapis.com/books/v1/volumes?q=";
    //var sKeySearch = "isbn" + "%" + sISBN; 
    var sKeySearch = "isbn" + "%3D" + sISBN; 
    var sMyKey = "&key=" + sGoogleAPIKey;
    var sFetchURL = sGoogleURL + sKeySearch + sMyKey;

    fetch(sFetchURL)
        .then(function(res) {
            return res.json();
        })
        .then(function(result) {
            var resultSingle = result.items[0];            
            readResultSingle(resultSingle, false);
        }),
        function(error) {
            console.log(error);
        };  
}


//------------------------------------------------------------------------------------create genre buttons
function createLocalStorageButtons(){
    //Here, we will take saved local storage information and setup the buttons
    
    var localarrSearchCollections = localStorage.getItem(sLocalStorageName);
    if(localarrSearchCollections == null || localarrSearchCollections == "undefined"  || localarrSearchCollections == "[]")  {
        return;
    } else {
        var localallSearchCollections = JSON.parse(localarrSearchCollections);
    }
    
    var aSearchCollection = {};    
    var buttonsSection = document.querySelector("#search-box");
    for (var i in localarrSearchCollections) {
        aSearchCollection = localallSearchCollections[i];

        if ( aSearchCollection === undefined) {  
            break;
        }
        var aStorageBook = aSearchCollection.book;
        var aStorageTea = aSearchCollection.tea;
    
        //Creating button dynamically
        var btn = document.createElement('BUTTON');
        btn.id = aStorageBook.isbn;
        btn.setAttribute("class", "isbn_search");
        var sButtonText = aStorageBook.title + " by " + aStorageBook.author + " with tea " + aStorageTea.teaName
        var tNode = document.createTextNode(sButtonText);
        btn.appendChild(tNode);
        btn.addEventListener("click", doSearchHistory);
        buttonsSection.appendChild(btn);   
    
        arrSearchCollections.push(aSearchCollection);       
    }
}

//-----------------------------------------------------------------collectInfoForLS
function collectInfoForLS(){
    if ( Object.keys(aStorageBook).length === 0 ||  Object.keys(aStorageTea).length === 0 ) {
        return;
    }

    //Loop at arrSearchCollections to find duplicates
    for (var i in arrSearchCollections) {
        var aLocalStorageBook = arrSearchCollections[i].book;
        var aLocalStorageTea = arrSearchCollections[i].tea;
        if (aLocalStorageBook.isbn == aStorageBook.isbn) {
            //do we want to check aLocalStorageTea for the same tea?
            //do not add this isbn again
            return;
        }
    }

    var aSearchCollection = {};
    aSearchCollection = {book: aStorageBook, tea: aStorageTea};

    //if duplicate is not found, push and add to local storage
    arrSearchCollections.push(aSearchCollection);

    //Adding this to Local Storage
    localStorage.setItem(sLocalStorageName, JSON.stringify(arrSearchCollections));

    //add new button
    addNewHistoryButton();
}

//----------------------------------------------------------------addNewHistoryButton
function addNewHistoryButton(){
    //Creating button dynamically
    var buttonsSection = document.querySelector("#search-box");
    var btn = document.createElement('BUTTON');
    btn.id = aStorageBook.isbn;
    btn.setAttribute("class", "isbn_search");
    var sButtonText = aStorageBook.title + " by " + aStorageBook.author + " with tea " + aStorageTea.teaName
    var tNode = document.createTextNode(sButtonText);
    btn.appendChild(tNode);
    btn.addEventListener("click", doSearchHistory);
    buttonsSection.appendChild(btn);   
}


//------------------------------------------------------------------------------------
function searchByGenre() {
    var sID = $(this.id);
    var sSubject= sID;  //"autobiography", 'fiction', 'humor', 'mystery',  - OK

    var sGoogleURL = "https://www.googleapis.com/books/v1/volumes?q=";
    var sKeySearch = "subject" + ":" + sSubject; 
    var sMyKey = "&key=" + sGoogleAPIKey;
    var sFetchURL = sGoogleURL + sKeySearch + sMyKey;

    fetch(sFetchURL)
        .then(function(res) {
            return res.json();
        })
        .then(function(result) {
            var oItems = result.items;
            var iLength = oItems.length;
            var iRandomIndex = getRandomNumber(iLength);
            var resultSingle = oItems[iRandomIndex];
            //readResults(result);
            readResultSingle(resultSingle, true);
        }),
        function(error) {
            console.log(error);
        };
}

        //------------------------------------------------------------------searchByTypedText
        function  searchByTypedText() {

            var selectedText = "title"; //["title" ,  "author", "publisher"]
            selectedText = "in" + selectedText;
        
            var oTypedText = document.querySelector("#search-input");
            var typedText = oTypedText.value;
            oTypedText.value = "";
        
            var sGoogleURL =     "https://www.googleapis.com/books/v1/volumes?q=";
            var sKeySearch = selectedText  + ":" + typedText ;      
            var sMyKey = "&key=" + sGoogleAPIKey;
            var sFetchURL = sGoogleURL + sKeySearch + sMyKey;
        
            fetch(sFetchURL)
                .then(function(res) {
                return res.json();
                })
                .then(function(result) {
                var resultSingle = result.items[0];
                readResultSingle(resultSingle, true);
                }),
                function(error) {
                console.log(error);
                };
        }
        

//---------------------------------------------------------------------------readResultSingle

function readResultSingle(oItem, bAddToHistory) {
   
    var sToDisplay = "";
    var sAuthor = "";
    var sIdentifierISBN = oItem.volumeInfo.industryIdentifiers[1].identifier;
    var arrAuthors = oItem.volumeInfo.authors;
    var sTitle = oItem.volumeInfo.title; 

    var sPublisher = oItem.volumeInfo.publisher;
    if (sPublisher == 'undentified') {
        sPublisher = "multiple";
    }

    sToDisplay += "Title: " + sTitle;                                   sToDisplay += '\n';            
    sToDisplay += "Author: " + arrAuthors ;                                                 sToDisplay += '\n';   
    sToDisplay += "Publisher: " + sPublisher;                                                       sToDisplay += '\n';    
    sToDisplay += "Length: " + oItem.volumeInfo.pageCount + " pages";  sToDisplay += '\n';    
    sToDisplay += "Category: " + oItem.volumeInfo.categories;                  sToDisplay += '\n';
    //sToDisplay += "Description: " + oItem.volumeInfo.description;  sToDisplay += '\n';    
     
   var screenBookArea = document.querySelector("#book-info");
    screenBookArea.innerText = sToDisplay;


    var sThumbnail = oItem.volumeInfo.imageLinks.thumbnail;       //adding thumbnail for the book
    var screenCoverArea = $("#book-cover");
    screenCoverArea.attr('src', sThumbnail);//innerHTML = sThumbnail;

    //AE added 
    var iLen = arrAuthors.length;
    if(iLen > 1) {
        iLen -= 1;
        sAuthor = arrAuthors[0] + " +" + String(iLen); 
    } else {
        sAuthor = arrAuthors[0] ;
    }
    
    if (bAddToHistory) {
        aStorageBook = {isbn: sIdentifierISBN, author: sAuthor, title: sTitle};
        collectInfoForLS();
    }
}


//----------------------------------------------------------------getRandomNumber() function
function getRandomNumber(iLength) {
    return Math.floor(Math.random() * iLength);
}


//------------------------------------------------------------------
function cleanLocalStorage() {
    //cleaning local storage arrSearchCollections
    var bCleanLC = true;
    if(bCleanLC) {
        var localarrSearchCollections = [];
        localStorage.setItem(sLocalStorageName, JSON.stringify(localarrSearchCollections));  
    }
}
