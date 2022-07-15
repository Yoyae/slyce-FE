<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Add new drop !</h1>
    </div>
    <form @submit.prevent="addNewDropSubmit">
      <div class="container">
        <div class="row card mb-2">
          <div class="card-body mb-1">
            <label class="form-label">Artist address</label>
            <input ref="artistAddressField" v-model="artistAddress" type="address" class="form-control"
              v-on:change="validateArtistAddress()" required>
          </div>
        </div>
        <div class="row card mb-2">
          <div class="card-body mb-1">
            <label class="form-label">Payment address</label>
            <input ref="paymentAddressField" v-model="paymentAddress" type="address" class="form-control"
              v-on:change="validatePaymentAddress()" required> 
          </div>
        </div>

        <div class="row card mb-2">
          <div class="card-body mb-1">
            <label class="form-label">Drop Id (<a
                href="https://docs.google.com/spreadsheets/d/1Pv1C5CTm2I1PN3xYx8gWiLIKt6VR6I6dsdIECV_Josg" target="_blank">tool</a>)</label>
            <input ref="dropIdField" v-model="dropId" type="text" class="form-control" v-on:change="validateDropId()"
              required>
          </div>
        </div>

        <div class="row">
          <div class="col card">
            <div class="card-body mb-1">
              <label class="form-label">Number of tier to sell</label>
              <div class="previous" v-for="(numberTier, id) in numberTierId" v-bind:key="id">
                <input ref="amountTierIdField" v-model="numberTierId[id]" type="number" class="form-control" v-on:change="validateAmountTier(id)"
                  required>
              </div>
            </div>
          </div>
          <div class="col card">
            <div class="card-body mb-1">
              <label class="form-label">Tier price (in USDC)</label>
              <div class="previous" v-for="(price, id) in priceId" v-bind:key="id">
                <input ref="tierPriceInUSDCField" v-model="priceId[id]" type="number" class="form-control" v-on:change="validateTierPrice(id)"
                  required>
              </div>
            </div>
          </div>
          <div class="col card">
            <div class="card-body mb-1">
              <label class="form-label">Market royalties (in %, 10% => 10)</label>
              <div class="previous" v-for="(marketRoyalties, id) in marketRoyaltiesId" v-bind:key="id">
                <input ref="marketRoyaltyTierIdField" v-model="marketRoyaltiesId[id]" type="number" 
                  class="form-control" v-on:change="validateMarketRoyalties(id)" required>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-end mb-2" >
          <div class="col-md-auto gx-0">
            <button type="button" class="btn btn-success" @click="addAmountTier">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                class="bi bi-plus-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path
                  d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            </button>
          </div>
          <div class="col-md-auto gx-0">
            <button type="button" class="btn btn-danger" @click="deleteAmountTier">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                class="bi bi-dash-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="row card mb-2">
          <div class="card-body mb-1">
            <label class="form-label">Token metadata URL (eg. "https://metadata.royal.io/tierid/xxxxx/")</label>
            <input ref="tokenURIField" v-model="tokenURI" type="url" class="form-control"
              required>
          </div>
        </div>

        <div class="row card mb-2">
          <div class="card-body mb-1">
            <label class="form-label">Contract metadata URL (eg. "https://metadata.royal.io/dropid/xxxx.json")</label>
            <input ref="contractURIField" v-model="contractURI" type="url" class="form-control"
              required>
          </div>
        </div>

        <div class="row mb-2 align-items-center" >
          <div class="col-md-auto">
            <button type="submit" class="btn btn-primary mt-2" :disabled="!addDropdStateOne">Add drop !</button>
          </div>
          <div class="col-md-auto">
            <button type="button" class="btn btn-primary mt-2" @click="clearValue" :disabled="!addDropdStateOne">Clear values</button>
          </div>
          <div class="col-md-auto">
            <button type="button" class="btn btn-primary mt-2" @click="dummyValues" :disabled="!addDropdStateOne">Dummy values</button>
          </div>
        </div>
      </div>
    </form>

    <form @submit.prevent="ProcessDropInitSubmit">
      <div class="container">
        <div class="row card mt-2 ">
          <div class="card-body mb-1" >
            <label class="form-label" >Token Address</label>
            <input ref="dropAddressField" v-model="dropAddress" type="text" class="form-control" v-on:change="validateDropAddress()"
              required :disabled="addDropdStateOne">
          </div>
        </div>
        <div class="row align-items-center" >
          <div class="col-md-auto">
            <button type="submit" class="btn btn-primary mt-2" id="buttonProcessDropInit" :disabled="addDropdStateOne">Process drop intialisation</button>
          </div>
          <div class="col-md-auto" v-if="!addDropdStateOne">
            <label class="form-label mt-2" for="buttonProcessDropInit">init state : {{step}}/{{allSteps}}</label>
          </div>
          
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { NonceManager } from "@ethersproject/experimental";
import { mapGetters } from "vuex";
export default {
  name: "AddDrop",
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getProviderEthers"]),
    ...mapGetters("contracts", ["getSlyceDropLogicContract", "getSlyceDropLogicAbi", "getSlyceDropLogicAddress"])
  },
  created() {
    // if web3 provider has not been yet loaded, redirect to root 
    if (!this.getProviderEthers) {
      document.location.href = "/";
    } else {
      this.$store.dispatch("contracts/storeSlyceDropLogicAbi");
      this.$store.dispatch("contracts/storeSlyceDropLogicAddress");
      // get the contract instance
      this.$store.dispatch("contracts/storeSlyceDropLogicContract");
      let signer = this.getProviderEthers.getSigner(); 
      const managedSigner = new NonceManager(signer);
      this.contract = new ethers.Contract(this.getSlyceDropLogicAddress, this.getSlyceDropLogicAbi, managedSigner);

    }
  },
  data() {
    return {
      contract: null,
      addDropdStateOne: true,
      artistAddress: null,
      paymentAddress: null,
      dropId: null,
      numberTierId: [],
      priceId: [],
      marketRoyaltiesId: [],
      tokenURI: '',
      contractURI: '',
      dropAddress: null,
      step: 0,
      allSteps: null
    }
  },
  methods: {
    validateArtistAddress() {
      if (!ethers.utils.isAddress(this.artistAddress)) {
        this.$refs.artistAddressField.style.borderColor = "red";
        return false;
      } else {
        this.$refs.artistAddressField.style.borderColor = "green";
        return true;
      }
    },

    validatePaymentAddress() {
      if (!ethers.utils.isAddress(this.paymentAddress)) {
        this.$refs.paymentAddressField.style.borderColor = "red";
        return false;
      } else {
        this.$refs.paymentAddressField.style.borderColor = "green";
        return true;
      }
    },

    validateDropId() {
      var regExp = new RegExp(/^0x[0-9A-F]{64}$/i);
      if (!regExp.test(this.dropId)) {
        this.$refs.dropIdField.style.borderColor = "red";
        return false;
      } else {
        this.$refs.dropIdField.style.borderColor = "green";
        return true;
      }
    },

    validateAmountTier(Id) {
      if (this.numberTierId[Id] <= 0) {
        this.$refs.amountTierIdField[Id].style.borderColor = "red";
        return false;
      } else {
        this.$refs.amountTierIdField[Id].style.borderColor = "green";
        return true;
      }
    },

    validateTierPrice(Id) {
      if (this.priceId[Id] <= 0) {
        this.$refs.tierPriceInUSDCField[Id].style.borderColor = "red";
        return false;
      } else {
        this.$refs.tierPriceInUSDCField[Id].style.borderColor = "green";
        return true;
      }
    },

    validateMarketRoyalties(Id) {
      if (this.marketRoyaltiesId[Id] <= 0) {
        this.$refs.marketRoyaltyTierIdField[Id].style.borderColor = "red";
        return false;
      } else {
        this.$refs.marketRoyaltyTierIdField[Id].style.borderColor = "green";
        return true;
      }
    },

    addAmountTier() {
      this.numberTierId.push(null);
      this.priceId.push(null);
      this.marketRoyaltiesId.push(null);
    },
    deleteAmountTier() {
      if(this.numberTierId.length > 1){
        this.numberTierId.pop();
        this.priceId.pop();
        this.marketRoyaltiesId.pop();
      }
    },

    clearValue() {
      this.artistAddress = "";
      this.paymentAddress = "";
      this.dropId = "";
      this.numberTierId = [0];
      this.priceId = [0];
      this.marketRoyaltiesId = [0];
      this.tokenURI = '';
      this.contractURI = '';
    },

    dummyValues() {
      this.artistAddress = "0xC7349F8a37E124B07df6704c3E7bD14ca7836fA3";
      this.paymentAddress = "0xC7349F8a37E124B07df6704c3E7bD14ca7836fA3";
      this.dropId = "0x2556348756b41da692e0bfc6e87fd601741a681328a1bd126c3a9fbfe1f37717";
      this.numberTierId = [];
      this.priceId = [];
      this.marketRoyaltiesId = [];
      this.numberTierId[0]=  '3';
      this.priceId[0]=  '3';
      this.marketRoyaltiesId[0] =  '3';
      this.numberTierId.push('1');
      this.priceId.push('1');
      this.marketRoyaltiesId.push('1');
      this.numberTierId.push('2');
      this.priceId.push('2');
      this.marketRoyaltiesId.push('2');
      this.tokenURI = 'https://metadata.royal.io/tierid/';
      this.contractURI = 'https://metadata.royal.io/tierid/';
    },

    async addNewDropSubmit() {
      var isDataNotValid = false;
      this.numberTierId.forEach((item, index) => {
        if(!(this.validateAmountTier(index) && this.validateTierPrice(index) && this.validateMarketRoyalties(index))){
          isDataNotValid = true;
        }
      })
      if (!(this.validateArtistAddress() && this.validatePaymentAddress() && this.validateDropId())) {
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
        
        await this.contract.addNewDrop(this.artistAddress, this.paymentAddress, this.dropId, this.numberTierId, this.priceId, this.tokenURI, this.contractURI);
        this.addDropdStateOne = false;

        //Set newly created dropAddress
        let eventFilter = this.contract.filters.DropCreated();
        let events = await this.contract.queryFilter(eventFilter);
        this.dropAddress = events[events.length-1].args.dropAddress;
        console.log("new drop address : "+this.dropAddress);
        
        this.step = 0;
        this.allSteps = 0;
        //Set steps to make to init
        this.numberTierId.forEach((num) => {
          this.allSteps+=Math.ceil(num / 40);
        });
        console.log("Steps to process drop : "+this.allSteps);

        
      }
    },

    validateDropAddress() {
      if (!ethers.utils.isAddress(this.dropAddress)) {
        this.$refs.dropAddressField.style.borderColor = "red";
        return false;
      } else {
        this.$refs.dropAddressField.style.borderColor = "green";
        return true;
      }
    },

    async ProcessDropInitSubmit() {

      this.getSlyceDropLogicContract.on("DropMinted", async (dropAddress) => {
        if(dropAddress == this.dropAddress){
          console.log("new step emitted");
        }
      });
      for (let i = this.step; i < this.allSteps; i++) {
        var tx = await this.contract.processDropInitialisation(this.dropAddress, this.marketRoyaltiesId);
        if(tx != 0){
          this.step++;
        }
      }

      if(this.step == this.allSteps){
        this.addDropdStateOne = true;
      }

    }
  }
}
</script>