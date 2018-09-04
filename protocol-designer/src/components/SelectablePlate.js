// @flow
// Wrap Plate with a SelectionRect.
import * as React from 'react'
import {
  swatchColors,
  Labware,
  LabwareLabels,
  MIXED_WELL_COLOR,
  type Channels,
} from '@opentrons/components'

import SelectionRect from '../components/SelectionRect.js'
import type {ContentsByWell} from '../labware-ingred/types'
import type {RectEvent} from '../collision-types'

type LabwareProps = React.ElementProps<typeof Labware>

export type Props = {
  wellContents: ContentsByWell,
  getTipProps?: $PropertyType<LabwareProps, 'getTipProps'>,
  containerType: string,

  selectable?: boolean,
  makeOnMouseOverWell?: (well: string) => (e: SyntheticMouseEvent<*>) => mixed,
  onMouseExitWell?: (e: SyntheticMouseEvent<*>) => mixed,

  onSelectionMove: RectEvent,
  onSelectionDone: RectEvent,

  // used by container
  containerId: string,
  pipetteChannels?: ?Channels,
}

// TODO Ian 2018-07-20: make sure '__air__' or other pseudo-ingredients don't get in here
function getFillColor (groupIds: Array<string>): ?string {
  if (groupIds.length === 0) {
    return null
  }

  if (groupIds.length === 1) {
    return swatchColors(Number(groupIds[0]))
  }

  return MIXED_WELL_COLOR
}

export default function SelectablePlate (props: Props) {
  const {
    wellContents,
    getTipProps,
    containerType,
    onSelectionMove,
    onSelectionDone,
    selectable,
    makeOnMouseOverWell,
    onMouseExitWell,
  } = props

  const getWellProps = (wellName) => {
    const well = wellContents[wellName]

    return {
      onMouseOver: makeOnMouseOverWell && makeOnMouseOverWell(wellName),
      onMouseLeave: onMouseExitWell,
      selectable,
      wellName,

      highlighted: well.highlighted,
      selected: well.selected,
      error: well.error,
      maxVolume: well.maxVolume,

      fillColor: getFillColor(well.groupIds),
    }
  }

  const labwareComponent = <Labware
    labwareType={containerType}
    getWellProps={getWellProps}
    getTipProps={getTipProps}
  />

  if (!selectable) return labwareComponent // don't wrap labwareComponent with SelectionRect

  return (
    <SelectionRect svg {...{onSelectionMove, onSelectionDone}}>
      {labwareComponent}
      <LabwareLabels labwareType={containerType} />
    </SelectionRect>
  )
}
