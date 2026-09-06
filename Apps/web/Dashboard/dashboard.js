function updateGreeting() {
    const hour = new Date().getHours();
    const greetingElement = document.querySelector('.dashboardHeader h2');
    let greeting = 'Good evening';
    if (hour >= 5 && hour < 12) greeting = 'Good morning';
    else if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
    greetingElement.textContent = `${greeting}, Sir`; 
}
updateGreeting();