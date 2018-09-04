// @flow
import * as React from 'react'
import cx from 'classnames'
import i18n from '../../localization'
import {FormGroup} from '@opentrons/components'

import {
  StepInputField,
  StepCheckboxRow,
  DispenseDelayFields,
  PipetteField,
  LabwareDropdown,
  ChangeTipField,
} from './formFields'

import FlowRateField from './FlowRateField'
import WellSelectionInput from './WellSelectionInput'
import TipPositionInput from './TipPositionInput'
import WellOrderInput from './WellOrderInput'
import type {FocusHandlers} from './index'
import formStyles from '../forms.css'
import styles from './StepEditForm.css'

type MixFormProps = {focusHandlers: FocusHandlers}

const MixForm = (props: MixFormProps): React.Element<React.Fragment> => {
  const {focusHandlers} = props
  return (
    <React.Fragment>
      <div className={formStyles.row_wrapper}>
        <FormGroup label='Labware:' className={styles.labware_field}>
          <LabwareDropdown name="labware" {...focusHandlers} />
        </FormGroup>
        <WellSelectionInput name="wells" labwareFieldName="labware" pipetteFieldName="pipette" {...focusHandlers} />
        <PipetteField name="pipette" {...focusHandlers} />
      </div>

      <div className={cx(formStyles.row_wrapper)}>
        <FormGroup label='Repetitions' className={cx(styles.field_row, styles.repetitions_row)}>
          <StepInputField name="volume" units='μL' {...focusHandlers} />
          <StepInputField name="times" units='Times' {...focusHandlers} />
        </FormGroup>
      </div>

      <div className={formStyles.row_wrapper}>
        <div className={styles.left_settings_column}>
          <FormGroup label='TECHNIQUE'>
            <DispenseDelayFields
              disabled
              tooltipComponent={i18n.t('tooltip.not_in_beta')}
              focusHandlers={focusHandlers}
            />
            <StepCheckboxRow name="dispense_blowout_checkbox" label='Blow out'>
              <LabwareDropdown name="dispense_blowout_labware" className={styles.full_width} {...focusHandlers} />
            </StepCheckboxRow>
            <StepCheckboxRow name="touchTip" label='Touch tip' />
          </FormGroup>
        </div>

        <div className={styles.middle_settings_column}>
          <ChangeTipField stepType="mix" name="aspirate_changeTip" />
          <TipPositionInput />
        </div>
        <div className={styles.right_settings_column}>
          <FlowRateField
            name='aspirate_flowRate'
            label='Aspirate Flow Rate'
            pipetteFieldName='pipette'
            flowRateType='aspirate'
          />
          <WellOrderInput prefix="aspirate" />
          <FlowRateField
            name='dispense_flowRate'
            label='Dispense Flow Rate'
            pipetteFieldName='pipette'
            flowRateType='dispense'
          />
        </div>
      </div>
    </React.Fragment>
  )
}

export default MixForm
