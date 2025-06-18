import { useState, useEffect } from 'react';
import styles from  './components.module.css'



export function Question({ correctItem, optionsByField, selectedAnswers, onSelect }) {
  return (
    <div style={{ maxWidth: 400, marginTop: '2rem', textAlign: 'center', border: '2px solid #ccc', borderRadius: '10px', padding: '1rem', background: '#222', color: '#eee', fontFamily: 'Arial' }}>
      <img
        src={`/images/${correctItem["Common name"].trim().toLowerCase().replace(/ /g, '_')}/000001.jpg`}
        alt={correctItem["Common name"]}
        style={{ width: '100%', height: 'auto', borderRadius: '10px', marginBottom: '1rem' }}
        onError={(e) => e.target.src = 'https://placecats.com//1080/2400'} />
      {Object.entries(optionsByField).map(([field, options], sectionIndex) => (
        <div key={sectionIndex}>
          <p style={{ paddingBottom: '0.5rem', paddingTop: '1.5rem' }}><strong>{String(field).toUpperCase()}</strong></p>
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
