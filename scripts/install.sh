info() {
  local action="$1"
  local details="$2"
  command printf '\033[96m%12s\033[m %s\n' "$action" "$details" 1>&2
}
error() {
  command printf '\033[31mError\033[m: %s\n\n' "$1" 1>&2
}
warning() {
  command printf '\033[33mWarning\033[m: %s\n\n' "$1" 1>&2
}


check_root(){
    if [ ${EUID:-${UID}} = 0 ]; then
        echo 'true'
    else
        echo 'false'
    fi
}
user_exists(){
    if id -u "$1" >/dev/null 2>&1; then
        echo 'true'
    else
        echo 'false'
    fi
}

daemon_file(){
    local execFile=$1
    local dir=$2
    local lines=`cat <<EOF
[Unit]
Description=BaCon Service
After=network-online.target
[Service]
Type=simple
ExecStart=$execFile
WorkingDirectory=$dir
User=bacon
Group=bacon
Restart=always
[Install]
WantedBy=multi-user.target
EOF
`
    echo "${lines}"
}
get_latest_release(){
    echo "0.3"
}
release_url() {
    echo "https://github.com/dn5-run/BaCon/releases"
}

download_release(){
    local version="$1"
    local tmpdir="$(mktemp -d)"
    
    local filename="BaCon-linux"
    local download_file="$tmpdir/$filename"
    local archive_url="$(release_url)/download/v$version/$filename"

    info "Downloading" "$archive_url to $download_file" 
    
    curl --progress-bar --show-error --location --fail "$archive_url" --output "$download_file" --write-out '%{filename_effective}'
}

install(){
    local version="$1"
    local outDir="/opt/BaCon"

    if [ ! -e "$outDir" ]; then
        mkdir -p "$outDir"
    fi
    
    info 'Fetching' "version $version"
    local download_archive="$(download_release "$version")"
    local filename="$(basename "$download_archive")"
    local user="bacon"

    info 'Installing' "to $outDir"
    cp "$download_archive" "$outDir"
    chmod +x "$outDir/$filename"

    info 'Creating' "Daemon file"
    
    if [ "$(user_exists "$user")" = "false" ]; then
        useradd -m "$user"
        echo "bacon:bacon" | chpasswd
    fi

    local daemonfile="$(daemon_file "$outDir/$filename" "$outDir")"
    echo "$daemonfile" > "/etc/systemd/system/bacon.service"
}

if [ "$(check_root)" = "true" ]; then
    info "Start install..."
    install "$(get_latest_release)"
else
    error "You must be root to run this script"
fi
