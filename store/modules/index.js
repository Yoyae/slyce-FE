import Vue from 'vue';
import Vuex from 'vuex';
import accounts from "@/store/modules/accounts";
import contracts from "@/store/modules/contracts";

Vue.use(Vuex);

export default () => new Vuex.Store({
    modules: {
        accounts,
        contracts
    }
});