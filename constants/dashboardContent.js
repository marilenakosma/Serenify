import { useTranslation } from './translations';

export const getDashboardContent = (t) => ({
    "Anxiety Management": {
        greeting: t('dashboard.greetings.anxietyManagement'),
        todaysFocus: t('dashboard.focus.anxietyManagement'),
        recommendedGoals: [
            { 
                id: 'breathing', 
                name: 'leaf-outline', 
                text: t('goals.breathing'), 
                points: 15,
                category: t('categories.mindfulness'),
                duration: t('durations.5min')
            },
            { 
                id: 'meditation', 
                name: 'moon-outline', 
                text: t('goals.meditation'), 
                points: 20,
                category: t('categories.meditation'),
                duration: t('durations.10min')
            },
            { 
                id: 'journal', 
                name: 'book-outline', 
                text: t('goals.journal'), 
                points: 10,
                category: t('categories.reflection'),
                duration: t('durations.15min')
            },
            { 
                id: 'walk', 
                name: 'walk-outline', 
                text: t('goals.walk'), 
                points: 15,
                category: t('categories.movement'),
                duration: t('durations.20min')
            },
        ],
        color: '#E8F5E8',
        primaryColor: '#4CAF50',
    },
    "Stress Relief": {
        greeting: t('dashboard.greetings.stressRelief'),
        todaysFocus: t('dashboard.focus.stressRelief'),
        recommendedGoals: [
            { 
                id: 'organize', 
                name: 'albums-outline', 
                text: t('goals.organize'), 
                points: 10,
                category: t('categories.productivity'),
                duration: t('durations.15min')
            },
            { 
                id: 'music', 
                name: 'musical-notes-outline', 
                text: t('goals.music'), 
                points: 10,
                category: t('categories.relaxation'),
                duration: t('durations.10min')
            },
            { 
                id: 'stretch', 
                name: 'body-outline', 
                text: t('goals.stretch'), 
                points: 15,
                category: t('categories.movement'),
                duration: t('durations.10min')
            },
            { 
                id: 'tea', 
                name: 'cafe-outline', 
                text: t('goals.tea'), 
                points: 10,
                category: t('categories.mindfulness'),
                duration: t('durations.5min')
            },
        ],
        color: '#FFF8E1',
        primaryColor: '#FF9800',
    },
    "Maintaining Balance": {
        greeting: t('dashboard.greetings.maintainingBalance'),
        todaysFocus: t('dashboard.focus.maintainingBalance'),
        recommendedGoals: [
            { 
                id: 'gratitude', 
                name: 'heart-outline', 
                text: t('goals.gratitude'), 
                points: 10,
                category: t('categories.gratitude'),
                duration: t('durations.5min')
            },
            { 
                id: 'exercise', 
                name: 'fitness-outline', 
                text: t('goals.exercise'), 
                points: 20,
                category: t('categories.fitness'),
                duration: t('durations.20min')
            },
            { 
                id: 'connect', 
                name: 'people-outline', 
                text: t('goals.connect'), 
                points: 15,
                category: t('categories.social'),
                duration: t('durations.varies')
            },
            { 
                id: 'learn', 
                name: 'book-outline', 
                text: t('goals.learn'), 
                points: 15,
                category: t('categories.growth'),
                duration: t('durations.30min')
            },
        ],
        color: '#E3F2FD',
        primaryColor: '#2196F3',
    },
    "General Wellness": {
        greeting: t('dashboard.greetings.generalWellness'),
        todaysFocus: t('dashboard.focus.generalWellness'),
        recommendedGoals: [
            { 
                id: 'water', 
                name: 'water-outline', 
                text: t('goals.water'), 
                points: 10,
                category: t('categories.health'),
                duration: t('durations.allDay')
            },
            { 
                id: 'sleep', 
                name: 'moon-outline', 
                text: t('goals.sleep'), 
                points: 15,
                category: t('categories.rest'),
                duration: t('durations.8hours')
            },
            { 
                id: 'mindful', 
                name: 'flower-outline', 
                text: t('goals.mindful'), 
                points: 15,
                category: t('categories.mindfulness'),
                duration: t('durations.10min')
            },
            { 
                id: 'move', 
                name: 'walk-outline', 
                text: t('goals.move'), 
                points: 10,
                category: t('categories.movement'),
                duration: t('durations.15min')
            },
        ],
        color: '#F1F8E9',
        primaryColor: '#8BC34A',
    },
});