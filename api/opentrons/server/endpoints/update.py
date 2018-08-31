import logging
import asyncio
from opentrons import robot

log = logging.getLogger(__name__)


async def _update_firmware(filename, loop):
    """
    This method remains in the API currently because of its use of the robot
    singleton's copy of the driver. This should move to the server lib project
    eventually and use its own driver object (preferably involving moving the
    drivers themselves to the serverlib)
    """
    # ensure there is a reference to the port
    if not robot.is_connected():
        robot.connect()

    # get port name
    port = str(robot._driver.port)
    # set smoothieware into programming mode
    robot._driver._smoothie_programming_mode()
    # close the port so other application can access it
    robot._driver._connection.close()

    # run lpc21isp, THIS WILL TAKE AROUND 1 MINUTE TO COMPLETE
    update_cmd = 'lpc21isp -wipe -donotstart {0} {1} {2} 12000'.format(
        filename, port, robot.config.serial_speed)
    proc = await asyncio.create_subprocess_shell(
        update_cmd,
        stdout=asyncio.subprocess.PIPE,
        loop=loop)
    rd = await proc.stdout.read()
    res = rd.decode().strip()
    await proc.wait()

    # re-open the port
    robot._driver._connection.open()
    # reset smoothieware
    robot._driver._smoothie_reset()
    # run setup gcodes
    robot._driver._setup()

    return res


async def _update_module_firmware(
        serialnum, fw_filename, config_file_path, loop):
    """
    This method remains in the API currently because of its use of the robot
    singleton's copy of the api object & driver. This should move to the server
    lib project eventually and use its own driver object (preferably involving
    moving the drivers themselves to the serverlib)
    """
    from opentrons import modules

    # ensure there is a reference to the port
    if not robot.is_connected():
        robot.connect()
    for module in robot.modules:
        module.disconnect()
    robot.modules = modules.discover_and_connect()
    # robot._driver.simulating = False
    res = ''
    for module in robot.modules:
        if module.device_info.get('serial') == serialnum:
            print("Module with serial found!")
            modules.enter_bootloader(module)
            res = await modules.update_firmware(
                module, fw_filename, config_file_path, loop)
            break
    # robot._driver.simulating = True
    return res if res else 'Module update error on {}!'.format(serialnum)
