import React, { createContext } from 'react'
const ContextCalls = createContext({ children })


export const ContextNav = () => {
    return (
        <ContextCalls.Provider >
            {children}
        </ContextCalls.Provider>
    )
}
