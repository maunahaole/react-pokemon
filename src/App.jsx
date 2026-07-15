import axios from "axios";
import {useState} from "react";

function App(){

  const [image, setImage] = useState(null);

  const imageStyle = {

  }

  
  //  async function fetchPokemon(){
  //   const response = await axios.get("https://pokeapi.co/api/v2/pokemon") 
  //   return response
  //  }

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