export default {
  name: "App",

  components: {},

  data: () => ({
    loading: false,
    validated: false,
    alertSuccess: {
      active: false,
      slug: ''
    },
    url: {
      input: '',
      hasError: false
    },
    slug: {
      input: '',
      isFree: false,
      isUsed: false,
      hasError: false
    },

    required(propertyType) {
      return v => v && v.length > 0 || `${propertyType} is required.`
    },
    minLength(minLength) {
      return v => v && v.length >= minLength || `Minimum ${minLength} characters required.`
    },
    validURL() {
      return v => {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return v && !!pattern.test(v) || `Invalid URL.`
      }
    }
  }),
  methods: {
    async createSlug() {
      if (!this.validated) return

      this.loading = true
      const res = await fetch('https://gnow.ml/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: this.url.input,
          slug: this.slug.input
        })
      }).catch(() => {
        alert('errar')
        this.loading = false
        return;
      })

      // Request is done.
      this.loading = false
      const data = await res.json();

      this.url.hasError = false
      this.slug.isUsed = false
      this.slug.hasError = false


      switch (res.status) {
        case 201:
          // Success. Slug created.
          this.$refs.form.reset()

          this.alertSuccess.active = true
          this.alertSuccess.url = data.urlShorted
          this.slug.isFree = false
          break;

        case 200:
          // Failed. Slug existing.
          this.slug.isUsed = true
          break;

        case 400:
          // Bad request.
          if (data.errors.includes('URL')) this.url.hasError = true
          if (data.errors.includes('SLUG')) this.slug.hasError = true
          break;

        default:
          // Server error
          break;
      }
    }
  },
  created() {
    var error = window.location.search
    if (error != '') {
      error = error.replace('?error=', '')
      this.slug.input = error
      this.slug.isFree = true
      history.pushState({}, '', '/')
    }
  }
};