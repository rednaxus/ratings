
import React from 'react'
import { TagCloud } from 'react-tagcloud'

/*
const data = [
  { id: 0, value: "Ethereum", count: 38 },
  { id: 1, value: "EOS", count: 30 },
  { id: 2, value: "Tronix", count: 28 },
  { id: 3, value: "BNB", count: 25 },
  { id: 4, value: "OMGToken", count: 33 },
  { id: 5, value: "ICON", count: 18 },
  { id: 6, value: "Bytom", count: 20 },
  { id: 7, value: "Populous", count: 38 },
  { id: 8, value: "Platform", count: 30 },
  { id: 9, value: "RHOC", count: 28 },
  { id: 10, value: "Maker", count: 25 },
  { id: 11, value: "Aeternity", count: 33 },
  { id: 12, value: "Status Network", count: 18 },
  { id: 13, value: "0x Protocol", count: 20 },
  { id: 14, value: "Ethos Coin", count: 5 }
];

*/
/* CSS:
@keyframes blinker {
  50% { opacity: 0.0; }
}
*/

// custom renderer is function which has tag, computed font size and
// color as arguments, and returns react component which represents tag
const customRenderer = (tag, size, color) => (
  <span key={tag.value}
        style={{
          animation: 'blinker 12s linear infinite',
          animationDelay: `${Math.random() * 2}s`,
          fontSize: `${size}em`,
          //border: `2px solid ${color}`,
          margin: '3px',
          padding: '3px',
          display: 'inline-block',
          color: `${color}`,
        }}>{tag.value}</span>
);

const TokenCloud = ( { tokens } ) => {
  console.log('tokens',tokens)

  const data = tokens.map( token => {
    let count = token.price && token.price.marketCapUsd ? token.price.marketCapUsd / 1000000000: 10
    return { id: token.id, value: token.name, count: count } 
  })
  return (
    <TagCloud tags={data} minSize={1} maxSize={2} renderer={customRenderer} />
  )
}

const TokenCloudSimple = ( { tokens } ) => {
  console.log('tokens',tokens)
  return (
    <TagCloud minSize={12} maxSize={35} tags={data} onClick={tag => alert(`'${tag.value}' was selected!`)} />
  );
}


export default TokenCloud