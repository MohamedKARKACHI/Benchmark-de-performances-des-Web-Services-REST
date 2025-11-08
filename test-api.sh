#!/bin/bash

echo "Testing API Endpoints..."
echo ""

# Test Variant C (Spring MVC)
echo "Testing Variant C (Spring MVC) - http://localhost:8080"
echo ""
echo "Categories:"
curl -s http://localhost:8080/categories?page=0\&size=5 | head -c 200
echo -e "\n"

echo "Items:"
curl -s http://localhost:8080/items?page=0\&size=5 | head -c 200
echo -e "\n\n"

# Test Variant D (Spring REST)
echo "Testing Variant D (Spring Data REST) - http://localhost:8081"
echo ""
echo "Categories:"
curl -s http://localhost:8081/categories?page=0\&size=5 | head -c 200
echo -e "\n"

echo "Items:"
curl -s http://localhost:8081/items?page=0\&size=5 | head -c 200
echo -e "\n"
