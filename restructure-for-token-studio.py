#!/usr/bin/env python3
import json

# Read the current tokens file
with open('enfineitz-figma.tokens.json', 'r') as f:
    tokens = json.load(f)

# Token Studio expects a different structure:
# The root should contain token set names, not token categories directly
# We'll wrap all current tokens in a "core" token set

token_studio_format = {
    "core": tokens
}

# Save the Token Studio compatible version
with open('enfineitz-figma.tokens.json', 'w') as f:
    json.dump(token_studio_format, f, indent=2, ensure_ascii=False)

print("✓ Restructured tokens for Token Studio compatibility")
print("✓ All tokens are now in a 'core' token set")
print("\nStructure: core.spacing.primitive.xs8")
print("Reference format should now be: {core.spacing.primitive.xs8}")
