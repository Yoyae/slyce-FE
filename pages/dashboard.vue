<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1>Admin dashboard</h1>
    </div>

    <table class="table table-striped table-bordered table-hover table-responsive" >
        <thead>
            <tr>
                <th>State</th>               
                <th>Address de l'artiste</th>
                <th>Address/Metadata du drop</th>
                <th>Starting slyceId (par tier)</th>
                <th>Metadata</th>
                <th>Tier Dispo</th>
                <th>Tier Total</th>
            </tr>
        </thead>
        <tbody>
          <tr v-for="drop in drops" :key="drop.id">
            <td>{{drop.status}}</td>
            <td>{{drop.artistAdr}}</td>
            <td>{{drop.dropContract}}
                <br>
                <a v-bind:href=drop.dropMetadata target="_blank">{{drop.dropMetadata.slice(0,33)}}...{{drop.dropMetadata.slice(drop.dropMetadata.length - 20)}}</a>
            </td>
            <td>
              <div v-for="(slyceId, id) in drop.slyceId" v-bind:key="id">
                {{slyceId}}
              </div>
            </td>
            <td>
              <div v-for="(tokenMetadata, id) in drop.tokenMetadata" v-bind:key="id">
                <a v-bind:href=tokenMetadata target="_blank">{{tokenMetadata.slice(0,33)}}...{{tokenMetadata.slice(tokenMetadata.length - 20)}}</a>
              </div>
            </td>
            <td>
              <div v-for="(tierAvailable, id) in drop.tierAvailable" v-bind:key="id">
                {{tierAvailable}}
              </div>
            </td>
            <td>
              <div v-for="(amountTier, id) in drop.amountTier" v-bind:key="id">
                {{amountTier}}
              </div>
            </td>
          </tr>
        </tbody>
    </table>
  </div>
</template>
<script>
import { ethers } from "ethers";
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  layout: 'dashboard',
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getProviderEthers"]),
    ...mapGetters("contracts", ["getSlyceDropLogicContract", "getSlyceDropLogicAbi", "getSlyceDropLogicAddress", "getSlyceDropLogicList"])
  },
  async created() {
    // if web3 provider has not been yet loaded, redirect to root 
    if (!this.getProviderEthers) {
      await this.$store.dispatch("accounts/initWeb3Modal");
    }
    if (!this.getProviderEthers) {
      document.location.href="/";
      return;
    } else {
      this.$store.dispatch("contracts/storeSlyceDropLogicAbi");
      this.$store.dispatch("contracts/storeSlyceDropLogicAddress");
      // get the contract instance
      this.$store.dispatch("contracts/storeSlyceDropLogicContract");

      this.$store.dispatch("contracts/storeSlyceDropBuyAbi");
      this.$store.dispatch("contracts/storeSlyceDropBuyAddress");
      // get the contract instance
      this.$store.dispatch("contracts/storeSlyceDropBuyContract");
      let signer = this.getProviderEthers.getSigner(); 
      this.contract = new ethers.Contract(this.getSlyceDropLogicAddress, this.getSlyceDropLogicAbi, signer);
      
      //set SlyceDropLogicList
      await this.$store.dispatch("contracts/storeSlyceDropLogicList");

      for (const [id,drop] of this.getSlyceDropLogicList.entries()) {
        let status = (await this.contract.getDropStatus(drop.dropContract))[5];
        let statusText = "";
        switch(status){
          case 1:
            statusText = "MINT";
            break;
          case 2: 
            statusText = "WAIT";
            break;
          case 3:
            statusText = "BUY";
            break;
          dafault:
            statusText = "ERROR";
            break;
        }

        this.$set(this.drops, id,  {status: statusText, artistAdr: drop.artistAdr, dropContract: drop.dropContract, dropMetadata:drop.dropMetadata, slyceId: drop.slyceId, tokenMetadata:drop.tokenMetadata, tierAvailable: drop.tierAvailable, amountTier: drop.amountTier});

      }
    }
  },
  data() {
    return {
      contract: null,
      drops: {}
    }
  },
  methods: {
  },
};
</script>