"use client";

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const difficultyLevels = {
  1: ["Common name"],
  2: ["Common name", "Wingspan"],
  3: ["Common name", "Wingspan", "Scientific name"],
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

function Question({ correctItem, optionsByField, selectedAnswers, onSelect }) {
  return (
    <div style={{maxWidth: 400, margin: '2rem auto', textAlign: 'center', border: '2px solid #ccc', borderRadius: '10px', padding: '1rem', background: '#222', color: '#eee', fontFamily: 'Arial' }}>
      <img 
        src={`/images/${correctItem["Common name"].trim().toLowerCase().replace(/ /g, '_')}/000001.jpg`} 
        alt={correctItem["Common name"]} 
        style={{ width: '100%', height: 'auto', borderRadius: '10px', marginBottom: '1rem' }}
        onError={(e) => e.target.src = 'https://placecats.com//1080/2400'}
      />
      {Object.entries(optionsByField).map(([field, options], sectionIndex) => (
        <div key={sectionIndex}>
          <p style={{paddingBottom: '0.5rem', paddingTop: '1.5rem'}}><strong>{String(field).toUpperCase()}</strong></p>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {options.map((value, idx) => {
              const isSelected = selectedAnswers[field] === value;
              return (
              <li 
                key={idx} 
                onClick={() => onSelect(field, value)} 
                style={{ 
                  cursor: 'pointer', 
                  backgroundColor: isSelected ? '#905f38' : '#444', 
                  marginBottom: '0.5rem', 
                  padding: '0.5rem', 
                  borderRadius: '6px',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem'
                  // color: isSelected ? '#fff' : '#eee', 
                }}
              >
                {value}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState(null);
  const [shuffledData, setShuffledData] = useState(null);
  const [difficulty, setDifficulty] = useState(1);
  const [correctItem, setCorrectItem] = useState(null);
  const [optionsByField, setOptionsByField] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadExcel() {
      try {
        const res = await fetch('/wingspan_card_clist.xlsx');
        const arrayBuffer = await res.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const filtered = jsonData.filter(row => row["Common name"] && row["Wingspan"] && row["Scientific name"]);
        setData(filtered);
        setShuffledData(shuffle(filtered)); // Shuffle once
      } catch (error) {
        console.error("Failed to load Excel file:", error);
      }
    }
    loadExcel();
  }, []);

  useEffect(() => {
    if (shuffledData) startNewRound();
  }, [shuffledData, difficulty]);

  function startNewRound() {
    const newItem = getNewCorrectItem(shuffledData);
    setCorrectItem(newItem);
    setSelectedAnswers({});
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
      setTimeout(() => {
        startNewRound();
      }, 1500);
    } else {
      setMessage("Correct! 🎉");
      setScore(prev => prev + 1);
      setTimeout(() => {
        startNewRound();
      }, 1000);
    }
  }
}

  if (!correctItem || !optionsByField) return <div style={{textAlign: 'center', marginTop: '2rem'}}>Loading game...</div>;

  const width = window.innerWidth

  return (
    <main style={{ display:'block',backgroundColor: '#121212', minHeight: '100vh', color: '#eee', padding: '1rem', justifyContent: 'center' }}>
      <div className='ANEWDIV' style={{display: 'flex', flexDirection:  'column',  justifyContent: 'center', maxWidth:'500px'  }}>
          <div>
            <h1 style={{ textAlign: 'center' }}>BIRD BIRD !?</h1>
          </div>
            <div style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxWidth: '100%', paddingBottom: '1rem' }}>
            <label style={{paddingBottom: '0.5rem'}}>
              Difficulty:&nbsp;
            </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(Number(e.target.value))}
                style={{ fontSize: '1rem', padding: '0.2rem', borderRadius: '0.2rem', maxWidth:'80%'}}
              >
                <option value={1}>Level 1 (Common Name)</option>
                <option value={2}>Level 2 (Common Name + Wingspan)</option>
                <option value={3}>Level 3 (Common Name + Wingspan + Scientific Name)</option>
              </select>
          </div>
          <div style={{ textAlign: 'left', fontSize: '1.25rem' }}>
            {message && <p>{message}</p>}
            <p><b>Score: {score}</b></p>
          </div>
          <Question correctItem={correctItem} optionsByField={optionsByField} selectedAnswers={selectedAnswers} onSelect={handleSelect} />
      </div>
    </main>
  );
}
