#!/bin/bash
service spotiguessapi restart
echo api restarted
service spotiguess restart
echo frontend restarted
service nginx restart
echo nginx restarted
systemctl daemon reload
echo systemctl restarted
