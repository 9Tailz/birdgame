"use client";

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import styles from './page.module.css'
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Question } from '../components/comp_questioncard';

const difficultyLevels = {
  1: ["Common name"],
  2: ["Common name", "Victory points"],
  3: ["Common name", "Victory points", "Scientific name"],
};

function shuffle(array) {
  return array.slice().sort(() => 0.5 - Math.random());
}

function getNewCorrectItem(data) {
  const correctIndex = Math.floor(Math.random() * data.length);
  return data[correctIndex];
}

function getOptions(data, field, correctValue) {
  const uniqueValues = [...new Set(data.map(item => item[field]))];
  const wrongOptions = shuffle(uniqueValues.filter(val => val !== correctValue)).slice(0, 2);
  return shuffle([correctValue, ...wrongOptions]);
}



function LineTimer({size, strokeWidth=10, timeleft, totaltime}) {

    // console.log('props:', { size, strokeWidth, timeleft, totaltime });
    const progress = (timeleft / totaltime) * size;

    return(
      <svg width={size*2} height={size/2}>
        <line
        x1= {size - size}
        y1= {size /2}
        x2= {size * 2}
        y2= {size/2}
        strokeWidth={strokeWidth}
        stroke="#555"
        strokeLinecap="round"
        />
        <line
        x1= {size}
        y1= {size/2}
        x2= {size * 2}
        y2= {size/2}
        strokeWidth={strokeWidth}
        stroke="orange"
        strokeDasharray={size}
        strokeDashoffset={size - progress}
        style={{ transition: 'stroke-dashoffset 1s linear' }}
        strokeLinecap="round"
        />
        <line
        x2= {size - size}
        y2= {size/2}
        x1= {size}
        y1= {size/2}
        strokeWidth={strokeWidth}
        stroke="orange"
        strokeDasharray={size}
        strokeDashoffset={size - progress}
        style={{ transition: 'stroke-dashoffset 1s linear' }}
        strokeLinecap="round"
        />
        <text x='50%'y='70%' fill="#fff">{timeleft}s</text>
    </svg>
    )
}



  function getImageName (min=1, max=5) {
    // console.log('Function called')
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }




// ----------------------------- MAIN --------------------------------------------------

export default function Home() {
  const [data, setData] = useState(null);
  const [shuffledData, setShuffledData] = useState(null);
  const [difficulty, setDifficulty ] = useState(1)
  const [correctItem, setCorrectItem] = useState(null);
  const [correctItem2, setCorrectItem2] = useState(null);
  const [optionsByField, setOptionsByField] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(null);
  const [imageindex,setImageIndex] = useState(1)


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDifficulty(params.get('gamemode') || '1');
    console.log(`Gamemode: ${difficulty}`)
  }, []);


// Load Data From Excel

  useEffect(() => {
    async function loadExcel() {
      try {
        const res = await fetch('/wingspan_card_clist.xlsx');
        const arrayBuffer = await res.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        const filtered = jsonData.filter(row => row["Common name"] && row["Victory points"] && row["Scientific name"]);
        setData(filtered);
        setShuffledData(shuffle(filtered)); // Shuffle once
      } catch (error) {
        console.error("Failed to load Excel file:", error);
      }
    }
    loadExcel();
  }, []);



// Timer --->

  const RoundTime = 15;
  const svgsize = 200;
  const [timeLeft, setTimeLeft] = useState(RoundTime);
  const [timervisable, settimervisable] = useState(true)

  useEffect(() => {
    if (timervisable) {
          if (!correctItem) return;
      
          setTimeLeft(RoundTime);
      
          const timerId = setInterval(() => {
            setTimeLeft((prev) => {
              if (prev <= 1) {
                clearInterval(timerId);
                handleTimeout();
                return 0;
              }
              return prev - 1;
          });
          }, 1000);
      
          return () => clearInterval(timerId);
    }
    }, [correctItem,timervisable]);


  function handleTimeout() {
    setMessage(`Time's up! The correct answers were:\n${difficultyLevels[difficulty].map(f => `${f}: ${correctItem[f]}`).join('\n')}`);
    setScore(0);
    setTimeout(() => startNewRound(), 3000);
  }

  // <--- Timer

  // Round Managmentr --->

  useEffect(() => {
    if (shuffledData) 
      startNewRound();
  }, [shuffledData, difficulty]);

  function startNewRound() {
    const newItem = getNewCorrectItem(shuffledData);
    const newItem2 = getNewCorrectItem(shuffledData);
    setCorrectItem(newItem);
    setCorrectItem2(newItem2);
    setSelectedAnswers({});
    setImageIndex(getImageName)
    console.log(imageindex)
    const fields = difficultyLevels[difficulty];
    const fieldOptions = {};
    fields.forEach(field => {
      fieldOptions[field] = getOptions(shuffledData, field, newItem[field]);
    });
    setOptionsByField(fieldOptions);
    setMessage(null);
  }

  function handleSelect(field, selectedValue) {
    const newSelections = { ...selectedAnswers, [field]: selectedValue };
    setSelectedAnswers(newSelections);

    const allFields = difficultyLevels[difficulty];
    const allAnswered = allFields.every(f => newSelections[f]);

    if (allAnswered) {
      const anyWrong = allFields.some(f => newSelections[f] !== correctItem[f]);

      if (anyWrong) {
        setMessage(`Wrong! Starting over. The correct answers were:\n${allFields.map(f => `${f}: ${correctItem[f]}`).join('\n')}`);
        setScore(0);
        setTimeout(() => {startNewRound();}, 1500);
      } else {
        setMessage("Correct! 🎉");
        setScore(prev => prev + 1);
        setTimeout(() => {startNewRound();}, 1000);
      }
    }
  }

  if (!correctItem || !optionsByField) return <div style={{textAlign: 'center', marginTop: '2rem'}}>Loading game...</div>;


  // <---  Round Managment

  const width = window.innerWidth

  return (
    <main style={{ display:'grid',alignItems:'start',backgroundColor: '#121212', minHeight: '100vh', color: '#eee', padding: '1rem', justifyContent: 'center' }}>
      <div className={styles.ANEWDIV}>
          <div>
            <h1 style={{ textAlign: 'center'}}>BIRD BIRD !?</h1>
            <h2>The origonal wing-bird quiz game</h2>
          </div>
          <div><button onClick={ () => settimervisable(!timervisable)}>Show/Hide  Timer</button></div>
          {/* <div><button onClick={ () => console.log(difficulty)}>Print URL Prams</button></div> */}
          <div className={styles.message}>
            {message && <p>{message}</p>}
          </div>
          <div className={styles.roundinfo}>
            <div>
              <p><b>Score: {score}</b></p>
            </div>
            <div>
              {timervisable  && (
                <LineTimer
                timeleft={timeLeft}
                totaltime={RoundTime}
                size={svgsize}
                />
              )}
            </div>
          </div>
          <Question
          correctItem={correctItem}
          correctItem2={correctItem2}
          optionsByField={optionsByField}
          selectedAnswers={selectedAnswers}
          onSelect={handleSelect}
          imgindex={imageindex}/>
      </div>
    </main>
  );
}