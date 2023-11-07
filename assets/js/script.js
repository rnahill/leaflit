// Global Variables
var sGoogleAPIKey = "AIzaSyCG69hbyixMVZjNKgnDsUu3mkk8yq3ez0o";
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
var bAddToStorage = false;

var ReleventTea = ("")
var AvailableGenres = document.getElementsByClassName("button")

// Element Selectors
var $bookInfo = document.querySelector("#book-info");
var $bookDescription = document.querySelector('#book-description');

const buttonPressed = e => {
    genre = (e.target.id);
    decideTea(genre) 
  }

  for (genre of AvailableGenres) {
    genre.addEventListener("click", buttonPressed);
  }

//-----------------------------------------------------------------START  
loadPage();


//---------------------------------------------------------------GetTea
async function GetTea(){
    // get the tea from https://boonakitea.cyclic.app/ 
    var TeaQuery = await fetch("https://boonakitea.cyclic.app/api/teas/" + ReleventTea);
//  process the tea response, first to json then selecting a random tea from the available selection.  
    var activeTea = await TeaQuery.json();
    var TeaEntries = Object.entries(activeTea[0].types);
    var Entry = TeaEntries[Math.floor(Math.random() * TeaEntries.length)]

    collectInfoForLS();
}


//----------------------------------------------------------------- decideTea
function decideTea(){
switch (genre){
case genre = ("fantasy"): 
    ReleventTea = ("Black");
    console.log(ReleventTea);
    GetTea()
    break;
 case genre = ("science-fiction"):
    ReleventTea = ("white");
    console.log(ReleventTea);
    GetTea()
    break;
case genre = ("mystery"):
    ReleventTea = ("White");
    console.log(ReleventTea);
    GetTea()
    break;
case genre = ("romance"):
    ReleventTea = ("green");
    console.log(ReleventTea);
    GetTea()
    break;
case genre = ("contemporary"):
    ReleventTea = ("Green");
    console.log(ReleventTea);
    GetTea()
    break;
case genre = ("non-fiction"):
    ReleventTea = ("black");
    console.log(ReleventTea);
    GetTea()
    break;
    // added case to prevent the search form from calling tea api.
case genre = ("search-form"):
    break;
default:
    ReleventTea = ("black");
    console.log(ReleventTea);
    GetTea()
}}


// converts the relevent Tea to a request to TEA API. This can then be used to write the data on the page. 
//-----------------------------------------------------------------loadpage()
function loadPage() {
       // AE - this is just for cleaning local storage:         cleanLocalStorage(); return;
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
    bAddToStorage = true;
    searchByTypedText();
}

//----------------------------------------------------------------------------------- doSearchGanre
function doSearchGanre() {
    aStorageBook = {};
    aStorageTea = {};
    bAddToStorage = true;
    searchByGenre(); 
}

//-----------------------------------------------------------------------------------doSearchHistory
function doSearchHistory() {
    var sISBN = $(this).attr('id');
    aStorageBook = {};
    aStorageTea = {};
    bAddToStorage = false;

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
            try {
                var resultSingle = result.items[0];            
                readResultSingle(resultSingle, false); 
            } catch (error) {
                console.log(error);
            }
            
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
    let isbn = book.volumeInfo.industryIdentifiers[1].identifier;

    // Set book info values based on data completeness
    let missingData = "Not Available";
    author = author  ? author : missingData;
    publisher = publisher ? publisher : missingData;
    pageCount = pageCount ? pageCount : missingData;
    description = description ? description : missingData;

    let stats = [
        {
            label: "Page Count: ",
            value: pageCount
        },
        {
            label: "Publisher: ",
            value: publisher
        },
        {
            label: "Published: ",
            value: publishedDate
        },
        {
            label: "Detailed Info: ",
            value: infoLink
        }
    ]

    // Generate Book stats
    var $value;
    for (let stat of stats) {
        // create div
        let $tempDiv = document.createElement('div');

        // append span and p tag if not a link
        let $label = document.createElement("span");
        $label.setAttribute("class", "stat-label");
        $label.textContent = stat.label;

        if(stat.label === "Detailed Info: ") {
            // create link
            $value = document.createElement("a");
            $value.setAttribute("href",stat.value);
            $value.textContent = "Google Books";
        } else {
            $value = document.createElement("p");
            $value.textContent = stat.value;
        }

        $tempDiv.appendChild($label);
        $tempDiv.appendChild($value);
        $bookStats.appendChild($tempDiv);

        // append to $bookStatss
    }
    //AE - thumbnail address cannot be changed as Google has zoom=1 in address
    //AE - If we want to set zoom to 90% (or so), I strongly believe that we have to do it through css
    //AE removed - thumbnail = thumbnail.replace("zoom=1","zoom='90%'");


    // AE - Inserted thumbnail for book cover
    var screenCoverArea = $("#book-cover");
    screenCoverArea.attr('src', thumbnail);


    // Render Title
    var $bookTitle = document.createElement("h2");

    $bookTitle.setAttribute("class","feature-title");
    $bookTitle.textContent=title;

    $bookDescription.appendChild($bookTitle);

    // Render Author
    var $bookAuthor = document.createElement("p");
    if(author) {
        $bookAuthor.innerHTML = `By: <span id="author-info">${author[0]}</span>`;
    } else {
        $bookAuthor.textContent = "No author information."
    }


    $bookDescription.appendChild($bookAuthor);

    // Render Description
    var $bookSummary = document.createElement("p");
    if(description) {
        $bookSummary.textContent = description;
    } else {
        $bookSummary.textContent = "No summary available.";
    }    
    $bookDescription.appendChild($bookSummary);


// ---------- TODO: Refactor local storage to match current function variables --------
    // AH -- Removed if statements for author. Added flow control above.
    
    // AE - Changed ISBN variable, author variable (for a single author only), and title variable
    if (bAddToStorage && isbn != undefined) {
        aStorageBook = {isbn: isbn, author: author[0], title: title};
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
