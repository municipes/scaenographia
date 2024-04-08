<?php

namespace Drupal\bi_taxonomy_custom_controller\EventSubscriber;

use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\Core\Url;
use Drupal\Core\Link;
use Drupal\taxonomy_custom_controller\Event\TaxonomyCustomControllerEvents;
use Drupal\taxonomy_custom_controller\Event\TermPageBuildEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Drupal\views\Views;
use Drupal\views\ViewExecutable;


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
            '#title' => 'Esplora i servizi: ' . $taxonomy_term->label(),
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
            '#title' => 'Esplora i documenti: ' . $taxonomy_term->label(),
            '#classes' => [],
          );
        }
        break;

      case 'tipi_di_notizia':
        $view = views_embed_view('bi_tutte_le_novita', 'tutte_le_novita');
        if ($view) {
          $build['search_area'] = array(
            '#theme' => 'search_area',
            '#theme_wrappers' => ['search_area'],
            '#view' => $view,
            '#title' => 'Esplora le novità: ' . $taxonomy_term->field_plurale->value,
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
        $view_name = 'taxonomy_term';

        # Novità
        $url = Url::fromUserInput('/novita');
        $link = Link::fromTextAndUrl(t('Tutte le novità'), $url)->toRenderable();
        $link['#attributes'] = [
          'class' => $classes,
          'title' => 'Vai a tutte le novità',
        ];

        $display_id = 'block_novita';
        if (!$this->checkResults($view_name, $display_id, $term->id())) {
          $view_novita = views_embed_view($view_name, $display_id, $term->id());
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
        }

        # Amministrazione
        $url = Url::fromUserInput('/amministrazione');
        $link = Link::fromTextAndUrl(t('Tutta l\'amministrazione'), $url)->toRenderable();
        $link['#attributes'] = [
          'class' => $classes,
          'title' => 'Vai a Amministrazione',
        ];
        $view_name = 'taxonomy_term';
        $display_id = 'block_amministrazione';
        if (!$this->checkResults($view_name, $display_id, $term->id())) {
          $view_admin = views_embed_view($view_name, $display_id, $term->id());
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
        }

        # Servizi
        $url = Url::fromUserInput('/servizi');
        $link = Link::fromTextAndUrl(t('Tutti i servizi'), $url)->toRenderable();
        $link['#attributes'] = [
          'class' => $classes,
          'title' => 'Vai a tutti i servizi',
        ];
        $view_name = 'taxonomy_term';
        $display_id = 'block_servizi';
        if (!$this->checkResults($view_name, $display_id, $term->id())) {
          $view_services = views_embed_view($view_name, $display_id, $term->id());
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
        }

        # Documenti
        $url = Url::fromUserInput('/amministrazione/documenti-e-dati');
        $link = Link::fromTextAndUrl(t('Tutti i documenti'), $url)->toRenderable();
        $link['#attributes'] = [
          'class' => $classes,
          'title' => 'Vai a tutti i documenti',
        ];
        $view_name = 'taxonomy_term';
        $display_id = 'block_documenti';
        if (!$this->checkResults($view_name, $display_id, $term->id())) {
          $view_documents = views_embed_view($view_name, $display_id, $term->id());
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
        }

        break;
    }


    $event->setBuildArray($build);
  }

  /**
   * Check view results
   *
   * @param string $view_name
   * @param string $display_id
   * @param int $argument
   * @return bool
   */
  private function checkResults(string $view_name, string $display_id, int $argument): bool {
    $view = Views::getView($view_name);
    $view->setDisplay($display_id);
    $view->setArguments([$argument]);
    $view->execute();
    return empty($view->result);
  }
}
