// @flow
import * as React from 'react'
import classnames from 'classnames'

import ICON_DATA_BY_NAME, {type IconName} from './icon-data'
import styles from './icons.css'

export type IconProps = {
  /** name constant of the icon to display */
  name: IconName,
  /** classes to apply */
  className?: string,
  /** spin the icon with a CSS animation */
  spin?: boolean,
  /** x attribute as a number or string (for nesting inside another SVG) */
  x?: number | string,
  /** y attribute as a number or string (for nesting inside another SVG) */
  y?: number | string,
  /** width as a number or string (for nesting inside another SVG) */
  height?: number | string,
  /** height as a number or string (for nesting inside another SVG) */
  width?: number | string,
  /** inline style passed into the icon svg */
  style?: {[string]: string},
  /** optional children */
  children?: React.Node,
}

/**
 * Inline SVG icon component
 *
 * If you need access to the IconName type, you can:
 * ```js
 * import {type IconName} from '@opentrons/components'
 * ```
 */
export default function Icon (props: IconProps) {
  const {x, y, height, width, style} = props

  if (!(props.name in ICON_DATA_BY_NAME)) {
    console.error(`"${props.name}" is not a valid Icon name`)
    return null
  }

  const {viewBox, path} = ICON_DATA_BY_NAME[props.name]
  const className = classnames(props.className, {
    [styles.spin]: props.spin,
  })

  return (
    <svg
      version='1.1'
      aria-hidden='true'
      viewBox={viewBox}
      className={className}
      fill='currentColor'
      {...{x, y, height, width, style}}
    >
      <path fillRule='evenodd' d={path} />
      {props.children}
    </svg>
  )
}
