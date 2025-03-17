Vue.component('columns', {
    template: `
    <div class="columns">
        <column title="Запланированные задачи" :cards="columns.firstColumn"></column>
        <column title="Задачи в работе" :cards="columns.secondColumn"></column>
        <column title="Тестирование" :cards="columns.thirdColumn"></column>
        <column title="Выполненные задачи" :cards="columns.fourthColumn"></column>
    </div>`,

    data() {
        return {
            columns: {
                firstColumn: [],
                secondColumn: [],
                thirdColumn: [],
                fourthColumn: []
            },

            newCard: {

            },
        }
    },

    methods: {
        addCard() {
                this.saveData()
        },

        moveCard() {
            this.saveData()
        },

        saveData() {
            const data = {
                columns: this.columns,
            }
            localStorage.setItem('notesAppData', JSON.stringify(data))
        },

        loadData() {
            const savedData = localStorage.getItem('notesAppData')
            if (savedData) {
                const parsedData = JSON.parse(savedData)
                this.columns = parsedData.columns
            }
        }
    },

    created() {
        this.loadData()
    }
})



Vue.component('column', {
    props: ['title', 'cards'],
    template: `
    <div class="column">
        <h3>{{title}}</h3>
        <div v-for="card in cards" class="card">
             <h4>{{card.title}}</h4>
             <p>{{card.items}}</p>
        </div>
    </div>
`,
})



let app = new Vue({
    el: '#app',
    data: {

    },

    methods: {

    },
})