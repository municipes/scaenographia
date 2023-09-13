<?php

namespace Drupal\bi_taxonomy_custom_controller\EventSubscriber;

use Drupal\Core\StringTranslation\TranslatableMarkup;
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

    if ($taxonomy_term->bundle() != 'categorie_dei_servizi') {
      return;
    }

    $build = [];
    // Provide default content to react on all pages.
    // $build['hello'] = [
    //   '#markup' => new TranslatableMarkup('This content was added from @module just as an example.', [
    //     '@module' => 'taxonomy_custom_controller_example',
    //   ]),
    //   '#prefix' => '<p>',
    //   '#suffix' => '</p>',
    // ];

    $content['title'] = $taxonomy_term->get('name')->value;
    $content['description'] = $taxonomy_term->get('description')->value;

    $build['term_area'] = array(
      '#theme' => 'term_area',
      '#theme_wrappers' => ['term_area'],
      '#items' => $content,
    );


    // $view = views_embed_view('bi_tutti_i_servizi_indice', 'block_1');
    // if ($view) {
    //   $build['search_area'] = array(
    //     '#theme' => 'search_area',
    //     '#theme_wrappers' => ['search_area'],
    //     '#view' => $view,
    //   );
    // }

    $event->setBuildArray($build);
  }

}
