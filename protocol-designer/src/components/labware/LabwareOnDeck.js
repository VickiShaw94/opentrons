// @flow

// On an empty slot:
// * Renders a slot on the deck
// * Renders Add Labware mouseover button
//
// On a slot with a container:
// * Renders a SelectablePlate in the slot
// * Renders Add Ingreds / Delete container mouseover buttons, and dispatches their actions

import React from 'react'
import cx from 'classnames'
import {
  LabwareContainer,
  ContainerNameOverlay,
  EmptyDeckSlot,
  SLOT_WIDTH_MM,
  SLOT_HEIGHT_MM,
  humanizeLabwareType,
  clickOutside,
  type DeckSlot,
} from '@opentrons/components'
import {getLabware} from '@opentrons/shared-data'
import styles from './labware.css'

import ClickableText from './ClickableText'
import SelectablePlate from '../../containers/SelectablePlate.js'
import NameThisLabwareOverlay from './NameThisLabwareOverlay.js'
import DisabledSelectSlotOverlay from './DisabledSelectSlotOverlay.js'

const EnhancedNameThisLabwareOverlay = clickOutside(NameThisLabwareOverlay)

function OccupiedDeckSlotOverlay ({
  canAddIngreds,
  containerId,
  slot,
  containerType,
  containerName,
  openIngredientSelector,
  setMoveLabwareMode,
  deleteContainer,
}) {
  return (
    <g className={cx(styles.slot_overlay, styles.appear_on_mouseover)}>
      <rect className={styles.overlay_panel} />
      {canAddIngreds &&
        <ClickableText
          onClick={() => openIngredientSelector(containerId)}
          iconName='pencil' y='15%' text='Name & Liquids' />
      }
      <ClickableText
        onClick={() => setMoveLabwareMode(slot)}
        iconName='cursor-move' y='40%' text='Move' />
      <ClickableText
        onClick={() => (
          window.confirm(`Are you sure you want to permanently delete ${containerName || containerType} in slot ${slot}?`) &&
          deleteContainer({containerId, slot, containerType})
        )}
        iconName='close' y='65%' text='Delete' />
    </g>
  )
}

// Including a labware type in `labwareImages` will use that image instead of an SVG
const IMG_TRASH = require('../../images/labware/Trash.png')
const labwareImages = {
  'trash-box': IMG_TRASH,
}

type SlotWithContainerProps = {
  containerType: string,
  displayName: string,
  containerId: string,
}

function SlotWithContainer (props: SlotWithContainerProps) {
  const {containerType, displayName, containerId} = props

  return (
    <g>
      {labwareImages[containerType]
        ? <image
          href={labwareImages[containerType]}
          width={SLOT_WIDTH_MM} height={SLOT_HEIGHT_MM}
        />
        : <SelectablePlate containerId={containerId} cssFillParent />
      }
      <ContainerNameOverlay title={displayName || humanizeLabwareType(containerType)} />
    </g>
  )
}

type LabwareOnDeckProps = {
  slot: DeckSlot,

  containerId: string,
  containerType: string,
  containerName: ?string,
  showNameOverlay: ?boolean,

  // canAdd: boolean,

  activeModals: {
    ingredientSelection: ?{
      containerName: ?string,
      slot: ?DeckSlot,
    },
    labwareSelection: boolean,
  },
  openIngredientSelector: (containerId: string) => void,

  // createContainer: ({slot: string, containerType: string}) => mixed,
  deleteContainer: ({containerId: string, slot: DeckSlot, containerType: string}) => void,
  modifyContainer: ({containerId: string, modify: {[field: string]: mixed}}) => void, // eg modify = {name: 'newName'}

  openLabwareSelector: ({slot: DeckSlot}) => void,
  // closeLabwareSelector: ({slot: string}) => mixed,

  setMoveLabwareMode: (slot: ?DeckSlot) => void,
  slotToMoveFrom: ?DeckSlot,
  moveLabware: (slot: DeckSlot) => void,

  height?: number,
  width?: number,
  highlighted: boolean,

  deckSetupMode: boolean,
}

export default function LabwareOnDeck (props: LabwareOnDeckProps) {
  const {
    slot,

    containerId,
    containerType,
    containerName,
    showNameOverlay,

    // canAdd,

    activeModals,
    openIngredientSelector,

    // createContainer,
    deleteContainer,
    modifyContainer,

    openLabwareSelector,
    // closeLabwareSelector,

    setMoveLabwareMode,
    slotToMoveFrom,
    moveLabware,

    height,
    width,
    highlighted,

    deckSetupMode,
  } = props

  const slotIsOccupied = !!containerType

  let canAddIngreds: boolean = !showNameOverlay

  // labware definition's metadata.isValueSource defaults to true,
  // only use it when it's defined as false
  const labwareInfo = getLabware(containerType)
  if (!labwareInfo || labwareInfo.metadata.isValidSource === false) {
    canAddIngreds = false
  }

  const setDefaultLabwareName = () => modifyContainer({
    containerId,
    modify: {name: null},
  })

  const handleSelectMoveDestination = (e: SyntheticEvent<*>) => {
    e.preventDefault()
    moveLabware(slot)
  }
  const cancelMove = () => {
    setMoveLabwareMode()
  }

  return (
    <LabwareContainer {...{height, width, slot}} highlighted={highlighted}>
      {/* The actual deck slot container: rendering of container, or rendering of empty slot */}
      {slotIsOccupied
        ? <SlotWithContainer displayName={containerName || containerType} {...{containerType, containerId}} />
        : <EmptyDeckSlot {...{height, width, slot}} />
      }

      {(!deckSetupMode || activeModals.labwareSelection)
        // "Add Labware" labware selection dropdown menu
        ? null
        : (slotToMoveFrom
            // Mouseover empty slot -- Add (or Copy if in copy mode)
            ? <g className={cx(styles.slot_overlay, styles.appear_on_mouseover)}>
              <rect className={styles.overlay_panel} onClick={() => moveLabware(slot)} />
              <ClickableText onClick={handleSelectMoveDestination} iconName='cursor-move' y='40%' text='Place Here' />
            </g>
            : <g className={cx(styles.slot_overlay, styles.appear_on_mouseover, styles.add_labware)}>
              <rect className={styles.overlay_panel} />
              <ClickableText onClick={e => openLabwareSelector({slot})}
                iconName='plus' y='30%' text='Add Labware' />
              <ClickableText onClick={e => window.alert('NOT YET IMPLEMENTED: Add Copy') /* TODO: New Copy feature */}
                iconName='content-copy' y='55%' text='Add Copy' />
            </g>
        )
      }

      {slotToMoveFrom === slot &&
        <DisabledSelectSlotOverlay onClickOutside={cancelMove} setMoveLabwareMode={setMoveLabwareMode} />}

      {deckSetupMode && slotIsOccupied && !slotToMoveFrom && !showNameOverlay &&
        <OccupiedDeckSlotOverlay {...{
          canAddIngreds,
          containerId,
          slot,
          containerType,
          containerName,
          openIngredientSelector,
          setMoveLabwareMode,
          deleteContainer,
        }} />
      }

      {deckSetupMode && showNameOverlay &&
        <EnhancedNameThisLabwareOverlay {...{
          containerType,
          containerId,
          slot,
          modifyContainer,
          deleteContainer,
        }}
        onClickOutside={setDefaultLabwareName} />
      }
    </LabwareContainer>
  )
}
