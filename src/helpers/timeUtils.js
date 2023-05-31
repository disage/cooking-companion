import { useState, useEffect } from 'react';

const useTime = () => {
    const [currentTime, setCurrentTime] = useState('');
    const [mealTime, setMealTime] = useState('');

    useEffect(() => {
        setTime(setCurrentTime, setMealTime)
        const intervalId = setInterval(() => {
            setTime()
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const setTime = () => {
        const date = new Date();
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setCurrentTime(timeString);
        const currentHour = date.getHours();
        if (currentHour > 12 && currentHour < 17) {
            setMealTime('LUNCH');
        } else if ((currentHour >= 17 && currentHour < 24) || (currentHour >= 0 && currentHour < 3)) {
            setMealTime('DINNER');
        } else {
            setMealTime('BREAKFAST');
        }
    }

    return { currentTime, mealTime };
};

export default useTime;
