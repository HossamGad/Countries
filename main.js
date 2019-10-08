
//Hämtar JSON-filerna land + stad
fetch('land.json')
    .then((resp) => resp.json())
    .then(function(countrys) {
        
        fetch('stad.json')
        .then((resp) => resp.json())
        .then(function(citys) {

            //Hämtar ul-listan där huvudmenyn ska visas
            let countryList = document.getElementById('list-countrys');

            
            for (i=0; i<countrys.length; i++) {  //För varje index i land.json
                
                //Lagrar alla länkar och ger dem ett unikt namn
                let liCountryA = []; 

                //Det aktuella landets indexposition sparas
                let countryIndex = i;

                //Skapar lista med länkar
                let li = document.createElement('li'); 
                li.setAttribute('class','nav-item');
                countryList.appendChild(li);  
                
                liCountryA[i] = document.createElement('a');
                liCountryA[i].innerHTML = countrys[i].countryname; 
                liCountryA[i].setAttribute('href','#');
                liCountryA[i].setAttribute('class','nav-link');
                li.appendChild(liCountryA[i]);

                 //Det valda landets position skickas med funktionen
                liCountryA[i].onclick = function() {showCitys(countryIndex)};

            }
            
            //Skapar länk till sidan "Städer jag besökt"
            let li = document.createElement('li'); 
            li.setAttribute('class','nav-item');
            countryList.appendChild(li);  
            
            liA = document.createElement('a');
            liA.innerHTML = "Städer jag besökt"; 
            liA.setAttribute('href','#');
            liA.setAttribute('class','nav-link');
            li.appendChild(liA);
            liA.onclick = function() {showVisitedCitys()};


            //Funktion som skapar underlista med alla städer i valt land
            function showCitys(countryIndex) { 

                //Funktion som skapar/tömmer divvar
                newContainerDiv();
                newDivForCitys();
                let divForCitys = document.getElementById('list-citys');
                
                //Ul skapas för att lista aktuella städer
                let ul = document.createElement('ul'); 
                divForCitys.appendChild(ul);
                
                
                for (i=0; i<citys.length; i++) {  //För varje stad
                   
                    //Om staden ligger i valt land                  
                    if (citys[i].countryid === countrys[countryIndex].id) {
                        
                        //Lagrar alla länkar och ger dem ett unikt namn
                        let liCityA = []; 

                        //Den aktuella stadens id sparas
                        let cityIndex = i;

                        let li = document.createElement('li'); 
                        ul.appendChild(li); 

                        liCityA[i] = document.createElement('a');
                        liCityA[i].innerHTML = citys[i].stadname; 
                        liCityA[i].setAttribute('href','#');
                        li.appendChild(liCityA[i]);
                        liCityA[i].onclick = function() {infoCity(cityIndex, countryIndex)};
                    }
                } 
            }


            //Funktion som visar mer information om vald stad
            function infoCity(cityIndex, countryIndex) { 

                //Skapar/tömmer div för nytt innehåll
                newContainerDiv();
                let divForInfo = document.getElementById('info-div');

                //Rubrik 
                let h1CityName = document.createElement('H1'); 
                h1CityName.innerHTML = citys[cityIndex].stadname;
                divForInfo.appendChild(h1CityName); 

                // info om staden i div
                let pCityInfo = document.createElement('p'); 
                pCityInfo.innerHTML = citys[cityIndex].stadname + " är en stad som ligger i " + countrys[countryIndex].countryname + " och beräknas ha " + citys[cityIndex].population + " st invånare.";
                divForInfo.appendChild(pCityInfo); 

                // knapp för "besökt"
                let saveCityBtn = document.createElement('BUTTON');
                saveCityBtn.setAttribute('id', 'save-button');
                saveCityBtn.innerHTML = 'Besökt'; 
                divForInfo.appendChild(saveCityBtn);
                saveCityBtn.onclick = function() {saveCityFunc(cityIndex)};

                //Skapar paragraf (innehåll läggs ev. till i funkt. saveCityFunc)
                let pAddedCity = document.createElement('p'); 
                pAddedCity.setAttribute('id', 'pAddedCity');
                divForInfo.appendChild(pAddedCity);
            }

            //Funktion för att spara en stad som "besökt"
            function saveCityFunc(cityIndex) { 
               
                //Array som tillfälligt rymmer sparade "städer"
                let visitedCitys = [];

                // Hämtar vad som redan finns i localStorage
                let checkLSCitys = JSON.parse(localStorage.getItem("cityIds"));
            
                if (checkLSCitys != null) {
                    for (i=0; i<checkLSCitys.length; i++) {
                        visitedCitys.push(checkLSCitys[i]); //lägger till alla id:n från localStorage i arrayn
                    }
                }


                //Sparar den aktuella staden till arrayn
                visitedCitys.push(citys[cityIndex].id);

                //Används för att räkna igenom för dubletter
                let count = 0;

                for (i=0; i<visitedCitys.length; i++) { //Gå igenom alla indexpositioner i visitedCitys
                    //Om den aktuella staden hittas i listan 
                    if (visitedCitys[i] === citys[cityIndex].id) {
                        count ++;
                    }
                    
                    //Om aktuella staden hittas fler än en gång tas den senast tillagda bort
                    if(count > 1) {
                        visitedCitys.pop();
                        pAddedCity = document.getElementById('pAddedCity');
                        pAddedCity.innerHTML = citys[cityIndex].stadname + " är redan tillagd som besökt stad."
                    }
                    else {
                        pAddedCity = document.getElementById('pAddedCity');
                        pAddedCity.innerHTML = citys[cityIndex].stadname + " är nu tillagd som besökt stad."
                    }
                }
 
                //
                let visitedcitys_serialized = JSON.stringify(visitedCitys);

                //Den besökta staden sparas även till localStorage
                localStorage.setItem("cityIds", visitedcitys_serialized);

            }    

            //funktion för att lista alla besökta städer
            function showVisitedCitys() {

                //Tömmer/skapar divvar för att använda på nytt
                newDivForCitys()
                newContainerDiv();
                let divForInfo = document.getElementById('info-div');
                
                //Skapar innehåll i div
                let h1VisitedCitys = document.createElement('H1'); 
                h1VisitedCitys.innerHTML = "Besökta städer";
                divForInfo.appendChild(h1VisitedCitys); 

                let ul = document.createElement('ul'); 
                divForInfo.appendChild(ul);

                //LocalStorage hämtas 
                let visitedcitys_deserialized = JSON.parse(localStorage.getItem("cityIds"));

                //Används för att summera alla invånare
                let sum = 0;

                //Om ls != null 
                if (visitedcitys_deserialized != null) {

                    //ls jämförs med alla städer för att få tag på städernas namn
                    for (i=0; i<visitedcitys_deserialized.length; i++) {
                        for (j=0; j<citys.length; j++) {
                           if (citys[j].id === visitedcitys_deserialized[i]) {
                            
                            //Alla sparade städer listas + invånare summeras
                            let li = document.createElement('li');
                            ul.appendChild(li); 
                            li.innerHTML = citys[j].stadname; 
                            sum = sum + citys[j].population;
                           }
                        }
                    }
                }

                //Paragraf skapas
                let paraPeople = document.createElement('p'); 
                divForInfo.appendChild(paraPeople);
                paraPeople.innerHTML = "Städer som du har besök har träffat på " + sum + " st människor.";

                //Knapp för att rensa Storage och förnya sidan
                let eraseStorageBtn = document.createElement('BUTTON');
                eraseStorageBtn.setAttribute('id', 'erase-button');
                eraseStorageBtn.innerHTML = 'Rensa besökta städer'; 
                divForInfo.appendChild(eraseStorageBtn);
                eraseStorageBtn.onclick = function() {eraseCitysFunc()};

                function eraseCitysFunc() {
                    localStorage.clear(); 
                    showVisitedCitys()
                }

            }

            //Rensar och skapar ny div för innehåll
            function newContainerDiv() {
                //Hämtar div för att kunna rensa ev. tidigare innehåll
                let containerForInfo = document.getElementById('container-info');
                let divForInfo = document.getElementById('info-div');
                                 
                //Tar bort tidigare div och skapar ny 
                containerForInfo.removeChild(divForInfo);
                divForInfo = document.createElement('div');
                containerForInfo.appendChild(divForInfo);
                divForInfo.setAttribute('id','info-div');
            }

            //Rensar och skapar ny div för lista (städer)
            function newDivForCitys() {
                //Hämtar div-element med lista för städer
                let divForListCitys = document.getElementById('side-list-citys');
                let divForCitys = document.getElementById('list-citys');
                                
                //Tar bort tidigare div och skapar ny 
                //Att bara ta bort fungerade inte, men om jag skapade en ny fungerar det
                divForListCitys.removeChild(divForCitys);
                divForCitys = document.createElement('div');
                divForListCitys.appendChild(divForCitys);
                divForCitys.setAttribute('id','list-citys'); 
            }

    })
    .catch(function(error) {
        console.log(error);
    });   
})
.catch(function(error) {
    console.log(error);
}); 


