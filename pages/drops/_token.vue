<template>

    <div v-if="config">

        <header>
			<!-- TODO -->
		</header>

		<!-- Cover -->
		<section class="section-cover flex" :style="coverStyle">
			
			<!-- Blocs -->
			<div class="flex-1">
				
				<div class="card-blur">
					<h1 class="title title--overlay">{{ config.name }}</h1>

					<div class="flex flex justify-center my-8">

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
					
					<p class="card-text">{{ config.description }}</p>
				</div>
				
				
				<div class="card-blur">
					<h1 class="title title--overlay">{{ config.tiers.length}} Tiers Slyces</h1>

					<div class="flex justify-center mt-8">
						<div class="card-nft-small" v-for="tier of config.tiers" :key="tier" @click="participate(tier)">

							<img class="card-nft-small__image" :src="getFullURL(tier.image)" alt="">
	
							<div class="card-nft-small__title">{{ tier.type }}</div>
							<div>{{ tier.tokens }} tokens</div>
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
			<div class="section-cover-video-container flex-1" @click="showVideoModal = true">
				
				<div class="video-thumbnail">
					<img class="video-thumbnail-image" :src="videoThumbnailURL" alt="">
					<div class="video-thumbnail-button">
						<i class="fa-solid fa-play"></i>
					</div>
				</div>

			</div>

		</section>

		<!-- Page -->
		<section class="page-container">
			<h1 class="title title--large" id="title-slyces">The Slyces</h1>

			<!-- <div class="grid grid-cols-3 gap-8"> -->
			<div class="flex justify-center">

				<div class="card-nft-large m-4 flex-1" v-for="tier of config.tiers" :key="tier">
	
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
						<div>{{ getTokenLeft(tier) }} / {{ tier.tokens }} tokens left</div>
	
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
		<Popup :type="'warning'" :title="alertWarning" v-if="alertWarning" @click.native="alertWarning = null"></Popup>
		<Popup :type="'success'" :title="alertSuccess" v-if="alertSuccess" @click.native="alertSuccess = null"></Popup>
		<Popup :type="'info'" :title="alertInfo" v-if="alertInfo" @click.native="alertInfo = null"></Popup>
		<Popup v-if="showConfirmationPopup">
			<div class="text-center">
				<div class="pt-8">
					<i class="fa-solid fa-circle-up" style="font-size: 3rem;"></i>
				</div>
				<div class="p-4">
					<div class="title title--small">
						You are going to purchase
					</div>
					<div class="card-nft-mini mt-2" v-if="selectedTier">
						{{ selectedTier.type }}
					</div>
				</div>
				<div class="flex">
					<div class="flex-1"></div>
					<div class="flex-1"><hr></div>
					<div class="flex-1"></div>
				</div>

				<div class="p-4 flex justify-between">
					<button class="btn btn--light" @click="cancel">Cancel</button>
					<button class="btn" @click="confirm">Confirm</button>
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

export default {
	layout: 'drop',
	components: [
		Popup
	],
    data() {
        return {
            dropToken: null,
            dropUrl: null,
            config: null,

			selectedTier: null,

            showVideoModal: false,
			showConfirmationPopup: false,
			showTransactionPopup: false,

			alertWarning: null,
			alertSuccess: null,
			alertInfo: null,
        }
    },
    computed: {
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
        this.dropToken = this.$route?.params?.token;

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
    },
    methods: {
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
            // FRANCOIS : Récupèrer l'information via la blockchain (peut être de manière global à l'initialisation)
            if(tier)
                return 1;
            else
                return 0;
        },
        participate(tier) {
			this.selectedTier = tier;
			this.showConfirmationPopup = true;

			console.log(window);
        },
		cancel() {
			this.selectedTier = null;
			this.showConfirmationPopup = false;
		},
		confirm() {
			this.showConfirmationPopup = false;
			this.showTransactionPopup = true;

			// FRANCOIS : Action BlockChain
		
			let _this = this;
			setTimeout(() => {
				this.showTransactionPopup = false;
				this.alertSuccess = "Congratulation ! You're Slyce is now in you wallet.";
			}, 3000)
		}
    }
}
</script>