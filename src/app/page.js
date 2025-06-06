"use client";

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const difficultyLevels = {
  1: ["Common name"],
  2: ["Common name", "Power text"],
  3: ["Common name", "Power text", "Scientific name"],
};

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function getRoundData(data, difficulty) {
  if (!data || data.length === 0) return null;

  const correctIndex = Math.floor(Math.random() * data.length);
  const correctItem = data[correctIndex];
  const otherItems = data.filter((_, i) => i !== correctIndex);

  const wrongOptions = shuffle(otherItems).slice(0, 2); // 3 options total (1 correct + 2 wrong)

  const options = shuffle([correctItem, ...wrongOptions]);
  const fieldsToShow = difficultyLevels[difficulty];

  return { correctItem, options, fieldsToShow };
}

function Question({ correctItem, options, fieldsToShow, onSelect }) {
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center', border: '2px solid #ccc', borderRadius: '10px', padding: '1rem', background: '#222', color: '#eee', fontFamily: 'Arial' }}>
      <img 
        src={`/images/${correctItem["Common name"].trim().toLowerCase().replace(/ /g, '_')}/000001.jpg`} 
        // src={`https://placecats.com/1080/2400`} 
        alt={correctItem["Common name"]} 
        style={{ width: '100%', height: 'auto', borderRadius: '10px', marginBottom: '1rem' }}
        onError={(e) => e.target.src = 'https://placecats.com//1080/2400'}
      />

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {options.map((option, idx) => (
          <li 
            key={idx} 
            onClick={() => onSelect(option)} 
            style={{ 
              cursor: 'pointer', 
              backgroundColor: '#444', 
              marginBottom: '0.5rem', 
              padding: '0.5rem', 
              borderRadius: '6px' 
            }}
          >
            {fieldsToShow.map(field => (
              <div key={field}>{option[field]}</div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState(null);
  const [difficulty, setDifficulty] = useState(1);
  const [roundData, setRoundData] = useState(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(null);

  // Load and parse the excel file on the client side (because public folder)
  useEffect(() => {
    async function loadExcel() {
      try {
        const res = await fetch('/wingspan_card_clist.xlsx');
        const arrayBuffer = await res.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Data validation: remove rows without required fields
        const filteredData = jsonData.filter(row => row["Common name"] && row["Power text"] && row["Flavor text"]);

        setData(filteredData);
      } catch (error) {
        console.error("Failed to load excel file:", error);
      }
    }
    loadExcel();
  }, []);

  useEffect(() => {
    if (data) {
      const round = getRoundData(data, difficulty);
      setRoundData(round);
      setMessage(null);
    }
  }, [data, difficulty]);

  function handleSelect(option) {
    if (option["Common name"] === roundData.correctItem["Common name"]) {
      setScore(score + 1);
      setMessage("Correct! 🎉");
    } else {
      setMessage(`Wrong! The correct answer was ${roundData.correctItem["Common name"]}.`);
    }
    // Start next round after short delay
    setTimeout(() => {
      setRoundData(getRoundData(data, difficulty));
      setMessage(null);
    }, 1500);
  }

  if (!roundData) return <div style={{textAlign: 'center', marginTop: '2rem'}}>Loading data...</div>;

  return (
    <main style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#eee', padding: '1rem' }}>
      <h1 style={{textAlign: 'center'}}>Bird Quiz Game</h1>

      <div style={{ maxWidth: 400, margin: '0 auto 1rem' }}>
        <label>
          Difficulty:&nbsp;
          <select
            value={difficulty}
            onChange={e => setDifficulty(Number(e.target.value))}
            style={{ fontSize: '1rem' }}
          >
            <option value={1}>Level 1 (Name)</option>
            <option value={2}>Level 2 (Name + Power)</option>
            <option value={3}>Level 3 (Name + Power + Scientific name)</option>
          </select>
        </label>
      </div>

      <Question {...roundData} onSelect={handleSelect} />

      <div style={{ textAlign: 'center', fontSize: '1.25rem' }}>
        {message && <p>{message}</p>}
        <p>Score: {score}</p>
      </div>
    </main>
  );
}