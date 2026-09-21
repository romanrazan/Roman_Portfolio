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
      const endpoint = form.dataset.ajaxEndpoint

      function setSubmitting(isSubmitting) {
         if (!submitButton) {
            return
         }

         submitButton.disabled = isSubmitting
         submitButton.classList.toggle('is-loading', isSubmitting)
         submitButton.textContent = isSubmitting ? 'Sending...' : 'Send Message'
      }

      form.addEventListener('submit', async function (event) {
         event.preventDefault()

         if (!endpoint) {
            status.textContent = 'The contact service is not configured. Please email me directly at romanrazan2004@gmail.com.'
            status.className = 'contact__form-status is-error'
            return
         }

         status.textContent = 'Sending your message...'
         status.className = 'contact__form-status is-loading'
         setSubmitting(true)

         const formData = new FormData(form)
         const payload = Object.fromEntries(formData.entries())
         delete payload._next

         try {
            const response = await fetch(endpoint, {
               method: 'POST',
               headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify(payload)
            })

            let result = {}

            try {
               result = await response.json()
            } catch (_) {
               result = {}
            }

            const rejected = result.success === false || result.success === 'false'

            if (!response.ok || rejected) {
               throw new Error(result.message || 'The email service could not accept your message.')
            }

            form.reset()
            status.textContent = 'Thank you. Your message was accepted for email delivery.'
            status.className = 'contact__form-status is-success'
         } catch (error) {
            const providerMessage = error instanceof Error ? error.message : ''
            status.textContent = providerMessage || 'Your message could not be sent. Please email me directly at romanrazan2004@gmail.com.'
            status.className = 'contact__form-status is-error'
         } finally {
            setSubmitting(false)
         }
      })

      window.addEventListener('pageshow', function () {
         setSubmitting(false)
      })
   }

   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init)
   } else {
      init()
   }
})()
