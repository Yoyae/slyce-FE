import { ethers } from "ethers";
import SlyceDropLogic from "@/static/contracts/SlyceDropLogic.json";
import SlyceDropBuy from "@/static/contracts/SlyceDropBuy.json";
import SlyceRoyalties from "@/static/contracts/SlyceRoyalties.json";
import SlyceToken from "@/static/contracts/SlyceToken.json";
import addresses from "@/static/contracts/addresses.json";

const state = function() {
  return {
    slyceVersion: 0,
    slyceDropLogicContract: null,
    slyceDropLogicAbi:null,
    slyceDropLogicAddress:null,
    slyceDropBuyContract: null,
    slyceDropBuyAbi:null,
    slyceDropBuyAddress:null,
    slyceRoyaltiesContract: null,
    slyceRoyaltiesAbi:null,
    slyceRoyaltiesAddress:null,
    slyceDropLogicList: [{
      id:null,
      artistAdr:null,
      dropContract:null,
      slyceId: [null],
      tierAvailable: [null],
      amountTier: [null]
    }],
    slyceDropLogicTier: [],
  }
};

const getters = {
  //Version
  getSlyceVersion(state) {
    return state.slyceVersion;
  },
  //DropLogic
  getSlyceDropLogicContract(state) {
    return state.slyceDropLogicContract;
  },
  getSlyceDropLogicAbi(state) {
    return state.slyceDropLogicAbi;
  },
  getSlyceDropLogicAddress(state) {
    return state.slyceDropLogicAddress;
  },
  getSlyceDropLogicList(state) {
    return state.slyceDropLogicList;
  },
  getSlyceDropLogicTier(state) {
    return state.slyceDropLogicTier;
  },

  //DropBuy
  getSlyceDropBuyContract(state) {
    return state.slyceDropBuyContract;
  },
  getSlyceDropBuyAbi(state) {
    return state.slyceDropBuyAbi;
  },
  getSlyceDropBuyAddress(state) {
    return state.slyceDropBuyAddress;
  },

  //Royalties
  getSlyceRoyaltiesContract(state) {
    return state.slyceRoyaltiesContract;
  },
  getSlyceRoyaltiesAbi(state) {
    return state.slyceRoyaltiesAbi;
  },
  getSlyceRoyaltiesAddress(state) {
    return state.slyceRoyaltiesAddress;
  },
};

const actions = {
  async storeSlyceVersion({commit, rootState}) {
    let provider = rootState.accounts.providerEthers;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let slyceDropLogicAddress = addresses.SlyceDropLogic[chainIdDec];

    console.log(provider);
    console.log(chainIdDec);
    console.log(slyceDropLogicAddress);

    let contract = new ethers.Contract(slyceDropLogicAddress, SlyceDropLogic.abi, provider);
    let getVersion = await contract.getVersion();
    let version = getVersion[0] + "." + getVersion[1];
    console.log(version);
    commit("setSlyceVersion", version);
  },
  //SlyceDropLogic
  storeSlyceDropLogicContract({commit, rootState}) {
    let provider = rootState.accounts.providerEthers;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let slyceDropLogicAddress = addresses.SlyceDropLogic[chainIdDec];

    let contract = new ethers.Contract(slyceDropLogicAddress, SlyceDropLogic.abi, provider);
    commit("setSlyceDropLogicContract", contract);
  },

  storeSlyceDropLogicAbi({commit}) {
    commit("setSlyceDropLogicAbi", SlyceDropLogic.abi);
  },
  storeSlyceDropLogicAddress({ commit, rootState }) {
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let slyceDropLogicAddress = addresses.SlyceDropLogic[chainIdDec];

    commit("setSlyceDropLogicAddress", slyceDropLogicAddress);
  },

  // SlyceDropBuy
  storeSlyceDropBuyContract({commit, rootState}) {
    let provider = rootState.accounts.providerEthers;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let slyceDropBuyAddress = addresses.SlyceDropBuy[chainIdDec];

    let contract = new ethers.Contract(slyceDropBuyAddress, SlyceDropBuy.abi, provider);
    commit("setSlyceDropBuyContract", contract);
  },
  storeSlyceDropBuyAbi({commit}) {
    commit("setSlyceDropBuyAbi", SlyceDropBuy.abi);
  },
  storeSlyceDropBuyAddress({ commit, rootState }) {
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let slyceDropBuyAddress = addresses.SlyceDropBuy[chainIdDec];

    commit("setSlyceDropBuyAddress", slyceDropBuyAddress);
  },

  // SlyceRoyalties
  storeSlyceRoyaltiesContract({commit, rootState}) {
    let provider = rootState.accounts.providerEthers;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let slyceRoyaltiesAddress = addresses.SlyceRoyalties[chainIdDec];

    let contract = new ethers.Contract(slyceRoyaltiesAddress, SlyceRoyalties.abi, provider);
    commit("setSlyceRoyaltiesContract", contract);
  },
  storeSlyceRoyaltiesAbi({commit}) {
    commit("setSlyceRoyaltiesAbi", SlyceRoyalties.abi);
  },
  storeSlyceRoyaltiesAddress({ commit, rootState }) {
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let slyceRoyaltiesAddress = addresses.SlyceRoyalties[chainIdDec];

    commit("setSlyceRoyaltiesAddress", slyceRoyaltiesAddress);
  },

  // LOGIC
  async storeSlyceDropLogicList({commit, rootState, getters}) {
    let slyceDropLogicList = [];

    let provider = rootState.accounts.providerEthers;
    let tokenContract;

    let dropCreatedEventFilter = getters.getSlyceDropLogicContract.filters.DropCreated();
    let dropCreatedEvents = await getters.getSlyceDropLogicContract.queryFilter(dropCreatedEventFilter, 28302992);

    let dropMintedEventFilter = getters.getSlyceDropLogicContract.filters.DropMinted();
    let dropMintedEvents = await getters.getSlyceDropLogicContract.queryFilter(dropMintedEventFilter, 28302992);

    let dropMintedEvent = null;

    console.log("DropCreated : " + dropCreatedEvents.length);
    
    for (const [id,event] of dropCreatedEvents.entries()) {
      //Address
      var artistAdr = event.args.artistAdr;
      //Address
      var dropContract = event.args.dropAddress;

      tokenContract = new ethers.Contract(dropContract, SlyceToken.abi, provider);
      var dropMetadata = await tokenContract.contractURI();

      for(var i=0;i<dropMintedEvents.length;i++){
        if(dropMintedEvents[i].args.dropAddress == dropContract){
          console.log("DropMinted ("+dropContract+") : " + dropMintedEvents.length);
          dropMintedEvent = dropMintedEvents[i];
          break;
        }else{
          
          dropMintedEvent = null;
        }
      }
      if(dropMintedEvent == null) {
        console.log("No DropMinted for "+dropContract);
      }
      
      
      //uint256[]
      var amountTier = [];
      //uint256[] -> base16
      var slyceId = [];
      var amountTierPassed = 0;
      //uint256[]
      var tierAvailable = [];
      var tokenMetadata = [];
      var tierAvailableCb;
      for(i=0;i<event.args.amountTierToSold.length;i++){
        amountTier.push(event.args.amountTierToSold[i].toString());
        tierAvailableCb = 0;

        if(dropMintedEvent != null){
          if(dropMintedEvent.args.slyceId.length > amountTierPassed+amountTier[i]) {
            slyceId.push(dropMintedEvent.args.slyceId[amountTierPassed].toHexString());
            tokenMetadata.push(await tokenContract.uri(dropMintedEvent.args.slyceId[amountTierPassed].toHexString()));
            var isPurchasableArray = await getters.getSlyceDropBuyContract.areSlycesPurchasable(dropContract, dropMintedEvent.args.slyceId.slice(amountTierPassed, amountTierPassed+amountTier[i]));
            for(var k=0; k<isPurchasableArray.length; k++){
              tierAvailableCb += isPurchasableArray[k] ? 1 : 0;
            }
          }else if(dropMintedEvent.args.slyceId.length > amountTierPassed){
            slyceId.push(dropMintedEvent.args.slyceId[amountTierPassed].toHexString());
            tokenMetadata.push(await tokenContract.uri(dropMintedEvent.args.slyceId[amountTierPassed].toHexString()));
            for(var j=0;j<amountTier[i];j++){
              if(dropMintedEvent.args.slyceId.length > (amountTierPassed+j)){
                tierAvailableCb += await getters.getSlyceDropBuyContract.isSlycePurchasable(dropContract, dropMintedEvent.args.slyceId[amountTierPassed+j].toString()) ?  1 : 0;
              }
            }
          }
        }

        tierAvailable.push(tierAvailableCb);
        amountTierPassed += parseInt(amountTier[i]);
      }
      slyceDropLogicList.push({id: id, artistAdr: artistAdr, dropContract: dropContract, slyceId: slyceId, dropMetadata: dropMetadata, tokenMetadata: tokenMetadata, amountTier: amountTier, tierAvailable: tierAvailable});
    }
    commit("setSlyceDropLogicList", slyceDropLogicList);
  },
  
};

const mutations = {
  setSlyceVersion(state, version) {
    state.slyceVersion = version;
  },
  // SlyceDropLogic
  setSlyceDropLogicContract(state, contract) {
    state.slyceDropLogicContract = contract;
  },
  setSlyceDropLogicAbi(state, abi) {
    state.slyceDropLogicAbi = abi;
  },
  setSlyceDropLogicAddress(state, address) {
    state.slyceDropLogicAddress = address;
  },
  setSlyceDropLogicList(state, slyceDropLogicList) {
    state.slyceDropLogicList = slyceDropLogicList;
  },
  setSlyceDropLogicTier(state, slyceDropLogicTier) {
    state.slyceDropLogicTier = slyceDropLogicTier;
  },

  // SlyceDropBuy
  setSlyceDropBuyContract(state, contract) {
    state.slyceDropBuyContract = contract;
  },
  setSlyceDropBuyAbi(state, abi) {
    state.slyceDropBuyAbi = abi;
  },
  setSlyceDropBuyAddress(state, address) {
    state.slyceDropBuyAddress = address;
  },

  // SlyceRoyalties
  setSlyceRoyaltiesContract(state, contract) {
    state.slyceRoyaltiesContract = contract;
  },
  setSlyceRoyaltiesAbi(state, abi) {
    state.slyceRoyaltiesAbi = abi;
  },
  setSlyceRoyaltiesAddress(state, address) {
    state.slyceRoyaltiesAddress = address;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
