import './App.css'
import './index.css'
import io from 'socket.io-client'
import { Eyes } from './components/Eyes'
import { useState } from 'react'

const socket = io('http://localhost:3001/')

function App() {
  const [hidden, setHidden] = useState<boolean>(false)
  const mandarInformacion = (): void | boolean=> {
    socket.emit('dato', hidden ? false : true)
    setHidden(!hidden)
  }
  return (
    <>
      <Eyes hidden={hidden} mandarInformacion={mandarInformacion} />
      <header>
        <ul>
          <a>Inicio</a>
          <a>Taquilla</a>
          <a>Acientos</a>
        </ul>
      </header>
      <h1 className="title">Inicio</h1>
    </>
  )
}

export default App
