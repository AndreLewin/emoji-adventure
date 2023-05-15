import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const FetchData: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// you have access to native browser APIs, so you can easily fetch (or send) data

const NUMBER_OF_POKEMONS = 1008 // wow
const randomPokemonId = _random(1, NUMBER_OF_POKEMONS)

const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + randomPokemonId)
const pokemon = await response.json()

const name = pokemon?.name ?? ""
const sprite = pokemon?.sprites?.front_default ?? ""

@:text = name
@:backgroundImage = sprite
^:backgroundImage = sprite
`
    updateCellWithAppend({
      gridId,
      cellIndex,
      cellUpdate: {
        [activeCScriptTab]: script
      }
    })
  }, [activeCScriptTab, updateCellWithAppend, gridId, cellIndex])

  return (
    <>
      <span className='container'>
        <Button color="gray" onClick={handleClick}>Fetch data</Button>
      </span>
      <style jsx>
        {`
          .container {
            
          }
        `}
      </style>
    </>
  )
}

export default FetchData