<template>
  <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">Admin Page</a>

    <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <ul class="navbar-nav mr-auto px-3">
      <li class="nav-item text-nowrap" v-if="!isUserConnected">
        <button class="btn btn-outline-primary" type="button" @click="connectWeb3Modal">Connect your wallet</button>
        
      </li>
      <li class="nav-item text-nowrap" v-if="isUserConnected">
        <span class="navbar-text">
          {{getActiveAccount}}
        </span>
        <button class="btn btn-outline-danger" type="button"  @click="disconnectWeb3Modal">Disconnect</button>
      </li>
    </ul>
    

  </header>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Navbar",
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "isUserConnected", "getWeb3Modal"]),
  },
  created() {
    this.$store.dispatch("accounts/initWeb3Modal",);
    this.$store.dispatch("accounts/ethereumListener");
  },
  methods: {
    ...mapActions("accounts", ["connectWeb3Modal", "disconnectWeb3Modal"]),
  }
}
</script>
