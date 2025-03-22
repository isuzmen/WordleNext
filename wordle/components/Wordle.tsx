import React, { useEffect, useMemo, useState } from 'react'
import styles from './Wordle.module.css'

type WordleType = {
  wordle:string
}

const Wordle = ({wordle}:WordleType) => {

    const [guess,setGuess] = useState<Array<string>>([])
    const [guessAll, setGuessAll] = useState<Array<Array<string>>>([])
    const keyboard = [
      ["e","r","t","y","u","ı","o","p","ğ","ü"],
      ["a","s","d","f","g","h","j","k","l","ş","i"],
      ["en","z","c","v","b","n","m","ö","ç","bs"]
    ]

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

            keyboard.forEach((row, i) => {
              row.forEach((col, j) => {
                if (col === e.key || (backspace && col === "bs") || (enter && col === "en")) {
                  const keyElement = document.getElementById(`key-${i}-${j}`);
                  if (keyElement) {
                    keyElement.classList.add(styles["key-pressed"]);
                    setTimeout(() => {
                      if (keyElement) keyElement.classList.remove(styles["key-pressed"]);
                    }, 300);
                  }
                }
              });
            });

            if(backspace){
                setGuess(prev => prev.slice(0, -1));
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

    const addKeyboard = (i:number,j:number) => {
      const letterCtrl = /^[a-z]$/.test(keyboard[i][j]);
      const backspace = keyboard[i][j] === "bs";
      const enter = keyboard[i][j] === "en";

    const keyElement = document.getElementById(`key-${i}-${j}`);
      if (keyElement) {
      keyElement.classList.add(styles["key-pressed"]);
      setTimeout(() => keyElement.classList.remove(styles["key-pressed"]), 300);
    }

      if(backspace){
        setGuess(prev => prev.slice(0, -1));
      }else if(letterCtrl && guess.length < 5){
        setGuess(prev => [...prev,keyboard[i][j]])
      }else if(enter && guess.length === 5){
        setGuessAll(prev => [...prev,guess])
        setGuess([])
      }
    }

    const lastGuess = guessAll.at(-1)?.join('') ?? '';
    const isCorrect = lastGuess === wordle;
    const isFailure = !isCorrect && guessAll.length === 6
  return (
    <div className={styles.container}>
      <PreviousGuess guessAll={guessAll} wordle={wordle} charMap={charMap}/>
      {!isCorrect && !isFailure && <CurrentGuess guess = {guess}/>}
      {
        Array.from({length: 6 - guessAll.length - (isCorrect ? 0 : 1)}).map((_,i) => {
          return <NullGuess key={i}/>
        })
      }
      <div style={{marginTop:"45px"}}>
        {
          keyboard.map((row,i) => {
            return <div  className={styles.row} key={i}>
              {row.map((col,j) => {
                return <div
                  id={`key-${i}-${j}`}
                  onClick={() => addKeyboard(i, j)}
                  className={styles.col}
                  key={j}
                  >
                  {col}
                </div>
              })}
            </div>
          })
        }
      </div>
    </div>
  )
}

type previousGuessSub = {
  all:Array<string>
  wordle: string
  charMap: Record<string,number>
}

const PreviousGuessSub = ({all,wordle,charMap}:previousGuessSub) => {
  const [revealed, setRevealed] = useState(false);
  const [shake, setShake] = useState(false);
  const [bounce, setBounce] = useState(false);

  const cMap = {...charMap}

  useEffect(() => {
    setTimeout(() => {
      setRevealed(true);
    }, 300); 
  }, []);

  useEffect(() => {
    if (revealed) {
      if (all.join('') === wordle) {
        setBounce(true);
        setTimeout(() => setBounce(false), 500); 
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 300); 
      }
    }
  }, [revealed, all, wordle]);
  
  return (
    <div className={`${styles.cellContainer} ${shake ? styles.shake : ''} ${bounce ? styles.bounce : ''}`}>
        {
          all.map((a,i) => {
            const wordleLetter = wordle[i]
            let greenCtrl = wordleLetter === a
            let isPr = false;
            if(!greenCtrl && cMap[a]){
              isPr = true
              cMap[a] -= 1
            }
            return <div className={`${styles.cell} ${revealed ? (greenCtrl ? styles.green : isPr ? styles.yellow : '') : ''}`}  key={i}>{a}</div>
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
