<?php

namespace Drupal\bi_contacts\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

/**
 * Provides a 'Comune: configurable contacts' block.
 *
 * Drupal\Core\Block\BlockBase gives us a very useful set of basic functionality
 * for this configurable block. We can just fill in a few of the blanks with
 * defaultConfiguration(), blockForm(), blockSubmit(), and build().
 *
 * @Block(
 *   id = "bi_contacts",
 *   admin_label = @Translation("Municipium: contacts"),
 *   category = @Translation("Bootstrap Italia Contacts")
 * )
 */
class ContactsBlock extends BlockBase {

  /**
   * {@inheritdoc}
   *
   * This method sets the block default configuration. This configuration
   * determines the block's behavior when a block is initially placed in a
   * region. Default values for the block configuration form should be added to
   * the configuration array. System default configurations are assembled in
   * BlockBase::__construct() e.g. cache setting and block title visibility.
   *
   * @see \Drupal\block\BlockBase::__construct()
   */
  public function defaultConfiguration() {
    return [
      'bi_contacts_faq' => $this->t('/domande-frequenti'),
      'bi_contacts_help' => $this->t('/'),
      'bi_contacts_call' => $this->t('+39055055'),
      'bi_contacts_reservation' => $this->t('/prenota-appuntamento'),
      'bi_contacts_report' => $this->t('/'),
    ];
  }

  /**
   * {@inheritdoc}
   *
   * This method defines form elements for custom block configuration. Standard
   * block configuration fields are added by BlockBase::buildConfigurationForm()
   * (block title and title visibility) and BlockFormController::form() (block
   * visibility settings).
   *
   * @see \Drupal\block\BlockBase::buildConfigurationForm()
   * @see \Drupal\block\BlockFormController::form()
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form['bi_contacts_faq'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Read the frequently asked questions'),
      '#description' => $this->t('The FAQ page link.'),
      '#default_value' => $this->configuration['bi_contacts_faq'],
    ];
    $form['bi_contacts_help'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Assistance request'),
      '#description' => $this->t('The Help Desk page link.'),
      '#default_value' => $this->configuration['bi_contacts_help'],
    ];
    $form['bi_contacts_call'] = [
      '#type' => 'tel',
      '#title' => $this->t('Call the municipality'),
      '#description' => $this->t('The main municipality telephone number.'),
      '#default_value' => $this->configuration['bi_contacts_call'],
    ];
    $form['bi_contacts_reservation'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Book appointment'),
      '#description' => $this->t('The Reservation page link.'),
      '#default_value' => $this->configuration['bi_contacts_reservation'],
    ];
    $form['bi_contacts_report'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Report outage'),
      '#description' => $this->t('The Disservice report page link.'),
      '#default_value' => $this->configuration['bi_contacts_report'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   *
   * This method processes the blockForm() form fields when the block
   * configuration form is submitted.
   *
   * The blockValidate() method can be used to validate the form submission.
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['bi_contacts_faq'] = $form_state->getValue('bi_contacts_faq');
    $this->configuration['bi_contacts_help'] = $form_state->getValue('bi_contacts_help');
    $this->configuration['bi_contacts_call'] = $form_state->getValue('bi_contacts_call');
    $this->configuration['bi_contacts_reservation'] = $form_state->getValue('bi_contacts_reservation');
    $this->configuration['bi_contacts_report'] = $form_state->getValue('bi_contacts_report');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $tel = 'tel:' . $this->configuration['bi_contacts_call'];
    $items = [
      'faq' => Url::fromUserInput($this->configuration['bi_contacts_faq']),
      'help' => Url::fromUserInput($this->configuration['bi_contacts_help']),
      'call' => Url::fromUri($tel),
      'reservation' => Url::fromUserInput($this->configuration['bi_contacts_reservation']),
      'report' => Url::fromUserInput($this->configuration['bi_contacts_report']),
    ];


    $build['content'] = [
      '#theme' => 'bi_contacts_block',
      '#items' => $items,
    ];

    // $build['content']['#attached']['library'][] = 'alu_calendar/alu_calendar.filter';

    return $build;
  }

}
