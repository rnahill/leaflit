var sGoogleAPIKey = "AIzaSyCbu_8RcyObinDL7LccNRfmOL48r1GqpiQ";
var ReleventTea = ("")
var AvailableGenres = document.getElementsByClassName("button")

const buttonPressed = e => {
    genre = (e.target.id);
    console.log(genre);
    decideTea(genre) 
  }

  for (genre of AvailableGenres) {
    genre.addEventListener("click", buttonPressed);
  }

function decideTea(genre){
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

//-----------------------------------------------------------------START  
loadPage();

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
    searchByTypedText();
    //GetTea();
}

//----------------------------------------------------------------------------------- doSearchGanre
function doSearchGanre() {
    searchByGenre()
    //GetTea();
}
//------------------------------------------------------------------------------------create genre buttons
function createLocalStorageButtons(){
    //Here, we will take saved local storage information and setup the buttons
    var buttonsSection = document.querySelector("#search-box");
}

//----------------------------------------------------------------
async function GetTea(){
    // get the tea from https://boonakitea.cyclic.app/ 
    var TeaQuery = await fetch("https://boonakitea.cyclic.app/api/teas/" + ReleventTea);
//  process the tea response, first to json then selecting a random tea from the available selection.  
    var activeTea = await TeaQuery.json();
    var TeaEntries = Object.entries(activeTea[0].types);
    var Entry = TeaEntries[Math.floor(Math.random() * TeaEntries.length)]
}
// write the tea info to the page.
    


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
            readResultSingle(resultSingle);
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
            readResultSingle(resultSingle);
            }),
            function(error) {
            console.log(error);
            };
        }

//---------------------------------------------------------------------------readResultSingle
function readResultSingle(oItem) {
   
    var sToDisplay = "";
    sToDisplay += "Title: " + oItem.volumeInfo.title;               sToDisplay += '\n';            
    sToDisplay += "Author: " + oItem.volumeInfo.authors;     sToDisplay += '\n';   
    sToDisplay += "Publisher: " + oItem.volumeInfo.publisher;   sToDisplay += '\n';    
    sToDisplay += "Length: " + oItem.volumeInfo.pageCount + " pages";  sToDisplay += '\n';    
    sToDisplay += "Category: " + oItem.volumeInfo.categories;  sToDisplay += '\n';
        //sToDisplay += "Description: " + oItem.volumeInfo.description;  sToDisplay += '\n';    
     
   var screenBookArea = document.querySelector("#book-info");
    screenBookArea.innerText = sToDisplay;


    var sThumbnail = oItem.volumeInfo.imageLinks.thumbnail;       //adding thumbnail for the book
    var screenCoverArea = $("#book-cover");
    screenCoverArea.attr('src', sThumbnail);//innerHTML = sThumbnail;

    var sIdentifier = oItem.volumeInfo.industryIdentifiers[0].identifer;
    sToDisplay += "ISBN: " + sIdentifier;  sToDisplay += '\n';

}

//----------------------------------------------------------------getRandomNumber() function
function getRandomNumber(iLength) {
    return Math.floor(Math.random() * iLength);
}



