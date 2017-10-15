<template>
  <div class="result" @click="subscribe">
    <h1 class="security-name">{{ security.ticker }}</h1>
    <h3 class="family-name">{{ security.fundfamilyname }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    security: Object,
    closeResults: Function,
  },
  methods: {
    subscribe() {
      const today = new Date();
      fetch(`https://whitepaper-db-api.herokuapp.com/user/${this.$route.params.userId}/security/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          securities: [
            {
              security_id: this.security.id,
              amount: 0,
              purchase_date: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
              purchase_price: 1,
            },
          ],
        }),
      })
        .then(res => res.json())
        .then(() => {
          this.closeResults();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import './styles/colors.scss';

.result {
  padding-bottom: 15px;
  border-bottom: 5px solid $white;
  height: 220px;
  display: flex;
  background: $lavender;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  .family-name {
    font-size: 40px;
    margin: 0;
    color: $pearl;
    margin-bottom: 80px;
    max-width: 900px;
  }
  .security-name {
    padding-top: 50px;
    margin-bottom: 0;
    font-size: 80px;
    color: $imperial;
    &.inactive {
      padding-top: 0;
      margin-bottom: unset;
    }
  }
}
</style>
