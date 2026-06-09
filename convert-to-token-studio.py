#!/usr/bin/env python3
import json

# Read the current tokens file
with open('enfineitz-figma.tokens.json', 'r') as f:
    tokens = json.load(f)

# Token Studio proper format:
# - Has a $metadata object at the root
# - Tokens are organized in named sets (not categories at root)
# - References work within sets

# Remove the extensions metadata from tokens to clean them up
def clean_token(obj):
    """Recursively remove Figma extensions metadata"""
    if isinstance(obj, dict):
        cleaned = {}
        for key, value in obj.items():
            if key == 'extensions':
                continue  # Skip Figma extensions
            elif isinstance(value, dict) and 'value' in value:
                # This is a token - clean it but keep value and type
                cleaned[key] = {
                    k: clean_token(v) if k not in ['value', 'type', 'description'] else v
                    for k, v in value.items()
                    if k in ['value', 'type', 'description']
                }
            else:
                cleaned[key] = clean_token(value)
        return cleaned
    elif isinstance(obj, list):
        return [clean_token(item) for item in obj]
    else:
        return obj

# Clean the tokens
cleaned_tokens = clean_token(tokens)

# Create Token Studio format with global token set
token_studio_format = {
    "$metadata": {
        "tokenSetOrder": [
            "global"
        ]
    },
    "global": cleaned_tokens
}

# Save the cleaned version
with open('enfineitz-figma.tokens-tokenstudio.json', 'w') as f:
    json.dump(token_studio_format, f, indent=2, ensure_ascii=False)

print("✓ Created Token Studio compatible file: enfineitz-figma.tokens-tokenstudio.json")
print("✓ Added $metadata with tokenSetOrder")
print("✓ Wrapped tokens in 'global' token set")
print("✓ Removed Figma extensions metadata")
print("\nTo use in Token Studio:")
print("  1. Import this new file into Token Studio")
print("  2. References should now resolve within the 'global' set")
print("  3. Format: {spacing.primitive.xs8} (no set prefix needed within same set)")
