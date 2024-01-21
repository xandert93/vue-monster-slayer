function genRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

const initialState = {
  playerHealth: 100,
  monsterHealth: 100,
  roundCount: 0,
  messages: [],
  winner: '',
}

const app = Vue.createApp({
  data: () => initialState,

  watch: {
    playerHealth(newHealth) {
      if (newHealth > 0) return

      this.winner = this.monsterHealth <= 0 ? 'draw' : 'monster'
    },
    monsterHealth(newHealth) {
      if (newHealth > 0) return

      this.winner = this.playerHealth <= 0 ? 'draw' : 'player'
    },

    // can't do `this.checkForWinner` here... => undefined...
    playerHealth: 'checkForWinner',
    monsterHealth: 'checkForWinner',
  },

  computed: {
    isHealthy() {
      // this === window with arrow func...review `this`
      return this.playerHealth === 100
    },
    canSpecialAttack() {
      return this.roundCount % 3 !== 0
    },
  },

  methods: {
    getHealthBarStyles: (health) => ({ width: health < 0 ? '0%' : health + '%' }),

    attackMonster() {
      this.roundCount++
      const damage = genRandomNum(5, 12)
      this.monsterHealth -= damage
      this.addMessage('player', 'attack', damage)
      this.attackPlayer()
    },

    specialAttackMonster() {
      this.roundCount++
      const damage = genRandomNum(10, 25)
      this.monsterHealth -= damage
      this.addMessage('player', 'attack', damage)
      this.attackPlayer()
    },

    attackPlayer() {
      const damage = genRandomNum(8, 15)
      this.playerHealth -= damage
      this.addMessage('monster', 'attack', damage)
    },

    healPlayer() {
      this.roundCount++

      const healthIncVal = genRandomNum(8, 20)

      if (this.playerHealth + healthIncVal < 100) this.playerHealth += healthIncVal
      else this.playerHealth = 100

      this.addMessage('player', 'heal', healthIncVal)
      this.attackPlayer()
    },

    checkForWinner(newHealth) {
      if (newHealth > 0) return

      const areBothDead = this.playerHealth <= 0 && this.monsterHealth <= 0

      if (areBothDead) this.winner = 'draw'
      else {
        // determine who the health belonged to
        this.winner = newHealth === this.playerHealth ? 'player' : 'monster'
      }
    },

    surrender() {
      this.winner = 'monster'
    },
    addMessage(role, type, value) {
      const newMessage = { role, type, value }
      this.messages.unshift(newMessage)
    },

    reset() {
      // very clunky...better way?:
      this.playerHealth = 100
      this.monsterHealth = 100
      this.winner = null
      this.roundCount = 0
      this.messages = []
    },
  },
})

app.mount('#game')
