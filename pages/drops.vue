<template>

    <div v-if="config">

        <header class="header" :class="{'header--slideout': !showHeader}" ref="header">
			<div>
				<img class="header-logo" src="~/assets/img/slyce-logo.png"/>
				<span class="header-version">Beta</span>
			</div>
			<div v-if="!isUserConnected">
				<button class="btn btn--s btn--outline" type="button" @click="connectWeb3Modal">Connect your wallet</button>
			</div>
			<div v-if="isUserConnected">
				<button class="btn btn-outline-danger" type="button">{{getActiveAccount.slice(0,5)}}...{{getActiveAccount.slice(getActiveAccount.length - 5)}}</button>
				<button class="btn btn-outline-danger" type="button"  @click="disconnectWeb3Modal">Disconnect</button>
			</div>
		</header>

		<!-- Cover -->
		<section class="section-cover flex flex-col-reverse lg:flex-row flex-reverse" ref="cover" :style="coverStyle">
			
			<!-- Blocs -->
			<div class="flex-1">
				<div class="card-blur">
					<h1 class="title title--overlay">{{ config.name }}</h1>

					<div class="text-center mb-8">

						<!-- <div class="flex flex justify-center my-8"> -->
						<div class="tags-grid">

							<div class="tag">
								<img :src="artistThumbnailURL" alt="" loading="lazy">
								<span>{{ config.artist.name }}</span>
							</div>
							
							<div class="tag">
								<img :src="dropTypeURL" alt="" loading="lazy">
								<span>{{ dropTypeLabel }}</span>
							</div>

							<div class="tag">
								<span>{{ releaseDateCET }}</span>
							</div>

						</div>
					</div>
					
					<p class="card-text">{{ config.description }}</p>
				</div>
				
				
				<div class="card-blur">
					<h1 class="title title--overlay">{{ config.tiers.length}} Tiers Slyces</h1>

					<div class="flex justify-center mt-8">
						<div class="card-nft-small" v-for="tier of config.tiers" :key="tier.type" @click="participate(tier)">

							<img class="card-nft-small__image" :src="getFullURL(tier.image)" alt="">
	
							<div class="card-nft-small__title">{{ tier.type }}</div>
							<div>{{ tier.tokensAmount }} tokens</div>
							<div>${{ tier.price }}</div>
	
						</div>
					</div>

					<div class="text-center mt-12">
						<a class="btn btn--cta" href="#title-slyces">
							I want my Slyce
						</a>
					</div>
					
				</div>
				
				
				<div class="card-blur">
					<h1 class="title title--overlay">Listen & Follow</h1>

					<!-- TODO: embed spotify -->

					<div class="text-center mt-12">
						
						<a class="link-icon m-2" :href="config.social.instagram" v-if="config.social.instagram" target="_blank">
							<i class="fa-brands fa-instagram"></i>
						</a>
											
						<a class="link-icon m-2" :href="config.social.facebook" v-if="config.social.facebook" target="_blank">
							<i class="fa-brands fa-facebook"></i>
						</a>
											
						<a class="link-icon m-2" :href="config.social.twitter" v-if="config.social.twitter" target="_blank">
							<i class="fa-brands fa-twitter"></i>
						</a>
						
						<a class="link-icon m-2" :href="config.social.spotify" v-if="config.social.spotify" target="_blank">
							<i class="fa-brands fa-spotify"></i>
						</a>
						
						<a class="link-icon m-2" :href="config.social.youtube" v-if="config.social.youtube" target="_blank">
							<i class="fa-brands fa-youtube"></i>
						</a>

						<a class="link-icon m-2" :href="config.social.applemusic" v-if="config.social.applemusic" target="_blank">
							<i class="fa-brands fa-apple"></i>
						</a>

					</div>
					
				</div>
				
			</div>
			
			<!-- Vidéo -->
			<div class="section-cover-video-container flex-1 flex flex-col lg:sticky">

				<div class="flex-1 self-center flex justify-between items-center">
				
					<div class="video-thumbnail mt-16 mb-8 lg:my-0" @click="showVideoModal = true">
						<img class="video-thumbnail-image" :src="videoThumbnailURL" alt="">
						<div class="video-thumbnail-button">
							<i class="fa-solid fa-play"></i>
						</div>
					</div>

				</div>

				<div class="countdown self-center lg:self-end py-8">
					<div class="countdown-item">{{timeleft.days}}d</div>
					<div class="countdown-item">{{timeleft.hours}}h</div>
					<div class="countdown-item">{{timeleft.minutes}}m</div>
					<div class="countdown-item">{{timeleft.seconds}}s</div>
				</div>

			</div>

		</section>

		<!-- <div ref="foldbreak" style="height: 5px; background: red; width: 100%;"></div> -->

		<!-- Page -->
		<section class="page-container">
			<h1 class="title title--large" id="title-slyces">The Slyces</h1>

			<!-- <div class="grid grid-cols-3 gap-8"> -->
			<div class="flex flex-col md:flex-row justify-center">

				<div class="card-nft-large m-4 flex-1" v-for="tier of config.tiers" :key="tier.type">
	
					<header class="card-nft-large__header">
						<img class="card-nft-large__image" :src="getFullURL(tier.image)" alt="">
						<div class="card-nft-large__title">{{ tier.type }} Slyce</div>
					</header>
	
					<div class="card-nft-large__content flex-1">
	
						<div class="card-nft-large__subcard">
	
							<div class="p-4">
	
								<h1 class="title title--small">{{ tier.percent }}%</h1>

								<div class="subtitle text-center">
									Royalties Ownership
								</div>

								<div class="p-4">	
									<div v-for="benefit of tier.benefits" :key="benefit">
										<i class="fa-solid fa-check mr-2"></i>
										<span>{{ benefit }}</span>
									</div>
								</div>
								
							</div>
	
							<div class="card-nft-large__subcard-footer">
								${{ tier.price }}
							</div>
						</div>

					</div>
						
					<div class="card-nft-large__content text-center">
	
						<div class="mb-2">
							<button class="btn btn--cta" @click="participate(tier)">Participate</button>
						</div>
						<div>{{ getTokenLeft(tier) }} / {{ tier.tokensAmount }} tokens left</div>
	
					</div>
	
				</div>

			</div>

			<div class="text-center mt-16 mb-12">
				<hr class="separator">
			</div>

			<!-- Stats -->
			<div>
				<h2 class="title title--large">Other Stuff</h2>
			</div>

			<div class="card-stat mb-8">

				<div class="card-stat__label">
					<div class="title">Drop</div>
					<div class="title title--small">
						<div class="text-right">
							Stats
						</div>
					</div>
				</div>

				<div class="flex justify-around flex-1">

					<div class="text-center">
						<div class="title">1 100</div>
						<div>Tokens (3 tiers)</div>
					</div>
	
					<div class="text-center">
						<div class="title">15%</div>
						<div>Publishing rights offered</div>
					</div>
	
					<div class="text-center">
						<div class="title">$158K</div>
						<div>USD to be raised</div>
					</div>

				</div>

			</div>

			<div class="card-stat mb-8">

				<div class="card-stat__label">
					<div class="title">Tokens</div>
					<div class="title title--small">
						<div class="text-right">
							Infos
						</div>
					</div>
				</div>

				<div class="ml-8">
					<div>
						<b>Drop:</b> Man on The Moon III – Kid Cudi
					</div>
					<div>
						<b>Blockchain:</b> Ethereum
					</div>
					<div>
						<b>Contract Address:</b> <a class="link font-bold" href="#">0x1c88…5847</a>
					</div>
					<div>
						<b>Legal:</b> <a class="link font-bold" href="#">Read it</a>
					</div>
				</div>
				
			</div>

		</section>
		
		<!-- Footer -->
		<footer class="page-footer p-8 flex justify-between items-center">

			<div>
				© 2022 — slyce.one
			</div>

			<div>
				<button class="btn">Contact us</button>
			</div>

		</footer>

		<!-- Modal -->
		<div class="modal" v-if="showVideoModal" @click="showVideoModal = false">
			<div class="modal-container">
				<div class="modal-ratio-169">
					<iframe :src="videoIframeURL" allowfullscreen="1"></iframe>
				</div>
			</div>
		</div>

		<!-- Popups -->
		<Popup :type="'error'" :title="alertError" v-if="alertError" @click.native="alertError = null"></Popup>
		<Popup :type="'warning'" :title="alertWarning" v-if="alertWarning" @click.native="alertWarning = null"></Popup>
		<Popup :type="'success'" :title="alertSuccess" v-if="alertSuccess" @click.native="alertSuccess = null"></Popup>
		<Popup :type="'info'" :title="alertInfo" v-if="alertInfo" @click.native="alertInfo = null"></Popup>

		<!-- Popup quantity -->
		<!-- <Popup v-if="showConfirmationPopup"> -->
		<Popup v-if="popupState == 'confirm-quantity'">
			<div class="text-center" style="width: 650px;">
				<div class="p-4">
					<div class="title title--small whitespace-nowrap">
						How many Slyces do you want ?
					</div>
				</div>

				<hr class="separator">

				<div class="mt-2">
					<div class="card-nft-mini" v-if="selectedTier">
						{{ selectedTier.type }}
					</div>
				</div>
				
				<div class="flex">
					<div class="flex-1"></div>
					<div class="flex items-center">
						<button class="btn btn--clear btn--s" @click="selectedAmount>1?selectedAmount--:null">
							<i class="fa-solid fa-fw fa-minus"></i>
						</button>
						<div style="padding: 1rem 2rem; font-size: 2rem;">
							{{ selectedAmount }}
						</div>
						<!-- <input type="number" v-model="selectedAmount" required style="margin: 0 1rem; padding: .5rem 0 .5rem 1rem; width: 3rem;">  -->
						<button class="btn btn--clear btn--s" @click="selectedAmount<getTokenLeft(tier)?selectedAmount++:null">
							<i class="fa-solid fa-fw fa-plus"></i>
						</button>
					</div>
					<div class="flex-1"></div>
				</div>

				<div class="text-center">
					Max : {{ getTokenLeft(tier) }}
				</div>

				<hr class="separator">

				<div class="p-4 flex justify-between">
					<button class="btn btn--light" @click="cancel">Cancel</button>
					<button class="btn" @click="confirm">Next</button>
				</div>
			</div>
		</Popup>

		<!-- Popup payment method -->
		<!-- <Popup v-if="showConfirmationPopup"> -->
		<Popup v-if="popupState == 'payment-method'">
			<div class="text-center" style="width: 650px;">
				<div class="p-4">
					<div class="title title--small whitespace-nowrap">
						Payment method
					</div>
				</div>

				<hr class="separator">

				<div class="p-2">
					Select a prefered payment method
				</div>

				<div class="p-2">
					<button class="btn w-full" @click="pay('card')">
						Card
					</button>
				</div>

				<div class="p-2">
					<button class="btn w-full" @click="pay('crypto')">
						Crypto
					</button>
				</div>

				<div class="p-2">
					By making a selection, you agree to the Therms of Service and acknowledge that purchases are final and non-refundable
				</div>

				<hr class="separator">

				<div class="p-4">
					<button class="btn btn--light" @click="cancel">Cancel</button>
					<!-- <button class="btn" @click="confirm">Confirm</button> -->
				</div>
			</div>
		</Popup>

		<!-- Popup payment method -->
		<Popup v-if="popupState == 'crypto-transaction'">
			<div style="width: 1000px;">
				<div class="flex">
					<!-- Left -->
					<div class="flex-1 flex flex-col">

						<div class="flex-1 flex items-center justify-center">

							<div style="width: 300px;">
								<header class="card-nft-large__header">
									<img class="card-nft-large__image" :src="getFullURL(selectedTier.image)" alt="">
									<div class="card-nft-large__title">{{ selectedTier.type }} Slyce</div>
								</header>

							</div>

						</div>

						<div>
							<div>
								<b>{{ config.name }}</b>
							</div>
							<div class="flex justify-between">
								<div>
									{{ config.artist.name }}
								</div>
								<div>
									{{ selectedTier.type}}
								</div>
							</div>
							<hr/>
							<div class="flex justify-between">
								<div>
									Total
								</div>
								<div>
									{{ selectedAmount }}
									x
									{{ selectedTier.price }}
									=
									{{ selectedAmount * selectedTier.price }}
									$
								</div>
							</div>
						</div>

					</div>
					<!-- Right -->
					<div class="flex-1 flex items-center justify-center">

						<div class="text-center m-4">
							<div class="p-4">
								<div class="title title--small whitespace-nowrap">
									1. Approuve transaction
								</div>
							</div>
							<div class="p-4">
								Sign in using you wallet
							</div>
							<div class="p-4">
								<button class="btn" :disabled="transactionState.approuve != 0" @click="approuve">
									<i class="fa-solid fa-spinner fa-spin mr-2" v-if="transactionState.approuve == 1"></i>
									<i class="fa-solid fa-check" v-if="transactionState.approuve == 2"></i>
									<span v-if="transactionState.approuve == -1">Approuve</span>
									<span v-if="transactionState.approuve == 0">Approuve</span>
									<span v-if="transactionState.approuve == 1">Approuving</span>
									<span v-if="transactionState.approuve == 2">Approuved</span>
								</button>
							</div>
							
							<hr class="separator">

							<div class="p-4">
								<div class="title title--small whitespace-nowrap">
									2. Send transaction
								</div>
							</div>
							<div class="p-4">
								Complet transaction by sending the transaction to the network
							</div>
							<div class="p-4">
								<button class="btn" :disabled="transactionState.send != 0" @click="send">
									<i class="fa-solid fa-spinner fa-spin mr-2" v-if="transactionState.send == 1"></i>
									<i class="fa-solid fa-check" v-if="transactionState.send == 2"></i>
									<span v-if="transactionState.send == -1">Send</span>
									<span v-if="transactionState.send == 0">Send</span>
									<span v-if="transactionState.send == 1">Sending</span>
									<span v-if="transactionState.send == 2">Sent</span>
								</button>
							</div>
						</div>

					</div>
				</div>

				<div class="text-center">

					<!-- <hr class="separator"> -->
					
					<div class="p-4">
						<button class="btn btn--light" @click="cancel">Cancel</button>
						<!-- <button class="btn" @click="f">Confirm</button> -->
					</div>
					
				</div>
			</div>
		</Popup>


		<Popup v-if="showTransactionPopup">
			<div class="text-center">
				<div class="pt-8">
					<!-- <i class="fa-solid fa-circle-up" style="font-size: 3rem;"></i> -->
					<i class="fa-solid fa-circle-notch fa-spin" style="font-size: 3rem;"></i>
				</div>
				<div class="p-4">
					<div class="title title--small">
						Transaction has
						<br>
						been submitted
					</div>
				</div>
				<div class="flex">
					<div class="flex-1"></div>
					<div class="flex-1"><hr></div>
					<div class="flex-1"></div>
				</div>

				<div class="p-4">
					<a href="https://polygonscan.com/">View on polygonscan.com ></a>
				</div>
			</div>
		</Popup>

    </div>
  
</template>

<script>
import Popup from '@/components/popup.vue';
import { ethers } from "ethers";
import { mapGetters, mapActions } from "vuex";
import { urlToHttpOptions } from 'url';
import { runInThisContext } from 'vm';

export default {
	layout: 'drop',
	components: [
		Popup
	],
    data() {
        return {
			showHeader: false,

            dropToken: null,
            dropUrl: null,
            config: null,

			tiers: [],

			selectedTier: null,
			selectedAmount: 1,

            showVideoModal: false,
			showConfirmationPopup: false,
			showTransactionPopup: false,

			popupState: null, // confirm-quantity | payment-method | crypto-transaction
			transactionState: { // -1:disabled | 0: still | 1: running | 2:done
				approuve: 0,
				send: -1,
			},

			alertWarning: null,
			alertSuccess: null,
			alertInfo: null,

			timeleft: {
				days: 1,
				hours: 2,
				minutes: 3,
				seconds: 4,
			}
        }
    },
    computed: {
		...mapGetters("accounts", ["getActiveAccount", "getProviderEthers", "isUserConnected", "getWeb3Modal"]),
		...mapGetters("contracts", ["getSlyceDropLogicContract", "getSlyceDropLogicAbi", "getSlyceDropLogicAddress", "getSlyceDropLogicTier", "getSlyceDropBuyContract", "getSlyceDropBuyAbi", "getSlyceDropBuyAddress"]),
		coverStyle() {
            if(!this.config)
                return {};

            return {
                backgroundImage: `url(${this.dropUrl + this.config.medias.cover})`
            }
        },
        artistThumbnailURL() {
            if(!this.config)
                return;

            return `${this.dropUrl + this.config.artist.thumbnail}`;
        },
        videoThumbnailURL() {
            if(!this.config)
                return;

            return `${this.dropUrl + this.config.medias.video.thumbnail}`;
        },
        videoIframeURL() {
            if(!this.config)
                return;

            return this.config.medias.video.url;
        },
        dropTypeURL() {					
            if(!this.config)
                return null;

            switch (this.config.type) {
                case "album":
                    return require('~/assets/img/album.png');
            }
            
            return null;
        },
        dropTypeLabel() {					
            if(!this.config)
                return null;

            switch (this.config.type) {
                case "album":
                    return 'Album';
            }
            
            return null;
        },
        /*
         * Format de sortie : 09/30/2022 | 19:00 CET
         */
        releaseDateCET() {			
            if(!this.config)
                return;
            
            let date = new Date(this.config.releaseDate);
            let year = date.getFullYear();
            let month = `${ date.getMonth() + 1 }`.padStart(2, 0);
            let day = `${ date.getDate()}`.padStart(2, 0);
            let hours = `${ date.getHours() }`.padStart(2, 0);
            let minutes = `${ date.getMinutes() }`.padStart(2, 0);
    
            return `${day}/${month}/${year} | ${hours}:${minutes} CET`;
        }
    },
    async created() {
        // this.dropToken = this.$route?.params?.token;
		let URLParams = new URLSearchParams(window.location.search);
		this.dropToken = URLParams.get('ref');

        if(!this.dropToken)
            return this.redirectHomepage();

        // Récupération de la configuration
        this.dropUrl = "/drops-data/" + this.dropToken + "/";

        let url = this.dropUrl + "infos";

        let response, config
        
        try {
            response = await fetch(url);
            config = await response.json();
        } catch (error) {
            return this.redirectHomepage();            
        }
        
        this.setPageTitle(config.name);

        this.config = config;

		//Web3
		await this.$store.dispatch("accounts/initWeb3Modal",);
    	await this.$store.dispatch("accounts/ethereumListener");

		if (!this.getProviderEthers) {
			for(const [id, tier] of this.config.tiers.entries()){
				this.tiers.push(tier.availableAmount);
			}
		} else {
			this.$store.dispatch("contracts/storeSlyceDropLogicAbi");
			this.$store.dispatch("contracts/storeSlyceDropLogicAddress");
			this.$store.dispatch("contracts/storeSlyceDropLogicContract");
			this.$store.dispatch("contracts/storeSlyceDropBuyAbi");
			this.$store.dispatch("contracts/storeSlyceDropBuyAddress");
			this.$store.dispatch("contracts/storeSlyceDropBuyContract");
			let signer = this.getProviderEthers.getSigner(); 
			let logicContract = new ethers.Contract(this.getSlyceDropLogicAddress, this.getSlyceDropLogicAbi, signer);
			let result = await logicContract.getDropStatus(this.config.contract);

			for(const [id, tier] of result[1].entries()){
				this.tiers.push(tier);
			}
		}

    },
	mounted() {
		// Header / scroll
		let _this = this;
		setTimeout(() => {
			let cover = _this.$refs.cover;
			document.body.onscroll = (el) => {
				if(window.scrollY + window.innerHeight > cover.offsetTop + cover.offsetHeight)
					_this.showHeader = true;
				else
					_this.showHeader = false;
			}
		}, 500)
	},
    methods: {
		...mapActions("accounts", ["connectWeb3Modal", "disconnectWeb3Modal"]),
        watchScoll() {
            // Quand la cover sort du champ, afficher le header
        },
        redirectHomepage() {
            return this.$router.push("/");
        },
        setPageTitle(dropName) {
            document.title = `Slyce x ${dropName}`; // TODO: store
        },
        getFullURL(url) {
            return `${this.dropUrl + url}`;
        },
        getTokenLeft(tier) {

			// TODO François récupèrer le nombre de parts restantes via blockchain
			return 10; // TEST

            if(tier)
				return this.tiers[tier.id];
            else
                return 0;
        },
        participate(tier) {
			this.selectedTier = tier;
			this.selectedAmount = 1;
			this.popupState = 'confirm-quantity';
        },
		cancel() {
			this.selectedTier = null;
			this.popupState = null;
		},
		confirm() {
			this.popupState = 'payment-method';
		},
		pay(method) {
			switch(method) {
				case 'crypto':
					this.transactionState.approuve = 0;
					this.transactionState.send = -1;
					this.popupState = 'crypto-transaction';
					break;
				case 'card':
					// this.popupState = '';
					// TODO
					break;
			}
		},
		approuve() {
			let _this = this;
			this.transactionState.approuve = 1;
			setTimeout(() => { // SIMULATION
				_this.transactionState.approuve = 2;
				_this.transactionState.send = 0;
			}, 2000);
		},
		send() {
			let _this = this;
			this.transactionState.send = 1;
			setTimeout(() => { // SIMULATION
				_this.transactionState.send = 2;
			}, 2000);
			setTimeout(() => { // SIMULATION
				_this.popupState = null;
				_this.alertSuccess = "Congratulation ! You're Slyce is now in you wallet.";
			}, 4000);
		},
		async confirmSAVE() {
			this.showConfirmationPopup = false;
			this.showTransactionPopup = true;

			if (!this.getProviderEthers) {
				setTimeout(() => {
					this.showTransactionPopup = false;
					this.alertWarning = "No wallet connected";
				}, 500)
			} else if(parseInt(this.selectedAmount) > this.tiers[this.selectedTier.id]) {
				// TODO François : gestion de l'erreur
				setTimeout(() => {
					this.showTransactionPopup = false;
					this.alertWarning = "Invalid Amount";
				}, 500)
			} else {
				let buyContract = new ethers.Contract(this.getSlyceDropBuyAddress, this.getSlyceDropBuyAbi, this.getProviderEthers.getSigner());
		
				let approveABI = ["function approve(address _spender, uint256 _value) public returns (bool success)"]
      			let usdcContract = new ethers.Contract(await buyContract.usdcContract(), approveABI, this.getProviderEthers.getSigner());
				let price = (this.selectedTier.price * parseInt(this.selectedAmount) /* * Math.pow(10,18) */).toString();
				//Partie 1
				await usdcContract.approve(this.getSlyceDropBuyAddress,  price);

				//Partie 2
				let purshaseResult = await buyContract.purchaseDrop(this.config.contract, this.selectedTier.id, parseInt(this.selectedAmount));
				// purshaseResult contient le tx si la transaction a été envoyé, sinon le message d'erreur
				// TODO : faire les slides d'après (attente confirmation into confirmation de l'achat)
				


				setTimeout(() => {
					this.showTransactionPopup = false;
					this.alertSuccess = "Congratulation ! You're Slyce is now in you wallet.";
				}, 3000)
			}
		}
    }
}
</script>