var app = angular.module('weatherApp', ['ngCordova']);

app.controller('aboutCtrl',function($scope){
$scope.blueweather = {
    "font-style":"bold"
                     };
$scope.About = function (){
Navigate('aboutview','mainpage');    
};    
});
// $location.path("home");
app.controller('geoLocationCtrl', function ($scope, $http,$window) {
 
    $scope.locationStyle = {
       "display":"display",
       "color":"#f5f5f5"
   };
   //Is this user online?
   $scope.positional = {
       "bottom":"3px"
   };
  //  $scope.checkConnection = function (){
    $scope.brandLogo = {
        "opacity":"0.95",
        "bottom":"5px",
        "position":"fixed",
        "margin-left": "5px",
        "margin-right": "5px"
     }; 
     $scope.appBack = {
        "color" : "white",
        "background-color" : "#212121",
        "font-size" : "20px",
        "text-align": "center"
    };
    
  
});

document.addEventListener("deviceready", function () {
 checkConnection();
}, false);

function StoreTemp(key,value){
sessionStorage.setItem(key,value);
}

function Navigate(newPage,oldPage){
$('#'+newPage).css("display","block");
$('#'+oldPage).css("display","none");
StoreTemp("currentPage",newPage);
myApp.closePanel();      
}

//Dialogs
function Dialog(message,title){
    myApp.alert(message, title, function () {
        myApp.closePanel();
    });
}

var CallWeatherSuccess = function(data,status){
  //  alert("success");
//Dialog(data,"rawData");
   // alert(data);
/*{"coord":{"lon":-80.52,"lat":43.47},
"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],
"base":"stations",
"main":{"temp":288.15,"pressure":1023,"humidity":93,"temp_min":288.15,"temp_max":288.15},
"visibility":14484,"wind":{"speed":3.1,"deg":180},
"clouds":{"all":90},
"dt":1507904700,
"sys":{"type":1,"id":3730,"message":0.0153,"country":"CA","sunrise":1507894484,"sunset":1507934443},
"id":617623,
"name":"Waterloo",
"cod":200}  */  
 //   console.log(data);
//var jsonData =  JSON.stringify(data);
//alert(jsonData);
var obj = angular.fromJson(data);
var location = obj.name;

var dateC = new Date();
var mdate =  dateC.toString(" dd  MMMM yyyy");
mdate = "TODAY, "+mdate;
var myDate = "<div style='text-transform: uppercase;'>"+mdate+"</div>";
 pushToView(myDate);  
//var climateDate = dated;    
var weamsg = obj.weather[0];
var objki = angular.fromJson(weamsg); 
var desc = objki.description;
//var climateDescription = desc;
var iconic = objki.icon;
iconic = iconic+".png";
var image = "http://openweathermap.org/img/w/"+iconic;

var imageR = "<img src='"+image+"' width='200px' height='200px'>";
pushToView(imageR); 
  
pushToView(desc);    
var mn = obj.main;

var objk = angular.fromJson(mn); 

var minTemp = mn.temp_min;
minTemp = "min "+ minTemp+ "&deg C";
    pushToView(minTemp); 
    var minTempr = minTemp;
var maxTemp = mn.temp_max;
maxTemp = "max " +maxTemp+ "&deg C";
var maxTempt =  "<div style='font-size:45px;'>"+maxTemp+"</div>";
  pushToView(maxTempt); 
ShowElement('myLocation');
};

//Make the content on the screen
var pushToView = function(content){
$('#results').append(content + "<br>");      
};

var CallWeatherFail = function(data,status){
 var openMapResponse = JSON.stringify(data);
var obj = angular.fromJson(openMapResponse);    
    
var msg = obj.responseText;
obj = angular.fromJson(msg); 
var theMsg = obj.message;
Dialog(theMsg,"Weather Service Error");
};
var mylat = "";
var mylng = "";

var CallWeatherService = function (){
   //api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon} 
 //   alert("openweather");
  var apiKey = "52f2ee9963e6396b5cac228a7a14a699";
    var theID = "524901";
var url = "http://api.openweathermap.org/data/2.5/weather";
$.ajax({
//headers:{"content-Type" : "application/json"},
type: 'GET',
url: url,
data: {lat:mylat,lon:mylng,id:theID,APPID:apiKey,units:"metric" },
success: CallWeatherSuccess,
error : CallWeatherFail,
cache:false,
async:true,
dataType: 'html'
}); 
};

function checkConnection(){

 var networkState = navigator.connection.type;
  var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
   var contype =  states[networkState];
   // console.log("connection is "+contype);
    if(contype==='No network connection'){
       navigator.notification.alert("Please check your connection.","","You are offline");
    }
    else{
  //check GPS here
     
    GetLocation();
    }
}
//document.addEventListener("app.Ready", onAppReady, false) ;
//Geolocation for devices
function GetLocation(){
navigator.geolocation.getCurrentPosition(onSuccess, onLocError);
}

//local storage 
function LocalSave(key,value){
localStorage.setItem(key,value);    
}
//retrieve local storage value from the key
function getLocalSave(key){
var theKey = localStorage.getItem(key);
return theKey;
}

function onSuccess(position) {
mylat = position.coords.latitude;
mylng = position.coords.longitude;
var msa = mylat+","+mylng;
//LocalSave("coords",msa);
GetAddressz(msa);
}

 function onLocError(error) {
cordova.plugins.diagnostic.switchToLocationSettings();
Dialog("Please enable your location settings","Oops!");
}

function GetAddresszS(data,status){
//alert("resp is "+data);
if(data !==""){
if (window.DOMParser){
    parser=new DOMParser();
    xmlDoc=parser.parseFromString(data,"text/xml");
}
else{
    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async=false;
    xmlDoc.loadXML(data);
  }
var maxml = xmlDoc.getElementsByTagName("long_name")[2].childNodes[0].nodeValue;
var maxmli = xmlDoc.getElementsByTagName("long_name")[4].childNodes[0].nodeValue;
var nation = xmlDoc.getElementsByTagName("formatted_address")[5].childNodes[0].nodeValue; 

var whereAmI = "<img src='img/location.png' width='20px' height='20px'><div style='color:#f5f5f5;'> "  +maxml +"," +nation +"</div>";
$('#myLocation').html(whereAmI);    
StoreTemp("myare",maxml);
StoreTemp("mycit",maxmli);
    //call the openweathermap api here
 CallWeatherService();
}
}
function GetAddresszF(data,status){
Dialog("Please check your network","Network Error");
$('#loader').css("display","none");
}
 function GetAddressz(msa){
var key = "AIzaSyBVBGTNqrYts689RCC2L72Xwj7HhgxgUP8";
var funnel = "http://mobilepushserver.com";
$.ajax({
type: 'GET',
url: funnel+'/services/maps.php',
data: {key:key,latlng:msa},
success: GetAddresszS,
error : GetAddresszF,
cache:false,
async:true,
dataType: 'html'
}); 
		
}

function StoreTemp(myKey,myValue){
sessionStorage.setItem(myKey,myValue);
}

//Display a hidden html element by passing its id here
function ShowElement(id){
$('#'+id).css("display","block");
}