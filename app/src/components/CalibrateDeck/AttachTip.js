// @flow
import * as React from 'react'
import type {PipetteConfig} from '@opentrons/shared-data'
import type {CalibrateDeckStartedProps, CalibrationStep} from './types'
import {PrimaryButton} from '@opentrons/components'

import styles from './styles.css'

type Props = CalibrateDeckStartedProps & {
  proceed: () => mixed,
}

type DiagramProps = {
  calibrationStep: CalibrationStep,
  pipette: PipetteConfig,
}

type Channels = 'single' | 'multi'

const DIAGRAMS: {[step: CalibrationStep]: {[Channels]: string}} = {
  '1': {
    single: require('./images/attach-tip-single@3x.png'),
    multi: require('./images/attach-tip-multi@3x.png'),
  },
  '6': {
    single: require('./images/detach-tip-single@3x.png'),
    multi: require('./images/detach-tip-multi@3x.png'),
  },
}

export default function AttachTipModal (props: Props) {
  const multi = props.pipette.channels === 8
  const tipLocation = multi
    ? 'very first channel at front of'
    : ''

  const diagramSrc = getDiagramSrc(props)

  let instructions, buttonText
  if (props.calibrationStep === '1') {
    instructions = (
      <span>
        <p>Place a GEB tip on the {tipLocation} pipette before continuing.</p>
        <p>Confirm tip is attached to start calibration.</p>
      </span>
    )
    buttonText = 'confirm tip attached'
  } else {
    instructions = (
      <span>
        <p>Remove the GEB tip from the pipette. </p>
        <p>You must restart your robot to finish the initial robot calibration process
        and have the new settings take effect. It may take several minutes for your robot to restart.</p>
      </span>
    )
    buttonText = 'finish and restart robot'
  }

  return (
    <div className={styles.attach_tip_contents}>
        <div className={styles.attach_tip_instructions}>
          {instructions}
          <PrimaryButton
            title={buttonText}
            onClick={props.proceed}
          >
          {buttonText}
          </PrimaryButton>
      </div>
      <div className={styles.attach_tip_diagram}>
        <img src={diagramSrc} />
      </div>
    </div>
  )
}

function getDiagramSrc (props: DiagramProps): string {
  const {calibrationStep, pipette} = props
  const channelsKey = pipette.channels === 8
    ? 'multi'
    : 'single'

  return DIAGRAMS[calibrationStep][channelsKey]
}
