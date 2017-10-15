<template>
  <div class="card" :style="cardStyle" :class="{ inactive: !open, hidden }" @mousedown="openThis">
    <h1 class="security-name" :class="{ inactive: !open }">{{ card.ticker }}</h1>
    <h3 class="family-name">{{ card.fundfamilyname }}</h3>
    <div class="buy-data" v-if="open">
      <div class="buy-date">
        <div class="label">
          Buy Date
        </div>
        <div class="value">
          <datepicker :value="date" input-class="input"
            calendar-class="calendar" @selected="dateSelected"></datepicker>
        </div>
      </div>
      <div class="buy-price">
        <div class="label">
          Buy Price
        </div>
        <div class="value">
          $ <input @input="changePrice" :value="price" class="input-text"></input>
        </div>
      </div>
    </div>
    <div class="rim-out" v-if="open" ref="rimOut" :style="rimStyle"
      @mousedown="startScroll" @mousemove="doScroll" @mouseup="stopScroll"
      @touchstart="startScroll" @touchmove="doScroll" @touchend="stopScroll">
      <div class="rim-in" @mousedown="stopPropagate">
        <div class="data">
          <div class="label">Total</div>
          <div class="value">{{ total }}</div>
        </div>
      </div>
    </div>
    <div class="swipe-container" v-if="open"
      @mousedown="startDrag" @mousemove="startMove" @mouseup="stopDrag"
      @touchstart="startDrag" @touchmove="startMove" @touchend="stopDrag">
      <svg class="swipe-up">
        <g class="line-group" v-for="arrow in arrows" :key="arrow">
          <line x1="-40" :y1="30 + (arrow * 40)" x2="0" :y2="arrow * 40" class="swipe-line"></line>
          <line x1="40" :y1="30 + (arrow * 40)" x2="0" :y2="arrow * 40" class="swipe-line"></line>
        </g>
      </svg>
      <div class="swipe-text">see all your securities</div>
    </div>
  </div>
</template>

<script>
import dynamics from 'dynamics.js';
import Datepicker from 'vuejs-datepicker';

const scrollConstant = 0.05;
const startDragOff = -200;

export default {
  components: {
    Datepicker,
  },
  data() {
    return {
      arrows: [0, 1, 2],
      dragOff: startDragOff,
      startPos: 0,
      dragging: false,
      total: 15,
      scrolling: false,
      scrollBuffer: 0,
      lastScrollPos: { x: 0, y: 0 },
      gradientDeg: 0,
      date: new Date(),
      price: 2,
    };
  },
  props: {
    toggleActive: Function,
    open: Boolean,
    idx: Number,
    hidden: Boolean,
    card: Object,
    userSecurity: Object,
  },
  computed: {
    cardStyle() {
      return {
        transform: `translate(0, ${(this.dragOff / 3) + 50}px) scale(${(2000 + this.dragOff) / 2000})`,
        'border-radius': `${Math.min(Math.abs(this.dragOff / 10), 50)}px`,
      };
    },
    rimStyle() {
      const pi = Math.PI;
      const gradPos = {
        x: (1 + Math.cos((this.gradientDeg / 180) * pi)) / 2,
        y: (1 + Math.sin((this.gradientDeg / 180) * pi)) / 2,
      };
      return {
        background: `radial-gradient(at ${gradPos.x * 100}% ${gradPos.y * 100}%, #F29D2C, #FFC127)`,
      };
    },
  },
  methods: {
    startDrag(e) {
      this.dragging = true;
      const evt = e.changedTouches ? e.changedTouches[0] : e;
      this.startPos = evt.pageY;
      window.addEventListener('mousemove', this.startMove);
      window.addEventListener('mouseup', this.stopDrag);
    },
    startMove(e) {
      if (this.dragging) {
        const evt = e.changedTouches ? e.changedTouches[0] : e;
        const move = evt.pageY - this.startPos;
        this.dragOff = move < startDragOff ? move : startDragOff;
      }
    },
    stopDrag() {
      window.removeEventListener('mousemove', this.startMove);
      window.removeEventListener('mouseup', this.stopDrag);
      this.dragging = false;
      if (this.open && Math.abs(this.dragOff) > 500) {
        this.toggleActive(-1);
      }
      dynamics.animate(this, {
        dragOff: startDragOff,
      }, {
        type: dynamics.easeOut,
        duration: 500,
        friction: 50,
      });
    },
    openThis() {
      this.toggleActive(this.idx);
    },
    startScroll(e) {
      this.scrolling = true;
      const evt = e.changedTouches ? e.changedTouches[0] : e;
      this.lastScrollPos = {
        x: evt.pageX,
        y: evt.pageY,
      };
    },
    doScroll(e) {
      if (this.scrolling) {
        const evt = e.changedTouches ? e.changedTouches[0] : e;
        const rect = this.$refs.rimOut.getBoundingClientRect();
        const rimCenter = {
          x: (rect.left + rect.right) / 2,
          y: (rect.top + rect.bottom) / 2,
        };
        const dx = evt.pageX - this.lastScrollPos.x;
        const dy = evt.pageY - this.lastScrollPos.y;
        const vector = {
          x: -(this.lastScrollPos.y - rimCenter.y),
          y: this.lastScrollPos.x - rimCenter.x,
        };
        const vectorLength = Math.sqrt((vector.x ** 2) + (vector.y ** 2));
        const unitVector = {
          x: vector.x / vectorLength,
          y: vector.y / vectorLength,
        };
        this.scrollBuffer += ((unitVector.x * dx) + (unitVector.y * dy)) * scrollConstant;
        if (this.scrollBuffer > 1 || this.scrollBuffer < 0) {
          const change = Math.floor(this.scrollBuffer);
          this.total = Math.max(this.total + change, 0);
          this.scrollBuffer -= change;
        }
        this.lastScrollPos = {
          x: evt.pageX,
          y: evt.pageY,
        };
      }
    },
    stopScroll() {
      this.scrolling = false;
      this.submitUpdate();
    },
    stopPropagate(e) {
      e.stopPropagation();
    },
    dateSelected(val) {
      this.date = new Date(val);
      this.submitUpdate();
    },
    changePrice(e) {
      this.price = e.target.value;
      this.submitUpdate();
    },
    submitUpdate() {
      fetch(`https://whitepaper-db-api.herokuapp.com/user/${this.$route.params.userId}/security/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          securities: [
            {
              security_id: this.card.security_id,
              amount: this.total,
              purchase_date: `${this.date.getFullYear()}-${this.date.getMonth()}-${this.date.getDate()}`,
              purchase_price: this.price,
            },
          ],
        }),
      });
    },
  },
  mounted() {
    this.total = this.userSecurity.amount;
    this.date = new Date(this.userSecurity.date);
    this.price = this.userSecurity.price;
    this.$nextTick(() => {
      setInterval(() => {
        this.gradientDeg += 1;
      }, 50);
    });
  },
};
</script>

<style lang="scss">
@import './styles/colors.scss';

.input {
  border: none;
  width: 300px;
  height: 80px;
  font-size: 48px;
  text-align: center;
  background: none;
  color: $blue;
}
.card {
  overflow: hidden;
  position: relative;
  width: 100vw;
  height: 100vh;
  background: $lavender;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  transform-origin: 50% 50%;
  user-select: none;
  box-shadow: 0 30px 150px -30px rgba(0,0,0,.3);
  transition: height .25s ease;
  &.inactive {
    height: 300px;
    box-shadow: 0 10px 50px -20px rgba(0,0,0,.3);
  }
  &.hidden {
    height: 0;
  }
  .family-name {
    font-size: 52px;
    margin: 0;
    color: $pearl;
    margin-bottom: 80px;
    max-width: 900px;
  }
  .security-name {
    display: block;
    padding-top: 50px;
    margin-bottom: 0;
    font-size: 120px;
    color: $imperial;
    &.inactive {
      padding-top: 0;
      margin-bottom: unset;
    }
  }
  .buy-data {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    .buy-price, .buy-date {
      font-size: 48px;
      min-width: 200px;
      padding: 20px;
      .label {
        font-size: 32px;
        font-weight: 600;
        color: $pearl;
        padding-bottom: 8px;
      }
      .input-text {
        border: none;
        width: 100px;
        height: 80px;
        font-size: 48px;
        text-align: center;
        background: none;
        color: $blue;
      }
    }
    .calendar {
      position: fixed;
      left: calc(50vw - 300px);
      width: 600px;
      height: 550px;
      padding-top: 50px;
      box-shadow: 0 30px 50px rgba(0,0,0,.15);
    }
  }
  .rim-out {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 700px;
    height: 700px;
    min-height: 700px;
    margin: auto;
    margin-top: 40px;
    left: calc(50% - 350px);
    bottom: 500px;
    border-radius: 50%;
    box-shadow: 0 10px 50px rgba(0,0,0,.15) inset;
  }
  .rim-in {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: $lavender;
    text-align: center;
    box-shadow: 0 10px 50px rgba(0,0,0,.15);
  }
  .data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 15px;
    .label {
      font-size: 56px;
    }
    .value {
      font-size: 130px;
    }
  }
  .swipe-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 100px;
    .swipe-up {
      width: 100px;
      height: 150px;
      .line-group {
        transform: translate(50px, 10px);
        .swipe-line {
          fill: none;
          stroke: $pearl;
          stroke-width: 10px;
          stroke-linecap: round;
        }
      }
    }
    .swipe-text {
      padding-top: 15px;
      font-size: 42px;
      color: $pearl;
    }
  }
}
</style>
