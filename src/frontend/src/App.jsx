import { useState } from 'react'
import './App.css'
import gameBackground from './assets/gameBackground.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
            <img src={gameBackground} alt=""/>
      </div>
    </>
  )
}

export default App
