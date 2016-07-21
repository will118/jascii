home_dir=~
sound_file=$(mktemp)
archive_file=$(mktemp)
frame_dir=$(mktemp -d)
curl -s "crap.tech/caca?w=$(tput cols)&h=$(tput lines)&compress=true" -o "$archive_file"
tar xf $archive_file -C $frame_dir

trap cleanup INT

function cleanup() {
  tput cnorm
  tput clear
  exit
}

last_file=$(ls -1v $frame_dir | tail -n 1)
tput clear
tput civis

i=0

while [ true ] ; do
  tput clear
  printf "\033[2H"
  cat "$frame_dir/$i"
  sleep 0.066
  let i=i+1
  if [ "$i" -gt "$last_file" ]
  then
    let i=0
  fi
done
