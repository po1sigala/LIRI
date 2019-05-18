//require the .env which contains my api keys and is hidden on github
require("dotenv").config();
var moment=require("moment");
//require inquirer to prompt the user for chich command they want
var inquirer= require("inquirer");

//import the api keys which are stored in anothe js file
var Spotify= require("node-spotify-api");
var keys = require("./keys.js");
var axios= require("axios");
//require fs to read and write files
var fs= require("fs");

//make new object from spotify consructor with api keys from our hidden file
var spotify= new Spotify(keys.spotify);

//set up inquirer to ask what command we want to run so our user doesnt have to type it exactly. aka no typos
inquirer.prompt([
    //first object asks which API the user wants to check
    {
    type:"list",
    name:"searchSelect",
    message:"what do you want to do?",
    choices:["concert-this","spotify-this-song","movie-this","do-what-it-says"]
    },
    //second object asks them to input the search
    //need to make it so that the next prompt doesnt occur if we select dowhatitsays
    
    {
        type: "input",
        name: "search",
        message: "What do you want to search?",
        //include a when that make sit so this prompt does not show when dowhatitsays is selecteed. we want thios becasue dowhat its says bases its search of a text so it would be redundant to ask again here
        when: function(answers){
            return answers.searchSelect != "do-what-it-says";
        }
      }
])
.then(function searchSites(user){
//set out command variable that decides what we wnat to do. mayve switch this to be based on the answer of a prompt?
var searchSelect=user.searchSelect;

var search= user.search;

    // take in arguments from command line for concerts spotify and movies and dowhat it says
decider(searchSelect,search);

})

function decider(searchSelect,search){
    //code for when our user wants to search a concert
    if(searchSelect==="concert-this"){
        //query url built off search input
        var queryUrl="https://rest.bandsintown.com/artists/" 
                    + search 
                    + "/events?app_id=codingbootcamp";
        //use axios to perform a get request on the queryurl.
        axios.get(queryUrl)
            .then(function(response){
                //console log the bits of the response we want
                console.log("Venue: "+ response.data[0].venue.name
                            +"\nLocation: "+response.data[0].venue.city+" "
                                         +response.data[0].venue.region+", "
                                         +response.data[0].venue.country

                                         //fix below to be MM/DD/YYYY
                            +"\nDate: "+moment(response.data[0].datetime).format())
                // console.log(response)
            
        })

    };
    if(searchSelect==="spotify-this-song"){
        // console.log("the search was "+search);
        spotify.search({
            //spoitfy module uses a search method which takes an obect and a function
            type: 'track', query: search }, function(err, data) {
                if (err) {
                  return ('Error occurred: ' + err);
                }
               console.log("Artist:"+data.tracks.items[0].artists[0].name
                            +"\nAlbum: "+ data.tracks.items[0].album.name
                            +"\nTrack Title: "+data.tracks.items[0].name
                            +"\nLink to Track: "+data.tracks.items[0].href);
            //   console.log(data.tracks.items[0]);
        })
        // console.log("spotify if statment came back true")
    };
    if(searchSelect==="movie-this"){
        //same style as concert search
        var queryUrl= "http://www.omdbapi.com/?t=" +
                        search +
                        "&y=&plot=short&apikey=trilogy";
        axios.get(queryUrl).then(
            function(response){
                console.log(response);
                console.log("Title: "+response.data.Title+
                            "\nYear: "+response.data.Year+
                            "\nIMDB Rating: "+response.data.imdbRating+
                            "\nRottenTomatoes Rating: "+
                            "\nFilmed in: "+ response.data.Country+
                            "\nLanuage: "+ response.data.Language+
                            "\nPlot: "+ response.data.Plot+
                            "\nCast: "+response.data.Actors)
            }
        )
    };
    //have a seperate function that reads a file and executes its command
    if(searchSelect==="do-what-it-says"){
        //read file
        fs.readFile("random.txt","utf8",function(err,data){
            //return error if any
            if(err){
                return(err);
            }
            //turn string into array. 
            data=data.split(",");
            // console.log("the data array is "+data);


            //set the first object in the array to the search select var
            searchSelect=data[0];
            // console.log("the var searchSelectis "+searchSelect)+"\nIt should be 'spotify-this-song'";


            // //set the second object to the search variable
            search=data[1];
            // console.log("the var search is "+search)+"it should be 'I Want it That Way'";
            
            // //pass these variables into this function again but now one of the other if statements will run true
            decider(searchSelect,search);
            
        })
    };
}











