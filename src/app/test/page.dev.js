// 'use client';

// import { useEffect, useRef, useState } from "react";

// function LineTimer({size, strokeWidth=8, timeleft, totaltime}) {

//     const progress = (timeleft / totaltime) * size;

//     return(
//         <svg width={size*2} height={size}>
//         /* Background Line STATIC */
//         <line
//         x1= {size - size}
//         y1= {size / 2}
//         x2= {size * 2}
//         y2= {size / 2}
//         strokeWidth={strokeWidth}
//         stroke="#555"
//         strokeLinecap="round"
//         />
//         /* Forground Line Aninimated */
//         <line
//         x1= '50%'
//         y1= {size / 2}
//         x2= '100%'
//         y2= {size / 2}
//         strokeWidth={strokeWidth}
//         stroke="orange"
//         strokeDasharray={size}
//         strokeDashoffset={size - progress }
//         style={{ transition: 'stroke-dashoffset 1s linear' }}
//         strokeLinecap="round"
//         />
//         <line
//         x2= {size - size}
//         y2= {size / 2}
//         x1= '50%'
//         y1= {size / 2}
//         strokeWidth={strokeWidth}
//         stroke="orange"
//         strokeDasharray={size}
//         strokeDashoffset={size - progress}
//         style={{ transition: 'stroke-dashoffset 1s linear' }}
//         strokeLinecap="round"
//         />
//         <text
//         x='50%'
//         y='40%'
//         fill="#fff"
//         >
//         {timeleft}s
//         </text>
//     </svg>
//     )
// }

// export default function test() {

//     const maxtime = 10;
//     const svgsize = 100;
//     const [timeLeft, setTimeLeft] = useState(maxtime);


//     useEffect(() => {
//         if (timeLeft === 0) return;


//         const timeId = setInterval(() => {
//         setTimeLeft((prev) => {
//             if (prev <= 1) {
//             clearInterval(timeId);
//             setTimeout(setTimeLeft(maxtime),3000);
//             return 0;
//             }
//             return prev - 1;
//         });
//         }, 1000);

//         return () => clearInterval(timeId);
//     }, [timeLeft]);

//     return(
//         <div>
//             <LineTimer
//             timeleft={timeLeft}
//             totaltime={maxtime}
//             size={svgsize}
//             />
//         </div>
//     )
// }