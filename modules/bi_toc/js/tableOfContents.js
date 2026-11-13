/**
 * @file
 * Toc_js.
 */

(function ($) {
  'use strict';

  Drupal.behaviors.tableOfContents = {
    attach: function(context, settings) {

      /*! tableOfContents.js v1.0.0 | (c) 2020 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/table-of-contents */

      /*
      * Automatically generate a table of contents from the headings on the page
      * @param  {String} content A selector for the element that the content is in
      * @param  {String} target  The selector for the container to render the table of contents into
      * @param  {Object} options An object of user options [optional]
      */

      var tableOfContents = function (content, target, options) {

        //
        // Variables
        //

        // Get content
        var contentWrap = document.querySelector(content);
        var toc = document.querySelector(target);

        if (!contentWrap || !toc) return;

        // Settings & Defaults
        var defaults = {
          levels: 'h2, h3, h4, h5, h6',
          heading: Drupal.t('Table of Contents'),
          headingLevel: 'h2',
          listType: 'ul',
          navbarSelector: '#header-nav-wrapper', // Selettore della navbar
          offsetPadding: 20 // Padding aggiuntivo
        };
        var settings = {};

        // Placeholder for headings
        var headings;

        // Variabili per il tracking dello scroll
        var isScrolling = false;
        var scrollTimeout;

        //
        // Methods
        //

        /**
         * Merge user options into defaults
         * @param  {Object} obj The user options
         */
        var merge = function (obj) {
          for (var key in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, key)) {
              settings[key] = Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : defaults[key];
            }
          }
        };

        /**
         * Create an ID for a heading if one does not exist
         * @param  {Node} heading The heading element
         */
        var createID = function (heading) {
          if (heading.id.length) return;
          heading.id = 'toc_' + heading.textContent.replace(/[^A-Za-z0-9]/g, '-');
        };

        /**
         * Get the HTML to indent a list a specific number of levels
         * @param  {Integer} count The number of times to indent the list
         * @return {String}        The HTML
         */
        var getIndent = function (count) {
          var html = '';
          for (var i = 0; i < count; i++) {
            html += '<' + settings.listType + '>';
          }
          return html;
        };

        /**
         * Get the HTML to close an indented list a specific number of levels
         * @param  {Integer} count The number of times to "outdent" the list
         * @return {String}        The HTML
         */
        var getOutdent = function (count) {
          var html = '';
          for (var i = 0; i < count; i++) {
            html += '</' + settings.listType + '></li>';
          }
          return html;
        };

        /**
         * Get the HTML string to start a new list of headings
         * @param  {Integer} diff  The number of levels in or out from the current level the list is
         * @param  {Integer} index The index of the heading in the "headings" NodeList
         * @return {String}        The HTML
         */
        var getStartingHTML = function (diff, index) {

          // If indenting
          if (diff > 0) {
            return getIndent(diff);
          }

          // If outdenting
          if (diff < 0) {
            return getOutdent(Math.abs(diff));
          }

          // If it's not the first item and there's no difference
          if (index && !diff) {
            return '</li>';
          }

          return '';
        };

        /**
         * Calcola l'offset necessario per lo scroll
         * @return {Number} L'altezza della navbar + padding
         */
        var getScrollOffset = function () {
          var navbar = document.querySelector(settings.navbarSelector);
          var navbarHeight = navbar ? navbar.offsetHeight : 0;
          return navbarHeight + settings.offsetPadding;
        };

        /**
         * Aggiorna la voce attiva nel menu basandosi sulla posizione di scroll
         */
        var updateActiveMenuItem = function() {
          if (isScrolling) return;

          var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
          var windowHeight = window.innerHeight;
          var docHeight = document.documentElement.scrollHeight;

          // Ottieni l'offset che usiamo per lo scroll (stesso usato nel click)
          var offset = getScrollOffset();

          // Trova tutti i link nel TOC
          var tocLinks = toc.querySelectorAll('a.toc-link');

          // Rimuovi tutte le classi active esistenti
          tocLinks.forEach(function(link) {
            link.classList.remove('active');
            var parentLi = link.closest('li');
            if (parentLi) {
              parentLi.classList.remove('active');
            }
          });

          var currentSection = null;
          var currentSectionTop = -Infinity;

          // Per ogni heading, determina se è la sezione corrente
          for (var i = 0; i < headings.length; i++) {
            var heading = headings[i];
            var headingTop = heading.getBoundingClientRect().top + window.pageYOffset;

            // Considera l'heading come "raggiunto" se il suo top è al di sopra o alla posizione
            // dove lo metterebbe il click (cioè scrollPos + offset)
            if (headingTop <= scrollPos + offset + 5) { // +5 pixel di tolleranza
              // Se questo heading è più in basso del precedente candidato, è il nuovo candidato
              if (headingTop > currentSectionTop) {
                currentSection = heading;
                currentSectionTop = headingTop;
              }
            }
          }

          // Se siamo molto vicini alla fine del documento, attiva l'ultima sezione
          if (scrollPos + windowHeight >= docHeight - 10) {
            currentSection = headings[headings.length - 1];
          }

          // Se siamo all'inizio, attiva la prima sezione
          if (scrollPos < offset && headings.length > 0) {
            currentSection = headings[0];
          }

          // Attiva il link corrispondente alla sezione corrente
          if (currentSection) {
            var activeLink = toc.querySelector('a[href="#' + currentSection.id + '"]');
            if (activeLink) {
              activeLink.classList.add('active');
              var parentLi = activeLink.closest('li');
              if (parentLi) {
                parentLi.classList.add('active');
              }
            }
          }
        };

        /**
         * Gestisce il click sui link della TOC con scroll smooth e offset
         * @param {Event} e L'evento click
         */
        var handleTocClick = function (e) {
          e.preventDefault();

          var targetId = this.getAttribute('href').substring(1);
          var targetElement = document.getElementById(targetId);

          if (!targetElement) return;

          // Imposta flag per indicare che stiamo scrollando programmaticamente
          isScrolling = true;

          // Rimuovi classe active da tutti i link
          var tocLinks = toc.querySelectorAll('a.toc-link');
          tocLinks.forEach(function(link) {
            link.classList.remove('active');
            var parentLi = link.closest('li');
            if (parentLi) {
              parentLi.classList.remove('active');
            }
          });

          // Aggiungi classe active al link cliccato
          this.classList.add('active');
          var parentLi = this.closest('li');
          if (parentLi) {
            parentLi.classList.add('active');
          }

          var offsetTop = targetElement.offsetTop - getScrollOffset();

          // Scroll smooth con supporto cross-browser
          if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          } else {
            // Fallback per browser che non supportano scroll smooth
            window.scrollTo(0, offsetTop);
          }

          // Reset del flag dopo il completamento dello scroll
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(function() {
            isScrolling = false;
            // Forza un aggiornamento dopo lo scroll per essere sicuri
            updateActiveMenuItem();
          }, 800);
        };

        /**
         * Debounce function per ottimizzare le performance
         */
        var debounce = function(func, wait) {
          var timeout;
          return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
              func.apply(context, args);
            }, wait);
          };
        };

        /**
         * Inject the table of contents into the DOM
         */
        var injectTOC = function () {

          // Track the current heading level
          var level = headings[0].tagName.slice(1);
          var startingLevel = level;

          // Cache the number of headings
          var len = headings.length - 1;

          // Inject the HTML into the DOM
          toc.innerHTML =
            // '<' + settings.headingLevel + '>' + settings.heading + '</' + settings.headingLevel + '>' +
            '<' + settings.listType + ' data-element="page-index" class="link-list">' +
            Array.prototype.map.call(headings, function (heading, index) {

              // Add an ID if one is missing
              createID(heading);

              // Check the heading level vs. the current list
              var currentLevel = heading.tagName.slice(1);
              var levelDifference = currentLevel - level;
              level = currentLevel;

              var html = getStartingHTML(levelDifference, index);

              // Generate the HTML
              html +=
                '<li class="nav-item">' +
                '<a class="nav-link toc-link" href="#' + heading.id + '" data-focus-mouse="false">' +
                '<span>' + heading.innerHTML.trim() + '</span>' +
                '</a>';

              // If the last item, close it all out
              if (index === len) {
                html += getOutdent(Math.abs(startingLevel - currentLevel));
              }

              return html;

            }).join('') +
            '</' + settings.listType + '>';

          // Aggiungi event listeners ai link della TOC
          var tocLinks = toc.querySelectorAll('a.toc-link');
          for (var i = 0; i < tocLinks.length; i++) {
            tocLinks[i].addEventListener('click', handleTocClick);
          }

          // Aggiungi listener per lo scroll con debounce per performance migliori
          var debouncedUpdate = debounce(updateActiveMenuItem, 50);
          window.addEventListener('scroll', debouncedUpdate);

          // Aggiungi anche listener per resize nel caso l'altezza della navbar cambi
          window.addEventListener('resize', debouncedUpdate);

          // Imposta la sezione attiva iniziale dopo un breve delay
          setTimeout(function() {
            updateActiveMenuItem();
          }, 100);
        };

        /**
         * Initialize the script
         */
        var init = function () {

          // Merge any user settings into the defaults
          merge(options || {});

          // Get the headings
          // If none are found, don't render a list
          headings = contentWrap.querySelectorAll(settings.levels);
          if (!headings.length) return;

          // Inject the table of contents
          injectTOC();
        };

        //
        // Initialize the script
        //
        init();

      };

      // Aggiungi anche gli stili CSS necessari se non sono già presenti
      var styleId = 'toc-active-styles';
      if (!document.getElementById(styleId)) {
        var style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          .nav-item.active > .nav-link,
          .nav-link.active {
            font-weight: bold;
            color: #0066cc;
          }
          .nav-link.toc-link {
            transition: all 0.3s ease;
          }
        `;
        document.head.appendChild(style);
      }

      tableOfContents('[data-content]', '[data-toc]', {
        levels: 'h2.it-page-section', // The heading levels to generate a table of contents from
        // heading: '', // The heading text for the table of contents list
        // headingLevel: '', // The level to use for the heading for the table of contents list
        listType: 'ul', // The list type to use for the table of contents
        navbarSelector: '#header-nav-wrapper', // Selettore della navbar
        offsetPadding: 20 // Padding aggiuntivo in pixel
      });

    }
  };

}(Drupal));
