#!/bin/bash
if [ -f .env ]; then
  export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst)

  file="dump/catalogue.json"
  count=$(find $BASE_PATH -mindepth 1 -maxdepth 1 -type d | wc -l)
  timestamp=`date +"%Y-%m-%d %T"`
  id=1

  echo "*** Parsing the list and the full catalogue. This will take a while..."

  echo -n "" > $file
  tree -JNd -L 3 $BASE_PATH >> $file

  echo "*** Updated list"
else
  echo "You need to set the BASE_PATH in .env to build the list."
fi
