import { UserProvider } from './components/UserContext';
import UserForm from './components/UserForm';
import Question from './components/Question';
import Results from './components/Results';
import Header from './components/Header'; 
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const questions = [
  {
    question: "What's your favorite color?",
    options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
  },
  {
    question: "What's your favorite hobby?",
    options: ["Reading 📚", "Sports 🏀", "Cooking 🍳", "Traveling ✈️"],
  },
  {
    question: "What's your favorite animal?",
    options: ["Dog 🐶", "Cat 🐱", "Bird 🐦", "Fish 🐟"],
  },
  {
    question: "What's your favorite season?",
    options: ["Spring 🌸", "Summer ☀️", "Autumn 🍂", "Winter ❄️"],
  },
];

const keywords = {
  Fire: "fire",
  Water: "water",
  Earth: "earth",
  Air: "air",
};

const elements = {
  "Red 🔴": "Fire",
  "Blue 🔵": "Water",
  "Green 🟢": "Earth",
  "Yellow 🟡": "Air",
  "Reading 📚": "Earth",
  "Sports 🏀": "Fire",
  "Cooking 🍳": "Water",
  "Traveling ✈️": "Air",
  "Dog 🐶": "Fire",
  "Cat 🐱": "Water",
  "Bird 🐦": "Air",
  "Fish 🐟": "Water",
  "Spring 🌸": "Air",
  "Summer ☀️": "Fire",
  "Autumn 🍂": "Earth",
  "Winter ❄️": "Water",
};

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  const [userName, setUserName] = useState("");

  const [element, setElement] = useState("");

  const [artwork, setArtwork] = useState(null);

  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function handleUserFormSubmit(name) {
    setUserName(name);
  }

  function determineElement(answers) {
    const counts = {};
    answers.forEach((answer) => {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
  }

  async function fetchArtwork(keyword) {
    try {
      const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}`);
      const data = await response.json();
      if (data.objectIDs && data.objectIDs.length > 0) { 

        const objectID = data.objectIDs[0];
        const artworkResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
        const artworkData = await artworkResponse.json();

        setArtwork(artworkData);
      } else {
        setArtwork(null);
      }
    } catch (error) {
      console.error("Error fetching artwork:", error);
      setArtwork(null);
    }
  }

  useEffect(() => {
    if (currentQuestionIndex === questions.length) {
      const selectedElement = determineElement(answers);
      setElement(selectedElement);

      fetchArtwork(keywords[selectedElement]);
    }
  }, [currentQuestionIndex]);

  return (
    <UserProvider>
      <Router>
        <Header /> 
        <Routes>
          <Route path="/" element={<UserForm onSubmit={handleUserFormSubmit} />} />
          <Route
            path="/quiz"
            element={

              currentQuestionIndex < questions.length ? (
                <Question question={questions[currentQuestionIndex].question} options={questions[currentQuestionIndex].options} onAnswer={handleAnswer} />
              ) : (
                <Results element={element} artwork={artwork} />
              )
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
