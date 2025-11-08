#!/bin/bash
set -e

echo "Building Variant C (Spring MVC)..."
cd variant-c-mvc
mvn clean package -DskipTests
cd ..

echo "Building Variant D (Spring Data REST)..."
cd variant-d-rest
mvn clean package -DskipTests
cd ..

echo "All builds complete!"
echo "Run: docker-compose up -d"
