#!/usr/bin/env python3
import json
import re

# Read the tokens file
with open('enfineitz-figma.tokens.json', 'r') as f:
    tokens = json.load(f)

def get_token_value(tokens, path):
    """Navigate through nested object using dot notation"""
    parts = path.split('.')
    current = tokens
    for part in parts:
        if isinstance(current, dict) and part in current:
            current = current[part]
        else:
            return None
    if isinstance(current, dict) and 'value' in current:
        return current['value']
    return None

def find_all_references(obj, path=""):
    """Recursively find all token references in the object"""
    references = []
    if isinstance(obj, dict):
        for key, value in obj.items():
            current_path = f"{path}.{key}" if path else key
            if key == 'value' and isinstance(value, str) and value.startswith('{') and value.endswith('}'):
                # Extract the reference path
                ref_path = value[1:-1]  # Remove { and }
                references.append((current_path, ref_path))
            references.extend(find_all_references(value, current_path))
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            references.extend(find_all_references(item, f"{path}[{i}]"))
    return references

# Find all references
refs = find_all_references(tokens)

print(f"Found {len(refs)} token references\n")

broken_refs = []
working_refs = []

for location, ref_path in refs:
    # Check if the referenced token exists
    token_value = get_token_value(tokens, ref_path)
    if token_value is None:
        broken_refs.append((location, ref_path))
        print(f"❌ BROKEN: {location}")
        print(f"   References: {ref_path}")
        print(f"   Token not found!\n")
    else:
        working_refs.append((location, ref_path, token_value))

print(f"\n{'='*60}")
print(f"Summary:")
print(f"  Working references: {len(working_refs)}")
print(f"  Broken references: {len(broken_refs)}")

if broken_refs:
    print(f"\n❌ Found {len(broken_refs)} broken references that need fixing!")
else:
    print(f"\n✅ All token references are valid!")
    print(f"\nNote: If Token Studio still shows broken references, the issue may be:")
    print(f"  1. Token Studio cache - try reloading the file")
    print(f"  2. Token set configuration in Token Studio")
    print(f"  3. Extension metadata interfering with Token Studio parsing")
