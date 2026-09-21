/*=============== CONTACT FORM ===============*/
(function () {
   'use strict'

   function init() {
      const form = document.getElementById('contact-form')
      const status = document.getElementById('contact-form-status')

      if (!form || !status) {
         return
      }

      const submitButton = form.querySelector('.contact__submit')
      const url = new URL(window.location.href)

      if (url.searchParams.get('message') === 'sent') {
         status.textContent = 'Thank you. Your message has been sent successfully.'
         status.classList.add('is-success')
         url.searchParams.delete('message')
         window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash || '#contact'}`)
      }

      form.addEventListener('submit', function () {
         status.textContent = 'Sending your message...'
         status.className = 'contact__form-status is-loading'

         if (submitButton) {
            submitButton.disabled = true
            submitButton.classList.add('is-loading')
            submitButton.textContent = 'Sending...'
         }
      })

      window.addEventListener('pageshow', function () {
         if (submitButton) {
            submitButton.disabled = false
            submitButton.classList.remove('is-loading')
            submitButton.textContent = 'Send Message'
         }
      })
   }

   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init)
   } else {
      init()
   }
})()
