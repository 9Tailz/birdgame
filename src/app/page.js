'use client';

import styles from './page.module.css'
import Flexboxlist from './components/Flexboxlist';

import { useRouter } from 'next/navigation';
import { useState } from 'react';


const difficultyLevels = [
  {id: 1, title: 'Normal', description: 'Common Name',},
  {id: 2, title: 'Harder', description: 'Common Name & Total Food Cost'},
  {id: 3, title: 'Show Off', description: 'Common Name & Total Food Cost \n & Scientfic Name'},
]

export default function MainMenu() {
  const [selected, setSelected] = useState(null);
  const router = useRouter();
  const [ gamemode, setgamemode ] = useState(1)
  const [ urlstring, seturlstring ] = useState('')

  const handleItemClick = (item, index) => {
    setSelected(index);
    setgamemode({gamemode: item.id});
    console.log('GameMode:', item.title );
    console.log('gamemode Index:', item.id)
  } 

//Passing URL DATA

function startgame() {
  const urlString = new URLSearchParams(gamemode).toString();
  console.log('sending:', urlString)
  router.push(`/game?${urlString}`)
}


    return (
      <div className={styles.MainMenu}>
        <h1>U want sum fk??</h1>
        <Flexboxlist
          items={difficultyLevels}
          className={styles.flexlist}
          itemclassName={styles.flexitems}
          onItemClick={handleItemClick}
          selectedIndex={selected}
          />
        <div>
        <button onClick={startgame}>START</button>
        </div>
      </div>
);
};
