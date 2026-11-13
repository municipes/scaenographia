/**
 * @file
 * Implementazione behavior Drupal per correggere la classe active nel menu con header sticky.
 * Versione Vanilla JS senza dipendenze jQuery.
 */

(function (Drupal) {
  'use strict';

  /**
   * Behavior per gestire correttamente la classe active nel menu laterale.
   */
  Drupal.behaviors.pageIndexActiveLinks = {
    attach: function (context, settings) {
      // Configurazione
      const stickyOffset = 60; // Altezza dell'header sticky in pixel

      // Controlla se context è un elemento o un documento
      const contextElement = context instanceof Element ? context : document;

      // Seleziona solo elementi UL con data-element="page-index" nel contesto corrente
      const pageIndexMenus = contextElement.querySelectorAll('ul[data-element="page-index"]');

      // Se non ci sono menu con data-element="page-index", esci
      if (pageIndexMenus.length === 0) {
        return;
      }

      // Usa Drupal.once per gestire una sola esecuzione per elemento
      pageIndexMenus.forEach(function(menu) {
        if (menu.dataset.pageIndexActiveLinksProcessed) {
          return; // Salta menu già processati
        }

        // Marca questo menu come processato
        menu.dataset.pageIndexActiveLinksProcessed = true;

        // Seleziona tutti i link nel menu corrente
        const menuLinks = menu.querySelectorAll('a[href^="#"]');

        // Raccogli gli ID delle sezioni target dal menu
        const sectionIds = [];
        menuLinks.forEach(function(link) {
          const targetId = link.getAttribute('href').substring(1);
          if (targetId) {
            sectionIds.push(targetId);
          }
        });

        // Seleziona solo le sezioni target che corrispondono agli ID trovati
        const sections = [];
        sectionIds.forEach(function(id) {
          const section = document.getElementById(id);
          if (section) {
            sections.push(section);
          }
        });

        // Funzione per gestire lo scroll e aggiornare la classe active
        function onScroll() {
          // Ottieni la posizione corrente dello scroll con l'offset
          const scrollPosition = window.scrollY + stickyOffset + 10; // +10 per un po' di margine

          // Tieni traccia se è stata trovata una sezione attiva
          let activeFound = false;

          // Ordina le sezioni in base alla loro posizione (dall'alto verso il basso)
          const orderedSections = [...sections].sort((a, b) => {
            return a.offsetTop - b.offsetTop;
          });

          // Controlla quale sezione è attualmente visibile
          for (let i = 0; i < orderedSections.length; i++) {
            const section = orderedSections[i];
            const sectionTop = section.offsetTop;
            const nextSectionTop = i < orderedSections.length - 1 ? orderedSections[i + 1].offsetTop : Number.MAX_VALUE;

            // Considera una sezione attiva se lo scroll è tra l'inizio di questa sezione
            // e l'inizio della prossima, o se è l'ultima sezione e lo scroll è oltre l'inizio
            if ((scrollPosition >= sectionTop && scrollPosition < nextSectionTop) ||
                (i === orderedSections.length - 1 && scrollPosition >= sectionTop)) {
              // Rimuovi la classe active da tutti i link
              menuLinks.forEach(function(link) {
                link.classList.remove('active');
              });

              // Trova il link corrispondente alla sezione e aggiungi la classe active
              const correspondingLink = menu.querySelector('a[href="#' + section.id + '"]');
              if (correspondingLink) {
                correspondingLink.classList.add('active');
              }

              activeFound = true;
              break;
            }
          }

          // Se nessuna sezione è attiva (ad esempio, all'inizio della pagina)
          // attiva il primo link se appropriato
          if (!activeFound && sections.length > 0 && scrollPosition < sections[0].offsetTop) {
            menuLinks.forEach(function(link) {
              link.classList.remove('active');
            });
            if (menuLinks.length > 0) {
              menuLinks[0].classList.add('active');
            }
          }
        }

        // Usa throttle per limitare la frequenza delle chiamate durante lo scroll
        let throttleTimer;
        const throttle = function(callback, time) {
          if (throttleTimer) return;
          throttleTimer = setTimeout(function() {
            callback();
            throttleTimer = null;
          }, time);
        };

        // Aggiungi l'evento scroll con throttle
        window.addEventListener('scroll', function() {
          throttle(onScroll, 50);
        });

        // Esegui subito per impostare la classe active iniziale
        onScroll();
      });
    }
  };

})(Drupal);
