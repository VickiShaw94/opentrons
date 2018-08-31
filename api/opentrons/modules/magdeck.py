from opentrons.drivers.mag_deck import MagDeck as MagDeckDriver
from opentrons import commands


class MissingDevicePortError(Exception):
    pass


# TODO: BC 2018-08-03 this class shares a fair amount verbatim from TempDeck,
# there should be an upstream ABC in the future to contain shared logic
# between modules
class MagDeck:
    '''
    Under development. API subject to change
    '''
    def __init__(self, lw=None, port=None):
        self.labware = lw
        self._port = port
        self._engaged = False
        self._driver = None
        self._device_info = None

    @commands.publish.both(command=commands.magdeck_calibrate)
    def calibrate(self):
        '''
        Calibration involves probing for top plate to get the plate height
        '''
        if self._driver and self._driver.is_connected():
            self._driver.probe_plate()
            # return if successful or not?
            self._engaged = False

    @commands.publish.both(command=commands.magdeck_engage)
    def engage(self):
        '''
        Move the magnet to plate top - 0.4 mm
        '''
        if self._driver and self._driver.is_connected():
            self._driver.move(self._driver.plate_height - 0.4)
            self._engaged = True

    @commands.publish.both(command=commands.magdeck_disengage)
    def disengage(self):
        '''
        Home the magnet
        '''
        if self._driver and self._driver.is_connected():
            self._driver.home()
            self._engaged = False

    # TODO: there should be a separate decoupled set of classes that
    # construct the http api response entity given the model instance.
    def to_dict(self):
        return {
            'name': 'magdeck',
            'port': self.port,
            'serial': self.device_info and self.device_info.get('serial'),
            'model': self.device_info and self.device_info.get('model'),
            'fwVersion': self.device_info and self.device_info.get('version'),
            'displayName': 'Magnetic Deck',
            'status': self.status,
            'data': {'engaged': self._engaged}
        }

    @property
    def port(self):
        """ Serial Port """
        return self._port

    @property
    def device_info(self):
        """
        Returns a dict:
            { 'serial': 'abc123', 'model': '8675309', 'version': '9001' }
        """
        return self._device_info

    @property
    def status(self):
        return 'engaged' if self._engaged else 'disengaged'

    # Internal Methods

    def connect(self):
        '''
        Connect to the serial port
        '''
        if self._port:
            self._driver = MagDeckDriver()
            self._driver.connect(self._port)
            self._device_info = self._driver.get_device_info()
        else:
            # Sanity check: Should never happen, because connect should
            # never be called without a port on Module
            raise MissingDevicePortError(
                "MagDeck couldnt connect to port {}".format(self._port)
            )

    def disconnect(self):
        '''
        Disconnect from the serial port
        '''
        if self._driver:
            self._driver.disconnect()

    def update_firmware(self):
        """
        Disconnect from current port, connect at 1200 baud and disconnect to
        enter bootloader on a different port
        """
        self.disconnect()
        self._driver.connect(self._port, 1200)
        self._driver.disconnect()
