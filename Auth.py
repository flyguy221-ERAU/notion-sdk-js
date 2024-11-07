import requests
import json

NOTION_API_TOKEN = <Token>
DATABASE_ID = <DBID>

url = f"https://api.notion.com/v1/databases/{DATABASE_ID}"

headers = {
    "Authorization": f"Bearer {NOTION_API_TOKEN}",
    "Notion-Version": "2022-06-28"  # Make sure you use the correct version
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = response.json()
    properties = data['properties']
    print(json.dumps(properties, indent=4))
else:
    print(f"Error: {response.status_code}")
