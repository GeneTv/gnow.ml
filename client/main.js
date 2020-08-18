const app = new Vue({
  el: '#app',
  data: {
    url: '',
    slug: '',
    status: 0,
    message: null,
    complete: true
  },
  methods: {
    async createUrl() {
      this.complete = false
      const res = await fetch('https://gnow.ml/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          destination: this.url,
          slug: this.slug
        })
      })
      this.status = res.status
      var resJson = await res.json()
      this.message = resJson.message
      this.complete = true

      // Reset
      if(res.status == 201) {
        this.error = null
        this.url = ''
        this.slug = ''
      }
    }
  },
  created() {
    var error = window.location.search
    if(error != '') {
      error = error.replace('?error=', '')
      this.slug = error
      this.message = `${error} does not exist. Create it now.`
    }
  }
})