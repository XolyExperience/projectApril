var idag = new Date();
var veckaMånad = 'week';
setCalendar(veckaMånad, idag);

function setCalendar(view, today) {
    clearCalendar();

    // hämtar dag i veckan
    let dayOfWeek = today.getDay();

    // om söndag => sätt till dag nummer 7
    if (dayOfWeek === 0) {
        dayOfWeek = 7;
    }

    let monday = new Date(today);
    if (dayOfWeek != 1) {
        // tar bort 24h för varje dag i veckan som gått
        monday.setHours(-24 * (dayOfWeek - 1));
    }

    // dynamiskt sätta år
    let yearNumber = document.getElementById('year');
    const year = today.getFullYear();
    yearNumber.innerHTML = year;

    // dynamiskt sätta månad
    let monthNumber = document.getElementById('month');
    const month = today.getMonth();
    const monthNames = [
        'Januari',
        'Februari',
        'Mars',
        'April',
        'Maj',
        'Juni',
        'Juli',
        'Augusti',
        'September',
        'Oktober',
        'November',
        'December',
    ];
    monthNumber.innerHTML = monthNames[month];

    if (view === 'week') {
        // dynamiskt sätta veckonummer
        let ref = document.getElementById('next');
        let newEl = document.createElement('div');
        newEl.id = 'week';
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
        newEl.innerHTML = `v.${Math.floor(
            (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
        )}`;
        ref.parentNode.insertBefore(newEl, ref);
        drawWeeks(1);
    }
    if (view === 'month') {
        drawWeeks(4);
    }

    let currentDay = new Date(monday);
    let weekdayBox = document.getElementById('weekdayBox');
    let weekdays = weekdayBox.querySelectorAll('.weekday');
    weekdays.forEach((obj) => {
        obj.dataset.date = currentDay.toLocaleDateString();
        // lägg till datum i h1 taggen
        let datum = obj.lastElementChild;
        const datums = currentDay.getDate();
        datum.innerHTML = datums;
        // dynamiskt sätta classen today
        if (today.getDate() === currentDay.getDate()) {
            obj.id = 'today';
        }
        currentDay.setHours(24);
    });

    myEventListeners();
    fetchPosts();
}

function drawWeeks(numbOfWeeks) {
    let j = numbOfWeeks * 7;
    let i = 0;
    while (i < j) {
        drawday();
        i++;
    }
}
function drawday() {
    let parent = document.getElementById('weekdayBox');
    let newDiv = document.createElement('div');
    newDiv.classList.add('weekday');
    newDiv.innerHTML = '<h1></h1>';
    parent.appendChild(newDiv);
}

class Event {
    constructor(id, title, date, starttime, endtime, description, location) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.starttime = starttime;
        this.endtime = endtime;
        this.description = description;
        this.location = location;
    }
    printFormat() {
        return `<h3>${this.title}</h3>
                <p class='hidden'>${this.date}</p>\n
                <p>${this.starttime}</p>\n
                <p>${this.endtime}</p>\n
                <p class='hidden'>${this.description}</p>\n
                <p class='hidden'>${this.location}</p>`;
    }
    place() {
        let newDiv = document.createElement('div');
        newDiv.classList.add('event');
        newDiv.dataset.id = this.id;
        newDiv.innerHTML = this.printFormat();
        let weekdayDivs = document.querySelectorAll(
            "[data-date='" + this.date + "']"
        );
        if (weekdayDivs[0]) {
            //placerbart event! tjoho!
            weekdayDivs[0].appendChild(newDiv);
        }
    }
}

async function fetchPosts() {
    let events = [];
    const responseFromAPI = await fetch('http://localhost:3000/posts')
        .then((response) => response.json())
        .then((objs) => {
            objs.forEach((obj) => {
                events.push(
                    new Event(
                        obj._id,
                        obj.title,
                        obj.date,
                        obj.starttime,
                        obj.endtime,
                        obj.description,
                        obj.location
                    )
                );
            });
            let sortedEvents = events.sort(function (a, b) {
                var c = new Date(a.date),
                    d = new Date(b.date);
                var e = new Date(a.starttime),
                    f = new Date(b.starttime);
                console.log(e);
                return c - d || e - f;
            });
            sortedEvents.forEach((obj) => {
                obj.place();
            });
        });

    myEventListenerEvent();
}

var serializeForm = function (form) {
    var obj = {};
    var formData = new FormData(form);
    for (var key of formData.keys()) {
        obj[key] = formData.get(key);
    }
    return obj;
};

function clearform() {
    var formBox = document.getElementById('planner');
    var updateBox = document.getElementById('updater');

    if (!formBox.classList.contains('hidden')) {
        formBox.classList.add('hidden');
    }
    if (!updateBox.classList.contains('hidden')) {
        updateBox.classList.add('hidden');
    }
}

function hider(elementId) {
    var element = document.getElementById(elementId);
    element.classList.toggle('hidden');
}

function clearForm(oForm, eventBox) {
    hider(`${eventBox}`);
    var elements = oForm.elements;

    oForm.reset();

    for (i = 0; i < elements.length; i++) {
        field_type = elements[i].type.toLowerCase();

        switch (field_type) {
            case 'text':
            case 'password':
            case 'textarea':
            case 'hidden':
                elements[i].value = '';
                break;

            case 'radio':
            case 'checkbox':
                if (elements[i].checked) {
                    elements[i].checked = false;
                }
                break;

            case 'select-one':
            case 'select-multi':
                elements[i].selectedIndex = -1;
                break;

            default:
                break;
        }
    }
}
function deletePost() {
    let postToDelete = document.getElementById('updater').dataset.targetId;
    fetch(`http://localhost:3000/posts/${postToDelete}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        })
        .then(function (data) {
            console.log(data);
            clearform();
            setCalendar(veckaMånad, idag);
        })
        .catch(function (error) {
            console.warn(error);
        });
}

function clearCalendar() {
    document.querySelectorAll('.event').forEach((e) => e.remove());

    if (document.getElementById('week')) {
        var week = document.getElementById('week');
        week.remove();
    }
    if (document.getElementsByClassName('weekday').length) {
        var days = document.getElementsByClassName('weekday');
        for (var i = 0; i < days.length; i) {
            days[i].remove();
        }
    }
}

document.getElementById('planner').addEventListener('submit', function (event) {
    event.preventDefault();

    fetch('http://localhost:3000/posts', {
        method: 'POST',
        body: JSON.stringify(serializeForm(event.target)),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        })
        .then(function () {
            setCalendar(veckaMånad, idag);
            clearform();
        })
        .catch(function (error) {
            console.warn(error);
        });
});

document.getElementById('updater').addEventListener('submit', function (event) {
    event.preventDefault();

    let postToUpdate = document.getElementById('updater').dataset.targetId;
    fetch(`http://localhost:3000/posts/${postToUpdate}`, {
        method: 'PATCH',
        body: JSON.stringify(serializeForm(event.target)),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        })
        .then(function (data) {
            console.log(data);
            clearform();
            setCalendar(veckaMånad, idag);
        })
        .catch(function (error) {
            console.warn(error);
        });
});

function myEventListenerView() {
    var viewBtn = document.getElementById('view');
    viewBtn.addEventListener('click', (e) => {
        if (view === 'week') {
            view = 'month';
            setCalendar(view, today);
            console.log('switch to month');
        } else {
            view = 'week';
            setCalendar(view, today);
            console.log('switch to week');
        }
    });
}
function myEventListenerAddEvent() {
    var eventBtn = document.getElementById('event');
    eventBtn.addEventListener('click', (e) => {
        hider('planner');
    });
}
function myEventListenerEvent() {
    var events = document.querySelectorAll('.event');
    var i;
    for (i = 0; i < events.length; i++) {
        events[i].addEventListener('click', (e) => {
            var targetId = e.target.dataset.id;
            document.getElementById('updater').dataset.targetId = targetId;
            var fields = document
                .getElementById('updateForm')
                .querySelectorAll('*[type="text"]');
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                let eventValue = e.target.children[i].innerHTML;
                field.value = eventValue;
            }
            hider('updater');
        });
    }
}

function myEventListeners() {
    myEventListenerView();
    myEventListenerAddEvent();
}
