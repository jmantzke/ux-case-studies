#!/usr/bin/env python3
import json

# Read the existing tokens file
with open('enfineitz-figma.tokens.json', 'r') as f:
    tokens = json.load(f)

# New color palette in Token Studio format
new_colors = {
    "primary": {
        "900": {
            "type": "color",
            "value": "#4A3200",
            "description": "Primary 900"
        },
        "800": {
            "type": "color",
            "value": "#6A4600",
            "description": "Primary 800"
        },
        "700": {
            "type": "color",
            "value": "#8A5A00",
            "description": "Primary 700"
        },
        "600": {
            "type": "color",
            "value": "#B07A12",
            "description": "Primary 600"
        },
        "500": {
            "type": "color",
            "value": "#FFC745",
            "description": "Primary 500"
        },
        "400": {
            "type": "color",
            "value": "#FFD875",
            "description": "Primary 400"
        },
        "300": {
            "type": "color",
            "value": "#FFE39B",
            "description": "Primary 300"
        },
        "200": {
            "type": "color",
            "value": "#FFF0C4",
            "description": "Primary 200"
        },
        "100": {
            "type": "color",
            "value": "#FFF8E3",
            "description": "Primary 100"
        }
    },
    "neutral": {
        "900": {
            "type": "color",
            "value": "#181716",
            "description": "Neutral 900"
        },
        "800": {
            "type": "color",
            "value": "#2B2726",
            "description": "Neutral 800"
        },
        "700": {
            "type": "color",
            "value": "#3F3937",
            "description": "Neutral 700"
        },
        "600": {
            "type": "color",
            "value": "#595452",
            "description": "Neutral 600"
        },
        "500": {
            "type": "color",
            "value": "#736E6B",
            "description": "Neutral 500"
        },
        "400": {
            "type": "color",
            "value": "#8D8885",
            "description": "Neutral 400"
        },
        "300": {
            "type": "color",
            "value": "#A7A3A0",
            "description": "Neutral 300"
        },
        "200": {
            "type": "color",
            "value": "#C1BDBA",
            "description": "Neutral 200"
        },
        "100": {
            "type": "color",
            "value": "#DBD8D5",
            "description": "Neutral 100"
        }
    },
    "secondary": {
        "900": {
            "type": "color",
            "value": "#08343B",
            "description": "Secondary 900"
        },
        "800": {
            "type": "color",
            "value": "#0F4A54",
            "description": "Secondary 800"
        },
        "700": {
            "type": "color",
            "value": "#176270",
            "description": "Secondary 700"
        },
        "600": {
            "type": "color",
            "value": "#2C7F8D",
            "description": "Secondary 600"
        },
        "500": {
            "type": "color",
            "value": "#9ED2DB",
            "description": "Secondary 500"
        },
        "400": {
            "type": "color",
            "value": "#B7DEE3",
            "description": "Secondary 400"
        },
        "300": {
            "type": "color",
            "value": "#CFE9ED",
            "description": "Secondary 300"
        },
        "200": {
            "type": "color",
            "value": "#E3F3F6",
            "description": "Secondary 200"
        },
        "100": {
            "type": "color",
            "value": "#F4FBFC",
            "description": "Secondary 100"
        }
    }
}

# Replace the colors section
tokens['colors'] = new_colors

# Write the updated tokens back to file with proper formatting
with open('enfineitz-figma.tokens.json', 'w') as f:
    json.dump(tokens, f, indent=2, ensure_ascii=False)

print("✓ Updated color palette successfully!")
print(f"  - Primary: {len(new_colors['primary'])} shades")
print(f"  - Neutral: {len(new_colors['neutral'])} shades")
print(f"  - Secondary: {len(new_colors['secondary'])} shades")
