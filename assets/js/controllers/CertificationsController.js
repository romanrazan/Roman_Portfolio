/**
 * Certifications carousel - two cards per page on desktop, one on mobile.
 */
(function () {
   'use strict'

   const DESKTOP_BREAKPOINT = 768
   const GAP = 16

   function init() {
      const carousel = document.getElementById('certifications-carousel')
      const viewport = document.getElementById('certifications-viewport')
      const track = document.getElementById('certifications-track')
      const slides = Array.from(document.querySelectorAll('.certifications__slide'))
      const dotsContainer = document.getElementById('certifications-dots')
      const counter = document.getElementById('certifications-counter')
      const previous = document.getElementById('certifications-prev-btn')
      const next = document.getElementById('certifications-next-btn')

      if (!carousel || !viewport || !track || !slides.length || !dotsContainer) return

      let currentPage = 0
      let touchStartX = 0

      function getPerView() {
         return window.innerWidth >= DESKTOP_BREAKPOINT ? 2 : 1
      }

      function getTotalPages() {
         return Math.ceil(slides.length / getPerView())
      }

      function getSlideWidth() {
         const perView = getPerView()
         return Math.floor((viewport.clientWidth - GAP * (perView - 1)) / perView)
      }

      function updateCounter() {
         const perView = getPerView()
         const start = currentPage * perView + 1
         const end = Math.min(start + perView - 1, slides.length)
         const startText = String(start).padStart(2, '0')
         const endText = String(end).padStart(2, '0')
         const totalText = String(slides.length).padStart(2, '0')
         counter.textContent = start === end
            ? `${startText} / ${totalText}`
            : `${startText}-${endText} / ${totalText}`
      }

      function update() {
         const maxPage = getTotalPages() - 1
         currentPage = Math.max(0, Math.min(currentPage, maxPage))
         const slideWidth = getSlideWidth()

         slides.forEach((slide) => {
            slide.style.flex = `0 0 ${slideWidth}px`
            slide.style.width = `${slideWidth}px`
         })

         track.style.gap = `${GAP}px`
         track.style.transform = `translate3d(-${currentPage * getPerView() * (slideWidth + GAP)}px, 0, 0)`

         dotsContainer.querySelectorAll('.certifications__dot').forEach((dot, index) => {
            dot.classList.toggle('certifications__dot-active', index === currentPage)
         })

         updateCounter()
      }

      function buildDots() {
         dotsContainer.innerHTML = ''
         for (let index = 0; index < getTotalPages(); index += 1) {
            const dot = document.createElement('button')
            dot.type = 'button'
            dot.className = 'certifications__dot'
            dot.setAttribute('aria-label', `Certificates page ${index + 1}`)
            dot.addEventListener('click', () => {
               currentPage = index
               update()
            })
            dotsContainer.appendChild(dot)
         }
      }

      previous?.addEventListener('click', () => {
         currentPage -= 1
         update()
      })

      next?.addEventListener('click', () => {
         currentPage += 1
         update()
      })

      carousel.addEventListener('touchstart', (event) => {
         touchStartX = event.changedTouches[0].screenX
      }, { passive: true })

      carousel.addEventListener('touchend', (event) => {
         const difference = touchStartX - event.changedTouches[0].screenX
         if (Math.abs(difference) > 50) {
            currentPage += difference > 0 ? 1 : -1
            update()
         }
      }, { passive: true })

      window.addEventListener('resize', () => {
         currentPage = 0
         buildDots()
         update()
      })

      buildDots()
      update()
   }

   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init)
   } else {
      init()
   }
})()
