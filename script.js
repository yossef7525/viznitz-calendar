const calendars = [
    {
        id: 'cDJqZmxocmdsbW9iNnBscTA3c2NzYTY3NTFudG0yM2JAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20',
        name: 'פרשיות וימי החודש בעברית',
        color: '#8b2635',
        priority: true
    },
    {
        id: '6fd2e63f344cfc7845e87530a18f93d3b0793af3e5853c2a682b2ce81244c915@group.calendar.google.com',
        name: 'שמחות ומעמדי בית ויזניץ',
        color: '#a0306e',
        priority: true
    },
    {
        id: '33ce0420590967d5d0405f47a995e78e7cee5614dd056d2c340dbf5e1faa7fd7@group.calendar.google.com',
        name: 'מעמדי קהילות הקודש',
        color: '#b91372',
        priority: true
    },
    {
        id: '35e0fe89f764f399f7cabe09ed52a6f07cfc13f2e41fac9d71c50206c59f9b95@group.calendar.google.com',
        name: 'חתונות',
        color: '#d4006a',
        priority: true
    },
    {
        id: '711d154168d0e430d031e7483f53fe1111e83254596db23c6202b1eeca8a4811@group.calendar.google.com',
        name: 'בר מצוות',
        color: '#6d1e2a',
        priority: true
    }
];

// התחל עם היומנים העיקריים נבחרים
let selectedCalendars = calendars.filter(cal => cal.priority).map(cal => cal.id);

function toggleSidebar() {
    const grid = document.querySelector('.grid');
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    
    if (grid.classList.contains('fullscreen')) {
        // חזרה למצב רגיל
        grid.classList.remove('fullscreen');
        toggleBtn.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 12h18m-9-9v18"></path>
            </svg>
        `;
    } else {
        // מעבר למסך מלא
        grid.classList.add('fullscreen');
        toggleBtn.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="12" x2="15" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
        `;
    }
}

function openAddEventModal() {
    const modal = document.getElementById('addEventModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeAddEventModal() {
    const modal = document.getElementById('addEventModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        calendar: 'hebrew'
    };
    document.getElementById('currentDate').textContent = 
        new Intl.DateTimeFormat('he-IL', options).format(now);
}

function toggleCalendar(calendarId) {
    const index = selectedCalendars.indexOf(calendarId);
    if (index > -1) {
        selectedCalendars.splice(index, 1);
    } else {
        selectedCalendars.push(calendarId);
    }
    render();
}

function buildCalendarUrl() {
    const baseUrl = 'https://calendar.google.com/calendar/embed?showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&mode=month&showTz=1&wkst=1&bgcolor=%23ffffff&';
    const params = [];
    
    selectedCalendars.forEach(calId => {
        const calendar = calendars.find(c => c.id === calId);
        params.push(`src=${encodeURIComponent(calId)}`);
        params.push(`color=${encodeURIComponent(calendar.color)}`);
    });
    
    params.push('ctz=Asia/Jerusalem');
    params.push('hl=iw');
    params.push('mode=WEEK');
    
    return baseUrl + params.join('&');
}

function renderCalendarList(containerId, calendarList) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    calendarList.forEach(calendar => {
        const isSelected = selectedCalendars.includes(calendar.id);
        const item = document.createElement('button');
        item.className = `calendar-item ${isSelected ? 'selected' : ''}`;
        item.onclick = () => toggleCalendar(calendar.id);
        
        item.innerHTML = `
            <div class="calendar-color" style="background-color: ${calendar.color}">
                <svg class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <span class="calendar-name">${calendar.name}</span>
            <div class="calendar-toggle"></div>
        `;
        
        container.appendChild(item);
    });
}

function render() {
    renderCalendarList('allCalendars', calendars);

    const calendarDisplay = document.getElementById('calendarDisplay');
    const statsNumber = document.getElementById('statsNumber');
    const statsText = document.getElementById('statsText');

    statsNumber.textContent = selectedCalendars.length;
    const totalText = selectedCalendars.length === 1 ? 'יומן מוצג' : 'יומנים מוצגים';
    statsText.textContent = `מתוך ${calendars.length} ${totalText}`;

    if (selectedCalendars.length > 0) {
        calendarDisplay.innerHTML = `
            <iframe 
                src="${buildCalendarUrl()}" 
                class="calendar-iframe"
                scrolling="no"
                onload="this.style.opacity='1'"
                style="opacity: 0; transition: opacity 0.3s ease;">
            </iframe>
        `;
    } else {
        calendarDisplay.innerHTML = `
            <div class="empty-state">
                <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <p class="empty-title">לא נבחרו יומנים להצגה</p>
                <p class="empty-subtitle">בחר לפחות יומן אחד מהרשימה כדי להתחיל</p>
            </div>
        `;
    }
}

// אתחול event listeners לאחר טעינת הדף
document.addEventListener('DOMContentLoaded', function() {
    // סגירה בלחיצה על הרקע
    const modal = document.getElementById('addEventModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAddEventModal();
            }
        });
    }
    
    // אתחול
    updateCurrentDate();
    render();
    
    // עדכון התאריך כל דקה
    setInterval(updateCurrentDate, 60000);
});

// סגירה בלחיצה על ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAddEventModal();
    }
});