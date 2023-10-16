import tailwindPlugin from 'tailwindcss/plugin'
import { defaultIconProps, getIconData } from '@iconify/utils'
import type { IconifyJSON } from '@iconify/types'

import { getCollectionAndName, getValues, renderCSSByIconData } from './utils'

interface Options {
  collections: Record<string, IconifyJSON>
  prefix: string
}

const purgeIconPlugin = ({ collections, prefix }: Options) => {
  return tailwindPlugin(
    function ({ addComponents, matchUtilities }) {
      const styleIcon = {
        mask: 'var(--icon) no-repeat',
        'mask-size': '100% 100%',
        'background-color': 'currentColor',
        display: 'inline-block',
      }

      addComponents({
        '.icon': styleIcon,
        'i[class*="i-"]': styleIcon,
      })

      matchUtilities(
        {
          [prefix]: (value: string) => {
            const matches = getCollectionAndName(value)

            if (!matches) return null

            const [, _collectionName, _name] = matches
            const collection = collections[_collectionName]
            const iconData = getIconData(collection, _name)

            if (!iconData) return null

            return renderCSSByIconData({ ...defaultIconProps, ...iconData })
          },
        },
        {
          values: getValues(collections),
        },
      )
    },
    {
      variants: {
        aspectRatio: ['responsive'],
      },
    },
  )
}

export { purgeIconPlugin }
