// Global Variables
var sGoogleAPIKey = "AIzaSyCbu_8RcyObinDL7LccNRfmOL48r1GqpiQ";
var ReleventTea = ("")
var AvailableGenres = document.getElementsByClassName("button")

// Element Selectors
var $bookInfo = document.querySelector("#book-info");
var $bookDescription = document.querySelector('#book-description');
var $bookStats = document.querySelector("#book-stats");

//AE added 
var sLocalStorageName = "obj_history_book_teas";
var aStorageBook = {};
var aStorageTea = {};
var arrSearchCollections = [];

var ReleventTea = ("")
var AvailableGenres = document.getElementsByClassName("button")

// Element Selectors
var $bookInfo = document.querySelector("#book-info");
var $bookDescription = document.querySelector('#book-description');

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
function readResultSingle(book) {
    // Clear Book Info:
    $bookDescription.innerHTML = "";
    $bookStats.innerHTML="";
    console.log(book);


    // Store book information in separate variables
    let title = book.volumeInfo.title;
    let author = book.volumeInfo.authors;
    let publisher = book.volumeInfo.publisher;
    let publishedDate = dayjs(book.volumeInfo.publishedDate).year();
    let pageCount = book.volumeInfo.pageCount;
    let description = book.volumeInfo.description;
    let thumbnail = book.volumeInfo.imageLinks.thumbnail;
    let infoLink = book.volumeInfo.infoLink;
    let isbn = book.volumeInfo.industryIdentifiers[0].identifer;

    // Replace Zoom Parameter in thumbnail link
    thumbnail = thumbnail.replace("zoom=1","zoom=0");

    // Render Content

    // Render Title
    var $bookTitle = document.createElement("h2");

    $bookTitle.setAttribute("class","feature-title");
    $bookTitle.textContent=title;

    $bookDescription.appendChild($bookTitle);

    // Render Author
    var $bookAuthor = document.createElement("p");
    $bookAuthor.innerHTML = `By: <span id="author-info">${author[0]}</span>`;

    $bookDescription.appendChild($bookAuthor);

    // Render Description
    var $bookSummary = document.createElement("p");
    
    $bookSummary.textContent = description;
    
    $bookDescription.appendChild($bookSummary);

    // Previous Rendering Code ------------------------------------------------------
        
        // var sToDisplay = "";
        // sToDisplay += "Title: " + oItem.volumeInfo.title;               sToDisplay += '\n';            
        // sToDisplay += "Author: " + oItem.volumeInfo.authors;     sToDisplay += '\n';   
        // sToDisplay += "Publisher: " + oItem.volumeInfo.publisher;   sToDisplay += '\n';    
        // sToDisplay += "Length: " + oItem.volumeInfo.pageCount + " pages";  sToDisplay += '\n';    
        // sToDisplay += "Category: " + oItem.volumeInfo.categories;  sToDisplay += '\n';
        //sToDisplay += "Description: " + oItem.volumeInfo.description;  sToDisplay += '\n';    
        
        // var screenBookArea = document.querySelector("#book-info");
        // screenBookArea.innerText = sToDisplay;


        // var sThumbnail = oItem.volumeInfo.imageLinks.thumbnail;
        // var screenCoverArea = $("#book-cover");
        // screenCoverArea.attr('src', sThumbnail);

        // var sIdentifier = oItem.volumeInfo.industryIdentifiers[0].identifer;
        // sToDisplay += "ISBN: " + sIdentifier;  sToDisplay += '\n';

    // End Previous Rendering Code ----------------------------------------------

    // Render Book Stats
    let rows = [
        {
            label1: "Page Count:",
            value1: pageCount,
            label2: "Detailed Info:",
            value2: infoLink
        },
        {
            label1: "Publisher:",
            value1: publisher,
            label2: "Published:",
            value2: publishedDate
        }

    ]

    let $table = document.createElement("table");
    for(let row of rows) {
        // create row
        let $row = document.createElement("tr");

        // create cells
        let $cellLabel1 = document.createElement("td");
        $cellLabel1.setAttribute("class","is-borderless stat-label");
        $cellLabel1.textContent = row.label1;
        $row.appendChild($cellLabel1);

        let $cellValue1 = document.createElement("td");
        $cellValue1.setAttribute("class", "is-borderless");
        $cellValue1.textContent = row.value1;
        $row.appendChild($cellValue1);

        // create cells
        let $cellLabel2 = document.createElement("td");
        $cellLabel2.setAttribute("class","is-borderless stat-label");
        $cellLabel2.textContent = row.label2;
        $row.appendChild($cellLabel2);

        
        let $cellValue2 = document.createElement("td");
        // Create link for Detailed Info
        if(row.label2 === "Detailed Info:") {
            var $infoLink = document.createElement("a")
            $infoLink.setAttribute("href", row.value2);
            $infoLink.textContent="Google Books";
            $cellValue2.appendChild($infoLink);
        } else {
            $cellValue2.textContent = row.value2;
        }

        $cellValue2.setAttribute("class", "is-borderless");
        $row.appendChild($cellValue2);
        // append to row
        // append to table

        $table.appendChild($row);
    }

    $bookStats.appendChild($table);


// ---------- Commenting out until my refactor and expansion is complete --------
    //AE added 
    // var iLen = arrAuthors.length;
    // if(iLen > 1) {
    //     iLen -= 1;
    //     sAuthor = arrAuthors[0] + " +" + String(iLen); 
    // } else {
    //     sAuthor = arrAuthors[0] ;
    // }
    
    // if (bAddToHistory) {
    //     aStorageBook = {isbn: sIdentifierISBN, author: sAuthor, title: sTitle};
    //     collectInfoForLS();
    // }
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
