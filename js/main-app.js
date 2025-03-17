Vue.component('columns', {
    template: `
    <div class="columns">
        <div class="firstColumn">
            <h3>Запланированные задачи</h3>
            <div class="addCard">
                <h3>Добавление карточки задачи</h3>
                <input type="text" v-model="newCard.title" placeholder="Заголовок карточки"/>
                <textarea v-model="newCard.items" placeholder="Введите свою задачу"></textarea>
                <label>Когда задача должна быть выполнена?: </label>
                <input type="date"/>
                <button @click="addCard">Добавить карточку</button>
            </div>
        </div>

        <div class="secondColumn">
            <h3>Задачи в работе</h3>
        </div>

        <div class="thirdColumn">
            <h3>Тестирование</h3>
        </div>

        <div class="fourthColumn">
            <h3>Выполненные задачи</h3>
        </div>
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



let app = new Vue({
    el: '#app',
    data: {

    },

    methods: {

    },
})