// icon components tests
import React from 'react'
import Renderer from 'react-test-renderer'

import {
  Icon,
  NotificationIcon,
} from '..'

import IconData from '../icons/icon-data'

const icons = Object.keys(IconData)

describe('icons', () => {
  icons.forEach((icon) => test(`${icon} renders correctly`, () => {
    const tree = Renderer.create(
      <Icon name={`${icon}`} className='foo' />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  }))
})

describe('Notification Icon', () => {
  test('NotificationIcon renders correctly', () => {
    const tree = Renderer.create(
      <NotificationIcon
        name='flask-outline'
        className='foo'
        childName='circle'
        childClassName='bar'
      />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
