import Web3Modal from "web3modal";
import { ethers } from "ethers";
import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";
import Authereum from "authereum";

const state = function() {
  return {
    activeAccount: null,
    activeBalance: 0,
    chainId: null,
    chainName: null,
    providerEthers: null, // this is "provider" for Ethers.js
    isConnected: false,
    providerW3m: null, // this is "provider" from Web3Modal
    web3Modal: null
  }
};

const getters = {
  getActiveAccount(state) {
    return state.activeAccount;
  },
  getActiveBalanceWei(state) {
    return state.activeBalance;
  },
  getActiveBalanceEth(state) {
    return ethers.utils.formatEther(state.activeBalance);
  },
  getChainId(state) {
    return state.chainId;
  },
  getChainName(state) {
    return state.chainName;
  },
  getProviderEthers(state) {
    return state.providerEthers;
  },
  getWeb3Modal(state) {
    return state.web3Modal;
  },
  isUserConnected(state) {
    return state.isConnected;
  },
  getProviderW3m(state) {
    return state.providerW3m;
  }
};

const actions = {

  async initWeb3Modal({ commit, getters }) {
    const providerOptions = {
      // MetaMask is enabled by default
      // Find other providers here: https://github.com/Web3Modal/web3modal/tree/master/docs/providers
      burnerconnect: {
        package: BurnerConnectProvider // required
      },
      authereum: {
        package: Authereum // required
      }
    };
    const w3mObject = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions // required
    });

    // This will get deprecated soon. Setting it to false removes a warning from the console.
    window.ethereum.autoRefreshOnNetworkChange = false;

    // if the user is flagged as already connected, automatically connect back to Web3Modal
    if (localStorage.getItem('isConnected') === "true") {
      let providerW3m = await w3mObject.connect();
      commit("setIsConnected", true);

      commit("setActiveAccount", window.ethereum.selectedAddress);
      commit("setChainData", window.ethereum.chainId);
      commit("setEthersProvider", providerW3m); // BUG: problème au niveau de la mutation de l'objet passé en paramètre
      actions.fetchActiveBalance({ commit, getters });
    }

    commit("setWeb3Modal", w3mObject);
  },

  async connectWeb3Modal({ commit, getters }) {
    //let providerW3m = await state.web3Modal.connect();
    let providerW3m = await getters.getWeb3Modal.connect();
    commit("setIsConnected", true);

    commit("setActiveAccount", window.ethereum.selectedAddress);
    commit("setChainData", window.ethereum.chainId);
    commit("setEthersProvider", providerW3m);
    actions.fetchActiveBalance({ commit, getters });
  },

  async disconnectWeb3Modal({ commit }) {
    commit("disconnectWallet");
    commit("setIsConnected", false);
  },

  async ethereumListener({ commit, getters }) {

    window.ethereum.on('accountsChanged', (accounts) => {
      if (getters.isUserConnected()) {
        commit("setActiveAccount", accounts[0]);
        commit("setEthersProvider", getters.getProviderW3m);
        actions.fetchActiveBalance({ commit, getters });
      }
    });

    window.ethereum.on('chainChanged', (chainId) => {
      commit("setChainData", chainId);
      commit("setEthersProvider", getters.getProviderW3m);
      actions.fetchActiveBalance({ commit, getters });
    });

  },

  async fetchActiveBalance({ commit, getters }) {
    let balance = await getters.getProviderEthers.getBalance(getters.getActiveAccount);
    commit("setActiveBalance", balance);
  }
  
};

const mutations = {

  async disconnectWallet(state) {
    state.activeAccount = null;
    state.activeBalance = 0;
    state.providerEthers = null;
    if (state.providerW3m.close && state.providerW3m !== null) {
      await state.providerW3m.close();
    }
    state.providerW3m = null;
    await state.web3Modal.clearCachedProvider();

    window.location.href = '../'; // redirect to the Main page
  },

  setActiveAccount(state, selectedAddress) {
    state.activeAccount = selectedAddress;
  },

  setActiveBalance(state, balance) {
    state.activeBalance = balance;
  },

  setChainData(state, chainId) {
    state.chainId = chainId;

    switch(chainId) {
      case "0x1":
        state.chainName = "Mainnet";
        break;
      case "0x2a":
        state.chainName = "Kovan";
        break;
      case "0x3":
        state.chainName = "Ropsten";
        break;
      case "0x4":
        state.chainName = "Rinkeby";
        break;
      case "0x5":
        state.chainName = "Goerli";
        break;
      case "0x13881":
        state.chainName = "Mumbai";
        break;
      case "0x539": // 1337 (often used on localhost)
      case "0x1691": // 5777 (default in Ganache)
      case "0x1337": // 7545 (default in Ganache)
      default:
        state.chainName = "Localhost";
        break;
    }
  },

  async setEthersProvider(state, providerW3m) {
    state.providerW3m = providerW3m;
    state.providerEthers = new ethers.providers.Web3Provider(providerW3m);
  },

  setIsConnected(state, isConnected) {
    state.isConnected = isConnected;
    // add to persistent storage so that the user can be logged back in when revisiting website
    localStorage.setItem('isConnected', isConnected);
  },

  setWeb3Modal(state, w3mObject) {
    state.web3Modal = w3mObject;
  }

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
