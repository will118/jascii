home_dir=~
sound_file=$(mktemp)
archive_file=$(mktemp)
frame_dir=$(mktemp -d)
curl -s "localhost:3000/caca?w=$(tput cols)&h=$(tput lines)&override=weed&compress=true" -o "$archive_file"
tar xf $archive_file -C $frame_dir

trap cleanup INT

function cleanup() {
  killall afplay
  tput cnorm
  tput clear
  exit
}

curl -s crap.tech/tne.mp3 -A '' -o "$sound_file"
afplay "$sound_file" &

last_file=$(ls -1v $frame_dir | tail -n 1)
tput clear
sleep 10.27

i=0

while [ true ] ; do
  cat "$frame_dir/$i"
  sleep 0.066
  let i=i+1
  if [ "$i" -gt "$last_file" ]
  then
    let i=0
  fi
done
