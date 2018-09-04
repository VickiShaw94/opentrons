// @flow
import * as React from 'react'
import cx from 'classnames'

import WELLS_IMAGE from '../../../images/well_order_wells.svg'
import PATH_IMAGE from '../../../images/well_order_path.svg'

import type {WellOrderOption} from './types'

import styles from './WellOrderInput.css'

type Props = {
  prefix: 'aspirate' | 'dispense',
  firstValue: ?WellOrderOption,
  secondValue: ?WellOrderOption,
}

const WellOrderViz = (props: Props) => (
  <div className={styles.viz_wrapper}>
    <img src={WELLS_IMAGE} className={styles.wells_image} />
    <img
      src={PATH_IMAGE}
      className={cx(styles.path_image, styles[`${props.firstValue || ''}_first`], styles[`${props.secondValue || ''}_second`])} />
  </div>
)

export default WellOrderViz
