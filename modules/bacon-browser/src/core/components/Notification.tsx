import { toaster, ToasterContainer } from 'baseui/toast'
import React, { createContext, useContext } from 'react'

const NotificationContext = createContext(toaster)
export const useNotification = () => useContext(NotificationContext)
export const NotificationProvider: React.FC = ({ children }) => {
  return (
    <NotificationContext.Provider value={toaster}>
      <ToasterContainer
        autoHideDuration={5000}
        overrides={{
          Root: {
            style: {
              textAlign: 'left',
              minHeight: '95vh',
              justifyContent: 'flex-start',
              flexDirection: 'column-reverse',
            }
          },
        }}
      />
      {children}
    </NotificationContext.Provider>
  )
}
