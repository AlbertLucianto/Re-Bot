<template>
  <div id="app">
    <div class="auto-complete" :class="{ hidden: activeIdx >= 0 }">
      <input class="text-input" placeholder="Search security"></input>
    </div>
    <div :class="{ open: activeIdx >= 0 }" class="list-card">
      <card :open="activeIdx === idx"
        :toggleActive="toggleActive"
        v-for="(name, idx) in cards"
        :key="idx"
        :idx="idx"
        :name="name"
        :hidden="activeIdx !== idx && activeIdx >= 0"
        fundFamilyName="SinoPac Securities Inv Trust Co., Ltd"></card>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card';

export default {
  name: 'app',
  components: {
    Card,
  },
  data() {
    return {
      activeIdx: 0,
      cards: [
        'AAPL',
        'GOOGL',
        'MSFT',
      ],
    };
  },
  methods: {
    toggleActive(num) {
      this.activeIdx = num;
    },
  },
};
</script>

<style lang="scss">
@import './components/styles/colors.scss';

body {
  margin: 0;
  background: $imperial;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
textarea, input {
  border: 0;
}
.list-card {
  transition: all .1s ease;
  padding-top: 90px;
  &.open {
    padding-top: 0;
  }
}
.auto-complete {
  width: 100vw;
  height: 150px;
  background: $pearl;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 200px;
  transition: all .25s ease .35s;
  overflow: hidden;
  .text-input {
    width: calc(100vw - 120px);
    height: 100px;
    background: $lavender;
    outline: 0;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,.15);
    padding: 2px 30px 8px 30px;
    font-size: 50px;
    color: $imperial;
    text-align: center;
    &::-webkit-input-placeholder {
      color: $pearl;
      opacity: .6;
    }
  }
  &.hidden {
    max-height: 0;
    transition: all .1s ease;
  }
}
</style>
