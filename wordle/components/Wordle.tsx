import React, { useEffect, useMemo, useState } from 'react'
import styles from './Wordle.module.css'

type WordleType = {
  wordle:string
}

const Wordle = ({wordle}:WordleType) => {

    const [guess,setGuess] = useState<Array<string>>([])
    const [guessAll, setGuessAll] = useState<Array<Array<string>>>([])

    if(wordle.length !== 5){
      throw new Error("The word must be five letters long.")
    }

    const charMap = useMemo(() => {
      return wordle.split('').reduce<Record<string,number>>((acc,char)=>{
        if(!acc.hasOwnProperty(char)){
          acc[char] = 1;
        }else{
          acc[char] += 1;
        }
        return acc
      },{})
    },[wordle])

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
    console.log("guessAll: ", guessAll)

    const isCorrect = guessAll.length > 0 && guessAll[guessAll.length -1].join('') === wordle
    const isFailure = !isCorrect && guessAll.length === 6
  return (
    <div>
      <PreviousGuess guessAll={guessAll} wordle={wordle} charMap={charMap}/>
      {!isCorrect && !isFailure && <CurrentGuess guess = {guess}/>}
      {
        Array.from({length: 6 - guessAll.length - (isCorrect ? 0 : 1)}).map((_,i) => {
          return <NullGuess key={i}/>
        })
      }
    </div>
  )
}

type previousGuessSub = {
  all:Array<string>
  wordle: string
  charMap: Record<string,number>
}

const PreviousGuessSub = ({all,wordle,charMap}:previousGuessSub) => {
  const cMap = {...charMap}
  return (
    <div className={styles.cellContainer}>
        {
          all.map((a,i) => {
            const wordleLetter = wordle[i]
            let greenCtrl = wordleLetter === a
            let isPr = false;
            if(!greenCtrl && cMap[a]){
              isPr = true
              cMap[a] -= 1
            }
            return <div className={`${styles.cell} ${greenCtrl ? styles.green : ''} ${isPr ? styles.yellow : ''}`}  key={i}>{a}</div>
          })
        }
    </div>
  )
}

type previousGuess = {
  guessAll:Array<Array<string>>
  wordle: string
  charMap:Record<string,number>
}

const PreviousGuess = ({guessAll,wordle,charMap}:previousGuess) => {
  return (
    <>
        {
          guessAll.map((all,i) => {
              return <div key={i}>
                <PreviousGuessSub all = {all} wordle = {wordle} charMap={charMap}/>
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
