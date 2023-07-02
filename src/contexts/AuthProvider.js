import React, { useContext, useEffect, useState } from 'react'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [username, setUsername] = useState({})


    useEffect(() => {
        const getRandomPockemonName = () => {
            const storedUsername = window.localStorage.getItem('username')

            if (storedUsername == null) {
                fetch("https://pokeapi.co/api/v2/pokemon/",
                {
                    method: "GET"
                })
                .then(response => response.json())
                .then(data => {
                    const pokemon = data.results[Math.floor(Math.random() * data.results.length)]
                    setUsername(pokemon.name)
                })
                .catch(error => {
                    console.log(error)
                    setUsername('default')
                })
            }
            else {
                setUsername(storedUsername)
            }
        }

        getRandomPockemonName()

        return () => { }
    }, [])

    return (
        <AuthContext.Provider value={{username, setUsername }}>
            {username !== '' ?
                children
                :
                <h3>Loading auth...</h3>
            }
        </AuthContext.Provider>
    )
}
