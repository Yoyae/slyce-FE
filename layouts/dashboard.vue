<template>
  <div>

    <Navbar />

    <div class="container-fluid">
      <div class="row">

        <Sidebar/>

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
  
          <Nuxt />

          <!-- <keep-alive>
            <router-view />
          </keep-alive> -->

        </main>
      </div>
    </div>

  </div>
</template>

<script>
import Navbar from '~/components/navbar.vue';
import Sidebar from '~/components/sidebar.vue';

export default {
  name: 'DefaultLayout',
  head() {
    return {
      link: [
        { rel: 'stylesheet', href: require('~/assets/css/dashboard.css') },
        { rel: 'stylesheet', href: require('~/assets/lib/bootstrap/bootstrap.min.css') }
      ],
    }
  },
  components: {
    Navbar,
    Sidebar
  }
}
</script>
