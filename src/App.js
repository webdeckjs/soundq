import React from 'react';

const App = ({ title, onClick = () => {} }) => {

  onClick(() => {
    alert("hello");
  });

  return (
    <div
      style={{
        borderRadius: '4px',
        padding: '2em',
        color: 'white',
      }}
      data-e2e="APP_2__WIDGET"
    >
      this will alert user when button is clicked
    </div>
  )
};

export default App;
