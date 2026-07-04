import { AppProvider } from '@context/AppContext'
import AppRouter from '@routes/index'
import './App.css'

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}

export default App
