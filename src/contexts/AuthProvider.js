import React, { useContext, useEffect, useState, useCallback } from 'react'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [username, setUsername] = useState('')
    const [pokemons, setPokemons] = useState([])

    const generatePockemonName = () => {
        if (pokemons && pokemons.length > 0) {
            const pokemon = pokemons[Math.floor(Math.random() * pokemons.length)]
            setUsername(pokemon.name)
        }
    }


    useEffect(() => {
        const fetchPockemons = async () => {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1300",
                {
                    method: "GET"
                })
            const data = await response.json();
            console.log(data)
            setPokemons(data.results)
        }

        fetchPockemons().catch(error => {
            console.log(error)
        })

        return () => { }
    }, [])

    useEffect(() => {
        const initializeUsername = () => {
            const storedUsername = window.localStorage.getItem('username')

            if (storedUsername == null) {
                generatePockemonName()
            }
            else {
                setUsername(storedUsername)
            }
        }
        initializeUsername()
    }, [pokemons])


    return (
        <AuthContext.Provider value={{ username, setUsername, generatePockemonName }}>
            {username !== '' ?
                children
                :
                <h3>Loading auth...<button onClick={generatePockemonName}>Generate</button></h3>
            }
        </AuthContext.Provider>
    )
}
