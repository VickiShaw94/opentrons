// tests for generic api reducer
import apiReducer from '../reducer'

describe('apiReducer', () => {
  test('handles api:REQUEST', () => {
    const emptyState = {}
    const oldRequestState = {
      name: {
        otherPath: {inProgress: false},
        path: {
          inProgress: false,
          request: {},
          response: {baz: 'qux'},
          error: new Error('AH'),
        },
      },
    }

    const action = {
      type: 'api:REQUEST',
      payload: {robot: {name: 'name'}, path: 'path', request: {foo: 'bar'}},
    }

    expect(apiReducer(emptyState, action)).toEqual({
      name: {
        path: {inProgress: true, request: {foo: 'bar'}, error: null},
      },
    })

    expect(apiReducer(oldRequestState, action)).toEqual({
      name: {
        otherPath: {inProgress: false},
        path: {
          inProgress: true,
          request: {foo: 'bar'},
          response: {baz: 'qux'},
          error: null,
        },
      },
    })
  })

  test('handles api:SUCCESS', () => {
    const emptyState = {}
    const oldRequestState = {
      name: {
        otherPath: {inProgress: false},
        path: {
          inProgress: true,
          request: {foo: 'bar'},
          response: {fizz: 'buzz'},
          error: new Error('AH'),
        },
      },
    }

    const action = {
      type: 'api:SUCCESS',
      payload: {robot: {name: 'name'}, path: 'path', response: {baz: 'qux'}},
    }

    expect(apiReducer(emptyState, action)).toEqual({
      name: {
        path: {inProgress: false, response: {baz: 'qux'}, error: null},
      },
    })

    expect(apiReducer(oldRequestState, action)).toEqual({
      name: {
        otherPath: {inProgress: false},
        path: {
          inProgress: false,
          request: {foo: 'bar'},
          response: {baz: 'qux'},
          error: null,
        },
      },
    })
  })

  test('handles api:FAILURE', () => {
    const emptyState = {}
    const oldRequestState = {
      name: {
        otherPath: {inProgress: false},
        path: {
          inProgress: true,
          request: {foo: 'bar'},
          response: {baz: 'qux'},
          error: null,
        },
      },
    }

    const action = {
      type: 'api:FAILURE',
      payload: {robot: {name: 'name'}, path: 'path', error: new Error('AH')},
    }

    expect(apiReducer(emptyState, action)).toEqual({
      name: {
        path: {inProgress: false, error: new Error('AH')},
      },
    })

    expect(apiReducer(oldRequestState, action)).toEqual({
      name: {
        otherPath: {inProgress: false},
        path: {
          inProgress: false,
          request: {foo: 'bar'},
          response: {baz: 'qux'},
          error: new Error('AH'),
        },
      },
    })
  })
})
