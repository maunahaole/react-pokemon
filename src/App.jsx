import axios from "axios";
import {useState} from "react";

function App(){

  const [image, setImage] = useState("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png");


  async function handleClick(){
    const randNum = Math.floor(Math.random() * 1000)
    console.log("randomNum = ", randNum)
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randNum}`)
      .then(response => {
        console.log("response = ", response)
        const pokemonObj = response["data"]
        console.log("pokemon List=", pokemonObj)
        const firstPokeImageName = Object.keys(pokemonObj["sprites"])[4]
        console.log(firstPokeImageName)
        setImage(pokemonObj["sprites"][firstPokeImageName])
        
      })
      .catch(error => {
        console.log("Error:", error)
      })  
  } 

  // WHAT WE WERE DOING WRONG

// async function BADFUNCTION(){
//   // we send the GET request
//   const response = await axios.get("https://our.pokemon/url")
//   // This console.log is SYNCHRONOUS while our response is ASYNCHRONOUS so this console.log will NEVER EVER return our response. This is wrong
//   console.log(response)
// }

// async function GOODFUNCTION(){
//   // we send the GET request
//   const response = await axios.get("https://our.pokemon/url")
//   // using the .then method WAITS for the GET request to complete before running, allowing us to actually have a value to mess with
//    .then(response => {
//       // this will return our response from the GET request
//       console.log(response)
//    })
//}








  return(
  <>
    <h1>
      "hello pokemon"
    </h1>
  <div>
    <button onClick={handleClick}>create Pokemon</button>
  </div>
  <div>
   <img src={image} alt={"pokemon"} width="500" height="600"/>
  </div>
  </>
    

  )
}

export default App