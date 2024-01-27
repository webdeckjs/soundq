import React from 'react';

const App = ({ title }) => (
  <div
    style={{
      borderRadius: '4px',
      padding: '2em',
      backgroundColor: 'red',
      color: 'white',
    }}
    data-e2e="APP_2__WIDGET"
  >
    {title}
  </div>
);

export default App;
