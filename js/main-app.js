Vue.component('columns', {
    template: `
    <div class="columns">
        <div class="firstColumn">
            <h3>Запланированные задачи</h3>
            <button @click="showModal = true">+ создать карточку задачи</button>
            <modalWindow :show="showModal" @close="showModal = false" @add-card="addCardToFirstColumn"></modalWindow>
            <div v-for="card in columns.firstColumn" class="card">
                <h4>{{card.title}}</h4>
                <p>{{card.description}}</p>
                <p>Создано: {{card.creationDate}}</p>
                <p>Дэдлайн: {{card.deadline}}</p>
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
    </div>
    `,

    data() {
        return {
            columns: {
                firstColumn: [],
                secondColumn: [],
                thirdColumn: [],
                fourthColumn: []
            },

            showModal: false
        }
    },

    methods: {
        addCardToFirstColumn(card) {
            this.columns.firstColumn.push(card)
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



Vue.component('modalWindow', {
    props: ['show'],
    template: `
    <div v-if="show" class="modal">
        <div class="modalContent">
            <h3>Создание карточки задачи</h3>
            <input type="text" v-model="newCard.title" placeholder="Заголовок карточки"/>
            <textarea v-model="newCard.description" placeholder="Введите свою задачу"></textarea>
            <label>Дэдлайн: </label>
            <input type="date" v-model="newCard.deadline"/>
            <button @click="createCard">Создать</button>
            <button @click="$emit('close')">Закрыть</button>
        </div>
    </div>`,

    data() {
        return {
            newCard: {
                title: '',
                description: '',
                deadline: '',
                creationDate: new Date().toISOString().split('T')[0]
            }
        }
    },

    methods: {
        createCard() {
            this.$emit('add-card', {...this.newCard})
            this.newCard = {title: '', description: '', deadline: '', creationDate: new Date().toISOString().split('T')[0]}
            this.$emit('close')
        }
    }
})



let app = new Vue({
    el: '#app',
    data: {

    },

    methods: {

    },
})