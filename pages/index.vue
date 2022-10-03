<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Slyce admin pages</h1>
    </div>

    <p>You will be allow to interact with contract value. Don't mess up !</p>
    <p>(Obviously only admin will be allowed to modify values in contract)</p>

    <p v-if="isUserConnected">
      <div><strong>Your current chain:</strong> {{getChainName}}</div>
      <div>using Slyce contract {{getSlyceDropLogicAddress}},</div>
      <div>version {{getSlyceVersion}}</div>
    </p>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Homepage",
  layout: 'dashboard',
  computed: {
    ...mapGetters("accounts", ["getChainName", "isUserConnected", "getProviderEthers"]),
    ...mapGetters("contracts", ["getSlyceVersion", "getSlyceDropLogicAddress"]),
  },
  async created() {
    if (!this.getProviderEthers) {
      await this.$store.dispatch("accounts/initWeb3Modal");
    }
    if (this.getProviderEthers) {
      this.$store.dispatch("contracts/storeSlyceDropLogicAddress");
      this.$store.dispatch("contracts/storeSlyceVersion");
    }
  },
}
</script>