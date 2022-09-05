<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Add royalties to a drop ! #success</h1>
    </div>
    <form @submit.prevent="addRoyaltiesSubmit">
      <div class="container">
        <div class="row card mb-2">
          <div class="card-body mb-1">
            <label class="form-label">Token address</label>
            <input ref="tokenAddressField" v-model="tokenAddress" type="address" class="form-control"
              v-on:change="validateTokenAddress()" required>
          </div>
        </div>

        <div class="row">
          <div class="col card">
            <div class="card-body mb-1">
              <label class="form-label">Royalties per tier</label>
              <div class="previous" v-for="(royaltiesPerTier, id) in royaltiesPerTierId" v-bind:key="id">
                <input ref="royaltiesPerTierIdField" v-model="royaltiesPerTierId[id]" type="number" 
                  class="form-control" v-on:change="validateMarketRoyalties(id)" required>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-end mb-2" >
          <div class="col-md-auto gx-0">
            <button type="button" class="btn btn-success" @click="addRoyaltiesTier">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                class="bi bi-plus-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path
                  d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            </button>
          </div>
          <div class="col-md-auto gx-0">
            <button type="button" class="btn btn-danger" @click="deleteRoyaltiesTier">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                class="bi bi-dash-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="row " >
          <div class="col-md-auto">
            <button type="submit" class="btn btn-primary mt-2">Push royalties !</button>
          </div>
          <div class="col-md-auto">
            <button type="button" class="btn btn-primary mt-2" @click="clearValue">Clear values</button>
          </div>
          <div class="col-md-auto">
            <button type="button" class="btn btn-primary mt-2" @click="dummyValues">Dummy values</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { mapGetters } from "vuex";
export default {
  name: "Royalties",
  layout: 'dashboard',
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getProviderEthers"]),
    ...mapGetters("contracts", ["getSlyceRoyaltiesContract", "getSlyceRoyaltiesAbi", "getSlyceRoyaltiesAddress"])
  },
  created() {
    // if web3 provider has not been yet loaded, redirect to root 
    if (!this.getProviderEthers) {
      document.location.href = "/";
    } else {
      this.$store.dispatch("contracts/storeSlyceRoyaltiesAbi");
      this.$store.dispatch("contracts/storeSlyceRoyaltiesAddress");
      // get the contract instance
      this.$store.dispatch("contracts/storeSlyceRoyaltiesContract");
      let signer = this.getProviderEthers.getSigner(); 
      this.royaltiesContract = new ethers.Contract(this.getSlyceRoyaltiesAddress, this.getSlyceRoyaltiesAbi, signer);
    }
  },
  data() {
    return {
      royaltiesContract: null,
      tokenAddress: null,
      royaltiesPerTierId: [0],
    }
  },
  methods: {
    validateTokenAddress() {
      if (!ethers.utils.isAddress(this.tokenAddress)) {
        this.$refs.tokenAddressField.style.borderColor = "red";
        return false;
      } else {
        this.$refs.tokenAddressField.style.borderColor = "green";
        return true;
      }
    },

    validateMarketRoyalties(Id) {
      if (this.royaltiesPerTierId[Id] <= 0) {
        this.$refs.royaltiesPerTierIdField[Id].style.borderColor = "red";
        return false;
      } else {
        this.$refs.royaltiesPerTierIdField[Id].style.borderColor = "green";
        return true;
      }
    },

    addRoyaltiesTier() {
      this.royaltiesPerTierId.push(null);
    },
    deleteRoyaltiesTier() {
      if(this.royaltiesPerTierId.length > 1){
        this.royaltiesPerTierId.pop();
      }
    },

    clearValue() {
      this.tokenAddress = "";
      this.royaltiesPerTierId = [0];
    },

    dummyValues() {
      this.tokenAddress = "0xC7349F8a37E124B07df6704c3E7bD14ca7836fA3";
      this.royaltiesPerTierId = [];
      this.royaltiesPerTierId[0] =  '3';
      this.royaltiesPerTierId.push('1');
      this.royaltiesPerTierId.push('2');
    },



    async addRoyaltiesSubmit() {
      var isDataNotValid = false;
      this.royaltiesPerTierId.forEach((item, index) => {
        if(!this.validateMarketRoyalties(index)){
          isDataNotValid = true;
        }
      })
      if (!this.validateTokenAddress()) {
        isDataNotValid = true;
      } 

      if(isDataNotValid){
        this.$toasted.show('One or more input are wrong. Correct red field to proceed.', {
          type: 'error',
          duration: 5000,
          theme: "bubble",
          position: "top-center"
        });
      } else {
        console.log("Data is valid");
        
        await this.royaltiesContract.pushRoyalty(this.tokenAddress, this.royaltiesPerTierId);
      }
    },

  }
}
</script>