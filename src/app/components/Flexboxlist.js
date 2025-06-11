import styles from './Flexboxlist.module.css'
import { useState } from 'react';


export default function Flexboxlist({ items, className = '', itemclassName = '', onItemClick, selectedIndex }) {
  return (
    <ul className={`${styles.list} ${className}`}>
      {items.map((item, index) => (
        <li
        key={item.id || index}
        className={`${styles.item} ${itemclassName} ${selectedIndex === index ? styles.selected : ''}`}
        onClick={() => onItemClick(item, index)}
        >
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          </li>
      ))}
    </ul>
  );
}