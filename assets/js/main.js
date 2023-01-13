const { createApp } = Vue
createApp({
    data() {
        return {
            data: [],
            everyEvent: [],
            pastEvents: [],
            upcomingEvents: [],
            eventsUsed: [],
            categories: [],
            textInput: "",
            checked: [],
            foundEvents: [],
            detailsEvent: [],

        }
    },
    created() {

    },
    mounted() {
        this.loadContent()

    },
    methods: {

        getDataFromAPI: async function () {
            const response = await fetch('https://mindhub-xj03.onrender.com/api/amazing')
            const dataAE = await response.json()
            this.data = dataAE
            this.everyEvent = [...this.data.events]
            this.categories = Array.from(new Set(this.everyEvent.map(e => e.category)))

        },

        loadContent: async function () {
            await this.getDataFromAPI()
            this.filterEventsByDate(this.data)
            this.cardsArrByPage()
            let urlParam = location.search//str
            let params = new URLSearchParams(urlParam)//obj
            let id = params.get("id")
            this.detailsEvent = this.data.events.find(e => e._id == id)


        },

        filterEventsByDate(arr) {
            for (let event of arr.events) {
                if (event.date <= arr.currentDate) {
                    this.pastEvents.push(event)
                } else {
                    this.upcomingEvents.push(event)
                }
            }
        },

        cardsArrByPage() {
            if (document.location.pathname == "/index.html") {
                this.eventsUsed = this.everyEvent
            } else if (document.location.pathname == "/past_events.html") {
                this.eventsUsed = this.pastEvents
            } else if (document.location.pathname == "/upcoming_events.html") {
                this.eventsUsed = this.upcomingEvents
            } return this.eventsUsed
        },

        crossFilter() {
            let searchFilter = this.cardsArrByPage().filter(e => e.name.toLowerCase().includes(this.textInput.toLowerCase()))
            if (this.checked.length === 0) {
                this.eventsUsed = searchFilter
            } else {
                let crossCheck = searchFilter.filter(e => this.checked.includes(e.category))
                this.eventsUsed = crossCheck
            }
        },

        assistanceOrEstimate(e) {
            let show = e.assistance ? `Assistance: ${e.assistance}` : `Estimate: ${e.estimate}`
            return show
        }

    },

}).mount('#vueApp')