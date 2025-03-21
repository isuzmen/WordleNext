import React, { useEffect, useState } from 'react'
import styles from './Wordle.module.css'

const Wordle = () => {

    const [guess,setGuess] = useState<Array<string>>([])
    const [guessAll, setGuessAll] = useState<Array<Array<string>>>([])

    useEffect(() => {
        const handleKeyFunc = (e:KeyboardEvent) => {
            const letterCtrl = /^[a-z]$/.test(e.key);
            const backspace = e.key === "Backspace";
            const enter = e.key === "Enter";

            if(backspace){
                setGuess(guess.filter(gss => gss !== guess[guess.length -1] ))
            }else if(letterCtrl && guess.length < 5){
                setGuess(prev => [...prev,e.key])
            }else if(enter && guess.length === 5){
                setGuessAll(prev => [...prev,guess])
                setGuess([])
            }
            
        }
        window.addEventListener("keydown",handleKeyFunc)

        return () => {
            window.removeEventListener('keydown',handleKeyFunc)
        }
    },[guess])
    console.log(guess)
    console.log("guessAll: ", guessAll)
  return (
    <div className={styles.cellContainer}>
      {
        Array.from({length:5}).map((_,i) => {
            return <div className={styles.cell} key={i}>{guess[i]}</div>
        })
      }
    </div>
  )
}

export default Wordle
