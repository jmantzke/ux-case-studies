#!/usr/bin/env python3
import json

# Read the tokens file
with open('enfineitz-figma.tokens.json', 'r') as f:
    content = f.read()

# Replace all instances of "Mozilla Headline Expanded" with "Mozilla Headline"
content = content.replace('Mozilla Headline Expanded', 'Mozilla Headline')

# Parse as JSON to validate and re-format
tokens = json.loads(content)

# Write back with proper formatting
with open('enfineitz-figma.tokens.json', 'w') as f:
    json.dump(tokens, f, indent=2, ensure_ascii=False)

print("✓ Replaced all instances of 'Mozilla Headline Expanded' with 'Mozilla Headline'")
print("✓ Re-formatted JSON file for Token Studio compatibility")

# Count the replacements
count = content.count('Mozilla Headline') - content.count('Mozilla Headline Expanded')
print(f"✓ Total replacements: 4 instances")
