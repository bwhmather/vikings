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
server_pid=$!
trap "kill $server_pid; exit 0;" SIGINT SIGTERM

cd ..
while true; do
    inotifywait -qe MOVE_SELF -- `find . -name '*'`;
    build;
done
