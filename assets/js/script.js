genre = "fantasy";
ReleventTea = "earlgrey";

GetTea()

async function GetTea(){
    // get the tea from https://boonakitea.cyclic.app/ 
var TeaResponse = await fetch("https://boonakitea.cyclic.app/api/teas/" + ReleventTea)
//  turn the tea to json and give it a variable, this can be used as the "currently displayed" Tea and we can re-use the variable later in search history. 
var activeTea = TeaResponse.json()
// logging both temporarily. 
console.log(TeaResponse);
console.log(activeTea);
}