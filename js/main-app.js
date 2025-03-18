Vue.component('columns', {
    template: `
    <div class="columns">
        <div class="firstColumn" @dragover.prevent @drop="onDrop('firstColumn')">
            <h3>Запланированные задачи</h3>
            <button @click="showCreateModal()">+ создать карточку задачи</button>
            <div v-for="(card, index) in columns.firstColumn" :key="index" class="card" draggable="true" @dragstart="onDragStart('firstColumn', index)">
                <h4>{{card.title}}</h4>
                <p>{{card.description}}</p>
                <p>Создано: {{card.creationDate}}</p>
                <p>Дэдлайн: {{card.deadline}}</p>
                <p v-if="card.lastEdited">Последнее редактирование: {{card.lastEdited}}</p>
                <button @click="showEditModal(card)">Редактировать</button>
                <button @click="deleteCard(index)">Удалить</button>
            </div>
        </div>

        <div class="secondColumn" @dragover.prevent @drop="onDrop('secondColumn')">
            <h3>Задачи в работе</h3>
            <div v-for="(card, index) in columns.secondColumn" :key="index" class="card" draggable="true" @dragstart="onDragStart('secondColumn', index)">
                <h4>{{card.title}}</h4>
                <p>{{card.description}}</p>
                <p>Создано: {{card.creationDate}}</p>
                <p>Дэдлайн: {{card.deadline}}</p>
                <p v-if="card.lastEdited">Последнее редактирование: {{card.lastEdited}}</p>
                <p v-if="card.reason">Причина возврата: {{card.reason}}</p>
                <button @click="showEditModal(card)">Редактировать</button>
            </div>
        </div>

        <div class="thirdColumn" @dragover.prevent @drop="onDrop('thirdColumn')">
            <h3>Тестирование</h3>
            <div v-for="(card, index) in columns.thirdColumn" :key="index" class="card" draggable="true" @dragstart="onDragStart('thirdColumn', index)">
                <h4>{{card.title}}</h4>
                <p>{{card.description}}</p>
                <p>Создано: {{card.creationDate}}</p>
                <p>Дэдлайн: {{card.deadline}}</p>
                <p v-if="card.lastEdited">Последнее редактирование: {{card.lastEdited}}</p>
                <button @click="showEditModal(card)">Редактировать</button>
            </div>
        </div>

        <div class="fourthColumn" @dragover.prevent @drop="onDrop('fourthColumn')">
            <h3>Выполненные задачи</h3>
            <div v-for="(card, index) in columns.fourthColumn" :key="index" class="card" draggable="true" @dragstart="onDragStart('fourthColumn', index)">
                <h4>{{card.title}}</h4>
                <p>{{card.description}}</p>
                <p>Создано: {{card.creationDate}}</p>
                <p>Дэдлайн: {{card.deadline}}</p>
                <p v-if="card.lastEdited">Последнее редактирование: {{card.lastEdited}}</p>
                <button @click="showEditModal(card)">Редактировать</button>
            </div>
        </div>
        
        <modalWindow :show="showModal" :card="currentCard" @close="closeModal" @submit="handleCardSubmit"></modalWindow>
        
        <returnModalWindow :show="showReturnModal" :card="returnReasonCard" @submit="handleReturnCard" @close="closeReturnModal"></returnModalWindow>
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

            showModal: false,

            currentCard: null,

            draggedCard: null,

            returnReasonCard: null,

            showReturnModal: false
        }
    },

    methods: {
        onDragStart(column, index) {
            this.draggedCard = {
                column,
                index,
                card: this.columns[column][index],
            }
        },

        onDrop(targetColumn) {
          if (!this.draggedCard || !this.columns[this.draggedCard.column]) return
          const removedCard = this.columns[this.draggedCard.column].splice(this.draggedCard.index, 1)[0]

          if (this.draggedCard.column === 'thirdColumn' && targetColumn === 'secondColumn') {
              this.returnReasonCard = removedCard
              this.showReturnModal = true
          } else {
              this.columns[targetColumn].push(removedCard)
              this.saveData()
          }

          this.draggedCard = null
        },

        showCreateModal() {
            this.currentCard = null
            this.showModal = true
        },

        showEditModal(card) {
            this.currentCard = card
            this.showModal = true
        },

        handleCardSubmit(card) {
            if (this.currentCard) {
                Object.assign(this.currentCard, card)
            } else {
                this.columns.firstColumn.push(card)
            }
            this.saveData()
        },

        deleteCard(index) {
            this.columns.firstColumn = this.columns.firstColumn.filter((_, i) => i !== index)
            this.saveData()
        },

        closeModal() {
            this.showModal = false
        },

        handleReturnCard(card) {
          this.columns.secondColumn.push(card)
          this.returnReasonCard = null
          this.saveData()
        },

        closeReturnModal() {
            this.showReturnModal = false
            this.returnReasonCard = null
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



Vue.component('returnModalWindow', {
  props: ['show', 'card'],
  template: `
    <div v-if="show" class="modal">
        <div class="modalContent">
            <h3>Укажите причину возврата</h3>
            <textarea v-model="returnReason" placeholder="Введите причину"></textarea>
            <p v-if="errorMessage" class="error">{{errorMessage}}</p>
            <button @click="submitReturnReason">Сохранить причину</button>
            <button @click="$emit('close')">Закрыть</button>
        </div>    
    </div>`,

  data() {
      return {
          returnReason: '',
          errorMessage: ''
      }
  },

  methods: {
      submitReturnReason() {
          if(!this.returnReason.trim()) {
              this.errorMessage = 'Пожалуйста, укажите приину возврата'
              return
          }

          this.card.reason = this.returnReason
          this.$emit('submit', this.card)
          this.$emit('close')
          this.errorMessage = ''
      }
  }
})



Vue.component('modalWindow', {
    props: ['show', 'card'],
    template: `
    <div v-if="show" class="modal">
        <div class="modalContent">
            <h3>{{card ? 'Редактировать карточку' : 'Создать карточку'}}</h3>
            <input type="text" v-model="localCard.title" placeholder="Заголовок карточки"/>
            <textarea v-model="localCard.description" placeholder="Введите свою задачу"></textarea>
            <label>Дэдлайн: </label>
            <input type="date" v-model="localCard.deadline"/>
            <button @click="submitCard">{{card ? 'Сохранить изменения' : 'Создать'}}</button>
            <button @click="$emit('close')">Закрыть</button>
        </div>
    </div>`,

    data() {
        return {
            localCard: {
                title: '',
                description: '',
                deadline: '',
                creationDate: '',
                lastEdited: ''
            }
        }
    },

    watch: {
        card: {
            immediate: true,
            handler(newCard) {
                if (newCard) {
                    this.localCard = {
                        title: newCard.title,
                        description: newCard.description,
                        deadline: newCard.deadline,
                        creationDate: newCard.creationDate,
                        lastEdited: newCard.lastEdited,
                    }
                } else {
                    this.localCard = {
                        title: '',
                        description: '',
                        deadline: '',
                        creationDate: new Date().toISOString().split('T')[0],
                        lastEdited: ''
                    }
                }
            }
        }
    },

    methods: {
        submitCard() {
            if (this.card) {
                this.localCard.lastEdited = new Date().toISOString().split('T')[0]
            }
            this.$emit('submit', {...this.localCard})
            this.$emit('close')
        }
    }
})



let app = new Vue({
    el: '#app'
})