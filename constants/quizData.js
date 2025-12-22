export const getQuizData = (t) => {
  try {
    const questionsData = t('questionnaire.questions', { returnObjects: true });
    
    // Safety check - if questionsData is not an array, use fallback
    if (!questionsData || !Array.isArray(questionsData)) {
      //console.log('Questions data not available, using fallback');
      return quizData; // Use the hardcoded fallback
    }
    
    return questionsData.map(questionData => ({
      question: questionData.question,
      options: questionData.options,
      selectedAnswer: null
    }));
  } catch (error) {
  //  console.log('Error loading quiz data:', error);
    return quizData; // Use fallback on error
  }
};

export const quizData = [
    {
        question: "What can we help you to do?",
        options:["Reduce stress and anxiety",
            "Boost focus and manage ADHD","Discover your personality"],
        selectedAnswer:null
    },
    {
        question: "Which topics make it harder for you to feel confident in yourself?",
        options:["Managing emotions","Energy levels",
            "Relationships","Fitness level","Overall health"],
        selectedAnswer:null
    },
    {
        question: "How easy is it for you to get out of bed?",
        options:["Very easy,I get up pretty quickly",
            "Sometimes easy,some days can be hard",
            "Hard,I often struggle to get out of bed"],
        selectedAnswer:null
    },
    {
        question: "How often do you feel overwhelmed?",
        options:["I feel overwhelmed several times a week",
            "I have a few stressful days each month",
            "I manage and overcome stress pretty well"],
        selectedAnswer:null
    },
    {
        question: "Do you struggle with any of these mental health challenges?",
        options:["Anxiety","PTSD","Bipolar Disorder","ADHD","OCD","None of the above"],
        selectedAnswer:null
    }
]