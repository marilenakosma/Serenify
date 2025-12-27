/**
 * Get the translated habit title from a habit ID
 * Handles all habit types: foundational, common, category-specific, and goal ideas
 */
export const getHabitTranslation = (habitId, t) => {
  // Map of habit IDs to their translation keys
  const translationKeyMap = {
    // Foundational habits
    'complete-goal': 'habits.foundation.dailyGoal',
    'reflection': 'habits.foundation.writeReflection',
    'affirmation': 'habits.foundation.affirmations',
    'exercise': 'habits.foundation.exercise',
    
    // Common habits (with .title suffix)
    'water-intake': 'habits.common.waterIntake.title',
    'no-screen-before-bed': 'habits.common.noScreenBeforeBed.title',
    'morning-exercise': 'habits.common.morningExercise.title',
    'eat-fruit': 'habits.common.eatFruit.title',
    'practice-gratitude': 'habits.common.practiceGratitude.title',
    'pray': 'habits.common.pray.title',
    'read-book': 'habits.common.readBook.title',
    'breathing-exercises': 'habits.common.breathingExercises.title',
    'reduce-sugar': 'habits.common.reduceSugar.title',
    'anxiety-journal': 'habits.common.anxietyJournal.title',
    'organize-space': 'habits.common.organizeSpace.title',
    'take-breaks': 'habits.common.takeBreaks.title',
    
    // Category-specific habits (with .title suffix)
    'deep-breathing': 'habits.anxietyManagement.deepBreathing.title',
    'limit-caffeine': 'habits.anxietyManagement.limitCaffeine.title',
    'sunlight-exposure': 'habits.depressionSupport.sunlightExposure.title',
    'social-connection': 'habits.depressionSupport.socialConnection.title',
    'bedtime-routine': 'habits.sleepIssues.bedtimeRoutine.title',
    'bedroom-temperature': 'habits.sleepIssues.bedroomTemperature.title',
    'meditation': 'habits.stressManagement.meditation.title',
    'nature-time': 'habits.stressManagement.natureTime.title',
  };

  // 1. Check if we have an explicit mapping
  if (translationKeyMap[habitId]) {
    const translated = t(translationKeyMap[habitId]);
    if (translated !== translationKeyMap[habitId]) {
      return translated;
    }
  }

  // 2. Try goals.* pattern (for goal ideas from goalIdeas.jsx)
  const toCamel = (id) =>
    id
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((part, i) =>
        i === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join('');
      
  const goalKey = `goals.${toCamel(habitId)}`;
  const goalTranslated = t(goalKey);
  if (goalTranslated !== goalKey) {
    return goalTranslated;
  }

  // 3. Fallback: prettify the ID
  return habitId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};