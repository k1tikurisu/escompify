source ./.env

sshpass -p ${BRAIN_PASSWORD} ssh -L 8000:127.0.0.1:8080 -o ProxyCommand="sshpass -p ${WAKAYAMA_PASSWORD} ssh -i ~/.ssh/id_ed25519 -p ${WAKAYAMA_PORT} -l ${WAKAYAMA_USER_NAME} ${WAKAYAMA_HOST} nc %h %p" ${BRAIN_USER_NAME}@${BRAIN_HOST}
