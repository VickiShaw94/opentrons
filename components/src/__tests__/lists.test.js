// list and list item components tests
import React from 'react'
import {MemoryRouter} from 'react-router'
import Renderer from 'react-test-renderer'

import {SidePanelGroup, TitledList, ListItem, ListAlert} from '..'

describe('TitledList', () => {
  test('adds an h3 with the title', () => {
    const heading = Renderer.create(
      <TitledList title='hello' />
    ).root.findByType('h3')

    expect(heading).toBeDefined()
    expect(heading.children).toEqual(['hello'])
  })

  test('adds an optional svg icon to title', () => {
    const icon = Renderer.create(
      <TitledList title='hello' iconName='flask-outline' />
    ).root.findByType('svg')

    expect(icon).toBeDefined()
  })

  test('renders TitledList without icon correctly', () => {
    const tree = Renderer.create(
      <TitledList title='foo' />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('renders TitledList with children correctly', () => {
    const tree = Renderer.create(
      <TitledList title='foo'><li>Woop</li></TitledList>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('renders TitledList with onMouseEnter & onMouseLeave correctly', () => {
    function someFn () {}

    const tree = Renderer.create(
      <TitledList title='foo' onMouseEnter={someFn} onMouseLeave={someFn}/>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('renders TitledList with optional icon correctly', () => {
    const tree = Renderer.create(
      <TitledList title='foo' icon='flask-outline' />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('renders expanded TitledList correctly', () => {
    const tree = Renderer.create(
      <TitledList onCollapseToggle={e => {}} description={<span>Description</span>} >
        <li>1</li>
        <li>2</li>
      </TitledList>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('renders collapsed TitledList correctly', () => {
    const tree = Renderer.create(
      <TitledList onCollapseToggle={e => {}} description={<span>Description</span>} collapsed>
        <li>1</li>
        <li>2</li>
      </TitledList>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})

describe('ListItem', () => {
  test('creates a linked list item from props', () => {
    const linkItemProps = {
      url: '/foo/bar',
      isDisabled: false,
    }

    const root = Renderer.create(
      <MemoryRouter>
        <ListItem {...linkItemProps}>
          foo
        </ListItem>
      </MemoryRouter>
    ).root

    const link = root.findByType('a')
    expect(link.props.href).toBe(linkItemProps.url)
    expect(link.props.disabled).toBe(false)
  })

  test('adds an optional svg icon as child', () => {
    const icon = Renderer.create(
      <ListItem iconName='check-circle' />
    ).root.findByType('svg')

    expect(icon).toBeDefined()
  })

  test('renders ListItem with icon correctly', () => {
    const tree = Renderer.create(
      <ListItem to='/hello' iconName='check-circle' isDisabled='false' />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('renders ListItem without icon correctly', () => {
    const tree = Renderer.create(
      <ListItem to='/hello' isDisabled='false' />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})

describe('ListAlert', () => {
  test('list alert renders correctly', () => {
    const tree = Renderer.create(
      <ListAlert> alert alert</ListAlert>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})

describe('ListItem', () => {
  test('Side Panel Group renders correctly', () => {
    const tree = Renderer.create(
      <SidePanelGroup title='title' iconName='flask-outline'> children </SidePanelGroup>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('Disabled Side Panel Group renders correctly', () => {
    const tree = Renderer.create(
      <SidePanelGroup title='title' iconName='flask-outline' disabled> children </SidePanelGroup>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
