<template>
  <Nuxt />
</template>

<script>
export default {
  name: 'DropLayout',
  head() {
    return {
      link: [
        { rel: 'stylesheet', href: require('~/assets/css/drop.css') },
        { rel: 'stylesheet', href: require('~/assets/lib/fontawesome-free-6.1.1-web/css/all.min.css') }
      ],
    }
  }
}
</script>