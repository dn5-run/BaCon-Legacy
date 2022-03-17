import { createContext, useContext } from 'react'

import { ClientW } from './clientw'

export const client = new ClientW(window.location.host)
export const BaConContext = createContext(client)

export const BaConProvider: React.FC = ({ children }) => {
  return <BaConContext.Provider value={client}>{children}</BaConContext.Provider>
}

export const useBaCon = () => {
  return useContext(BaConContext)
}
