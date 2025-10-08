#!/usr/bin/env bash
set -euo pipefail

# === LOAD ENVIRONMENT VARIABLES === THIS IS NOW HANDLED IN THE COMPOSE FILE
# if [[ -f "./.env" ]]; then
#   # Export all variables from .env
#   export $(grep -v '^#' ../.env | xargs)
# else
#   echo ".env file not found."
#   exit 1
# fi

MYSQL_HOST="${DB_HOST:-db}"
MYSQL_HOST="db"
MYSQL_PORT="${DB_PORT:-3306}"
TABLE_NAME="users"

# === VERIFY REQUIRED VARIABLES ===
: "${MYSQL_USER:?Missing MYSQL_USER in .env}"
: "${MYSQL_PASSWORD:?Missing MYSQL_PASSWORD in .env}"
: "${MYSQL_ROOT_PASSWORD:?Missing MYSQL_ROOT_PASSWORD in .env}"
: "${MYSQL_DATABASE:?Missing MYSQL_DATABASE in .env}"

# === TEST 1: Server Reachability ===
echo "[1] Checking if MySQL is reachable..."
if ! mysqladmin ping -h"$MYSQL_HOST" -P"$MYSQL_PORT" --silent; then
  echo "MySQL server not reachable at ${MYSQL_HOST}:${MYSQL_PORT}"
  exit 1
else
  echo "Server reachable."
fi

# === TEST 2: Authentication ===
echo "[2] Testing authentication..."
if ! mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "SELECT 1;" ; then
  echo "Authentication failed for user '$MYSQL_USER'"
  exit 1
else
  echo "Authentication succeeded."
fi

# === TEST 3: Basic Query ===
echo "[3] Testing basic query..."
RESULT=$(mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -Nse "SELECT 1+1;")
if [[ "$RESULT" == "2" ]]; then
  echo "Query executed correctly."
else
  echo "Query failed or returned unexpected result: $RESULT"
  exit 1
fi

# === TEST 4: Database Check ===
echo "[4] Checking database '$MYSQL_DATABASE'..."
if ! mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "USE $MYSQL_DATABASE;" &>/dev/null; then
  echo "Database '$MYSQL_DATABASE' not found."
  exit 1
else
  echo "Database '$MYSQL_DATABASE' accessible."
fi

# === TEST 5: Create a User ===
echo "[5] Creating user"
if ! mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -D"$MYSQL_DATABASE" -e \
"INSERT INTO $TABLE_NAME (username, email, password_hash)
 VALUES ('johndoe', 'johndoe@example.com', '67hashvalue');" ; then 
  echo "Could not create user"
  exit 1
else
  echo "successfully created user"
  COUNT=$(mysql -h"$MYSQL_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -D"$MYSQL_DATABASE" \
  -Nse "SELECT COUNT(*) FROM $TABLE_NAME WHERE username='johndoe';")
  if [[ "$COUNT" -ne 1 ]]; then
    echo "Could not find user" 
    exit 1
  else 
    echo "Found user"
  fi
fi

# === TEST 6: Try to Create a Duplicate User ===
echo "[6] Creating duplicate user"
if ! mysql -h"$MYSQL_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -D"$MYSQL_DATABASE" -e \
"INSERT INTO $TABLE_NAME (username, email, password_hash)
 VALUES ('johndoe', 'test123@yahoo.com', 'skibidi');" &>/dev/null; then 
  echo "Confirmed that repeat usernames cannot be used"
else
  echo "allowed repeat usernames"
  exit 1
fi

# TODO: Figure out password format and create a test for it


echo "All MySQL tests passed successfully."
exit 0