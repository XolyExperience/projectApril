function setCalendar(today) {
    let weekdayBox = document.getElementById('weekdayBox');
    let weekdays = weekdayBox.querySelectorAll('.weekday');

    // hämtar dag i veckan
    let dayOfWeek = today.getDay();

    // om söndag => sätt till dag nummer 7
    if (dayOfWeek === 0) {
        dayOfWeek = 7;
    }

    let monday = new Date();
    if (dayOfWeek != 1) {
        // tar bort 24h för varje dag i veckan som gått
        monday.setHours(-24 * (dayOfWeek - 1));
    }

    let currentDay = new Date(monday);
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

    // dynamiskt sätta veckonummer
    let weekNumber = document.getElementById('week');
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    weekNumber.innerHTML = `v.${Math.floor(
        (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
    )}`;
}

let today = new Date();
setCalendar(today);

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

function myEventListener() {
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
            unHider('updater');
        });
    }
    var eventBtn = document.getElementById('event');
    eventBtn.addEventListener('click', (e) => {
        unHider('planner');
    });
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
            events.forEach((obj) => {
                obj.place();
            });
        });
    myEventListener();
}
fetchPosts();

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

function unHider(elementId) {
    var element = document.getElementById(`${elementId}`);
    element.classList.remove('hidden');
}
function hider(elementId) {
    var element = document.getElementById(elementId);
    element.classList.add('hidden');
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
        .then(function (data) {
            setCalendar(today);
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
            setCalendar(today);
        })
        .catch(function (error) {
            console.warn(error);
        });
});

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
