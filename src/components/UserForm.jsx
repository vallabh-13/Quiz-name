import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';

export default function UserForm() {
  const [inputName, setInputName] = useState('');
  const { setName } = useContext(UserContext);

  function handleSubmit(e) {
    e.preventDefault();
    setName(inputName);  
    window.history.pushState({}, '', '/quiz');  
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);  
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} />
      </label>
      <button type="submit">Start Quiz</button>
    </form>
  );
}
