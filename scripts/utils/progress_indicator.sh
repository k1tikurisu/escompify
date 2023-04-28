#!/bin/bash

set -Ceu

# Copyright (c) 2018 Leandro Nunes
# https://github.com/lnfnunes/bash-progress-indicator

FRAME=("⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏")

start() {
  local step=0

  tput civis -- invisible

  while [ "$step" -lt "${#CMDS[@]}" ]; do
    ${CMDS[$step]} > /dev/null 2>&1 & pid=$!

    while ps -p $pid &>/dev/null; do
      echo -ne "\\r[       ${STEPS[$step]} ..."

      for k in "${!FRAME[@]}"; do
        echo -ne "\\r[${FRAME[k]}] $((step + 1))/${#CMDS[@]}"
        sleep 0.1
      done
    done

    echo -ne "\\r[✔] $((step + 1))/${#CMDS[@]} ${STEPS[$step]}\\n"
    step=$((step + 1))
  done

  tput cnorm -- normal
}