trap cleanup INT

function cleanup() {
  killall afplay
  tput cnorm
  tput clear
}

temp_file=$(mktemp)
curl crap.tech/tne.mp3 -A '' -o "$temp_file"
afplay "$temp_file" &
tput clear
sleep 10.70
curl "crap.tech/caca?w=$(tput cols)&h=$(tput lines)&override=weed"
