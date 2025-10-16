// Cenozoic Era Geological Time Quiz Component and Logic (Version 2)
// This file contains the React component for the detailed Cenozoic timeline quiz

// Define the CenozoicTimeQuiz React component
const CenozoicTimeQuiz = () => {
  // Correct answers based on the proper Cenozoic structure
  const correctAnswers = {
    // Main periods within Cenozoic
    paleogene: "Paleogene",
    neogene: "Neogene", 
    quaternary: "Quaternary",
    
    // Paleogene epochs
    paleocene: "Paleocene",
    eocene: "Eocene",
    oligocene: "Oligocene",
    
    // Neogene epochs
    miocene: "Miocene",
    pliocene: "Pliocene",
    pleistocene: "Pleistocene",
    
    // Quaternary epochs
    holocene: "Holocene",
    
    // Dates (in Ma - Million years ago)
    paleogeneStart: "66",
    neogeneStart: "23", 
    quaternaryStart: "0.012",
    paleoceneStart: "66",
    eoceneStart: "56",
    oligoceneStart: "34", 
    mioceneStart: "23",
    plioceneStart: "5.3",
    pleistoceneStart: "2.58",
    holoceneStart: "0.012"
  };

  // User answers
  const [answers, setAnswers] = React.useState({});
  const [checked, setChecked] = React.useState(false);
  const [results, setResults] = React.useState({});

  const handleInputChange = (field, value) => {
    setAnswers({...answers, [field]: value});
  };

  const checkAnswers = () => {
    const newResults = {};
    for (const key in correctAnswers) {
      // Allow for some variation in spelling and number formats
      const userAnswer = answers[key]?.toLowerCase().trim();
      const correctAnswer = correctAnswers[key].toLowerCase();
      
      const isCorrect = userAnswer === correctAnswer || 
        // Allow for close matches in spelling
        (userAnswer?.length > 3 && correctAnswer.includes(userAnswer)) ||
        // Allow for number variations (e.g., "0.012" vs ".012")
        (key.includes('Start') && parseFloat(userAnswer) === parseFloat(correctAnswer));
      
      newResults[key] = isCorrect;
    }
    setResults(newResults);
    setChecked(true);
    
    // Calculate score for potential confetti
    const correctCount = Object.values(newResults).filter(Boolean).length;
    const totalQuestions = Object.keys(correctAnswers).length;
    if (correctCount / totalQuestions >= 0.7) {
      // Use the existing confetti function if available
      if (typeof triggerConfetti === 'function') {
        triggerConfetti('medium');
      }
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setChecked(false);
    setResults({});
  };

  const getInputStyle = (field) => {
    if (!checked) return {};
    return {
      backgroundColor: results[field] ? '#d4edda' : '#f8d7da',
      borderColor: results[field] ? '#c3e6cb' : '#f5c6cb'
    };
  };

  const countCorrect = () => {
    return Object.values(results).filter(Boolean).length;
  };
  
  // Handle enter key press to check answers
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        checkAnswers();
      }
    };
    
    document.addEventListener('keypress', handleKeyPress);
    
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [answers]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Cenozoic Era Timeline Quiz</h2>
        <p className="text-gray-600">Fill in the periods, epochs, and dates for the Cenozoic Era (66 Ma - Present)</p>
      </div>
      
      {/* Vertical timeline visualization matching the correct Cenozoic structure */}
      <div className="relative border-2 border-gray-800 p-4 mb-6 bg-gray-50">
        <div className="cenozoic-timeline w-full max-w-2xl mx-auto">
          
          {/* Quaternary Period Section */}
          <div className="timeline-section border-2 border-gray-800 bg-blue-100 p-3 mb-2">
            <div className="w-full">
              <div className="flex justify-between items-center mb-2 p-2">
                <input
                  type="text"
                  placeholder="Period"
                  className="text-center w-40 font-bold"
                  value={answers.quaternary || ''}
                  onChange={(e) => handleInputChange('quaternary', e.target.value)}
                  style={getInputStyle('quaternary')}
                />
                <div className="text-sm">
                  <input
                    type="text"
                    size="6"
                    className="p-1 text-center w-16"
                    value={answers.quaternaryStart || ''}
                    onChange={(e) => handleInputChange('quaternaryStart', e.target.value)}
                    style={getInputStyle('quaternaryStart')}
                  /> Ma
                </div>
              </div>
              
              {/* Quaternary epochs */}
              <div className="ml-6 border-l-2 border-gray-600 pl-4">
                <div className="epoch-section mb-2 p-2 bg-blue-50 border border-gray-400 rounded">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Epoch"
                      className="p-1 text-center w-28 text-sm"
                      value={answers.holocene || ''}
                      onChange={(e) => handleInputChange('holocene', e.target.value)}
                      style={getInputStyle('holocene')}
                    />
                    <div className="text-xs">
                      <input
                        type="text"
                        size="6"
                        className="p-1 text-center w-16 text-xs"
                        value={answers.holoceneStart || ''}
                        onChange={(e) => handleInputChange('holoceneStart', e.target.value)}
                        style={getInputStyle('holoceneStart')}
                      /> Ma
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Neogene Period Section */}
          <div className="timeline-section border-2 border-gray-800 bg-green-100 p-3 mb-2">
            <div className="w-full">
              <div className="flex justify-between items-center mb-2 p-2">
                <input
                  type="text"
                  placeholder="Period"
                  className=" text-center w-40 font-bold"
                  value={answers.neogene || ''}
                  onChange={(e) => handleInputChange('neogene', e.target.value)}
                  style={getInputStyle('neogene')}
                />
                <div className="text-sm">
                  <input
                    type="text"
                    size="4"
                    className="p-1 text-center w-16"
                    value={answers.neogeneStart || ''}
                    onChange={(e) => handleInputChange('neogeneStart', e.target.value)}
                    style={getInputStyle('neogeneStart')}
                  /> Ma
                </div>
              </div>
              
              {/* Neogene epochs */}
              <div className="ml-6 border-l-2 border-gray-600 pl-4">
                <div className="epoch-section mb-2 p-2 bg-green-50 border border-gray-400 rounded">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Epoch"
                      className="p-1 text-center w-28 text-sm"
                      value={answers.pleistocene || ''}
                      onChange={(e) => handleInputChange('pleistocene', e.target.value)}
                      style={getInputStyle('pleistocene')}
                    />
                    <div className="text-xs">
                      <input
                        type="text"
                        size="6"
                        className="p-1 text-center w-16 text-xs"
                        value={answers.pleistoceneStart || ''}
                        onChange={(e) => handleInputChange('pleistoceneStart', e.target.value)}
                        style={getInputStyle('pleistoceneStart')}
                      /> Ma
                    </div>
                  </div>
                </div>
                
                <div className="epoch-section mb-2 p-2 bg-green-50 border border-gray-400 rounded">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Epoch"
                      className="p-1 text-center w-28 text-sm"
                      value={answers.pliocene || ''}
                      onChange={(e) => handleInputChange('pliocene', e.target.value)}
                      style={getInputStyle('pliocene')}
                    />
                    <div className="text-xs">
                      <input
                        type="text"
                        size="6"
                        className="p-1 text-center w-16 text-xs"
                        value={answers.plioceneStart || ''}
                        onChange={(e) => handleInputChange('plioceneStart', e.target.value)}
                        style={getInputStyle('plioceneStart')}
                      /> Ma
                    </div>
                  </div>
                </div>
                
                <div className="epoch-section mb-2 p-2 bg-green-50 border border-gray-400 rounded">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Epoch"
                      className="p-1 text-center w-28 text-sm"
                      value={answers.miocene || ''}
                      onChange={(e) => handleInputChange('miocene', e.target.value)}
                      style={getInputStyle('miocene')}
                    />
                    <div className="text-xs">
                      <input
                        type="text"
                        size="4"
                        className="p-1 text-center w-16 text-xs"
                        value={answers.mioceneStart || ''}
                        onChange={(e) => handleInputChange('mioceneStart', e.target.value)}
                        style={getInputStyle('mioceneStart')}
                      /> Ma
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Paleogene Period Section */}
          <div className="timeline-section border-2 border-gray-800 bg-yellow-100 p-3 mb-2">
            <div className="w-full">
              <div className="flex justify-between items-center mb-2 p-2">
                <input
                  type="text"
                  placeholder="Period"
                  className=" text-center w-40 font-bold"
                  value={answers.paleogene || ''}
                  onChange={(e) => handleInputChange('paleogene', e.target.value)}
                  style={getInputStyle('paleogene')}
                />
                <div className="text-sm">
                  <input
                    type="text"
                    size="4"
                    className="p-1 text-center w-16"
                    value={answers.paleogeneStart || ''}
                    onChange={(e) => handleInputChange('paleogeneStart', e.target.value)}
                    style={getInputStyle('paleogeneStart')}
                  /> Ma
                </div>
              </div>
              
              {/* Paleogene epochs */}
              <div className="ml-6 border-l-2 border-gray-600 pl-4">
                <div className="epoch-section mb-2 p-2 bg-yellow-50 border border-gray-400 rounded">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Epoch"
                      className="p-1 text-center w-28 text-sm"
                      value={answers.oligocene || ''}
                      onChange={(e) => handleInputChange('oligocene', e.target.value)}
                      style={getInputStyle('oligocene')}
                    />
                    <div className="text-xs">
                      <input
                        type="text"
                        size="4"
                        className="p-1 text-center w-16 text-xs"
                        value={answers.oligoceneStart || ''}
                        onChange={(e) => handleInputChange('oligoceneStart', e.target.value)}
                        style={getInputStyle('oligoceneStart')}
                      /> Ma
                    </div>
                  </div>
                </div>
                
                <div className="epoch-section mb-2 p-2 bg-yellow-50 border border-gray-400 rounded">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Epoch"
                      className="p-1 text-center w-28 text-sm"
                      value={answers.eocene || ''}
                      onChange={(e) => handleInputChange('eocene', e.target.value)}
                      style={getInputStyle('eocene')}
                    />
                    <div className="text-xs">
                      <input
                        type="text"
                        size="4"
                        className="p-1 text-center w-16 text-xs"
                        value={answers.eoceneStart || ''}
                        onChange={(e) => handleInputChange('eoceneStart', e.target.value)}
                        style={getInputStyle('eoceneStart')}
                      /> Ma
                    </div>
                  </div>
                </div>
                
                <div className="epoch-section mb-2 p-2 bg-yellow-50 border border-gray-400 rounded">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Epoch"
                      className="p-1 text-center w-28 text-sm"
                      value={answers.paleocene || ''}
                      onChange={(e) => handleInputChange('paleocene', e.target.value)}
                      style={getInputStyle('paleocene')}
                    />
                    <div className="text-xs">
                      <input
                        type="text"
                        size="4"
                        className="p-1 text-center w-16 text-xs"
                        value={answers.paleoceneStart || ''}
                        onChange={(e) => handleInputChange('paleoceneStart', e.target.value)}
                        style={getInputStyle('paleoceneStart')}
                      /> Ma
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline labels */}
          <div className="mt-4 text-center text-sm text-gray-600">
            <p><strong>Cenozoic Era:</strong> 66 Million Years Ago to Present</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p><strong>Instructions:</strong> Fill in the geological periods, epochs, and their start dates</p>
          <p><em>Ma = Million years ago</em></p>
        </div>
      </div>
      
      {/* Quiz controls */}
      <div className="flex justify-between">
        <button 
          onClick={checkAnswers}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
        >
          Check Answers
        </button>
        <button 
          onClick={resetQuiz}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded"
        >
          Reset Quiz
        </button>
      </div>
      
      {/* Results panel */}
      {checked && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-xl font-bold mb-2">Quiz Results</h3>
          <p className="text-lg">
            You got {countCorrect()} out of {Object.keys(correctAnswers).length} correct!
          </p>
          {countCorrect() === Object.keys(correctAnswers).length && (
            <p className="text-green-600 font-bold mt-2">Perfect score! You know the Cenozoic Era structure perfectly!</p>
          )}
          {countCorrect() > 0 && countCorrect() < Object.keys(correctAnswers).length && (
            <p className="text-blue-600 mt-2">Good work! Review the highlighted answers and try again.</p>
          )}
          {countCorrect() === 0 && (
            <p className="text-red-600 mt-2">Keep studying the Cenozoic Era! You'll master it soon.</p>
          )}
          
          {/* Study tips */}
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <h4 className="font-bold text-blue-800">Study Tips:</h4>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• <strong>Paleogene Period:</strong> Paleocene → Eocene → Oligocene (66-23 Ma)</li>
              <li>• <strong>Neogene Period:</strong> Miocene → Pliocene → Pleistocene (23-0.012 Ma)</li>
              <li>• <strong>Quaternary Period:</strong> Holocene (0.012 Ma - Present)</li>
              <li>• Remember: The Cenozoic began after the dinosaur extinction (66 Ma)</li>
              <li>• Holocene is our current epoch, starting after the last ice age</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Functions to show/hide the cenozoic time quiz
function showCenozoicTimeQuiz() {
  // Hide all other screens
  document.getElementById('start-screen')?.classList.add('hidden');
  document.getElementById('quiz-screen')?.classList.add('hidden');
  document.getElementById('results-screen')?.classList.add('hidden');
  document.getElementById('quiz-type-selector')?.classList.add('hidden');
  document.getElementById('geological-quiz-screen')?.classList.add('hidden');
  
  // Show the cenozoic quiz screen
  document.getElementById('cenozoic-quiz-screen')?.classList.remove('hidden');
  
  // Render the React component if it hasn't been rendered yet
  if (!window.cenozoicQuizRendered) {
    try {
      ReactDOM.render(
        React.createElement(CenozoicTimeQuiz),
        document.getElementById('cenozoic-quiz-container')
      );
      window.cenozoicQuizRendered = true;
      
      // Apply fade-in animation
      const quizContainer = document.getElementById('cenozoic-quiz-container');
      if (quizContainer) {
        quizContainer.style.opacity = '0';
        quizContainer.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          quizContainer.style.opacity = '1';
        }, 100);
      }
      
      // Dispatch event that quiz was rendered
      document.dispatchEvent(new Event('cenozoic-quiz-rendered'));
    } catch (error) {
      console.error('Error rendering cenozoic quiz:', error);
    }
  }
}

function hideCenozoicTimeQuiz() {
  // Fade out animation
  const quizContainer = document.getElementById('cenozoic-quiz-container');
  if (quizContainer) {
    quizContainer.style.opacity = '0';
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      // Hide the cenozoic quiz screen
      document.getElementById('cenozoic-quiz-screen')?.classList.add('hidden');
      
      // Show the start screen
      document.getElementById('start-screen')?.classList.remove('hidden');
      document.getElementById('quiz-type-selector')?.classList.remove('hidden');
    }, 500);
  } else {
    // If no container found, just hide immediately
    document.getElementById('cenozoic-quiz-screen')?.classList.add('hidden');
    document.getElementById('start-screen')?.classList.remove('hidden');
    document.getElementById('quiz-type-selector')?.classList.remove('hidden');
  }
}

// Initialize cenozoic quiz when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Create container for the cenozoic quiz if it doesn't exist
  if (!document.getElementById('cenozoic-quiz-screen')) {
    const quizScreen = document.createElement('div');
    quizScreen.id = 'cenozoic-quiz-screen';
    quizScreen.className = 'screen hidden';
    document.body.appendChild(quizScreen);
    
    const quizContainer = document.createElement('div');
    quizContainer.id = 'cenozoic-quiz-container';
    quizScreen.appendChild(quizContainer);
    
    // Add back button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back to Menu';
    backButton.className = 'absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded';
    backButton.onclick = hideCenozoicTimeQuiz;
    quizScreen.appendChild(backButton);
  }
});