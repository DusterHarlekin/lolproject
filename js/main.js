const apiKey = "RGAPI-27267379-e71b-4737-a98b-9e3d153a0fc6";
var champions;
var normalRot;
var newRot;
var currentVersion;

$(document).ready(function () {

    //cargar main

    $("#principal-container").load("../pages/main.html", function(){

        $("#loading").fadeOut(600, function(){
            $("#principal-container").fadeIn(600); 

        });

        $("#user-icon").click(function (){
            $("#principal-container").fadeOut(600, function(){
                $("#loading").show();
                $("#principal-container").load("../pages/summoner.html", function(){
                    $.getScript("js/summoner.js");
                    $("#loading").fadeOut(600, function(){
                        $("#principal-container").fadeIn(600);
                    });
                });
            })
        });


        $("#rot-normal").click(function () {
            if ($("#rot-new").hasClass("rot-selected")) {
                $("#rot-new").removeClass("rot-selected");
                $("#rot-normal").addClass("rot-selected");

                $("#rotation").fadeOut(300, function(){
                    $("#rotation").html("");
                    fillRotation(normalRot);
                    $("#rotation").fadeIn(300);

                });
            } else {
                console.log("no se hizo nada");
            }
        });
    
        $("#rot-new").click(function () {
            if ($("#rot-normal").hasClass("rot-selected")) {
                $("#rot-normal").removeClass("rot-selected");
                $("#rot-new").addClass("rot-selected");

                $("#rotation").fadeOut(300, function(){ 
                    $("#rotation").html("");
                    fillRotation(newRot);
                    $("#rotation").fadeIn(300);
                });
            } else {
                console.log("no se hizo nada");
            }
    
        });
    
        fetch('https://ddragon.leagueoflegends.com/api/versions.json', {
    
            })
            .then(response => {
                return response.json();
            })
    
            .then(data => {
    
                currentVersion = data[0];
    
                // FETCH DE LOS CAMPEONES
    
                fetch('http://ddragon.leagueoflegends.com/cdn/' + currentVersion + '/data/en_US/champion.json', {
    
                    })
                    .then(response => {
                        return response.json();
                    })
    
                    .then(data => {
                        champions = data.data;
                        console.log('Success:', champions);
    
                        Object.entries(champions).forEach(([key, value]) => {
                            let stringRoleImg = `i-${value.tags[0].toLowerCase()}.png`;
    
                            let stringRoles = value.tags[0];
    
                            let champsImg = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${value.id}_0.jpg`           
                           
                            //BARRAS DE DIFICULTAD
    
                            let difBarsPainted;
    
                            if(value.info.difficulty >= 1 && value.info.difficulty <= 3){
                                difBarsPainted = 1;
                            }
                            else if(value.info.difficulty >= 4 && value.info.difficulty <= 7){
                                difBarsPainted = 2;
                            }
                            else if(value.info.difficulty >= 8 && value.info.difficulty <= 10){
                                difBarsPainted = 3;
                            }
                            else{
                                difBarsPainted = 0;
                            }
    
                            //ROLES
    
                            if (value.tags.length > 1) {
                                for (let index = 1; index < value.tags.length; index++) {
                                    stringRoles += "<br>" + value.tags[index];
                                }
                            }
    
                            $('#champs').append(
                                `<div class="champs-card" id="c-${value.id}">
                    <div class="champs-name__out">
                      <div class="champs-name d-flex align-items-center">${value.name}</div>
                    </div>
                    <div class="champs-info--hover d-flex flex-column justify-content-evenly">
                      <div class="champs-name--hover">${value.name}</div>
                      <div class="champs-info--1 d-flex justify-content-evenly align-items-center">
                        
                        <div class="role d-flex flex-column align-items-center">
                          <img class="role-img" src="assets/img/${stringRoleImg}">
                          <p class="role-title text-center">Rol</p>
                          <p class="role-content text-center">${stringRoles}</p>
                        </div>
                        
                        <div class="dificulty d-flex h-75 flex-column justify-content-end align-items-center">
                          <p class="m-0">Dificultad</p>
                          <div class="dif-bar--container d-flex align-items-center justify-content-evenly m-0">
                            <div class="dif-bar bar-1"> </div>
                            <div class="dif-bar bar-2"> </div>
                            <div class="dif-bar bar-3"> </div>
                          </div>
                        </div>
                      </div>
                      <div class="champs-info--2 w-100">
                        <div class="stat-container">
                          <i class="fi fi-ss-shield"></i>
                          <div class="stat-bar">
                            <div class="def-bar"></div>
                          </div>
                        </div>
          
                        <div class="stat-container">
                          <i class="fi fi-ss-sword"></i>
                          <div class="stat-bar">
                            <div class="atk-bar"></div>
                          </div>
                        </div>
          
                        <div class="stat-container">
                          <i class="fi fi-ss-magic-wand"></i>
                          <div class="stat-bar">
                            <div class="mag-bar"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>`);
    
                            $('#c-' + value.id).css('background-image', 'url(' + champsImg + ')');
    
                            $('#c-' + value.id + ' .def-bar').css('width', value.info.defense + '0%');
    
                            $('#c-' + value.id + ' .atk-bar').css('width', value.info.attack + '0%');
    
                            $('#c-' + value.id + ' .mag-bar').css('width', value.info.magic + '0%');
                            
                            if(difBarsPainted != 0){
                                for (let index = 1; index <= difBarsPainted; index++) {
                                    $('#c-' + value.id + ' .bar-'+index).css('background-color', '#07D6F6');
                                    
                                }
                            }
    
                        });
    
    
                        //FETCH DE LA ROTACION
    
                        fetch('https://la1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=' + apiKey, {
    
                            })
                            .then(response => {
                                return response.json();
                            })
    
                            .then(data => {
                                normalRot = data.freeChampionIds;
                                newRot = data.freeChampionIdsForNewPlayers;
    
                                fillRotation(normalRot);
    
    
                                console.log('Success:', data);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                    })
    
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            })
    
            .catch((error) => {
                console.error('Error:', error);
            });
    });



});

// FUNCIONES

function fillRotation(rot) {
    for (champId of rot) {
        Object.entries(champions).forEach(([key, value]) => {
            if (value.key == champId) {
                $('#rotation').append(
                    `<div class="champ-rotation">

                    <div class="img-rotation">
                        <img src="http://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${value.id}.png">
                    </div>
                    <p>${value.name}</p>
          
                  </div>`
                );
            }
        });
    }
}