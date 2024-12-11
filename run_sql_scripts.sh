#!/bin/bash

# Define container and database details
declare -A databases
databases=(
  ["nestbloggerauthapipostgressql_postgres_1"]="blogs"
  ["nestbloggerauthapipostgressql_test-db_1"]="test_blogs"
)

# Define the script directories
sql_dir="./sql"

# Loop through the databases
for container in "${!databases[@]}"; do
  database=${databases[$container]}
  script_path="${sql_dir}/${database}/01_create_tables.sql"

  echo "Running SQL script for container: $container, database: $database"

  # Check if the SQL script exists
  if [ ! -f "$script_path" ]; then
    echo "Error: Script $script_path not found. Skipping..."
    continue
  fi

  # Copy the script to the container
  docker cp "$script_path" "$container:/tmp/01_create_tables.sql"

  # Run the script inside the container
  docker exec -it "$container" psql -U admin -d "$database" -f /tmp/01_create_tables.sql

  echo "Finished running SQL script for database: $database"
done

echo "All scripts executed."
