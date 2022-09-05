import Vue from 'vue';
import Vuex from 'vuex';
import accounts from "@/store/accounts";
import contracts from "@/store/contracts";

Vue.use(Vuex);

export default () => new Vuex.Store({
    modules: {
        accounts,
        contracts
    }
});