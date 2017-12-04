#!/usr/bin/env bash

export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket

# Network Manager Setup
nmcli connection add \
  save no \
  con-name 'local-ethernet' \
  autoconnect yes \
  type ethernet \
  ifname eth0 \
  ipv6.method manual \
  ipv6.address fe80::cafe:fefe/64 \
  ipv4.method link-local

echo "fe80::cafe:fefe%eth0 local-ethernet" >> /etc/hosts

# Dropbear config
if [ ! -e /etc/dropbear/ ] ; then
  mkdir /etc/dropbear/
fi
if [ ! -e /etc/dropbear/dropbear_dss_host_key ] ; then
  echo "Generating DSS-Hostkey..."
  /usr/bin/dropbearkey -t dss -f /etc/dropbear/dropbear_dss_host_key
fi
if [ ! -e /etc/dropbear/dropbear_rsa_host_key ] ; then
  echo "Generating RSA-Hostkey..."
  /usr/bin/dropbearkey -t rsa -f /etc/dropbear/dropbear_rsa_host_key
fi
if [ ! -e /etc/dropbear/dropbear_ecdsa_host_key ] ; then
  echo "Generating ECDSA-Hostkey..."
  /usr/bin/dropbearkey -t ecdsa -f /etc/dropbear/dropbear_ecdsa_host_key
fi
