<?php

namespace Drupal\bi_taxonomy_custom_controller\EventSubscriber;

use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\Core\Url;
use Drupal\Core\Link;
use Drupal\taxonomy_custom_controller\Event\TaxonomyCustomControllerEvents;
use Drupal\taxonomy_custom_controller\Event\TermPageBuildEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Provides subscriber for term page build.
 */
class TermPageBuildSubscriber implements EventSubscriberInterface {

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      TaxonomyCustomControllerEvents::PAGE_BUILD => 'onTermPageBuild',
    ];
  }

  /**
   * Reacts on term page build.
   *
   * @param \Drupal\taxonomy_custom_controller\Event\TermPageBuildEvent $event
   *   The event.
   */
  public function onTermPageBuild(TermPageBuildEvent $event) {
    $taxonomy_term = $event->getTaxonomyTerm();

    $build = [];

    // $content['title'] = $taxonomy_term->get('name')->value;
    // $content['description'] = $taxonomy_term->get('description')->value;

    // $build['term_area'] = array(
    //   '#theme' => 'term_area',
    //   '#title' => $taxonomy_term->get('name')->value,
    //   '#description' => $taxonomy_term->get('description')->value,

    // );

    switch ($taxonomy_term->bundle()) {
      case 'categorie_dei_servizi':
        $view = views_embed_view('bi_tutti_i_servizi_indice', 'block_1');
        if ($view) {
          $build['search_area'] = array(
            '#theme' => 'search_area',
            '#theme_wrappers' => ['search_area'],
            '#view' => $view,
            '#title' => 'Esplora tutti i servizi',
            '#classes' => [],
          );
        }
        break;

      case 'tipi_di_documento':
        $view = views_embed_view('bi_documenti_indice', 'block_1');
        if ($view) {
          $build['search_area'] = array(
            '#theme' => 'search_area',
            '#theme_wrappers' => ['search_area'],
            '#view' => $view,
            '#title' => 'Esplora tutti i documenti',
            '#classes' => [],
          );
        }
        break;

      default:
        $classes = [
          'btn',
          'btn-primary',
          'text-button',
          'w-100',
        ];
        $term = \Drupal::routeMatch()->getParameter('taxonomy_term');
        # Novità
        $url = Url::fromUserInput('/novita');
        $link = Link::fromTextAndUrl(t('Tutte le novità'), $url)->toRenderable();
        $link['#attributes'] = [
          'class' => $classes,
          'title' => 'Vai a tutte le novità',
        ];
        $view_novita = views_embed_view('taxonomy_term', 'block_novita', $term->id());
        if ($view_novita) {
          $build['novita']['search_area'] = array(
            '#theme' => 'search_area',
            '#theme_wrappers' => ['search_area'],
            '#view' => $view_novita,
            '#title' => 'Novità',
            '#id' => 'novita',
            '#classes' => ['neutral-2-bg', 'pt-lg-6'],
            '#link' => $link,
          );
        }
        # Amministrazione
        $url = Url::fromUserInput('/amministrazione');
        $link = Link::fromTextAndUrl(t('Tutta l\'amministrazione'), $url)->toRenderable();
        $link['#attributes'] = [
          'class' => $classes,
          'title' => 'Vai a Amministrazione',
        ];
        $view_admin = views_embed_view('taxonomy_term', 'block_amministrazione', $term->id());
        if ($view_admin) {
          $build['amministrazione']['search_area'] = array(
            '#theme' => 'search_area',
            '#theme_wrappers' => ['search_area'],
            '#view' => $view_admin,
            '#title' => 'Amministrazione',
            '#id' => 'amministrazione',
            '#classes' => [],
            '#link' => $link,
          );
        }
        # Servizi
        $url = Url::fromUserInput('/servizi');
        $link = Link::fromTextAndUrl(t('Tutti i servizi'), $url)->toRenderable();
        $link['#attributes'] = [
          'class' => $classes,
          'title' => 'Vai a tutti i servizi',
        ];
        $view_services = views_embed_view('taxonomy_term', 'block_servizi', $term->id());
        if ($view_services) {
          $build['servizi']['search_area'] = array(
            '#theme' => 'search_area',
            '#theme_wrappers' => ['search_area'],
            '#view' => $view_services,
            '#title' => 'Servizi',
            '#id' => 'servizi',
            '#classes' => [],
            '#link' => $link,
          );
        }
        # Docuemnti
        $url = Url::fromUserInput('/amministrazione/documenti-e-dati');
        $link = Link::fromTextAndUrl(t('Tutti i documenti'), $url)->toRenderable();
        $link['#attributes'] = [
          'class' => $classes,
          'title' => 'Vai a tutti i documenti',
        ];
        $view_documents = views_embed_view('taxonomy_term', 'block_documenti', $term->id());
        if ($view_documents) {
          $build['documenti']['search_area'] = array(
            '#theme' => 'search_area',
            '#theme_wrappers' => ['search_area'],
            '#view' => $view_documents,
            '#title' => 'Documenti',
            '#id' => 'documenti',
            '#classes' => [],
            '#link' => $link,
          );
        }
        break;
    }


    $event->setBuildArray($build);
  }

}
