import axios from "axios";
import {useState} from "react";

function App(){

  const [image, setImage] = useState(null);

  
  // async function getPokeData(){
  //   const response = await axios.get("https://pokeapi.co/api/v2/pokemon/totodile") 
  //  return response
  // }

  async function handleClick(){
    const pokemon = await axios.get("https://pokeapi.co/api/v2/pokemon")
    const randNum = Math.random(0,pokemonData.length)
    setImage(pokemon["data"]["sprites"]["front_default"])
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
   <img src={image} alt={"pokemon"}/>
  </div>
  </>
    

  )
}

export default App