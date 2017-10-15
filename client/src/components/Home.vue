<template>
  <div>
    <div class="auto-complete" :class="{ hidden: activeIdx >= 0 }">
      <input class="text-input" placeholder="Search security" @input="handleChange" :value="query"></input>
    </div>
    <svg viewBox="0 0 32 32" width="300" height="600" fill="white" v-if="!loaded">
      <circle transform="translate(8 0)" cx="0" cy="16" r="0">
        <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0"
          keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />
      </circle>
      <circle transform="translate(16 0)" cx="0" cy="16" r="0"> 
        <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.3"
          keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />
      </circle>
      <circle transform="translate(24 0)" cx="0" cy="16" r="0"> 
        <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.6"
          keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />
      </circle>
    </svg>
    <div :class="{ open: activeIdx >= 0 }" class="list-card" v-if="!searching">
      <card :open="activeIdx === idx"
        :toggleActive="toggleActive"
        v-for="(card, idx) in cards"
        :key="idx"
        :idx="idx"
        :hidden="activeIdx !== idx && activeIdx >= 0"
        :card="card.security"
        :userSecurity="card.user_security"></card>
    </div>
    <div class="list-search" :class="{ searching }">
      <result v-for="(result, idx) in searchResults"
        :key="idx"
        :idx="idx"
        :security="result"
        :closeResults="closeResults"></result>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card';
import Result from '@/components/Result';

const serviceUserUrl = 'https://whitepaper-db-api.herokuapp.com/user/';
const serviceSecurityUrl = 'https://whitepaper-db-api.herokuapp.com/security/';
let curReq = 0;

export default {
  name: 'home',
  components: {
    Card,
    Result,
  },
  data() {
    return {
      activeIdx: -1,
      cards: [],
      searchResults: [],
      searching: false,
      resultsLoaded: true,
      loaded: false,
      query: '',
    };
  },
  methods: {
    toggleActive(num) {
      this.activeIdx = num;
    },
    handleChange(e) {
      this.query = e.target.value;
      if (e.target.value !== '') {
        clearTimeout(curReq);
        this.searching = true;
        curReq = setTimeout(() => {
          this.resultsLoaded = false;
          fetch(`${serviceSecurityUrl}?q=${e.target.value}`)
            .then(res => res.json())
            .then((results) => {
              this.resultsLoaded = true;
              this.searchResults = results.securities;
            });
        }, 200);
      } else {
        this.searching = false;
        this.resultsLoaded = true;
        this.searchResults = [];
        fetch(`${serviceUserUrl}${this.$route.params.userId}`)
          .then(res => res.json())
          .then((data) => {
            this.loaded = true;
            this.cards = data.securities;
          });
      }
    },
    closeResults() {
      this.query = '';
      this.searching = false;
      this.searchResults = [];
      this.resultsLoaded = true;
      this.fetchAll();
    },
    fetchAll() {
      this.loaded = false;
      fetch(`${serviceUserUrl}${this.$route.params.userId}/security`)
        .then(res => res.json())
        .then((data) => {
          this.loaded = true;
          this.cards = data.data;
        });
    },
  },
  created() {
    this.fetchAll();
  },
};
</script>

<style lang="scss">
@import './styles/colors.scss';

textarea, input {
  border: 0;
}
.list-card {
  transition: all .1s ease;
  padding-top: 210px;
  &.open {
    padding-top: 0;
  }
}
.list-search {
  max-height: 0;
  padding-top: 0;
  transition: all .25 ease;
  &.searching {
    padding-top: 210px;
  }
}
.auto-complete {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100vw;
  height: 150px;
  background: $pearl;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 200px;
  transition: all .25s ease .35s;
  overflow: hidden;
  box-shadow: 0 10px 50px rgba(0,0,0,.15);
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
