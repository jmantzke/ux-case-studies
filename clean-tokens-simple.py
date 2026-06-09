#!/usr/bin/env python3
import json

# Read the current tokens file
with open('enfineitz-figma.tokens.json', 'r') as f:
    tokens = json.load(f)

def clean_token_simple(obj):
    """Remove extensions metadata but keep token structure"""
    if isinstance(obj, dict):
        cleaned = {}
        for key, value in obj.items():
            if key == 'extensions':
                # Skip Figma extensions entirely
                continue
            elif isinstance(value, dict):
                cleaned[key] = clean_token_simple(value)
            else:
                cleaned[key] = value
        return cleaned
    elif isinstance(obj, list):
        return [clean_token_simple(item) for item in obj]
    else:
        return obj

# Clean the tokens
cleaned_tokens = clean_token_simple(tokens)

# Save back to the original file
with open('enfineitz-figma.tokens.json', 'w') as f:
    json.dump(cleaned_tokens, f, indent=2, ensure_ascii=False)

print("✓ Removed Figma extensions metadata from all tokens")
print("✓ Kept original token structure (categories at root)")
print("✓ All token references remain: {spacing.primitive.xs8}")
print("\nThis should help Token Studio properly recognize and resolve token references.")
