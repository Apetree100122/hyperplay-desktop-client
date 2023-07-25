import { Category } from 'frontend/types'
import { TFunction } from 'react-i18next'

export function getLibraryTitle(
  category: Category,
  t: TFunction<'translation'>
) {
  switch (category) {
    case 'all':
      return t('title.allGames', 'All Games')
    case 'legendary':
      return t('Epic Games', 'Epic Games')
    case 'gog':
      return t('GOG', 'GOG')
    case 'hyperplay':
      return 'HyperPlay'
    default:
      return t('Other', 'Other')
  }
}

export function translateChannelName(
  channelNameEnglish: string,
  t: TFunction<'translation'>
) {
  switch (channelNameEnglish) {
    case 'demo':
      return t('gameRelease.demo', 'Demo')
    case 'prototype':
      return t('gameRelease.prototype', 'Prototype')
    case 'alpha':
      return t('gameRelease.alpha', 'Alpha')
    case 'beta':
      return t('gameRelease.beta', 'Beta')
    case 'main':
      return t('gameRelease.main', 'Main')
    default:
      return channelNameEnglish
  }
}
