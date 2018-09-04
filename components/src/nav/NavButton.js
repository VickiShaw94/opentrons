// @flow
import * as React from 'react'
import {NavLink} from 'react-router-dom'
import classnames from 'classnames'

import styles from './navbar.css'
import {Button} from '../buttons'
import {NotificationIcon, type IconName} from '../icons'

type NavButtonProps= {
  /** optional click event for nav button */
  onClick?: (event: SyntheticEvent<>) => void,
  /** optional url for nav button route */
  url?: string,
  /** position a single button on the bottom of the page */
  isBottom?: boolean,
  /** classes to apply */
  className?: string,
  /** disabled attribute (setting disabled removes onClick) */
  disabled?: boolean,
  /** optional title to display below the icon */
  title?: string,
  /** Icon name for button's icon */
  iconName: IconName,
  /** Display a notification dot */
  notification?: boolean,
  /** selected styling (can also use react-router & `activeClassName`) */
  selected?: boolean,
}

export default function NavButton (props: NavButtonProps) {
  const {url} = props
  const className = classnames(
    props.className,
    styles.button,
    {
      [styles.disabled]: props.disabled,
      [styles.bottom]: props.isBottom,
      [styles.active]: props.selected,
    }
  )

  let buttonProps = {
    className: className,
    disabled: props.disabled,
    onClick: props.onClick,
  }

  if (url) {
    buttonProps = {
      ...buttonProps,
      Component: NavLink,
      to: url,
      activeClassName: styles.active,
    }
  }

  return (
    <Button {...buttonProps}>
      <NotificationIcon
        name={props.iconName}
        childName={props.notification ? 'circle' : null}
        className={styles.icon}
        childClassName={styles.notification}
      />
      {props.title && (
        <span className={styles.title}>
          {props.title}
        </span>
      )}
    </Button>
  )
}
