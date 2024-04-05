# comments-converter
Convert YouTube Live Stream Comments to JSON

## Setup
1. Clone the repository.
```bash
git clone (this git URL)
```
2. Run the following command:
```bash
npm install
```

## Usage
1. Paste comments from YouTube Live Stream's web extension into the src/input/input.txt file.
2. Run the following command:
```bash
node src/index.js
```
The comments will be converted to JSON format and saved as src/output/output.json.


## Testing
1. Run the following:
```
npm test
```