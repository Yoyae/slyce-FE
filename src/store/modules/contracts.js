import { ethers } from "ethers";
import SlyceDropLogic from "../../contracts/SlyceDropLogic.json";
import SlyceDropBuy from "../../contracts/SlyceDropBuy.json";
import SlyceRoyalties from "../../contracts/SlyceRoyalties.json";
import SlyceToken from "../../contracts/SlyceToken.json";
import addresses from "../../contracts/addresses.json";

const state = {
  num: 0,
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
};

const getters = {
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
  //SlyceDropLogic
  storeSlyceDropLogicContract({commit, rootState}) {
    let provider = rootState.accounts.providerEthers;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let slyceDropLogicAddress = addresses.SlyceDropLogic[chainIdDec];

    let contract = new ethers.Contract(slyceDropLogicAddress, SlyceDropLogic.abi, provider);
    commit("setSlyceDropLogicContract", contract);
  },

  async storeSlyceDropLogicList({commit, rootState}) {
    let slyceDropLogicList = [];

    let provider = rootState.accounts.providerEthers;
    let tokenContract;

    let dropCreatedEventFilter = state.slyceDropLogicContract.filters.DropCreated();
    let dropCreatedEvents = await state.slyceDropLogicContract.queryFilter(dropCreatedEventFilter);

    let dropMintedEventFilter = state.slyceDropLogicContract.filters.DropMinted();
    let dropMintedEvents = await state.slyceDropLogicContract.queryFilter(dropMintedEventFilter);

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
            var isPurchasableArray = await state.slyceDropBuyContract.areSlycesPurchasable(dropContract, dropMintedEvent.args.slyceId.slice(amountTierPassed, amountTierPassed+amountTier[i]));
            for(var k=0; k<isPurchasableArray.length; k++){
              tierAvailableCb += isPurchasableArray[k] ? 1 : 0;
            }
          }else if(dropMintedEvent.args.slyceId.length > amountTierPassed){
            slyceId.push(dropMintedEvent.args.slyceId[amountTierPassed].toHexString());
            tokenMetadata.push(await tokenContract.uri(dropMintedEvent.args.slyceId[amountTierPassed].toHexString()));
            for(var j=0;j<amountTier[i];j++){
              if(dropMintedEvent.args.slyceId.length > (amountTierPassed+j)){
                tierAvailableCb += await state.slyceDropBuyContract.isSlycePurchasable(dropContract, dropMintedEvent.args.slyceId[amountTierPassed+j].toString()) ?  1 : 0;
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
  
};

const mutations = {
  // SlyceDropLogic
  setSlyceDropLogicContract(state, contract) {
    state.slyceDropLogicContract = contract;
  },
  setSlyceDropLogicList(state, slyceDropLogicList) {
    state.slyceDropLogicList = slyceDropLogicList;
  },
  setSlyceDropLogicAbi(state, abi) {
    state.slyceDropLogicAbi = abi;
  },
  setSlyceDropLogicAddress(state, address) {
    state.slyceDropLogicAddress = address;
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
