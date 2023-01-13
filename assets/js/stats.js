const { createApp } = Vue
createApp({
    data() {
        return {
            events: [],
            calculatedEvents: {},
            pastEvents: [],
            upcomingEvents: [],
            printPastEvents: [],
            printUpcomingEvents: [],
        }
    },
    created() {
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
            .then(res => res.json())
            .then(data => {
                this.events = [...data.events];
                for (let event of this.events) {
                    event.aux = 1;
                    event.attendance = Math.round(Number(event[event.date < data.currentDate ? 'assistance' : 'estimate'] / (event.capacity / 100)));
                    event.revenue = Number(event.price * event[event.date < data.currentDate ? 'assistance' : 'estimate']);
                }
                this.pastEvents = this.events.filter(event => event.date < data.currentDate).sort();//filtrar pasadas
                this.upcomingEvents = this.events.filter(event => event.date > data.currentDate).sort();//filtrar futuras
                this.firstStats();
                this.printPastEvents = this.reduceEvents(this.pastEvents);
                this.printUpcomingEvents = this.reduceEvents(this.upcomingEvents);
            })
            .catch((err) => console.log(err));
    },
    methods: {
        reduceEvents: function (arr) {
            let reducedEvent = {};
            for (let event of arr) {
                if (!Object.hasOwn(reducedEvent, event.category)) {
                    reducedEvent[event.category] = { ...event };
                }
                else {
                    reducedEvent[event.category].attendance += event.attendance;
                    reducedEvent[event.category].revenue += event.revenue;
                    reducedEvent[event.category].aux++;
                }
            };
            reducedEvent = Object.values(reducedEvent);
            reducedEvent.forEach(event => {
                event.attendance /= event.aux;
            })
            return reducedEvent;
        },
        firstStats: function () {
            this.events.sort((max, min) => max.attendance - min.attendance);
            this.pastEvents.sort((max, min) => max.attendance - min.attendance);
            this.calculatedEvents.maxAttendance = `${this.pastEvents[this.pastEvents.length - 1].name} : ${this.pastEvents[this.pastEvents.length - 1].attendance} %`;
            this.calculatedEvents.minAttendance = `${this.pastEvents[0].name} : ${this.pastEvents[0].attendance} %`;
            this.calculatedEvents.maxCapacity = `${this.events.sort((min, max) => max.capacity - min.capacity)[0].name} : ${this.events.sort((min, max) => max.capacity - min.capacity)[0].capacity} people`;
        },
    },

}).mount('#vueApp')