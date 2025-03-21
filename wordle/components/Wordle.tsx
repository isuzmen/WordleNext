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
    <div>
      <PreviousGuess guessAll={guessAll}/>
      <CurrentGuess guess = {guess}/>
      {
        Array.from({length:6 - guessAll.length - 1}).map((_,i) => {
          return <NullGuess key={i}/>
        })
      }
    </div>
  )
}

type previousGuessSub = {
  all:Array<string>
}

const PreviousGuessSub = ({all}:previousGuessSub) => {
  return (
    <div className={styles.cellContainer}>
        {
          all.map((a,i) => {
              return <div className={styles.cell} key={i}>{a}</div>
          })
        }
    </div>
  )
}

type previousGuess = {
  guessAll:Array<Array<string>>
}

const PreviousGuess = ({guessAll}:previousGuess) => {
  return (
    <>
        {
          guessAll.map((all,i) => {
              return <div key={i}>
                <PreviousGuessSub all = {all}/>
              </div>
          })
        }
    </>
  )
}

type currentGuess = {
  guess:Array<string>
}

const CurrentGuess = ({guess}:currentGuess) => {
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

const NullGuess = () => {
  return (
    <div className={styles.cellContainer}>
        {
          Array.from({length:5}).map((_,i) => {
              return <div className={styles.cell} key={i}></div>
          })
        }
    </div>
  )
}

export default Wordle
