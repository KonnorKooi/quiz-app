// Geological Time Quiz Component and Logic
// This file contains both the React component definition and the show/hide functions

// First define the GeologicalTimeQuiz React component so it exists before being referenced
const GeologicalTimeQuiz = () => {
  // Correct answers
  const correctAnswers = {
    // Eons
    precambrian: "Precambrian",
    // Eras
    archean: "Archean",
    proterozoic: "Proterozoic",
    phanerozoic: "Phanerozoic",
    paleozoic: "Paleozoic",
    mesozoic: "Mesozoic",
    cenozoic: "Cenozoic",
    // Proterozoic periods
    ediacaran: "Ediacaran",
    // Paleozoic periods
    cambrian: "Cambrian",
    ordovician: "Ordovician",
    silurian: "Silurian",
    devonian: "Devonian",
    carboniferous: "Carboniferous",
    permian: "Permian",
    // Mesozoic periods
    triassic: "Triassic",
    jurassic: "Jurassic",
    cretaceous: "Cretaceous",
    // Cenozoic periods
    paleogene: "Paleogene",
    neogene: "Neogene",
    quaternary: "Quaternary",
    // Dates
    archeanStart: "4.5",
    proterozoicStart: "2.5",
    phanerozoicStart: "542",
    mesozoicStart: "251",
    cenozoicStart: "66"
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
      // Allow for some variation in spelling
      const isCorrect = answers[key]?.toLowerCase().trim() === 
        correctAnswers[key].toLowerCase() || 
        // Allow for close matches
        (answers[key]?.toLowerCase().trim().length > 3 && 
         correctAnswers[key].toLowerCase().includes(answers[key]?.toLowerCase().trim()));
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
  }, [answers]); // Re-add event listener when answers change

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Geological Timescale Quiz</h2>
        <p className="text-gray-600">Fill in the blank fields with correct geological time periods and dates</p>
      </div>
      
      {/* Timeline visualization that better matches the reference image */}
      <div className="relative border-2 border-gray-800 p-4 mb-6 bg-gray-50">
        {/* Main timescale diagram - horizontally oriented like the image */}
        <div className="timeline-container w-full">
          {/* Top row: Eons */}
          <div className="flex w-full mb-1">
            <div className="w-2/5 border-2 border-gray-800 p-2 text-center bg-gray-100">
              <input
                type="text"
                placeholder="Supereon!"
                className="p-1 text-center w-full font-bold"
                value={answers.precambrian || ''}
                onChange={(e) => handleInputChange('precambrian', e.target.value)}
                style={getInputStyle('precambrian')}
              />
            </div>
            <div className="w-3/5 border-2 border-gray-800 p-2 text-center bg-gray-100">
              <input
                type="text"
                placeholder="Eon"
                className="p-1 text-center w-full font-bold"
                value={answers.phanerozoic || ''}
                onChange={(e) => handleInputChange('phanerozoic', e.target.value)}
                style={getInputStyle('phanerozoic')}
              />
            </div>
          </div>
          
          {/* Second row: Eras and key dates */}
          <div className="flex w-full mb-1">
            <div className="w-1/5 border-2 border-gray-800 p-2 text-center bg-yellow-50">
              <input
                type="text"
                placeholder="Eon"
                className="p-1 text-center w-full"
                value={answers.archean || ''}
                onChange={(e) => handleInputChange('archean', e.target.value)}
                style={getInputStyle('archean')}
              />
              <div className="mt-1 text-sm text-gray-600">
                <input
                  type="text"
                  size="4"
                  placeholder="Ga"
                  className="p-1 text-center w-16"
                  value={answers.archeanStart || ''}
                  onChange={(e) => handleInputChange('archeanStart', e.target.value)}
                  style={getInputStyle('archeanStart')}
                /> Ga
              </div>
            </div>
            <div className="w-1/5 border-2 border-gray-800 p-2 text-center bg-green-50">
              <input
                type="text"
                placeholder="Eon"
                className="p-1 text-center w-full"
                value={answers.proterozoic || ''}
                onChange={(e) => handleInputChange('proterozoic', e.target.value)}
                style={getInputStyle('proterozoic')}
              />
              <div className="mt-1 text-sm text-gray-600">
                <input
                  type="text"
                  size="4"
                  placeholder="Ga"
                  className="p-1 text-center w-16"
                  value={answers.proterozoicStart || ''}
                  onChange={(e) => handleInputChange('proterozoicStart', e.target.value)}
                  style={getInputStyle('proterozoicStart')}
                /> Ga
              </div>
            </div>
            <div className="w-1/5 border-2 border-gray-800 p-2 text-center bg-blue-50">
              <input
                type="text"
                placeholder="Era"
                className="p-1 text-center w-full"
                value={answers.paleozoic || ''}
                onChange={(e) => handleInputChange('paleozoic', e.target.value)}
                style={getInputStyle('paleozoic')}
              />
              <div className="mt-1 text-sm text-gray-600">
                <input
                  type="text"
                  size="4"
                  placeholder="Ma"
                  className="p-1 text-center w-16"
                  value={answers.phanerozoicStart || ''}
                  onChange={(e) => handleInputChange('phanerozoicStart', e.target.value)}
                  style={getInputStyle('phanerozoicStart')}
                /> Ma
              </div>
            </div>
            <div className="w-1/5 border-2 border-gray-800 p-2 text-center bg-purple-50">
              <input
                type="text"
                placeholder="Era"
                className="p-1 text-center w-full"
                value={answers.mesozoic || ''}
                onChange={(e) => handleInputChange('mesozoic', e.target.value)}
                style={getInputStyle('mesozoic')}
              />
              <div className="mt-1 text-sm text-gray-600">
                <input
                  type="text"
                  size="4"
                  placeholder="Ma"
                  className="p-1 text-center w-16"
                  value={answers.mesozoicStart || ''}
                  onChange={(e) => handleInputChange('mesozoicStart', e.target.value)}
                  style={getInputStyle('mesozoicStart')}
                /> Ma
              </div>
            </div>
            <div className="w-1/5 border-2 border-gray-800 p-2 text-center bg-red-50">
              <input
                type="text"
                placeholder="Era"
                className="p-1 text-center w-full"
                value={answers.cenozoic || ''}
                onChange={(e) => handleInputChange('cenozoic', e.target.value)}
                style={getInputStyle('cenozoic')}
              />
              <div className="mt-1 text-sm text-gray-600">
                <input
                  type="text"
                  size="4"
                  placeholder="Ma"
                  className="p-1 text-center w-16"
                  value={answers.cenozoicStart || ''}
                  onChange={(e) => handleInputChange('cenozoicStart', e.target.value)}
                  style={getInputStyle('cenozoicStart')}
                /> Ma
              </div>
            </div>
          </div>
          
          {/* Periods section - each period has its own row */}
          <h4 className="text-center font-bold mt-4 mb-2">Geological Periods</h4>

          {/* Ediacaran row */}
          <div className="flex w-full mb-1">
            <div className="w-1/5 border-2 border-gray-800 bg-yellow-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-green-50 opacity-80">
              <div className="p-2 text-center">
                <input
                  type="text"
                  placeholder="Period"
                  className="p-1 text-center w-full text-xs"
                  value={answers.ediacaran || ''}
                  onChange={(e) => handleInputChange('ediacaran', e.target.value)}
                  style={getInputStyle('ediacaran')}
                />
              </div>
            </div>
            <div className="w-1/5 border-2 border-gray-800 bg-blue-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-purple-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-red-50 opacity-80"></div>
          </div>

          {/* Cambrian row */}
          <div className="flex w-full mb-1">
            <div className="w-1/5 border-2 border-gray-800 bg-yellow-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-green-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-blue-50 opacity-80">
              <div className="p-2 text-center">
                <input
                  type="text"
                  placeholder="Period"
                  className="p-1 text-center w-full text-xs"
                  value={answers.cambrian || ''}
                  onChange={(e) => handleInputChange('cambrian', e.target.value)}
                  style={getInputStyle('cambrian')}
                />
              </div>
            </div>
            <div className="w-1/5 border-2 border-gray-800 bg-purple-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-red-50 opacity-80"></div>
          </div>

          {/* Ordovician row */}
          <div className="flex w-full mb-1">
            <div className="w-1/5 border-2 border-gray-800 bg-yellow-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-green-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-blue-50 opacity-80">
              <div className="p-2 text-center">
                <input
                  type="text"
                  placeholder="Period"
                  className="p-1 text-center w-full text-xs"
                  value={answers.ordovician || ''}
                  onChange={(e) => handleInputChange('ordovician', e.target.value)}
                  style={getInputStyle('ordovician')}
                />
              </div>
            </div>
            <div className="w-1/5 border-2 border-gray-800 bg-purple-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-red-50 opacity-80"></div>
          </div>

          {/* Silurian row */}
          <div className="flex w-full mb-1">
            <div className="w-1/5 border-2 border-gray-800 bg-yellow-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-green-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-blue-50 opacity-80">
              <div className="p-2 text-center">
                <input
                  type="text"
                  placeholder="Period"
                  className="p-1 text-center w-full text-xs"
                  value={answers.silurian || ''}
                  onChange={(e) => handleInputChange('silurian', e.target.value)}
                  style={getInputStyle('silurian')}
                />
              </div>
            </div>
            <div className="w-1/5 border-2 border-gray-800 bg-purple-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-red-50 opacity-80"></div>
          </div>

          {/* Devonian row */}
          <div className="flex w-full mb-1">
            <div className="w-1/5 border-2 border-gray-800 bg-yellow-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-green-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-blue-50 opacity-80">
              <div className="p-2 text-center">
                <input
                  type="text"
                  placeholder="Period"
                  className="p-1 text-center w-full text-xs"
                  value={answers.devonian || ''}
                  onChange={(e) => handleInputChange('devonian', e.target.value)}
                  style={getInputStyle('devonian')}
                />
              </div>
            </div>
            <div className="w-1/5 border-2 border-gray-800 bg-purple-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-red-50 opacity-80"></div>
          </div>

          {/* Carboniferous row */}
          <div className="flex w-full mb-1">
            <div className="w-1/5 border-2 border-gray-800 bg-yellow-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-green-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-blue-50 opacity-80">
              <div className="p-2 text-center">
                <input
                  type="text"
                  placeholder="Period"
                  className="p-1 text-center w-full text-xs"
                  value={answers.carboniferous || ''}
                  onChange={(e) => handleInputChange('carboniferous', e.target.value)}
                  style={getInputStyle('carboniferous')}
                />
              </div>
            </div>
            <div className="w-1/5 border-2 border-gray-800 bg-purple-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-red-50 opacity-80"></div>
          </div>

          {/* Permian row */}
          <div className="flex w-full mb-1">
            <div className="w-1/5 border-2 border-gray-800 bg-yellow-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-green-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-blue-50 opacity-80">
              <div className="p-2 text-center">
                <input
                  type="text"
                  placeholder="Period"
                  className="p-1 text-center w-full text-xs"
                  value={answers.permian || ''}
                  onChange={(e) => handleInputChange('permian', e.target.value)}
                  style={getInputStyle('permian')}
                />
              </div>
            </div>
            <div className="w-1/5 border-2 border-gray-800 bg-purple-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-red-50 opacity-80"></div>
          </div>

          {/* Triassic row */}
          <div className="flex w-full mb-1">
            <div className="w-1/5 border-2 border-gray-800 bg-yellow-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-green-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-blue-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-purple-50 opacity-80">
              <div className="p-2 text-center">
                <input
                  type="text"
                  placeholder="Period"
                  className="p-1 text-center w-full text-xs"
                  value={answers.triassic || ''}
                  onChange={(e) => handleInputChange('triassic', e.target.value)}
                  style={getInputStyle('triassic')}
                />
              </div>
            </div>
            <div className="w-1/5 border-2 border-gray-800 bg-red-50 opacity-80"></div>
          </div>

          {/* Jurassic row */}
          <div className="flex w-full mb-1">
            <div className="w-1/5 border-2 border-gray-800 bg-yellow-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-green-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-blue-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-purple-50 opacity-80">
              <div className="p-2 text-center">
                <input
                  type="text"
                  placeholder="Period"
                  className="p-1 text-center w-full text-xs"
                  value={answers.jurassic || ''}
                  onChange={(e) => handleInputChange('jurassic', e.target.value)}
                  style={getInputStyle('jurassic')}
                />
              </div>
            </div>
            <div className="w-1/5 border-2 border-gray-800 bg-red-50 opacity-80"></div>
          </div>

          {/* Cretaceous row */}
          <div className="flex w-full mb-1">
            <div className="w-1/5 border-2 border-gray-800 bg-yellow-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-green-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-blue-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-purple-50 opacity-80">
              <div className="p-2 text-center">
                <input
                  type="text"
                  placeholder="Period"
                  className="p-1 text-center w-full text-xs"
                  value={answers.cretaceous || ''}
                  onChange={(e) => handleInputChange('cretaceous', e.target.value)}
                  style={getInputStyle('cretaceous')}
                />
              </div>
            </div>
            <div className="w-1/5 border-2 border-gray-800 bg-red-50 opacity-80"></div>
          </div>

          {/* Paleogene row */}
          <div className="flex w-full mb-1">
            <div className="w-1/5 border-2 border-gray-800 bg-yellow-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-green-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-blue-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-purple-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-red-50 opacity-80">
              <div className="p-2 text-center">
                <input
                  type="text"
                  placeholder="Period"
                  className="p-1 text-center w-full text-xs"
                  value={answers.paleogene || ''}
                  onChange={(e) => handleInputChange('paleogene', e.target.value)}
                  style={getInputStyle('paleogene')}
                />
              </div>
            </div>
          </div>

          {/* Neogene row */}
          <div className="flex w-full mb-1">
            <div className="w-1/5 border-2 border-gray-800 bg-yellow-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-green-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-blue-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-purple-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-red-50 opacity-80">
              <div className="p-2 text-center">
                <input
                  type="text"
                  placeholder="Period"
                  className="p-1 text-center w-full text-xs"
                  value={answers.neogene || ''}
                  onChange={(e) => handleInputChange('neogene', e.target.value)}
                  style={getInputStyle('neogene')}
                />
              </div>
            </div>
          </div>

          {/* Quaternary row */}
          <div className="flex w-full mb-1">
            <div className="w-1/5 border-2 border-gray-800 bg-yellow-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-green-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-blue-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-purple-50 opacity-80"></div>
            <div className="w-1/5 border-2 border-gray-800 bg-red-50 opacity-80">
              <div className="p-2 text-center">
                <input
                  type="text"
                  placeholder="Period"
                  className="p-1 text-center w-full text-xs"
                  value={answers.quaternary || ''}
                  onChange={(e) => handleInputChange('quaternary', e.target.value)}
                  style={getInputStyle('quaternary')}
                />
              </div>
            </div>
          </div>
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
            <p className="text-green-600 font-bold mt-2">Perfect score! Excellent work!</p>
          )}
          {countCorrect() > 0 && countCorrect() < Object.keys(correctAnswers).length && (
            <p className="text-blue-600 mt-2">Good effort! Review the highlighted answers and try again.</p>
          )}
          {countCorrect() === 0 && (
            <p className="text-red-600 mt-2">Keep studying! You'll get it next time.</p>
          )}
        </div>
      )}
    </div>
  );
};

// Functions to show/hide the geological time quiz
function showGeologicalTimeQuiz() {
  // Hide all other screens
  document.getElementById('start-screen')?.classList.add('hidden');
  document.getElementById('quiz-screen')?.classList.add('hidden');
  document.getElementById('results-screen')?.classList.add('hidden');
  document.getElementById('quiz-type-selector')?.classList.add('hidden');
  
  // Show the geological quiz screen
  document.getElementById('geological-quiz-screen')?.classList.remove('hidden');
  
  // Render the React component if it hasn't been rendered yet
  if (!window.geologicalQuizRendered) {
    try {
      ReactDOM.render(
        React.createElement(GeologicalTimeQuiz),
        document.getElementById('geological-quiz-container')
      );
      window.geologicalQuizRendered = true;
      
      // Apply responsive behavior
      adjustQuizResponsiveness();
      
      // Apply fade-in animation
      const quizContainer = document.getElementById('geological-quiz-container');
      if (quizContainer) {
        quizContainer.style.opacity = '0';
        quizContainer.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          quizContainer.style.opacity = '1';
        }, 100);
      }
      
      // Dispatch event that quiz was rendered
      document.dispatchEvent(new Event('geological-quiz-rendered'));
    } catch (error) {
      console.error('Error rendering geological quiz:', error);
    }
  }
}

function hideGeologicalTimeQuiz() {
  // Fade out animation
  const quizContainer = document.getElementById('geological-quiz-container');
  if (quizContainer) {
    quizContainer.style.opacity = '0';
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      // Hide the geological quiz screen
      document.getElementById('geological-quiz-screen')?.classList.add('hidden');
      
      // Show the start screen
      document.getElementById('start-screen')?.classList.remove('hidden');
      document.getElementById('quiz-type-selector')?.classList.remove('hidden');
    }, 500);
  } else {
    // If no container found, just hide immediately
    document.getElementById('geological-quiz-screen')?.classList.add('hidden');
    document.getElementById('start-screen')?.classList.remove('hidden');
    document.getElementById('quiz-type-selector')?.classList.remove('hidden');
  }
}

// Function to handle responsive behavior
function adjustQuizResponsiveness() {
  const adjustLayout = () => {
    const quizContainer = document.getElementById('geological-quiz-container');
    if (!quizContainer) return;
    
    // Apply mobile-specific adjustments
    if (window.innerWidth < 768) {
      document.querySelectorAll('.timeline-container').forEach(container => {
        container.style.minWidth = '600px'; // Ensure minimum width for scrollable content
      });
      
      // Add instructions for mobile users
      let mobileInstructions = document.getElementById('mobile-quiz-instructions');
      if (!mobileInstructions) {
        mobileInstructions = document.createElement('div');
        mobileInstructions.id = 'mobile-quiz-instructions';
        mobileInstructions.className = 'text-sm text-gray-600 mt-2 mb-4 text-center';
        mobileInstructions.innerHTML = 'Scroll horizontally to see the complete timeline';
        
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineContainer && timelineContainer.parentNode) {
          timelineContainer.parentNode.insertBefore(mobileInstructions, timelineContainer);
        }
      }
    } else {
      // Remove mobile instructions on larger screens
      document.getElementById('mobile-quiz-instructions')?.remove();
    }
  };
  
  // Run on initial load
  adjustLayout();
  
  // Add resize event listener
  window.addEventListener('resize', adjustLayout);
}

// Helper function to create a Tooltip component for touch devices
function createTooltip(message) {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = message;
  tooltip.style.position = 'fixed';
  tooltip.style.backgroundColor = 'rgba(0,0,0,0.8)';
  tooltip.style.color = 'white';
  tooltip.style.padding = '8px 12px';
  tooltip.style.borderRadius = '4px';
  tooltip.style.fontSize = '14px';
  tooltip.style.zIndex = '1000';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.transition = 'opacity 0.3s';
  tooltip.style.opacity = '0';
  
  document.body.appendChild(tooltip);
  
  setTimeout(() => {
    tooltip.style.opacity = '1';
  }, 10);
  
  setTimeout(() => {
    tooltip.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(tooltip);
    }, 300);
  }, 2000);
  
  return tooltip;
}

// Helper function for touch events on small inputs
function setupTouchHelpers() {
  document.querySelectorAll('#geological-quiz-container input').forEach(input => {
    if (input.offsetWidth < 50) { // Only for small inputs
      input.addEventListener('touchstart', (e) => {
        // Create and show tooltip
        const tooltip = createTooltip('Tap to edit');
        tooltip.style.left = `${e.touches[0].clientX - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${e.touches[0].clientY - 40}px`;
      });
    }
  });
}

// Initialize geological quiz when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Create container for the geological quiz if it doesn't exist
  if (!document.getElementById('geological-quiz-screen')) {
    const quizScreen = document.createElement('div');
    quizScreen.id = 'geological-quiz-screen';
    quizScreen.className = 'hidden';
    document.body.appendChild(quizScreen);
    
    const quizContainer = document.createElement('div');
    quizContainer.id = 'geological-quiz-container';
    quizScreen.appendChild(quizContainer);
    
    // Add back button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back to Menu';
    backButton.className = 'absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded';
    backButton.onclick = hideGeologicalTimeQuiz;
    quizScreen.appendChild(backButton);
  }
  
  // Register the quiz in the selector if it exists
  const quizTypeSelector = document.getElementById('quiz-type-selector');
  if (quizTypeSelector && !document.getElementById('geological-quiz-option')) {
    const geologicalOption = document.createElement('div');
    geologicalOption.id = 'geological-quiz-option';
    geologicalOption.className = 'quiz-option';
    geologicalOption.onclick = showGeologicalTimeQuiz;
    
    // Create quiz option content
    geologicalOption.innerHTML = `
      <h3>Geological Timescale Quiz</h3>
      <p>Test your knowledge of Earth's geological history</p>
      <div class="difficulty">Intermediate</div>
    `;
    
    quizTypeSelector.appendChild(geologicalOption);
  }
});

// Setup touch helpers when quiz is shown
document.addEventListener('geological-quiz-rendered', setupTouchHelpers);