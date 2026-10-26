const dialog = document.querySelector('.portal-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogEyebrow = document.querySelector('#dialog-eyebrow');
const dialogContent = document.querySelector('.dialog-content');
const toast = document.querySelector('.toast');
const student = {
  name: 'Carl Miguel L. Daniel',
  initials: 'CMD',
  year: '2nd Year',
  program: 'Associate in Computer Technology',
  school: 'Datamex College of Saint Adeline',
};

const majorSubjects = [
  'Information Management 1',
  'Programming 2',
  'Data Structure & Algorithm',
  'Integrative Programming Technology',
];

const subjects = [
  ...majorSubjects.map((name) => ({ name, group: 'Major', teacher: 'Sir Rex John Barinas', mark: 'M', style: 'english-mark' })),
  { name: 'Science, Technology & Society', group: 'Minor', teacher: 'Sir Justin Bañez', mark: 'S', style: 'biology-mark' },
  { name: 'P.E 3', group: 'Minor', teacher: 'Sir Jerome Deguzman', mark: 'P', style: 'math-mark' },
  { name: 'Rizal, Life Works & Writing', group: 'Minor', teacher: '', mark: 'R', style: 'art-mark' },
];

const schedules = {
  thursday: [
    { time: '7:00', period: 'AM', title: 'Major subjects', detail: 'Until 10:00 AM · Information Management 1 · Programming 2 · Data Structure & Algorithm · Integrative Programming Technology', teacher: 'Sir Rex John Barinas', icon: 'M', style: 'subject-english' },
    { time: '10:00', period: 'AM', title: 'P.E 3', detail: 'Ends at 1:30 PM', teacher: 'Sir Jerome Deguzman', icon: 'P', style: 'subject-math' },
    { time: '1:30', period: 'PM', title: 'Free time', detail: 'Until 4:30 PM', teacher: '', icon: '·', style: 'subject-art' },
    { time: '4:30', period: 'PM', title: 'Rizal, Life Works & Writing', detail: 'Until 7:00 PM', teacher: '', icon: 'R', style: 'subject-biology' },
  ],
  saturday: [
    { time: '7:00', period: 'AM', title: 'Major subjects', detail: 'Information Management 1 · Programming 2 · Data Structure & Algorithm · Integrative Programming Technology', teacher: 'Sir Rex John Barinas · Until 4:30 PM', icon: 'M', style: 'subject-english' },
    { time: '4:30', period: 'PM', title: 'Science, Technology & Society', detail: 'Until 7:30 PM', teacher: 'Sir Justin Bañez', icon: 'S', style: 'subject-biology' },
  ],
};

let toastTimeout;
let notificationsRead = readSetting('datamex-notifications-read', 'false') === 'true';

const views = {
  classes: {
    eyebrow: '2ND YEAR · ASSOCIATE IN COMPUTER TECHNOLOGY',
    title: 'My subjects',
    content: `<ul class="portal-list">${subjects.map((subject) => `
      <li><span class="assignment-subject ${subject.style}">${subject.mark}</span><span><strong>${subject.name}</strong><small>${subject.group}${subject.teacher ? ` · ${subject.teacher}` : ''}</small></span></li>
    `).join('')}</ul><p class="demo-note">${student.school}</p>`,
  },
  grades: {
    eyebrow: 'ACADEMIC RECORD',
    title: 'Grades',
    content: '<p class="dialog-copy">Your grades have not been added to this portal yet.</p><p class="demo-note">Ask your instructors or school office for your official grades.</p>',
  },
  assignments: {
    eyebrow: 'COURSEWORK',
    title: 'Assignments',
    content: '<p class="dialog-copy">No assignment details have been added to this portal yet.</p><p class="demo-note">Check with your instructors for current coursework and due dates.</p>',
  },
  messages: {
    eyebrow: 'INBOX',
    title: 'Messages',
    content: '<p class="dialog-copy">There are no messages in this portal preview.</p><p class="demo-note">Contact your instructors through your school’s usual communication channel.</p>',
  },
  support: {
    eyebrow: 'STUDENT INFORMATION',
    title: 'Datamex College of Saint Adeline',
    content: `<p class="dialog-copy">You are studying ${student.program} as a ${student.year} student.</p><p class="demo-note">For school assistance, contact your college office directly.</p>`,
  },
  profile: {
    eyebrow: 'STUDENT PROFILE',
    title: student.name,
    content: `<div class="profile-detail"><div class="avatar profile-avatar">${student.initials}</div><div><strong>${student.year} · ACT</strong><span>${student.program}</span><span>${student.school}</span></div></div>`,
  },
  notifications: {
    eyebrow: 'SCHEDULE REMINDERS',
    title: 'Notifications',
    content: `<div class="notification-item"><span class="notification-bullet"></span><div><strong>Thursday classes</strong><small>Major subjects, P.E 3, free time, and Rizal · 7:00 AM–7:00 PM</small></div></div>
      <div class="notification-item"><span class="notification-bullet peach-bullet"></span><div><strong>Saturday classes</strong><small>Major subjects and Science, Technology &amp; Society · 7:00 AM–7:30 PM</small></div></div>
      <button class="dialog-action" type="button" data-action="mark-notifications">${notificationsRead ? 'All caught up' : 'Mark all as read'}</button>`,
  },
  'full-schedule': {
    eyebrow: 'WEEKLY TIMETABLE',
    title: 'Your full schedule',
    content: `<section class="full-day"><h3>Thursday · 7:00 AM–7:00 PM</h3>${scheduleListMarkup('thursday', true)}</section>
      <section class="full-day"><h3>Saturday · 7:00 AM–7:30 PM</h3>${scheduleListMarkup('saturday', true)}</section>
      <p class="demo-note">Thursday’s major-subject block is shown as 7:00–10:00 AM, based on the schedule details provided.</p>`,
  },
  announcement: {
    eyebrow: 'WEEKLY REMINDER',
    title: 'Thursday & Saturday classes',
    content: '<p class="dialog-copy">Thursday classes run from 7:00 AM to 7:00 PM. Saturday classes run from 7:00 AM to 7:30 PM.</p><p class="demo-note">Thursday’s major-subject block is shown as 7:00–10:00 AM, based on the schedule details provided.</p>',
  },
};

function readSetting(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (error) {
    console.error(`Unable to read ${key} from local storage.`, error);
    return fallback;
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Unable to save ${key} to local storage.`, error);
    showToast('Could not save this change in your browser.');
    return false;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('visible'), 2800);
}

function scheduleListMarkup(day, compact = false) {
  return `<div class="schedule-list${compact ? ' compact-schedule-list' : ''}">${schedules[day].map((item) => `
    <article class="class-row">
      <div class="class-time"><strong>${item.time}</strong><span>${item.period}</span></div>
      <div class="class-timeline"><span class="timeline-dot"></span></div>
      <div class="class-info"><h3>${item.title}</h3><p>${item.detail}${item.teacher ? ` <span>·</span> ${item.teacher}` : ''}</p></div>
      <span class="subject-icon ${item.style}">${item.icon}</span>
    </article>
  `).join('')}</div>`;
}

function renderSchedule(day) {
  document.querySelector('#schedule-list').innerHTML = scheduleListMarkup(day);
  document.querySelectorAll('[data-schedule-day]').forEach((button) => {
    const active = button.dataset.scheduleDay === day;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('.schedule-note p span').textContent = day === 'thursday'
    ? 'Thursday · 1:30 PM – 4:30 PM'
    : '7:00 AM – 7:30 PM';
  document.querySelector('.schedule-note p strong').textContent = day === 'thursday'
    ? 'Free time'
    : 'Class hours';
}

function openView(name) {
  const view = views[name];
  if (!view) {
    showToast('This section is not available in the portal preview.');
    return;
  }
  dialogEyebrow.textContent = view.eyebrow;
  dialogTitle.textContent = view.title;
  dialogContent.innerHTML = view.content;
  dialog.showModal();
  if (name === 'notifications') updateNotificationIndicator();
}

function updateNotificationIndicator() {
  document.querySelector('.notification-button i').hidden = notificationsRead;
  const action = dialogContent.querySelector('[data-action="mark-notifications"]');
  if (action) action.textContent = notificationsRead ? 'All caught up' : 'Mark all as read';
}

function renderSubjects() {
  document.querySelector('#subject-list').innerHTML = subjects.map((subject) => `
    <div class="assignment-item subject-item">
      <span class="assignment-subject ${subject.style}">${subject.mark}</span>
      <div class="assignment-info"><h3>${subject.name}</h3><p>${subject.teacher || subject.group}</p></div>
    </div>
  `).join('');
}

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const viewTrigger = target.closest('[data-view]');
  if (viewTrigger) {
    event.preventDefault();
    openView(viewTrigger.dataset.view);
    return;
  }

  const scheduleDay = target.closest('[data-schedule-day]');
  if (scheduleDay) {
    renderSchedule(scheduleDay.dataset.scheduleDay);
    return;
  }

  if (target.closest('.dialog-close')) {
    dialog.close();
    return;
  }

  if (target.closest('[data-action="mark-notifications"]')) {
    notificationsRead = true;
    if (saveSetting('datamex-notifications-read', 'true')) {
      updateNotificationIndicator();
      showToast('Notifications marked as read.');
    }
    return;
  }

  if (target === dialog) dialog.close();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && dialog.open) dialog.close();
});

renderSchedule('thursday');
renderSubjects();
updateNotificationIndicator();
