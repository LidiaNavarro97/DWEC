#!/usr/bin/env bash
#
# refuerzo.sh — El mando del refuerzo de la Práctica 1 de DWEC.
#   ./refuerzo.sh ayuda        -> lista de órdenes
#
set -uo pipefail
cd "$(dirname "$0")" || exit 1

IMAGEN=dwec-refuerzo-p1:1
PUERTO=6100
URL="http://localhost:$PUERTO"
export UID_ALUMNO GID_ALUMNO
UID_ALUMNO=$(id -u)
GID_ALUMNO=$(id -g)

# ---------- colores ----------
if [ -t 1 ]; then
    R=$'\e[1;31m'; V=$'\e[1;32m'; A=$'\e[1;33m'; Z=$'\e[1;34m'; N=$'\e[1m'; X=$'\e[0m'
    export FORCE_COLOR=1
else
    R=""; V=""; A=""; Z=""; N=""; X=""
fi
info()  { echo "${Z}▶${X} $*"; }
bien()  { echo "${V}✔${X} $*"; }
aviso() { echo "${A}!${X} $*"; }
error() { echo "${R}✘ $*${X}" >&2; }

# ---------- ¿Docker o Node? ----------
hay_docker() { command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; }
hay_imagen() { docker image inspect "$IMAGEN" >/dev/null 2>&1; }
hay_node()   { command -v node >/dev/null 2>&1; }

# MODO=docker (lo normal) o MODO=node (plan B: sin Docker, con Node instalado en tu PC)
if hay_docker; then MODO=docker
elif hay_node; then MODO=node
else MODO=nada
fi

necesita_entorno() {
    case "$MODO" in
        docker)
            if ! hay_imagen; then
                error "Todavía no has preparado el entorno."
                echo "  Ejecuta primero:  ./refuerzo.sh preparar"
                exit 1
            fi ;;
        node)
            aviso "No puedo usar Docker: uso el Node de tu ordenador (plan B, sin ESLint)." ;;
        nada)
            error "No encuentro ni Docker ni Node."
            echo "  - ¿Docker está instalado y arrancado?   docker info"
            echo "  - En Linux, ¿tu usuario está en el grupo docker?   sudo usermod -aG docker \$USER  (y cierra sesión)"
            echo "  - Plan B: instala Node 22 (https://nodejs.org) y vuelve a probar."
            exit 1 ;;
    esac
}

compose_con_huecos() { sed -n '/^  web:/,$p' docker-compose.yml 2>/dev/null | grep -q "____"; }
compose_ok() { docker compose config -q >/dev/null 2>&1; }
web_ok() {
    if command -v curl >/dev/null 2>&1; then curl -s -o /dev/null --max-time 2 "$URL"
    else (exec 3<>/dev/tcp/127.0.0.1/$PUERTO) 2>/dev/null
    fi
}

# Ejecuta una orden dentro de la imagen, con tu carpeta en /app y tus permisos
en_contenedor() {
    local tty=(); [ -t 1 ] && tty=(-t -e FORCE_COLOR=1)
    docker run --rm -i "${tty[@]}" -v "$PWD":/app -w /app -u "$UID_ALUMNO:$GID_ALUMNO" \
        -e COMPOSE_OK -e WEB_OK "$IMAGEN" "$@"
}

# ---------- órdenes ----------
cmd_ayuda() {
    cat <<EOF
${N}DWEC · Refuerzo de la Práctica 1${X}

  ${N}./refuerzo.sh preparar${X}        (1 vez) Tu nombre y construir la imagen (unos minutos, necesita internet)
  ${N}./refuerzo.sh arrancar${X}        Arrancar Vite → $URL
  ${N}./refuerzo.sh comprobar${X}       Ver qué llevas bien y qué te falta (todos los bloques)
  ${N}./refuerzo.sh comprobar 2${X}     Solo un bloque: 0, d, 1, 2, 3, 4, 5, 6, final
  ${N}./refuerzo.sh lint${X}            Pasar ESLint a todo src/   (o: ./refuerzo.sh lint src/bloque0/errores-lint.js)
  ${N}./refuerzo.sh logs${X}            Ver lo que dice Vite (Ctrl+C para salir)
  ${N}./refuerzo.sh parar${X}           Parar Vite al terminar (no se pierde nada)
  ${N}./refuerzo.sh entregar${X}        Generar el .zip de la entrega en entrega/
  ${N}./refuerzo.sh ayuda${X}           Esta lista

  Modo: ${N}$MODO${X}$([ "$MODO" = node ] && echo "  (plan B sin Docker: funciona, pero sin ESLint)")
EOF
}

cmd_preparar() {
    local nombre=""
    # shellcheck disable=SC1091
    [ -f alumno.conf ] && . ./alumno.conf && nombre="${ALUMNO_NOMBRE:-}"
    if [ -z "$nombre" ]; then
        read -r -p "Tu nombre y primer apellido (p. ej. Lidia Navarro): " nombre
        [ -z "$nombre" ] && { error "Necesito tu nombre."; exit 1; }
        printf 'ALUMNO_NOMBRE=%q\n' "$nombre" > alumno.conf
    fi
    bien "Hola, $nombre."
    case "$MODO" in
        docker)
            info "Construyendo la imagen $IMAGEN (Node + Vite + ESLint + Git). La primera vez tarda unos minutos..."
            if docker build -q -t "$IMAGEN" . >/dev/null; then bien "Imagen lista."
            else error "No se ha podido construir la imagen. ¿Tienes internet?"; exit 1
            fi ;;
        node)
            aviso "No puedo usar Docker. Plan B: usaré el Node de tu ordenador ($(node --version))."
            aviso "Necesitarás internet la primera vez que hagas ./refuerzo.sh arrancar (descarga Vite)." ;;
        nada) necesita_entorno ;;
    esac
    command -v git >/dev/null 2>&1 || aviso "No encuentro git en tu ordenador: instálalo (sudo apt install git) para el paso 0.2."
    echo
    echo "Siguiente paso: el ${N}Bloque 0${X} del enunciado (paso 0.2: Git)."
}

cmd_arrancar() {
    necesita_entorno
    if [ "$MODO" = node ]; then
        info "Arrancando Vite con tu Node en $URL  (Ctrl+C para pararlo; deja esta terminal abierta)"
        exec npx --yes vite@8.3.3 --port "$PUERTO" --strictPort
    fi
    if compose_con_huecos; then
        error "El servicio web de docker-compose.yml todavía tiene huecos ____ (paso 0.3)."
        exit 1
    fi
    if ! compose_ok; then
        error "docker-compose.yml tiene un error. Esto es lo que dice Docker:"
        docker compose config -q
        exit 1
    fi
    if ! docker compose up -d web; then
        error "No se ha podido arrancar. Si dice «port is already allocated», el $PUERTO está ocupado: ./refuerzo.sh parar y vuelve a probar."
        exit 1
    fi
    for _ in $(seq 1 20); do web_ok && break; sleep 0.5; done
    if web_ok; then
        bien "Vite arrancado: abre ${N}$URL${X}"
        command -v xdg-open >/dev/null && (xdg-open "$URL" >/dev/null 2>&1 &)
    else
        aviso "El contenedor está en marcha pero $URL no responde todavía. Mira ./refuerzo.sh logs"
    fi
}

cmd_parar() {
    [ "$MODO" = docker ] && docker compose down && bien "Parado."
    [ "$MODO" = node ] && echo "En el plan B, Vite se para con Ctrl+C en su terminal."
    true
}

cmd_logs() {
    [ "$MODO" = docker ] || { echo "En el plan B, los mensajes de Vite salen en su terminal."; exit 0; }
    docker compose logs -f web
}

cmd_comprobar() {
    necesita_entorno
    if [ "$MODO" = node ]; then
        COMPOSE_OK="" WEB_OK="" node comprobador/comprobar.mjs "$@"
        return
    fi
    export COMPOSE_OK WEB_OK
    if compose_con_huecos; then COMPOSE_OK=""; elif compose_ok; then COMPOSE_OK=1; else COMPOSE_OK=0; fi
    if web_ok; then WEB_OK=1; else WEB_OK=0; fi
    en_contenedor node comprobador/comprobar.mjs "$@"
}

cmd_lint() {
    necesita_entorno
    if [ "$MODO" = node ]; then aviso "Sin Docker no hay ESLint en el plan B."; exit 0; fi
    local objetivo=("$@"); [ ${#objetivo[@]} -eq 0 ] && objetivo=(src)
    if en_contenedor eslint -c /opt/herramientas/eslint.config.js "${objetivo[@]}"; then
        bien "ESLint: sin errores en ${objetivo[*]}"
    else
        echo
        echo "Cada línea es:  ${N}línea:columna  error  mensaje  regla${X}.  Arregla los ${R}error${X} (los warning son avisos)."
    fi
}

cmd_entregar() {
    # shellcheck disable=SC1091
    [ -f alumno.conf ] && . ./alumno.conf
    local nombre="${ALUMNO_NOMBRE:-sin-nombre}" usuario
    usuario=$(echo "$nombre" | iconv -f utf-8 -t ascii//TRANSLIT 2>/dev/null | tr 'A-Z ' 'a-z-' | tr -cd 'a-z0-9-')
    [ -z "$usuario" ] && usuario=alumno
    mkdir -p entrega
    info "Pasando el comprobador (se guarda en entrega/informe-comprobador.txt)..."
    cmd_comprobar --informe >/dev/null 2>&1
    tail -n 3 entrega/informe-comprobador.txt 2>/dev/null
    if [ -d .git ] && [ -n "$(git status --porcelain 2>/dev/null)" ]; then
        aviso "Tienes cambios sin commit. Haz el último:  git add . && git commit -m \"Entrega\"  (y vuelve a entregar)"
    fi
    local zip="entrega/refuerzo-p1-$usuario.zip"
    rm -f "$zip"
    local carpeta; carpeta=$(basename "$PWD")
    if command -v zip >/dev/null 2>&1; then
        (cd .. && zip -qr "$carpeta/$zip" "$carpeta" -x "$carpeta/entrega/*.zip" "$carpeta/node_modules/*")
    elif command -v python3 >/dev/null 2>&1; then
        python3 - "$zip" "$carpeta" <<'PY'
import os, sys, zipfile
destino, carpeta = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED) as z:
    for raiz, dirs, ficheros in os.walk("."):
        dirs[:] = [d for d in dirs if d != "node_modules"]
        for f in ficheros:
            ruta = os.path.join(raiz, f)
            if ruta.startswith("./entrega/") and f.endswith(".zip"):
                continue
            z.write(ruta, os.path.join(carpeta, os.path.relpath(ruta, ".")))
PY
    else
        error "No encuentro zip ni python3 para comprimir. Comprime tú la carpeta $carpeta entera (con la carpeta .git)."
        exit 1
    fi
    bien "Entrega lista: ${N}$zip${X}"
}

orden="${1:-ayuda}"; shift || true
case "$orden" in
    preparar)  cmd_preparar ;;
    arrancar)  cmd_arrancar ;;
    parar)     cmd_parar ;;
    logs)      cmd_logs ;;
    comprobar) cmd_comprobar "$@" ;;
    lint)      cmd_lint "$@" ;;
    entregar)  cmd_entregar ;;
    ayuda|-h|--help) cmd_ayuda ;;
    *) error "No conozco la orden «$orden»."; cmd_ayuda; exit 1 ;;
esac
