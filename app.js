function genRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

const app = Vue.createApp({
  data: () => ({
    playerHealth: 100,
    monsterHealth: 100,
    roundCount: 0,
  }),

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
    startGame() {
      this.playerHealth = 100
      this.monsterHealth = 100
      this.winner = null
      this.roundCount = 0
      this.logMessages = []
    },

    attackMonster() {
      this.roundCount++
      const damage = genRandomNum(5, 12)
      this.monsterHealth -= damage
      //   this.addLogMessage('player', 'attack', damage)
      this.attackPlayer()
    },

    specialAttackMonster() {
      this.roundCount++
      const damage = genRandomNum(10, 25)
      this.monsterHealth -= damage
      this.addLogMessage('player', 'attack', damage)
      this.attackPlayer()
    },

    attackPlayer() {
      const damage = genRandomNum(8, 15)
      this.playerHealth -= damage
      this.addLogMessage('monster', 'attack', damage)
    },

    healPlayer() {
      this.roundCount++

      const healthIncVal = genRandomNum(8, 20)

      if (this.playerHealth + healthIncVal < 100) this.playerHealth += healthIncVal
      else this.playerHealth = 100

      this.addLogMessage('player', 'heal', healthIncVal)
      this.attackPlayer()
    },
    surrender() {
      this.winner = 'monster'
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      })
    },
  },
})

app.mount('#game')
