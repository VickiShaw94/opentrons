// mock rpc session
// based on api/opentrons/api/session.py
export default function MockSession () {
  return {
    name: 'MOCK SESSION',
    protocol_text: '# mock protocol text',
    commands: [],
    command_log: {},
    state: 'loaded',
    instruments: [],
    containers: [],

    // TODO(mc, 2018-07-16): THIS IS A MOCK
    modules: [],

    run: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    stop: jest.fn(),
    refresh: jest.fn(),
  }
}
