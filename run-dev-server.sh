#!/bin/bash


function build()
{
    reset;
    make
}

cd `dirname "$0"`
build;

cd _site
python -m http.server &
trap "kill $!; exit 0;" SIGINT SIGTERM

cd ..
while inotifywait -qe MOVE_SELF -- `find . -name '*'`;
do
    build;
done
