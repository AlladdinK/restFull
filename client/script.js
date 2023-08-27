import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.7.8/dist/vue.esm.browser.js'

new Vue({
  el: '#app',
  data() {
    return {
      form: {
        name: '',
        desc: '',
      },
      contacts: []
    }
  },
  computed: {
    canCreate() {
      return this.form.name.trim() && this.form.desc.trim()
    }
  },
  methods: {
    async createContact() {
      const {
        ...contact
      } = this.form
      const newContact = await request('/api/contacts', 'POST', contact)
      this.contacts.push(newContact)
      this.form.name = this.form.desc = ''
    },
    async markContact(id) {
      let contact = this.contacts.find((item) => item.id === id)
      const updated = await request(`/api/contacts/${id}`, 'PUT', {
        ...contact,
        marked: true
      })
      contact.marked = updated.marked
    },
    async removeContact(id) {
      await request(`/api/contacts/${id}`, 'DELETE')
      this.contacts = this.contacts.filter(item => item.id !== id)
    }
  },
  async mounted() {
    this.contacts = await request('/api/contacts')

  },
})

async function request(url, method = "GET", data = null) {
  try {
    const headers = {}
    let body
    if (data) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(data)
    }
    const response = await fetch(url, {
      method,
      headers,
      body
    })
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}