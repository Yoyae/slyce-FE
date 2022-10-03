<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Manage drops !</h1>
    </div>

    <form @submit.prevent="ProcessOffChainBuy">
      <div class="container">
        <div class="row card mb-2">
            <div class="card-body mb-1">
              <label class="form-label">Offchain Buy !</label>
              <div class="container">
                <div class="row card mt-2 ">
                  <div class="card-body mb-1" >
                    <label class="form-label" >Token Address</label>
                    <input ref="dropAddressOffChainBuyField" v-model="dropOffChainBuyAddress" type="text" class="form-control" v-on:change="validateOffChainBuyDropAddress()" required>
                  </div>
                </div>

                <div class="row card mt-2 ">
                  <div class="card-body mb-1" >
                    <label class="form-label" >Buyer Address</label>
                    <input ref="offChainBuyerAddressField" v-model="offChainBuyerAddress" type="text" class="form-control" v-on:change="validateOffChainBuyerAddress()" required>
                  </div>
                </div>

                <div class="row card mt-2 ">
                  <div class="card-body mb-1" >
                    <label class="form-label">Tier bought</label>
                    <input ref="amountOffChainBuyTierIdField" v-model="numberOffChainBuyTierId" type="number" class="form-control" v-on:change="validateOffChainBuyAmountTier()"
                      required>
                  </div>
                </div>

                <div class="row card mt-2 ">
                  <div class="card-body mb-1" >
                    <label class="form-label">Number bought</label>
                    <input ref="amountOffChainBuyIdField" v-model="numberOffChainBuyId" type="number" class="form-control" v-on:change="validateOffChainBuyAmount()"
                      required>
                  </div>
                </div>

                <div class="row align-items-center" >
                  <div class="col-md-auto">
                    <button type="submit" class="btn btn-primary mt-2" id="processOffChainBuy">Buy !</button>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </form>
    
    <form @submit.prevent="ProcessTestBuy">
      <div class="container">
        <div class="row card mb-2">
            <div class="card-body mb-1">
              <label class="form-label">TEST BUY</label>
              <div class="container">
                <div class="row card mt-2 ">
                  <div class="card-body mb-1" >
                    <label class="form-label" >Token Address</label>
                    <input ref="dropAddressField" v-model="dropAddress" type="text" class="form-control" v-on:change="validateDropAddress()" required>
                  </div>
                </div>

                <div class="row card mt-2 ">
                  <div class="card-body mb-1" >
                    <label class="form-label">Tier to buy</label>
                    <input ref="amountTierIdField" v-model="numberTierId" type="number" class="form-control" v-on:change="validateAmountTier()"
                      required>
                  </div>
                </div>

                <div class="row card mt-2 ">
                  <div class="card-body mb-1" >
                    <label class="form-label">Number to buy</label>
                    <input ref="amountIdField" v-model="numberId" type="number" class="form-control" v-on:change="validateAmount()"
                      required>
                  </div>
                </div>

                <div class="row align-items-center" >
                  <div class="col-md-auto">
                    <button type="submit" class="btn btn-primary mt-2" id="processBuy">Buy !</button>
                  </div>
                </div>
              </div>
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
  name: "AddDrop",
  layout: 'dashboard',
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getProviderEthers"]),
    ...mapGetters("contracts", ["getSlyceDropLogicContract", "getSlyceDropLogicAbi", "getSlyceDropLogicAddress", "getSlyceDropBuyContract", "getSlyceDropBuyAbi", "getSlyceDropBuyAddress"])
  },
  async created() {
    if (!this.getProviderEthers) {
      await this.$store.dispatch("accounts/initWeb3Modal");
    }
    
    // if web3 provider has not been yet loaded, redirect to root 
    if (!this.getProviderEthers) {
      document.location.href = "/";
    } else {
      this.$store.dispatch("contracts/storeSlyceDropLogicAbi");
      this.$store.dispatch("contracts/storeSlyceDropLogicAddress");
      this.$store.dispatch("contracts/storeSlyceDropLogicContract");

      this.$store.dispatch("contracts/storeSlyceDropBuyAbi");
      this.$store.dispatch("contracts/storeSlyceDropBuyAddress");
      this.$store.dispatch("contracts/storeSlyceDropBuyContract");
      let signer = this.getProviderEthers.getSigner(); 

      this.buyContract = new ethers.Contract(this.getSlyceDropBuyAddress, this.getSlyceDropBuyAbi, signer);

      this.logicContract = new ethers.Contract(this.getSlyceDropLogicAddress, this.getSlyceDropLogicAbi, signer);

      let approveABI = ["function approve(address _spender, uint256 _value) public returns (bool success)"]
      this.usdcContract = new ethers.Contract(await this.buyContract.usdcContract(), approveABI, signer);
    }
  },
  data() {
    return {
      buyContract: null,
      logicContract: null,
      usdcContract: null,
      numberTierId: null,
      numberId: null,
      dropAddress: null,
      dropOffChainBuyAddress: null, 
      offChainBuyerAddress: null, 
      numberOffChainBuyTierId: null,
      numberOffChainBuyId:null,

    }
  },
  methods: {
    validateDropAddress() {
      if (!ethers.utils.isAddress(this.dropAddress)) {
        this.$refs.dropAddressField.style.borderColor = "red";
        return false;
      } else {
        this.$refs.dropAddressField.style.borderColor = "green";
        return true;
      }
    },
    validateAmountTier() {
      if (this.numberTierId < 0) {
        this.$refs.amountTierIdField.style.borderColor = "red";
        return false;
      } else {
        this.$refs.amountTierIdField.style.borderColor = "green";
        return true;
      }
    },

    validateAmount() {
      if (this.numberId <= 0) {
        this.$refs.amountIdField.style.borderColor = "red";
        return false;
      } else {
        this.$refs.amountIdField.style.borderColor = "green";
        return true;
      }
    },

    async ProcessTestBuy() {
      if (this.validateDropAddress() && this.validateAmountTier() && this.validateAmount()) {
        let price = 0;
        try{
          price = (await this.logicContract.getDropStatus(this.dropAddress))[3][this.numberTierId];
        }catch(e){
          console.log("Error when fetching price (probably wrong tier number)");
          console.log(e.message);
          return;
        }

        await this.usdcContract.approve(this.getSlyceDropBuyAddress, price * this.numberId);

        /*try{
          await this.buyContract.callStatic.purchaseDrop(this.dropAddress, this.numberTierId, this.numberId);
        }catch(e){
          console.log("Error when buying");
          console.log(e.message);
          return;
        }*/
        
        await this.buyContract.purchaseDrop(this.dropAddress, this.numberTierId, this.numberId);
      }
    },

    validateOffChainBuyDropAddress() {
      if (!ethers.utils.isAddress(this.dropOffChainBuyAddress)) {
        this.$refs.dropAddressOffChainBuyField.style.borderColor = "red";
        return false;
      } else {
        this.$refs.dropAddressOffChainBuyField.style.borderColor = "green";
        return true;
      }
    },
    validateOffChainBuyerAddress() {
      if (!ethers.utils.isAddress(this.offChainBuyerAddress)) {
        this.$refs.offChainBuyerAddressField.style.borderColor = "red";
        return false;
      } else {
        this.$refs.offChainBuyerAddressField.style.borderColor = "green";
        return true;
      }
    },
    validateOffChainBuyAmountTier() {
      if (this.numberOffChainBuyTierId < 0) {
        this.$refs.amountOffChainBuyTierIdField.style.borderColor = "red";
        return false;
      } else {
        this.$refs.amountOffChainBuyTierIdField.style.borderColor = "green";
        return true;
      }
    },
    validateOffChainBuyAmount() {
      if (this.numberOffChainBuyId <= 0) {
        this.$refs.amountOffChainBuyIdField.style.borderColor = "red";
        return false;
      } else {
        this.$refs.amountOffChainBuyIdField.style.borderColor = "green";
        return true;
      }
    },

    async ProcessOffChainBuy() {
      if (this.validateOffChainBuyDropAddress() && this.validateOffChainBuyerAddress() && this.validateOffChainBuyAmountTier() && this.validateOffChainBuyAmount()) {        
        await this.buyContract.purchaseDropOffChain(this.dropOffChainBuyAddress, this.offChainBuyerAddress, this.numberOffChainBuyTierId, this.numberOffChainBuyId);
      }
    },

  }
}
</script>