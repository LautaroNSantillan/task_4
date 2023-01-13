const { createApp } = Vue
createApp({
    data() {
        return {
            data: [],
            everyEvent: [],
            pastEvents: [],
            upcomingEvents: [],
            eventsUsed: [],
            maxAttEvent: {},
            pastEventsRows:{},
            upcomingEventsRows:{},
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
            this.highestAttendance()
            this.pastEventsRows = this.createRowStats2(this.pastEvents)

            console.log(this.createRowStats2(this.pastEvents))
            
            //console.log(this.revAndAttPast())
           // console.log(this.revAndAttUpcoming())
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

        assistanceOrEstimate(e) {
            let show = e.assistance ? `Assistance: ${e.assistance}` : `Estimate: ${e.estimate}`
            return show
        },

        highestAttendance() {
            const pastEventArr = this.pastEvents.map(({ name, capacity, assistance }) => ({ name, capacity, assistance }))
            pastEventArr.forEach((e) => {
                e.attendance = e.assistance * 100 / e.capacity
            })
            const eventAttendance = pastEventArr.map(e => e.attendance)
            const maxAttendance = Math.max(...eventAttendance)
            const objMaxAtt = pastEventArr.find(e => e.attendance === maxAttendance)
            this.maxAttEvent = objMaxAtt
            return this.maxAttEvent.name + "" + " Attendance: " + Math.round(this.maxAttEvent.attendance) + "%"
        },
        lowestAttendance() {
            const pastEventArr = this.pastEvents.map(({ name, capacity, assistance }) => ({ name, capacity, assistance }))
            pastEventArr.forEach((e) => {
                e.attendance = e.assistance * 100 / e.capacity
            })
            const eventAttendance = pastEventArr.map(e => e.attendance)
            const minAttendance = Math.min(...eventAttendance)
            const objMinAtt = pastEventArr.find(e => e.attendance === minAttendance)
            return objMinAtt.name + "" + " Attendance: " + Math.round(objMinAtt.attendance) + "%"
        },

        largestCap() {
            const eventArr = this.data.events.map(({ name, capacity }) => ({ name, capacity }))
            const eventCapacity = eventArr.map(e => e.capacity)
            const maxCapacity = Math.max(...eventCapacity)
            const objMaxCap = eventArr.find(e => e.capacity === maxCapacity)
            return objMaxCap.name + " " + "Capacity: " + objMaxCap.capacity
        },


        createRowStats2(eventArr) {
            let usedArr = [];
            if (eventArr[0].estimate) {
                usedArr = eventArr.map(({ name, capacity, estimate, price, category }) => ({ name, capacity, estimate, price, category }))
                usedArr.forEach((e) => {
                    e.revenue = e.price * e.estimate;
                    e.attendance = e.estimate * 100 / e.capacity;
                    return usedArr
                })
            } else {
                usedArr = eventArr.map(({ name, capacity, assistance, price, category }) => ({ name, capacity, assistance, price, category }))
                usedArr.forEach((e) => {
                    e.revenue = e.price * e.assistance;
                    e.attendance = e.assistance * 100 / e.capacity;
                    return usedArr
                })
            }
    
            const objFromArr = usedArr.reduce((acc, cv) => {
                let category = cv.category
                if (acc[category] == null) {
                    acc[category] = []
                    acc[category].push(cv)
                    acc[category].counter = 1
                }
                else if (cv.category === acc[category][0].category) {
                    acc[category][0].attendance += cv.attendance
                    acc[category][0].revenue += cv.revenue
                    acc[category].counter += 1
                }
                return acc
            }, [])

            const singleArr = objFromArr.reduce((acc,cv)=>{
                acc=[]
                acc.push(cv)
            },[])
            return singleArr
           
            
            }
            
        },












        /*   revAndAttPast(){
              let nArr=[]
            let nnArr=[]
            nArr= this.pastEvents.forEach((e) => {
                    e.revenue = e.price * e.estimate;
                    e.attendance = e.estimate * 100 / e.capacity;
                 nnArr = nArr.map(({ name, capacity, estimate, price, category }) => ({ name, capacity, estimate, price, category }))
                    
                    return nArr
                })
            }, 

            revAndAttUpcoming (){
                let xArr=[]
               let xxArr=[]
                 xArr= this.pastEvents.forEach((e) => {
                     e.revenue = e.price * e.assistance;
                    e.attendance = e.assistance * 100 / e.capacity;
                     xxArr = xArr.map(({ name, capacity, assistance, price, category }) => ({ name, capacity, assistance, price, category })) 
                   
                    return xArr
                })
            },  
        

         objFromArr (arr) {arr.reduce((acc, cv) => {
            let category = cv.category
            if (acc[category] == null) {
                acc[category] = []
                acc[category].push(cv)
                acc[category].counter = 1
            }
            else if (cv.category === acc[category][0].category) {
                acc[category][0].attendance += cv.attendance
                acc[category][0].revenue += cv.revenue
                acc[category].counter += 1
            }
            return acc
        }, {}) },

    },*/

}).mount('#vueApp')