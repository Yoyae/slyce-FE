<template>
  
    <div class="popup-outer">
        <div class="popup-inner" :class="popupClass">

            <div class="flex items-center">
                <i class="popup__icon" :class="iconLocal" v-if="iconLocal"></i>
                <div class="popup__title" v-if="title">{{ title }}</div>
            </div>
            <slot></slot>
        </div>
    </div>

</template>

<script>
export default {
    props: ["type", "icon", "title"],
    computed: {
        iconLocal() {
            if(this.icon)
                return this.icon;

            switch (this.type) {
                case 'error':
                    return 'fa-solid fa-circle-exclamation'
                case 'warning':
                    return 'fa-solid fa-circle-exclamation'
                case 'success':
                    return 'fa-solid fa-circle-check'
                case 'info':
                    return 'fa-solid fa-circle-info'
            }
        },
        popupClass() {
            switch (this.type) {
                case 'error':
                    return 'popup-inner--error'
                case 'warning':
                    return 'popup-inner--warning'
                case 'success':
                    return 'popup-inner--success'
                case 'info':
                    return 'popup-inner--info'
            }
        },
        // iconClass() {
        //     switch (this.type) {
        //         case 'error':
        //             return 'popup-icon--error'
        //         case 'warning':
        //             return 'popup-icon--warning'
        //         case 'success':
        //             return 'popup-icon--success'
        //         case 'info':
        //             return 'popup-icon--info'
        //     }
        // }
    }
    // data() {
    //     return {

    //     }
    // }
}
</script>

<style>
    .popup-outer {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, .3);        
        z-index: 1;
    }
    .popup-inner {
        background: #fff;
        padding: 1rem;
        margin: 2rem;
        /* max-width: 600px; */
        border-radius: 1rem;
    }
    .popup-inner--warning {
        background: #FEF6EB;
        border: solid 2px #EE9400;
        box-shadow: 0px 0px 20px -8px #EE9400;
    }
    .popup-inner--success {
        background: #EAF7EE;
        border: solid 2px #3EBE62;
        box-shadow: 0px 0px 20px -8px #3EBE62;
    }
    .popup-inner--info {
        background: #E6EFFA;
        border: solid 2px #006DE5;
        box-shadow: 0px 0px 20px -8px #006DE5;
    }
    .popup__icon {
        font-size: 2rem;
    }
    .popup-inner--warning .popup__icon {
        color: #EE9400;
    }
    .popup-inner--success .popup__icon {
        color: #3EBE62;
    }
    .popup-inner--info .popup__icon {
        color: #006DE5;
    }
    .popup__title {
        padding: 1rem;
        /* font-size: 1.5rem; */
    }
</style>