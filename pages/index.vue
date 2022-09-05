<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Slyce admin pages</h1>
    </div>

    <p>You will be allow to interact with contract value. Don't mess up !</p>
    <p>(Obviously only admin will be allowed to modify values in contract)</p>

    <p v-if="isUserConnected">
      <strong>Your current chain:</strong> {{getChainName}}
    </p>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Homepage",
  layout: 'dashboard',
  computed: {
    ...mapGetters("accounts", ["getChainName", "isUserConnected"]),
  },
}
</script>