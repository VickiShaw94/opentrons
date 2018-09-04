// @flow
import * as React from 'react'
import cx from 'classnames'
import {Icon, type IconName} from '../icons'

import styles from './SlotOverlay.css'

type SlotOverlayProps = {
  text?: string,
  icon?: IconName,
  className?: string,
}

export function SlotOverlay (props: SlotOverlayProps) {
  const {icon, text, className} = props
  const leftRightPadding = 3 // LR padding as %
  const topPadding = 33 // as %
  const iconSize = 15
  const textProps = icon
    ? {x: '25%'} // left-aligned with offset for icon
    : {x: '50%', textAnchor: 'middle'} // centered text

  return <g className={cx(styles.overlay, className)}>
    <rect
      className={styles.overlay_background}
      x={leftRightPadding + '%'}
      y={topPadding + '%'}
      height='33%'
      width={100 - (leftRightPadding * 2) + '%'} rx='6'
    />

    {/* TODO: control icon x y and size */}
    {icon && <Icon
      x={leftRightPadding + 6 + '%'}
      y={topPadding + 6 + '%'}
      height={iconSize}
      width={iconSize}
      name={icon}
      className={styles.icon}
    />}

    <text {...textProps} y={topPadding + 20 + '%'}>
      {text}
    </text>
  </g>
}
