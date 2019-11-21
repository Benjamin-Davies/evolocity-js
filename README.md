# evolocity-js

## Tau-morrow Raspberry Pi software

*Please do not use the keys in this repository for anything nefarious*

## Basic explanation

The main component of our Raspberry Pi setup is a custom Node.js application that collects data from our sensors and (gpsd)[http://manpages.ubuntu.com/manpages/trusty/man8/gpsd.8.html]. It then logs it to a file and sends it to Firebase. The application also allows connections over a UNIX socket, which is used by our status bar. The application is lauched using systemd and a service config file located in the root of the repository.

The status bar is Polybar, accompanied by a config file which is also in the root of the repository. It uses a small application whose sole purpose is to get information from the main process, and format to be displayed on the status bar. This small program was written in rust to allow it to start very quickly on the relatively slow Pi.

The map is an instance of Navit, which is using map data from OpenStreetMap.
