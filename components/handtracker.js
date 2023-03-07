
import React from 'react';

const API_ENDPOINT = 'https://ec64-2601-400-c100-3c20-f4d9-cdc5-7e99-6d51.ngrok.io'

export default function HandTracker() {

  const onButtonPress = () => {
    const fetchData = async () => {
      const res = await fetch(API_ENDPOINT,{
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body:  JSON.stringify({test: "me!"}),
      });
      const json = await res.json();
      console.log(json);
    }
    fetchData();
  }

  return (
    <div>
      <h1>Show me the hands!</h1>
      <button onClick={onButtonPress}>Click me!</button>
    </div>
  );
}
